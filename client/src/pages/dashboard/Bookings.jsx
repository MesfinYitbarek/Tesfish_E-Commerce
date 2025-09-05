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
  UserPlusIcon
} from '@heroicons/react/24/outline';
import {
  getAdminAppointments, // Updated from getSellerAppointments
  getMyAppointments,
  updateAppointmentStatus,
  exportAppointmentsCSV,
  selectAdminAppointments, // Updated from selectSellerAppointments
  selectMyAppointments,
  selectIsLoadingAppointments,
  selectAppointmentError,
  selectPropertyOwners,
  updateFilters,
  selectAppointmentFilters
} from '../../store/slices/appointmentSlice';
import BookingCard from '../../components/dashboard/BookingCard';
import BookingCalendar from '../../components/dashboard/BookingCalendar';
import BookingDetailsModal from '../../components/dashboard/BookingDetailsModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const Bookings = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const adminAppointments = useSelector(selectAdminAppointments); // Updated
  const customerAppointments = useSelector(selectMyAppointments);
  const propertyOwners = useSelector(selectPropertyOwners);
  const isLoading = useSelector(selectIsLoadingAppointments);
  const error = useSelector(selectAppointmentError);
  const filters = useSelector(selectAppointmentFilters);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, calendar
  const [searchQuery, setSearchQuery] = useState('');

  // Only admins can manage appointments now
  const isAdmin = user?.userType === 'admin';
  const isCustomer = user?.userType === 'customer';
  const appointments = isAdmin ? adminAppointments : customerAppointments;

  console.log('User:', user);
  console.log('Is Admin:', isAdmin);
  console.log('Appointments:', appointments);

  useEffect(() => {
    if (user) {
      // Load appointments based on user type
      if (isAdmin) {
        dispatch(getAdminAppointments({ // Updated from getSellerAppointments
          status: filters.status === 'all' ? undefined : filters.status,
          date: filters.date,
          property: filters.property,
          propertyOwner: filters.propertyOwner,
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
  }, [dispatch, user, isAdmin, isCustomer, filters]);

  const handleStatusChange = async (appointmentId, newStatus, additionalData = {}) => {
    try {
      await dispatch(updateAppointmentStatus({
        appointmentId,
        statusData: { 
          status: newStatus,
          ...additionalData
        }
      })).unwrap();
      
      // Reload appointments
      if (isAdmin) {
        dispatch(getAdminAppointments({
          status: filters.status === 'all' ? undefined : filters.status,
          propertyOwner: filters.propertyOwner
        }));
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
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
      
      if (!customerName.includes(searchLower) && 
          !propertyTitle.includes(searchLower) && 
          !location.includes(searchLower) &&
          !appointmentNumber.includes(searchLower)) {
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

  // Show different content based on user type
  if (!isAdmin && !isCustomer) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Appointment management is available for admins and customers only.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Property owners will be notified about appointments but management is handled by our admin team.
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
            {isAdmin ? 'Appointment Management' : 'My Appointments'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isAdmin 
              ? 'Manage property viewing appointments from customers'
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
                ? "Search by customer, property, appointment #..." 
                : "Search by property or location..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>

          {/* Admin Filters */}
          {isAdmin && (
            <>
              <select
                value={filters.propertyOwner || ''}
                onChange={(e) => handleFilterChange({ propertyOwner: e.target.value || null })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Property Owners</option>
                {propertyOwners.map(owner => (
                  <option key={owner._id} value={owner._id}>
                    {owner.ownerDetails?.companyProfile?.companyName || 
                     `${owner.ownerDetails?.individualProfile?.firstName} ${owner.ownerDetails?.individualProfile?.lastName}`}
                    ({owner.appointmentCount} appointments)
                  </option>
                ))}
              </select>

              <select
                value={filters.date || ''}
                onChange={(e) => handleFilterChange({ date: e.target.value || null })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Dates</option>
                <option value={new Date().toISOString().split('T')[0]}>Today</option>
                <option value={new Date(Date.now() + 86400000).toISOString().split('T')[0]}>Tomorrow</option>
                <option value="upcoming">Upcoming Only</option>
              </select>
            </>
          )}

          {/* Customer Filters */}
          {isCustomer && (
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
                      propertyOwner: isAdmin ? {
                        id: appointment.property?.seller?._id,
                        name: appointment.property?.seller?.companyProfile?.companyName ||
                              `${appointment.property?.seller?.individualProfile?.firstName || ''} ${appointment.property?.seller?.individualProfile?.lastName || ''}`.trim(),
                        email: appointment.property?.seller?.email
                      } : null,
                      assignedAdmin: isCustomer ? {
                        id: appointment.seller?._id,
                        name: appointment.seller?.companyProfile?.companyName ||
                              `${appointment.seller?.individualProfile?.firstName || ''} ${appointment.seller?.individualProfile?.lastName || ''}`.trim(),
                        email: appointment.seller?.email
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
                      notes: appointment.customerNotes || appointment.sellerNotes,
                      location: appointment.meetingDetails?.address || 
                               appointment.property?.propertyDetails?.location?.street || 
                               'Property location',
                      createdAt: new Date(appointment.createdAt),
                      requirements: appointment.requirements || [],
                      appointmentNumber: appointment.appointmentNumber
                    }}
                    onStatusChange={handleStatusChange}
                    onViewDetails={setSelectedBooking}
                    isAdmin={isAdmin}
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
                      ? 'No appointments assigned yet. Customers will book appointments and they will be assigned to available admins.'
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
              sellerNotes: appointment.sellerNotes,
              requirements: appointment.requirements,
              createdAt: appointment.createdAt,
              appointmentNumber: appointment.appointmentNumber
            }))}
            onBookingSelect={(booking) => {
              const appointment = filteredAppointments.find(a => a._id === booking.id);
              setSelectedBooking(appointment);
            }}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Booking Details Modal */}
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
            seller: selectedBooking.seller,
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
            notes: selectedBooking.customerNotes || selectedBooking.sellerNotes,
            location: selectedBooking.meetingDetails?.address || 
                     selectedBooking.property?.propertyDetails?.location?.street || 
                     'Property location',
            createdAt: new Date(selectedBooking.createdAt),
            requirements: selectedBooking.requirements || [],
            appointmentNumber: selectedBooking.appointmentNumber,
            appointmentType: selectedBooking.appointmentType,
            meetingDetails: selectedBooking.meetingDetails,
            customerNotes: selectedBooking.customerNotes,
            sellerNotes: selectedBooking.sellerNotes,
            adminNotes: selectedBooking.adminNotes,
            outcome: selectedBooking.outcome,
            reschedulingHistory: selectedBooking.reschedulingHistory,
            confirmedAt: selectedBooking.confirmedAt,
            completedAt: selectedBooking.completedAt,
            cancelledAt: selectedBooking.cancelledAt
          }}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default Bookings;