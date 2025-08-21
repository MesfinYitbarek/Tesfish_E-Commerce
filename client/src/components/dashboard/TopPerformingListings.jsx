import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrophyIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/helpers';

const TopPerformingListings = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('views'); // views, inquiries, conversion

  useEffect(() => {
    fetchTopListings();
  }, [sortBy]);

  const fetchTopListings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockListings = [
          {
            id: '1',
            title: 'Modern 3BR Apartment in CMC',
            type: 'real-estate',
            views: 245,
            inquiries: 12,
            bookings: 0,
            conversionRate: 4.9,
            image: '/api/placeholder/100/80',
            price: 2500000,
            featured: true
          },
          {
            id: '2',
            title: 'Interior Design Service',
            type: 'service',
            views: 156,
            inquiries: 15,
            bookings: 8,
            conversionRate: 9.6,
            image: '/api/placeholder/100/80',
            price: 15000,
            featured: false
          },
          {
            id: '3',
            title: 'Luxury Villa in Old Airport',
            type: 'real-estate',
            views: 189,
            inquiries: 8,
            bookings: 0,
            conversionRate: 4.2,
            image: '/api/placeholder/100/80',
            price: 8500000,
            featured: true
          },
          {
            id: '4',
            title: 'Project Management Service',
            type: 'service',
            views: 134,
            inquiries: 11,
            bookings: 5,
            conversionRate: 8.2,
            image: '/api/placeholder/100/80',
            price: 25000,
            featured: false
          },
          {
            id: '5',
            title: 'Commercial Office Space',
            type: 'real-estate',
            views: 98,
            inquiries: 6,
            bookings: 0,
            conversionRate: 6.1,
            image: '/api/placeholder/100/80',
            price: 5500000,
            featured: false
          }
        ];

        // Sort listings based on selected criteria
        const sortedListings = mockListings.sort((a, b) => {
          if (sortBy === 'views') return b.views - a.views;
          if (sortBy === 'inquiries') return b.inquiries - a.inquiries;
          if (sortBy === 'conversion') return b.conversionRate - a.conversionRate;
          return 0;
        });

        setListings(sortedListings.slice(0, 5));
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching top listings:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Top Performing Listings
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-500" />
          Top Performing Listings
        </h3>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="views">By Views</option>
          <option value="inquiries">By Inquiries</option>
          <option value="conversion">By Conversion</option>
        </select>
      </div>

      <div className="space-y-4">
        {listings.map((listing, index) => (
          <div key={listing.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {/* Rank */}
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                  : index === 1
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  : index === 2
                  ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {index + 1}
              </div>
            </div>

            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-16 h-12 rounded object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/dashboard/products/${listing.id}`}
                    className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 line-clamp-1"
                  >
                    {listing.title}
                  </Link>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                      {formatCurrency(listing.price, 'ETB')}
                    </span>
                    {listing.featured && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <EyeIcon className="h-3 w-3 mr-1" />
                  <span>{listing.views}</span>
                </div>
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                  <span>{listing.inquiries}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{listing.conversionRate}%</span>
                  <span className="ml-1">conv.</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link 
          to="/dashboard/products"
          className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center"
        >
          View all listings
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default TopPerformingListings;