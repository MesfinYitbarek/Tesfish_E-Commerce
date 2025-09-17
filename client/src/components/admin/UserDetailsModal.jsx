import { useState } from 'react';
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import { formatRelativeTime, formatDate } from '../../utils/helpers';

const UserDetailsModal = ({ user, onClose, onUserAction }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700',
      suspended: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700',
      pending: 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Modal Container - Fixed positioning and proper z-index */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-600">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <UserIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                {user.verified && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  {user.userType === 'company' ? user.companyName : 'Individual User'}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                  {user.verified && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                      Verified ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              {!user.verified && user.status === 'active' && (
                <Button
                  size="sm"
                  onClick={() => {
                    onUserAction('verify', user);
                    onClose();
                  }}
                  leftIcon={<ShieldCheckIcon className="h-4 w-4" />}
                  className="bg-green-600 hover:bg-green-700 text-white border-0"
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
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
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
                  className="bg-green-600 hover:bg-green-700 text-white border-0"
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
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Delete User
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600 dark:text-red-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
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
          <div className="p-6 max-h-[60vh] overflow-y-auto bg-white dark:bg-gray-800">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <EnvelopeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Email</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <PhoneIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Phone</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Location</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{user.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <CalendarIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Joined</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(user.joinedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

               

                {/* Suspension Info */}
                {user.status === 'suspended' && user.suspensionReason && (
                  <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                          Suspension Details
                        </h4>
                        <p className="text-red-800 dark:text-red-200 leading-relaxed">{user.suspensionReason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}          
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
              <span>User ID: {user.id}</span>
              <span>Last active: {formatRelativeTime(user.lastActive)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;