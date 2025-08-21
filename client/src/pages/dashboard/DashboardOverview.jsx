import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  BuildingOfficeIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import QuickActions from '../../components/dashboard/QuickActions';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import RecentListings from '../../components/dashboard/RecentListings';
import UpcomingBookings from '../../components/dashboard/UpcomingBookings';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalListings: 12,
          totalViews: 3420,
          totalInquiries: 89,
          totalBookings: 24,
          activeListings: 8,
          pendingListings: 2,
          draftListings: 2,
          thisMonthViews: 1250,
          lastMonthViews: 980,
          thisMonthInquiries: 42,
          lastMonthInquiries: 35,
          averageResponseTime: '2.4 hours',
          conversionRate: 12.5
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    const userName = user?.userType === 'company' 
      ? user.companyProfile?.companyName 
      : user?.individualProfile?.firstName || 'User';

    if (hour < 12) return `Good morning, ${userName}!`;
    if (hour < 17) return `Good afternoon, ${userName}!`;
    return `Good evening, ${userName}!`;
  };

  const statsCards = [
    {
      title: 'Total Listings',
      value: stats.totalListings,
      change: '+2',
      changeType: 'increase',
      icon: BuildingOfficeIcon,
      color: 'blue',
      description: `${stats.activeListings} active, ${stats.pendingListings} pending`
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: `+${((stats.thisMonthViews - stats.lastMonthViews) / stats.lastMonthViews * 100).toFixed(1)}%`,
      changeType: stats.thisMonthViews > stats.lastMonthViews ? 'increase' : 'decrease',
      icon: EyeIcon,
      color: 'green',
      description: `${stats.thisMonthViews} this month`
    },
    {
      title: 'Inquiries',
      value: stats.totalInquiries,
      change: `+${stats.thisMonthInquiries - stats.lastMonthInquiries}`,
      changeType: 'increase',
      icon: ChatBubbleLeftRightIcon,
      color: 'purple',
      description: `${stats.thisMonthInquiries} this month`
    },
    {
      title: 'Bookings',
      value: stats.totalBookings,
      change: '+3',
      changeType: 'increase',
      icon: CalendarIcon,
      color: 'orange',
      description: '4 pending approval'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{getGreeting()}</h1>
            <p className="text-primary-100">
              Here's what's happening with your listings today.
            </p>
          </div>
          <div className="hidden sm:block">
            <Link to="/dashboard/products/create">
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Listing
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Secondary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <RecentListings />

        {/* Upcoming Bookings */}
        <UpcomingBookings />
      </div>

      {/* Performance Insights */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Performance Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Average Response Time
            </h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {stats.averageResponseTime}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Better than 78% of sellers
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <HeartIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Conversion Rate
            </h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {stats.conversionRate}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Views to inquiries
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Profile Views
            </h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              892
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This month
            </p>
          </div>
        </div>
      </div>

      {/* Tips and Recommendations */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
          💡 Tips to Improve Performance
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-yellow-700 dark:text-yellow-300">
              <strong>Add more photos:</strong> Listings with 5+ photos get 40% more views
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-yellow-700 dark:text-yellow-300">
              <strong>Update descriptions:</strong> Detailed descriptions improve inquiry quality
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-yellow-700 dark:text-yellow-300">
              <strong>Respond quickly:</strong> Fast responses increase booking conversion by 25%
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Link 
            to="/dashboard/analytics" 
            className="inline-flex items-center text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium"
          >
            View detailed analytics
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;