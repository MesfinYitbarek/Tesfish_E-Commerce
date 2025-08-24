import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { io } from 'socket.io-client';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { 
  createChat, 
  sendMessage, 
  resetChat,
  addMessage,
  setCurrentChat,
  updateMessage,
  removeMessage,
  setCurrentUserId
} from '../../store/slices/chatSlice';
import { logout } from '../../store/slices/authSlice';
import { formatRelativeTime, formatCurrency } from '../../utils/helpers';

const ContactSellerModal = ({ isOpen, onClose, product }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [chatError, setChatError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const { currentChat, messages, isLoading, error, isSending } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check authentication when modal opens
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      toast.error('Please log in to contact the seller');
      onClose();
      navigate('/auth/login');
      return;
    }

    if (isOpen && !token) {
      toast.error('Authentication required');
      onClose();
      return;
    }

    if (isOpen && isAuthenticated && user?.id) {
      dispatch(setCurrentUserId(user.id));
    }
  }, [isOpen, isAuthenticated, token, navigate, onClose, dispatch, user?.id]);

  // Initialize socket connection with better error handling and reconnection
  useEffect(() => {
    if (isOpen && token && isAuthenticated && !authError) {
      const initializeSocket = () => {
        const serverUrl = 'http://localhost:5000';
        
        console.log('🔌 Initializing socket connection...');
        
        const newSocket = io(serverUrl, {
          auth: { token },
          transports: ['websocket', 'polling'],
          timeout: 10000,
          forceNew: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
          console.log('✅ ContactSellerModal connected to chat server');
          setSocketConnected(true);
          setSocket(newSocket);
          socketRef.current = newSocket;
          setConnectionAttempts(0);
          setAuthError(false);
          setChatError(null);
        });

        newSocket.on('connect_error', (error) => {
          console.error('❌ ContactSellerModal socket connection error:', error);
          setSocketConnected(false);
          setConnectionAttempts(prev => prev + 1);
          
          if (error.message.includes('Authentication') || error.message.includes('token')) {
            setAuthError(true);
            toast.error('Session expired. Please log in again.');
            dispatch(logout());
            onClose();
            navigate('/auth/login');
          } else if (connectionAttempts < 3) {
            console.log('🔄 Retrying socket connection...');
            setTimeout(() => {
              if (isOpen && !socketRef.current?.connected) {
                initializeSocket();
              }
            }, 2000 * (connectionAttempts + 1));
          } else {
            console.warn('⚠️ Chat server unavailable after multiple attempts');
            setChatError('Real-time chat unavailable. Messages will still be delivered.');
          }
        });

        newSocket.on('disconnect', (reason) => {
          console.log('🔌 ContactSellerModal socket disconnected:', reason);
          setSocketConnected(false);
          
          if (reason === 'io server disconnect' || reason === 'transport close') {
            setAuthError(true);
          } else if (reason !== 'io client disconnect') {
            // Try to reconnect for non-intentional disconnects
            setTimeout(() => {
              if (isOpen && !socketRef.current?.connected) {
                initializeSocket();
              }
            }, 2000);
          }
        });

        newSocket.on('reconnect', () => {
          console.log('🔄 ContactSellerModal socket reconnected');
          setSocketConnected(true);
          setConnectionAttempts(0);
          setChatError(null);
          
          // Rejoin chat room if we have an active chat
          if (currentChat?._id) {
            newSocket.emit('join-chat', currentChat._id);
          }
        });

        return newSocket;
      };

      const socket = initializeSocket();

      return () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        if (socket && socket.connected) {
          socket.close();
        }
        setSocket(null);
        setSocketConnected(false);
        socketRef.current = null;
      };
    }
  }, [isOpen, token, isAuthenticated, authError, dispatch, navigate, onClose, connectionAttempts, currentChat?._id]);

  // Socket event listeners with improved error handling
  useEffect(() => {
    if (!socket || !socketConnected || !currentChat) return;

    console.log('🏠 ContactSellerModal joining chat room:', currentChat._id);

    // Join chat room
    socket.emit('join-chat', currentChat._id);

    // Listen for new messages - IMPROVED
    const handleNewMessage = (data) => {
      console.log('📨 ContactSellerModal received new message:', data);
      try {
        if (data.chatId === currentChat._id) {
          console.log('✅ Adding message to ContactSellerModal');
          
          // Add to Redux store for consistency
          dispatch(addMessage({
            ...data.message,
            chatId: data.chatId
          }));
          
          // Also add to local state for immediate UI update
          setLocalMessages(prev => {
            const messageExists = prev.some(msg => 
              msg._id === data.message._id || 
              (msg.content === data.message.content && 
               Math.abs(new Date(msg.createdAt) - new Date(data.message.createdAt)) < 2000)
            );
            
            if (!messageExists) {
              const newMessages = [...prev, data.message];
              return newMessages.sort((a, b) => 
                new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
              );
            }
            return prev;
          });
          
          // Scroll to bottom after message is added
          setTimeout(() => scrollToBottom(), 100);
        }
      } catch (error) {
        console.error('Error handling new message in ContactSellerModal:', error);
      }
    };

    // Listen for typing events
    const handleUserTyping = (data) => {
      try {
        if (data.chatId === currentChat._id && data.userId !== user?._id) {
          setOtherUserTyping(data.isTyping);
          if (data.isTyping) {
            setTimeout(() => setOtherUserTyping(false), 3000);
          }
        }
      } catch (error) {
        console.error('Error handling typing event:', error);
      }
    };

    // Listen for message updates
    const handleMessageEdited = (data) => {
      try {
        if (data.chatId === currentChat._id) {
          dispatch(updateMessage({ 
            messageId: data.message._id, 
            updates: data.message 
          }));
          
          setLocalMessages(prev => prev.map(msg => 
            msg._id === data.message._id 
              ? { ...msg, ...data.message, isEdited: true }
              : msg
          ));
        }
      } catch (error) {
        console.error('Error handling message edit:', error);
      }
    };

    const handleMessageDeleted = (data) => {
      try {
        if (data.chatId === currentChat._id) {
          dispatch(removeMessage(data.messageId));
          setLocalMessages(prev => prev.filter(msg => msg._id !== data.messageId));
        }
      } catch (error) {
        console.error('Error handling message delete:', error);
      }
    };

    // Listen for read status
    const handleMessagesRead = (data) => {
      try {
        if (data.chatId === currentChat._id) {
          console.log('📖 Messages marked as read by other user');
          setLocalMessages(prev => prev.map(msg => ({
            ...msg,
            isRead: msg.sender?._id === user?._id ? true : msg.isRead
          })));
        }
      } catch (error) {
        console.error('Error handling read status:', error);
      }
    };

    // Listen for errors
    const handleError = (error) => {
      console.error('Socket error in ContactSellerModal:', error);
      if (error.message && error.message.includes('Authentication')) {
        setAuthError(true);
        toast.error('Session expired. Please log in again.');
        dispatch(logout());
        onClose();
        navigate('/auth/login');
      }
    };

    socket.on('new-message', handleNewMessage);
    socket.on('user-typing', handleUserTyping);
    socket.on('message-edited', handleMessageEdited);
    socket.on('message-deleted', handleMessageDeleted);
    socket.on('messages-read', handleMessagesRead);
    socket.on('error', handleError);

    return () => {
      console.log('🚪 ContactSellerModal leaving chat room:', currentChat._id);
      socket.off('new-message', handleNewMessage);
      socket.off('user-typing', handleUserTyping);
      socket.off('message-edited', handleMessageEdited);
      socket.off('message-deleted', handleMessageDeleted);
      socket.off('messages-read', handleMessagesRead);
      socket.off('error', handleError);
      
      if (socket.connected) {
        socket.emit('leave-chat', currentChat._id);
      }
    };
  }, [socket, socketConnected, currentChat, dispatch, user, navigate, onClose]);

  // Sync Redux messages with local state
  useEffect(() => {
    if (messages && messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setChatInitialized(false);
      setMessage('');
      setAttachments([]);
      setOtherUserTyping(false);
      setAuthError(false);
      setLocalMessages([]);
      setConnectionAttempts(0);
      setChatError(null);
    } else {
      dispatch(resetChat());
      setLocalMessages([]);
      if (socketRef.current) {
        socketRef.current.close();
      }
      setSocket(null);
      setSocketConnected(false);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    }
  }, [isOpen, dispatch]);

  // Initialize chat when modal opens and product is available
  useEffect(() => {
    if (isOpen && product?.seller?._id && !chatInitialized && isAuthenticated && !authError) {
      initializeChat();
    }
  }, [isOpen, product, chatInitialized, isAuthenticated, authError]);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      if (error.includes('Authentication') || error.includes('Unauthorized') || error.includes('Token')) {
        toast.error('Session expired. Please log in again.');
        dispatch(logout());
        onClose();
        navigate('/auth/login');
      } else {
        toast.error(error);
        setChatError(error);
      }
    }
  }, [error, dispatch, navigate, onClose]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const initializeChat = async () => {
    if (!isAuthenticated || !token) {
      toast.error('Please log in to start a conversation');
      onClose();
      navigate('/auth/login');
      return;
    }

    try {
      console.log('🚀 Initializing chat with seller:', product.seller._id);
      
      const result = await dispatch(createChat({
        participantId: product.seller._id,
        relatedProduct: product._id
      })).unwrap();
      
      console.log('✅ Chat initialized:', result);
      
      dispatch(setCurrentChat(result.chat));
      setLocalMessages(result.chat?.messages || []);
      setChatInitialized(true);
      
      // Join chat room once chat is created
      if (socketRef.current?.connected) {
        socketRef.current.emit('join-chat', result.chat._id);
      }
      
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      
      if (error.includes && (error.includes('Authentication') || error.includes('Unauthorized'))) {
        toast.error('Session expired. Please log in again.');
        dispatch(logout());
        onClose();
        navigate('/auth/login');
      } else {
        toast.error('Failed to start conversation. Please try again.');
        setChatError('Failed to start conversation');
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = (isTypingNow) => {
    if (!socket || !socketConnected || !currentChat) return;

    try {
      setIsTyping(isTypingNow);
      socket.emit('typing', {
        chatId: currentChat._id,
        isTyping: isTypingNow
      });

      if (isTypingNow) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          handleTyping(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error handling typing:', error);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    
    if (e.target.value.trim() && !isTyping) {
      handleTyping(true);
    } else if (!e.target.value.trim() && isTyping) {
      handleTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      toast.error('Please log in to send messages');
      onClose();
      navigate('/auth/login');
      return;
    }

    if ((!message.trim() && attachments.length === 0) || !currentChat?._id) return;
    
    setIsSubmitting(true);
    handleTyping(false); // Stop typing indicator
    
    try {
      console.log('📤 Sending message from ContactSellerModal');
      
      const messageData = {
        content: message,
        messageType: 'text',
        attachments: attachments.map(att => att.url)
      };

      const result = await dispatch(sendMessage({
        chatId: currentChat._id,
        messageData
      })).unwrap();
      
      console.log('✅ Message sent successfully:', result);
      
      // Add message to local state immediately for UI responsiveness
      const newMessage = {
        ...result.message,
        sender: {
          _id: user._id,
          displayName: user.displayName || `${user.customerProfile?.firstName} ${user.customerProfile?.lastName}`.trim() || user.email
        }
      };
      
      setLocalMessages(prev => {
        const messageExists = prev.some(msg => msg._id === newMessage._id);
        if (!messageExists) {
          const updated = [...prev, newMessage];
          return updated.sort((a, b) => 
            new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
          );
        }
        return prev;
      });
      
      setMessage('');
      setAttachments([]);
      
      // Scroll to bottom after sending
      setTimeout(() => scrollToBottom(), 100);
      
    } catch (error) {
      console.error('Send message error:', error);
      
      if (error.includes && (error.includes('Authentication') || error.includes('Unauthorized'))) {
        toast.error('Session expired. Please log in again.');
        dispatch(logout());
        onClose();
        navigate('/auth/login');
      } else {
        toast.error(error || 'Failed to send message');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 5) {
      toast.error('Maximum 5 attachments allowed');
      return;
    }
    
    const newAttachments = files.map(file => ({
      name: file.name,
      type: file.type.split('/')[0],
      size: file.size,
      url: URL.createObjectURL(file),
      file
    }));
    
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const getSellerInfo = (seller) => {
    if (!seller) return { name: 'Unknown', type: 'User', verified: false };

    // Check if seller has display info (from updated backend)
    if (seller.displayName) {
      return {
        name: seller.displayName,
        type: seller.userType === 'company' ? 'Company' : 
              seller.userType === 'individual' ? 'Individual Seller' : 
              'User',
        verified: seller.isVerified || false,
        avatar: seller.avatar
      };
    }

    // Fallback to old structure
    if (seller.userType === 'company') {
      return {
        name: seller.companyProfile?.companyName || 'Company',
        type: 'Company',
        verified: seller.isVerified,
        avatar: seller.companyProfile?.logo
      };
    } else if (seller.userType === 'individual') {
      return {
        name: `${seller.individualProfile?.firstName || ''} ${seller.individualProfile?.lastName || ''}`.trim() || 'Individual',
        type: 'Individual Seller',
        verified: seller.isVerified,
        avatar: seller.individualProfile?.avatar
      };
    }
    
    return {
      name: 'User',
      type: 'Seller',
      verified: false,
      avatar: null
    };
  };

  const getMessageSenderName = (message) => {
    const sender = message.sender;
    if (!sender) return 'Unknown';
    
    if (sender._id === user?._id) return 'You';
    
    // Check if sender has display info (from updated backend)
    if (sender.displayName) {
      return sender.displayName;
    }

    // Fallback to old structure
    if (sender.companyProfile?.companyName) {
      return sender.companyProfile.companyName;
    }
    
    if (sender.individualProfile?.firstName) {
      return `${sender.individualProfile.firstName} ${sender.individualProfile.lastName || ''}`.trim();
    }

    if (sender.customerProfile?.firstName) {
      return `${sender.customerProfile.firstName} ${sender.customerProfile.lastName || ''}`.trim();
    }
    
    return 'User';
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Authentication Required" size="md">
        <div className="p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Please Log In
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to contact the seller.
          </p>
          <div className="flex space-x-3 justify-center">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={() => {
              onClose();
              navigate('/auth/login');
            }}>
              Log In
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (!product?.seller) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Contact Seller" size="xl">
        <div className="p-4 text-center">
          <p className="text-red-500">Seller information is not available</p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  const sellerInfo = getSellerInfo(product.seller);
  const displayMessages = localMessages.length > 0 ? localMessages : messages;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      className="flex flex-col h-[85vh]"
    >
      <div className="flex flex-col h-full">
        {/* Header with seller info */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                {sellerInfo.avatar ? (
                  <img
                    src={sellerInfo.avatar}
                    alt={sellerInfo.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {sellerInfo.name}
                  </h3>
                  {sellerInfo.verified && (
                    <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sellerInfo.type}
                  {otherUserTyping && socketConnected && (
                    <span className="ml-2 text-green-500">typing...</span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className={`text-xs ${socketConnected ? 'text-green-600' : 'text-gray-500'}`}>
                    {socketConnected ? 'Online' : 'Offline'}
                  </span>
                </div>            
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Connection status warnings */}
          {!socketConnected && !authError && chatError && (
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                ⚠️ {chatError}
              </p>
            </div>
          )}
        </div>

        {/* Product info banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-center space-x-4">
            <img
              src={product?.media?.images?.[0]?.url || '/api/placeholder/60/60'}
              alt={product?.title || 'Product'}
              className="w-14 h-14 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-blue-900 dark:text-blue-100 truncate">
                {product?.title || 'Product'}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200 truncate">
                {product?.productType === 'real-estate' 
                  ? `${product?.realEstateDetails?.location?.city || 'Location'} • ${product?.realEstateDetails?.bedrooms || 0} bed, ${product?.realEstateDetails?.bathrooms || 0} bath`
                  : product?.serviceDetails?.serviceType?.replace('-', ' ') || 'Service'
                }
              </p>
              <div className="text-lg font-bold text-blue-900 dark:text-blue-100 mt-1">
                {formatCurrency(product?.pricing?.basePrice, product?.pricing?.currency)}
                {product?.pricing?.priceType && product?.pricing?.priceType !== 'fixed' && (
                  <span className="text-sm font-normal ml-1">
                    {product?.pricing?.priceType?.replace('-', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && !chatInitialized ? (
            <div className="h-full flex items-center justify-center">
              <LoadingSpinner size="md" text="Starting conversation..." />
            </div>
          ) : !currentChat && !chatInitialized ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {chatError ? 'Unable to start conversation' : 'Loading conversation...'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {chatError || 'Please wait while we connect you with the seller.'}
              </p>
              {chatError && (
                <Button onClick={initializeChat} size="sm">
                  Retry
                </Button>
              )}
            </div>
          ) : displayMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Start a conversation with {sellerInfo.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Ask questions about this {product?.productType === 'real-estate' ? 'property' : 'service'}, 
                discuss pricing, or arrange a {product?.productType === 'real-estate' ? 'viewing' : 'consultation'}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayMessages.map((msg) => {
                const isOwnMessage = msg.sender?._id === user?._id;
                const senderName = getMessageSenderName(msg);
                
                return (
                  <div 
                    key={msg._id || `${msg.content}-${msg.createdAt}`} 
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-xs md:max-w-md lg:max-w-lg">
                      {!isOwnMessage && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
                          {senderName}
                        </p>
                      )}
                      <div 
                        className={`rounded-lg p-3 ${
                          isOwnMessage 
                            ? 'bg-primary-500 text-white rounded-br-sm' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                        <div className={`text-xs mt-1 flex items-center justify-between ${
                          isOwnMessage ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <span>{formatRelativeTime(msg.createdAt || msg.timestamp)}</span>
                          {msg.isEdited && (
                            <span className="italic">(edited)</span>
                          )}
                          {isOwnMessage && (
                            <span className="text-xs">
                              {msg.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing indicator */}
              {otherUserTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message input area */}
        {chatInitialized && currentChat && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {attachments.map((file, index) => (
                  <div key={index} className="relative bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                    <div className="flex items-center space-x-2">
                      <PaperClipIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm truncate max-w-xs">{file.name}</span>
                      <button 
                        onClick={() => removeAttachment(index)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={handleMessageChange}
                  placeholder={`Message ${sellerInfo.name}...`}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  disabled={!isAuthenticated || !chatInitialized}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleAttachmentChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  disabled={!isAuthenticated || !chatInitialized}
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Attach file"
                  disabled={!isAuthenticated || !chatInitialized}
                >
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                
                <Button
                  type="submit"
                  size="sm"
                  loading={isSubmitting || isSending}
                  disabled={(!message.trim() && attachments.length === 0) || !isAuthenticated || !chatInitialized}
                  className="h-10 px-3"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Press Enter to send, Shift+Enter for new line
              {socketConnected && <span className="ml-2">• Real-time connected</span>}
              {!socketConnected && !authError && <span className="ml-2">• Real-time unavailable</span>}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ContactSellerModal;