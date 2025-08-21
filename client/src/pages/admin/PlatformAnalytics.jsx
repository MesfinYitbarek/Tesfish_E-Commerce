import { useState, useEffect } from 'react';
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
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import RevenueChart from '../../components/admin/analytics/RevenueChart';
import UserGrowthChart from '../../components/admin/analytics/UserGrowthChart';
// import ListingStatsChart from '../../components/admin/analytics/ListingStatsChart';
import GeographicDistribution from '../../components/admin/analytics/GeographicDistribution';
// import EngagementMetrics from '../../components/admin/analytics/EngagementMetrics';
// import TopPerformers from '../../components/admin/analytics/TopPerformers';
import { formatCurrency, formatNumber } from '../../utils/helpers';

const PlatformAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = {
        overview: {
          totalRevenue: 2850000,
          revenueGrowth: 15.2,
          totalUsers: 12847,
          userGrowth: 8.7,
          totalListings: 5634,
          listingGrowth: 12.3,
          activeListings: 4891,
          completedTransactions: 342,
          transactionGrowth: 22.1
        },
        revenue: {
          total: 2850000,
          thisMonth: 320000,
          lastMonth: 285000,
          growth: 12.3,
          chartData: [
            { month: 'Jan', revenue: 180000, subscriptions: 45000, commissions: 135000 },
            { month: 'Feb', revenue: 220000, subscriptions: 52000, commissions: 168000 },
            { month: 'Mar', revenue: 285000, subscriptions: 58000, commissions: 227000 },
            { month: 'Apr', revenue: 320000, subscriptions: 65000, commissions: 255000 },
            { month: 'May', revenue: 298000, subscriptions: 62000, commissions: 236000 },
            { month: 'Jun', revenue: 345000, subscriptions: 71000, commissions: 274000 }
          ],
          breakdown: {
            subscriptions: 385000,
            commissions: 1890000,
            registrationFees: 285000,
            premiumListings: 290000
          }
        },
        users: {
          total: 12847,
          companies: 3254,
          individuals: 8392,
          customers: 1201,
          chartData: [
            { month: 'Jan', companies: 2850, individuals: 7200, customers: 980 },
            { month: 'Feb', companies: 2920, individuals: 7450, customers: 1020 },
            { month: 'Mar', companies: 3080, individuals: 7820, customers: 1085 },
            { month: 'Apr', companies: 3180, individuals: 8100, customers: 1150 },
            { month: 'May', companies: 3220, individuals: 8250, customers: 1180 },
            { month: 'Jun', companies: 3254, individuals: 8392, customers: 1201 }
          ],
          growth: {
            companies: 12.8,
            individuals: 8.4,
            customers: 18.2
          }
        },
        listings: {
          total: 5634,
          realEstate: 3890,
          services: 1744,
          approved: 4891,
          pending: 543,
          rejected: 200,
          chartData: [
            { month: 'Jan', realEstate: 3200, services: 1350, approved: 3950, pending: 400, rejected: 150 },
            { month: 'Feb', realEstate: 3350, services: 1420, approved: 4180, pending: 420, rejected: 170 },
            { month: 'Mar', realEstate: 3580, services: 1580, approved: 4380, pending: 480, rejected: 180 },
            { month: 'Apr', realEstate: 3720, services: 1650, approved: 4620, pending: 520, rejected: 190 },
            { month: 'May', realEstate: 3850, services: 1720, approved: 4780, pending: 535, rejected: 195 },
            { month: 'Jun', realEstate: 3890, services: 1744, approved: 4891, pending: 543, rejected: 200 }
          ]
        },
        geographic: {
          cities: [
            { city: 'Addis Ababa', users: 7245, listings: 3890, revenue: 1650000, percentage: 45.2 },
            { city: 'Dire Dawa', users: 1850, listings: 890, revenue: 385000, percentage: 12.8 },
            { city: 'Mekelle', users: 1420, listings: 520, revenue: 225000, percentage: 9.1 },
            { city: 'Hawassa', users: 980, listings: 380, revenue: 165000, percentage: 6.5 },
            { city: 'Bahir Dar', users: 820, listings: 310, revenue: 140000, percentage: 5.8 },
            { city: 'Jimma', users: 532, listings: 644, revenue: 285000, percentage: 20.6 }
          ],
          regions: [
            { region: 'Addis Ababa', percentage: 45.2 },
            { region: 'Oromia', percentage: 28.5 },
            { region: 'Tigray', percentage: 12.3 },
            { region: 'Amhara', percentage: 8.9 },
            { region: 'SNNPR', percentage: 5.1 }
          ]
        },
        engagement: {
          pageViews: 2850000,
          uniqueVisitors: 485000,
          avgSessionDuration: 425, // seconds
          bounceRate: 35.2,
          messagesSent: 18500,
          bookingsMade: 1250,
          searchQueries: 125000,
          chartData: [
            { date: '2024-01-01', views: 45000, visitors: 8500, messages: 580, bookings: 45 },
            { date: '2024-01-02', views: 48000, visitors: 9200, messages: 620, bookings: 52 },
            { date: '2024-01-03', views: 52000, visitors: 9800, messages: 680, bookings: 58 },
            { date: '2024-01-04', views: 49000, visitors: 9100, messages: 640, bookings: 49 },
            { date: '2024-01-05', views: 55000, visitors: 10500, messages: 720, bookings: 63 },
            { date: '2024-01-06', views: 58000, visitors: 11200, messages: 780, bookings: 71 },
            { date: '2024-01-07', views: 61000, visitors: 11800, messages: 820, bookings: 78 }
          ]
        },
        topPerformers: {
          listings: [
            { id: '1', title: 'Luxury Villa - Bole', views: 15420, inquiries: 89, seller: 'Prime Properties' },
            { id: '2', title: 'Modern Apartment - CMC', views: 12850, inquiries: 67, seller: 'Sarah Johnson' },
            { id: '3', title: 'Commercial Space - Piazza', views: 11290, inquiries: 54, seller: 'Metro Real Estate' },
            { id: '4', title: 'Interior Design Service', views: 9850, inquiries: 43, seller: 'Creative Interiors' },
            { id: '5', title: 'Engineering Consultancy', views: 8920, inquiries: 38, seller: 'TechnoEng Solutions' }
          ],
          sellers: [
            { id: '1', name: 'Prime Properties Ltd', listings: 45, revenue: 1250000, rating: 4.8 },
            { id: '2', name: 'Metro Real Estate', listings: 38, revenue: 980000, rating: 4.7 },
            { id: '3', name: 'Creative Interiors', listings: 28, revenue: 420000, rating: 4.9 },
            { id: '4', name: 'Sarah Johnson', listings: 12, revenue: 285000, rating: 4.6 },
            { id: '5', name: 'TechnoEng Solutions', listings: 15, revenue: 380000, rating: 4.8 }
          ],
          categories: [
            { category: 'Real Estate', revenue: 1890000, listings: 3890, growth: 15.2 },
            { category: 'Interior Design', revenue: 485000, listings: 890, growth: 22.8 },
            { category: 'Engineering', revenue: 285000, listings: 520, growth: 18.5 },
            { category: 'Project Management', revenue: 190000, listings: 334, growth: 12.1 }
          ]
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, isCurrency = false, suffix = '' }) => {
    const isPositive = change > 0;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
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
          <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center`}>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

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
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
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
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
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
              value={analyticsData.overview.totalRevenue}
              change={analyticsData.overview.revenueGrowth}
              icon={CurrencyDollarIcon}
              color="bg-green-500"
              isCurrency
            />
            <StatCard
              title="Total Users"
              value={analyticsData.overview.totalUsers}
              change={analyticsData.overview.userGrowth}
              icon={UsersIcon}
              color="bg-blue-500"
            />
            <StatCard
              title="Active Listings"
              value={analyticsData.overview.activeListings}
              change={analyticsData.overview.listingGrowth}
              icon={BuildingOfficeIcon}
              color="bg-purple-500"
            />
            <StatCard
              title="Completed Transactions"
              value={analyticsData.overview.completedTransactions}
              change={analyticsData.overview.transactionGrowth}
              icon={ChartBarIcon}
              color="bg-orange-500"
            />
          </div>

          {/* Quick Overview Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Revenue Trend
              </h3>
              <RevenueChart data={analyticsData.revenue.chartData} compact />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                User Growth
              </h3>
              <UserGrowthChart data={analyticsData.users.chartData} compact />
            </div>
          </div>
        </div>
      )}

      {/* Revenue Analytics */}
      {activeMetric === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={analyticsData.revenue.total}
              change={analyticsData.revenue.growth}
              icon={CurrencyDollarIcon}
              color="bg-green-500"
              isCurrency
            />
            <StatCard
              title="This Month"
              value={analyticsData.revenue.thisMonth}
              change={12.3}
              icon={CalendarIcon}
              color="bg-blue-500"
              isCurrency
            />
            <StatCard
              title="Subscriptions"
              value={analyticsData.revenue.breakdown.subscriptions}
              change={8.5}
              icon={UsersIcon}
              color="bg-purple-500"
              isCurrency
            />
            <StatCard
              title="Commissions"
              value={analyticsData.revenue.breakdown.commissions}
              change={15.2}
              icon={ChartBarIcon}
              color="bg-orange-500"
              isCurrency
            />
          </div>

          <RevenueChart data={analyticsData.revenue.chartData} />
        </div>
      )}

      {/* User Analytics */}
      {activeMetric === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Companies"
              value={analyticsData.users.companies}
              change={analyticsData.users.growth.companies}
              icon={BuildingOfficeIcon}
              color="bg-blue-500"
            />
            <StatCard
              title="Individuals"
              value={analyticsData.users.individuals}
              change={analyticsData.users.growth.individuals}
              icon={UsersIcon}
              color="bg-green-500"
            />
            <StatCard
              title="Customers"
              value={analyticsData.users.customers}
              change={analyticsData.users.growth.customers}
              icon={ChatBubbleLeftRightIcon}
              color="bg-purple-500"
            />
          </div>

          <UserGrowthChart data={analyticsData.users.chartData} />
        </div>
      )}

      {/* Listing Analytics */}
      {activeMetric === 'listings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Listings"
              value={analyticsData.listings.total}
              change={12.3}
              icon={BuildingOfficeIcon}
              color="bg-blue-500"
            />
            <StatCard
              title="Approved"
              value={analyticsData.listings.approved}
              change={15.8}
              icon={ChartBarIcon}
              color="bg-green-500"
            />
            <StatCard
              title="Pending"
              value={analyticsData.listings.pending}
              change={-5.2}
              icon={ClockIcon}
              color="bg-yellow-500"
            />
            <StatCard
              title="Real Estate"
              value={analyticsData.listings.realEstate}
              change={18.5}
              icon={BuildingOfficeIcon}
              color="bg-purple-500"
            />
          </div>

          {/* <ListingStatsChart data={analyticsData.listings.chartData} /> */}
        </div>
      )}

      {/* Engagement Analytics */}
      {activeMetric === 'engagement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Page Views"
              value={analyticsData.engagement.pageViews}
              change={12.5}
              icon={EyeIcon}
              color="bg-blue-500"
            />
            <StatCard
              title="Unique Visitors"
              value={analyticsData.engagement.uniqueVisitors}
              change={8.9}
              icon={UsersIcon}
              color="bg-green-500"
            />
            <StatCard
              title="Messages Sent"
              value={analyticsData.engagement.messagesSent}
              change={22.3}
              icon={ChatBubbleLeftRightIcon}
              color="bg-purple-500"
            />
            <StatCard
              title="Bounce Rate"
              value={analyticsData.engagement.bounceRate}
              change={-2.1}
              icon={TrendingDownIcon}
              color="bg-orange-500"
              suffix="%"
            />
          </div>

          {/* <EngagementMetrics data={analyticsData.engagement.chartData} /> */}
        </div>
      )}

      {/* Geographic Analytics */}
      {activeMetric === 'geographic' && (
        <div className="space-y-6">
          <GeographicDistribution data={analyticsData.geographic} />
        </div>
      )}

      {/* Top Performers */}
      {/* <TopPerformers data={analyticsData.topPerformers} /> */}
    </div>
  );
};

export default PlatformAnalytics;