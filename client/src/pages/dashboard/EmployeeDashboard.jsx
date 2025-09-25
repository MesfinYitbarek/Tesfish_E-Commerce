import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  BuildingOfficeIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import StatsCard from '../../components/dashboard/StatsCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EmployeeOverview = () => {
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

    </div>
  );
};

export default EmployeeOverview;