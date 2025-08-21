import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import {
  fetchChats,
  markAsRead,
  archiveChat,
  setCurrentChat,
  resetChat,
  clearError
} from '../../store/slices/chatSlice';
import ConversationList from '../../components/dashboard/ConversationList';
import ChatWindow from '../../components/dashboard/ChatWindow';
import NewMessageModal from '../../components/dashboard/NewMessageModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Messages = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    chats,
    currentChat,
    isLoading,
    error,
    unreadCount
  } = useSelector((state) => state.chat);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, archived
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchChats());
    dispatch(clearError());

    return () => {
      dispatch(resetChat());
    };
  }, [dispatch]);

  const handleMarkAsRead = async (chatId) => {
    try {
      dispatch(markAsRead(chatId));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleArchiveConversation = async (conversationId) => {
    try {
      await dispatch(archiveChat(conversationId)).unwrap();
      // If the archived conversation is currently open, close it
      if (currentChat?._id === conversationId) {
        dispatch(setCurrentChat(null));
      }
    } catch (error) {
      console.error('Error archiving conversation:', error);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      const chatService = await import('../../services/chatService');
      await chatService.default.deleteChat(conversationId);
      dispatch(fetchChats());

      if (currentChat?._id === conversationId) {
        dispatch(setCurrentChat(null));
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleBlockUser = async (conversationId) => {
    try {
      const conversation = chats.find(c => c._id === conversationId);
      const participantId = conversation.participants.find(p => p.user._id !== user?.id)?.user._id;

      const chatService = await import('../../services/chatService');
      await chatService.default.blockUser(conversationId, participantId);
      dispatch(fetchChats());
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    dispatch(setCurrentChat(conversation));
    handleMarkAsRead(conversation._id);
  };

  const getParticipantName = (participant) => {
    if (!participant) return 'Unknown User';

    if (participant.userType === 'company' && participant.companyProfile?.companyName) {
      return participant.companyProfile.companyName;
    }

    if (participant.userType === 'individual' && participant.individualProfile) {
      const { firstName, lastName } = participant.individualProfile;
      return `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown User';
    }

    if (participant.userType === 'customer' && participant.customerProfile) {
      const { firstName, lastName } = participant.customerProfile;
      return `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown User';
    }

    return participant.email || 'Unknown User';
  };

  const formatConversationsForDisplay = (chats) => {
  return (chats || []).map((chat, index) => {
    // Debug logs
    console.log(`\n=== Formatting chat ${index + 1} / ID: ${chat?._id} ===`);
    console.log("Participants:", chat?.participants);
    console.log("UnreadCount:", chat?.unreadCount);

    // Get participant (excluding logged-in user)
    const participant = Array.isArray(chat?.participants)
      ? chat.participants.find(p => p?.user?._id?.toString() !== user?._id?.toString())?.user
      : null;

    if (!participant) {
      console.warn(`⚠️ Chat ${chat?._id} has no participant other than logged-in user`);
    }

    // Safe unread count
    const unreadCount = Array.isArray(chat?.unreadCount)
      ? chat.unreadCount.find(entry => entry?.user?.toString() === user?._id?.toString())?.count || 0
      : 0;

    if (!Array.isArray(chat?.unreadCount)) {
      console.warn(`⚠️ Chat ${chat?._id} has unreadCount that is not an array`, chat?.unreadCount);
    }

    return {
      id: chat?._id,
      _id: chat?._id,
      participant: {
        id: participant?._id,
        name: getParticipantName(participant),
        avatar: participant?.avatar,
        type: participant?.userType || 'customer'
      },
      listing: chat?.relatedProduct
        ? {
            id: chat.relatedProduct._id,
            title: chat.relatedProduct.title,
            image: chat.relatedProduct.media?.[0]?.url || '/api/placeholder/60/60',
            price: chat.relatedProduct.price || 0
          }
        : null,
      lastMessage: chat?.lastMessage
        ? {
            id: chat.lastMessage._id || Date.now().toString(),
            content: chat.lastMessage.content,
            timestamp: chat.lastMessage.timestamp ? new Date(chat.lastMessage.timestamp) : null,
            senderId: chat.lastMessage.sender,
            read: true
          }
        : null,
      unreadCount,
      archived: chat?.status === 'archived',
      blocked: chat?.status === 'blocked'
    };
  });
};



  const displayChats = formatConversationsForDisplay(chats);

  const filteredConversations = displayChats.filter(conv => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesName = conv.participant.name.toLowerCase().includes(searchLower);
      const matchesListing = conv.listing?.title.toLowerCase().includes(searchLower);
      const matchesMessage = conv.lastMessage?.content.toLowerCase().includes(searchLower);

      if (!matchesName && !matchesListing && !matchesMessage) {
        return false;
      }
    }

    if (filter === 'unread') return conv.unreadCount > 0;
    if (filter === 'archived') return conv.archived;
    if (filter === 'all') return !conv.archived;

    return true;
  });

  const displayUnreadCount = displayChats.filter(conv => conv.unreadCount > 0).length;

  if (error) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading conversations: {error}</p>
          <Button onClick={() => dispatch(fetchChats())}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-full md:w-96' : 'w-0'} transition-all duration-300 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-500 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Messages
              </h1>
              {displayUnreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {displayUnreadCount}
                </span>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => setShowNewMessage(true)}
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              New
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { key: 'all', label: 'All', count: displayChats.filter(c => !c.archived).length },
              { key: 'unread', label: 'Unread', count: displayUnreadCount },
              { key: 'archived', label: 'Archived', count: displayChats.filter(c => c.archived).length }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${filter === filterOption.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
              >
                {filterOption.label}
                {filterOption.count > 0 && (
                  <span className="ml-1 text-xs">({filterOption.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <ConversationList
              conversations={filteredConversations}
              selectedConversation={currentChat}
              onSelectConversation={handleSelectConversation}
              onArchiveConversation={handleArchiveConversation}
              onDeleteConversation={handleDeleteConversation}
              onBlockUser={handleBlockUser}
              currentUserId={user?.id}
            />
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 ${sidebarOpen ? 'hidden md:flex' : 'flex'} flex-col`}>
        {currentChat ? (
          <ChatWindow
            conversation={formatConversationsForDisplay([currentChat])[0]}
            currentUserId={user?.id}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a conversation from the sidebar to start messaging
              </p>
              {!sidebarOpen && (
                <Button
                  variant="outline"
                  onClick={() => setSidebarOpen(true)}
                  className="mt-4"
                >
                  Show Conversations
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      <NewMessageModal
        isOpen={showNewMessage}
        onClose={() => setShowNewMessage(false)}
        onCreateConversation={(conversation) => {
          dispatch(setCurrentChat(conversation));
          dispatch(fetchChats());
          setShowNewMessage(false);
        }}
      />
    </div>
  );
};

export default Messages;