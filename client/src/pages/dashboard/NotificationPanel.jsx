import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  XMarkIcon,
  BellIcon,
  EyeIcon,
  CheckIcon,
  TrashIcon,
  EnvelopeIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { formatRelativeTime } from '../../utils/helpers';
import Button from '../../components/ui/Button';


const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setNotifications([
          {
            id: '1',
            type: 'inquiry',
            title: 'New inquiry received',
            message: 'Sarah Johnson is interested in your Modern 3BR Apartment listing',
            read: false,
            createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            actionUrl: '/dashboard/messages/1',
            icon: EnvelopeIcon,
            color: 'blue'
          },
          {
            id: '2',
            type: 'booking',
            title: 'Booking confirmed',
            message: 'Michael Chen has confirmed the Interior Design consultation for tomorrow at 2:00 PM',
            read: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            actionUrl: '/dashboard/bookings/2',
            icon: CalendarIcon,
            color: 'green'
          },
          {
            id: '3',
            type: 'system',
            title: 'Listing approved',
            message: 'Your listing "Luxury Villa in Old Airport" has been approved and is now live',
            read: true,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            actionUrl: '/dashboard/products/3',
            icon: CheckIcon,
            color: 'green'
          },
          {
            id: '4',
            type: 'alert',
            title: 'Payment reminder',
            message: 'Your featured listing promotion expires in 2 days',
            read: false,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            actionUrl: '/dashboard/billing',
            icon: ExclamationTriangleIcon,
            color: 'yellow'
          },
          {
            id: '5',
            type: 'view',
            title: 'High interest listing',
            message: 'Your Project Management Service has received 50+ views today',
            read: true,
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
            actionUrl: '/dashboard/analytics',
            icon: EyeIcon,
            color: 'purple'
          }
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
    };
    return colors[color] || colors.blue;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <BellIcon className="h-6 w-6 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'read', label: 'Read' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    filter === filterOption.key
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="w-full"
                >
                  Mark All as Read
                </Button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse mb-4">
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        getColorClasses(notification.color)
                      }`}>
                        <notification.icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium mb-1 ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-gray-100' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatRelativeTime(notification.createdAt)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-500"
                                title="Mark as read"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                              title="Delete notification"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Action Link */}
                        {notification.actionUrl && (
                          <div className="mt-2">
                            <Link
                              to={notification.actionUrl}
                              onClick={() => {
                                if (!notification.read) {
                                  markAsRead(notification.id);
                                }
                                onClose();
                              }}
                              className="text-xs text-primary-500 hover:text-primary-600 font-medium"
                            >
                              View Details →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filter === 'unread' 
                    ? 'All caught up! Check back later for new updates.' 
                    : 'You\'ll see notifications about inquiries, bookings, and updates here.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/dashboard/notifications"
              onClick={onClose}
              className="block w-full text-center py-2 text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;