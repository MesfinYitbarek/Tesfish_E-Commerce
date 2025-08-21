import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CalendarIcon,
  UserIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { formatRelativeTime } from '../../utils/helpers';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setActivities([
          {
            id: 1,
            type: 'view',
            title: 'New view on your listing',
            description: 'Modern 3BR Apartment in CMC',
            user: 'Sarah M.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            icon: EyeIcon,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
          },
          {
            id: 2,
            type: 'message',
            title: 'New inquiry received',
            description: 'Interior Design Service',
            user: 'Michael T.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            icon: ChatBubbleLeftRightIcon,
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
          },
          {
            id: 3,
            type: 'wishlist',
            title: 'Added to wishlist',
            description: 'Luxury Villa in Old Airport',
            user: 'Emma W.',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            icon: HeartIcon,
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-900/20'
          },
          {
            id: 4,
            type: 'booking',
            title: 'New booking request',
            description: 'Project Management Service',
            user: 'David L.',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            icon: CalendarIcon,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
          },
          {
            id: 5,
            type: 'profile',
            title: 'Profile viewed',
            description: 'Someone viewed your profile',
            user: 'Anonymous',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
            icon: UserIcon,
            color: 'text-gray-500',
            bgColor: 'bg-gray-50 dark:bg-gray-800'
          }
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Activity
        </h3>
        <Link 
          to="/dashboard/notifications"
          className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
        >
          View all
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
              <activity.icon className={`h-5 w-5 ${activity.color}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {activity.title}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {activity.description}
              </p>
              
              {activity.user !== 'Anonymous' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  by {activity.user}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            No recent activity
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your activity will appear here once you start receiving interactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;