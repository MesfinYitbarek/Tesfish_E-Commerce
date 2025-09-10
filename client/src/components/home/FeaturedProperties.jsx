import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MapPinIcon, 
  HomeIcon,
  EyeIcon,
  FireIcon,
  ExclamationTriangleIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon, PlayIcon } from '@heroicons/react/24/solid';

import { 
  fetchFeaturedProducts,
  toggleWishlist,
  selectFeaturedProducts,
  selectIsLoading,
  selectError
} from '../../store/slices/productSlice';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

// Custom Icons for Property Features
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

const FeaturedProperties = () => {
  const dispatch = useDispatch();
  const featuredProducts = useSelector(selectFeaturedProducts);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const { user } = useSelector((state) => state.auth);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchFeaturedData();
  }, [dispatch]);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || viewMode !== 'carousel' || featuredProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / getItemsPerSlide()));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, featuredProducts.length, viewMode]);

  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  };

  const fetchFeaturedData = async () => {
    try {
      await dispatch(fetchFeaturedProducts(8)).unwrap();
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setRetryCount(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    fetchFeaturedData();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / getItemsPerSlide()));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(featuredProducts.length / getItemsPerSlide())) % Math.ceil(featuredProducts.length / getItemsPerSlide()));
  };

  // Transform API data to component format - Updated to use correct image path
  const transformProductData = (product) => {
    return {
      id: product._id,
      title: product.title,
      subtitle: product.category?.name || 'Property',
      location: `${product.propertyDetails?.location?.city || 'Addis Ababa'}, ${product.propertyDetails?.location?.region || 'Ethiopia'}`,
      price: product.pricing?.basePrice || 0,
      currency: product.pricing?.currency || 'ETB',
      originalPrice: product.pricing?.originalPrice,
      bedrooms: product.propertyDetails?.bedrooms,
      bathrooms: product.propertyDetails?.bathrooms,
      area: product.propertyDetails?.area?.value,
      areaUnit: product.propertyDetails?.area?.unit || 'sqm',
      parkingSpaces: product.propertyDetails?.parkingSpaces,
      lotSize: product.propertyDetails?.lotSize?.value,
      yearBuilt: product.propertyDetails?.yearBuilt,
      propertyType: product.subProductType || product.productType || 'property',
      status: product.isFeatured ? 'featured' : product.isPromoted ? 'promoted' : 'available',
      // Updated to use media.images from API
      images: product.media?.images?.map(img => img.url) || [],
      virtualTour: product.features?.includes('Virtual Tour') || false,
      featured: product.isFeatured || false,
      trending: product.isPromoted || false,
      views: product.views || 0,
      seller: {
        name: product.seller?.companyProfile?.companyName || 
              `${product.seller?.individualProfile?.firstName || ''} ${product.seller?.individualProfile?.lastName || ''}`.trim() ||
              product.seller?.displayName ||
              'Property Owner',
        type: product.seller?.userType || 'individual',
        verified: product.seller?.isVerified || false,
        responseTime: '2 hours'
      },
      amenities: product.propertyDetails?.features || product.features || [],
      description: product.description || 'Beautiful property in a prime location.',
      listingType: product.listingType || 'sell',
      condition: product.condition || 'excellent',
      furnishingStatus: product.propertyDetails?.furnishingStatus || 'unfurnished',
      // Additional sections
      brand: product.brand,
      model: product.model,
      vehicleDetails: product.vehicleDetails
    };
  };

  if (isLoading && featuredProducts.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Featured Properties
            </h2>
          </div>
          <LoadingSpinner size="lg" text="Loading featured properties..." />
        </div>
      </section>
    );
  }

  if (error && featuredProducts.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Featured Properties
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error || 'Unable to fetch featured properties at the moment.'}
            </p>
            <Button 
              onClick={handleRetry}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Retrying...' : `Try Again ${retryCount > 0 ? `(${retryCount})` : ''}`}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No featured properties available at the moment.
            </p>
            <Link to="/products?category=real-estate">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Browse All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const transformedProperties = featuredProducts.map(transformProductData);

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="max-w-xl">
            <div className="flex items-center mb-2">
              <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
              <span className="px-2 py-1 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 rounded-full text-xs font-medium">
                Hand-picked Selection
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Featured Properties
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover our curated collection of {transformedProperties.length} premium properties across Ethiopia.
            </p>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2">
            {/* Compact View Mode Toggle */}
            <div className="flex bg-white dark:bg-gray-800 rounded-md p-0.5 shadow-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Carousel
              </button>
            </div>
            
            {/* Compact Navigation Controls */}
            {viewMode === 'carousel' && (
              <div className="flex space-x-1">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                >
                  <ChevronLeftIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                >
                  <ChevronRightIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border ${
                    autoPlay
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <PlayIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading overlay for refresh */}
        {isLoading && featuredProducts.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 z-10 flex items-center justify-center rounded-xl">
              <LoadingSpinner size="lg" text="Refreshing..." />
            </div>
          </div>
        )}

        {/* Compact Properties Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {transformedProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                currentUser={user}
                onToggleWishlist={(productId) => dispatch(toggleWishlist(productId))}
              />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(transformedProperties.length / getItemsPerSlide()) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
                    {transformedProperties
                      .slice(slideIndex * getItemsPerSlide(), slideIndex * getItemsPerSlide() + getItemsPerSlide())
                      .map((property) => (
                        <PropertyCard 
                          key={property.id} 
                          property={property} 
                          currentUser={user}
                          onToggleWishlist={(productId) => dispatch(toggleWishlist(productId))}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Compact Carousel Indicators */}
            <div className="flex justify-center mt-4 space-x-1">
              {Array.from({ length: Math.ceil(transformedProperties.length / getItemsPerSlide()) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-purple-500 scale-125'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-purple-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {viewMode === 'carousel' && (
          <div className="flex lg:hidden justify-center mt-4 space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Compact Call to Action */}
        <div className="text-center mt-8">
          <Link to="/products?featured=true">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm px-6 py-2 mr-3">
              View All Featured
            </Button>
          </Link>
          <Link to="/products">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 text-sm px-6 py-2"
            >
              Browse All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Updated Property Card Component
const PropertyCard = ({ property, user, onToggleWishlist }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Default fallback image
  const DEFAULT_IMAGE = 'https://pfst.cf2.poecdn.net/base/image/70fc72a6f139f7623b25514d5c5b01d32c3115c8447048c0be1aca5a1e4c5603?w=400&h=300';

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      return;
    }

    setWishlistLoading(true);
    try {
      await onToggleWishlist(property.id);
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const getStatusBadge = () => {
    if (property.featured) {
      return { color: 'bg-purple-500', text: 'Featured' };
    }
    if (property.trending) {
      return { color: 'bg-orange-500', text: 'Promoted' };
    }
    if (property.listingType === 'rent') {
      return { color: 'bg-blue-500', text: 'For Rent' };
    }
    return { color: 'bg-green-500', text: 'For Sale' };
  };

  const statusBadge = getStatusBadge();

  // Handle image load error
  const handleImageError = (e) => {
    if (e.target.src !== DEFAULT_IMAGE) {
      e.target.src = DEFAULT_IMAGE;
    }
    setIsImageLoading(false);
  };

  // Get current image with fallback
  const getCurrentImage = () => {
    if (property.images && property.images.length > 0) {
      return property.images[currentImageIndex] || DEFAULT_IMAGE;
    }
    return DEFAULT_IMAGE;
  };

  // Get property features with icons (like ProductCard)
  const getPropertyFeatures = () => {
    const features = [];

    if (['homes', 'plots', 'commercials'].includes(property.propertyType) && property) {
      if (property.bedrooms) {
        features.push({
          icon: <BedIcon className="h-4 w-4 text-purple-500" />,
          value: property.bedrooms
        });
      }
      if (property.bathrooms) {
        features.push({
          icon: <BathIcon className="h-4 w-4 text-purple-500" />,
          value: property.bathrooms
        });
      }
      if (property.area) {
        features.push({
          icon: <HomeIcon className="h-4 w-4 text-purple-500" />,
          value: `${property.area} ${property.areaUnit}`
        });
      }
      if (property.parkingSpaces) {
        features.push({
          icon: <ParkingIcon className="h-4 w-4 text-purple-500" />,
          value: property.parkingSpaces
        });
      }
    } else if (property.propertyType === 'others') {
      if (property.vehicleDetails) {
        const { make, year, fuelType } = property.vehicleDetails;
        if (year) features.push({ icon: <TagIcon className="h-4 w-4 text-purple-500" />, value: year.toString() });
        if (make) features.push({ icon: <TagIcon className="h-4 w-4 text-purple-500" />, value: make });
        if (fuelType) features.push({ icon: <TagIcon className="h-4 w-4 text-purple-500" />, value: fuelType });
      }
      if (property.brand) features.push({ icon: <TagIcon className="h-4 w-4 text-purple-500" />, value: property.brand });
      if (property.model) features.push({ icon: <TagIcon className="h-4 w-4 text-purple-500" />, value: property.model });
    }

    return features.slice(0, 4);
  };

  const propertyFeatures = getPropertyFeatures();

  return (
    <Link to={`/products/${property.id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
        {/* Image Gallery */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <img
            src={getCurrentImage()}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onLoad={() => setIsImageLoading(false)}
            onError={handleImageError}
            loading="lazy"
          />
          
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Image Navigation */}
          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/90 hover:scale-110"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/90 hover:scale-110"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {property.images.slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
                {property.images.length > 5 && (
                  <div className="text-white text-xs bg-black/70 px-2 py-1 rounded-full backdrop-blur-sm">
                    +{property.images.length - 5}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex flex-col space-y-1">
              <span className={`${statusBadge.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                {statusBadge.text}
              </span>
              {property.trending && (
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
                  <FireIcon className="h-3 w-3 mr-1" />
                  Hot
                </span>
              )}
            </div>
            
            <div className="flex flex-col space-y-1">
              {property.virtualTour && (
                <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
                  <EyeIcon className="h-3 w-3 mr-1" />
                  VR
                </div>
              )}
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading || !user}
                className="p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                {wishlistLoading ? (
                  <div className="h-4 w-4 border-2 border-gray-400 border-t-purple-500 rounded-full animate-spin"></div>
                ) : (
                  <HeartIcon 
                    className={`h-4 w-4 transition-colors duration-200 ${
                      isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                    }`} 
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-500 transition-colors duration-200 mb-1 line-clamp-1">
                {property.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {property.propertyType}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {property.listingType === 'rent' 
                  ? `${formatCurrency(property.price, property.currency)}/mo`
                  : formatCurrency(property.price, property.currency)
                }
              </div>
              {property.originalPrice && property.originalPrice > property.price && (
                <div className="text-xs text-gray-400 line-through">
                  {formatCurrency(property.originalPrice, property.currency)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
            <MapPinIcon className="h-3 w-3 mr-1 text-purple-500" />
            <span className="text-xs line-clamp-1">{property.location}</span>
          </div>

          {/* Property Features with Icons */}
          {propertyFeatures.length > 0 && (
            <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              {propertyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-1">
                  {feature.icon}
                  <span className="font-medium">{feature.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats Row - Date Removed */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center">
              <EyeIcon className="h-3 w-3 mr-0.5" />
              <span>{property.views || 0}</span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center flex-1">
              <div className="relative">
                <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {property.seller.name.charAt(0)}
                  </span>
                </div>
                {property.seller.verified && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="ml-2">
                <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {property.seller.name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  <span>{property.seller.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedProperties;