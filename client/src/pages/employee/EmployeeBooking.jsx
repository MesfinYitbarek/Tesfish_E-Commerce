import { useState, useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BellIcon,
  CogIcon,
  EyeIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
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
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import QuickAppointmentCard from '../../components/employee/QuickAppointmentCard';
import EmployeeStatsCard from '../../components/employee/EmployeeStatsCard';
import TodaySchedule from '../../components/employee/TodaySchedule';
import UpcomingAppointments from '../../components/employee/UpcomingAppointments';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const EmployeeBooking = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Add proper null checking and default values
  const myAssignments = useSelector(selectMyAssignments) || [];
  const isLoading = useSelector(selectIsLoadingAppointments);
  const error = useSelector(selectAppointmentError);
  const stats = useSelector(selectAppointmentStats) || {};

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user?.userType === 'employee') {
      // Load employee assignments
      dispatch(getMyAssignments({
        upcoming: true
      }));
      
      // Load employee stats
      dispatch(getAppointmentStats());
    }
  }, [dispatch, user]);

  // Calculate today's appointments with null checking
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));
  
  const todayAppointments = Array.isArray(myAssignments) ? myAssignments.filter(appointment => {
    if (!appointment?.scheduledDateTime) return false;
    const appointmentDate = new Date(appointment.scheduledDateTime);
    return appointmentDate >= todayStart && appointmentDate <= todayEnd;
  }) : [];

  // Calculate upcoming appointments (next 7 days) with null checking
  const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const upcomingAppointments = Array.isArray(myAssignments) ? myAssignments.filter(appointment => {
    if (!appointment?.scheduledDateTime) return false;
    const appointmentDate = new Date(appointment.scheduledDateTime);
    return appointmentDate > new Date() && appointmentDate <= weekEnd;
  }) : [];

  // Get next appointment with null checking
  const nextAppointment = Array.isArray(myAssignments) 
    ? myAssignments
        .filter(appointment => appointment?.scheduledDateTime && new Date(appointment.scheduledDateTime) > new Date())
        .sort((a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime))[0]
    : null;

  // Calculate employee performance metrics with null checking
  const performanceMetrics = {
    totalAssignments: myAssignments.length || 0,
    completed: myAssignments.filter(a => a?.status === 'completed').length || 0,
    pending: myAssignments.filter(a => a?.status === 'pending').length || 0,
    confirmed: myAssignments.filter(a => a?.status === 'confirmed').length || 0,
    cancelled: myAssignments.filter(a => a?.status === 'cancelled').length || 0,
    noShow: myAssignments.filter(a => a?.status === 'no-show').length || 0,
    completionRate: myAssignments.length > 0 
      ? Math.round((myAssignments.filter(a => a?.status === 'completed').length / myAssignments.length) * 100)
      : 0
  };

  const handleQuickAction = async (appointmentId, action) => {
    if (!appointmentId) return;
    
    try {
      await dispatch(updateAppointmentStatus({
        appointmentId,
        statusData: { status: action }
      })).unwrap();
      
      // Reload assignments
      dispatch(getMyAssignments({ upcoming: true }));
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDepartmentDisplayName = (department) => {
    if (!department) return 'No Department';
    
    const departmentNames = {
      'real-estate': 'Real Estate',
      'interior-design': 'Interior Design',
      'project-management': 'Project Management',
      'engineering': 'Engineering',
      'marketing': 'Marketing',
      'sales': 'Sales',
      'finance': 'Finance',
      'hr': 'Human Resources',
      'admin': 'Administration',
      'it': 'IT',
      'operations': 'Operations'
    };
    return departmentNames[department] || department;
  };

  // Early return if user is not an employee
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

  // Show loading state
  if (isLoading && (!myAssignments || myAssignments.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Dashboard
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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {getGreeting()}, {user.employeeProfile?.firstName || user.fullName?.split(' ')[0] || 'Employee'}!
              </h1>
              <p className="text-blue-100 mt-1">
                {user.employeeProfile?.position || 'Employee'} • {getDepartmentDisplayName(user.employeeProfile?.department)}
              </p>
              <p className="text-blue-200 text-sm mt-1">
                You have {todayAppointments.length} appointments today
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors relative"
            >
              <BellIcon className="h-6 w-6" />
              {todayAppointments.filter(a => a?.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {todayAppointments.filter(a => a?.status === 'pending').length}
                </span>
              )}
            </button>
            
            <Button
              variant="outline"
              className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-opacity-30"
              leftIcon={<CogIcon className="h-4 w-4" />}
              onClick={() => window.location.href = '/employee/settings'}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EmployeeStatsCard
          title="Today's Appointments"
          value={todayAppointments.length}
          change={`${todayAppointments.filter(a => a?.status && ['pending', 'confirmed'].includes(a.status)).length} active`}
          changeType="neutral"
          icon={<CalendarIcon className="h-6 w-6" />}
          color="blue"
        />
        
        <EmployeeStatsCard
          title="This Week"
          value={upcomingAppointments.length}
          change={`${upcomingAppointments.filter(a => a?.status === 'confirmed').length} confirmed`}
          changeType="positive"
          icon={<ClockIcon className="h-6 w-6" />}
          color="green"
        />
        
        <EmployeeStatsCard
          title="Completion Rate"
          value={`${performanceMetrics.completionRate}%`}
          change={`${performanceMetrics.completed} completed`}
          changeType={performanceMetrics.completionRate >= 80 ? "positive" : "negative"}
          icon={<ChartBarIcon className="h-6 w-6" />}
          color="purple"
        />
        
        <EmployeeStatsCard
          title="Pending Actions"
          value={performanceMetrics.pending}
          change={`${performanceMetrics.confirmed} confirmed`}
          changeType={performanceMetrics.pending > 5 ? "negative" : "neutral"}
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Next Appointment Alert */}
      {nextAppointment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Next Appointment Coming Up
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                <span className="font-semibold">{nextAppointment.property?.title || 'Property Visit'}</span> with{' '}
                <span className="font-semibold">{nextAppointment.contactInfo?.name || 'Client'}</span>
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                {nextAppointment.scheduledDateTime && formatDate(nextAppointment.scheduledDateTime, { 
                  weekday: 'long',
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {nextAppointment.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => handleQuickAction(nextAppointment._id, 'confirmed')}
                  leftIcon={<CheckIcon className="h-4 w-4" />}
                >
                  Confirm
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.href = `/employee/appointments/${nextAppointment._id}`}
                leftIcon={<EyeIcon className="h-4 w-4" />}
              >
                View
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <TodaySchedule
            appointments={todayAppointments}
            onQuickAction={handleQuickAction}
            isLoading={isLoading}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                leftIcon={<CalendarIcon className="h-4 w-4" />}
                rightIcon={<ChevronRightIcon className="h-4 w-4" />}
                onClick={() => window.location.href = '/employee/appointments'}
              >
                View All Appointments
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                leftIcon={<ChartBarIcon className="h-4 w-4" />}
                rightIcon={<ChevronRightIcon className="h-4 w-4" />}
                onClick={() => window.location.href = '/employee/analytics'}
              >
                Performance Analytics
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                leftIcon={<DocumentTextIcon className="h-4 w-4" />}
                rightIcon={<ChevronRightIcon className="h-4 w-4" />}
                onClick={() => window.location.href = '/employee/reports'}
              >
                Generate Report
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                leftIcon={<UsersIcon className="h-4 w-4" />}
                rightIcon={<ChevronRightIcon className="h-4 w-4" />}
                onClick={() => window.location.href = '/employee/customers'}
              >
                Customer Database
              </Button>
            </div>
          </div>

          {/* Department Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2" />
              Department Info
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {getDepartmentDisplayName(user.employeeProfile?.department)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user.employeeProfile?.position || 'Employee'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Employee ID</p>
                <p className="font-medium text-gray-900 dark:text-gray-100 font-mono">
                  {user._id ? user._id.slice(-8).toUpperCase() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Started</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user.createdAt ? formatDate(user.createdAt, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-gray-100">{user.email || 'No email available'}</span>
              </div>
              {user.employeeProfile?.phone && (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">{user.employeeProfile.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <UpcomingAppointments
        appointments={upcomingAppointments}
        onQuickAction={handleQuickAction}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EmployeeBooking;