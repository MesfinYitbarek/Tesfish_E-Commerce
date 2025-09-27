// components/employee/EmployeeStatsCard.jsx
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const EmployeeStatsCard = ({ title, value, change, changeType, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  const changeColors = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${changeColors[changeType]}`}>
              {changeType === 'positive' && <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />}
              {changeType === 'negative' && <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default EmployeeStatsCard;