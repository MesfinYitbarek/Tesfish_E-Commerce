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
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { toggleWishlist } from '../../store/slices/productSlice';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import ShareModal from './ShareModal';
import productService from '../../services/productService';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, variant = 'default' }) => {
  const dispatch = useDispatch();
  const { wishlistedItems, isLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
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
      await productService.toggleWishlist(product._id);
      dispatch(toggleWishlist(product._id));
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
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

  const getPropertyFeatures = () => {
    const features = [];
    if (product.realEstateDetails?.bedrooms) {
      features.push(`${product.realEstateDetails.bedrooms} bed`);
    }
    if (product.realEstateDetails?.bathrooms) {
      features.push(`${product.realEstateDetails.bathrooms} bath`);
    }
    if (product.realEstateDetails?.area?.value) {
      features.push(`${product.realEstateDetails.area.value} ${product.realEstateDetails.area.unit || 'sqm'}`);
    }
    return features;
  };

  const getSellerInfo = () => {
    if (product.seller?.userType === 'company') {
      return {
        name: product.seller.companyProfile?.companyName || 'Company',
        type: 'Company',
        verified: product.seller.isVerified,
        avatar: product.seller.companyProfile?.logo
      };
    } else if (product.seller?.userType === 'individual') {
      return {
        name: `${product.seller.individualProfile?.firstName || ''} ${product.seller.individualProfile?.lastName || ''}`.trim() || 'Individual',
        type: 'Individual',
        verified: product.seller.isVerified,
        avatar: product.seller.individualProfile?.avatar
      };
    }
    return {
      name: 'Anonymous',
      type: 'User',
      verified: false,
      avatar: null
    };
  };

  const getLocation = () => {
    if (product.productType === 'real-estate' && product.realEstateDetails?.location) {
      const location = product.realEstateDetails.location;
      return `${location.city || ''}, ${location.country || 'Ethiopia'}`.replace(/^,\s*/, '');
    } else if (product.productType === 'service' && product.serviceDetails?.location) {
      return product.serviceDetails.location;
    }
    return 'Ethiopia';
  };

  const sellerInfo = getSellerInfo();
  const propertyFeatures = getPropertyFeatures();
  const location = getLocation();
  const mainImage = product.media?.images?.[currentImageIndex]?.url || '/api/placeholder/400/300';

  // Get price display
  const price = product.pricing?.salePrice || product.pricing?.basePrice || 0;
  const originalPrice = product.pricing?.salePrice ? product.pricing?.basePrice : null;
  const priceType = product.pricing?.priceType || 'fixed';

  return (
    <>
      <Link to={`/product/${product._id}`} className="group block" onClick={handleCardClick}>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-200 dark:border-gray-800">
          {/* Compact Image Gallery */}
          <div className="relative h-32 overflow-hidden">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            )}

            {/* Compact Image Navigation */}
            {product.media?.images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronLeftIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronRightIcon className="h-3 w-3" />
                </button>
                
                {/* Compact Image Indicators */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                  {product.media.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Compact Overlay Badges */}
            <div className="absolute top-1.5 left-1.5 flex flex-col space-y-1">
              {product.isFeatured && (
                <span className="px-1.5 py-0.5 bg-yellow-500 text-white text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
              
              {product.status === 'urgent' && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                  Urgent
                </span>
              )}
              
              <span className="px-1.5 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-full capitalize">
                {product.productType === 'real-estate' 
                  ? product.realEstateDetails?.propertyType || 'Property'
                  : product.serviceDetails?.serviceType || 'Service'
                }
              </span>
            </div>

            {/* Compact Action Buttons */}
            <div className="absolute top-1.5 right-1.5 flex flex-col space-y-1">
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className="p-1 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="h-3.5 w-3.5 text-red-500" />
                ) : (
                  <HeartIcon className="h-3.5 w-3.5 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="p-1 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <ShareIcon className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </div>

            {/* Compact Price Badge */}
            <div className="absolute bottom-1.5 right-1.5">
              <div className="bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <div className="text-sm font-bold text-primary-500">
                  {formatCurrency(price, product.pricing?.currency || 'ETB')}
                  {priceType !== 'fixed' && (
                    <span className="text-xs text-gray-500 font-normal">
                      /{priceType.replace('per-', '')}
                    </span>
                  )}
                </div>
                {originalPrice && (
                  <div className="text-xs text-gray-400 line-through">
                    {formatCurrency(originalPrice, product.pricing?.currency || 'ETB')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compact Content */}
          <div className="p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 transition-colors line-clamp-1 mb-1">
                {product.title}
              </h3>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="text-xs truncate">{location}</span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Compact Property Features */}
            {product.productType === 'real-estate' && propertyFeatures.length > 0 && (
              <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                <div className="flex items-center">
                  <HomeIcon className="h-3 w-3 mr-1" />
                  <span>{propertyFeatures.join(' • ')}</span>
                </div>
              </div>
            )}

            {/* Compact Service Features */}
            {product.productType === 'service' && product.serviceDetails?.requirements && (
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {product.serviceDetails.requirements.slice(0, 2).map((requirement, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                    >
                      {requirement}
                    </span>
                  ))}
                  {product.serviceDetails.requirements.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{product.serviceDetails.requirements.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Compact Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  {sellerInfo.avatar ? (
                    <img
                      src={sellerInfo.avatar}
                      alt={sellerInfo.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xs font-medium">
                      {sellerInfo.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="ml-1.5">
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {sellerInfo.name.length > 12 ? `${sellerInfo.name.substring(0, 12)}...` : sellerInfo.name}
                    </span>
                    {sellerInfo.verified && (
                      <div className="ml-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {sellerInfo.type}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <EyeIcon className="h-3 w-3 mr-0.5" />
                  <span>{product.views || 0}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-0.5" />
                  <span>{formatRelativeTime(product.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Compact Rating */}
            {product.reviews?.average && product.reviews.average > 0 && (
              <div className="flex items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.reviews.average)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
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