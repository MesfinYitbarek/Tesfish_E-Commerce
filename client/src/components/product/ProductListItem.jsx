import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  HeartIcon, 
  ShareIcon, 
  MapPinIcon,
  EyeIcon,
  CalendarIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { toggleWishlist } from '../../store/slices/productSlice';
import ShareModal from './ShareModal';
import Badge from '../ui/Badge';
import { toast } from 'react-hot-toast';

// Helper functions
const formatCurrency = (amount, currency = 'ETB') => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M ${currency}`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K ${currency}`;
  }
  return `${amount} ${currency}`;
};

const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'Now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  
  return new Date(date).toLocaleDateString();
};

const ProductListItem = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlistedItems = [], isLoading } = useSelector((state) => state.products || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const isWishlisted = wishlistedItems.includes(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    try {
      await dispatch(toggleWishlist(product._id)).unwrap();
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareModal(true);
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.media?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.media.images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.media?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.media.images.length) % product.media.images.length);
    }
  };

  // Get simplified property features for mobile
  const getPropertyFeatures = () => {
    const features = [];
    
    if (['homes', 'plots', 'commercials'].includes(product.productType) && product.propertyDetails) {
      const { bedrooms, bathrooms, area } = product.propertyDetails;
      
      if (bedrooms) features.push(`${bedrooms} bed`);
      if (bathrooms) features.push(`${bathrooms} bath`);
      if (area?.value) features.push(`${area.value}m²`);
    }
    
    return features.slice(0, 3); // Limit to 3 for mobile
  };

  // Get simplified seller info
  const getSellerInfo = () => {
    if (!product.seller) {
      return { name: 'Anonymous', verified: false, avatar: null };
    }

    if (typeof product.seller === 'object' && product.seller._id) {
      if (product.seller.userType === 'company' && product.seller.companyProfile) {
        return {
          name: product.seller.companyProfile.companyName || 'Company',
          verified: product.seller.isVerified || false,
          avatar: product.seller.companyProfile.logo?.url
        };
      } else if (product.seller.userType === 'individual' && product.seller.individualProfile) {
        const firstName = product.seller.individualProfile.firstName || '';
        const lastName = product.seller.individualProfile.lastName || '';
        return {
          name: `${firstName} ${lastName}`.trim() || 'Individual',
          verified: product.seller.isVerified || false,
          avatar: product.seller.individualProfile.avatar?.url
        };
      }
    }
    
    return {
      name: product.sellerType === 'company' ? 'Company' : 'Individual',
      verified: false,
      avatar: null
    };
  };

  // Get simplified location
  const getLocationDisplay = () => {
    if (['homes', 'plots', 'commercials'].includes(product.productType) && product.propertyDetails?.location) {
      const location = product.propertyDetails.location;
      return location.city || location.subcity || 'Ethiopia';
    }
    return 'Ethiopia';
  };

  // Get simplified price
  const getPriceInfo = () => {
    if (!product.pricing) {
      return { display: 'Contact for price', period: '' };
    }

    const { basePrice, salePrice, currency, rentPrice } = product.pricing;
    const finalPrice = salePrice || basePrice || 0;
    
    if (product.listingType === 'rent' && rentPrice?.monthly) {
      return {
        display: formatCurrency(rentPrice.monthly, currency),
        period: '/mo'
      };
    }
    
    return {
      display: formatCurrency(finalPrice, currency),
      period: ''
    };
  };

  const sellerInfo = getSellerInfo();
  const propertyFeatures = getPropertyFeatures();
  const mainImage = product.media?.images?.[currentImageIndex]?.url || '/api/placeholder/600/400';
  const location = getLocationDisplay();
  const priceInfo = getPriceInfo();

  return (
    <>
      <Link to={`/products/${product._id}`} className="block group">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative w-full md:w-72 h-48 md:h-56 flex-shrink-0">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 md:rounded-l-lg rounded-t-lg md:rounded-tr-none"
                onError={(e) => {
                  e.target.src = '/api/placeholder/600/400';
                }}
              />

              {/* Image Navigation - Only show on hover for desktop */}
              {product.media?.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-1 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-1 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {product.media.images.slice(0, 3).map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                    {product.media.images.length > 3 && (
                      <div className="text-white text-xs bg-black/50 px-1 rounded">
                        +{product.media.images.length - 3}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                {product.isFeatured && (
                  <Badge variant="warning" size="sm">
                    Featured
                  </Badge>
                )}
                
                {product.listingType && (
                  <Badge 
                    variant={product.listingType === 'rent' ? 'info' : 'primary'} 
                    size="sm"
                  >
                    {product.listingType === 'sell' ? 'Sale' : 'Rent'}
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={handleWishlist}
                  disabled={isLoading}
                  className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-4 w-4 text-red-500" />
                  ) : (
                    <HeartIcon className="h-4 w-4 text-gray-600" />
                  )}
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow"
                >
                  <ShareIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                      <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">{location}</span>
                    </div>

                    <div className="flex items-center text-gray-500 dark:text-gray-500">
                      <TagIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm capitalize">{product.productType || 'Product'}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:text-right md:ml-4">
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {priceInfo.display}
                      {priceInfo.period && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                          {priceInfo.period}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description - Only show on desktop */}
                <div className="hidden md:block">
                  <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 text-sm">
                    {product.description}
                  </p>
                </div>

                {/* Property Features */}
                {propertyFeatures.length > 0 && (
                  <div className="flex items-center mb-4">
                    <div className="flex flex-wrap gap-2">
                      {propertyFeatures.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
                  <div className="flex items-center min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        {sellerInfo.avatar ? (
                          <img
                            src={sellerInfo.avatar}
                            alt={sellerInfo.name}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/40/40';
                            }}
                          />
                        ) : (
                          <span className="text-white font-medium text-xs">
                            {sellerInfo.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      {sellerInfo.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckBadgeIcon className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-2 min-w-0">
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate block">
                        {sellerInfo.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Seller
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    <div className="flex items-center">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      <span>{product.views || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      <span>{formatRelativeTime(product.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={product}
      />
    </>
  );
};

export default ProductListItem;