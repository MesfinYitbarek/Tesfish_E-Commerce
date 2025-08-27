// components/product/ProductCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  HeartIcon, 
  ShareIcon, 
  MapPinIcon,
  HomeIcon,
  EyeIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  BuildingOfficeIcon,
  TagIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { toggleWishlist } from '../../store/slices/productSlice';
import ShareModal from './ShareModal';
import productService from '../../services/productService';
import { toast } from 'react-hot-toast';

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

const ProductCard = ({ product, variant = 'default' }) => {
  const dispatch = useDispatch();
  const { wishlistedItems = [], isLoading } = useSelector((state) => state.products || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isWishlisted = wishlistedItems.includes(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    setWishlistLoading(true);
    try {
      await dispatch(toggleWishlist(product._id)).unwrap();
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareModal(true);
  };

  const handleCardClick = async () => {
    try {
      // Increment view count
      await productService.incrementViews(product._id);
    } catch (error) {
      // Silently handle error
      console.error('Failed to increment views:', error);
    }
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

  // Get property features based on product type
  const getPropertyFeatures = () => {
    const features = [];
    
    if (['homes', 'plots', 'commercials'].includes(product.productType) && product.propertyDetails) {
      const { bedrooms, bathrooms, area, parkingSpaces } = product.propertyDetails;
      
      if (bedrooms) features.push(`${bedrooms} bed${bedrooms > 1 ? 's' : ''}`);
      if (bathrooms) features.push(`${bathrooms} bath${bathrooms > 1 ? 's' : ''}`);
      if (area?.value) features.push(`${area.value} ${area.unit || 'sqm'}`);
      if (parkingSpaces) features.push(`${parkingSpaces} parking`);
    }
    
    // For other product types, show different features
    if (product.productType === 'others') {
      if (product.vehicleDetails) {
        const { make, year, fuelType } = product.vehicleDetails;
        if (year) features.push(year.toString());
        if (make) features.push(make);
        if (fuelType) features.push(fuelType);
      }
      if (product.brand) features.push(product.brand);
      if (product.condition) features.push(product.condition);
    }
    
    return features.slice(0, 3); // Limit to 3 features for compact display
  };

  // Get seller information
  const getSellerInfo = () => {
    if (!product.seller) {
      return {
        name: 'Anonymous',
        type: 'User',
        verified: false,
        avatar: null
      };
    }

    // Handle populated seller object
    if (typeof product.seller === 'object' && product.seller._id) {
      if (product.seller.userType === 'company' && product.seller.companyProfile) {
        return {
          name: product.seller.companyProfile.companyName || 'Company',
          type: 'Company',
          verified: product.seller.isVerified || false,
          avatar: product.seller.companyProfile.logo?.url
        };
      } else if (product.seller.userType === 'individual' && product.seller.individualProfile) {
        const firstName = product.seller.individualProfile.firstName || '';
        const lastName = product.seller.individualProfile.lastName || '';
        return {
          name: `${firstName} ${lastName}`.trim() || 'Individual',
          type: 'Individual',
          verified: product.seller.isVerified || false,
          avatar: product.seller.individualProfile.avatar?.url
        };
      }
    }
    
    // Fallback for when seller is just an ID or minimal info
    return {
      name: product.sellerType === 'company' ? 'Company' : 'Individual',
      type: product.sellerType || 'User',
      verified: false,
      avatar: null
    };
  };

  // Get location display
  const getLocation = () => {
    // For real estate products
    if (['homes', 'plots', 'commercials'].includes(product.productType) && product.propertyDetails?.location) {
      const location = product.propertyDetails.location;
      const parts = [];
      
      if (location.subcity) parts.push(location.subcity);
      if (location.city) parts.push(location.city);
      
      return parts.length > 0 ? parts.join(', ') : (location.city || 'Ethiopia');
    }
    
    return 'Ethiopia';
  };

  // Get product type display
  const getProductTypeDisplay = () => {
    const typeMap = {
      'houses': 'House',
      'apartment': 'Apartment',
      'villas': 'Villa',
      'condos': 'Condo',
      'townhouses': 'Townhouse',
      'offices': 'Office',
      'warehouses': 'Warehouse',
      'shops': 'Shop',
      'mixed-use-land': 'Mixed Use Land',
      'residential-land': 'Residential Land',
      'commercial-land': 'Commercial Land',
      'agricultural-land': 'Agricultural Land',
      'buildings': 'Building',
      'factories': 'Factory',
      'hotels': 'Hotel',
      'companies': 'Company',
      'electronics': 'Electronics',
      'vehicles': 'Vehicle',
      'furnitures': 'Furniture',
      'agricultural-products': 'Agricultural Products',
      'construction-equipment': 'Construction Equipment'
    };
    
    return typeMap[product.subProductType] || product.productType || 'Product';
  };

  // Get price information
  const getPriceInfo = () => {
    if (!product.pricing) {
      return { display: 'Price not set', period: '' };
    }

    const { basePrice, salePrice, currency, priceType, rentPrice } = product.pricing;
    const finalPrice = salePrice || basePrice || 0;
    
    // For rental properties
    if (product.listingType === 'rent' && rentPrice?.monthly) {
      return {
        display: formatCurrency(rentPrice.monthly, currency),
        period: '/month',
        original: null
      };
    }
    
    // For sale properties/products
    return {
      display: formatCurrency(finalPrice, currency),
      period: priceType && priceType !== 'fixed' ? `/${priceType.replace('per-', '')}` : '',
      original: salePrice ? formatCurrency(basePrice, currency) : null
    };
  };

  const sellerInfo = getSellerInfo();
  const propertyFeatures = getPropertyFeatures();
  const location = getLocation();
  const productType = getProductTypeDisplay();
  const priceInfo = getPriceInfo();
  const mainImage = product.media?.images?.[currentImageIndex]?.url || '/api/placeholder/400/300';

  return (
    <>
      <Link to={`/products/${product._id}`} className="group block" onClick={handleCardClick}>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-200 dark:border-gray-800">
          {/* Image Gallery */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onLoad={() => setImageLoading(false)}
              onError={(e) => {
                setImageLoading(false);
                e.target.src = '/api/placeholder/400/300';
              }}
            />
            
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            )}

            {/* Image Navigation */}
            {product.media?.images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {product.media.images.slice(0, 5).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                  {product.media.images.length > 5 && (
                    <div className="text-white text-xs bg-black/50 px-1 rounded">
                      +{product.media.images.length - 5}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Overlay Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {product.isFeatured && (
                <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
              
              {product.isPromoted && (
                <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                  Promoted
                </span>
              )}
              
              {product.listingType && (
                <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full">
                  For {product.listingType === 'sell' ? 'Sale' : 'Rent'}
                </span>
              )}
              
              <span className="px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
                {productType}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2">
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <ShareIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Price Badge */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full">
                <div className="text-lg font-bold text-indigo-600">
                  {priceInfo.display}
                  {priceInfo.period && (
                    <span className="text-sm text-gray-500 font-normal">
                      {priceInfo.period}
                    </span>
                  )}
                </div>
                {priceInfo.original && (
                  <div className="text-xs text-gray-400 line-through">
                    {priceInfo.original}
                  </div>
                )}
                {product.pricing?.isNegotiable && (
                  <div className="text-xs text-green-600 font-medium">
                    Negotiable
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition-colors line-clamp-2 mb-2">
                {product.title}
              </h3>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm truncate">{location}</span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Property Features */}
            {propertyFeatures.length > 0 && (
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center">
                  {['homes', 'plots', 'commercials'].includes(product.productType) ? (
                    <HomeIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <TagIcon className="h-4 w-4 mr-1" />
                  )}
                  <span>{propertyFeatures.join(' • ')}</span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    {sellerInfo.avatar ? (
                      <img
                        src={sellerInfo.avatar}
                        alt={sellerInfo.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/32/32';
                        }}
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {sellerInfo.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  {sellerInfo.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckBadgeIcon className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="ml-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {sellerInfo.name.length > 15 ? `${sellerInfo.name.substring(0, 15)}...` : sellerInfo.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {sellerInfo.type}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span>{product.views || 0}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{formatRelativeTime(product.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            {product.reviews?.average && product.reviews.average > 0 && (
              <div className="flex items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.reviews.average)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {product.reviews.average.toFixed(1)} ({product.reviews.count})
                  </span>
                </div>
              </div>
            )}
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

export default ProductCard;