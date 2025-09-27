// components/employee/UpcomingAppointments.jsx
import { CalendarIcon, ClockIcon, UserIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

const UpcomingAppointments = ({ appointments, onQuickAction, isLoading }) => {
  const getTimeUntilAppointment = (dateTime) => {
    const now = new Date();
    const appointmentDate = new Date(dateTime);
    const diffMs = appointmentDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return `In ${Math.ceil(diffDays / 7)} weeks`;
  };

  const sortedAppointments = appointments
    .sort((a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime))
    .slice(0, 5); // Show only next 5 appointments

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <ClockIcon className="h-6 w-6 mr-2" />
          Upcoming Appointments
        </h2>
        <button
          onClick={() => window.location.href = '/employee/appointments'}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
        >
          View All
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" text="Loading upcoming appointments..." />
          </div>
        ) : sortedAppointments.length > 0 ? (
          <div className="space-y-3">
            {sortedAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                onClick={() => window.location.href = `/employee/appointments/${appointment._id}`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {appointment.property?.title || 'Property Viewing'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.contactInfo?.name} • {getTimeUntilAppointment(appointment.scheduledDateTime)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(appointment.scheduledDateTime, { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(appointment.scheduledDateTime).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No upcoming appointments
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              New appointments will appear here when they're assigned to you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;