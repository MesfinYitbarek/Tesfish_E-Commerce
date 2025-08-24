import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import {
  fetchChats,
  markAsRead,
  archiveChat,
  deleteChat,
  setCurrentChat,
  resetChat,
  clearError,
  addMessage,
  updateMessage,
  removeMessage,
  updateChatInList
} from '../../store/slices/chatSlice';
import ConversationList from '../../components/chat/ConversationList';
import ChatWindow from '../../components/chat/ChatWindow';
// import NewMessageModal from '../../components/chat/NewMessageModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Messages = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const {
    chats,
    currentChat,
    isLoading,
    error,
  } = useSelector((state) => state.chat);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  // const [showNewMessage, setShowNewMessage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Initialize Socket.io connection with NEW CONVERSATION SUPPORT
  useEffect(() => {
    if (isAuthenticated && token && user?.id) {
      const serverUrl = 'http://localhost:5000';

      const socket = io(serverUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true
      });

      socket.on('connect', () => {
        console.log('✅ Connected to chat server, socket ID:', socket.id);
        console.log('👤 User ID:', user.id);
        setSocketConnected(true);
        socketRef.current = socket;
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        setSocketConnected(false);
      });

      socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
        setSocketConnected(false);
      });

      // Listen for new messages - WITH NEW CHAT DETECTION
      socket.on('new-message', (data) => {
        console.log('📨 Messages page received new message:', data);

        // Add message to current chat if it's the active one
        if (data.chatId === currentChat?._id) {
          dispatch(addMessage({
            ...data.message,
            chatId: data.chatId
          }));
        }

        // Check if this chat exists in our list
        const existingChat = chats.find(chat => chat._id === data.chatId);

        if (existingChat) {
          // Update existing conversation list efficiently without full refresh
          dispatch(updateChatInList({
            chatId: data.chatId,
            lastMessage: {
              content: data.message.content,
              timestamp: data.message.createdAt || data.message.timestamp,
              sender: data.message.sender
            },
            incrementUnreadFor: data.message.sender?._id !== user?.id ? user?.id : null
          }));
        } else {
          // If chat doesn't exist, it means this is a new conversation
          console.log('🆕 New chat detected from message, adding to list...');

          // If the message includes chat data, use it
          if (data.chat) {
            dispatch({
              type: 'chat/addChatToList',
              payload: data.chat
            });

            // Get participant name for notification
            const participantName = data.chat.participants?.find(p => p.user._id !== user?.id)?.user?.displayName ||
              data.message.sender?.displayName || 'Someone';
            toast.success(`New conversation started with ${participantName}`);
          } else {
            // Fallback: fetch all chats to get the new one
            dispatch(fetchChats());
          }
        }
      });

      // Listen for new chat created events - FOR REAL-TIME NEW CONVERSATIONS
      socket.on('chat-created', (data) => {
        console.log('🆕 New chat created event received:', data);

        // Add the new chat to the conversation list immediately
        if (data.chat) {
          // Check if chat already exists to prevent duplicates
          const existingChat = chats.find(chat => chat._id === data.chat._id);
          if (!existingChat) {
            dispatch({
              type: 'chat/addChatToList',
              payload: data.chat
            });

            // Get participant name for notification
            const participantName = data.chat.participants?.find(p => p.user._id !== user?.id)?.user?.displayName ||
              data.chat.participants?.find(p => p.user._id !== user?.id)?.user?.companyProfile?.companyName ||
              data.chat.participants?.find(p => p.user._id !== user?.id)?.user?.individualProfile?.firstName ||
              data.chat.participants?.find(p => p.user._id !== user?.id)?.user?.customerProfile?.firstName ||
              'Someone';

            toast.success(`New conversation started with ${participantName}`, {
              duration: 4000,
              icon: '💬'
            });
          }
        }
      });

      // Listen for chat updates - only update specific chat
      socket.on('chat-updated', (data) => {
        console.log('🔄 Chat updated:', data);
        if (data.chatId && data.lastMessage) {
          dispatch(updateChatInList({
            chatId: data.chatId,
            lastMessage: data.lastMessage
          }));
        }
      });

      // Listen for message updates
      socket.on('message-edited', (data) => {
        console.log('✏️ Message edited:', data);
        if (data.chatId === currentChat?._id) {
          dispatch(updateMessage({ messageId: data.message._id, updates: data.message }));
        }
      });

      socket.on('message-deleted', (data) => {
        console.log('🗑️ Message deleted:', data);
        if (data.chatId === currentChat?._id) {
          dispatch(removeMessage(data.messageId));
        }
      });

      // Listen for typing events
      socket.on('user-typing', (data) => {
        console.log('⌨️ User typing:', data);
      });

      // Listen for user online/offline status
      socket.on('user-online', (data) => {
        console.log('🟢 User online:', data);
        setOnlineUsers(prev => new Set([...prev, data.userId]));
      });

      socket.on('user-offline', (data) => {
        console.log('🔴 User offline:', data);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      });

      // Listen for messages read events
      socket.on('messages-read', (data) => {
        console.log('📖 Messages read:', data);
        if (data.chatId === currentChat?._id) {
          dispatch({ type: 'chat/markMessagesAsRead', payload: data });
        }
      });

      socketRef.current = socket;

      return () => {
        if (socket && socket.connected) {
          console.log('🔌 Disconnecting socket');
          socket.disconnect();
        }
        setSocketConnected(false);
        socketRef.current = null;
      };
    }
  }, [isAuthenticated, token, user?.id, dispatch, currentChat?._id, chats]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchChats());
      dispatch(clearError());
    }

    return () => {
      dispatch(resetChat());
    };
  }, [dispatch, isAuthenticated]);

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
      if (currentChat?._id === conversationId) {
        dispatch(setCurrentChat(null));
      }
      toast.success('Conversation archived');
    } catch (error) {
      console.error('Error archiving conversation:', error);
      toast.error('Failed to archive conversation');
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await dispatch(deleteChat(conversationId)).unwrap();

      if (currentChat?._id === conversationId) {
        dispatch(setCurrentChat(null));
      }
      toast.success('Conversation deleted');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Failed to delete conversation');
    }
  };

  const handleBlockUser = async (conversationId) => {
    try {
      const conversation = chats.find(c => c._id === conversationId);
      const participantId = conversation.participants.find(p => p.user._id !== user?.id)?.user._id;

      const chatService = await import('../../services/chatService');
      await chatService.default.blockUser(conversationId, participantId);

      dispatch({
        type: 'chat/updateChatStatus',
        payload: { chatId: conversationId, status: 'blocked' }
      });

      toast.success('User blocked');
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    }
  };

  const handleSelectConversation = (conversation) => {
    console.log('📂 Selecting conversation:', conversation._id);

    // Always set the current chat, even if it's already selected
    dispatch(setCurrentChat(conversation));
    handleMarkAsRead(conversation._id);

    // Join chat room for real-time updates
    if (socketRef.current) {
      console.log('🏠 Joining chat room:', `chat-${conversation._id}`);
      socketRef.current.emit('join-chat', conversation._id);
    }

    // On mobile, hide sidebar when conversation is selected
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getParticipantInfo = (chat) => {
    if (!chat || !chat.participants) return { name: 'Unknown User', avatar: null, userId: null };

    const participant = chat.participants.find(p => p?.user?._id?.toString() !== user?._id?.toString());
    if (!participant?.user) return { name: 'Unknown User', avatar: null, userId: null };

    const userData = participant.user;

    if (userData.displayName) {
      return {
        name: userData.displayName,
        avatar: userData.avatar,
        userId: userData._id,
        userType: userData.userType,
        isVerified: userData.isVerified
      };
    }

    if (userData.userType === 'company' && userData.companyProfile?.companyName) {
      return {
        name: userData.companyProfile.companyName,
        avatar: userData.companyProfile.logo,
        userId: userData._id,
        userType: 'company',
        isVerified: userData.isVerified
      };
    }

    if (userData.userType === 'individual' && userData.individualProfile) {
      const { firstName, lastName } = userData.individualProfile;
      return {
        name: `${firstName || ''} ${lastName || ''}`.trim() || 'Individual',
        avatar: userData.individualProfile.avatar,
        userId: userData._id,
        userType: 'individual',
        isVerified: userData.isVerified
      };
    }

    if (userData.userType === 'customer' && userData.customerProfile) {
      const { firstName, lastName } = userData.customerProfile;
      return {
        name: `${firstName || ''} ${lastName || ''}`.trim() || 'Customer',
        avatar: userData.customerProfile.avatar,
        userId: userData._id,
        userType: 'customer',
        isVerified: userData.isVerified
      };
    }

    return {
      name: userData.email || 'Unknown User',
      avatar: null,
      userId: userData._id,
      userType: userData.userType || 'user',
      isVerified: userData.isVerified
    };
  };

  const formatConversationsForDisplay = (chats) => {
    return (chats || []).map((chat) => {
      const participantInfo = getParticipantInfo(chat);

      const unreadCount = Array.isArray(chat?.unreadCount)
        ? chat.unreadCount.find(entry => entry?.user?.toString() === user?._id?.toString())?.count || 0
        : 0;

      return {
        id: chat?._id,
        _id: chat?._id,
        participant: {
          id: participantInfo.userId,
          name: participantInfo.name,
          avatar: participantInfo.avatar,
          type: participantInfo.userType || 'customer',
          isVerified: participantInfo.isVerified,
          isOnline: participantInfo.userId ? onlineUsers.has(participantInfo.userId) : false
        },
        listing: chat?.relatedProduct
          ? {
            id: chat.relatedProduct._id,
            title: chat.relatedProduct.title,
            image: chat.relatedProduct.media?.images?.[0]?.url || '/api/placeholder/60/60',
            price: chat.relatedProduct.pricing?.basePrice || 0,
            currency: chat.relatedProduct.pricing?.currency || 'ETB'
          }
          : null,
        lastMessage: chat?.lastMessage
          ? {
            id: chat.lastMessage._id || Date.now().toString(),
            content: chat.lastMessage.content,
            timestamp: chat.lastMessage.timestamp ? new Date(chat.lastMessage.timestamp) : null,
            senderId: chat.lastMessage.sender?._id || chat.lastMessage.sender,
            senderName: chat.lastMessage.sender?.displayName || 'Unknown',
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

  // Mobile responsive logic
  const showSidebar = sidebarOpen || !currentChat;
  const showChat = currentChat && (!sidebarOpen || window.innerWidth >= 768);

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-full md:w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col md:flex">
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
                {socketConnected && (
                  <div className="ml-2 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="ml-1 text-xs text-green-600 dark:text-green-400">Online</span>
                  </div>
                )}
              </div>
              {/* <Button
                size="sm"
                onClick={() => setShowNewMessage(true)}
                leftIcon={<PlusIcon className="h-4 w-4" />}
              >
                New
              </Button> */}
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
                socket={socketRef.current}
              />
            )}
          </div>
        </div>
      )}

      {/* Chat Window */}
      {showChat && (
        <div className="flex-1 flex flex-col">
          <ChatWindow
            conversation={formatConversationsForDisplay([currentChat])[0]}
            currentUserId={user?.id}
            onToggleSidebar={handleToggleSidebar}
            sidebarOpen={sidebarOpen}
            socket={socketRef.current}
            socketConnected={socketConnected}
          />
        </div>
      )}

      {/* Empty State */}
      {!showSidebar && !showChat && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a conversation from the sidebar to start messaging
            </p>
            <Button
              variant="outline"
              onClick={() => setSidebarOpen(true)}
              className="mt-4"
            >
              Show Conversations
            </Button>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {/* <NewMessageModal
        isOpen={showNewMessage}
        onClose={() => setShowNewMessage(false)}
        onCreateConversation={(conversation) => {
          dispatch(setCurrentChat(conversation));
          dispatch({ 
            type: 'chat/addChatToList', 
            payload: conversation 
          });
          setShowNewMessage(false);
          
          // On mobile, hide sidebar when new conversation is created
          if (window.innerWidth < 768) {
            setSidebarOpen(false);
          }
        }}
      /> */}
    </div>
  );
};

export default Messages;