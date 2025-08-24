import { useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import { formatRelativeTime } from '../../utils/helpers';

const ConsultationManagement = ({ inquiry, isAdmin, onSchedule }) => {
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);

  const consultation = inquiry?.consultation;

  const getLocationIcon = (location) => {
    const icons = {
      online: VideoCameraIcon,
      office: BuildingOfficeIcon,
      'site-visit': MapPinIcon,
      'client-location': UserIcon
    };
    return icons[location] || MapPinIcon;
  };

  const getLocationLabel = (location) => {
    const labels = {
      online: 'Online Meeting',
      office: 'Office Visit',
      'site-visit': 'Site Visit',
      'client-location': 'Client Location'
    };
    return labels[location] || location;
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      rescheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
    };
    return colors[status] || colors.scheduled;
  };

  const isUpcoming = () => {
    if (!consultation?.dateTime) return false;
    return new Date(consultation.dateTime) > new Date();
  };

  const isPast = () => {
    if (!consultation?.dateTime) return false;
    return new Date(consultation.dateTime) < new Date();
  };

  if (!consultation?.scheduled) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Consultation Scheduled
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isAdmin 
              ? "You haven't scheduled a consultation for this inquiry yet."
              : "No consultation has been scheduled for your inquiry yet."
            }
          </p>
          {isAdmin && (
            <Button onClick={onSchedule} leftIcon={<CalendarIcon className="h-4 w-4" />}>
              Schedule Consultation
            </Button>
          )}
        </div>
      </div>
    );
  }

  const LocationIcon = getLocationIcon(consultation.location);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Consultation Details
        </h3>
        {isAdmin && isUpcoming() && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRescheduleForm(true)}
              leftIcon={<PencilIcon className="h-4 w-4" />}
            >
              Reschedule
            </Button>
            <Button
              size="sm"
              onClick={onSchedule}
              leftIcon={<CalendarIcon className="h-4 w-4" />}
            >
              Edit Details
            </Button>
          </div>
        )}
      </div>

      {/* Consultation Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <LocationIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {getLocationLabel(consultation.location)}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {consultation.duration} minutes
              </p>
            </div>
          </div>
          
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(consultation.status)}`}>
            {consultation.status || 'scheduled'}
          </span>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(consultation.dateTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatRelativeTime(consultation.dateTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(consultation.dateTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {consultation.duration} minute session
              </p>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="mb-6">
          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Location Details</h5>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {consultation.location === 'online' && consultation.meetingLink && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Meeting Link:</p>
                <a
                  href={consultation.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline break-all"
                >
                  {consultation.meetingLink}
                </a>
              </div>
            )}
            {consultation.location === 'office' && (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p>TesGold Services Office</p>
                <p>123 Business District, Addis Ababa</p>
                <p>Ethiopia</p>
              </div>
            )}
            {consultation.location === 'site-visit' && (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p>Project Site Visit</p>
                <p>{inquiry.projectDetails.location.address || inquiry.projectDetails.location.city}</p>
              </div>
            )}
            {consultation.location === 'client-location' && (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p>Client's Preferred Location</p>
                <p>Address to be confirmed separately</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {consultation.notes && (
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Notes</h5>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {consultation.notes}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          {consultation.location === 'online' && consultation.meetingLink && isUpcoming() && (
            <Button
              onClick={() => window.open(consultation.meetingLink, '_blank')}
              leftIcon={<VideoCameraIcon className="h-4 w-4" />}
            >
              Join Meeting
            </Button>
          )}
          
          {isUpcoming() && (
            <Button
              variant="outline"
              onClick={() => {
                const event = {
                  title: `Consultation - ${inquiry.projectDetails.title}`,
                  start: new Date(consultation.dateTime),
                  end: new Date(new Date(consultation.dateTime).getTime() + consultation.duration * 60000),
                  description: consultation.notes || 'Service consultation',
                  location: consultation.location === 'online' ? consultation.meetingLink : getLocationLabel(consultation.location)
                };
                
                // Create calendar invite URL
                const startTime = event.start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const endTime = event.end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
                
                window.open(calendarUrl, '_blank');
              }}
              leftIcon={<CalendarIcon className="h-4 w-4" />}
            >
              Add to Calendar
            </Button>
          )}
          
          {isAdmin && isUpcoming() && (
            <Button
              variant="outline"
              onClick={() => {
                // Mark as completed or cancelled
                console.log('Update consultation status');
              }}
              leftIcon={<CheckCircleIcon className="h-4 w-4" />}
            >
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Consultation Timeline</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Consultation Scheduled
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(consultation.createdAt || inquiry.updatedAt)}
              </p>
            </div>
          </div>
          
          {consultation.status === 'completed' && (
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Consultation Completed
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(consultation.completedAt)}
                </p>
              </div>
            </div>
          )}
          
          {consultation.status === 'cancelled' && (
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Consultation Cancelled
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(consultation.cancelledAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preparation Tips */}
      {isUpcoming() && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Preparation Tips</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Review project requirements and gather any relevant documents</li>
            <li>• Prepare questions about timeline, budget, and implementation</li>
            <li>• Have project location details and site access information ready</li>
            {consultation.location === 'online' && (
              <li>• Test your video/audio connection 15 minutes before the meeting</li>
            )}
            {consultation.location === 'site-visit' && (
              <li>• Ensure site access and safety requirements are met</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConsultationManagement;