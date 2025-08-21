import { useState } from 'react';
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import { formatRelativeTime, formatDate } from '../../utils/helpers';

const UserDetailsModal = ({ user, onClose, onUserAction }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'activity', label: 'Activity', icon: ChartBarIcon },
    { id: 'listings', label: 'Listings', icon: BuildingOfficeIcon },
    { id: 'messages', label: 'Messages', icon: ChatBubbleLeftRightIcon }
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20',
      suspended: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
      pending: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
    };
    return colors[status] || colors.pending;
  };

  // Mock data for demonstration
  const userActivity = [
    {
      id: 1,
      action: 'Created listing',
      details: 'Modern 3BR Apartment in CMC',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'listing'
    },
    {
      id: 2,
      action: 'Sent message',
      details: 'Responded to inquiry about villa listing',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'message'
    },
    {
      id: 3,
      action: 'Updated profile',
      details: 'Changed contact information',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: 'profile'
    },
    {
      id: 4,
      action: 'Login',
      details: 'Logged in from mobile device',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'auth'
    }
  ];

  const userListings = [
    {
      id: 1,
      title: 'Modern 3BR Apartment in CMC',
      status: 'active',
      views: 245,
      inquiries: 12,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      price: 2500000
    },
    {
      id: 2,
      title: 'Luxury Villa in Old Airport',
      status: 'pending',
      views: 89,
      inquiries: 3,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      price: 8500000
    }
  ];

  const userMessages = [
    {
      id: 1,
      with: 'Michael Chen',
      lastMessage: 'Thank you for the information',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unread: false
    },
    {
      id: 2,
      with: 'Emma Wilson',
      lastMessage: 'Is the property still available?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                {user.verified && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.userType === 'company' ? user.companyName : 'Individual User'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                  {user.verified && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {!user.verified && user.status === 'active' && (
                <Button
                  size="sm"
                  onClick={() => {
                    onUserAction('verify', user);
                    onClose();
                  }}
                  leftIcon={<ShieldCheckIcon className="h-4 w-4" />}
                >
                  Verify User
                </Button>
              )}

              {user.status === 'active' ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onUserAction('suspend', user);
                    onClose();
                  }}
                  leftIcon={<NoSymbolIcon className="h-4 w-4" />}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Suspend User
                </Button>
              ) : user.status === 'suspended' && (
                <Button
                  size="sm"
                  onClick={() => {
                    onUserAction('activate', user);
                    onClose();
                  }}
                  leftIcon={<CheckIcon className="h-4 w-4" />}
                >
                  Activate User
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onUserAction('delete', user);
                  onClose();
                }}
                leftIcon={<ExclamationTriangleIcon className="h-4 w-4" />}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Delete User
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600 dark:text-red-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Email</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Phone</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Location</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Joined</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(user.joinedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Statistics */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Account Statistics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {user.listingsCount}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Listings</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {user.messagesCount}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Messages</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {user.reportsCount}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Reports</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suspension Info */}
                {user.status === 'suspended' && user.suspensionReason && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
                      Suspension Details
                    </h4>
                    <p className="text-red-800 dark:text-red-200">{user.suspensionReason}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  {userActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.details}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  User Listings
                </h4>
                <div className="space-y-3">
                  {userListings.map((listing) => (
                    <div key={listing.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            {listing.title}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {listing.price.toLocaleString()} ETB
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Created {formatRelativeTime(listing.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            listing.status === 'active' 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                          }`}>
                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {listing.views} views • {listing.inquiries} inquiries
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Recent Messages
                </h4>
                <div className="space-y-3">
                  {userMessages.map((message) => (
                    <div key={message.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            Conversation with {message.with}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            "{message.lastMessage}"
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(message.timestamp)}
                          </p>
                        </div>
                        {message.unread && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;