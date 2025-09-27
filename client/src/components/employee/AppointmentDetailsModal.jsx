// components/employee/AppointmentDetailsModal.jsx
import { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon as CancelIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PencilIcon,
  VideoCameraIcon,
  PhotoIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon as SolidClockIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ConfirmDialog from '../ui/ConfirmDialog';
import { formatDate, formatRelativeTime } from '../../utils/helpers';

const AppointmentDetailsModal = ({ 
  appointment, 
  isOpen, 
  onClose, 
  onStatusChange, 
  userType = 'employee' 
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    newDateTime: '',
    reason: ''
  });
  const [confirmAction, setConfirmAction] = useState({ 
    show: false, 
    type: '', 
    title: '', 
    message: '' 
  });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (appointment) {
      setEditNotes(appointment.employeeNotes || '');
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        icon: <SolidClockIcon className="h-5 w-5" />,
        label: 'Pending Confirmation'
      },
      confirmed: {
        color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
        icon: <CheckCircleIcon className="h-5 w-5" />,
        label: 'Confirmed'
      },
      completed: {
        color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        icon: <CheckIcon className="h-5 w-5" />,
        label: 'Completed'
      },
      cancelled: {
        color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
        icon: <CancelIcon className="h-5 w-5" />,
        label: 'Cancelled'
      },
      rescheduled: {
        color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        icon: <ArrowPathIcon className="h-5 w-5" />,
        label: 'Rescheduled'
      },
      'no-show': {
        color: 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800',
        icon: <ExclamationTriangleIcon className="h-5 w-5" />,
        label: 'No Show'
      }
    };
    return configs[status] || configs.pending;
  };

  const handleStatusAction = (action) => {
    const actions = {
      confirm: {
        title: 'Confirm Appointment',
        message: `Confirm the appointment with ${appointment.contactInfo?.name}? The customer will be notified.`,
        confirmText: 'Confirm Appointment',
        newStatus: 'confirmed'
      },
      complete: {
        title: 'Mark as Completed',
        message: `Mark this appointment as completed? This action will close the appointment.`,
        confirmText: 'Mark Complete',
        newStatus: 'completed'
      },
      cancel: {
        title: 'Cancel Appointment',
        message: `Are you sure you want to cancel this appointment? The customer will be notified and this action cannot be undone.`,
        confirmText: 'Cancel Appointment',
        confirmVariant: 'danger',
        newStatus: 'cancelled'
      },
      'no-show': {
        title: 'Mark as No-Show',
        message: `Mark this appointment as no-show? This indicates the customer did not attend the scheduled appointment.`,
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
      await onStatusChange(appointment._id, newStatus, { 
        notes: editNotes 
      });
      setConfirmAction({ show: false, type: '', title: '', message: '' });
      onClose();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await onStatusChange(appointment._id, appointment.status, { 
        notes: editNotes 
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleReschedule = async () => {
    try {
      // This would need to be implemented in the parent component
      console.log('Reschedule:', rescheduleData);
      setIsRescheduling(false);
      setRescheduleData({ newDateTime: '', reason: '' });
      onClose();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const statusConfig = getStatusConfig(appointment.status);

  const canConfirm = appointment.status === 'pending';
  const canComplete = appointment.status === 'confirmed' && new Date(appointment.scheduledDateTime) <= new Date();
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  const canReschedule = ['pending', 'confirmed'].includes(appointment.status);
  const canMarkNoShow = appointment.status === 'confirmed' && new Date(appointment.scheduledDateTime) < new Date();

  const tabs = [
    { id: 'details', label: 'Details', icon: DocumentTextIcon },
    { id: 'customer', label: 'Customer', icon: UserIcon },
    { id: 'property', label: 'Property', icon: BuildingOfficeIcon },
    { id: 'notes', label: 'Notes', icon: PencilIcon },
    { id: 'history', label: 'History', icon: ClipboardDocumentListIcon }
  ];

  const propertyImage = appointment.property?.media?.images?.find(img => img.isMain)?.url || 
                       appointment.property?.media?.images?.[0]?.url;

  const getTimeUntilAppointment = () => {
    const now = new Date();
    const appointmentDateTime = new Date(appointment.scheduledDateTime);
    const diffMs = appointmentDateTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffMs < 0) return { text: 'Past appointment', type: 'past' };
    if (diffHours < 1) return { text: `In ${Math.ceil(diffMs / (1000 * 60))} minutes`, type: 'critical' };
    if (diffHours < 24) return { text: `In ${Math.ceil(diffHours)} hours`, type: 'today' };
    return { text: formatRelativeTime(appointmentDateTime), type: 'future' };
  };

  const timeInfo = getTimeUntilAppointment();

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {propertyImage && !imageError ? (
                      <img
                        src={propertyImage}
                        alt={appointment.property?.title}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <PhotoIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {appointment.property?.title || 'Property Viewing'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.appointmentNumber && `#${appointment.appointmentNumber} • `}
                      {appointment.contactInfo?.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${statusConfig.color}`}>
                    {statusConfig.icon}
                    <span className="ml-2">{statusConfig.label}</span>
                  </span>
                  
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    timeInfo.type === 'critical' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                    timeInfo.type === 'today' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {timeInfo.text}
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
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Appointment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Appointment Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {formatDate(appointment.scheduledDateTime, { 
                                  weekday: 'long',
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Scheduled date
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {new Date(appointment.scheduledDateTime).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })} ({Math.round(appointment.duration / 60)} hours)
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Start time and duration
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                                {appointment.appointmentType?.replace('-', ' ') || 'Property Viewing'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Appointment type
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Meeting Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            {appointment.meetingDetails?.location === 'online' ? (
                              <VideoCameraIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                            ) : (
                              <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {appointment.meetingDetails?.location === 'online' ? 'Video Call' : 
                                 appointment.meetingDetails?.location === 'property-site' ? 'Property Site' :
                                 appointment.meetingDetails?.location === 'office' ? 'Office Meeting' :
                                 'Customer Location'}
                              </p>
                              {appointment.meetingDetails?.address && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {appointment.meetingDetails.address}
                                </p>
                              )}
                              {appointment.meetingDetails?.meetingLink && (
                                <a 
                                  href={appointment.meetingDetails.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline block mt-1"
                                >
                                  Join Meeting →
                                </a>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Meeting location
                              </p>
                            </div>
                          </div>
                          
                          {appointment.meetingDetails?.specialInstructions && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-sm text-blue-800 dark:text-blue-300">
                                <span className="font-medium">Special Instructions: </span>
                                {appointment.meetingDetails.specialInstructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    {appointment.requirements?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Requirements & Preparation
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {appointment.requirements.map((req, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm rounded-full"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'customer' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Customer Profile */}
                    <div className="flex items-center space-x-4">
                      {appointment.customer?.avatar ? (
                        <img
                          src={appointment.customer.avatar}
                          alt={appointment.contactInfo?.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {appointment.contactInfo?.name || 'Unknown Customer'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Customer
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Preferred contact: {appointment.contactInfo?.preferredContactMethod || 'phone'}
                        </p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Contact Information
                      </h5>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                              <PhoneIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {appointment.contactInfo?.phone || 'No phone provided'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">Phone number</p>
                            </div>
                          </div>
                          {appointment.contactInfo?.phone && (
                            <Button
                              size="sm"
                              onClick={() => window.open(`tel:${appointment.contactInfo.phone}`)}
                              leftIcon={<PhoneIcon className="h-4 w-4" />}
                            >
                              Call
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                              <EnvelopeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {appointment.contactInfo?.email || 'No email provided'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">Email address</p>
                            </div>
                          </div>
                          {appointment.contactInfo?.email && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`mailto:${appointment.contactInfo.email}`)}
                              leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                            >
                              Email
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                              <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Send Message
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">Chat with customer</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => console.log('Open chat')}
                            leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
                          >
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Customer Notes */}
                    {appointment.customerNotes && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Customer Notes
                        </h5>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                            {appointment.customerNotes}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'property' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Property Overview */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                          {propertyImage ? (
                            <img
                              src={propertyImage}
                              alt={appointment.property?.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PhotoIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {appointment.property?.title || 'Property'}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {appointment.property?.propertyDetails?.location?.address || 
                             appointment.property?.propertyDetails?.location?.city ||
                             'Location not specified'}
                          </p>
                          {appointment.property?.pricing?.basePrice && (
                            <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-2">
                              {new Intl.NumberFormat('en-ET', {
                                style: 'currency',
                                currency: 'ETB'
                              }).format(appointment.property.pricing.basePrice)}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                            {appointment.property?.propertyDetails?.bedrooms && (
                              <span>{appointment.property.propertyDetails.bedrooms} bed</span>
                            )}
                            {appointment.property?.propertyDetails?.bathrooms && (
                              <span>{appointment.property.propertyDetails.bathrooms} bath</span>
                            )}
                            {appointment.property?.propertyDetails?.area && (
                              <span>{appointment.property.propertyDetails.area} m²</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property Details */}
                    {appointment.property?.description && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Property Description
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {appointment.property.description}
                        </p>
                      </div>
                    )}

                    {/* Property Features */}
                    {appointment.property?.propertyDetails?.features?.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Features & Amenities
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {appointment.property.propertyDetails.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Customer Notes */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Customer Notes
                      </h4>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        {appointment.customerNotes ? (
                          <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                            {appointment.customerNotes}
                          </p>
                        ) : (
                          <p className="text-sm text-blue-600 dark:text-blue-400 italic">
                            No customer notes provided.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Employee Notes */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          My Notes
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
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            placeholder="Add your notes about this appointment, customer interaction, property details, or next steps..."
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setIsEditing(false);
                                setEditNotes(appointment.employeeNotes || '');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleSaveNotes}>
                              Save Notes
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-32">
                          {appointment.employeeNotes ? (
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {appointment.employeeNotes}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                              No notes added yet. Click edit to add your observations and next steps.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Admin Notes (if any) */}
                    {appointment.adminNotes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Admin Notes
                        </h4>
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap">
                            {appointment.adminNotes}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Timeline */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Appointment Timeline
                      </h4>
                      <div className="space-y-4">
                        {/* Created */}
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Appointment Created
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {formatDate(appointment.createdAt, { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Confirmed */}
                        {appointment.confirmedAt && (
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                              <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Appointment Confirmed
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {formatDate(appointment.confirmedAt, { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Rescheduling History */}
                        {appointment.reschedulingHistory?.map((reschedule, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                              <ArrowPathIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Appointment Rescheduled
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                From {formatDate(reschedule.originalDate, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 
                                to {formatDate(reschedule.newDate, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {reschedule.reason && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  Reason: {reschedule.reason}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {formatDate(reschedule.rescheduledAt, { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Completed/Cancelled */}
                        {appointment.completedAt && (
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                              <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Appointment Completed
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {formatDate(appointment.completedAt, { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        )}

                        {appointment.cancelledAt && (
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                              <CancelIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Appointment Cancelled
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {formatDate(appointment.cancelledAt, { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Outcome (if completed) */}
                    {appointment.outcome && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Appointment Outcome
                        </h4>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-2">
                          {appointment.outcome.attended !== undefined && (
                            <p className="text-sm">
                              <span className="font-medium text-green-800 dark:text-green-300">Attended: </span>
                              <span className="text-green-700 dark:text-green-400">
                                {appointment.outcome.attended ? 'Yes' : 'No'}
                              </span>
                            </p>
                          )}
                          {appointment.outcome.interestLevel && (
                            <p className="text-sm">
                              <span className="font-medium text-green-800 dark:text-green-300">Interest Level: </span>
                              <span className="text-green-700 dark:text-green-400 capitalize">
                                {appointment.outcome.interestLevel.replace('-', ' ')}
                              </span>
                            </p>
                          )}
                          {appointment.outcome.feedback && (
                            <p className="text-sm">
                              <span className="font-medium text-green-800 dark:text-green-300">Feedback: </span>
                              <span className="text-green-700 dark:text-green-400">
                                {appointment.outcome.feedback}
                              </span>
                            </p>
                          )}
                          {appointment.outcome.nextSteps && (
                            <p className="text-sm">
                              <span className="font-medium text-green-800 dark:text-green-300">Next Steps: </span>
                              <span className="text-green-700 dark:text-green-400">
                                {appointment.outcome.nextSteps}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {canReschedule && !isRescheduling && (
                    <Button
                      variant="outline"
                      onClick={() => setIsRescheduling(true)}
                      size="sm"
                      leftIcon={<ArrowPathIcon className="h-4 w-4" />}
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
                      className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  )}
                  
                  {canMarkNoShow && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusAction('no-show')}
                      leftIcon={<ExclamationTriangleIcon className="h-4 w-4" />}
                      className="text-gray-600 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      size="sm"
                    >
                      No Show
                    </Button>
                  )}
                  
                  {canConfirm && (
                    <Button
                      onClick={() => handleStatusAction('confirm')}
                      leftIcon={<CheckIcon className="h-4 w-4" />}
                      size="sm"
                    >
                      Confirm
                    </Button>
                  )}
                  
                  {canComplete && (
                    <Button
                      onClick={() => handleStatusAction('complete')}
                      leftIcon={<CheckIcon className="h-4 w-4" />}
                      size="sm"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>

              {/* Reschedule Form */}
              {isRescheduling && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Reschedule Appointment
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
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
              )}
            </div>
          </motion.div>
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

export default AppointmentDetailsModal;