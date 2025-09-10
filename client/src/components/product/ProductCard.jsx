import { useState, useMemo, useCallback } from 'react';
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
  TagIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  HomeModernIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/solid';
import { toggleWishlist } from '../../store/slices/productSlice';
import ShareModal from './ShareModal';
import productService from '../../services/productService';
import { toast } from 'react-hot-toast';

// Bed and Bath Icons (Custom SVGs or you can use library icons)
const BedIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM19 7h-8v7H3V6c0-.55-.45-1-1-1s-1 .45-1 1v11c0 .55.45 1 1 1s1-.45 1-1v-2h18v2c0 .55.45 1 1 1s1-.45 1-1V10c0-1.65-1.35-3-3-3z"/>
  </svg>
);

const BathIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 17c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm3-1c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm4 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3-4v1c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-1H3v-1c0-2.76 2.24-5 5-5h8c2.76 0 5 2.24 5 5v1h-2zm-2 0H7v1h10v-1z"/>
  </svg>
);

const ParkingIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z"/>
  </svg>
);

// Constants
const PRODUCT_TYPE_MAP = {
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

const BADGE_STYLES = {
  featured: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
  promoted: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
  forSale: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
  forRent: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
  type: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
};

// Helper Functions
const formatCurrency = (amount, currency = 'ETB') => {
  if (!amount) return 'Price not set';
  
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

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Sub-components
const ImageGallery = ({ product, currentImageIndex, onPrevImage, onNextImage }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const mainImage = product.media?.images?.[currentImageIndex]?.url;
  const hasMultipleImages = product.media?.images?.length > 1;

  return (
    <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
      {mainImage ? (
        <img
          src={mainImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <TagIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <span className="text-sm">No Image</span>
          </div>
        </div>
      )}

      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-spin"></div>
        </div>
      )}

      {hasMultipleImages && (
        <>
          <button
            onClick={onPrevImage}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={onNextImage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
            {product.media.images.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white w-4' : 'bg-white/60'
                }`}
              />
            ))}
            {product.media.images.length > 5 && (
              <div className="text-white text-xs bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
                +{product.media.images.length - 5}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const ProductBadges = ({ product, productType }) => (
  <div className="absolute top-3 left-3 flex flex-col space-y-2">
    {product.isFeatured && (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${BADGE_STYLES.featured}`}>
        Featured
      </span>
    )}

    {product.isPromoted && (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${BADGE_STYLES.promoted}`}>
        Promoted
      </span>
    )}

    {product.listingType && (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
        product.listingType === 'sell' ? BADGE_STYLES.forSale : BADGE_STYLES.forRent
      }`}>
        {product.listingType === 'sell' ? 'For Sale' : 'For Rent'}
      </span>
    )}

    <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-lg ${BADGE_STYLES.type}`}>
      {productType}
    </span>
  </div>
);

const ActionButtons = ({ onWishlist, onShare, isWishlisted, wishlistLoading }) => (
  <div className="absolute top-3 right-3 flex flex-col space-y-2">
    <button
      onClick={onWishlist}
      disabled={wishlistLoading}
      className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWishlisted ? (
        <HeartSolidIcon className="h-5 w-5 text-red-500" />
      ) : (
        <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
      )}
    </button>

    <button
      onClick={onShare}
      className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
      aria-label="Share product"
    >
      <ShareIcon className="h-5 w-5 text-gray-600 hover:text-blue-500 transition-colors" />
    </button>
  </div>
);

const PriceBadge = ({ priceInfo }) => (
  <div className="absolute bottom-3 right-3">
    <div className="bg-white/98 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg">
      <div className="text-lg font-bold text-indigo-600">
        {priceInfo.display}
        {priceInfo.period && (
          <span className="text-xs text-gray-500 font-normal ml-1">
            {priceInfo.period}
          </span>
        )}
      </div>
      {priceInfo.original && (
        <div className="text-xs text-gray-400 line-through -mt-1">
          {priceInfo.original}
        </div>
      )}
      {priceInfo.isNegotiable && (
        <div className="text-xs text-green-600 font-medium">
          Negotiable
        </div>
      )}
    </div>
  </div>
);

const ProductFeatures = ({ features, productType }) => {
  if (features.length === 0) return null;

  return (
    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
      <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
        {features.map((feature, index) => (
          <span key={index} className="flex items-center space-x-1">
            {feature.icon}
            <span className="font-medium">{feature.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const ProductStats = ({ views, createdAt, rating }) => (
  <div className="flex items-center justify-between text-xs text-gray-500">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1">
        <EyeIcon className="h-4 w-4" />
        <span>{views?.toLocaleString() || 0}</span>
      </div>
      <div className="flex items-center space-x-1">
        <ClockIcon className="h-4 w-4" />
        <span>{formatRelativeTime(createdAt)}</span>
      </div>
    </div>
    
    {rating && rating.average > 0 && (
      <div className="flex items-center space-x-1">
        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="font-medium">{rating.average.toFixed(1)}</span>
        <span className="text-gray-400">({rating.count})</span>
      </div>
    )}
  </div>
);

// Main Component
const ProductCard = ({ product, variant = 'default', className = '' }) => {
  const dispatch = useDispatch();
  const { wishlistedItems = [], isLoading } = useSelector((state) => state.products || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isWishlisted = wishlistedItems.includes(product._id);

  // Memoized computed values
  const propertyFeatures = useMemo(() => {
    const features = [];

    if (['homes', 'plots', 'commercials'].includes(product.productType) && product.propertyDetails) {
      const { bedrooms, bathrooms, area, parkingSpaces } = product.propertyDetails;

      if (bedrooms) {
        features.push({
          icon: <BedIcon className="h-4 w-4 text-indigo-500" />,
          value: bedrooms
        });
      }
      if (bathrooms) {
        features.push({
          icon: <BathIcon className="h-4 w-4 text-indigo-500" />,
          value: bathrooms
        });
      }
      if (area?.value) {
        features.push({
          icon: <HomeIcon className="h-4 w-4 text-indigo-500" />,
          value: `${area.value} ${area.unit || 'sqm'}`
        });
      }
      if (parkingSpaces) {
        features.push({
          icon: <ParkingIcon className="h-4 w-4 text-indigo-500" />,
          value: parkingSpaces
        });
      }
    } else if (product.productType === 'others') {
      if (product.vehicleDetails) {
        const { make, year, fuelType } = product.vehicleDetails;
        if (year) features.push({ icon: <CalendarIcon className="h-4 w-4 text-indigo-500" />, value: year.toString() });
        if (make) features.push({ icon: <TagIcon className="h-4 w-4 text-indigo-500" />, value: make });
        if (fuelType) features.push({ icon: <TagIcon className="h-4 w-4 text-indigo-500" />, value: fuelType });
      }
      if (product.brand) features.push({ icon: <TagIcon className="h-4 w-4 text-indigo-500" />, value: product.brand });
      if (product.condition) features.push({ icon: <TagIcon className="h-4 w-4 text-indigo-500" />, value: product.condition });
    }

    return features.slice(0, 4);
  }, [product]);

  const location = useMemo(() => {
    if (['homes', 'plots', 'commercials'].includes(product.productType) && product.propertyDetails?.location) {
      const location = product.propertyDetails.location;
      const parts = [];

      if (location.subcity) parts.push(location.subcity);
      if (location.city) parts.push(location.city);

      return parts.length > 0 ? parts.join(', ') : (location.city || 'Ethiopia');
    }
    return 'Ethiopia';
  }, [product]);

  const productType = useMemo(() => {
    return PRODUCT_TYPE_MAP[product.subProductType] || product.productType || 'Product';
  }, [product.subProductType, product.productType]);

  const priceInfo = useMemo(() => {
    if (!product.pricing) {
      return { display: 'Price not set', period: '', isNegotiable: false };
    }

    const { basePrice, salePrice, currency, priceType, rentPrice, isNegotiable } = product.pricing;

    if (product.listingType === 'rent' && rentPrice?.monthly) {
      return {
        display: formatCurrency(rentPrice.monthly, currency),
        period: '/month',
        original: null,
        isNegotiable
      };
    }

    const finalPrice = salePrice || basePrice || 0;
    return {
      display: formatCurrency(finalPrice, currency),
      period: priceType && priceType !== 'fixed' ? `/${priceType.replace('per-', '')}` : '',
      original: salePrice ? formatCurrency(basePrice, currency) : null,
      isNegotiable
    };
  }, [product.pricing, product.listingType]);

  // Event handlers
  const handleWishlist = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    setWishlistLoading(true);
    try {
      await dispatch(toggleWishlist(product._id)).unwrap();
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  }, [dispatch, product._id, isAuthenticated, isWishlisted]);

  const handleShare = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareModal(true);
  }, []);

  const handleCardClick = useCallback(async () => {
    try {
      await productService.incrementViews(product._id);
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  }, [product._id]);

  const nextImage = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.media?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.media.images.length);
    }
  }, [product.media?.images?.length]);

  const prevImage = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.media?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.media.images.length) % product.media.images.length);
    }
  }, [product.media?.images?.length]);

  return (
    <>
      <Link 
        to={`/products/${product._id}`} 
        className={`group block h-full ${className}`} 
        onClick={handleCardClick}
      >
        <article className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
          {/* Image Gallery */}
          <div className="relative">
            <ImageGallery
              product={product}
              currentImageIndex={currentImageIndex}
              onPrevImage={prevImage}
              onNextImage={nextImage}
            />
            
            <ProductBadges product={product} productType={productType} />
            
            <ActionButtons
              onWishlist={handleWishlist}
              onShare={handleShare}
              isWishlisted={isWishlisted}
              wishlistLoading={wishlistLoading}
            />
            
            <PriceBadge priceInfo={priceInfo} />
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3 leading-tight">
                {product.title}
              </h3>

              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0 text-indigo-500" />
                <span className="text-sm font-medium truncate">{location}</span>
              </div>

              {product.shortDescription && (
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Features */}
            <ProductFeatures features={propertyFeatures} productType={product.productType} />

            {/* Footer - Push to bottom */}
            <div className="mt-auto space-y-3">
              {/* Stats */}
              <ProductStats 
                views={product.views} 
                createdAt={product.createdAt} 
                rating={product.reviews} 
              />
            </div>
          </div>
        </article>
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