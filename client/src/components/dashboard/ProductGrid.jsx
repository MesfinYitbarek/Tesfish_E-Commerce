// components/dashboard/ProductGrid.jsx
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  StarIcon,
  CheckIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

// Helper functions
const formatCurrency = (amount, currency = 'ETB') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'ETB' ? 'USD' : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('$', currency === 'ETB' ? 'ETB ' : '$');
};

const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return new Date(date).toLocaleDateString();
};

const ProductGrid = ({ 
  products = [], 
  selectedProducts = [], 
  onSelectProduct, 
  onDelete 
}) => {
  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
      draft: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400',
      'pending-approval': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
      inactive: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
      sold: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
      rented: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400',
      'out-of-stock': 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400',
      discontinued: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
    };

    const label = status === 'out-of-stock' ? 'Out of Stock' : 
                 status === 'pending-approval' ? 'Pending' :
                 status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status] || badges.draft}`}>
        {label}
      </span>
    );
  };

  const getTypeBadge = (productType, subProductType) => {
    const badges = {
      homes: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
      plots: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
      commercials: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400',
      others: 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400'
    };

    const typeLabels = {
      homes: 'Home',
      plots: 'Land',
      commercials: 'Commercial',
      others: 'Product'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[productType] || badges.others}`}>
        {typeLabels[productType] || 'Product'}
      </span>
    );
  };

  const getListingTypeBadge = (listingType) => {
    if (!listingType) return null;
    
    const badges = {
      sell: 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800',
      rent: 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[listingType]}`}>
        For {listingType === 'sell' ? 'Sale' : 'Rent'}
      </span>
    );
  };

  const getPrice = (product) => {
    if (product.listingType === 'rent' && product.pricing?.rentPrice?.monthly) {
      return {
        amount: formatCurrency(product.pricing.rentPrice.monthly, product.pricing?.currency || 'ETB'),
        period: '/month',
        originalAmount: null
      };
    }
    
    if (product.pricing?.basePrice) {
      const amount = formatCurrency(product.pricing.salePrice || product.pricing.basePrice, product.pricing?.currency || 'ETB');
      const period = product.pricing.priceType !== 'fixed' ? `/${product.pricing.priceType}` : '';
      const originalAmount = product.pricing.salePrice ? formatCurrency(product.pricing.basePrice, product.pricing?.currency || 'ETB') : null;
      
      return { amount, period, originalAmount };
    }
    
    return { amount: 'Price not set', period: '', originalAmount: null };
  };

  const getLocation = (product) => {
    if (['homes', 'plots', 'commercials'].includes(product.productType)) {
      const city = product.propertyDetails?.location?.city;
      const subcity = product.propertyDetails?.location?.subcity;
      
      if (city && subcity) {
        return `${subcity}, ${city}`;
      }
      return city || 'Location not set';
    }
    return null;
  };

  const getPropertyDetails = (product) => {
    if (product.productType === 'plots') {
      const area = product.propertyDetails?.area;
      return area?.value ? `${area.value} ${area.unit || 'sqm'}` : 'Area not specified';
    }
    
    if (['homes', 'commercials'].includes(product.productType)) {
      const bedrooms = product.propertyDetails?.bedrooms;
      const bathrooms = product.propertyDetails?.bathrooms;
      const area = product.propertyDetails?.area;
      
      let details = [];
      if (bedrooms) details.push(`${bedrooms}BR`);
      if (bathrooms) details.push(`${bathrooms}BA`);
      if (area?.value) details.push(`${area.value}${area.unit || 'sqm'}`);
      
      return details.join(' • ') || 'Details not set';
    }
    
    // For others category
    if (product.productType === 'others') {
      if (product.subProductType === 'vehicles' && product.vehicleDetails) {
        const make = product.vehicleDetails.make;
        const year = product.vehicleDetails.year;
        const model = product.vehicleDetails.model;
        
        if (year && make) {
          return model ? `${year} ${make} ${model}` : `${year} ${make}`;
        }
        return 'Vehicle details';
      }
      
      if (product.brand) {
        return product.model ? `${product.brand} ${product.model}` : product.brand;
      }
      
      return 'Product details';
    }
    
    return 'Details not set';
  };

  const getPropertyIcon = (productType) => {
    switch (productType) {
      case 'homes':
        return <HomeIcon className="h-4 w-4" />;
      case 'commercials':
        return <BuildingOfficeIcon className="h-4 w-4" />;
      case 'plots':
        return <MapPinIcon className="h-4 w-4" />;
      default:
        return <HomeIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const price = getPrice(product);
        const location = getLocation(product);
        
        return (
          <div
            key={product._id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Image and Selection */}
            <div className="relative">
              <img
                src={product.media?.images?.[0]?.url }
                alt={product.title}
                className="w-full h-48 object-cover"
                // onError={(e) => {
                //   e.target.src = '/api/placeholder/400/240';
                // }}
              />
              
              {/* Selection Checkbox */}
              <div className="absolute top-3 left-3">
                <button
                  onClick={() => onSelectProduct(product._id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedProducts.includes(product._id)
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-white/80 border-gray-300 hover:border-indigo-500'
                  }`}
                >
                  {selectedProducts.includes(product._id) && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Badges */}
              <div className="absolute top-3 right-3 flex flex-col space-y-2">
                {product.isFeatured && (
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center">
                    <StarIcon className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">Featured</span>
                  </div>
                )}
                {getTypeBadge(product.productType, product.subProductType)}
                {getListingTypeBadge(product.listingType)}
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-3 left-3">
                {getStatusBadge(product.status)}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title and Details */}
              <div className="mb-4">
                <Link
                  to={`/dashboard/listings/${product._id}`}
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-500 line-clamp-2 mb-2 block"
                >
                  {product.title}
                </Link>
                
                {/* Location */}
                {location && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {location}
                  </div>
                )}
                
                {/* Property Details */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  {getPropertyIcon(product.productType)}
                  <span className="ml-1">{getPropertyDetails(product)}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-indigo-500">
                    {price.amount}
                  </span>
                  {price.period && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {price.period}
                    </span>
                  )}
                </div>
                
                {price.originalAmount && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    Original: {price.originalAmount}
                  </div>
                )}
                
                {product.pricing?.isNegotiable && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Negotiable
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span>{product.views || 0}</span>
                </div>
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                  <span>{product.totalInquiries || 0}</span>
                </div>
                {product.reviews?.count && (
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>{product.reviews.average.toFixed(1)}</span>
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
                    to={`/products/${product._id}`}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="View listing"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/dashboard/listings/${product._id}/edit`}
                    className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"
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
        );
      })}
    </div>
  );
};

export default ProductGrid;