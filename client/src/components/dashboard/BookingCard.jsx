import { useState } from 'react';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { formatDate, formatCurrency, formatRelativeTime } from '../../utils/helpers';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';

const BookingCard = ({ booking, onStatusChange, onViewDetails }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', title: '', message: '' });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      confirmed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      completed: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
    };
    return colors[status] || colors.pending;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'text-green-600 dark:text-green-400',
      pending: 'text-yellow-600 dark:text-yellow-400',
      refunded: 'text-blue-600 dark:text-blue-400',
      failed: 'text-red-600 dark:text-red-400'
    };
    return colors[status] || colors.pending;
  };

  const handleStatusAction = (action) => {
    setShowMenu(false);
    
    const actions = {
      confirm: {
        title: 'Confirm Booking',
        message: `Confirm the booking with ${booking.customer.name}?`,
        confirmText: 'Confirm',
        newStatus: 'confirmed'
      },
      complete: {
        title: 'Mark as Completed',
        message: `Mark this booking as completed?`,
        confirmText: 'Complete',
        newStatus: 'completed'
      },
      cancel: {
        title: 'Cancel Booking',
        message: `Are you sure you want to cancel this booking with ${booking.customer.name}? This action cannot be undone.`,
        confirmText: 'Cancel Booking',
        confirmVariant: 'danger',
        newStatus: 'cancelled'
      }
    };

    setConfirmAction({
      show: true,
      type: action,
      ...actions[action]
    });
  };

  const handleConfirmAction = () => {
    const { type, newStatus } = confirmAction;
    onStatusChange(booking.id, newStatus);
    setConfirmAction({ show: false, type: '', title: '', message: '' });
  };

  const getTimeUntilBooking = () => {
    const now = new Date();
    const bookingDateTime = new Date(booking.date);
    const diffMs = bookingDateTime - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  const canConfirm = booking.status === 'pending';
  const canComplete = booking.status === 'confirmed' && new Date(booking.date) <= new Date();
  const canCancel = ['pending', 'confirmed'].includes(booking.status);

  return (
    <>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
        <div className="flex items-start justify-between mb-4">
          {/* Service and Customer Info */}
          <div className="flex items-start space-x-4 flex-1">
            <img
              src={booking.service.image}
              alt={booking.service.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {booking.service.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <div className="flex items-center">
                      {booking.customer.avatar ? (
                        <img
                          src={booking.customer.avatar}
                          alt={booking.customer.name}
                          className="w-5 h-5 rounded-full object-cover mr-2"
                        />
                      ) : (
                        <UserIcon className="h-5 w-5 mr-2" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {booking.customer.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{formatDate(booking.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{booking.time} ({booking.duration}h)</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="truncate max-w-xs">{booking.location}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(booking.amount, 'ETB')}
                      </span>
                      <span className={`ml-2 text-xs ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        ({booking.paymentStatus})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center space-x-3 ml-4">
                  {/* Status Badge */}
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>

                  {/* Time Until Booking */}
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {getTimeUntilBooking()}
                  </span>

                  {/* Quick Actions */}
                  <div className="flex items-center space-x-1">
                    {canConfirm && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusAction('confirm')}
                        leftIcon={<CheckIcon className="h-4 w-4" />}
                      >
                        Confirm
                      </Button>
                    )}
                    
                    {canComplete && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusAction('complete')}
                        leftIcon={<CheckIcon className="h-4 w-4" />}
                      >
                        Complete
                      </Button>
                    )}

                    {/* Contact Actions */}
                    <button
                      onClick={() => window.open(`tel:${booking.customer.phone}`)}
                      className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                      title="Call customer"
                    >
                      <PhoneIcon className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => console.log('Open chat with', booking.customer.name)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Message customer"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onViewDetails(booking)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="View details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>

                    {/* More Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </button>

                      {showMenu && (
                        <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-32">
                          {canConfirm && (
                            <button
                              onClick={() => handleStatusAction('confirm')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <CheckIcon className="h-4 w-4 mr-2" />
                              Confirm
                            </button>
                          )}
                          
                          {canComplete && (
                            <button
                              onClick={() => handleStatusAction('complete')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <CheckIcon className="h-4 w-4 mr-2" />
                              Mark Complete
                            </button>
                          )}

                          {canCancel && (
                            <button
                              onClick={() => handleStatusAction('cancel')}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                            >
                              <XMarkIcon className="h-4 w-4 mr-2" />
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Notes: </span>
              {booking.notes}
            </p>
          </div>
        )}

        {/* Requirements */}
        {booking.requirements && booking.requirements.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {booking.requirements.map((req, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Booked {formatRelativeTime(booking.createdAt)}</span>
          <span>ID: {booking.id}</span>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
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

export default BookingCard;