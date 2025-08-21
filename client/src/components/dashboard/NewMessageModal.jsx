import { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { createChat } from '../../store/slices/chatSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';

const NewMessageModal = ({ isOpen, onClose, onCreateConversation }) => {
  const [step, setStep] = useState(1); // 1: Select recipient, 2: Compose message
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [listings, setListings] = useState([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { isLoading: isCreatingChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      fetchRecipients();
      fetchUserListings();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setStep(1);
      setSearchQuery('');
      setSelectedRecipient(null);
      setSelectedListing(null);
      setMessage('');
    }
  }, [isOpen]);

  const fetchRecipients = async () => {
    setLoadingRecipients(true);
    try {
      // This would be your actual API endpoint for potential contacts
      const response = api.get('/users/potential-contacts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('citilights_token') || sessionStorage.getItem('citilights_token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setRecipients(result.data.users || []);
      } else {
        // Fallback: fetch all users (you might want to limit this)
        const allUsersResponse = api.get('/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('citilights_token') || sessionStorage.getItem('citilights_token')}`
          }
        });
        
        if (allUsersResponse.ok) {
          const allUsersResult = await allUsersResponse.json();
          // Filter out current user
          const filteredUsers = allUsersResult.data.users?.filter(u => u._id !== user?.id) || [];
          setRecipients(filteredUsers);
        }
      }
    } catch (error) {
      console.error('Error fetching recipients:', error);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const fetchUserListings = async () => {
    setLoadingListings(true);
    try {
      const response = api.get('/products/my-products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('citilights_token') || sessionStorage.getItem('citilights_token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setListings(result.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoadingListings(false);
    }
  };

  const filteredRecipients = recipients.filter(recipient =>
    getRecipientName(recipient).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRecipientName = (recipient) => {
    if (recipient.userType === 'company' && recipient.companyProfile?.companyName) {
      return recipient.companyProfile.companyName;
    }
    
    if (recipient.userType === 'individual' && recipient.individualProfile) {
      const { firstName, lastName } = recipient.individualProfile;
      return `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown User';
    }
    
    if (recipient.userType === 'customer' && recipient.customerProfile) {
      const { firstName, lastName } = recipient.customerProfile;
      return `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown User';
    }
    
    return recipient.email || 'Unknown User';
  };

  const handleSelectRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    setStep(2);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedRecipient) return;

    try {
      const chatData = {
        participantId: selectedRecipient._id,
        relatedProduct: selectedListing?._id || null,
        message: message.trim()
      };

      const result = await dispatch(createChat(chatData)).unwrap();
      const chat = result.chat;
      
      // Format the conversation for the parent component
      const newConversation = {
        id: chat._id,
        _id: chat._id,
        participant: {
          id: selectedRecipient._id,
          name: getRecipientName(selectedRecipient),
          avatar: selectedRecipient.avatar,
          type: selectedRecipient.userType || 'customer'
        },
        listing: selectedListing ? {
          id: selectedListing._id,
          title: selectedListing.title,
          image: selectedListing.media?.[0]?.url || '/api/placeholder/60/60',
          price: selectedListing.price || 0
        } : null,
        lastMessage: chat.lastMessage ? {
          id: chat.lastMessage._id,
          content: chat.lastMessage.content,
          timestamp: new Date(chat.lastMessage.timestamp),
          senderId: chat.lastMessage.sender,
          read: false
        } : null,
        unreadCount: 0,
        archived: false,
        blocked: false
      };

      onCreateConversation(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      // You could show a toast notification here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {step === 1 ? 'New Message' : 'Compose Message'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 ? (
              // Step 1: Select Recipient
              <div className="space-y-4">
                {/* Search */}
                <div>
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                  />
                </div>

                {/* Recipients List */}
                <div className="max-h-64 overflow-y-auto">
                  {loadingRecipients ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                    </div>
                  ) : filteredRecipients.length > 0 ? (
                    <div className="space-y-2">
                      {filteredRecipients.map((recipient) => (
                        <button
                          key={recipient._id}
                          onClick={() => handleSelectRecipient(recipient)}
                          className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          {recipient.avatar ? (
                            <img
                              src={recipient.avatar}
                              alt={getRecipientName(recipient)}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {getRecipientName(recipient)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {recipient.userType === 'customer' ? 'Customer' : 'User'} • {recipient.email}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'No users found' : 'No users available'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Help Text */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 Select a user to start a conversation.
                  </p>
                </div>
              </div>
            ) : (
              // Step 2: Compose Message
              <div className="space-y-4">
                {/* Selected Recipient */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedRecipient.avatar ? (
                        <img
                          src={selectedRecipient.avatar}
                          alt={getRecipientName(selectedRecipient)}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {getRecipientName(selectedRecipient)}
                      </span>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Select Listing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Listing to Discuss (Optional)
                  </label>
                  {loadingListings ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      <button
                        onClick={() => setSelectedListing(null)}
                        className={`w-full p-3 text-left rounded-lg border transition-colors ${
                          !selectedListing
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          General Message
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Not related to any specific listing
                        </p>
                      </button>
                      {listings.map((listing) => (
                        <button
                          key={listing._id}
                          onClick={() => setSelectedListing(listing)}
                          className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg border transition-colors ${
                            selectedListing?._id === listing._id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <img
                            src={listing.media?.[0]?.url || '/api/placeholder/60/60'}
                            alt={listing.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {listing.title}
                            </p>
                            <p className="text-sm text-primary-600 dark:text-primary-400">
                              {listing.price?.toLocaleString()} ETB
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Composer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base resize-none"
                  />
                </div>

                {/* Quick Templates */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quick Templates:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Hello! I wanted to reach out about my listing.',
                      'Hi there! Are you interested in discussing business?',
                      'Hello! I have a proposition that might interest you.',
                      'Hi! I wanted to follow up on our previous conversation.'
                    ].map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(template)}
                        className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {template.substring(0, 30)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={step === 1 ? onClose : () => setStep(1)}
              disabled={isCreatingChat}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            {step === 2 && (
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || !selectedRecipient || isCreatingChat}
                loading={isCreatingChat}
                leftIcon={<PaperAirplaneIcon className="h-4 w-4" />}
              >
                Send Message
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;