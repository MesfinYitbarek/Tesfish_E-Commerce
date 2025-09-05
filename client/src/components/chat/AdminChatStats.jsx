// components/chat/AdminChatStats.jsx - New component
import { ClockIcon, ChatBubbleLeftRightIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../ui/LoadingSpinner';

const AdminChatStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No statistics available</p>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Chats',
      value: stats.totalChats || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'text-blue-600'
    },
    {
      label: 'Active',
      value: stats.activeChats || 0,
      icon: UserGroupIcon,
      color: 'text-green-600'
    },
    {
      label: 'Support',
      value: stats.supportChats || 0,
      icon: ChartBarIcon,
      color: 'text-purple-600'
    },
    {
      label: 'Today',
      value: stats.todayChats || 0,
      icon: ClockIcon,
      color: 'text-orange-600'
    }
  ];

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Support Overview</h3>
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item) => (
          <div key={item.label} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChatStats;