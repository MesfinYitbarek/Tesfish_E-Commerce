import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { createChat, sendMessage, resetChat } from '../../store/slices/chatSlice';
import { formatRelativeTime, formatCurrency } from '../../utils/helpers';

const ContactSellerModal = ({ isOpen, onClose, product }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { currentChat, messages, isLoading } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setChatInitialized(false);
      setMessage('');
      setAttachments([]);
    } else {
      dispatch(resetChat());
    }
  }, [isOpen, dispatch]);

  // Initialize chat when modal opens and product is available
  useEffect(() => {
    if (isOpen && product?.seller?._id && !chatInitialized) {
      initializeChat();
    }
  }, [isOpen, product, chatInitialized]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      await dispatch(createChat({
        participantId: product.seller._id,
        relatedProduct: product._id
      })).unwrap();
      
      setChatInitialized(true);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      toast.error('Failed to start conversation');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sellerInfo = getSellerInfo(product?.seller);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!message.trim() && attachments.length === 0) || !currentChat?._id) return;
    
    setIsSubmitting(true);
    
    try {
      await dispatch(sendMessage({
        chatId: currentChat._id,
        messageData: {
          content: message,
          messageType: 'text',
          attachments: attachments.map(att => att.url)
        }
      })).unwrap();
      
      setMessage('');
      setAttachments([]);
    } catch (error) {
      toast.error(error || 'Failed to send message');
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
    
    if (sender.companyProfile?.companyName) {
      return sender.companyProfile.companyName;
    }
    
    if (sender.individualProfile?.firstName) {
      return `${sender.individualProfile.firstName} ${sender.individualProfile.lastName || ''}`.trim();
    }
    
    return 'Seller';
  };

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Seller"
      size="xl"
      className="flex flex-col h-[80vh]"
    >
      <div className="flex flex-col h-full">
        {/* Header with seller info */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              {sellerInfo.avatar ? (
                <img
                  src={sellerInfo.avatar}
                  alt={sellerInfo.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 dark:text-gray-300 font-medium text-lg">
                  {sellerInfo.name.charAt(0)}
                </span>
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
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Chat</span>
              </div>
            </div>
          </div>
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
          ) : !currentChat ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Unable to start conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Please try again or contact support if the problem persists.
              </p>
              <Button onClick={initializeChat} size="sm">
                Retry
              </Button>
            </div>
          ) : messages.length === 0 ? (
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
              {messages.map((msg) => {
                const isOwnMessage = msg.sender?._id === user?._id;
                const senderName = getMessageSenderName(msg);
                
                return (
                  <div 
                    key={msg._id || msg.createdAt} 
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
                          <span>{formatRelativeTime(msg.createdAt)}</span>
                          {msg.isEdited && (
                            <span className="italic">(edited)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message input area */}
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
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Message ${sellerInfo.name}...`}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
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
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Attach file"
              >
                <PaperClipIcon className="h-5 w-5" />
              </button>
              
              <Button
                type="submit"
                size="sm"
                loading={isSubmitting}
                disabled={!message.trim() && attachments.length === 0}
                className="h-10 px-3"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Helper function to get seller info
function getSellerInfo(seller) {
  if (!seller) return { name: 'Unknown', type: 'User', verified: false };

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
}

export default ContactSellerModal;