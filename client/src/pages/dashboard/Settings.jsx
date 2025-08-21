import { useState } from 'react';
import { 
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('password');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      newInquiry: true,
      bookingConfirmation: true,
      paymentReceived: true,
      messageReceived: true,
      marketingEmails: false,
      weeklyDigest: true
    },
    pushNotifications: {
      newInquiry: true,
      bookingConfirmation: true,
      messageReceived: true,
      appointmentReminder: true
    },
    smsNotifications: {
      bookingConfirmation: false,
      appointmentReminder: true,
      urgentMessages: true
    }
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, private, contacts
    searchableByEmail: true,
    searchableByPhone: false,
    allowDirectContact: true,
    showOnlineStatus: true,
    dataCollection: true,
    analyticsTracking: true
  });

  const tabs = [
    { id: 'password', label: 'Password & Security', icon: KeyIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheckIcon },
    { id: 'danger', label: 'Account', icon: TrashIcon }
  ];

  // Password Change Functions
  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Notification Settings Functions
  const handleNotificationChange = (category, setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const saveNotificationSettings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification settings updated!');
    } catch (error) {
      toast.error('Failed to update settings.');
    } finally {
      setIsLoading(false);
    }
  };

  // Privacy Settings Functions
  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const savePrivacySettings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Privacy settings updated!');
    } catch (error) {
      toast.error('Failed to update settings.');
    } finally {
      setIsLoading(false);
    }
  };

  // Account Deletion
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Account deletion request submitted. You will receive an email confirmation.');
      setShowConfirmDialog(false);
    } catch (error) {
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account security, notifications, and privacy preferences
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
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
        <div className="p-6">
          {activeTab === 'password' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Change Password
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Ensure your account is using a long, random password to stay secure.
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                      setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }));
                      if (passwordErrors.currentPassword) {
                        setPasswordErrors(prev => ({ ...prev, currentPassword: '' }));
                      }
                    }}
                    error={passwordErrors.currentPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.current ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
                      if (passwordErrors.newPassword) {
                        setPasswordErrors(prev => ({ ...prev, newPassword: '' }));
                      }
                    }}
                    error={passwordErrors.newPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.new ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }));
                      if (passwordErrors.confirmPassword) {
                        setPasswordErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }
                    }}
                    error={passwordErrors.confirmPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.confirm ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    loading={isLoading}
                    disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </form>

              {/* Password Requirements */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Avoid common passwords and personal information</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Notification Preferences
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose how you want to be notified about activities on your account.
                </p>
              </div>

              {/* Email Notifications */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Email Notifications
                </h4>
                <div className="space-y-4">
                  {Object.entries(notificationSettings.emailNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {key === 'newInquiry' && 'Get notified when someone inquires about your listings'}
                          {key === 'bookingConfirmation' && 'Receive confirmation emails for new bookings'}
                          {key === 'paymentReceived' && 'Get notified when payments are received'}
                          {key === 'messageReceived' && 'Receive emails for new direct messages'}
                          {key === 'marketingEmails' && 'Receive updates about new features and promotions'}
                          {key === 'weeklyDigest' && 'Get a weekly summary of your account activity'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange('emailNotifications', key, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Push Notifications
                </h4>
                <div className="space-y-4">
                  {Object.entries(notificationSettings.pushNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {key === 'newInquiry' && 'Instant notifications for new inquiries'}
                          {key === 'bookingConfirmation' && 'Push alerts for booking confirmations'}
                          {key === 'messageReceived' && 'Real-time notifications for new messages'}
                          {key === 'appointmentReminder' && 'Reminders before scheduled appointments'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange('pushNotifications', key, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SMS Notifications */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  SMS Notifications
                </h4>
                <div className="space-y-4">
                  {Object.entries(notificationSettings.smsNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {key === 'bookingConfirmation' && 'SMS alerts for booking confirmations'}
                          {key === 'appointmentReminder' && 'Text reminders before appointments'}
                          {key === 'urgentMessages' && 'SMS for urgent or time-sensitive messages'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange('smsNotifications', key, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={saveNotificationSettings} loading={isLoading}>
                  Save Notification Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Privacy Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Control how your information is shared and who can find you.
                </p>
              </div>

              {/* Profile Visibility */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Profile Visibility
                </h4>
                <div className="space-y-3">
                  {[
                    { value: 'public', label: 'Public', description: 'Anyone can view your profile' },
                    { value: 'private', label: 'Private', description: 'Only you can view your profile' },
                    { value: 'contacts', label: 'Contacts Only', description: 'Only people you\'ve messaged can view your profile' }
                  ].map(option => (
                    <div key={option.value} className="flex items-start">
                      <input
                        type="radio"
                        id={`visibility-${option.value}`}
                        name="profileVisibility"
                        value={option.value}
                        checked={privacySettings.profileVisibility === option.value}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3">
                        <label htmlFor={`visibility-${option.value}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {option.label}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Settings */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Search & Discovery
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow search by email
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Let people find you using your email address
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.searchableByEmail}
                      onChange={(e) => handlePrivacyChange('searchableByEmail', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow search by phone
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Let people find you using your phone number
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.searchableByPhone}
                      onChange={(e) => handlePrivacyChange('searchableByPhone', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow direct contact
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Let people contact you directly without going through your listings
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.allowDirectContact}
                      onChange={(e) => handlePrivacyChange('allowDirectContact', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show online status
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Let others see when you're online or recently active
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showOnlineStatus}
                      onChange={(e) => handlePrivacyChange('showOnlineStatus', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Data Settings */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Data & Analytics
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Data collection for service improvement
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Help us improve our services by sharing usage data
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.dataCollection}
                      onChange={(e) => handlePrivacyChange('dataCollection', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Analytics tracking
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Allow tracking for analytics and advertising purposes
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.analyticsTracking}
                      onChange={(e) => handlePrivacyChange('analyticsTracking', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={savePrivacySettings} loading={isLoading}>
                  Save Privacy Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Account Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your account data and deletion options.
                </p>
              </div>

              {/* Data Export */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Export Your Data
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Download a copy of all your data including profile information, listings, messages, and bookings.
                </p>
                <Button variant="outline">
                  Request Data Export
                </Button>
              </div>

              {/* Account Deactivation */}
              <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-md font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                      Deactivate Account
                    </h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                      Temporarily disable your account. You can reactivate it anytime by logging in.
                    </p>
                    <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                      Deactivate Account
                    </Button>
                  </div>
                </div>
              </div>

              {/* Account Deletion */}
              <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                <div className="flex items-start">
                  <TrashIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-md font-medium text-red-900 dark:text-red-100 mb-2">
                      Delete Account
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <div className="space-y-2 text-sm text-red-700 dark:text-red-300 mb-4">
                      <p>• All your listings will be removed</p>
                      <p>• Your messages and booking history will be deleted</p>
                      <p>• You will lose access to all data permanently</p>
                      <p>• Any active subscriptions will be cancelled</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-red-300 text-red-700 hover:bg-red-100"
                      onClick={() => setShowConfirmDialog(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone. All your data will be permanently deleted."
        confirmText="Yes, Delete My Account"
        confirmVariant="danger"
        type="danger"
      />
    </div>
  );
};

export default Settings;