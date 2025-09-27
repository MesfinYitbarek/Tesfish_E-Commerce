// pages/dashboard/Bookings.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  UserPlusIcon,
  BuildingOfficeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import {
  getMyAppointments,
  getMyAssignments, // ✅ Employee assignments
  getAdminOverview, // ✅ Admin overview
  updateAppointmentStatus,
  reassignAppointment, // ✅ Reassignment
  exportAppointmentsCSV,
  getAvailableEmployees, // ✅ Get employees
  selectMyAppointments,
  selectMyAssignments, // ✅ Employee assignments
  selectAdminOverview, // ✅ Admin overview
  selectIsLoadingAppointments,
  selectAppointmentError,
  selectAvailableEmployees, // ✅ Available employees
  selectDepartmentStats, // ✅ Department stats
  updateFilters,
  selectAppointmentFilters
} from '../../store/slices/appointmentSlice';
import BookingCard from '../../components/dashboard/BookingCard';
import BookingCalendar from '../../components/dashboard/BookingCalendar';
import BookingDetailsModal from '../../components/dashboard/BookingDetailsModal';
import ReassignModal from '../../components/dashboard/ReassignModal'; // ✅ New modal
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const Bookings = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  
  // ✅ Updated selectors based on user type
  const customerAppointments = useSelector(selectMyAppointments);
  const employeeAssignments = useSelector(selectMyAssignments);
  const adminOverview = useSelector(selectAdminOverview);
  const availableEmployees = useSelector(selectAvailableEmployees);
  const departmentStats = useSelector(selectDepartmentStats);
  
  const isLoading = useSelector(selectIsLoadingAppointments);
  const error = useSelector(selectAppointmentError);
  const filters = useSelector(selectAppointmentFilters);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReassignModal, setShowReassignModal] = useState(false); // ✅ Reassign modal
  const [viewMode, setViewMode] = useState('list'); // list, calendar
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Determine user type and appropriate data
  const isAdmin = user?.userType === 'admin';
  const isEmployee = user?.userType === 'employee';
  const isCustomer = user?.userType === 'customer';
  
  // ✅ Get appropriate appointments based on user type
  const appointments = isAdmin ? adminOverview : 
                      isEmployee ? employeeAssignments : 
                      isCustomer ? customerAppointments : [];

  console.log('User:', user);
  console.log('Is Admin:', isAdmin);
  console.log('Is Employee:', isEmployee);
  console.log('Is Customer:', isCustomer);
  console.log('Appointments:', appointments);

  // ✅ Department options
  const departments = [
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'interior-design', label: 'Interior Design' },
    { value: 'project-management', label: 'Project Management' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' }
  ];

  useEffect(() => {
    if (user) {
      // ✅ Load appointments based on user type
      if (isAdmin) {
        dispatch(getAdminOverview({
          status: filters.status === 'all' ? undefined : filters.status,
          assignedTo: filters.assignedTo,
          department: filters.department,
          date: filters.date,
          upcoming: filters.upcoming
        }));
        // Load employees for assignment
        dispatch(getAvailableEmployees());
      } else if (isEmployee) {
        dispatch(getMyAssignments({
          status: filters.status === 'all' ? undefined : filters.status,
          date: filters.date,
          upcoming: filters.upcoming
        }));
      } else if (isCustomer) {
        dispatch(getMyAppointments({
          status: filters.status === 'all' ? undefined : filters.status,
          upcoming: filters.upcoming,
          past: filters.past
        }));
      }
    }
  }, [dispatch, user, isAdmin, isEmployee, isCustomer, filters]);

  const handleStatusChange = async (appointmentId, newStatus, additionalData = {}) => {
    try {
      await dispatch(updateAppointmentStatus({
        appointmentId,
        statusData: { 
          status: newStatus,
          ...additionalData
        }
      })).unwrap();
      
      // Reload appointments based on user type
      if (isAdmin) {
        dispatch(getAdminOverview({
          status: filters.status === 'all' ? undefined : filters.status,
          assignedTo: filters.assignedTo,
          department: filters.department
        }));
      } else if (isEmployee) {
        dispatch(getMyAssignments({
          status: filters.status === 'all' ? undefined : filters.status
        }));
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  // ✅ Handle reassignment (admin only)
  const handleReassign = async (appointmentId, employeeId, reason) => {
    try {
      await dispatch(reassignAppointment({
        appointmentId,
        assignmentData: { employeeId, reason }
      })).unwrap();
      
      // Reload admin overview
      dispatch(getAdminOverview({
        status: filters.status === 'all' ? undefined : filters.status,
        assignedTo: filters.assignedTo,
        department: filters.department
      }));
      
      setShowReassignModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error reassigning appointment:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    dispatch(updateFilters(newFilters));
  };

  const handleExportCSV = async () => {
    try {
      await dispatch(exportAppointmentsCSV()).unwrap();
    } catch (error) {
      toast.error('Failed to export appointments');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const customerName = appointment.contactInfo?.name?.toLowerCase() || 
                          `${appointment.customer?.customerProfile?.firstName || ''} ${appointment.customer?.customerProfile?.lastName || ''}`.toLowerCase();
      const propertyTitle = appointment.property?.title?.toLowerCase() || '';
      const location = appointment.property?.propertyDetails?.location?.street?.toLowerCase() || '';
      const appointmentNumber = appointment.appointmentNumber?.toLowerCase() || '';
      
      // ✅ For admin/employee, also search by assigned employee
      let employeeName = '';
      if (isAdmin || isEmployee) {
        employeeName = `${appointment.assignedTo?.employeeProfile?.firstName || ''} ${appointment.assignedTo?.employeeProfile?.lastName || ''}`.toLowerCase();
      }
      
      if (!customerName.includes(searchLower) && 
          !propertyTitle.includes(searchLower) && 
          !location.includes(searchLower) &&
          !appointmentNumber.includes(searchLower) &&
          !employeeName.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  const getStatusCounts = () => {
    return {
      all: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      rescheduled: appointments.filter(a => a.status === 'rescheduled').length,
      'no-show': appointments.filter(a => a.status === 'no-show').length
    };
  };

  const statusCounts = getStatusCounts();

  const statusFilters = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'pending', label: 'Pending', count: statusCounts.pending },
    { key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
    { key: 'completed', label: 'Completed', count: statusCounts.completed },
    { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
    { key: 'rescheduled', label: 'Rescheduled', count: statusCounts.rescheduled },
    { key: 'no-show', label: 'No Show', count: statusCounts['no-show'] }
  ];

  // ✅ Show different content based on user type
  if (!isAdmin && !isEmployee && !isCustomer) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Appointment management is available for admins, employees, and customers only.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <XMarkIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Appointments
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isAdmin ? 'Appointment Overview' : 
             isEmployee ? 'My Assignments' : 
             'My Appointments'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isAdmin 
              ? 'Manage all property viewing appointments and employee assignments'
              : isEmployee
              ? 'Track and manage your assigned appointments'
              : 'Track your property viewing appointments'
            }
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Admin Actions */}
          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
              >
                Export CSV
              </Button>
            </>
          )}

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Stats Cards (Admin/Employee) */}
      {(isAdmin || isEmployee) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {appointments.filter(a => {
                    const appointmentDate = new Date(a.scheduledDateTime).toDateString();
                    const today = new Date().toDateString();
                    return appointmentDate === today && ['pending', 'confirmed'].includes(a.status);
                  }).length}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statusCounts.pending}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statusCounts.confirmed}
                </p>
              </div>
              <CheckIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isAdmin ? 'Departments' : 'Completed'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isAdmin ? departmentStats.length : statusCounts.completed}
                </p>
              </div>
              {isAdmin ? (
                <BuildingOfficeIcon className="h-8 w-8 text-purple-500" />
              ) : (
                <CheckIcon className="h-8 w-8 text-blue-500" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statusFilters.map(status => (
            <button
              key={status.key}
              onClick={() => handleFilterChange({ status: status.key })}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filters.status === status.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {status.label}
              {status.count > 0 && (
                <span className="ml-2">({status.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Search and Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder={isAdmin 
                ? "Search by customer, property, employee, appointment #..." 
                : isEmployee
                ? "Search by customer, property, appointment #..."
                : "Search by property or location..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>

          {/* ✅ Admin Filters */}
          {isAdmin && (
            <>
              <select
                value={filters.assignedTo || ''}
                onChange={(e) => handleFilterChange({ assignedTo: e.target.value || null })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Employees</option>
                {availableEmployees.map(employee => (
                  <option key={employee._id} value={employee._id}>
                    {employee.employeeProfile?.firstName} {employee.employeeProfile?.lastName} - {employee.employeeProfile?.department}
                  </option>
                ))}
              </select>

              <select
                value={filters.department || ''}
                onChange={(e) => handleFilterChange({ department: e.target.value || null })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* ✅ Employee/Customer Time Filters */}
          {(isEmployee || isCustomer) && (
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.upcoming}
                  onChange={(e) => handleFilterChange({ 
                    upcoming: e.target.checked,
                    past: false // Reset past filter when upcoming is selected
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Upcoming only
                </span>
              </label>
              
              {isCustomer && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.past}
                    onChange={(e) => handleFilterChange({ 
                      past: e.target.checked,
                      upcoming: false // Reset upcoming filter when past is selected
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Past appointments
                  </span>
                </label>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        {viewMode === 'list' ? (
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" text="Loading appointments..." />
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map(appointment => (
                  <BookingCard
                    key={appointment._id}
                    booking={{
                      appointment: appointment,
                      id: appointment._id,
                      service: {
                        id: appointment.property?._id,
                        title: appointment.property?.title || 'Property',
                        type: 'property',
                        image: appointment.property?.media?.images?.[0]?.url || '/api/placeholder/60/60'
                      },
                      customer: {
                        id: appointment.customer?._id,
                        name: appointment.contactInfo?.name || 
                              `${appointment.customer?.customerProfile?.firstName || ''} ${appointment.customer?.customerProfile?.lastName || ''}`.trim(),
                        email: appointment.contactInfo?.email || appointment.customer?.email,
                        phone: appointment.contactInfo?.phone || appointment.customer?.phone,
                        avatar: appointment.customer?.avatar
                      },
                      // ✅ Updated for employee assignment
                      assignedEmployee: (isAdmin || isCustomer) ? {
                        id: appointment.assignedTo?._id,
                        name: `${appointment.assignedTo?.employeeProfile?.firstName || ''} ${appointment.assignedTo?.employeeProfile?.lastName || ''}`.trim(),
                        email: appointment.assignedTo?.email,
                        department: appointment.assignedTo?.employeeProfile?.department
                      } : null,
                      date: new Date(appointment.scheduledDateTime),
                      time: new Date(appointment.scheduledDateTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }),
                      duration: appointment.duration / 60, // Convert minutes to hours
                      status: appointment.status,
                      amount: 0, // Appointments don't have amounts
                      paymentStatus: 'not-applicable',
                      notes: appointment.customerNotes || appointment.employeeNotes,
                      location: appointment.meetingDetails?.address || 
                               appointment.property?.propertyDetails?.location?.street || 
                               'Property location',
                      createdAt: new Date(appointment.createdAt),
                      requirements: appointment.requirements || [],
                      appointmentNumber: appointment.appointmentNumber,
                      appointmentType: appointment.appointmentType,
                      assignedDepartment: appointment.assignedDepartment
                    }}
                    onStatusChange={handleStatusChange}
                    onViewDetails={setSelectedBooking}
                    onReassign={isAdmin ? () => {
                      setSelectedBooking(appointment);
                      setShowReassignModal(true);
                    } : null}
                    userType={user?.userType} // ✅ Pass user type
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No appointments found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filters.status === 'all' 
                    ? isAdmin
                      ? 'No appointments have been booked yet.'
                      : isEmployee
                      ? 'No appointments have been assigned to you yet.'
                      : 'You haven\'t booked any appointments yet. Browse properties and schedule viewings.'
                    : `No ${filters.status} appointments found. Try adjusting your filters.`
                  }
                </p>
                {isCustomer && filters.status === 'all' && (
                  <Button
                    onClick={() => window.location.href = '/properties'}
                    className="mt-4"
                  >
                    Browse Properties
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <BookingCalendar 
            bookings={filteredAppointments.map(appointment => ({
              id: appointment._id,
              scheduledDateTime: appointment.scheduledDateTime,
              service: {
                title: appointment.property?.title || 'Property'
              },
              customer: {
                name: appointment.contactInfo?.name || 
                      `${appointment.customer?.customerProfile?.firstName || ''} ${appointment.customer?.customerProfile?.lastName || ''}`.trim()
              },
              // ✅ Add assigned employee for admin/customer view
              assignedEmployee: (isAdmin || isCustomer) ? {
                name: `${appointment.assignedTo?.employeeProfile?.firstName || ''} ${appointment.assignedTo?.employeeProfile?.lastName || ''}`.trim(),
                department: appointment.assignedTo?.employeeProfile?.department
              } : null,
              date: new Date(appointment.scheduledDateTime),
              time: new Date(appointment.scheduledDateTime).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              status: appointment.status,
              amount: 0,
              property: appointment.property,
              contactInfo: appointment.contactInfo,
              duration: appointment.duration,
              appointmentType: appointment.appointmentType,
              meetingDetails: appointment.meetingDetails,
              customerNotes: appointment.customerNotes,
              employeeNotes: appointment.employeeNotes,
              requirements: appointment.requirements,
              createdAt: appointment.createdAt,
              appointmentNumber: appointment.appointmentNumber,
              assignedDepartment: appointment.assignedDepartment
            }))}
            onBookingSelect={(booking) => {
              const appointment = filteredAppointments.find(a => a._id === booking.id);
              setSelectedBooking(appointment);
            }}
            isLoading={isLoading}
            userType={user?.userType} // ✅ Pass user type
          />
        )}
      </div>

      {/* ✅ Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={{
            appointment: selectedBooking,
            id: selectedBooking._id,
            service: {
              id: selectedBooking.property?._id,
              title: selectedBooking.property?.title || 'Property',
              type: 'property',
              image: selectedBooking.property?.media?.images?.[0]?.url || '/api/placeholder/60/60'
            },
            customer: {
              id: selectedBooking.customer?._id,
              name: selectedBooking.contactInfo?.name || 
                    `${selectedBooking.customer?.customerProfile?.firstName || ''} ${selectedBooking.customer?.customerProfile?.lastName || ''}`.trim(),
              email: selectedBooking.contactInfo?.email || selectedBooking.customer?.email,
              phone: selectedBooking.contactInfo?.phone || selectedBooking.customer?.phone,
              avatar: selectedBooking.customer?.avatar
            },
            assignedEmployee: selectedBooking.assignedTo,
            propertyOwner: selectedBooking.property?.seller,
            date: new Date(selectedBooking.scheduledDateTime),
            time: new Date(selectedBooking.scheduledDateTime).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            duration: selectedBooking.duration / 60,
            status: selectedBooking.status,
            amount: 0,
            paymentStatus: 'not-applicable',
            notes: selectedBooking.customerNotes || selectedBooking.employeeNotes,
            location: selectedBooking.meetingDetails?.address || 
                     selectedBooking.property?.propertyDetails?.location?.street || 
                     'Property location',
            createdAt: new Date(selectedBooking.createdAt),
            requirements: selectedBooking.requirements || [],
            appointmentNumber: selectedBooking.appointmentNumber,
            appointmentType: selectedBooking.appointmentType,
            meetingDetails: selectedBooking.meetingDetails,
            customerNotes: selectedBooking.customerNotes,
            employeeNotes: selectedBooking.employeeNotes,
            adminNotes: selectedBooking.adminNotes,
            outcome: selectedBooking.outcome,
            reschedulingHistory: selectedBooking.reschedulingHistory,
            confirmedAt: selectedBooking.confirmedAt,
            completedAt: selectedBooking.completedAt,
            cancelledAt: selectedBooking.cancelledAt,
            assignedDepartment: selectedBooking.assignedDepartment
          }}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          onReassign={isAdmin ? () => setShowReassignModal(true) : null}
          userType={user?.userType}
        />
      )}

      {/* ✅ Reassign Modal (Admin only) */}
      {isAdmin && showReassignModal && selectedBooking && (
        <ReassignModal
          appointment={selectedBooking}
          employees={availableEmployees}
          onClose={() => {
            setShowReassignModal(false);
            setSelectedBooking(null);
          }}
          onReassign={handleReassign}
        />
      )}
    </div>
  );
};

export default Bookings;