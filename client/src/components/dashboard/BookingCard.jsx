// components/dashboard/BookingCard.jsx
import { useState, useMemo } from 'react';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  PhotoIcon,
  ArrowPathIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';

const BookingCard = ({ booking, onStatusChange, onViewDetails, onReassign, userType }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', title: '', message: '' });
  const [imageError, setImageError] = useState(false);

  // Memoize appointment data to prevent recalculation
  const appointmentData = useMemo(() => booking.appointment || booking, [booking]);
  
  const bookingData = useMemo(() => ({
    id: appointmentData._id || appointmentData.id,
    appointmentNumber: appointmentData.appointmentNumber,
    property: appointmentData.property,
    customer: {
      id: appointmentData.customer?._id,
      name: appointmentData.contactInfo?.name || 
            `${appointmentData.customer?.firstName || ''} ${appointmentData.customer?.lastName || ''}`.trim(),
      email: appointmentData.contactInfo?.email || appointmentData.customer?.email,
      phone: appointmentData.contactInfo?.phone || appointmentData.customer?.phone,
      avatar: appointmentData.customer?.avatar
    },
    // ✅ Assigned employee info
    assignedEmployee: appointmentData.assignedTo ? {
      id: appointmentData.assignedTo._id,
      name: `${appointmentData.assignedTo.employeeProfile?.firstName || ''} ${appointmentData.assignedTo.employeeProfile?.lastName || ''}`.trim(),
      email: appointmentData.assignedTo.email,
      department: appointmentData.assignedTo.employeeProfile?.department,
      position: appointmentData.assignedTo.employeeProfile?.position
    } : null,
    scheduledDateTime: appointmentData.scheduledDateTime,
    duration: appointmentData.duration || 60,
    status: appointmentData.status,
    appointmentType: appointmentData.appointmentType,
    assignedDepartment: appointmentData.assignedDepartment,
    meetingDetails: appointmentData.meetingDetails,
    customerNotes: appointmentData.customerNotes,
    employeeNotes: appointmentData.employeeNotes, // ✅ Changed from sellerNotes
    createdAt: appointmentData.createdAt,
    requirements: appointmentData.requirements || []
  }), [appointmentData]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      confirmed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      completed: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
      rescheduled: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      'no-show': 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const handleStatusAction = (action) => {
    setShowMenu(false);
    
    const actions = {
      confirm: {
        title: 'Confirm Appointment',
        message: `Confirm the appointment with ${bookingData.customer.name}?`,
        confirmText: 'Confirm',
        newStatus: 'confirmed'
      },
      complete: {
        title: 'Mark as Completed',
        message: `Mark this appointment as completed?`,
        confirmText: 'Complete',
        newStatus: 'completed'
      },
      cancel: {
        title: 'Cancel Appointment',
        message: `Are you sure you want to cancel this appointment with ${bookingData.customer.name}? This action cannot be undone.`,
        confirmText: 'Cancel Appointment',
        confirmVariant: 'danger',
        newStatus: 'cancelled'
      },
      'no-show': {
        title: 'Mark as No-Show',
        message: `Mark this appointment as no-show? The customer did not attend.`,
        confirmText: 'Mark No-Show',
        confirmVariant: 'danger',
        newStatus: 'no-show'
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
    onStatusChange(bookingData.id, newStatus);
    setConfirmAction({ show: false, type: '', title: '', message: '' });
  };

  const getTimeUntilAppointment = () => {
    const now = new Date();
    const appointmentDateTime = new Date(bookingData.scheduledDateTime);
    const diffMs = appointmentDateTime - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMs < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return `In ${Math.ceil(diffDays / 7)} weeks`;
  };

  // ✅ Updated permission checks based on user type
  const canManage = userType === 'admin' || userType === 'employee';
  const canConfirm = bookingData.status === 'pending' && canManage;
  const canComplete = bookingData.status === 'confirmed' && canManage && new Date(bookingData.scheduledDateTime) <= new Date();
  const canCancel = ['pending', 'confirmed'].includes(bookingData.status);
  const canMarkNoShow = bookingData.status === 'confirmed' && canManage && new Date(bookingData.scheduledDateTime) < new Date();
  const canReassign = userType === 'admin' && onReassign && ['pending', 'confirmed'].includes(bookingData.status);

  // Memoize image URL to prevent recalculation
  const propertyImage = useMemo(() => {
    if (imageError) return null;
    
    return bookingData.property?.media?.images?.find(img => img.isMain)?.url || 
           bookingData.property?.media?.images?.[0]?.url || 
           booking.service?.image ||
           null;
  }, [bookingData.property, booking.service, imageError]);

  const propertyLocation = useMemo(() => {
    return bookingData.meetingDetails?.address || 
           bookingData.property?.propertyDetails?.location?.address || 
           bookingData.property?.propertyDetails?.location?.city ||
           'Property location';
  }, [bookingData]);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
        <div className="flex items-start justify-between mb-4">
          {/* Property and Customer Info */}
          <div className="flex items-start space-x-4 flex-1">
            {/* Property Image */}
            <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
              {propertyImage && !imageError ? (
                <img
                  src={propertyImage}
                  alt={bookingData.property?.title || 'Property'}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {bookingData.property?.title || 'Property Viewing'}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <div className="flex items-center">
                      {bookingData.customer.avatar ? (
                        <img
                          src={bookingData.customer.avatar}
                          alt={bookingData.customer.name}
                          className="w-5 h-5 rounded-full object-cover mr-2"
                          loading="lazy"
                        />
                      ) : (
                        <UserIcon className="h-5 w-5 mr-2" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {bookingData.customer.name || 'Unknown Customer'}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(bookingData.scheduledDateTime, { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(bookingData.scheduledDateTime).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} ({Math.round(bookingData.duration / 60)}h)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="truncate max-w-xs">{propertyLocation}</span>
                    </div>
                    
                    {bookingData.appointmentType && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        {bookingData.appointmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    )}

                    {/* ✅ Show assigned employee for admin/customer */}
                    {(userType === 'admin' || userType === 'customer') && bookingData.assignedEmployee && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                        <span className="text-xs">
                          {bookingData.assignedEmployee.name} ({bookingData.assignedEmployee.department})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center space-x-3 ml-4">
                  {/* Status Badge */}
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(bookingData.status)}`}>
                    {bookingData.status.charAt(0).toUpperCase() + bookingData.status.slice(1).replace('-', ' ')}
                  </span>

                  {/* Time Until Appointment */}
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {getTimeUntilAppointment()}
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

                    {/* ✅ Reassign button for admin */}
                    {canReassign && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReassign()}
                        leftIcon={<ArrowPathIcon className="h-4 w-4" />}
                      >
                        Reassign
                      </Button>
                    )}

                    {/* Contact Actions */}
                    {canManage && bookingData.customer.phone && (
                      <button
                        onClick={() => window.open(`tel:${bookingData.customer.phone}`)}
                        className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                        title="Call customer"
                      >
                        <PhoneIcon className="h-4 w-4" />
                      </button>
                    )}

                    {canManage && bookingData.customer.email && (
                      <button
                        onClick={() => window.open(`mailto:${bookingData.customer.email}`)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Email customer"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onViewDetails && onViewDetails(appointmentData)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="View details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>

                    {/* More Actions Menu */}
                    {canManage && (
                      <div className="relative">
                        <button
                          onClick={() => setShowMenu(!showMenu)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>

                        {showMenu && (
                          <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-40">
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

                            {canMarkNoShow && (
                              <button
                                onClick={() => handleStatusAction('no-show')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                              >
                                <XMarkIcon className="h-4 w-4 mr-2" />
                                Mark No-Show
                              </button>
                            )}

                            {canReassign && (
                              <button
                                onClick={() => {
                                  setShowMenu(false);
                                  onReassign();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                              >
                                <ArrowPathIcon className="h-4 w-4 mr-2" />
                                Reassign
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {(bookingData.customerNotes || bookingData.employeeNotes) && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Notes: </span>
              {bookingData.customerNotes || bookingData.employeeNotes}
            </p>
          </div>
        )}

        {/* Requirements */}
        {bookingData.requirements && bookingData.requirements.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {bookingData.requirements.map((req, index) => (
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
          <span>Booked {formatRelativeTime(bookingData.createdAt)}</span>
          <div className="flex items-center space-x-3">
            {bookingData.assignedDepartment && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full capitalize">
                {bookingData.assignedDepartment.replace('-', ' ')}
              </span>
            )}
            {bookingData.appointmentNumber && (
              <span>#{bookingData.appointmentNumber}</span>
            )}
          </div>
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