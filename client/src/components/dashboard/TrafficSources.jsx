import { useState, useEffect } from 'react';
import { 
  GlobeAltIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const TrafficSources = () => {
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrafficSources();
  }, []);

  const fetchTrafficSources = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setSources([
          {
            name: 'Direct',
            visitors: 1247,
            percentage: 36.5,
            change: +12.3,
            icon: GlobeAltIcon,
            color: 'bg-blue-500'
          },
          {
            name: 'Google Search',
            visitors: 892,
            percentage: 26.1,
            change: +8.7,
            icon: MagnifyingGlassIcon,
            color: 'bg-green-500'
          },
          {
            name: 'Social Media',
            visitors: 651,
            percentage: 19.0,
            change: +15.2,
            icon: ShareIcon,
            color: 'bg-purple-500'
          },
          {
            name: 'Mobile App',
            visitors: 523,
            percentage: 15.3,
            change: +22.1,
            icon: DevicePhoneMobileIcon,
            color: 'bg-orange-500'
          },
          {
            name: 'Referrals',
            visitors: 107,
            percentage: 3.1,
            change: -2.4,
            icon: ShareIcon,
            color: 'bg-gray-500'
          }
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching traffic sources:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Traffic Sources
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalVisitors = sources.reduce((sum, source) => sum + source.visitors, 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Traffic Sources
      </h3>

      <div className="space-y-4">
        {sources.map((source, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className={`w-8 h-8 ${source.color} rounded-lg flex items-center justify-center`}>
                <source.icon className="h-4 w-4 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {source.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {source.percentage}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`${source.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {source.visitors.toLocaleString()}
                    </div>
                    <div className={`text-xs ${
                      source.change >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {source.change >= 0 ? '+' : ''}{source.change}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total Visitors</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {totalVisitors.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrafficSources;