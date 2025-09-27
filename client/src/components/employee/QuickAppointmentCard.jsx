// components/employee/QuickAppointmentCard.jsx
import { useState } from 'react';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon as SolidClockIcon } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';
import { formatDate, formatRelativeTime } from '../../utils/helpers';

const QuickAppointmentCard = ({ 
  appointment, 
  onQuickAction, 
  onViewDetails, 
  showActions = true,
  compact = false 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', title: '', message: '' });
  const [imageError, setImageError] = useState(false);

  if (!appointment) return null;

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        icon: <SolidClockIcon className="h-4 w-4" />,
        label: 'Pending',
        priority: 'high'
      },
      confirmed: {
        color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
        icon: <CheckCircleIcon className="h-4 w-4" />,
        label: 'Confirmed',
        priority: 'medium'
      },
      completed: {
        color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        icon: <CheckIcon className="h-4 w-4" />,
        label: 'Completed',
        priority: 'low'
      },
      cancelled: {
        color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
        icon: <XMarkIcon className="h-4 w-4" />,
        label: 'Cancelled',
        priority: 'low'
      },
      rescheduled: {
        color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        icon: <CalendarIcon className="h-4 w-4" />,
        label: 'Rescheduled',
        priority: 'medium'
      },
      'no-show': {
        color: 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800',
        icon: <ExclamationTriangleIcon className="h-4 w-4" />,
        label: 'No Show',
        priority: 'low'
      }
    };
    return configs[status] || configs.pending;
  };

  const getUrgencyLevel = () => {
    const appointmentTime = new Date(appointment.scheduledDateTime);
    const now = new Date();
    const diffHours = (appointmentTime - now) / (1000 * 60 * 60);
    
    if (diffHours < 1 && diffHours > 0) return 'critical'; // Less than 1 hour
    if (diffHours < 3 && diffHours > 0) return 'high'; // Less than 3 hours
    if (diffHours < 24 && diffHours > 0) return 'medium'; // Less than 24 hours
    return 'normal';
  };

  const getTimeDisplay = () => {
    const appointmentTime = new Date(appointment.scheduledDateTime);
    const now = new Date();
    const diffMs = appointmentTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMs < 0) {
      return { text: 'Past appointment', type: 'past' };
    } else if (diffHours < 1) {
      const minutes = Math.ceil(diffMs / (1000 * 60));
      return { text: `In ${minutes} min`, type: 'critical' };
    } else if (diffHours < 24) {
      return { text: `In ${Math.ceil(diffHours)}h`, type: 'today' };
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', type: 'tomorrow' };
    } else {
      return { text: `In ${diffDays} days`, type: 'future' };
    }
  };

  const handleQuickAction = (action) => {
    setShowMenu(false);
    
    const actions = {
      confirm: {
        title: 'Confirm Appointment',
        message: `Confirm the appointment with ${appointment.contactInfo?.name}?`,
        confirmText: 'Confirm',
        action: 'confirmed'
      },
      complete: {
        title: 'Mark as Completed',
        message: `Mark this appointment as completed?`,
        confirmText: 'Complete',
        action: 'completed'
      },
      cancel: {
        title: 'Cancel Appointment',
        message: `Are you sure you want to cancel this appointment? This action cannot be undone.`,
        confirmText: 'Cancel',
        confirmVariant: 'danger',
        action: 'cancelled'
      },
      'no-show': {
        title: 'Mark as No-Show',
        message: `Mark this appointment as no-show? The customer did not attend.`,
        confirmText: 'No Show',
        confirmVariant: 'danger',
        action: 'no-show'
      }
    };

    setConfirmAction({
      show: true,
      type: action,
      ...actions[action]
    });
  };

  const handleConfirmAction = () => {
    const { action } = confirmAction;
    onQuickAction(appointment._id, action);
    setConfirmAction({ show: false, type: '', title: '', message: '' });
  };

  const statusConfig = getStatusConfig(appointment.status);
  const timeDisplay = getTimeDisplay();
  const urgencyLevel = getUrgencyLevel();

  const canConfirm = appointment.status === 'pending';
  const canComplete = appointment.status === 'confirmed' && new Date(appointment.scheduledDateTime) <= new Date();
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  const canMarkNoShow = appointment.status === 'confirmed' && new Date(appointment.scheduledDateTime) < new Date();

  const propertyImage = appointment.property?.media?.images?.find(img => img.isMain)?.url || 
                       appointment.property?.media?.images?.[0]?.url;

  const cardClasses = `
    relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md
    ${urgencyLevel === 'critical' ? 'border-red-300 dark:border-red-600 ring-1 ring-red-200 dark:ring-red-800' : 
      urgencyLevel === 'high' ? 'border-orange-300 dark:border-orange-600' : 
      'border-gray-200 dark:border-gray-700'}
    ${compact ? 'p-4' : 'p-5'}
  `;

  return (
    <>
      <div className={cardClasses}>
        {/* Urgency indicator */}
        {urgencyLevel === 'critical' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            {/* Property Image */}
            {!compact && (
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                {propertyImage && !imageError ? (
                  <img
                    src={propertyImage}
                    alt={appointment.property?.title}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            )}

            {/* Title and Status */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-gray-900 dark:text-gray-100 truncate ${compact ? 'text-sm' : 'text-base'}`}>
                {appointment.property?.title || 'Property Viewing'}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}>
                  {statusConfig.icon}
                  <span className="ml-1">{statusConfig.label}</span>
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  timeDisplay.type === 'critical' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                  timeDisplay.type === 'today' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {timeDisplay.text}
                </span>
              </div>
            </div>
          </div>

          {/* More Actions Menu */}
          {showActions && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-40">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onViewDetails && onViewDetails(appointment);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  {canConfirm && (
                    <button
                      onClick={() => handleQuickAction('confirm')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Confirm
                    </button>
                  )}
                  
                  {canComplete && (
                    <button
                      onClick={() => handleQuickAction('complete')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Complete
                    </button>
                  )}

                  {canMarkNoShow && (
                    <button
                      onClick={() => handleQuickAction('no-show')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                      No Show
                    </button>
                  )}

                  {canCancel && (
                    <button
                      onClick={() => handleQuickAction('cancel')}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                    >
                      <XMarkIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Appointment Details */}
        <div className="space-y-2">
          {/* Date and Time */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>
                {formatDate(appointment.scheduledDateTime, { 
                  month: 'short', 
                  day: 'numeric',
                  weekday: compact ? undefined : 'short'
                })}
              </span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>
                {new Date(appointment.scheduledDateTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="text-gray-500 dark:text-gray-500 text-xs">
              {Math.round((appointment.duration || 60) / 60)}h
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex items-center space-x-2 text-sm">
            <UserIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {appointment.contactInfo?.name || 'Unknown Customer'}
            </span>
          </div>

          {/* Location */}
          {!compact && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPinIcon className="h-4 w-4" />
              <span className="truncate">
                {appointment.meetingDetails?.address || 
                 appointment.property?.propertyDetails?.location?.city || 
                 'Property location'}
              </span>
            </div>
          )}
        </div>

        {/* Contact Actions */}
        {!compact && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {appointment.contactInfo?.phone && (
                <button
                  onClick={() => window.open(`tel:${appointment.contactInfo.phone}`)}
                  className="p-2 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  title="Call customer"
                >
                  <PhoneIcon className="h-4 w-4" />
                </button>
              )}
              
              {appointment.contactInfo?.email && (
                <button
                  onClick={() => window.open(`mailto:${appointment.contactInfo.email}`)}
                  className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  title="Email customer"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => console.log('Open chat with customer')}
                className="p-2 text-gray-400 hover:text-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                title="Message customer"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Action Buttons */}
            {showActions && (
              <div className="flex items-center space-x-2">
                {canConfirm && (
                  <Button
                    size="sm"
                    onClick={() => handleQuickAction('confirm')}
                    leftIcon={<CheckIcon className="h-3 w-3" />}
                    className="text-xs px-2 py-1"
                  >
                    Confirm
                  </Button>
                )}
                
                {canComplete && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAction('complete')}
                    leftIcon={<CheckIcon className="h-3 w-3" />}
                    className="text-xs px-2 py-1"
                  >
                    Complete
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetails && onViewDetails(appointment)}
                  leftIcon={<EyeIcon className="h-3 w-3" />}
                  className="text-xs px-2 py-1"
                >
                  View
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Notes Preview */}
        {(appointment.customerNotes || appointment.employeeNotes) && !compact && (
          <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
            <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
              <span className="font-medium">Notes: </span>
              {appointment.customerNotes || appointment.employeeNotes}
            </p>
          </div>
        )}

        {/* Appointment Number */}
        {appointment.appointmentNumber && (
          <div className="absolute top-2 right-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
            #{appointment.appointmentNumber.slice(-6)}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmAction.show}
        onClose={() => setConfirmAction({ show: false, type: '', title: '', message: '' })}
        onConfirm={handleConfirmAction}
        title={confirmAction.title}
        message={confirmAction.message}
        confirmText={confirmAction.confirmText}
        confirmVariant={confirmAction.confirmVariant || 'primary'}
      />
    </>
  );
};

export default QuickAppointmentCard;