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
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
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

      setRecentActivity([
        {
          id: 1,
          type: 'user_registered',
          message: 'New user registration: Sarah Johnson',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          icon: UsersIcon,
          color: 'green'
        },
        {
          id: 2,
          type: 'listing_submitted',
          message: 'New listing submitted: Modern 3BR Apartment',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          icon: BuildingOfficeIcon,
          color: 'blue'
        },
        {
          id: 3,
          type: 'report_submitted',
          message: 'User reported suspicious listing',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: ExclamationTriangleIcon,
          color: 'red'
        },
        {
          id: 4,
          type: 'listing_approved',
          message: 'Listing approved: Luxury Villa in Old Airport',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          icon: CheckIcon,
          color: 'green'
        },
        {
          id: 5,
          type: 'user_verified',
          message: 'Business profile verified: ABC Construction',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          icon: CheckIcon,
          color: 'blue'
        }
      ]);

      setPendingItems([
        {
          id: 1,
          type: 'listing',
          title: 'Commercial Office Space in CMC',
          submittedBy: 'Michael Chen',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          priority: 'high'
        },
        {
          id: 2,
          type: 'user',
          title: 'Business verification: XYZ Real Estate',
          submittedBy: 'Emma Wilson',
          submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          priority: 'medium'
        },
        {
          id: 3,
          type: 'report',
          title: 'Inappropriate content reported',
          submittedBy: 'David Lee',
          submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          priority: 'high'
        }
      ]);

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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Pending Actions
                </h3>
                <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-2 py-1 rounded-full">
                  {pendingItems.length} items
                </span>
              </div>
            </div>
            <div className="p-6">
              {pendingItems.length > 0 ? (
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          item.priority === 'high' 
                            ? 'bg-red-500' 
                            : item.priority === 'medium' 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            By {item.submittedBy} • {formatRelativeTime(item.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No pending actions
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    All items are up to date
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.color === 'green' 
                        ? 'bg-green-100 dark:bg-green-900/20' 
                        : activity.color === 'blue'
                        ? 'bg-blue-100 dark:bg-blue-900/20'
                        : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      <activity.icon className={`h-4 w-4 ${
                        activity.color === 'green' 
                          ? 'text-green-600 dark:text-green-400' 
                          : activity.color === 'blue'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-red-600 dark:text-red-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
              <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Manage Users</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and moderate user accounts</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/listings"
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
              <BuildingOfficeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Review Listings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approve or reject new listings</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/analytics"
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
              <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">View Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monitor platform performance</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;