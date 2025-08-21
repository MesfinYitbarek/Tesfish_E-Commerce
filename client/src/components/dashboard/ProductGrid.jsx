import { Link } from 'react-router-dom';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  StarIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

const ProductGrid = ({ 
  products, 
  selectedProducts, 
  onSelectProduct, 
  onDelete 
}) => {
  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
      draft: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
      inactive: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
      sold: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status] || badges.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const badges = {
      'real-estate': 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
      'service': 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[type] || badges['real-estate']}`}>
        {type === 'real-estate' ? 'Property' : 'Service'}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          {/* Image and Selection */}
          <div className="relative">
            <img
              src={product.media?.images?.[0]?.url || '/api/placeholder/400/240'}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3">
              <button
                onClick={() => onSelectProduct(product._id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedProducts.includes(product._id)
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-white/80 border-gray-300 hover:border-primary-500'
                }`}
              >
                {selectedProducts.includes(product._id) && (
                  <CheckIcon className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2">
              {product.featured && (
                <div className="bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center">
                  <StarIcon className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">Featured</span>
                </div>
              )}
              {getTypeBadge(product.type)}
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-3 left-3">
              {getStatusBadge(product.status)}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title and Location */}
            <div className="mb-4">
              <Link
                to={`/dashboard/products/${product._id}`}
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-500 line-clamp-2 mb-2"
              >
                {product.title}
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.type === 'real-estate'
                  ? `${product.realEstateDetails?.location?.city || 'Location'}`
                  : `${product.serviceDetails?.serviceArea || 'Service Area'}`
                }
              </p>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="text-xl font-bold text-primary-500">
                {formatCurrency(product.pricing?.basePrice || 0, 'ETB')}
              </div>
              {product.pricing?.priceType && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  per {product.pricing.priceType}
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                <span>{product.views} views</span>
              </div>
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                <span>{product.inquiries} inquiries</span>
              </div>
              {product.type === 'service' && (
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{product.bookings} bookings</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Updated {formatRelativeTime(product.updatedAt)}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Link
                  to={`/product/${product._id}`}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="View listing"
                >
                  <EyeIcon className="h-4 w-4" />
                </Link>
                <Link
                  to={`/dashboard/products/${product._id}/edit`}
                  className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                  title="Edit listing"
                >
                  <PencilIcon className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => onDelete(product)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete listing"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;