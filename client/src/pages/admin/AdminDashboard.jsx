import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  UsersIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

import {
  getDashboardStats,
  selectDashboardStats,
  selectIsLoadingStats,
  selectStatsError,
  clearError
} from '../../store/slices/adminSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const dashboardStats = useSelector(selectDashboardStats);
  const isLoading = useSelector(selectIsLoadingStats);
  const error = useSelector(selectStatsError);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [dispatch]);

  const fetchDashboardData = async () => {
    try {
      await dispatch(getDashboardStats()).unwrap();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // Helper function to get status counts
  const getStatusCount = (statusArray, statusName) => {
    const statusItem = statusArray?.find(item => item._id === statusName);
    return statusItem?.count || 0;
  };

  // Helper function to calculate growth (mock for now, would come from API in real scenario)
  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const StatCard = ({ title, value, subtitle, growth, icon: Icon, color, link, badge }) => {
    const isPositive = growth > 0;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
              {badge && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.type === 'warning'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : badge.type === 'danger'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                  {badge.text}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {typeof value === 'number' && value > 1000 ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
            {growth !== undefined && growth !== 0 && (
              <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                {isPositive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(growth)}% vs last month</span>
              </div>
            )}
          </div>
          <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center flex-shrink-0 ml-4`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        {link && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to={link}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
              View Details →
            </Link>
          </div>
        )}
      </div>
    );
  };

  const QuickStatsCard = ({ title, stats, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading && !dashboardStats.users.total) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => {
              dispatch(clearError());
              fetchDashboardData();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const pendingOrders = getStatusCount(dashboardStats.orders.byStatus, 'pending');
  const pendingInquiries = getStatusCount(dashboardStats.serviceInquiries.byStatus, 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor platform activity and manage system operations
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {refreshing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          ) : (
            <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
          )}
          Refresh
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardStats.users.total}
          subtitle={`${dashboardStats.users.newThisMonth} new this month`}
          growth={calculateGrowth(dashboardStats.users.newThisMonth, 50)} // Mock previous month data
          icon={UsersIcon}
          color="bg-blue-500"
          link="/admin/users"
        />

        <StatCard
          title="Products"
          value={dashboardStats.products.total}
          subtitle={`${dashboardStats.products.active} active listings`}
          growth={calculateGrowth(dashboardStats.products.total, 1100)} // Mock previous data
          icon={BuildingOfficeIcon}
          color="bg-green-500"
          link="/admin/products"
        />

        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(dashboardStats.revenue.thisMonth, 'ETB')}
          subtitle={`Total: ${formatCurrency(dashboardStats.revenue.total, 'ETB')}`}
          growth={calculateGrowth(dashboardStats.revenue.thisMonth, 15000)} // Mock previous data
          icon={CurrencyDollarIcon}
          color="bg-purple-500"
          link="/admin/analytics"
        />

        <QuickStatsCard
          title="Inquiry Status"
          icon={ChatBubbleLeftRightIcon}
          color="bg-indigo-500"
          stats={dashboardStats.serviceInquiries.byStatus.map(status => ({
            label: status._id.charAt(0).toUpperCase() + status._id.slice(1),
            value: status.count.toLocaleString()
          }))}
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Service Inquiries"
          value={dashboardStats.serviceInquiries.total}
          subtitle={`${pendingInquiries} pending review`}
          icon={ChatBubbleLeftRightIcon}
          color="bg-indigo-500"
          link="/admin/inquiries"
          badge={pendingInquiries > 0 ? { text: 'Action needed', type: 'warning' } : null}
        />

        <StatCard
          title="Reviews"
          value={dashboardStats.reviews.total}
          subtitle={`${dashboardStats.reviews.averageRating.toFixed(1)} avg rating`}
          icon={StarIcon}
          color="bg-yellow-500"
          link="/admin/reviews"
        />
        <QuickStatsCard
          title="User Types"
          icon={UsersIcon}
          color="bg-blue-500"
          stats={dashboardStats.users.byType.map(type => ({
            label: type._id === 'individual' ? 'Individuals' :
              type._id === 'company' ? 'Companies' :
                type._id === 'customer' ? 'Customers' :
                  type._id === 'admin' ? 'Admins' : type._id,
            value: type.count.toLocaleString()
          }))}
        />
      </div>

      {/* Loading overlay for refresh */}
      {(refreshing || isLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 dark:text-gray-100">
              {refreshing ? 'Refreshing dashboard...' : 'Loading...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;