import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import { addMessage } from '../../store/slices/serviceInquirySlice';
import { formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const ServiceMessaging = ({ inquiry, currentUserId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { isSubmitting } = useSelector((state) => state.serviceInquiry);

  useEffect(() => {
    scrollToBottom();
  }, [inquiry?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats'];

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        toast.error(`${file.name} is not a supported file type.`);
        return false;
      }
      
      return true;
    });

    if (attachments.length + validFiles.length > 3) {
      toast.error('Maximum 3 files allowed');
      return;
    }

    const newAttachments = validFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      await dispatch(addMessage({
        inquiryId: inquiry._id,
        message: newMessage.trim()
      })).unwrap();

      setNewMessage('');
      setAttachments([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    }
  };

  const getSenderName = (message) => {
    if (!message.sender) return 'Unknown';
    
    if (message.sender._id === currentUserId) return 'You';
    
    // Service provider (admin)
    if (message.sender.userType === 'admin') {
      return 'TesGold Services';
    }
    
    // Customer
    if (message.sender.customerProfile) {
      return `${message.sender.customerProfile.firstName} ${message.sender.customerProfile.lastName}`.trim();
    }
    
    // Company
    if (message.sender.companyProfile) {
      return message.sender.companyProfile.companyName;
    }
    
    // Individual
    if (message.sender.individualProfile) {
      return `${message.sender.individualProfile.firstName} ${message.sender.individualProfile.lastName}`.trim();
    }
    
    return 'User';
  };

  const getSenderAvatar = (message) => {
    if (!message.sender) return null;
    
    if (message.sender.customerProfile?.avatar) {
      return message.sender.customerProfile.avatar;
    }
    
    if (message.sender.companyProfile?.logo) {
      return message.sender.companyProfile.logo;
    }
    
    if (message.sender.individualProfile?.avatar) {
      return message.sender.individualProfile.avatar;
    }
    
    return null;
  };

  const messages = inquiry?.messages || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col h-96">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Messages ({messages.length})
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Communicate with the {currentUserId === inquiry.customer?._id ? 'service provider' : 'customer'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No messages yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Start the conversation below</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.sender?._id === currentUserId;
            const senderName = getSenderName(message);
            const senderAvatar = getSenderAvatar(message);
            
            return (
              <div
                key={message._id || index}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {senderAvatar ? (
                      <img
                        src={senderAvatar}
                        alt={senderName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isOwnMessage 
                          ? 'bg-primary-100 dark:bg-primary-900' 
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}>
                        <UserIcon className={`h-4 w-4 ${
                          isOwnMessage 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    {!isOwnMessage && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
                        {senderName}
                      </p>
                    )}
                    
                    <div className={`rounded-lg px-3 py-2 ${
                      isOwnMessage
                        ? 'bg-primary-500 text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.message}
                      </p>
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, attIndex) => (
                            <a
                              key={attIndex}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block text-xs underline ${
                                isOwnMessage 
                                  ? 'text-primary-100 hover:text-white' 
                                  : 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300'
                              }`}
                            >
                              📎 {attachment.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <p className={`text-xs mt-1 px-1 ${
                      isOwnMessage 
                        ? 'text-gray-500 dark:text-gray-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatRelativeTime(message.timestamp)}
                      {message.isRead && isOwnMessage && (
                        <span className="ml-1">✓✓</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((file, index) => (
              <div key={index} className="relative bg-gray-100 dark:bg-gray-700 rounded-md p-2 pr-8">
                <div className="flex items-center space-x-2">
                  <PaperClipIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                </div>
                <button 
                  onClick={() => removeAttachment(index)}
                  className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              rows={2}
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={isSubmitting}
            />
            
            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Attach file"
              disabled={isSubmitting}
            >
              <PaperClipIcon className="h-5 w-5" />
            </button>
            
            <Button
              type="submit"
              size="sm"
              loading={isSubmitting}
              disabled={(!newMessage.trim() && attachments.length === 0) || isSubmitting}
              leftIcon={<PaperAirplaneIcon className="h-4 w-4" />}
            >
              Send
            </Button>
          </div>
        </form>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ServiceMessaging;