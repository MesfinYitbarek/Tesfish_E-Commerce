import { useState } from 'react';
import { 
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  NoSymbolIcon,
  TrashIcon,
  ArchiveBoxIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';

const ContactInfo = ({ conversation, onClose }) => {
  const [showActions, setShowActions] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', title: '', message: '' });

  const participant = conversation.participant;
  const listing = conversation.listing;

  const handleAction = (actionType) => {
    setShowActions(false);
    
    const actions = {
      block: {
        title: 'Block User',
        message: `Are you sure you want to block ${participant.name}? They will no longer be able to contact you.`,
        confirmText: 'Block',
        variant: 'danger'
      },
      report: {
        title: 'Report User',
        message: `Report ${participant.name} for inappropriate behavior? Our team will review this report.`,
        confirmText: 'Report',
        variant: 'danger'
      },
      archive: {
        title: 'Archive Conversation',
        message: `Archive this conversation with ${participant.name}?`,
        confirmText: 'Archive',
        variant: 'primary'
      },
      delete: {
        title: 'Delete Conversation',
        message: `Permanently delete this conversation with ${participant.name}? This action cannot be undone.`,
        confirmText: 'Delete',
        variant: 'danger'
      }
    };

    setConfirmAction({
      show: true,
      type: actionType,
      ...actions[actionType]
    });
  };

  const handleConfirmAction = () => {
    const { type } = confirmAction;
    
    // Handle the action
    console.log(`Performing action: ${type}`, conversation.id);
    
    setConfirmAction({ show: false, type: '', title: '', message: '' });
  };

  const contactActions = [
    {
      icon: PhoneIcon,
      label: 'Call',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/20',
      action: () => window.open(`tel:+251911234567`)
    },
    {
      icon: EnvelopeIcon,
      label: 'Email',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      action: () => window.open(`mailto:${participant.name.toLowerCase().replace(' ', '.')}@example.com`)
    },
    {
      icon: CalendarIcon,
      label: 'Schedule',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      action: () => console.log('Schedule meeting')
    }
  ];

  return (
    <>
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Contact Info
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
            </div>
          )}
          
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {participant.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {participant.type === 'customer' ? 'Customer' : 'Seller'}
          </p>

          {/* Quick Contact Actions */}
          <div className="flex justify-center space-x-4">
            {contactActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-12 h-12 ${action.bg} ${action.color} rounded-full flex items-center justify-center hover:scale-105 transition-transform`}
                title={action.label}
              >
                <action.icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Contact Details */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Listing Information */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                About This Inquiry
              </h5>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h6 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                      {listing.title}
                    </h6>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {formatCurrency(listing.price, 'ETB')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Contact Information
              </h5>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <PhoneIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">+251 911 234 567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <EnvelopeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {participant.name.toLowerCase().replace(' ', '.')}@example.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <MapPinIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Addis Ababa, Ethiopia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Stats */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Conversation Details
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">First contact</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatRelativeTime(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last active</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatRelativeTime(conversation.lastMessage.timestamp)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Messages exchanged</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    24 messages
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response time</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Usually within 1 hour
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Preferences */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Customer Notes
              </h5>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  • Interested in viewing this weekend
                  • Prefers morning appointments
                  • Looking for immediate move-in
                  • Budget confirmed at asking price
                </p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Tags
              </h5>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                  Serious Buyer
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                  Quick Response
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                  Local Buyer
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowActions(!showActions)}
            >
              More Actions
            </Button>

            {showActions && (
              <div className="space-y-2">
                <button
                  onClick={() => handleAction('archive')}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArchiveBoxIcon className="h-4 w-4 mr-3" />
                  Archive Conversation
                </button>
                
                <button
                  onClick={() => handleAction('block')}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <NoSymbolIcon className="h-4 w-4 mr-3" />
                  Block User
                </button>
                
                <button
                  onClick={() => handleAction('report')}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FlagIcon className="h-4 w-4 mr-3" />
                  Report User
                </button>
                
                <button
                  onClick={() => handleAction('delete')}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-3" />
                  Delete Conversation
                </button>
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
        confirmVariant={confirmAction.variant}
      />
    </>
  );
};

export default ContactInfo;