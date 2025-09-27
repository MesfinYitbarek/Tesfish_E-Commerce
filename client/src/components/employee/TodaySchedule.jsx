// components/employee/TodaySchedule.jsx
import { CalendarIcon, ClockIcon, UserIcon, MapPinIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

const TodaySchedule = ({ appointments, onQuickAction, isLoading }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      confirmed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      completed: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
      cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
      'no-show': 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300'
    };
    return colors[status] || colors.pending;
  };

  const sortedAppointments = appointments.sort((a, b) => 
    new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <CalendarIcon className="h-6 w-6 mr-2" />
          Today's Schedule
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" text="Loading today's schedule..." />
          </div>
        ) : sortedAppointments.length > 0 ? (
          <div className="space-y-4">
            {sortedAppointments.map((appointment, index) => (
              <div key={appointment._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Time and Status */}
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span className="font-medium">
                          {new Date(appointment.scheduledDateTime).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    {/* Property and Customer */}
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {appointment.property?.title || 'Property Viewing'}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span>{appointment.contactInfo?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="truncate max-w-xs">
                          {appointment.meetingDetails?.address || appointment.property?.propertyDetails?.location?.city || 'Property location'}
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-500">
                      <span>📞 {appointment.contactInfo?.phone}</span>
                      <span>✉️ {appointment.contactInfo?.email}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {appointment.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => onQuickAction(appointment._id, 'confirmed')}
                        leftIcon={<CheckIcon className="h-4 w-4" />}
                      >
                        Confirm
                      </Button>
                    )}
                    
                    {appointment.status === 'confirmed' && new Date(appointment.scheduledDateTime) <= new Date() && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onQuickAction(appointment._id, 'completed')}
                        leftIcon={<CheckIcon className="h-4 w-4" />}
                      >
                        Complete
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.location.href = `/employee/appointments/${appointment._id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Notes */}
                {(appointment.customerNotes || appointment.employeeNotes) && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Notes: </span>
                      {appointment.customerNotes || appointment.employeeNotes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No appointments today
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enjoy your free day! Check back tomorrow for new assignments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaySchedule;