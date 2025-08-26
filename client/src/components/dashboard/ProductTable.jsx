// components/dashboard/ProductTable.jsx
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  StarIcon,
  MapPinIcon,
  HomeIcon
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

const ProductTable = ({ 
  products = [], 
  selectedProducts = [], 
  onSelectProduct, 
  onSelectAll, 
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
        period: '/month'
      };
    }
    
    if (product.pricing?.basePrice) {
      return {
        amount: formatCurrency(product.pricing.salePrice || product.pricing.basePrice, product.pricing?.currency || 'ETB'),
        period: product.pricing.priceType !== 'fixed' ? `/${product.pricing.priceType}` : ''
      };
    }
    
    return { amount: 'Not set', period: '' };
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
    return 'N/A';
  };

  const getPropertyDetails = (product) => {
    if (product.productType === 'plots') {
      const area = product.propertyDetails?.area;
      return area?.value ? `${area.value}${area.unit || 'sqm'}` : 'Area not set';
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
      }
      
      if (product.brand) {
        return product.model ? `${product.brand} ${product.model}` : product.brand;
      }
      
      return 'Product details';
    }
    
    return 'Details not set';
  };

  const allSelected = products.length > 0 && selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={onSelectAll}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Listing
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Performance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => {
            const price = getPrice(product);
            return (
              <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => onSelectProduct(product._id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-16">
                      <img
                        className="h-12 w-16 rounded-lg object-cover"
                        src={product.media?.images?.[0]?.url || '/api/placeholder/64/48'}
                        alt={product.title}
                        onError={(e) => {
                          e.target.src = '/api/placeholder/64/48';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/dashboard/listings/${product._id}`}
                          className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-500 truncate max-w-xs"
                        >
                          {product.title}
                        </Link>
                        {product.isFeatured && (
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getPropertyDetails(product)}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    {getTypeBadge(product.productType, product.subProductType)}
                    {getListingTypeBadge(product.listingType)}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                    {getLocation(product)}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {price.amount}
                    {price.period && (
                      <span className="text-gray-500 dark:text-gray-400 font-normal">
                        {price.period}
                      </span>
                    )}
                  </div>
                  {product.pricing?.isNegotiable && (
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Negotiable
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">
                  {getStatusBadge(product.status)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      <span>{product.views || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                      <span>{product.totalInquiries || 0}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(product.updatedAt)}
                </td>

                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="View listing"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/dashboard/listings/${product._id}/edit`}
                      className="text-gray-400 hover:text-indigo-500"
                      title="Edit listing"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(product)}
                      className="text-gray-400 hover:text-red-500"
                      title="Delete listing"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;