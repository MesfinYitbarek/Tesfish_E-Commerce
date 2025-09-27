// pages/employee/AppointmentManagement.jsx
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
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ListBulletIcon,
  Squares2X2Icon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getMyAssignments,
  updateAppointmentStatus,
  getAppointmentStats,
  selectMyAssignments,
  selectIsLoadingAppointments,
  selectAppointmentError,
  selectAppointmentStats
} from '../../store/slices/appointmentSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import QuickAppointmentCard from '../../components/employee/QuickAppointmentCard';
import AppointmentDetailsModal from '../../components/employee/AppointmentDetailsModal';
import BulkActionsModal from '../../components/employee/BulkActionsModal';
import AppointmentCalendarView from '../../components/employee/AppointmentCalendarView';
import EmployeePerformanceWidget from '../../components/employee/EmployeePerformanceWidget';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const AppointmentManagement = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  
  const myAssignments = useSelector(selectMyAssignments);
  const isLoading = useSelector(selectIsLoadingAppointments);
  const error = useSelector(selectAppointmentError);
  const stats = useSelector(selectAppointmentStats);

  // Local state for filters instead of Redux
  const [filters, setFilters] = useState({
    status: 'all',
    upcoming: false,
    appointmentType: '',
    location: '',
    sortBy: 'date-asc'
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // list, grid, calendar
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('all'); // today, week, month, all

  useEffect(() => {
    if (user?.userType === 'employee') {
      loadAppointments();
      dispatch(getAppointmentStats());
    }
  }, [dispatch, user, filters, dateRange]);

  const loadAppointments = () => {
    const params = {
      status: filters.status === 'all' ? undefined : filters.status,
      upcoming: filters.upcoming,
      date: getDateFilterValue()
    };

    dispatch(getMyAssignments(params));
  };

  const getDateFilterValue = () => {
    const today = new Date();
    switch (dateRange) {
      case 'today':
        return today.toISOString().split('T')[0];
      case 'week':
        return 'upcoming';
      case 'month':
        return 'upcoming';
      default:
        return undefined;
    }
  };

  const handleStatusChange = async (appointmentId, newStatus, additionalData = {}) => {
    try {
      await dispatch(updateAppointmentStatus({
        appointmentId,
        statusData: { 
          status: newStatus,
          notes: additionalData.notes || '',
          ...additionalData
        }
      })).unwrap();
      
      loadAppointments();
      toast.success(`Appointment ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const handleBulkAction = async (action, appointmentIds, additionalData = {}) => {
    try {
      const promises = appointmentIds.map(id => 
        dispatch(updateAppointmentStatus({
          appointmentId: id,
          statusData: { 
            status: action,
            notes: additionalData.notes || '',
            ...additionalData
          }
        })).unwrap()
      );

      await Promise.all(promises);
      setSelectedAppointments([]);
      setShowBulkActions(false);
      loadAppointments();
      toast.success(`${appointmentIds.length} appointments updated successfully`);
    } catch (error) {
      toast.error('Failed to update some appointments');
    }
  };

  // Local filter handling
  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      upcoming: false,
      appointmentType: '',
      location: '',
      sortBy: 'date-asc'
    });
    setSearchQuery('');
    setDateRange('all');
    toast.success('Filters cleared');
  };

  const handleSelectAppointment = (appointmentId, selected) => {
    if (selected) {
      setSelectedAppointments([...selectedAppointments, appointmentId]);
    } else {
      setSelectedAppointments(selectedAppointments.filter(id => id !== appointmentId));
    }
  };

  const handleSelectAll = () => {
    if (selectedAppointments.length === filteredAppointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(filteredAppointments.map(apt => apt._id));
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Time', 'Property', 'Customer', 'Phone', 'Email', 'Status', 'Location'].join(','),
      ...filteredAppointments.map(apt => [
        formatDate(apt.scheduledDateTime, { year: 'numeric', month: 'short', day: 'numeric' }),
        new Date(apt.scheduledDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        `"${apt.property?.title || 'N/A'}"`,
        `"${apt.contactInfo?.name || 'N/A'}"`,
        apt.contactInfo?.phone || 'N/A',
        apt.contactInfo?.email || 'N/A',
        apt.status,
        `"${apt.meetingDetails?.address || apt.property?.propertyDetails?.location?.city || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `my-appointments-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success('Appointments exported successfully');
  };

  // Filter appointments based on search and filters
  const filteredAppointments = myAssignments.filter(appointment => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const customerName = appointment.contactInfo?.name?.toLowerCase() || '';
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

    // Status filter
    if (filters.status !== 'all' && appointment.status !== filters.status) {
      return false;
    }

    // Appointment type filter
    if (filters.appointmentType && appointment.appointmentType !== filters.appointmentType) {
      return false;
    }

    // Location filter
    if (filters.location && appointment.meetingDetails?.location !== filters.location) {
      return false;
    }

    // Date range filter
    const appointmentDate = new Date(appointment.scheduledDateTime);
    const now = new Date();
    
    switch (dateRange) {
      case 'today':
        const today = new Date();
        return appointmentDate.toDateString() === today.toDateString();
      case 'week':
        const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        return appointmentDate >= now && appointmentDate <= weekEnd;
      case 'month':
        const monthEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return appointmentDate >= now && appointmentDate <= monthEnd;
      default:
        return true;
    }
  }).sort((a, b) => {
    // Sort appointments based on sortBy filter
    switch (filters.sortBy) {
      case 'date-asc':
        return new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime);
      case 'date-desc':
        return new Date(b.scheduledDateTime) - new Date(a.scheduledDateTime);
      case 'created-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime);
    }
  });

  const getStatusCounts = () => {
    return {
      all: filteredAppointments.length,
      pending: filteredAppointments.filter(a => a.status === 'pending').length,
      confirmed: filteredAppointments.filter(a => a.status === 'confirmed').length,
      completed: filteredAppointments.filter(a => a.status === 'completed').length,
      cancelled: filteredAppointments.filter(a => a.status === 'cancelled').length,
      rescheduled: filteredAppointments.filter(a => a.status === 'rescheduled').length,
      'no-show': filteredAppointments.filter(a => a.status === 'no-show').length
    };
  };

  const statusCounts = getStatusCounts();

  const statusFilters = [
    { key: 'all', label: 'All', count: statusCounts.all, color: 'gray' },
    { key: 'pending', label: 'Pending', count: statusCounts.pending, color: 'yellow' },
    { key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed, color: 'green' },
    { key: 'completed', label: 'Completed', count: statusCounts.completed, color: 'blue' },
    { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled, color: 'red' },
    { key: 'rescheduled', label: 'Rescheduled', count: statusCounts.rescheduled, color: 'purple' },
    { key: 'no-show', label: 'No Show', count: statusCounts['no-show'], color: 'gray' }
  ];

  const dateRangeOptions = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' }
  ];

  const appointmentTypeOptions = [
    { key: '', label: 'All Types' },
    { key: 'property-viewing', label: 'Property Viewing' },
    { key: 'consultation', label: 'Consultation' },
    { key: 'property-evaluation', label: 'Property Evaluation' },
    { key: 'contract-discussion', label: 'Contract Discussion' }
  ];

  const locationOptions = [
    { key: '', label: 'All Locations' },
    { key: 'property-site', label: 'Property Site' },
    { key: 'office', label: 'Office' },
    { key: 'online', label: 'Online' },
    { key: 'customer-location', label: 'Customer Location' }
  ];

  const sortOptions = [
    { key: 'date-asc', label: 'Date (Earliest First)' },
    { key: 'date-desc', label: 'Date (Latest First)' },
    { key: 'created-desc', label: 'Recently Created' },
    { key: 'status', label: 'Status' }
  ];

  if (!user || user.userType !== 'employee') {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Employee Access Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This page is only accessible to employees.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Appointments
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => loadAppointments()}>
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
            My Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your assigned property viewings and customer appointments
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Bulk Actions */}
          {selectedAppointments.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkActions(true)}
              leftIcon={<CheckIcon className="h-4 w-4" />}
            >
              Bulk Actions ({selectedAppointments.length})
            </Button>
          )}

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
          >
            Export CSV
          </Button>

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
              <ListBulletIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Performance Widget */}
      <EmployeePerformanceWidget 
        stats={stats}
        appointments={myAssignments}
        isLoading={isLoading}
      />

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

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by customer, property, appointment #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {dateRangeOptions.map(option => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<FunnelIcon className="h-4 w-4" />}
            >
              More Filters
            </Button>
            
            {(filters.status !== 'all' || searchQuery || dateRange !== 'all' || filters.appointmentType || filters.location) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Appointment Type
                  </label>
                  <select 
                    value={filters.appointmentType}
                    onChange={(e) => handleFilterChange({ appointmentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    {appointmentTypeOptions.map(option => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Location
                  </label>
                  <select 
                    value={filters.location}
                    onChange={(e) => handleFilterChange({ location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    {locationOptions.map(option => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select 
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        {viewMode === 'calendar' ? (
          <AppointmentCalendarView
            appointments={filteredAppointments}
            onAppointmentSelect={(appointment) => {
              setSelectedAppointment(appointment);
              setShowDetailsModal(true);
            }}
            onStatusChange={handleStatusChange}
            isLoading={isLoading}
            selectedDate={new Date()}
            onDateChange={(date) => {
              // Handle date change if needed
              console.log('Date changed to:', date);
            }}
          />
        ) : (
          <div className="p-6">
            {/* Bulk Selection Header */}
            {filteredAppointments.length > 0 && (
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedAppointments.length === filteredAppointments.length && filteredAppointments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAppointments.length > 0 
                      ? `${selectedAppointments.length} selected`
                      : `${filteredAppointments.length} appointments`
                    }
                  </span>
                </div>

                {selectedAppointments.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setShowBulkActions(true)}
                      leftIcon={<CheckIcon className="h-4 w-4" />}
                    >
                      Bulk Actions
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Appointments List/Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" text="Loading appointments..." />
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-4'
              }>
                {filteredAppointments.map(appointment => (
                  <div key={appointment._id} className="relative">
                    <QuickAppointmentCard
                      appointment={appointment}
                      onQuickAction={handleStatusChange}
                      onViewDetails={(apt) => {
                        setSelectedAppointment(apt);
                        setShowDetailsModal(true);
                      }}
                      compact={viewMode === 'grid'}
                      showActions={true}
                      isSelected={selectedAppointments.includes(appointment._id)}
                      onSelect={handleSelectAppointment}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No appointments found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery || filters.status !== 'all' || dateRange !== 'all' || filters.appointmentType || filters.location
                    ? 'No appointments match your current filters. Try adjusting your search criteria.'
                    : 'You don\'t have any appointments assigned yet. New appointments will appear here when they\'re assigned to you.'
                  }
                </p>
                {(searchQuery || filters.status !== 'all' || dateRange !== 'all' || filters.appointmentType || filters.location) && (
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAppointment(null);
          }}
          onStatusChange={handleStatusChange}
          userType="employee"
        />
      )}

      {/* Bulk Actions Modal */}
      {showBulkActions && (
        <BulkActionsModal
          selectedAppointments={selectedAppointments}
          appointments={filteredAppointments.filter(apt => selectedAppointments.includes(apt._id))}
          isOpen={showBulkActions}
          onClose={() => setShowBulkActions(false)}
          onBulkAction={handleBulkAction}
        />
      )}
    </div>
  );
};

export default AppointmentManagement;