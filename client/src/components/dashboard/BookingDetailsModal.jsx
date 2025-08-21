import { useState } from 'react';
import { 
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckIcon,
  XMarkIcon as CancelIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { formatDate, formatCurrency, formatRelativeTime } from '../../utils/helpers';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';

const BookingDetailsModal = ({ booking, onClose, onStatusChange }) => {
  const [activeTab, setActiveTab] = useState('details'); // details, customer, notes
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', title: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState(booking.notes || '');

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
    const { newStatus } = confirmAction;
    onStatusChange(booking.id, newStatus);
    setConfirmAction({ show: false, type: '', title: '', message: '' });
    onClose();
  };

  const handleSaveNotes = () => {
    // In real app, save notes to backend
    console.log('Saving notes:', editNotes);
    setIsEditing(false);
  };

  const canConfirm = booking.status === 'pending';
  const canComplete = booking.status === 'confirmed' && new Date(booking.date) <= new Date();
  const canCancel = ['pending', 'confirmed'].includes(booking.status);

  const tabs = [
    { id: 'details', label: 'Details', icon: DocumentTextIcon },
    { id: 'customer', label: 'Customer', icon: UserIcon },
    { id: 'notes', label: 'Notes', icon: PencilIcon }
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <img
                  src={booking.service.image}
                  alt={booking.service.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {booking.service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Booking #{booking.id}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Booking Info */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Date & Time
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(booking.date, { 
                              weekday: 'long',
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {booking.time} ({booking.duration} hours)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Payment
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(booking.amount, 'ETB')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                          <span className={`text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Location
                    </h4>
                    <div className="flex items-start space-x-2">
                      <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {booking.location}
                      </span>
                    </div>
                  </div>

                  {/* Requirements */}
                  {booking.requirements && booking.requirements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Requirements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {booking.requirements.map((req, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Timeline
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Booked:</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {formatRelativeTime(booking.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Service date:</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {formatRelativeTime(booking.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customer' && (
                <div className="space-y-6">
                  {/* Customer Profile */}
                  <div className="flex items-center space-x-4">
                    {booking.customer.avatar ? (
                      <img
                        src={booking.customer.avatar}
                        alt={booking.customer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {booking.customer.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Contact Information
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <PhoneIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{booking.customer.phone}</p>
                        </div>
                        <button
                          onClick={() => window.open(`tel:${booking.customer.phone}`)}
                          className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <EnvelopeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{booking.customer.email}</p>
                        </div>
                        <button
                          onClick={() => window.open(`mailto:${booking.customer.email}`)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <EnvelopeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Customer History */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Customer History
                    </h5>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">3</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Total Bookings</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">2</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">5.0</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Avg Rating</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Booking Notes
                    </h4>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-1 text-sm text-primary-500 hover:text-primary-600"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Add notes about this booking..."
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false);
                            setEditNotes(booking.notes || '');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveNotes}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      {booking.notes ? (
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {booking.notes}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No notes added yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => console.log('Open chat with', booking.customer.name)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>Message</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                {canCancel && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusAction('cancel')}
                    leftIcon={<CancelIcon className="h-4 w-4" />}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                )}
                
                {canConfirm && (
                  <Button
                    onClick={() => handleStatusAction('confirm')}
                    leftIcon={<CheckIcon className="h-4 w-4" />}
                  >
                    Confirm
                  </Button>
                )}
                
                {canComplete && (
                  <Button
                    onClick={() => handleStatusAction('complete')}
                    leftIcon={<CheckIcon className="h-4 w-4" />}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default BookingDetailsModal;