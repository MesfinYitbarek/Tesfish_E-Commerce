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
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { toggleWishlist } from '../../store/slices/productSlice';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import ShareModal from './ShareModal';

const ProductListItem = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlistedItems, isLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const isWishlisted = wishlistedItems.has(product._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    dispatch(toggleWishlist(product._id));
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

  const getPropertyFeatures = () => {
    const features = [];
    if (product.realEstateDetails?.bedrooms) {
      features.push(`${product.realEstateDetails.bedrooms} bedrooms`);
    }
    if (product.realEstateDetails?.bathrooms) {
      features.push(`${product.realEstateDetails.bathrooms} bathrooms`);
    }
    if (product.realEstateDetails?.area) {
      features.push(`${product.realEstateDetails.area} sqm`);
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

  const sellerInfo = getSellerInfo();
  const propertyFeatures = getPropertyFeatures();
  const mainImage = product.media?.images?.[currentImageIndex]?.url || '/api/placeholder/400/300';

  return (
    <>
      <Link to={`/product/${product._id}`} className="group block">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative w-full md:w-80 h-48 md:h-64 flex-shrink-0">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 md:rounded-l-xl rounded-t-xl md:rounded-tr-none"
              />

              {/* Image Navigation */}
              {product.media?.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {product.media.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {product.featured && (
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
                
                <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full capitalize">
                  {product.type === 'real-estate' 
                    ? product.realEstateDetails?.propertyType || 'Property'
                    : product.serviceDetails?.serviceType || 'Service'
                  }
                </span>
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
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 transition-colors line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm">
                          {product.type === 'real-estate' 
                            ? `${product.realEstateDetails?.location?.city || ''}, ${product.realEstateDetails?.location?.country || 'Ethiopia'}`
                            : product.serviceDetails?.serviceArea || 'Addis Ababa'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-primary-500">
                        {formatCurrency(product.pricing?.basePrice || 0, 'ETB')}
                      </div>
                      {product.pricing?.priceType && (
                        <div className="text-sm text-gray-500">
                          per {product.pricing.priceType}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Features */}
                  {product.type === 'real-estate' && propertyFeatures.length > 0 && (
                    <div className="flex items-center mb-4">
                      <HomeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <div className="flex flex-wrap gap-2">
                        {propertyFeatures.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Features */}
                  {product.type === 'service' && product.serviceDetails?.features && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {product.serviceDetails.features.slice(0, 4).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {product.serviceDetails.features.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                            +{product.serviceDetails.features.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  {product.reviews?.averageRating && (
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.reviews.averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {product.reviews.averageRating.toFixed(1)} ({product.reviews.count} reviews)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      {sellerInfo.avatar ? (
                        <img
                          src={sellerInfo.avatar}
                          alt={sellerInfo.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {sellerInfo.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {sellerInfo.name}
                        </span>
                        {sellerInfo.verified && (
                          <div className="ml-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {sellerInfo.type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
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