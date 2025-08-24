// Updated ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  FaceSmileIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChat,
  sendMessage,
  editMessage,
  deleteMessage,
  addMessage,
  updateMessage,
  removeMessage,
  markMessagesAsRead
} from '../../store/slices/chatSlice';
import chatService from '../../services/chatService';
import MessageThread from './MessageThread';
import ContactInfo from './ContactInfo';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const ChatWindow = ({
  conversation,
  currentUserId,
  onToggleSidebar,
  sidebarOpen,
  socket,
  socketConnected
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const dispatch = useDispatch();

  const {
    messages,
    isLoading,
    isSending,
    error
  } = useSelector((state) => state.chat);

  // Fetch chat data when conversation changes
  useEffect(() => {
    if (conversation?.id) {
      console.log('📂 Fetching chat data for:', conversation.id);
      dispatch(fetchChat(conversation.id));
    }
  }, [conversation?.id, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !conversation?.id || !socketConnected) return;

    console.log('🏠 ChatWindow joining chat room:', conversation.id);

    // Join chat room
    socket.emit('join-chat', conversation.id);

    // Listen for new messages - NO REFRESH, JUST APPEND
    const handleNewMessage = (data) => {
      console.log('📨 ChatWindow received new message:', data);

      if (data.chatId === conversation.id) {
        console.log('✅ Adding message to current chat (Telegram style)');

        // Add message immediately without any refresh
        dispatch(addMessage({
          ...data.message,
          chatId: data.chatId
        }));

        // Scroll to bottom smoothly
        setTimeout(() => scrollToBottom(), 50);
      }
    };

    // Listen for typing events
    const handleUserTyping = (data) => {
      if (data.chatId === conversation.id && data.userId !== currentUserId) {
        setOtherUserTyping(data.isTyping);
        if (data.isTyping) {
          setTimeout(() => setOtherUserTyping(false), 3000);
        }
      }
    };

    // Listen for message updates - UPDATE SPECIFIC MESSAGE ONLY
    const handleMessageEdited = (data) => {
      if (data.chatId === conversation.id) {
        dispatch(updateMessage({
          messageId: data.message._id,
          updates: data.message
        }));
      }
    };

    const handleMessageDeleted = (data) => {
      if (data.chatId === conversation.id) {
        dispatch(removeMessage(data.messageId));
      }
    };

    // Listen for read status updates - UPDATE READ STATUS ONLY
    const handleMessagesRead = (data) => {
      if (data.chatId === conversation.id) {
        dispatch(markMessagesAsRead({
          chatId: conversation.id,
          readBy: data.readBy
        }));
      }
    };

    socket.on('new-message', handleNewMessage);
    socket.on('user-typing', handleUserTyping);
    socket.on('message-edited', handleMessageEdited);
    socket.on('message-deleted', handleMessageDeleted);
    socket.on('messages-read', handleMessagesRead);

    return () => {
      console.log('🚪 ChatWindow leaving chat room:', conversation.id);
      socket.off('new-message', handleNewMessage);
      socket.off('user-typing', handleUserTyping);
      socket.off('message-edited', handleMessageEdited);
      socket.off('message-deleted', handleMessageDeleted);
      socket.off('messages-read', handleMessagesRead);

      if (socket.connected) {
        socket.emit('leave-chat', conversation.id);
      }
    };
  }, [socket, conversation?.id, currentUserId, dispatch, socketConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = (isTypingNow) => {
    if (!socket || !conversation?.id || !socketConnected) return;

    console.log('⌨️ Emitting typing status:', { isTypingNow, chatId: conversation.id });
    setIsTyping(isTypingNow);
    socket.emit('typing', {
      chatId: conversation.id,
      isTyping: isTypingNow
    });

    if (isTypingNow) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 2000);
    }
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);

    if (e.target.value.trim() && !isTyping) {
      handleTyping(true);
    } else if (!e.target.value.trim() && isTyping) {
      handleTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() && !fileInputRef.current?.files?.length) return;

    handleTyping(false); // Stop typing indicator

    try {
      const messageData = {
        content: newMessage.trim(),
        messageType: 'text',
        attachments: []
      };

      // Handle file attachments
      if (fileInputRef.current?.files?.length > 0) {
        setUploadingFiles(true);
        const files = Array.from(fileInputRef.current.files);

        // Upload files first
        for (const file of files) {
          try {
            const uploadResult = await chatService.uploadAttachment(file);
            messageData.attachments.push({
              type: file.type.startsWith('image/') ? 'image' : 'file',
              url: uploadResult.data.url,
              name: file.name
            });
          } catch (uploadError) {
            console.error('Error uploading file:', uploadError);
          }
        }
        setUploadingFiles(false);
      }

      console.log('📤 Sending message:', { chatId: conversation.id, messageData });

      // Send message using Redux action
      const result = await dispatch(sendMessage({
        chatId: conversation.id,
        messageData
      })).unwrap();

      // Clear the input
      setNewMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Scroll to bottom after sending
      setTimeout(() => scrollToBottom(), 100);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setUploadingFiles(false);
    }
  };

  const handleEditMessage = async (messageId, content) => {
    try {
      await dispatch(editMessage({
        chatId: conversation.id,
        messageId,
        content
      })).unwrap();
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  };
  const handleBackToList = () => {
    // On mobile, show sidebar but keep current chat selected
    onToggleSidebar();
    // Don't clear the current chat - just toggle sidebar visibility
  };
  const handleDeleteMessage = async (messageId) => {
    try {
      await dispatch(deleteMessage({
        chatId: conversation.id,
        messageId
      })).unwrap();
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const participant = conversation?.participant;
  const listing = conversation?.listing;

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  console.log('💬 ChatWindow render - Messages count:', messages?.length);
  console.log('💬 Socket connected:', socketConnected);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          {!sidebarOpen && (
            <button
              onClick={handleBackToList} 
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 md:hidden"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}

          {/* Participant Info */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              {participant?.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              {participant?.isOnline && socketConnected && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  {participant?.name || 'Unknown User'}
                </h2>
                {participant?.isVerified && (
                  <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {participant?.type === 'company' ? 'Company' :
                  participant?.type === 'individual' ? 'Individual Seller' : 'Customer'}
                {otherUserTyping && socketConnected && (
                  <span className="ml-2 text-green-500">typing...</span>
                )}
                {!otherUserTyping && participant?.isOnline && socketConnected && (
                  <span className="ml-2 text-green-500">online</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className={`text-xs ${socketConnected ? 'text-green-600' : 'text-gray-500'}`}>
              {socketConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
          <button
            onClick={() => setShowContactInfo(!showContactInfo)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            title="Contact info"
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Listing Info Bar */}
      {listing && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <img
              src={listing.image}
              alt={listing.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 truncate">
                {listing.title}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {formatCurrency(listing.price, listing.currency || 'ETB')}
              </p>
            </div>
            <Button size="sm" variant="outline">
              View Listing
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300 text-sm">
            {error}
          </p>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto">
            <MessageThread
              messages={messages || []}
              currentUserId={currentUserId}
              participant={participant}
              isLoading={isLoading}
              isTyping={otherUserTyping}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {uploadingFiles && (
              <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Uploading files...
                </p>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={newMessage}
                    onChange={handleMessageChange}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    disabled={isSending || uploadingFiles}
                  />

                  {/* Attachment and Emoji Buttons */}
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={handleFileSelect}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Attach file"
                      disabled={isSending || uploadingFiles}
                    >
                      <PaperClipIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Add emoji"
                    >
                      <FaceSmileIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!newMessage.trim() || isSending || uploadingFiles}
                loading={isSending || uploadingFiles}
                className="px-4 py-3"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </Button>
            </form>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => {
                console.log('Files selected:', e.target.files);
              }}
              className="hidden"
            />

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Press Enter to send, Shift+Enter for new line
              {socketConnected && <span className="ml-2">• Real-time connected</span>}
              {!socketConnected && <span className="ml-2">• Real-time offline</span>}
            </div>
          </div>
        </div>

        {/* Contact Info Panel */}
        {showContactInfo && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700">
            <ContactInfo
              conversation={conversation}
              onClose={() => setShowContactInfo(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;