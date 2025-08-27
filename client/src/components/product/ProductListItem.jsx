// components/product/ProductListItem.jsx
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
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { toggleWishlist } from '../../store/slices/productSlice';
import ShareModal from './ShareModal';
import Badge from '../ui/Badge';
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

  // Get property features
  const getPropertyFeatures = () => {
    const features = [];
    
    // For real estate products
    if (['homes', 'plots', 'commercials'].includes(product.productType) && product.propertyDetails) {
      const { bedrooms, bathrooms, area, parkingSpaces, floors } = product.propertyDetails;
      
      if (bedrooms) features.push(`${bedrooms} bed${bedrooms > 1 ? 's' : ''}`);
      if (bathrooms) features.push(`${bathrooms} bath${bathrooms > 1 ? 's' : ''}`);
      if (area?.value) features.push(`${area.value} ${area.unit || 'sqm'}`);
      if (parkingSpaces) features.push(`${parkingSpaces} parking`);
      if (floors) features.push(`${floors} floor${floors > 1 ? 's' : ''}`);
    }
    
    // For vehicles
    if (product.productType === 'others' && product.vehicleDetails) {
      const { make, model, year, mileage, fuelType, transmission } = product.vehicleDetails;
      if (year) features.push(year.toString());
      if (make && model) features.push(`${make} ${model}`);
      if (mileage) features.push(`${mileage} km`);
      if (fuelType) features.push(fuelType);
      if (transmission) features.push(transmission);
    }
    
    // For other products
    if (product.productType === 'others' && !product.vehicleDetails) {
      if (product.brand) features.push(product.brand);
      if (product.model) features.push(product.model);
      if (product.condition) features.push(product.condition);
    }
    
    return features;
  };

  // Get seller information
  const getSellerInfo = () => {
    if (!product.seller) {
      return {
        name: 'Anonymous',
        type: 'User',
        verified: false,
        avatar: null,
        rating: 0
      };
    }

    // Handle populated seller object
    if (typeof product.seller === 'object' && product.seller._id) {
      if (product.seller.userType === 'company' && product.seller.companyProfile) {
        return {
          name: product.seller.companyProfile.companyName || 'Company',
          type: 'Company',
          verified: product.seller.isVerified || false,
          avatar: product.seller.companyProfile.logo?.url,
          rating: product.seller.companyProfile.rating || 0
        };
      } else if (product.seller.userType === 'individual' && product.seller.individualProfile) {
        const firstName = product.seller.individualProfile.firstName || '';
        const lastName = product.seller.individualProfile.lastName || '';
        return {
          name: `${firstName} ${lastName}`.trim() || 'Individual',
          type: 'Individual',
          verified: product.seller.isVerified || false,
          avatar: product.seller.individualProfile.avatar?.url,
          rating: product.seller.individualProfile.rating || 0
        };
      }
    }
    
    // Fallback for when seller is just an ID or minimal info
    return {
      name: product.sellerType === 'company' ? 'Company' : 'Individual',
      type: product.sellerType || 'User',
      verified: false,
      avatar: null,
      rating: 0
    };
  };

  // Get location display
  const getLocationDisplay = () => {
    // For real estate products
    if (['homes', 'plots', 'commercials'].includes(product.productType) && product.propertyDetails?.location) {
      const location = product.propertyDetails.location;
      const parts = [];
      
      if (location.subcity) parts.push(location.subcity);
      if (location.city) parts.push(location.city);
      if (location.region && location.city !== location.region) parts.push(location.region);
      
      return parts.length > 0 ? parts.join(', ') : (location.city || 'Ethiopia');
    }
    
    return 'Ethiopia';
  };

  // Get property type display
  const getPropertyTypeDisplay = () => {
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
      return { display: 'Price not set', period: '', original: null };
    }

    const { basePrice, salePrice, currency, priceType, rentPrice, isNegotiable } = product.pricing;
    const finalPrice = salePrice || basePrice || 0;
    
    // For rental properties
    if (product.listingType === 'rent' && rentPrice?.monthly) {
      return {
        display: formatCurrency(rentPrice.monthly, currency),
        period: '/month',
        original: null,
        negotiable: isNegotiable
      };
    }
    
    // For sale properties/products
    return {
      display: formatCurrency(finalPrice, currency),
      period: priceType && priceType !== 'fixed' ? `/${priceType.replace('per-', '')}` : '',
      original: salePrice ? formatCurrency(basePrice, currency) : null,
      negotiable: isNegotiable
    };
  };

  const sellerInfo = getSellerInfo();
  const propertyFeatures = getPropertyFeatures();
  const mainImage = product.media?.images?.[currentImageIndex]?.url || '/api/placeholder/600/400';
  const location = getLocationDisplay();
  const propertyType = getPropertyTypeDisplay();
  const priceInfo = getPriceInfo();

  return (
    <>
      <Link to={`/products/${product._id}`} className="group block">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative w-full md:w-80 h-48 md:h-64 flex-shrink-0">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/api/placeholder/600/400';
                }}
              />

              {/* Image Navigation */}
              {product.media?.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
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

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {product.isFeatured && (
                  <Badge variant="warning" size="sm">
                    Featured
                  </Badge>
                )}
                
                {product.isPromoted && (
                  <Badge variant="success" size="sm">
                    Promoted
                  </Badge>
                )}
                
                {product.listingType && (
                  <Badge 
                    variant={product.listingType === 'rent' ? 'info' : 'primary'} 
                    size="sm"
                  >
                    For {product.listingType === 'sell' ? 'Sale' : 'Rent'}
                  </Badge>
                )}

                <Badge variant="default" size="sm">
                  {propertyType}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={handleWishlist}
                  disabled={isLoading}
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
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm">{location}</span>
                      </div>

                      <div className="flex items-center text-gray-500 dark:text-gray-500 mb-3">
                        {['homes', 'plots', 'commercials'].includes(product.productType) ? (
                          <BuildingOfficeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        ) : (
                          <TagIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        )}
                        <span className="text-sm">{propertyType}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {priceInfo.display}
                        {priceInfo.period && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                            {priceInfo.period}
                          </span>
                        )}
                      </div>
                      {priceInfo.original && (
                        <div className="text-sm text-gray-400 line-through">
                          Was {priceInfo.original}
                        </div>
                      )}
                      {priceInfo.negotiable && (
                        <Badge variant="info" size="sm" className="mt-1">
                          Negotiable
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {product.description}
                  </p>

                  {/* Property Features */}
                  {propertyFeatures.length > 0 && (
                    <div className="flex items-center mb-4">
                      {['homes', 'plots', 'commercials'].includes(product.productType) ? (
                        <HomeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      ) : (
                        <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
                      )}
                      <div className="flex flex-wrap gap-2">
                        {propertyFeatures.slice(0, 5).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                        {propertyFeatures.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                            +{propertyFeatures.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Property Amenities */}
                  {product.propertyDetails?.amenities && product.propertyDetails.amenities.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {product.propertyDetails.amenities.slice(0, 4).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs rounded-full font-medium"
                          >
                            {amenity.replace(/[-_]/g, ' ')}
                          </span>
                        ))}
                        {product.propertyDetails.amenities.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                            +{product.propertyDetails.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  {product.reviews?.average > 0 && (
                    <div className="flex items-center mb-4">
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
                          {product.reviews.average.toFixed(1)} ({product.reviews.count} reviews)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
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
                          <span className="text-white font-medium text-sm">
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
                    
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {sellerInfo.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {sellerInfo.type}
                        </span>
                        {sellerInfo.rating > 0 && (
                          <div className="flex items-center">
                            <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 ml-1">
                              {sellerInfo.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
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