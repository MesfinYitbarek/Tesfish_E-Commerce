import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import {
  fetchChats,
  markAsRead,
  archiveChat,
  deleteChat,
  blockUser,
  unblockUser,
  setCurrentChat,
  resetChat,
  clearError,
  addMessage,
  updateMessage,
  removeMessage,
  updateChatInList,
  setCurrentUserId
} from '../../store/slices/chatSlice';
import ConversationList from '../../components/chat/ConversationList';
import ChatWindow from '../../components/chat/ChatWindow';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const isAdmin = user?.userType === 'admin';
  const isCustomer = user?.userType === 'customer';
  
  // Sellers should not access messages at all
  const isSeller = user?.userType === 'company' || user?.userType === 'individual';

  // Redirect sellers away from messages
  useEffect(() => {
    if (isAuthenticated && isSeller) {
      toast.info('Product inquiries are handled by our support team');
      // Redirect to dashboard or products page
      window.location.href = '/dashboard';
      return;
    }
  }, [isAuthenticated, isSeller]);

  // Initialize Socket.io connection - only for admin and customers
  useEffect(() => {
    if (isAuthenticated && token && user?.id && !isSeller) {
      const serverUrl = import.meta.env.VITE_API_BASE_URL_SOCKET;

      const socket = io(serverUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true
      });

      socket.on('connect', () => {
        console.log('✅ Connected to chat server, socket ID:', socket.id);
        console.log('👤 User ID:', user.id, 'Type:', user.userType);
        setSocketConnected(true);
        socketRef.current = socket;

        dispatch(setCurrentUserId(user.id));

        // Join admin room if user is admin
        if (isAdmin) {
          socket.emit('join-admin-room');
          console.log('🔧 Admin joined admin room for customer support');
        }
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        setSocketConnected(false);
        
        if (error.message?.includes('Authentication') || error.message?.includes('token')) {
          toast.error('Session expired. Please log in again.');
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
        setSocketConnected(false);
      });

      // Listen for new messages
      socket.on('new-message', (data) => {
        console.log('📨 New message received:', data);

        // For customers: Show admin responses
        if (isCustomer && data.message.sender?.userType === 'admin') {
          console.log('💬 Customer receiving admin response about product inquiry');
          toast.success('TesGold team responded to your inquiry', { duration: 3000 });
        }
        
        // For admin: Show customer inquiries with product context
        if (isAdmin && data.message.sender?.userType === 'customer') {
          console.log('🔧 Admin receiving customer product inquiry');
          
          // Extract product info from message context if available
          if (data.chat?.relatedProduct) {
            toast.info(`Customer inquiry: ${data.chat.relatedProduct.title}`, { 
              duration: 4000,
              icon: '❓'
            });
          } else {
            toast.info('New customer inquiry received', { duration: 4000 });
          }
        }

        // Add message to current chat if it's the active one
        if (data.chatId === currentChat?._id) {
          dispatch(addMessage({
            ...data.message,
            chatId: data.chatId
          }));
        }

        // Update chat list
        const existingChat = chats.find(chat => chat._id === data.chatId);
        if (existingChat) {
          dispatch(updateChatInList({
            chatId: data.chatId,
            lastMessage: {
              content: data.message.content,
              timestamp: data.message.createdAt || data.message.timestamp,
              sender: data.message.sender
            },
            incrementUnreadFor: data.message.sender?._id !== user?.id ? user?.id : null
          }));
        } else if (data.chat) {
          dispatch({
            type: 'chat/addChatToList',
            payload: data.chat
          });

          // Enhanced notifications based on user type
          if (isAdmin) {
            const product = data.chat.relatedProduct;
            const productTitle = product?.title || 'a product';
            toast.success(`New inquiry about "${productTitle}"`, {
              duration: 5000,
              icon: '📞'
            });
          } else if (isCustomer) {
            toast.success('Connected to TesGold support team', {
              duration: 4000,
              icon: '💬'
            });
          }
        }
      });

      // Listen for chat created events
      socket.on('chat-created', (data) => {
        console.log('🆕 New customer inquiry chat created:', data);

        if (data.chat) {
          const existingChat = chats.find(chat => chat._id === data.chat._id);
          if (!existingChat) {
            dispatch({
              type: 'chat/addChatToList',
              payload: data.chat
            });

            if (isAdmin) {
              const product = data.chat.relatedProduct;
              const customer = data.chat.participants?.find(p => p.user.userType === 'customer');
              const customerName = customer?.user?.displayName || 'A customer';
              const productTitle = product?.title || 'a product';
              
              toast.success(`${customerName} is asking about "${productTitle}"`, {
                duration: 5000,
                icon: '❓'
              });
            } else if (isCustomer) {
              toast.success('Your inquiry has been sent to our team', {
                duration: 4000,
                icon: '✅'
              });
            }
          }
        }
      });

      // Standard chat event listeners
      socket.on('chat-updated', (data) => {
        if (data.chatId && data.lastMessage) {
          dispatch(updateChatInList({
            chatId: data.chatId,
            lastMessage: data.lastMessage
          }));
        }
      });

      socket.on('message-edited', (data) => {
        if (data.chatId === currentChat?._id) {
          dispatch(updateMessage({ messageId: data.message._id, updates: data.message }));
        }
      });

      socket.on('message-deleted', (data) => {
        if (data.chatId === currentChat?._id) {
          dispatch(removeMessage(data.messageId));
        }
      });

      socket.on('user-online', (data) => {
        setOnlineUsers(prev => new Set([...prev, data.userId]));
      });

      socket.on('user-offline', (data) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      });

      socket.on('messages-read', (data) => {
        if (data.chatId === currentChat?._id) {
          dispatch({ type: 'chat/markMessagesAsRead', payload: data });
        }
      });

      socket.on('chat-blocked', (data) => {
        dispatch({ type: 'chat/updateChatStatus', payload: { chatId: data.chatId, status: 'blocked' } });
        toast.info('Chat has been blocked');
      });

      socket.on('chat-unblocked', (data) => {
        dispatch({ type: 'chat/updateChatStatus', payload: { chatId: data.chatId, status: 'active' } });
        toast.info('Chat has been unblocked');
      });

      socket.on('chat-deleted', (data) => {
        dispatch({ type: 'chat/removeChatFromList', payload: data.chatId });
        
        if (currentChat?._id === data.chatId) {
          dispatch(setCurrentChat(null));
        }
        
        toast.info('Chat has been deleted');
      });

      socketRef.current = socket;

      return () => {
        if (socket && socket.connected) {
          console.log('🔌 Disconnecting socket');
          if (isAdmin) {
            socket.emit('leave-admin-room');
          }
          socket.disconnect();
        }
        setSocketConnected(false);
        socketRef.current = null;
      };
    }
  }, [isAuthenticated, token, user?.id, user?.userType, dispatch, currentChat?._id, chats, isAdmin, isCustomer, isSeller]);

  // Fetch chats and admin stats - only for admin and customers
  useEffect(() => {
    if (isAuthenticated && !isSeller) {
      dispatch(fetchChats());
      dispatch(clearError());
    }

    return () => {
      dispatch(resetChat());
    };
  }, [dispatch, isAuthenticated, isAdmin, isSeller]);

  // Don't render anything for sellers
  if (isSeller) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="text-center max-w-md">
          <ShieldCheckIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Customer Inquiries Handled by Our Team
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            All customer inquiries about your products are professionally handled by our TesGold support team. 
            You can focus on managing your products while we take care of customer communication.
          </p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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

      await dispatch(blockUser({ chatId: conversationId, userId: participantId })).unwrap();
      toast.success('User blocked');
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (conversationId) => {
    try {
      await dispatch(unblockUser(conversationId)).unwrap();
      toast.success('User unblocked');
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    }
  };

  const handleSelectConversation = (conversation) => {
    console.log('📂 Selecting conversation:', conversation._id);

    dispatch(setCurrentChat(conversation));
    handleMarkAsRead(conversation._id);

    if (socketRef.current) {
      console.log('🏠 Joining chat room:', `chat-${conversation._id}`);
      socketRef.current.emit('join-chat', conversation._id);
    }

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

    // For customers: Always show "TesGold Team" when they see admin
    if (isCustomer && userData.userType === 'admin') {
      return {
        name: 'TesGold Team',
        avatar: null,
        userId: userData._id,
        userType: 'admin',
        isVerified: true,
        isSupport: true
      };
    }

    // For admin: Show customer info
    if (isAdmin && userData.userType === 'customer') {
      const customerName = userData.displayName || 
                          `${userData.customerProfile?.firstName || ''} ${userData.customerProfile?.lastName || ''}`.trim() ||
                          userData.email ||
                          'Customer';
      
      return {
        name: customerName,
        avatar: userData.customerProfile?.avatar || userData.avatar,
        userId: userData._id,
        userType: 'customer',
        isVerified: userData.isVerified
      };
    }

    // Fallback
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
          isOnline: participantInfo.userId ? onlineUsers.has(participantInfo.userId) : false,
          isSupport: participantInfo.isSupport || false
        },
        listing: chat?.relatedProduct
          ? {
            id: chat.relatedProduct._id,
            title: chat.relatedProduct.title,
            image: chat.relatedProduct.media?.images?.[0]?.url || '/api/placeholder/60/60',
            price: chat.relatedProduct.pricing?.basePrice || 0,
            currency: chat.relatedProduct.pricing?.currency || 'ETB',
            seller: chat.relatedProduct.seller // For admin context
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
        blocked: chat?.status === 'blocked',
        chatType: chat?.chatType || 'direct',
        isSupport: chat?.chatType === 'support' || true // All chats are essentially support
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
    if (filter === 'blocked') return conv.blocked;
    if (filter === 'all') return !conv.archived;

    return true;
  });

  const displayUnreadCount = displayChats.filter(conv => conv.unreadCount > 0).length;

  if (error) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Conversations
          </h3>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchChats())}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
                  {isAdmin ? 'Customer Inquiries' : 'Product Support'}
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
            </div>
            {/* Search */}
            <div className="relative mb-4">
              <Input
                placeholder={isAdmin ? "Search customer inquiries..." : "Search conversations..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: 'all', label: 'All', count: displayChats.filter(c => !c.archived).length },
                { key: 'unread', label: 'Unread', count: displayUnreadCount },
                ...(isAdmin ? [
                  { key: 'blocked', label: 'Blocked', count: displayChats.filter(c => c.blocked).length }
                ] : []),
                { key: 'archived', label: 'Archived', count: displayChats.filter(c => c.archived).length }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === filterOption.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                >
                  {filterOption.label}
                  {filterOption.count > 0 && (
                    <span className="ml-1">({filterOption.count})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Context info */}
            {isCustomer && (
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  💬 All product inquiries are handled by our professional team
                </p>
              </div>
            )}
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
                onUnblockUser={handleUnblockUser}
                currentUserId={user?.id}
                isAdmin={isAdmin}
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
            isAdmin={isAdmin}
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
              {isAdmin ? 'Select a customer inquiry' : 'Select a conversation'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isAdmin 
                ? 'Choose a customer product inquiry to assist with'
                : 'Choose a conversation to start messaging with our support team'
              }
            </p>
            <Button
              variant="outline"
              onClick={() => setSidebarOpen(true)}
              className="mt-4"
            >
              Show {isAdmin ? 'Inquiries' : 'Conversations'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;