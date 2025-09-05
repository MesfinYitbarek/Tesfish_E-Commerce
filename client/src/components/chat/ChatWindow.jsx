import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  InformationCircleIcon,
  FaceSmileIcon,
  UserIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChat,
  sendMessage,
  editMessage,
  deleteMessage,
  blockUser,
  unblockUser,
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
  isAdmin,
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
  const [showAdminActions, setShowAdminActions] = useState(false);
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

  useEffect(() => {
    if (conversation?.id) {
      console.log('📂 Fetching chat data for:', conversation.id);
      dispatch(fetchChat(conversation.id));
    }
  }, [conversation?.id, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !conversation?.id || !socketConnected) return;

    console.log('🏠 ChatWindow joining chat room:', conversation.id);

    socket.emit('join-chat', conversation.id);

    const handleNewMessage = (data) => {
      console.log('📨 ChatWindow received new message:', data);

      if (data.chatId === conversation.id) {
        console.log('✅ Adding message to current chat');

        dispatch(addMessage({
          ...data.message,
          chatId: data.chatId
        }));

        // Show context-aware notifications
        if (isAdmin && data.message.sender?.userType === 'customer') {
          const productTitle = conversation.listing?.title;
          if (productTitle) {
            toast.info(`Customer question about "${productTitle}"`, { duration: 3000 });
          }
        }

        setTimeout(() => scrollToBottom(), 50);
      }
    };

    const handleUserTyping = (data) => {
      if (data.chatId === conversation.id && data.userId !== currentUserId) {
        setOtherUserTyping(data.isTyping);
        if (data.isTyping) {
          setTimeout(() => setOtherUserTyping(false), 3000);
        }
      }
    };

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

    const handleMessagesRead = (data) => {
      if (data.chatId === conversation.id) {
        dispatch(markMessagesAsRead({
          chatId: conversation.id,
          readBy: data.readBy
        }));
      }
    };

    const handleChatBlocked = (data) => {
      if (data.chatId === conversation.id) {
        toast.warning('This chat has been blocked');
      }
    };

    const handleChatUnblocked = (data) => {
      if (data.chatId === conversation.id) {
        toast.success('This chat has been unblocked');
      }
    };

    socket.on('new-message', handleNewMessage);
    socket.on('user-typing', handleUserTyping);
    socket.on('message-edited', handleMessageEdited);
    socket.on('message-deleted', handleMessageDeleted);
    socket.on('messages-read', handleMessagesRead);
    socket.on('chat-blocked', handleChatBlocked);
    socket.on('chat-unblocked', handleChatUnblocked);

    return () => {
      console.log('🚪 ChatWindow leaving chat room:', conversation.id);
      socket.off('new-message', handleNewMessage);
      socket.off('user-typing', handleUserTyping);
      socket.off('message-edited', handleMessageEdited);
      socket.off('message-deleted', handleMessageDeleted);
      socket.off('messages-read', handleMessagesRead);
      socket.off('chat-blocked', handleChatBlocked);
      socket.off('chat-unblocked', handleChatUnblocked);

      if (socket.connected) {
        socket.emit('leave-chat', conversation.id);
      }
    };
  }, [socket, conversation?.id, currentUserId, dispatch, socketConnected, isAdmin, conversation?.listing?.title]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = (isTypingNow) => {
    if (!socket || !conversation?.id || !socketConnected) return;

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

    handleTyping(false);

    try {
      let messageContent = newMessage.trim();

      const messageData = {
        content: messageContent,
        messageType: 'text',
        attachments: []
      };

      // Handle file attachments
      if (fileInputRef.current?.files?.length > 0) {
        setUploadingFiles(true);
        const files = Array.from(fileInputRef.current.files);

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

      const result = await dispatch(sendMessage({
        chatId: conversation.id,
        messageData
      })).unwrap();

      setNewMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

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

  const handleBlockUser = async () => {
    try {
      const participantId = conversation.participant.id;
      await dispatch(blockUser({ 
        chatId: conversation.id, 
        userId: participantId 
      })).unwrap();
      
      setShowAdminActions(false);
      toast.success('User blocked successfully');
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async () => {
    try {
      await dispatch(unblockUser(conversation.id)).unwrap();
      setShowAdminActions(false);
      toast.success('User unblocked successfully');
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    }
  };

  const handleBackToList = () => {
    onToggleSidebar();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const participant = conversation?.participant;
  const listing = conversation?.listing;
  const isBlocked = conversation?.blocked;
  const isCustomer = participant?.type === 'customer';

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

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
                  {isAdmin ? (
                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
                  )}
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
                {(participant?.isVerified || participant?.isSupport) && (
                  <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                )}
                {participant?.isSupport && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    Team
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isAdmin && isCustomer ? 'Customer' :
                   !isAdmin && participant?.isSupport ? 'TesGold Support Team' :
                   participant?.type === 'company' ? 'Company' :
                   participant?.type === 'individual' ? 'Individual Seller' : 'User'}
                </p>
                {otherUserTyping && socketConnected && (
                  <span className="text-sm text-green-500">typing...</span>
                )}
                {!otherUserTyping && participant?.isOnline && socketConnected && (
                  <span className="text-sm text-green-500">online</span>
                )}
              </div>
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

          {/* Admin Actions */}
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setShowAdminActions(!showAdminActions)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                title="Admin actions"
              >
                <ShieldCheckIcon className="h-5 w-5" />
              </button>
              
              {showAdminActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                  <div className="py-1">
                    {isBlocked ? (
                      <button
                        onClick={handleUnblockUser}
                        className="block w-full text-left px-4 py-2 text-sm text-green-700 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Unblock Customer
                      </button>
                    ) : (
                      <button
                        onClick={handleBlockUser}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Block Customer
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setShowContactInfo(!showContactInfo)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            title="Contact info"
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Product Context Bar - Shows for all product-related chats */}
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
                {isAdmin ? `Customer inquiry: ${listing.title}` : `About: ${listing.title}`}
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {formatCurrency(listing.price, listing.currency || 'ETB')}
                </p>
                {listing.seller && isAdmin && (
                  <div className="flex items-center space-x-1">
                    <BuildingOfficeIcon className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      Seller: {listing.seller.companyProfile?.companyName || 
                              `${listing.seller.individualProfile?.firstName} ${listing.seller.individualProfile?.lastName}`.trim()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button size="sm" variant="outline">
              View Product
            </Button>
          </div>
        </div>
      )}
      {/* Customer Context Bar - Shows they're talking to TesGold team */}
      {!isAdmin && participant?.isSupport && (
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
            💬 You're chatting with TesGold's professional team about this product
          </p>
        </div>
      )}

      {/* Chat Status Warnings */}
      {isBlocked && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300 text-sm">
              This conversation has been blocked. No new messages can be sent.
            </p>
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
              isAdmin={isAdmin}
              isLoading={isLoading}
              isTyping={otherUserTyping}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {!isBlocked && (
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
                      placeholder={
                        isAdmin 
                          ? `Respond to customer about ${listing?.title || 'this product'}...`
                          : `Message about ${listing?.title || 'this product'}...`
                      }
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
                {isAdmin && listing && (
                  <span className="ml-2">• Representing seller</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contact Info Panel */}
        {showContactInfo && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700">
            <ContactInfo
              conversation={conversation}
              isAdmin={isAdmin}
              onClose={() => setShowContactInfo(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;