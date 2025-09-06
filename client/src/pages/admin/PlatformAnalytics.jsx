import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  GlobeAltIcon,
  EyeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import { 
  getAnalytics, 
  getDashboardStats,
  selectAnalytics, 
  selectDashboardStats,
  selectIsLoadingAnalytics,
  selectIsLoadingStats,
  selectAnalyticsError,
  clearError
} from '../../store/slices/adminSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import RevenueChart from '../../components/admin/analytics/RevenueChart';
import UserGrowthChart from '../../components/admin/analytics/UserGrowthChart';
import GeographicDistribution from '../../components/admin/analytics/GeographicDistribution';
import { formatCurrency, formatNumber } from '../../utils/helpers';

const PlatformAnalytics = () => {
  const dispatch = useDispatch();
  const analytics = useSelector(selectAnalytics);
  const dashboardStats = useSelector(selectDashboardStats);
  const isLoadingAnalytics = useSelector(selectIsLoadingAnalytics);
  const isLoadingStats = useSelector(selectIsLoadingStats);
  const analyticsError = useSelector(selectAnalyticsError);

  const [dateRange, setDateRange] = useState('30');
  const [activeMetric, setActiveMetric] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, dispatch]);

  useEffect(() => {
    if (!dashboardStats.users.total) {
      dispatch(getDashboardStats());
    }
  }, [dispatch, dashboardStats.users.total]);

  const fetchAnalyticsData = async () => {
    try {
      await dispatch(getAnalytics(dateRange)).unwrap();
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(getAnalytics(dateRange)).unwrap(),
        dispatch(getDashboardStats()).unwrap()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Helper functions to calculate growth and process data
  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getStatusCount = (statusArray, statusName) => {
    const statusItem = statusArray?.find(item => item._id === statusName);
    return statusItem?.count || 0;
  };

  // Transform real data for charts
  const transformDataForCharts = () => {
    // Transform daily registrations for user growth chart
    const userGrowthData = analytics.dailyRegistrations?.map((item, index) => ({
      month: new Date(item._id).toLocaleDateString('en', { month: 'short' }),
      companies: Math.floor(item.count * 0.3), // Approximate breakdown
      individuals: Math.floor(item.count * 0.6),
      customers: Math.floor(item.count * 0.1),
      total: item.count
    })) || [];

    // Transform daily orders for revenue chart
    const revenueData = analytics.dailyOrders?.map(item => ({
      month: new Date(item._id).toLocaleDateString('en', { month: 'short' }),
      revenue: item.revenue || 0,
      subscriptions: Math.floor((item.revenue || 0) * 0.2), // Approximate breakdown
      commissions: Math.floor((item.revenue || 0) * 0.8),
      count: item.count
    })) || [];

    // Mock geographic data (since not provided by current API)
    const geographicData = {
      cities: [
        { 
          city: 'Addis Ababa', 
          users: Math.floor(dashboardStats.users.total * 0.45), 
          listings: Math.floor(dashboardStats.products.total * 0.40),
          revenue: Math.floor(dashboardStats.revenue.total * 0.45),
          percentage: 45.2 
        },
        { 
          city: 'Dire Dawa', 
          users: Math.floor(dashboardStats.users.total * 0.15), 
          listings: Math.floor(dashboardStats.products.total * 0.12),
          revenue: Math.floor(dashboardStats.revenue.total * 0.15),
          percentage: 15.0 
        },
        { 
          city: 'Mekelle', 
          users: Math.floor(dashboardStats.users.total * 0.12), 
          listings: Math.floor(dashboardStats.products.total * 0.10),
          revenue: Math.floor(dashboardStats.revenue.total * 0.12),
          percentage: 12.0 
        },
        { 
          city: 'Hawassa', 
          users: Math.floor(dashboardStats.users.total * 0.10), 
          listings: Math.floor(dashboardStats.products.total * 0.15),
          revenue: Math.floor(dashboardStats.revenue.total * 0.10),
          percentage: 10.0 
        },
        { 
          city: 'Bahir Dar', 
          users: Math.floor(dashboardStats.users.total * 0.08), 
          listings: Math.floor(dashboardStats.products.total * 0.08),
          revenue: Math.floor(dashboardStats.revenue.total * 0.08),
          percentage: 8.0 
        },
        { 
          city: 'Jimma', 
          users: Math.floor(dashboardStats.users.total * 0.10), 
          listings: Math.floor(dashboardStats.products.total * 0.15),
          revenue: Math.floor(dashboardStats.revenue.total * 0.10),
          percentage: 9.8 
        }
      ],
      regions: [
        { region: 'Addis Ababa', percentage: 45.2 },
        { region: 'Oromia', percentage: 28.5 },
        { region: 'Tigray', percentage: 12.3 },
        { region: 'Amhara', percentage: 8.9 },
        { region: 'SNNPR', percentage: 5.1 }
      ]
    };

    return { userGrowthData, revenueData, geographicData };
  };

  const StatCard = ({ title, value, change, icon: Icon, color, isCurrency = false, suffix = '' }) => {
    const isPositive = change > 0;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {isCurrency ? formatCurrency(value, 'ETB') : formatNumber(value)}{suffix}
            </p>
            {change !== undefined && (
              <div className={`flex items-center mt-2 text-sm ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(change)}% vs last period</span>
              </div>
            )}
          </div>
          <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const metrics = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'revenue', label: 'Revenue', icon: CurrencyDollarIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'listings', label: 'Listings', icon: BuildingOfficeIcon },
    { id: 'engagement', label: 'Engagement', icon: EyeIcon },
    { id: 'geographic', label: 'Geographic', icon: GlobeAltIcon }
  ];

  const isLoading = isLoadingAnalytics || isLoadingStats;

  if (isLoading && !analytics.dailyRegistrations?.length && !dashboardStats.users.total) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to load analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{analyticsError}</p>
          <button
            onClick={() => {
              dispatch(clearError());
              fetchAnalyticsData();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { userGrowthData, revenueData, geographicData } = transformDataForCharts();
  const pendingOrders = getStatusCount(dashboardStats.orders.byStatus, 'pending');
  const pendingInquiries = getStatusCount(dashboardStats.serviceInquiries.byStatus, 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Platform Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor platform performance and business metrics
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          
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
      </div>

      {/* Metric Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2">
        <div className="flex space-x-1 overflow-x-auto">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setActiveMetric(metric.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeMetric === metric.id
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <metric.icon className="h-4 w-4" />
              <span>{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      {activeMetric === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={dashboardStats.revenue.total}
              change={calculateGrowth(dashboardStats.revenue.thisMonth, dashboardStats.revenue.total * 0.8)}
              icon={CurrencyDollarIcon}
              color="bg-green-500"
              isCurrency
            />
            <StatCard
              title="Total Users"
              value={dashboardStats.users.total}
              change={calculateGrowth(dashboardStats.users.newThisMonth, 50)}
              icon={UsersIcon}
              color="bg-blue-500"
            />
            <StatCard
              title="Active Products"
              value={dashboardStats.products.active}
              change={calculateGrowth(dashboardStats.products.active, dashboardStats.products.total * 0.8)}
              icon={BuildingOfficeIcon}
              color="bg-purple-500"
            />
            <StatCard
              title="Total Orders"
              value={dashboardStats.orders.total}
              change={calculateGrowth(dashboardStats.orders.thisMonth, 25)}
              icon={ChartBarIcon}
              color="bg-orange-500"
            />
          </div>

          {/* Real Data Analytics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Products */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Top Performing Products
              </h3>
              <div className="space-y-3">
                {analytics.popularProducts?.slice(0, 5).map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Views: {formatNumber(product.views || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        #{index + 1}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Sales: {formatNumber(product.totalSales || 0)}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No product data available
                  </p>
                )}
              </div>
            </div>

            {/* Top Sellers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Top Sellers
              </h3>
              <div className="space-y-3">
                {analytics.topSellers?.slice(0, 5).map((seller, index) => (
                  <div key={seller._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {seller.sellerInfo?.[0]?.companyProfile?.companyName || 
                         `${seller.sellerInfo?.[0]?.individualProfile?.firstName} ${seller.sellerInfo?.[0]?.individualProfile?.lastName}` ||
                         seller.sellerInfo?.[0]?.email ||
                         'Unknown Seller'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Orders: {formatNumber(seller.orderCount || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(seller.totalSales || 0, 'ETB')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        #{index + 1}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No seller data available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Overview Charts */}
          {revenueData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Revenue Trend
                </h3>
                <RevenueChart data={revenueData} compact />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  User Registrations
                </h3>
                <UserGrowthChart data={userGrowthData} compact />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revenue Analytics */}
      {activeMetric === 'revenue' && revenueData.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={dashboardStats.revenue.total}
              change={calculateGrowth(dashboardStats.revenue.thisMonth, dashboardStats.revenue.total * 0.8)}
              icon={CurrencyDollarIcon}
              color="bg-green-500"
              isCurrency
            />
            <StatCard
              title="This Month"
              value={dashboardStats.revenue.thisMonth}
              change={12.3}
              icon={CalendarIcon}
              color="bg-blue-500"
              isCurrency
            />
            <StatCard
              title="Daily Average"
              value={Math.floor(dashboardStats.revenue.thisMonth / 30)}
              change={8.5}
              icon={ChartBarIcon}
              color="bg-purple-500"
              isCurrency
            />
            <StatCard
              title="Orders"
              value={dashboardStats.orders.total}
              change={15.2}
              icon={BuildingOfficeIcon}
              color="bg-orange-500"
            />
          </div>

          <RevenueChart data={revenueData} />
        </div>
      )}

      {/* User Analytics */}
      {activeMetric === 'users' && userGrowthData.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardStats.users.byType.map((userType) => (
              <StatCard
                key={userType._id}
                title={userType._id === 'individual' ? 'Individuals' : 
                       userType._id === 'company' ? 'Companies' : 
                       userType._id === 'customer' ? 'Customers' : 
                       userType._id}
                value={userType.count}
                change={calculateGrowth(userType.count, userType.count * 0.8)}
                icon={userType._id === 'company' ? BuildingOfficeIcon : UsersIcon}
                color={userType._id === 'company' ? 'bg-blue-500' : 
                       userType._id === 'individual' ? 'bg-green-500' : 
                       'bg-purple-500'}
              />
            ))}
          </div>

          <UserGrowthChart data={userGrowthData} />
        </div>
      )}

      {/* Listing Analytics */}
      {activeMetric === 'listings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Products"
              value={dashboardStats.products.total}
              change={12.3}
              icon={BuildingOfficeIcon}
              color="bg-blue-500"
            />
            <StatCard
              title="Active"
              value={dashboardStats.products.active}
              change={15.8}
              icon={ChartBarIcon}
              color="bg-green-500"
            />
            <StatCard
              title="Categories"
              value={dashboardStats.products.byCategory?.length || 0}
              change={5.2}
              icon={BuildingOfficeIcon}
              color="bg-yellow-500"
            />
            <StatCard
              title="This Month"
              value={Math.floor(dashboardStats.products.total * 0.1)}
              change={18.5}
              icon={CalendarIcon}
              color="bg-purple-500"
            />
          </div>

          {/* Categories Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Products by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardStats.products.byCategory?.map((category, index) => (
                <div key={category._id || index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {category._id || category.name || 'Uncategorized'}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {formatNumber(category.count)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Engagement Analytics */}
      {activeMetric === 'engagement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Reviews"
              value={dashboardStats.reviews.total}
              change={12.5}
              icon={EyeIcon}
              color="bg-blue-500"
            />
            <StatCard
              title="Average Rating"
              value={dashboardStats.reviews.averageRating.toFixed(1)}
              change={2.1}
              icon={ChatBubbleLeftRightIcon}
              color="bg-green-500"
              suffix=" ⭐"
            />
            <StatCard
              title="Service Inquiries"
              value={dashboardStats.serviceInquiries.total}
              change={22.3}
              icon={ChatBubbleLeftRightIcon}
              color="bg-purple-500"
            />
            <StatCard
              title="Pending Actions"
              value={pendingOrders + pendingInquiries}
              change={-5.1}
              icon={ClockIcon}
              color="bg-orange-500"
            />
          </div>

          {/* Engagement Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Order Status
              </h3>
              <div className="space-y-3">
                {dashboardStats.orders.byStatus?.map((status) => (
                  <div key={status._id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {status._id}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatNumber(status.count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Inquiry Status
              </h3>
              <div className="space-y-3">
                {dashboardStats.serviceInquiries.byStatus?.map((status) => (
                  <div key={status._id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {status._id}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatNumber(status.count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Geographic Analytics */}
      {activeMetric === 'geographic' && (
        <div className="space-y-6">
          <GeographicDistribution data={geographicData} />
        </div>
      )}

      {/* Loading overlay for refresh */}
      {(refreshing || isLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 dark:text-gray-100">
              {refreshing ? 'Refreshing analytics...' : 'Loading...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformAnalytics;