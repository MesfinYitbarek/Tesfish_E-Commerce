// components/admin/MineralStatsWidget.jsx
import { 
  FunnelIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ChartBarIcon,
  BeakerIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency, formatNumber } from '../../utils/helpers';

const MineralStatsWidget = ({ stats, mineralTypes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" text="Loading statistics..." />
        </div>
      </div>
    );
  }

  if (!stats?.overview) {
    return null;
  }

  const { overview, byStatus, byMineralType, byQualityGrade } = stats;

  const statCards = [
    {
      title: 'Total Minerals',
      value: formatNumber(overview.totalMinerals || 0),
      icon: FunnelIcon,
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Value',
      value: formatCurrency(overview.totalValue || 0),
      icon: CurrencyDollarIcon,
      color: 'green',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Average Price',
      value: formatCurrency(overview.avgPrice || 0),
      icon: ScaleIcon,
      color: 'purple',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Average Purity',
      value: `${(overview.avgPurity || 0).toFixed(1)}%`,
      icon: BeakerIcon,
      color: 'yellow',
      change: '+1%',
      changeType: 'positive'
    },
    {
      title: 'Total Views',
      value: formatNumber(overview.totalViews || 0),
      icon: ChartBarIcon,
      color: 'indigo',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Verified',
      value: formatNumber(overview.verifiedCount || 0),
      icon: TruckIcon,
      color: 'emerald',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600',
      green: 'bg-green-500 text-green-600',
      purple: 'bg-purple-500 text-purple-600',
      yellow: 'bg-yellow-500 text-yellow-600',
      indigo: 'bg-indigo-500 text-indigo-600',
      emerald: 'bg-emerald-500 text-emerald-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg bg-opacity-10 ${getColorClasses(stat.color)}`}>
                <stat.icon className={`h-6 w-6 ${getColorClasses(stat.color).split(' ')[1]}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  {stat.change && (
                    <p className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By Status */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">By Status</h3>
          <div className="space-y-3">
            {byStatus?.map(item => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    item._id === 'active' ? 'bg-green-500' :
                    item._id === 'draft' ? 'bg-gray-500' :
                    item._id === 'sold' ? 'bg-blue-500' :
                    item._id === 'out-of-stock' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {item._id.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.count}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {formatCurrency(item.totalValue || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Mineral Type */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">By Type</h3>
          <div className="space-y-3">
            {byMineralType?.slice(0, 6).map(item => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {item._id === 'gold' ? '🥇' :
                     item._id === 'silver' ? '🥈' :
                     item._id === 'gemstones' ? '💎' :
                     item._id === 'copper' ? '🟤' : '🪨'}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {item._id}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.count}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Avg: {formatCurrency(item.avgPrice || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Quality Grade */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">By Quality</h3>
          <div className="space-y-3">
            {byQualityGrade?.map(item => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    item._id === 'premium' ? 'bg-purple-500' :
                    item._id === 'high' ? 'bg-blue-500' :
                    item._id === 'medium' ? 'bg-green-500' :
                    item._id === 'standard' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {item._id}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.count}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Avg: {formatCurrency(item.avgPrice || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MineralStatsWidget;