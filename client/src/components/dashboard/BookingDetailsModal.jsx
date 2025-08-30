import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CheckIcon,
  XMarkIcon as CancelIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PencilIcon,
  BuildingOfficeIcon,
  VideoCameraIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import { updateAppointmentStatus, rescheduleAppointment } from '../../store/slices/appointmentSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ConfirmDialog from '../ui/ConfirmDialog';

const BookingDetailsModal = ({ booking, onClose, onStatusChange, isSeller = true }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('details');
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', title: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    newDateTime: '',
    reason: ''
  });

  // Handle appointment data structure safely
  const appointmentData = booking?.appointment || booking;
  
  if (!appointmentData) {
    return null;
  }

  const bookingData = {
    id: appointmentData._id || appointmentData.id,
    appointmentNumber: appointmentData.appointmentNumber,
    property: appointmentData.property || {},
    customer: appointmentData.customer || {},
    seller: appointmentData.seller || {},
    contactInfo: appointmentData.contactInfo || {},
    scheduledDateTime: appointmentData.scheduledDateTime,
    duration: appointmentData.duration || 60,
    status: appointmentData.status,
    appointmentType: appointmentData.appointmentType || 'property-viewing',
    meetingDetails: appointmentData.meetingDetails || {},
    customerNotes: appointmentData.customerNotes,
    sellerNotes: appointmentData.sellerNotes,
    adminNotes: appointmentData.adminNotes,
    requirements: appointmentData.requirements || [],
    outcome: appointmentData.outcome,
    reschedulingHistory: appointmentData.reschedulingHistory || [],
    createdAt: appointmentData.createdAt,
    confirmedAt: appointmentData.confirmedAt,
    completedAt: appointmentData.completedAt,
    cancelledAt: appointmentData.cancelledAt
  };

  useState(() => {
    setEditNotes(isSeller ? (bookingData.sellerNotes || '') : (bookingData.customerNotes || ''));
  }, [bookingData, isSeller]);

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
    const actions = {
      confirm: {
        title: 'Confirm Appointment',
        message: `Confirm the appointment with ${getCustomerName()}?`,
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
        message: `Are you sure you want to cancel this appointment? This action cannot be undone.`,
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

  const handleConfirmAction = async () => {
    const { newStatus } = confirmAction;
    try {
      if (isSeller) {
        await dispatch(updateAppointmentStatus({
          appointmentId: bookingData.id,
          statusData: { 
            status: newStatus,
            sellerNotes: editNotes 
          }
        })).unwrap();
      }
      onStatusChange && onStatusChange(bookingData.id, newStatus);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
    setConfirmAction({ show: false, type: '', title: '', message: '' });
    onClose();
  };

  const handleSaveNotes = async () => {
    try {
      if (isSeller) {
        await dispatch(updateAppointmentStatus({
          appointmentId: bookingData.id,
          statusData: { 
            sellerNotes: editNotes 
          }
        })).unwrap();
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleReschedule = async () => {
    try {
      await dispatch(rescheduleAppointment({
        appointmentId: bookingData.id,
        rescheduleData: {
          newDateTime: rescheduleData.newDateTime,
          reason: rescheduleData.reason
        }
      })).unwrap();
      
      setIsRescheduling(false);
      setRescheduleData({ newDateTime: '', reason: '' });
      onClose();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const getCustomerName = () => {
    return bookingData.contactInfo?.name || 
           `${bookingData.customer?.firstName || ''} ${bookingData.customer?.lastName || ''}`.trim() ||
           'Unknown Customer';
  };

  const getSellerName = () => {
    if (bookingData.seller?.userType === 'company') {
      return bookingData.seller?.companyProfile?.companyName || 'Company';
    }
    return `${bookingData.seller?.individualProfile?.firstName || ''} ${bookingData.seller?.individualProfile?.lastName || ''}`.trim() || 'Property Owner';
  };

  const canConfirm = bookingData.status === 'pending' && isSeller;
  const canComplete = bookingData.status === 'confirmed' && new Date(bookingData.scheduledDateTime) <= new Date();
  const canCancel = ['pending', 'confirmed'].includes(bookingData.status);
  const canReschedule = ['pending', 'confirmed'].includes(bookingData.status);

  const tabs = [
    { id: 'details', label: 'Details', icon: DocumentTextIcon },
    { id: 'customer', label: isSeller ? 'Customer' : 'Property Owner', icon: UserIcon },
    { id: 'notes', label: 'Notes', icon: PencilIcon }
  ];

  const propertyImage = bookingData.property?.media?.images?.find(img => img.isMain)?.url || 
                       bookingData.property?.media?.images?.[0]?.url || 
                       null;

  // Handle modal close
  const handleModalClose = (e) => {
    // Only close if clicking the overlay background
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 z-50 overflow-y-auto"
        onClick={handleModalClose}
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

          {/* Modal Content */}
          <div 
            className="relative inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {propertyImage ? (
                    <img
                      src={propertyImage}
                      alt={bookingData.property?.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {bookingData.property?.title || 'Property Viewing'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {bookingData.appointmentNumber ? `Appointment #${bookingData.appointmentNumber}` : 'Appointment Details'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(bookingData.status)}`}>
                  {bookingData.status.charAt(0).toUpperCase() + bookingData.status.slice(1).replace('-', ' ')}
                </span>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
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
                  {/* Appointment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Appointment Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(bookingData.scheduledDateTime, { 
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
                            {new Date(bookingData.scheduledDateTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} ({Math.round(bookingData.duration / 60)} hours)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {bookingData.appointmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Meeting Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          {bookingData.meetingDetails?.location === 'online' ? (
                            <VideoCameraIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                          ) : (
                            <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                          )}
                          <div>
                            <span className="text-sm text-gray-900 dark:text-gray-100 block">
                              {bookingData.meetingDetails?.location === 'online' ? 'Video Call' : 
                               bookingData.meetingDetails?.location === 'property-site' ? 'Property Site' :
                               bookingData.meetingDetails?.location === 'office' ? 'Office Meeting' :
                               'Customer Location'}
                            </span>
                            {bookingData.meetingDetails?.address && (
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {bookingData.meetingDetails.address}
                              </span>
                            )}
                            {bookingData.meetingDetails?.meetingLink && (
                              <a 
                                href={bookingData.meetingDetails.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary-600 dark:text-primary-400 hover:underline block"
                              >
                                Join Meeting
                              </a>
                            )}
                          </div>
                        </div>
                        
                        {bookingData.meetingDetails?.specialInstructions && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Instructions: </span>
                            {bookingData.meetingDetails.specialInstructions}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Property Information
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          {propertyImage ? (
                            <img
                              src={propertyImage}
                              alt={bookingData.property?.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PhotoIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            {bookingData.property?.title || 'Property'}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {bookingData.property?.propertyDetails?.location?.address || 
                             bookingData.property?.propertyDetails?.location?.city ||
                             'Location not specified'}
                          </p>
                          {bookingData.property?.pricing?.basePrice && (
                            <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mt-2">
                              {new Intl.NumberFormat('en-ET', {
                                style: 'currency',
                                currency: 'ETB'
                              }).format(bookingData.property.pricing.basePrice)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  {bookingData.requirements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Requirements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {bookingData.requirements.map((req, index) => (
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
                </div>
              )}

              {activeTab === 'customer' && (
                <div className="space-y-6">
                  {/* Profile */}
                  <div className="flex items-center space-x-4">
                    {(isSeller ? bookingData.customer?.avatar : bookingData.seller?.avatar) ? (
                      <img
                        src={isSeller ? bookingData.customer.avatar : bookingData.seller.avatar}
                        alt={isSeller ? getCustomerName() : getSellerName()}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {isSeller ? getCustomerName() : getSellerName()}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isSeller ? 'Customer' : 'Property Owner'}
                      </p>
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
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {isSeller ? 
                              (bookingData.contactInfo?.phone || bookingData.customer?.phone) :
                              (bookingData.seller?.phone)
                            }
                          </p>
                        </div>
                        <button
                          onClick={() => window.open(`tel:${isSeller ? 
                            (bookingData.contactInfo?.phone || bookingData.customer?.phone) :
                            bookingData.seller?.phone
                          }`)}
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
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {isSeller ?
                              (bookingData.contactInfo?.email || bookingData.customer?.email) :
                              bookingData.seller?.email
                            }
                          </p>
                        </div>
                        <button
                          onClick={() => window.open(`mailto:${isSeller ?
                            (bookingData.contactInfo?.email || bookingData.customer?.email) :
                            bookingData.seller?.email
                          }`)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <EnvelopeIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {bookingData.contactInfo?.preferredContactMethod && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Preferred contact: </span>
                          {bookingData.contactInfo.preferredContactMethod}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-6">
                  {/* Customer Notes */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Customer Notes
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      {bookingData.customerNotes ? (
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {bookingData.customerNotes}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No customer notes provided.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Seller Notes */}
                  {isSeller && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Your Notes
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
                            placeholder="Add notes about this appointment..."
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setIsEditing(false);
                                setEditNotes(bookingData.sellerNotes || '');
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
                          {bookingData.sellerNotes ? (
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {bookingData.sellerNotes}
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
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                {!isSeller && (
                  <button
                    onClick={() => console.log('Open chat')}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    <span>Message</span>
                  </button>
                )}

                {canReschedule && !isRescheduling && (
                  <Button
                    variant="outline"
                    onClick={() => setIsRescheduling(true)}
                    size="sm"
                  >
                    Reschedule
                  </Button>
                )}
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

            {/* Reschedule Form */}
            {isRescheduling && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Reschedule Appointment
                </h4>
                <div className="space-y-3">
                  <Input
                    label="New Date & Time"
                    type="datetime-local"
                    value={rescheduleData.newDateTime}
                    onChange={(e) => setRescheduleData({...rescheduleData, newDateTime: e.target.value})}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <Input
                    label="Reason"
                    value={rescheduleData.reason}
                    onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                    placeholder="Reason for rescheduling..."
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsRescheduling(false);
                        setRescheduleData({ newDateTime: '', reason: '' });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleReschedule}
                      disabled={!rescheduleData.newDateTime}
                    >
                      Reschedule
                    </Button>
                  </div>
                </div>
              </div>
            )}
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