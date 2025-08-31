import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  XMarkIcon,
  BellIcon,
  EyeIcon,
  CheckIcon,
  TrashIcon,
  EnvelopeIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  StarIcon,
  CogIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { 
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearReadNotifications,
  optimisticMarkAsRead,
  optimisticDelete,
  setNotificationFilters,
  selectNotifications,
  selectUnreadCount,
  selectNotificationLoading,
  selectNotificationError,
  selectNotificationFilters
} from '../../store/slices/notificationSlice';
import { formatRelativeTime } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { NOTIFICATION_TYPES } from '../../constants';

const NotificationPanel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const loading = useSelector(selectNotificationLoading);
  const error = useSelector(selectNotificationError);
  const filters = useSelector(selectNotificationFilters);
  
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Fetch notifications when panel opens
      dispatch(fetchNotifications({ 
        page: 1, 
        limit: 20,
        ...(filter === 'unread' && { isRead: false }),
        ...(filter === 'read' && { isRead: true })
      }));
    }
  }, [isOpen, dispatch, filter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const filterParams = { page: 1, limit: 20 };
    
    if (newFilter === 'unread') {
      filterParams.isRead = false;
    } else if (newFilter === 'read') {
      filterParams.isRead = true;
    }
    
    dispatch(setNotificationFilters(filterParams));
  };

  const handleMarkAsRead = async (notificationId) => {
    if (actionLoading[notificationId]) return;
    
    setActionLoading(prev => ({ ...prev, [notificationId]: true }));
    
    try {
      // Optimistic update for better UX
      dispatch(optimisticMarkAsRead(notificationId));
      
      // Then update on server
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
    } catch (error) {
      toast.error('Failed to mark notification as read');
      // Refetch to restore correct state
      dispatch(fetchNotifications(filters));
    } finally {
      setActionLoading(prev => ({ ...prev, [notificationId]: false }));
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (actionLoading[notificationId]) return;
    
    setActionLoading(prev => ({ ...prev, [notificationId]: true }));
    
    try {
      // Optimistic update
      dispatch(optimisticDelete(notificationId));
      
      // Then delete on server
      await dispatch(deleteNotification(notificationId)).unwrap();
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
      // Refetch to restore correct state
      dispatch(fetchNotifications(filters));
    } finally {
      setActionLoading(prev => ({ ...prev, [notificationId]: false }));
    }
  };

  const handleClearReadNotifications = async () => {
    try {
      await dispatch(clearReadNotifications()).unwrap();
      toast.success('Read notifications cleared');
    } catch (error) {
      toast.error('Failed to clear read notifications');
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      [NOTIFICATION_TYPES.ORDER]: ShoppingCartIcon,
      [NOTIFICATION_TYPES.PAYMENT]: CurrencyDollarIcon,
      [NOTIFICATION_TYPES.BOOKING]: CalendarIcon,
      [NOTIFICATION_TYPES.CHAT]: EnvelopeIcon,
      [NOTIFICATION_TYPES.REVIEW]: StarIcon,
      [NOTIFICATION_TYPES.SYSTEM]: CogIcon,
      [NOTIFICATION_TYPES.PROMOTION]: ExclamationTriangleIcon
    };
    return iconMap[type] || BellIcon;
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') {
      return 'red';
    }
    
    const colorMap = {
      [NOTIFICATION_TYPES.ORDER]: 'blue',
      [NOTIFICATION_TYPES.PAYMENT]: 'green',
      [NOTIFICATION_TYPES.BOOKING]: 'purple',
      [NOTIFICATION_TYPES.CHAT]: 'blue',
      [NOTIFICATION_TYPES.REVIEW]: 'yellow',
      [NOTIFICATION_TYPES.SYSTEM]: 'gray',
      [NOTIFICATION_TYPES.PROMOTION]: 'orange'
    };
    return colorMap[type] || 'blue';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      gray: 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
    };
    return colors[color] || colors.blue;
  };

  const getPriorityIndicator = (priority) => {
    if (priority === 'high') {
      return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
    }
    if (priority === 'medium') {
      return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
    }
    return null;
  };

  const getActionUrl = (notification) => {
    // Generate action URL based on notification type and related data
    if (notification.actionUrl) {
      return notification.actionUrl;
    }
    
    if (notification.relatedOrder) {
      return `/dashboard/orders/${notification.relatedOrder._id}`;
    }
    
    if (notification.relatedProduct) {
      return `/dashboard/products/${notification.relatedProduct._id}`;
    }
    
    if (notification.relatedBooking) {
      return `/dashboard/bookings/${notification.relatedBooking._id}`;
    }
    
    return null;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

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
                  onClick={() => handleFilterChange(filterOption.key)}
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

            {/* Action Buttons */}
            <div className="mt-3 space-y-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="w-full"
                  disabled={loading}
                >
                  Mark All as Read
                </Button>
              )}
              
              {notifications.some(n => n.isRead) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearReadNotifications}
                  className="w-full text-red-600 hover:text-red-700"
                  disabled={loading}
                >
                  Clear Read Notifications
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner size="md" />
              </div>
            ) : error ? (
              <div className="p-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dispatch(fetchNotifications(filters))}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  const color = getNotificationColor(notification.type, notification.priority);
                  const actionUrl = getActionUrl(notification);
                  
                  return (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon with Priority Indicator */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            getColorClasses(color)
                          }`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          {/* Priority indicator */}
                          {getPriorityIndicator(notification.priority) && (
                            <div className="absolute -top-1 -right-1">
                              {getPriorityIndicator(notification.priority)}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium mb-1 ${
                                !notification.isRead 
                                  ? 'text-gray-900 dark:text-gray-100' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              {/* Related Data Preview */}
                              {notification.relatedProduct && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Property: {notification.relatedProduct.title}
                                </p>
                              )}
                              {notification.relatedOrder && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Order: #{notification.relatedOrder.orderNumber}
                                </p>
                              )}
                              {notification.relatedBooking && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Booking: {notification.relatedBooking.bookingType}
                                </p>
                              )}
                              
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatRelativeTime(notification.createdAt)}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  disabled={actionLoading[notification._id]}
                                  className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-50"
                                  title="Mark as read"
                                >
                                  {actionLoading[notification._id] ? (
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <CheckIcon className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification._id)}
                                disabled={actionLoading[notification._id]}
                                className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
                                title="Delete notification"
                              >
                                {actionLoading[notification._id] ? (
                                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <TrashIcon className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Action Link */}
                          {actionUrl && (
                            <div className="mt-2">
                              <Link
                                to={actionUrl}
                                onClick={() => {
                                  if (!notification.isRead) {
                                    handleMarkAsRead(notification._id);
                                  }
                                  onClose();
                                }}
                                className="text-xs text-primary-500 hover:text-primary-600 font-medium inline-flex items-center"
                              >
                                {notification.actionLabel || 'View Details'} →
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                    : 'You\'ll see notifications about orders, bookings, and updates here.'
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