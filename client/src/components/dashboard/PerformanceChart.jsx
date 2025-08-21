import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const PerformanceChart = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const data = generateMockData(timeRange);
        setChartData(data);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setIsLoading(false);
    }
  };

  const generateMockData = (range) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 100) + 20,
        inquiries: Math.floor(Math.random() * 15) + 2,
        bookings: Math.floor(Math.random() * 5) + 1
      });
    }
    
    return data;
  };

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const metrics = [
    {
      name: 'Views',
      key: 'views',
      color: 'bg-blue-500',
      icon: EyeIcon,
      total: chartData?.reduce((sum, item) => sum + item.views, 0) || 0
    },
    {
      name: 'Inquiries',
      key: 'inquiries',
      color: 'bg-green-500',
      icon: ChatBubbleLeftRightIcon,
      total: chartData?.reduce((sum, item) => sum + item.inquiries, 0) || 0
    },
    {
      name: 'Bookings',
      key: 'bookings',
      color: 'bg-purple-500',
      icon: CalendarIcon,
      total: chartData?.reduce((sum, item) => sum + item.bookings, 0) || 0
    }
  ];

  const getMaxValue = () => {
    if (!chartData) return 100;
    return Math.max(
      ...chartData.map(item => Math.max(item.views, item.inquiries * 5, item.bookings * 10))
    );
  };

  const maxValue = getMaxValue();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ChartBarIcon className="h-6 w-6 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Performance Overview
          </h3>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.key} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className={`w-3 h-3 ${metric.color} rounded-full mr-2`}></div>
              <metric.icon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {metric.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {metric.name}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 w-8">
          <span>{maxValue}</span>
          <span>{Math.floor(maxValue * 0.75)}</span>
          <span>{Math.floor(maxValue * 0.5)}</span>
          <span>{Math.floor(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="border-t border-gray-200 dark:border-gray-700" />
            ))}
          </div>

          {/* Data bars */}
          <div className="relative h-full flex items-end justify-between">
            {chartData?.map((item, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                {/* Bars */}
                <div className="relative flex items-end space-x-0.5 mb-2">
                  {/* Views bar */}
                  <div
                    className="w-3 bg-blue-500 rounded-t transition-all duration-300 group-hover:bg-blue-600"
                    style={{ height: `${(item.views / maxValue) * 100}%` }}
                  />
                  {/* Inquiries bar (scaled up for visibility) */}
                  <div
                    className="w-3 bg-green-500 rounded-t transition-all duration-300 group-hover:bg-green-600"
                    style={{ height: `${(item.inquiries * 5 / maxValue) * 100}%` }}
                  />
                  {/* Bookings bar (scaled up for visibility) */}
                  <div
                    className="w-3 bg-purple-500 rounded-t transition-all duration-300 group-hover:bg-purple-600"
                    style={{ height: `${(item.bookings * 10 / maxValue) * 100}%` }}
                  />
                </div>

                {/* Date label */}
                <div className="text-xs text-gray-500 dark:text-gray-400 transform -rotate-45 origin-left">
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  <div>Views: {item.views}</div>
                  <div>Inquiries: {item.inquiries}</div>
                  <div>Bookings: {item.bookings}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4 text-sm">
        {metrics.map((metric) => (
          <div key={metric.key} className="flex items-center">
            <div className={`w-3 h-3 ${metric.color} rounded-full mr-2`}></div>
            <span className="text-gray-600 dark:text-gray-400">{metric.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;
