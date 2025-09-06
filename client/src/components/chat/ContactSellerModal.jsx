// components/chat/ContactSellerModal.jsx - Fixed input visibility
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
  ShieldCheckIcon,
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
  const [adminOnline, setAdminOnline] = useState(false);
  const [initializingChat, setInitializingChat] = useState(false);
  
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
      toast.error('Please log in to inquire about this product');
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

  // Initialize socket connection
  useEffect(() => {
    if (isOpen && token && isAuthenticated && !authError) {
      const initializeSocket = () => {
        const serverUrl = import.meta.env.VITE_API_BASE_URL_SOCKET;
        
        console.log('🔌 Initializing socket connection for product inquiry...');
        
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
          console.log('✅ Connected to chat server for product inquiry');
          setSocketConnected(true);
          setSocket(newSocket);
          socketRef.current = newSocket;
          setConnectionAttempts(0);
          setAuthError(false);
          setChatError(null);
        });

        newSocket.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
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
            setChatError('Real-time chat unavailable. Your message will still be delivered.');
          }
        });

        newSocket.on('disconnect', (reason) => {
          console.log('🔌 Socket disconnected:', reason);
          setSocketConnected(false);
          setAdminOnline(false);
        });

        newSocket.on('reconnect', () => {
          console.log('🔄 Socket reconnected');
          setSocketConnected(true);
          setConnectionAttempts(0);
          setChatError(null);
          
          if (currentChat?._id) {
            newSocket.emit('join-chat', currentChat._id);
          }
        });

        // Listen for admin status
        newSocket.on('admin-online', () => {
          setAdminOnline(true);
        });

        newSocket.on('admin-offline', () => {
          setAdminOnline(false);
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
        setAdminOnline(false);
        socketRef.current = null;
      };
    }
  }, [isOpen, token, isAuthenticated, authError, dispatch, navigate, onClose, connectionAttempts, currentChat?._id]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !socketConnected || !currentChat) return;

    console.log('🏠 Joining chat room for product inquiry:', currentChat._id);
    socket.emit('join-chat', currentChat._id);

    const handleNewMessage = (data) => {
      console.log('📨 Received new message in product inquiry:', data);
      try {
        if (data.chatId === currentChat._id) {
          console.log('✅ Adding admin response to product inquiry');
          
          if (data.message.sender?.userType === 'admin') {
            toast.success('CitiLights team responded about your product inquiry', { duration: 3000 });
          }
          
          dispatch(addMessage({
            ...data.message,
            chatId: data.chatId
          }));
          
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
          
          setTimeout(() => scrollToBottom(), 100);
        }
      } catch (error) {
        console.error('Error handling new message:', error);
      }
    };

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

    const handleMessagesRead = (data) => {
      try {
        if (data.chatId === currentChat._id) {
          setLocalMessages(prev => prev.map(msg => ({
            ...msg,
            isRead: msg.sender?._id === user?._id ? true : msg.isRead
          })));
        }
      } catch (error) {
        console.error('Error handling read status:', error);
      }
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
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
      console.log('🚪 Leaving product inquiry chat room:', currentChat._id);
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
      setInitializingChat(false);
      setMessage('');
      setAttachments([]);
      setOtherUserTyping(false);
      setAuthError(false);
      setLocalMessages([]);
      setConnectionAttempts(0);
      setChatError(null);
      setAdminOnline(false);
    } else {
      dispatch(resetChat());
      setLocalMessages([]);
      if (socketRef.current) {
        socketRef.current.close();
      }
      setSocket(null);
      setSocketConnected(false);
      setAdminOnline(false);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    }
  }, [isOpen, dispatch]);

  // Initialize chat when modal opens - Auto initialize
  useEffect(() => {
    if (isOpen && product?._id && !chatInitialized && !initializingChat && isAuthenticated && !authError) {
      initializeChat();
    }
  }, [isOpen, product, chatInitialized, initializingChat, isAuthenticated, authError]);

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
      toast.error('Please log in to inquire about this product');
      onClose();
      navigate('/auth/login');
      return;
    }

    if (initializingChat) return; // Prevent multiple initialization attempts

    setInitializingChat(true);

    try {
      console.log('🚀 Starting product inquiry chat');
      
      // Create chat - backend will route to admin automatically
      const result = await dispatch(createChat({
        participantId: 'admin', // Signal that this should go to admin
        relatedProduct: product._id
      })).unwrap();
      
      console.log('✅ Product inquiry chat initialized:', result);
      
      dispatch(setCurrentChat(result.chat));
      setLocalMessages(result.chat?.messages || []);
      setChatInitialized(true);
      
      if (socketRef.current?.connected) {
        socketRef.current.emit('join-chat', result.chat._id);
      }
      
    } catch (error) {
      console.error('Failed to initialize product inquiry chat:', error);
      
      if (error.includes && (error.includes('Authentication') || error.includes('Unauthorized'))) {
        toast.error('Session expired. Please log in again.');
        dispatch(logout());
        onClose();
        navigate('/auth/login');
      } else {
        toast.error('Failed to start product inquiry. Please try again.');
        setChatError('Failed to start product inquiry');
      }
    } finally {
      setInitializingChat(false);
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

    // If chat is not initialized yet, try to initialize it first
    if (!currentChat && !initializingChat) {
      toast.info('Setting up your chat...');
      await initializeChat();
      return;
    }

    if ((!message.trim() && attachments.length === 0)) return;
    
    // If chat is still not ready, queue the message
    if (!currentChat) {
      toast.error('Please wait for chat to initialize');
      return;
    }
    
    setIsSubmitting(true);
    handleTyping(false);
    
    try {
      console.log('📤 Sending product inquiry message');
      
      const messageData = {
        content: message,
        messageType: 'text',
        attachments: attachments.map(att => att.url)
      };

      const result = await dispatch(sendMessage({
        chatId: currentChat._id,
        messageData
      })).unwrap();
      
      console.log('✅ Product inquiry message sent:', result);
      
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

  const getMessageSenderName = (message) => {
    const sender = message.sender;
    if (!sender) return 'Unknown';
    
    if (sender._id === user?._id) return 'You';
    
    // Handle admin sender - always show as CitiLights Team
    if (sender.userType === 'admin' || sender.displayName === 'CitiLights Support' || sender.displayName === 'CitiLights Team') {
      return 'CitiLights Team';
    }
    
    if (sender.displayName) {
      return sender.displayName;
    }

    return 'CitiLights Team'; // Default for any non-customer sender
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
            You need to be logged in to inquire about this product.
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

  if (!product) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Product Inquiry" size="xl">
        <div className="p-4 text-center">
          <p className="text-red-500">Product information is not available</p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  const displayMessages = localMessages.length > 0 ? localMessages : messages;
  const isInputDisabled = !isAuthenticated || isSubmitting || isSending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      className="flex flex-col h-[85vh]"
    >
      <div className="flex flex-col h-full">
        {/* Header with CitiLights Team info */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    CitiLights Team
                  </h3>
                  <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    Official
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Product Support Specialists
                  {otherUserTyping && socketConnected && (
                    <span className="ml-2 text-green-500">typing...</span>
                  )}
                  {adminOnline && socketConnected && !otherUserTyping && (
                    <span className="ml-2 text-green-500">online</span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className={`text-xs ${socketConnected ? 'text-green-600' : 'text-gray-500'}`}>
                    {socketConnected ? 'Connected' : 'Offline'}
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
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-4 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <img
              src={product?.media?.images?.[0]?.url || '/api/placeholder/60/60'}
              alt={product?.title || 'Product'}
              className="w-14 h-14 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-blue-900 dark:text-blue-100 truncate">
                Product Inquiry: {product?.title || 'Product'}
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

        {/* Chat Status */}
        {initializingChat && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Setting up your chat with our team...
              </p>
            </div>
          </div>
        )}

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {(isLoading || initializingChat) && displayMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <LoadingSpinner size="md" text="Connecting to our team..." />
            </div>
          ) : displayMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <ShieldCheckIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Welcome to CitiLights Product Support
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Ask any questions about this {product?.productType === 'real-estate' ? 'property' : 'service'}. 
                Our team will provide you with detailed information, pricing, availability, and help you make the best decision.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayMessages.map((msg) => {
                const isOwnMessage = msg.sender?._id === user?._id;
                const senderName = getMessageSenderName(msg);
                const isTeamMessage = senderName === 'CitiLights Team';
                
                return (
                  <div 
                    key={msg._id || `${msg.content}-${msg.createdAt}`} 
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-xs md:max-w-md lg:max-w-lg">
                      {!isOwnMessage && (
                        <div className="flex items-center space-x-2 mb-1 px-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {senderName}
                          </p>
                          {isTeamMessage && (
                            <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                              Team
                            </span>
                          )}
                        </div>
                      )}
                      <div 
                        className={`rounded-lg p-3 ${
                          isOwnMessage 
                            ? 'bg-primary-500 text-white rounded-br-sm' 
                            : isTeamMessage
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-bl-sm border border-blue-200 dark:border-blue-800'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                        <div className={`text-xs mt-1 flex items-center justify-between ${
                          isOwnMessage 
                            ? 'text-primary-100' 
                            : isTeamMessage 
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
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
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-lg px-3 py-2 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-700 dark:text-blue-300">CitiLights Team is typing</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message input area - Always visible */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
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
                placeholder={
                  initializingChat 
                    ? "Setting up chat..." 
                    : `Ask about ${product?.title || 'this product'}...`
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base disabled:opacity-60"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                disabled={isInputDisabled || initializingChat}
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
                disabled={isInputDisabled || initializingChat}
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Attach file"
                disabled={isInputDisabled || initializingChat}
              >
                <PaperClipIcon className="h-5 w-5" />
              </button>
              
              <Button
                type="submit"
                size="sm"
                loading={isSubmitting || isSending || initializingChat}
                disabled={(!message.trim() && attachments.length === 0) || isInputDisabled || initializingChat}
                className="h-10 px-3"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send, Shift+Enter for new line
            {socketConnected && <span className="ml-2">• Connected to our team</span>}
            {!socketConnected && !authError && <span className="ml-2">• Connecting...</span>}
            {adminOnline && <span className="ml-2">• Team online</span>}
            {initializingChat && <span className="ml-2">• Setting up chat...</span>}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ContactSellerModal;