import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import StatsCard from '../../components/dashboard/StatsCard';
import TopPerformingListings from '../../components/dashboard/TopPerformingListings';
import TrafficSources from '../../components/dashboard/TrafficSources';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setAnalyticsData({
          overview: {
            totalViews: 3420,
            totalInquiries: 89,
            totalBookings: 24,
            conversionRate: 2.6,
            averageResponseTime: 2.4,
            profileViews: 892
          },
          trends: {
            views: { current: 3420, previous: 2890, change: 18.3 },
            inquiries: { current: 89, previous: 76, change: 17.1 },
            bookings: { current: 24, previous: 19, change: 26.3 },
            conversion: { current: 2.6, previous: 2.6, change: 0 }
          },
          demographics: {
            topCities: [
              { name: 'Addis Ababa', percentage: 68, count: 2326 },
              { name: 'Dire Dawa', percentage: 12, count: 410 },
              { name: 'Mekelle', percentage: 8, count: 274 },
              { name: 'Hawassa', percentage: 7, count: 239 },
              { name: 'Others', percentage: 5, count: 171 }
            ],
            deviceTypes: [
              { name: 'Mobile', percentage: 58, count: 1984 },
              { name: 'Desktop', percentage: 35, count: 1197 },
              { name: 'Tablet', percentage: 7, count: 239 }
            ]
          },
          timeData: {
            daily: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              views: Math.floor(Math.random() * 150) + 50,
              inquiries: Math.floor(Math.random() * 10) + 1,
              bookings: Math.floor(Math.random() * 3)
            }))
          }
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setIsLoading(false);
    }
  };

  const exportData = () => {
    // Create CSV data
    const csvData = [
      ['Date', 'Views', 'Inquiries', 'Bookings'],
      ...analyticsData.timeData.daily.map(item => [
        item.date,
        item.views,
        item.inquiries,
        item.bookings
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Views',
      value: analyticsData.overview.totalViews.toLocaleString(),
      change: `+${analyticsData.trends.views.change}%`,
      changeType: 'increase',
      icon: EyeIcon,
      color: 'blue',
      description: `${analyticsData.trends.views.current - analyticsData.trends.views.previous} more than last period`
    },
    {
      title: 'Inquiries',
      value: analyticsData.overview.totalInquiries,
      change: `+${analyticsData.trends.inquiries.change}%`,
      changeType: 'increase',
      icon: ChatBubbleLeftRightIcon,
      color: 'green',
      description: `${analyticsData.trends.inquiries.current - analyticsData.trends.inquiries.previous} more than last period`
    },
    {
      title: 'Bookings',
      value: analyticsData.overview.totalBookings,
      change: `+${analyticsData.trends.bookings.change}%`,
      changeType: 'increase',
      icon: CalendarIcon,
      color: 'purple',
      description: `${analyticsData.trends.bookings.current - analyticsData.trends.bookings.previous} more than last period`
    },
    {
      title: 'Conversion Rate',
      value: `${analyticsData.overview.conversionRate}%`,
      change: analyticsData.trends.conversion.change === 0 ? '0%' : `${analyticsData.trends.conversion.change > 0 ? '+' : ''}${analyticsData.trends.conversion.change}%`,
      changeType: analyticsData.trends.conversion.change >= 0 ? 'increase' : 'decrease',
      icon: ArrowTrendingUpIcon,
      color: 'orange',
      description: 'Views to inquiries conversion'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your listing performance and customer engagement
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Traffic Sources */}
        <div>
          <TrafficSources />
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Listings */}
        <TopPerformingListings />

        {/* Demographics */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Audience Demographics
          </h3>

          {/* Top Cities */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Top Cities
            </h4>
            <div className="space-y-3">
              {analyticsData.demographics.topCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span className="text-sm text-gray-900 dark:text-gray-100 w-20">
                      {city.name}
                    </span>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${city.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {city.percentage}%
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {city.count} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Types */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Device Types
            </h4>
            <div className="space-y-3">
              {analyticsData.demographics.deviceTypes.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span className="text-sm text-gray-900 dark:text-gray-100 w-16">
                      {device.name}
                    </span>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {device.percentage}%
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {device.count} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2" />
          Performance Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Response Time
            </h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {analyticsData.overview.averageResponseTime}h
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average response time
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <EyeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Profile Views
            </h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {analyticsData.overview.profileViews}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total profile visits
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChartBarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Engagement Rate
            </h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              8.2%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Views to interactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;