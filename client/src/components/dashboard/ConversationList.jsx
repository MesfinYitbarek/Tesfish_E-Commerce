import { useState } from 'react';
import { 
  UserIcon,
  EllipsisVerticalIcon,
  ArchiveBoxIcon,
  TrashIcon,
  NoSymbolIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { formatRelativeTime, formatCurrency } from '../../utils/helpers';
import ConfirmDialog from '../ui/ConfirmDialog';

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onArchiveConversation,
  onDeleteConversation,
  onBlockUser,
  currentUserId
}) => {
  const [showMenu, setShowMenu] = useState(null);
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', conversation: null });

  const handleMenuAction = (action, conversation) => {
    setShowMenu(null);
    
    switch (action) {
      case 'archive':
        setConfirmAction({
          show: true,
          type: 'archive',
          conversation,
          title: 'Archive Conversation',
          message: `Are you sure you want to archive this conversation with ${conversation.participant.name}?`,
          confirmText: 'Archive'
        });
        break;
      case 'delete':
        setConfirmAction({
          show: true,
          type: 'delete',
          conversation,
          title: 'Delete Conversation',
          message: `Are you sure you want to delete this conversation with ${conversation.participant.name}? This action cannot be undone.`,
          confirmText: 'Delete',
          confirmVariant: 'danger'
        });
        break;
      case 'block':
        setConfirmAction({
          show: true,
          type: 'block',
          conversation,
          title: 'Block User',
          message: `Are you sure you want to block ${conversation.participant.name}? They will no longer be able to contact you.`,
          confirmText: 'Block',
          confirmVariant: 'danger'
        });
        break;
      default:
        break;
    }
  };

  const handleConfirmAction = () => {
    const { type, conversation } = confirmAction;
    
    switch (type) {
      case 'archive':
        onArchiveConversation(conversation.id);
        break;
      case 'delete':
        onDeleteConversation(conversation.id);
        break;
      case 'block':
        onBlockUser(conversation.id);
        break;
      default:
        break;
    }
    
    setConfirmAction({ show: false, type: '', conversation: null });
  };

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          No conversations found
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Start a conversation with potential customers about your listings.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {conversations.map((conversation) => {
          // Safely handle potentially undefined listing
          const listingTitle = conversation.listing?.title || 'No listing';
          const listingImage = conversation.listing?.image || '/api/placeholder/60/60';
          const listingPrice = conversation.listing?.price || 0;

          return (
            <div
              key={conversation.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative ${
                selectedConversation?.id === conversation.id 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500' 
                  : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {conversation.participant.avatar ? (
                    <img
                      src={conversation.participant.avatar}
                      alt={conversation.participant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {conversation.participant.name}
                      </h3>
                      {conversation.listing && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {listingTitle}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-2">
                      {conversation.lastMessage?.timestamp && (
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                      
                      {/* Menu Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(showMenu === conversation.id ? null : conversation.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Last Message */}
                  {conversation.lastMessage?.content && (
                    <p className={`text-sm mt-1 line-clamp-2 ${
                      conversation.unreadCount > 0 
                        ? 'font-medium text-gray-900 dark:text-gray-100' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {conversation.lastMessage.senderId === currentUserId && (
                        <span className="text-gray-500">You: </span>
                      )}
                      {conversation.lastMessage.content}
                    </p>
                  )}

                  {/* Listing Info */}
                  {conversation.listing && (
                    <div className="flex items-center mt-2 space-x-2">
                      <img
                        src={listingImage}
                        alt={listingTitle}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                        {formatCurrency(listingPrice, 'ETB')}
                      </span>
                    </div>
                  )}

                  {/* Status Indicators */}
                  <div className="flex items-center mt-2 space-x-2">
                    {conversation.blocked && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                        <NoSymbolIcon className="h-3 w-3 mr-1" />
                        Blocked
                      </span>
                    )}
                    {conversation.archived && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        <ArchiveBoxIcon className="h-3 w-3 mr-1" />
                        Archived
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Context Menu */}
              {showMenu === conversation.id && (
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('archive', conversation);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                    {conversation.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('block', conversation);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <NoSymbolIcon className="h-4 w-4 mr-2" />
                    {conversation.blocked ? 'Unblock' : 'Block User'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('delete', conversation);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(null)}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmAction.show}
        onClose={() => setConfirmAction({ show: false, type: '', conversation: null })}
        onConfirm={handleConfirmAction}
        title={confirmAction.title}
        message={confirmAction.message}
        confirmText={confirmAction.confirmText}
        confirmVariant={confirmAction.confirmVariant || 'primary'}
      />
    </>
  );
};

export default ConversationList;