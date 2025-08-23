import { useState } from 'react';
import { 
  UserIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { formatRelativeTime, formatFileSize } from '../../utils/helpers';
import LoadingSpinner from '../ui/LoadingSpinner';

const MessageThread = ({ 
  messages, 
  currentUserId, 
  participant, 
  isLoading, 
  isTyping 
}) => {
  const [expandedImage, setExpandedImage] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getMessageSenderName = (message) => {
    if (!message.sender) return 'Unknown';
    if (message.sender._id === currentUserId) return 'You';
    
    // Use displayName if available (from updated backend)
    if (message.sender.displayName) {
      return message.sender.displayName;
    }
    
    return 'User';
  };

  const renderMessage = (message, index) => {
    const isOwnMessage = message.sender?._id === currentUserId;
    const showAvatar = !isOwnMessage && (index === 0 || messages[index - 1]?.sender?._id !== message.sender?._id);
    const showTimestamp = index === messages.length - 1 || 
      new Date(messages[index + 1]?.createdAt) - new Date(message.createdAt) > 5 * 60 * 1000; // 5 minutes

    return (
      <div
        key={message._id || message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs md:max-w-md lg:max-w-lg`}>
          {/* Avatar */}
          {showAvatar && !isOwnMessage && (
            <div className="w-8 h-8 flex-shrink-0">
              {participant?.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
          )}

          {!showAvatar && !isOwnMessage && <div className="w-8" />}

          {/* Message Bubble */}
          <div
            className={`relative px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            } ${
              isOwnMessage
                ? showTimestamp ? 'rounded-br-md' : ''
                : showTimestamp ? 'rounded-bl-md' : ''
            }`}
          >
            {/* Sender name for group context */}
            {!isOwnMessage && showAvatar && (
              <p className={`text-xs mb-1 font-medium ${
                isOwnMessage ? 'text-white text-opacity-80' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {getMessageSenderName(message)}
              </p>
            )}

            {/* Message Content */}
            {message.content && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, attachIndex) => (
                  <div key={attachIndex}>
                    {attachment.type === 'image' ? (
                      <div className="relative">
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ maxHeight: '200px' }}
                          onClick={() => setExpandedImage(attachment)}
                        />
                        <button
                          onClick={() => setExpandedImage(attachment)}
                          className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className={`flex items-center space-x-2 p-2 rounded-lg border ${
                        isOwnMessage 
                          ? 'border-white border-opacity-30 bg-white bg-opacity-10' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }`}>
                        <DocumentIcon className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {attachment.name}
                          </p>
                          <p className={`text-xs ${
                            isOwnMessage ? 'text-white text-opacity-80' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => window.open(attachment.url, '_blank')}
                          className={`p-1 rounded transition-colors ${
                            isOwnMessage
                              ? 'hover:bg-white hover:bg-opacity-20'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Message Status */}
            {isOwnMessage && (
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${
                  message.isRead 
                    ? 'text-white text-opacity-70' 
                    : 'text-white text-opacity-50'
                }`}>
                  {message.isRead ? '✓✓' : '✓'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Timestamp */}
        {showTimestamp && (
          <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mt-1`}>
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2">
              {formatRelativeTime(message.createdAt)}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-2">
      {/* Welcome Message */}
      {messages.length > 0 && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <span>Conversation started</span>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((message, index) => renderMessage(message, index))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex justify-start mb-4">
          <div className="flex items-end space-x-2">
            <div className="w-8 h-8">
              {participant?.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl rounded-bl-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Messages */}
      {messages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Start the conversation
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Send a message to {participant?.name} about their inquiry
          </p>
        </div>
      )}

      {/* Image Modal */}
      {expandedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={expandedImage.url}
              alt={expandedImage.name}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl font-bold"
            >
              ×
            </button>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-medium">{expandedImage.name}</p>
              <p className="text-sm opacity-80">{formatFileSize(expandedImage.size)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageThread;