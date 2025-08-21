import { 
  MapPinIcon, 
  HomeIcon, 
  CalendarIcon, 
  EyeIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

const ProductInfo = ({ product }) => {
  const getPropertyFeatures = () => {
    if (product.type !== 'real-estate' || !product.realEstateDetails) return [];
    
    const features = [];
    const details = product.realEstateDetails;
    
    if (details.bedrooms) features.push(`${details.bedrooms} Bedroom${details.bedrooms > 1 ? 's' : ''}`);
    if (details.bathrooms) features.push(`${details.bathrooms} Bathroom${details.bathrooms > 1 ? 's' : ''}`);
    if (details.area) features.push(`${details.area} sqm`);
    if (details.parkingSpaces) features.push(`${details.parkingSpaces} Parking`);
    
    return features;
  };

  const getServiceFeatures = () => {
    if (product.type !== 'service' || !product.serviceDetails) return [];
    
    const features = [];
    const details = product.serviceDetails;
    
    if (details.duration) features.push(`Duration: ${details.duration}`);
    if (details.serviceArea) features.push(`Service Area: ${details.serviceArea}`);
    if (details.availability) features.push(`Available: ${details.availability}`);
    
    return features;
  };

  const getSellerInfo = () => {
    const seller = product.seller;
    if (!seller) return { name: 'Unknown', type: 'User', verified: false };

    if (seller.userType === 'company') {
      return {
        name: seller.companyProfile?.companyName || 'Company',
        type: 'Company',
        verified: seller.isVerified
      };
    } else if (seller.userType === 'individual') {
      return {
        name: `${seller.individualProfile?.firstName || ''} ${seller.individualProfile?.lastName || ''}`.trim() || 'Individual',
        type: 'Individual Seller',
        verified: seller.isVerified
      };
    }
    
    return {
      name: 'User',
      type: 'Seller',
      verified: false
    };
  };

  const propertyFeatures = getPropertyFeatures();
  const serviceFeatures = getServiceFeatures();
  const sellerInfo = getSellerInfo();
  const features = product.type === 'real-estate' ? propertyFeatures : serviceFeatures;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Title and Price */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
        <div className="flex-1 mb-4 lg:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {product.title}
          </h1>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>
              {product.type === 'real-estate' 
                ? `${product.realEstateDetails?.location?.address || product.realEstateDetails?.location?.city || 'Location not specified'}`
                : product.serviceDetails?.serviceArea || 'Service Area not specified'
              }
            </span>
          </div>

          {/* Category and Type */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-full">
              {product.category?.name || 'Uncategorized'}
            </span>
            
            {product.type === 'real-estate' && product.realEstateDetails?.propertyType && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-full capitalize">
                {product.realEstateDetails.propertyType.replace('-', ' ')}
              </span>
            )}
            
            {product.type === 'service' && product.serviceDetails?.serviceType && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-full capitalize">
                {product.serviceDetails.serviceType.replace('-', ' ')}
              </span>
            )}

            {product.condition && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded-full capitalize">
                {product.condition}
              </span>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="text-right">
          <div className="text-3xl lg:text-4xl font-bold text-primary-500 mb-1">
            {formatCurrency(product.pricing?.basePrice || 0, 'ETB')}
          </div>
          
          {product.pricing?.priceType && (
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              per {product.pricing.priceType}
            </div>
          )}
          
          {product.pricing?.negotiable && (
            <div className="text-green-600 dark:text-green-400 text-sm font-medium mt-1">
              Price Negotiable
            </div>
          )}

          {/* Additional Pricing Info */}
          {product.pricing?.discountPercentage > 0 && (
            <div className="mt-2">
              <span className="text-red-500 text-sm font-medium">
                {product.pricing.discountPercentage}% OFF
              </span>
              {product.pricing.originalPrice && (
                <div className="text-gray-500 text-sm line-through">
                  {formatCurrency(product.pricing.originalPrice, 'ETB')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <HomeIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {product.type === 'real-estate' ? 'Property Features' : 'Service Details'}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        {/* Seller Info */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-medium">
              {sellerInfo.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {sellerInfo.name}
              </span>
              {sellerInfo.verified && (
                <CheckCircleIcon className="h-4 w-4 text-green-500 ml-1" />
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {sellerInfo.type}
            </span>
          </div>
        </div>

        {/* Views */}
        <div className="flex items-center">
          <EyeIcon className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {product.views || 0} views
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total impressions
            </span>
          </div>
        </div>

        {/* Posted Date */}
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {formatRelativeTime(product.createdAt)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Date posted
            </span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          product.availability === 'available' 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            : product.availability === 'sold'
            ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            product.availability === 'available' ? 'bg-green-500' 
            : product.availability === 'sold' ? 'bg-red-500' 
            : 'bg-yellow-500'
          }`} />
          {product.availability === 'available' ? 'Available' 
           : product.availability === 'sold' ? 'Sold' 
           : 'Pending'}
        </div>

        {product.featured && (
          <div className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium">
            ⭐ Featured Listing
          </div>
        )}

        {product.urgency === 'urgent' && (
          <div className="flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
            <ClockIcon className="h-4 w-4 mr-1" />
            Urgent
          </div>
        )}

        {product.type === 'service' && product.serviceDetails?.instantBooking && (
          <div className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
            ⚡ Instant Booking
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;