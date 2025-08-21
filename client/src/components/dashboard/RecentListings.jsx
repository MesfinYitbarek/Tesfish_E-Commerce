import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon,
  EyeIcon,
  PencilIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

const RecentListings = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setListings([
          {
            _id: '1',
            title: 'Modern 3BR Apartment in CMC',
            type: 'real-estate',
            status: 'active',
            pricing: { basePrice: 2500000 },
            views: 45,
            inquiries: 3,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            media: { images: [{ url: '/api/placeholder/80/80' }] },
            featured: true
          },
          {
            _id: '2',
            title: 'Interior Design Service',
            type: 'service',
            status: 'pending',
            pricing: { basePrice: 15000, priceType: 'hour' },
            views: 12,
            inquiries: 1,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            media: { images: [{ url: '/api/placeholder/80/80' }] },
            featured: false
          },
          {
            _id: '3',
            title: 'Luxury Villa in Old Airport',
            type: 'real-estate',
            status: 'draft',
            pricing: { basePrice: 8500000 },
            views: 0,
            inquiries: 0,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            media: { images: [{ url: '/api/placeholder/80/80' }] },
            featured: false
          }
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching recent listings:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 dark:text-green-400',
      pending: 'text-yellow-600 dark:text-yellow-400',
      draft: 'text-gray-600 dark:text-gray-400',
      inactive: 'text-red-600 dark:text-red-400'
    };
    return colors[status] || colors.draft;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Recent Listings
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Listings
        </h3>
        <Link 
          to="/dashboard/products"
          className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
        >
          View all
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {listings.map((listing) => (
          <div key={listing._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {/* Image */}
            <div className="relative flex-shrink-0">
              <img
                src={listing.media?.images?.[0]?.url || '/api/placeholder/64/64'}
                alt={listing.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              {listing.featured && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                  <StarIcon className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/dashboard/products/${listing._id}`}
                    className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 line-clamp-1"
                  >
                    {listing.title}
                  </Link>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs font-medium ${getStatusColor(listing.status)}`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {listing.type === 'real-estate' ? 'Property' : 'Service'}
                    </span>
                  </div>
                </div>

                <div className="text-right ml-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(listing.pricing.basePrice, 'ETB')}
                  </div>
                  {listing.pricing.priceType && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      per {listing.pricing.priceType}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <EyeIcon className="h-3 w-3 mr-1" />
                    <span>{listing.views}</span>
                  </div>
                  <span>•</span>
                  <span>{listing.inquiries} inquiries</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Link
                    to={`/dashboard/products/${listing._id}/edit`}
                    className="p-1 text-gray-400 hover:text-primary-500"
                    title="Edit listing"
                  >
                    <PencilIcon className="h-3 w-3" />
                  </Link>
                  <Link
                    to={`/product/${listing._id}`}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="View listing"
                  >
                    <EyeIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-1">
                Created {formatRelativeTime(listing.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <EyeIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            No recent listings
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your recent listings will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentListings;