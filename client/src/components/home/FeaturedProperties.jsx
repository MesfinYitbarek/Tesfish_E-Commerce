import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MapPinIcon, 
  HomeIcon,
  EyeIcon,
  SparklesIcon,
  ArrowRightIcon,
  Square3Stack3DIcon,
  TagIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { 
  fetchFeaturedProducts,
  toggleWishlist,
  selectFeaturedProducts,
  selectIsLoading,
  selectWishlistIds
} from '../../store/slices/productSlice';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

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
  const wishlistIds = useSelector(selectWishlistIds);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    dispatch(fetchFeaturedProducts(8));
  }, [dispatch]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || featuredProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / getItemsPerSlide()));
    }, 4000);
    
    return () => clearInterval(interval);
  }, [autoPlay, featuredProducts.length]);

  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / getItemsPerSlide()));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(featuredProducts.length / getItemsPerSlide())) % Math.ceil(featuredProducts.length / getItemsPerSlide()));
  };

  // Transform API data to component format
  const transformProductData = (product) => {
    return {
      id: product._id,
      title: product.title,
      subtitle: product.category?.name || 'Property',
      // Updated location handling to match second page
      location: getLocationDisplay(product),
      price: product.pricing?.basePrice || 0,
      currency: product.pricing?.currency || 'ETB',
      originalPrice: product.pricing?.originalPrice,
      bedrooms: product.propertyDetails?.bedrooms,
      bathrooms: product.propertyDetails?.bathrooms,
      area: product.propertyDetails?.area?.value,
      areaUnit: product.propertyDetails?.area?.unit || 'sqm',
      parkingSpaces: product.propertyDetails?.parkingSpaces,
      propertyType: product.subProductType || product.productType || 'property',
      status: product.isFeatured ? 'featured' : product.isPromoted ? 'promoted' : 'available',
      // Updated image handling
      images: product.media?.images?.map(img => img.url) || [],
      virtualTour: product.features?.includes('Virtual Tour') || false,
      featured: product.isFeatured || false,
      trending: product.isPromoted || false,
      views: product.views || 0,
      // Enhanced seller information
      seller: {
        name: getSellername(product.seller),
        type: product.seller?.userType || 'individual',
        verified: product.seller?.isVerified || false,
        responseTime: '2 hours'
      },
      listingType: product.listingType || 'sell',
      condition: product.condition || 'excellent',
      // Additional fields for other product types
      brand: product.brand,
      model: product.model,
      vehicleDetails: product.vehicleDetails
    };
  };

  // Helper function to get location display
  const getLocationDisplay = (product) => {
    if (['homes', 'plots', 'commercials'].includes(product.productType) && product.propertyDetails?.location) {
      const location = product.propertyDetails.location;
      const parts = [];

      if (location.subcity) parts.push(location.subcity);
      if (location.city) parts.push(location.city);
      if (location.region && parts.length === 0) parts.push(location.region);

      return parts.length > 0 ? parts.join(', ') : 'Ethiopia';
    }
    return 'Ethiopia';
  };

  // Helper function to get seller name
  const getSellername = (seller) => {
    if (!seller) return 'Property Owner';
    
    if (seller.userType === 'company' && seller.companyProfile) {
      return seller.companyProfile.companyName || 'Real Estate Company';
    } else if (seller.userType === 'individual' && seller.individualProfile) {
      const firstName = seller.individualProfile.firstName || '';
      const lastName = seller.individualProfile.lastName || '';
      return `${firstName} ${lastName}`.trim() || 'Property Owner';
    }
    
    return seller.displayName || 'Property Owner';
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading featured properties..." />
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  const transformedProperties = featuredProducts.map(transformProductData);

  return (
    <section className="py-12 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="flex items-end justify-between mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium mb-3 border border-blue-100 dark:border-blue-800/30">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Hand-picked Selection
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              Featured Properties
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Discover our curated collection of premium properties 
              <span className="text-blue-600 dark:text-blue-400 font-semibold"> across Ethiopia</span>
            </p>
          </div>
          
          {/* Navigation Controls */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                autoPlay
                  ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400'
                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'
              }`}
              title={autoPlay ? 'Pause autoplay' : 'Start autoplay'}
            >
              <Square3Stack3DIcon className="h-4 w-4" />
            </button>
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white transition-all duration-200 hover:shadow-md"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white transition-all duration-200 hover:shadow-md"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            {transformedProperties.slice(0, 6).map((property, index) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                index={index}
                isWishlisted={wishlistIds.includes(property.id)}
                onToggleWishlist={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (!isAuthenticated) {
                    toast.error('Please login to add to wishlist');
                    return;
                  }

                  try {
                    await dispatch(toggleWishlist(property.id)).unwrap();
                  } catch (error) {
                    toast.error('Failed to update wishlist');
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 rounded-xl p-6 lg:p-8 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Ready to find your perfect property?
          </h3>
          <p className="text-base text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Explore our complete collection of premium properties with advanced search and filtering options.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products?featured=true">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm px-6 py-2">
                <SparklesIcon className="h-4 w-4 mr-2" />
                View all featured
              </Button>
            </Link>
            <Link to="/products">
              <Button 
                variant="outline" 
                className="border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white text-sm px-6 py-2"
              >
                Browse all properties
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Property Card with Wishlist Functionality
const PropertyCard = ({ property, index, isWishlisted, onToggleWishlist }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // Default fallback image
  const DEFAULT_IMAGE = 'https://pfst.cf2.poecdn.net/base/image/70fc72a6f139f7623b25514d5c5b01d32c3115c8447048c0be1aca5a1e4c5603?w=400&h=300';
  
  // Get current image with fallback
  const getCurrentImage = () => {
    if (property.images && property.images.length > 0) {
      return property.images[currentImageIndex] || DEFAULT_IMAGE;
    }
    return DEFAULT_IMAGE;
  };

  const handleImageError = () => {
    setImageError(true);
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

  const handleWishlistClick = async (e) => {
    setWishlistLoading(true);
    try {
      await onToggleWishlist(e);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Get property features with icons
  const getPropertyFeatures = () => {
    const features = [];

    if (['homes', 'plots', 'commercials'].includes(property.propertyType)) {
      if (property.bedrooms) {
        features.push({
          icon: <BedIcon className="h-3 w-3 text-blue-500" />,
          value: property.bedrooms,
          label: property.bedrooms > 1 ? 'beds' : 'bed'
        });
      }
      if (property.bathrooms) {
        features.push({
          icon: <BathIcon className="h-3 w-3 text-blue-500" />,
          value: property.bathrooms,
          label: property.bathrooms > 1 ? 'baths' : 'bath'
        });
      }
      if (property.area) {
        features.push({
          icon: <Square3Stack3DIcon className="h-3 w-3 text-blue-500" />,
          value: property.area,
          label: property.areaUnit
        });
      }
      if (property.parkingSpaces) {
        features.push({
          icon: <ParkingIcon className="h-3 w-3 text-blue-500" />,
          value: property.parkingSpaces,
          label: 'parking'
        });
      }
    } else if (property.propertyType === 'others') {
      if (property.vehicleDetails) {
        const { make, year, fuelType } = property.vehicleDetails;
        if (year) features.push({ icon: <TagIcon className="h-3 w-3 text-blue-500" />, value: year, label: '' });
        if (make) features.push({ icon: <TagIcon className="h-3 w-3 text-blue-500" />, value: make, label: '' });
        if (fuelType) features.push({ icon: <TagIcon className="h-3 w-3 text-blue-500" />, value: fuelType, label: '' });
      }
      if (property.brand) features.push({ icon: <TagIcon className="h-3 w-3 text-blue-500" />, value: property.brand, label: '' });
      if (property.model) features.push({ icon: <TagIcon className="h-3 w-3 text-blue-500" />, value: property.model, label: '' });
    }

    return features.slice(0, 3);
  };

  const propertyFeatures = getPropertyFeatures();

  return (
    <div 
      className="group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/products/${property.id}`} className="block">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/60 dark:border-slate-700/60">
          {/* Enhanced Image */}
          <div className="relative h-48 lg:h-52 overflow-hidden">
            <img
              src={imageError ? DEFAULT_IMAGE : getCurrentImage()}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={handleImageError}
              loading="lazy"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Image Navigation */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/90"
                >
                  <ChevronLeftIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/90"
                >
                  <ChevronRightIcon className="h-3 w-3" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {property.images.slice(0, 5).map((_, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        imgIndex === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60'
                      }`}
                    />
                  ))}
                  {property.images.length > 5 && (
                    <div className="text-white text-xs bg-black/70 px-1 rounded">
                      +{property.images.length - 5}
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* Enhanced Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <div className="flex flex-col space-y-1">
                {property.featured && (
                  <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                    <SparklesIcon className="h-2.5 w-2.5 mr-1" />
                    Featured
                  </div>
                )}
                {property.trending && (
                  <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                    <FireIcon className="h-2.5 w-2.5 mr-1" />
                    Hot Deal
                  </div>
                )}
              </div>
              
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                disabled={wishlistLoading}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg group/heart disabled:opacity-50"
              >
                {wishlistLoading ? (
                  <div className="h-4 w-4 border-2 border-gray-400 border-t-red-500 rounded-full animate-spin"></div>
                ) : (
                  <HeartSolidIcon 
                    className={`h-4 w-4 transition-colors ${
                      isWishlisted ? 'text-red-500' : 'text-slate-600 group-hover/heart:text-red-500'
                    }`} 
                  />
                )}
              </button>
            </div>

            {/* Property Type Badge */}
            <div className="absolute bottom-3 left-3">
              <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium text-slate-700 shadow-sm">
                {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2 line-clamp-2">
                  {property.title}
                </h3>
                <div className="flex items-center text-slate-500 dark:text-slate-400 mb-3">
                  <MapPinIcon className="h-3 w-3 mr-1 text-blue-500" />
                  <span className="text-xs">{property.location}</span>
                </div>
              </div>
            </div>

            {/* Property Features */}
            {propertyFeatures.length > 0 && (
              <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300 mb-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                {propertyFeatures.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-1">
                    {feature.icon}
                    <span className="font-medium">{feature.value}</span>
                    {feature.label && <span>{feature.label}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Price and Views */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatCurrency(property.price, property.currency)}
                  {property.listingType === 'rent' && (
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/month</span>
                  )}
                </div>
                {property.originalPrice && property.originalPrice > property.price && (
                  <div className="text-xs text-slate-400 line-through">
                    {formatCurrency(property.originalPrice, property.currency)}
                  </div>
                )}
              </div>
              <div className="flex items-center text-slate-500 dark:text-slate-400">
                <EyeIcon className="h-3 w-3 mr-1" />
                <span className="text-xs font-medium">{property.views || 0}</span>
              </div>
            </div>

            {/* Seller Info */}
            {/* <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {property.seller.name.charAt(0)}
                    </span>
                  </div>
                  {property.seller.verified && (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="ml-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {property.seller.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {property.seller.type}
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedProperties;