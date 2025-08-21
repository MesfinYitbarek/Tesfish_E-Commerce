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
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchChat, 
  sendMessage, 
  editMessage, 
  deleteMessage,
} from '../../store/slices/chatSlice';
import chatService from '../../services/chatService';
import MessageThread from './MessageThread';
import ContactInfo from './ContactInfo';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/helpers';

const ChatWindow = ({ 
  conversation, 
  currentUserId, 
  onToggleSidebar, 
  sidebarOpen 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  const { 
    messages, 
    isLoading, 
    isSending, 
    error 
  } = useSelector((state) => state.chat);

  useEffect(() => {
    if (conversation?.id) {
      dispatch(fetchChat(conversation.id));
    }
  }, [conversation?.id, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() && !fileInputRef.current?.files?.length) return;
    
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
            // Continue with other files
          }
        }
        setUploadingFiles(false);
      }

      // Send message using Redux action
      await dispatch(sendMessage({
        chatId: conversation.id,
        messageData
      })).unwrap();

      setNewMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 md:hidden"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          
          {/* Participant Info */}
          <div className="flex items-center space-x-3">
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
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {participant?.name || 'Unknown User'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {participant?.type === 'customer' ? 'Customer' : 'User'}
                {isTyping && (
                  <span className="ml-2 text-green-500">typing...</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowContactInfo(!showContactInfo)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            title="Contact info"
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            title="Voice call"
          >
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            title="Video call"
          >
            <VideoCameraIcon className="h-5 w-5" />
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
                {formatCurrency(listing.price, 'ETB')}
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
              messages={messages}
              currentUserId={currentUserId}
              participant={participant}
              isLoading={isLoading}
              isTyping={isTyping}
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
                    onChange={(e) => setNewMessage(e.target.value)}
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