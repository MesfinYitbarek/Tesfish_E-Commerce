import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UsersIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        users: {
          total: 2847,
          active: 2156,
          suspended: 23,
          pending: 68,
          growth: 12.5
        },
        listings: {
          total: 1234,
          pending: 45,
          approved: 1098,
          rejected: 91,
          growth: 8.3
        },
        revenue: {
          total: 125000,
          thisMonth: 18500,
          growth: 15.2
        },
        reports: {
          total: 34,
          resolved: 28,
          pending: 6,
          critical: 2
        }
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, growth, icon: Icon, color, link }) => {
    const isPositive = growth > 0;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {typeof value === 'number' && value > 1000 ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
            {growth !== undefined && (
              <div className={`flex items-center mt-2 text-sm ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(growth)}% {isPositive ? 'increase' : 'decrease'}</span>
              </div>
            )}
          </div>
          <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        {link && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to={link}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View Details →
            </Link>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor platform activity and manage system operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          subtitle={`${stats.users.active} active`}
          growth={stats.users.growth}
          icon={UsersIcon}
          color="bg-blue-500"
          link="/admin/users"
        />
        <StatCard
          title="Listings"
          value={stats.listings.total}
          subtitle={`${stats.listings.pending} pending approval`}
          growth={stats.listings.growth}
          icon={BuildingOfficeIcon}
          color="bg-green-500"
          link="/admin/listings"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.revenue.thisMonth, 'ETB')}
          subtitle={`Total: ${formatCurrency(stats.revenue.total, 'ETB')}`}
          growth={stats.revenue.growth}
          icon={ChartBarIcon}
          color="bg-purple-500"
          link="/admin/analytics"
        />
        <StatCard
          title="Reports"
          value={stats.reports.total}
          subtitle={`${stats.reports.pending} pending`}
          icon={ExclamationTriangleIcon}
          color="bg-red-500"
          link="/admin/reports"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;