import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeftIcon, 
  ShareIcon, 
  HeartIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  PhoneIcon,
  EyeIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { 
  fetchProduct, 
  fetchRelatedProducts, 
  toggleWishlist,
  clearCurrentProduct 
} from '../../store/slices/productSlice';
import ProductImageGallery from '../../components/product/ProductImageGallery'
import ProductInfo from '../../components/product/ProductInfo';
import ProductDescription from '../../components/product/ProductDescription';
import SellerInfo from '../../components/product/SellerInfo';
import ProductReviews from '../../components/product/ProductReviews';
import RelatedProducts from '../../components/product/RelatedProducts';
import ShareModal from '../../components/product/ShareModal';
import ContactSellerModal from '../../components/chat/ContactSellerModal';
import PropertyRegistrationModal from '../../components/property/PropertyRegistrationModal';
import AppointmentBookingModal from '../../components/property/AppointmentBookingModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    currentProduct: product,
    relatedProducts,
    productLoading,
    error,
    wishlistedItems
  } = useSelector((state) => state.products);
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fetch product data
  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
      dispatch(fetchRelatedProducts(id));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  // Update page title
  useEffect(() => {
    if (product) {
      document.title = `${product.title} | CitiLights`;
    }
    
    return () => {
      document.title = 'CitiLights';
    };
  }, [product]);

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save property');
      return;
    }
    dispatch(toggleWishlist(product._id));
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/products');
    }
  };

  const isWishlisted = wishlistedItems.includes(product?._id);
  const isOwner = user?._id === product?.seller?._id;
  const isPropertyProduct = ['homes', 'plots', 'commercials'].includes(product?.productType);
  const hasRegistrationFee = product?.propertyDetails?.registrationFee && product.propertyDetails.registrationFee > 0;

  // Format price for display
  const formatPrice = () => {
    if (!product?.pricing) return 'Contact for price';
    
    const { basePrice, salePrice, currency, rentPrice } = product.pricing;
    const finalPrice = salePrice || basePrice || 0;
    
    if (product.listingType === 'rent' && rentPrice?.monthly) {
      if (rentPrice.monthly >= 1000000) {
        return `${(rentPrice.monthly / 1000000).toFixed(1)}M ${currency || 'ETB'}/month`;
      }
      if (rentPrice.monthly >= 1000) {
        return `${(rentPrice.monthly / 1000).toFixed(0)}K ${currency || 'ETB'}/month`;
      }
      return `${rentPrice.monthly.toLocaleString()} ${currency || 'ETB'}/month`;
    }
    
    if (finalPrice >= 1000000) {
      return `${(finalPrice / 1000000).toFixed(1)}M ${currency || 'ETB'}`;
    }
    if (finalPrice >= 1000) {
      return `${(finalPrice / 1000).toFixed(0)}K ${currency || 'ETB'}`;
    }
    return `${finalPrice.toLocaleString()} ${currency || 'ETB'}`;
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            {error || 'The property you are looking for does not exist or has been removed.'}
          </p>
          <div className="space-y-3">
            <Button variant="outline" onClick={handleBack} className="w-full">
              Go Back
            </Button>
            <Button onClick={() => navigate('/products')} className="w-full">
              Browse Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    ...(isPropertyProduct ? [
      { id: 'location', label: 'Location' },
      { id: 'amenities', label: 'Amenities' }
    ] : []),
    { id: 'reviews', label: `Reviews` },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Clean Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center space-x-3">
              {!isOwner && (
                <button
                  onClick={handleWishlist}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              )}
              
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ShareIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <ProductImageGallery product={product} />
            </div>

            {/* Property Overview */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Badge 
                      variant={product.listingType === 'rent' ? 'blue' : 'green'}
                      className="font-medium"
                    >
                      For {product.listingType === 'rent' ? 'Rent' : 'Sale'}
                    </Badge>
                    
                    {product.isFeatured && (
                      <Badge variant="yellow" className="font-medium">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                    {product.title}
                  </h1>

                  {isPropertyProduct && product.propertyDetails?.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                      <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="text-lg">
                        {[
                          product.propertyDetails.location.subcity,
                          product.propertyDetails.location.city,
                          product.propertyDetails.location.region
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      <span>{product.views || 0} views</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>Listed {new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {formatPrice()}
                  </div>
                  {product.pricing?.isNegotiable && (
                    <Badge variant="blue" size="sm">
                      Negotiable
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Features for Properties */}
              {isPropertyProduct && product.propertyDetails && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  {product.propertyDetails.bedrooms && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {product.propertyDetails.bedrooms}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                    </div>
                  )}
                  {product.propertyDetails.bathrooms && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {product.propertyDetails.bathrooms}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                    </div>
                  )}
                  {product.propertyDetails.area?.value && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {product.propertyDetails.area.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {product.propertyDetails.area.unit || 'sqm'}
                      </div>
                    </div>
                  )}
                  {product.propertyDetails.parkingSpaces && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {product.propertyDetails.parkingSpaces}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Parking</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-100 dark:border-gray-800">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <ProductDescription product={product} />
                )}
                
                {activeTab === 'details' && (
                  <ProductDetails product={product} />
                )}
                
                {activeTab === 'location' && isPropertyProduct && (
                  <ProductLocation product={product} />
                )}

                {activeTab === 'amenities' && isPropertyProduct && (
                  <ProductAmenities product={product} />
                )}
                
                {activeTab === 'reviews' && (
                  <ProductReviews 
                    product={product} 
                    canReview={!isOwner && isAuthenticated}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            {!isOwner && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Interested in this property?
                </h3>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => setShowContactModal(true)}
                    leftIcon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
                  >
                    Send Message
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowContactModal(true)}
                    leftIcon={<PhoneIcon className="h-5 w-5" />}
                  >
                    Call Now
                  </Button>
                  
                  {isPropertyProduct && (
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowAppointmentModal(true)}
                      leftIcon={<CalendarIcon className="h-5 w-5" />}
                    >
                      Schedule Viewing
                    </Button>
                  )}
                </div>

                {hasRegistrationFee && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button 
                      variant="success"
                      className="w-full"
                      onClick={() => setShowRegistrationModal(true)}
                    >
                      Register Interest
                      <span className="ml-2 text-sm opacity-90">
                        {product.propertyDetails.registrationFee.toLocaleString()} {product.pricing?.currency || 'ETB'}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Seller Info */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <SellerInfo 
                product={product} 
                onContactSeller={() => setShowContactModal(true)}
                isOwner={isOwner}
                compact={true}
              />
            </div>

            {/* Property Highlights */}
            {isPropertyProduct && product.propertyDetails && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Property Highlights
                </h3>
                <div className="space-y-3">
                  {product.propertyDetails.yearBuilt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Year Built</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {product.propertyDetails.yearBuilt}
                      </span>
                    </div>
                  )}
                  {product.propertyDetails.floors && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Floors</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {product.propertyDetails.floors}
                      </span>
                    </div>
                  )}
                  {product.propertyDetails.furnishingStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Furnishing</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {product.propertyDetails.furnishingStatus.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                  {product.propertyDetails.titleDeedStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Title Deed</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {product.propertyDetails.titleDeedStatus.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Safety Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Safety Guidelines
              </h4>
              <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Meet in public places</li>
                <li>• Verify property documents</li>
                <li>• Don't pay in advance</li>
                <li>• Use secure payment methods</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={product}
      />

      <ContactSellerModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        product={product}
      />

      {hasRegistrationFee && (
        <PropertyRegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          product={product}
        />
      )}

      {isPropertyProduct && (
        <AppointmentBookingModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          product={product}
        />
      )}
    </div>
  );
};

// Clean Product Details Component
const ProductDetails = ({ product }) => {
  const details = [];

  // Basic product info
  if (product.brand) details.push({ label: 'Brand', value: product.brand });
  if (product.model) details.push({ label: 'Model', value: product.model });
  if (product.condition) details.push({ 
    label: 'Condition', 
    value: product.condition.charAt(0).toUpperCase() + product.condition.slice(1).replace('-', ' ')
  });

  // Property specific details
  if (['homes', 'plots', 'commercials'].includes(product.productType)) {
    const propDetails = product.propertyDetails;
    
    if (propDetails?.yearBuilt) details.push({ label: 'Year Built', value: propDetails.yearBuilt });
    if (propDetails?.floors) details.push({ label: 'Floors', value: propDetails.floors });
    if (propDetails?.furnishingStatus) {
      details.push({ 
        label: 'Furnishing Status', 
        value: propDetails.furnishingStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
      });
    }
    if (propDetails?.titleDeedStatus) {
      details.push({ 
        label: 'Title Deed Status', 
        value: propDetails.titleDeedStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
      });
    }
  }

  // Vehicle details
  if (product.vehicleDetails) {
    const vehDetails = product.vehicleDetails;
    if (vehDetails.make) details.push({ label: 'Make', value: vehDetails.make });
    if (vehDetails.model) details.push({ label: 'Model', value: vehDetails.model });
    if (vehDetails.year) details.push({ label: 'Year', value: vehDetails.year });
    if (vehDetails.mileage) details.push({ label: 'Mileage', value: `${vehDetails.mileage} km` });
    if (vehDetails.fuelType) details.push({ label: 'Fuel Type', value: vehDetails.fuelType });
    if (vehDetails.transmission) details.push({ label: 'Transmission', value: vehDetails.transmission });
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Specifications
      </h3>
      
      {details.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {details.map((detail, index) => (
            <div 
              key={index}
              className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {detail.label}
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-semibold">
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No detailed specifications available.
          </p>
        </div>
      )}
    </div>
  );
};

// Clean Product Location Component
const ProductLocation = ({ product }) => {
  const location = product.propertyDetails?.location;

  if (!location) {
    return (
      <div className="text-center py-8">
        <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          No location information available.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Location Details
      </h3>
      
      <div className="space-y-6">
        {/* Address Information */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
          <div className="space-y-2">
            {location.address && (
              <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {location.address}
              </div>
            )}
            
            <div className="text-gray-600 dark:text-gray-400">
              {[location.subcity, location.city, location.region].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Interactive Map
            </p>
            <p className="text-sm text-gray-400">
              Coming Soon
            </p>
          </div>
        </div>

        {/* Nearby Facilities */}
        {location.nearbyFacilities && location.nearbyFacilities.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Nearby Facilities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {location.nearbyFacilities.slice(0, 6).map((facility, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {facility.type.replace('-', ' ')}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {facility.name}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {facility.distance}m
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Clean Product Amenities Component
const ProductAmenities = ({ product }) => {
  const propDetails = product.propertyDetails;
  
  if (!propDetails) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No amenities information available.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Features & Amenities
      </h3>
      
      <div className="space-y-8">
        {/* Property Features */}
        {propDetails.features && propDetails.features.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Property Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {propDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                    {feature.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Building Amenities */}
        {propDetails.amenities && propDetails.amenities.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Building Amenities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {propDetails.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                    {amenity.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Utilities */}
        {propDetails.utilities && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Utilities & Services
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(propDetails.utilities).map(([utility, available]) => (
                <div key={utility} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                    {utility.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`font-semibold ${
                    available 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;