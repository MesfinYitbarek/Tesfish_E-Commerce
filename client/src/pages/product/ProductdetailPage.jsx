// pages/ProductDetailPage.jsx - Compact Tailwind/Expo Inspired Design
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
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { 
  fetchProduct, 
  fetchRelatedProducts, 
  toggleWishlist,
  clearCurrentProduct 
} from '../../store/slices/productSlice';
import ProductImageGallery from '../../components/product/productImageGallery';
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
      document.title = `${product.title} | TesGold`;
    }
    
    return () => {
      document.title = 'TesGold';
    };
  }, [product]);

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save product');
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
  const isRealEstate = ['homes', 'plots', 'commercials'].includes(product?.productType);
  const hasRegistrationFee = product?.propertyDetails?.registrationFee && product.propertyDetails.registrationFee > 0;

  // Enhanced price formatting with correct field paths from API
  const formatPrice = () => {
    let priceValue = product?.displayPrice || product?.pricing?.basePrice;
    let currencyValue = product?.pricing?.currency || 'ETB';
    
    if (priceValue === null || priceValue === undefined || priceValue === '') {
      return 'Contact for price';
    }
    
    const price = parseFloat(priceValue);
    
    if (isNaN(price)) {
      return 'Contact for price';
    }

    if (product?.pricing?.priceType === 'on-request') {
      return 'Price on Request';
    }

    let pricePrefix = '';
    if (product?.pricing?.priceType === 'starting-from') {
      pricePrefix = 'Starting from ';
    }

    const getCurrencySymbol = (curr) => {
      const symbols = { ETB: 'Br', USD: '$', EUR: '€' };
      return symbols[curr] || curr;
    };

    const currencySymbol = getCurrencySymbol(currencyValue);
    
    if (product?.listingType === 'rent') {
      const suffix = '/month';
      if (price >= 1000000) {
        return `${pricePrefix}${currencySymbol}${(price / 1000000).toFixed(1)}M${suffix}`;
      }
      if (price >= 1000) {
        return `${pricePrefix}${currencySymbol}${(price / 1000).toFixed(0)}K${suffix}`;
      }
      return `${pricePrefix}${currencySymbol}${price.toLocaleString()}${suffix}`;
    }
    
    if (price >= 1000000) {
      return `${pricePrefix}${currencySymbol}${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `${pricePrefix}${currencySymbol}${(price / 1000).toFixed(0)}K`;
    }
    return `${pricePrefix}${currencySymbol}${price.toLocaleString()}`;
  };

  const getCurrencySymbol = () => {
    const currencyMap = { ETB: 'Br', USD: '$', EUR: '€' };
    return currencyMap[product?.pricing?.currency] || 'Br';
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
            {error || 'The product you are looking for does not exist or has been removed.'}
          </p>
          <div className="space-y-2">
            <Button variant="outline" onClick={handleBack} className="w-full text-sm py-2">
              Go Back
            </Button>
            <Button onClick={() => navigate('/products')} className="w-full text-sm py-2">
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Dynamic tabs based on available content
  const tabs = [
    { id: 'overview', label: 'Overview' },
    ...((() => {
      const hasSpecs = product.specifications?.length > 0 ||
                      product.brand || product.model || product.condition ||
                      product.vehicleDetails || product.equipmentDetails || 
                      product.businessDetails || product.warranty?.duration ||
                      product.inventory?.sku || product.inventory?.stock ||
                      (isRealEstate && product.propertyDetails?.yearBuilt);
      return hasSpecs ? [{ id: 'details', label: 'Details' }] : [];
    })()),
    ...((() => {
      const hasLocation = product.fullAddress || product.propertyDetails?.location?.address ||
                         product.propertyDetails?.location?.landmarks?.length > 0;
      return isRealEstate && hasLocation ? [{ id: 'location', label: 'Location' }] : [];
    })()),
    ...((() => {
      const propDetails = product.propertyDetails;
      const hasFeatures = propDetails?.features?.length > 0 || 
                         propDetails?.amenities?.length > 0 ||
                         (propDetails?.utilities && Object.values(propDetails.utilities).some(Boolean)) ||
                         (product.productType === 'plots' && propDetails?.landDetails);
      return isRealEstate && hasFeatures ? [{ id: 'amenities', label: 'Features' }] : [];
    })()),
    { id: 'reviews', label: `Reviews` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Compact Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
            >
              <ArrowLeftIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium text-sm">Back</span>
            </button>

            <div className="flex items-center space-x-2">
              {!isOwner && (
                <button
                  onClick={handleWishlist}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-4 w-4 text-red-500" />
                  ) : (
                    <HeartIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              )}
              
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              >
                <ShareIcon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-lg">
              <ProductImageGallery product={product} />
            </div>

            {/* Product Overview */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-lg">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge 
                      variant={product.listingType === 'rent' ? 'blue' : 'green'}
                      className="font-medium text-xs"
                    >
                      For {product.listingType === 'rent' ? 'Rent' : 'Sale'}
                    </Badge>
                    
                    {product.isFeatured && (
                      <Badge variant="yellow" className="font-medium text-xs">
                        <StarIcon className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}

                    {product.isPromoted && (
                      <Badge variant="purple" className="font-medium text-xs">
                        Promoted
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                    {product.title}
                  </h1>

                  {isRealEstate && product.fullAddress && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{product.fullAddress}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      <span>{product.views || 0} views</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      <span>Listed {new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {formatPrice()}
                  </div>
                  {product.pricing?.isNegotiable && (
                    <Badge variant="blue" size="sm" className="text-xs">
                      Negotiable
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Features for Real Estate */}
              {isRealEstate && product.propertyDetails && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  {product.propertyDetails.area?.value && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {product.propertyDetails.area.value}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {product.propertyDetails.area.unit || 'sqm'}
                      </div>
                    </div>
                  )}
                  {product.propertyDetails.bedrooms && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {product.propertyDetails.bedrooms}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Bedrooms</div>
                    </div>
                  )}
                  {product.propertyDetails.bathrooms && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {product.propertyDetails.bathrooms}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Bathrooms</div>
                    </div>
                  )}
                  {product.propertyDetails.parkingSpaces && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {product.propertyDetails.parkingSpaces}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Parking</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-lg">
              {/* Tab Navigation */}
              <div className="border-b border-gray-100 dark:border-gray-800">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
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
              <div className="p-5">
                {activeTab === 'overview' && (
                  <ProductDescription product={product} />
                )}
                
                {activeTab === 'details' && (
                  <ProductDetails product={product} />
                )}
                
                {activeTab === 'location' && isRealEstate && (
                  <ProductLocation product={product} />
                )}

                {activeTab === 'amenities' && isRealEstate && (
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
          <div className="space-y-4">
            {/* Contact Card */}
            {!isOwner && (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-lg">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Interested in this {isRealEstate ? 'property' : 'product'}?
                </h3>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm py-2"
                    onClick={() => setShowContactModal(true)}
                    leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
                  >
                    Send Message
                  </Button>
                  
                  {product.contactInfo?.phone && (
                    <Button 
                      variant="outline"
                      className="w-full text-sm py-2"
                      onClick={() => window.open(`tel:${product.contactInfo.phone}`)}
                      leftIcon={<PhoneIcon className="h-4 w-4" />}
                    >
                      Call Now
                    </Button>
                  )}
                  
                  {isRealEstate && (
                    <Button 
                      variant="outline"
                      className="w-full text-sm py-2"
                      onClick={() => setShowAppointmentModal(true)}
                      leftIcon={<CalendarIcon className="h-4 w-4" />}
                    >
                      Schedule Viewing
                    </Button>
                  )}
                </div>

                {hasRegistrationFee && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Button 
                      variant="success"
                      className="w-full text-sm py-2"
                      onClick={() => setShowRegistrationModal(true)}
                    >
                      Register Interest
                      <span className="ml-2 text-xs opacity-90">
                        {getCurrencySymbol()}{product.propertyDetails.registrationFee.toLocaleString()}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Seller Info */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-lg">
              <SellerInfo 
                product={product} 
                onContactSeller={() => setShowContactModal(true)}
                isOwner={isOwner}
                compact={true}
              />
            </div>

            {/* Property Highlights */}
            {isRealEstate && product.propertyDetails && (
              (() => {
                const propDetails = product.propertyDetails;
                const hasHighlights = propDetails.yearBuilt || propDetails.floors || 
                                     propDetails.furnishingStatus || propDetails.titleDeedStatus;
                
                if (!hasHighlights) return null;
                
                return (
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-lg">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Property Highlights
                    </h3>
                    <div className="space-y-2">
                      {propDetails.yearBuilt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Year Built</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {propDetails.yearBuilt}
                          </span>
                        </div>
                      )}
                      {propDetails.floors && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Floors</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {propDetails.floors}
                          </span>
                        </div>
                      )}
                      {propDetails.furnishingStatus && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Furnishing</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm capitalize">
                            {propDetails.furnishingStatus.replace('-', ' ')}
                          </span>
                        </div>
                      )}
                      {propDetails.titleDeedStatus && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Title Deed</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm capitalize">
                            {propDetails.titleDeedStatus.replace('-', ' ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            )}

            {/* Safety Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <ShieldCheckIcon className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Safety Guidelines
                  </h4>
                  <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Meet in public places</li>
                    <li>• Verify {isRealEstate ? 'property documents' : 'product authenticity'}</li>
                    <li>• Don't pay in advance</li>
                    <li>• Use secure payment methods</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
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

      {isRealEstate && (
        <AppointmentBookingModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          product={product}
        />
      )}
    </div>
  );
};

// Updated Product Details Component - Compact
const ProductDetails = ({ product }) => {
  const details = [];

  // Basic product info
  if (product.brand) details.push({ label: 'Brand', value: product.brand });
  if (product.model) details.push({ label: 'Model', value: product.model });
  if (product.condition) details.push({ 
    label: 'Condition', 
    value: product.condition.charAt(0).toUpperCase() + product.condition.slice(1).replace('-', ' ')
  });

  // Real Estate specific details
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
    if (propDetails?.balconies) details.push({ label: 'Balconies', value: propDetails.balconies });
  }

  // Vehicle details
  if (product.vehicleDetails) {
    const vehDetails = product.vehicleDetails;
    if (vehDetails.make) details.push({ label: 'Make', value: vehDetails.make });
    if (vehDetails.model) details.push({ label: 'Model', value: vehDetails.model });
    if (vehDetails.year) details.push({ label: 'Year', value: vehDetails.year });
    if (vehDetails.mileage) details.push({ label: 'Mileage', value: `${vehDetails.mileage} km` });
    if (vehDetails.fuelType) details.push({ label: 'Fuel Type', value: vehDetails.fuelType.charAt(0).toUpperCase() + vehDetails.fuelType.slice(1) });
    if (vehDetails.transmission) details.push({ label: 'Transmission', value: vehDetails.transmission.charAt(0).toUpperCase() + vehDetails.transmission.slice(1) });
    if (vehDetails.color) details.push({ label: 'Color', value: vehDetails.color });
    if (vehDetails.engineSize) details.push({ label: 'Engine Size', value: vehDetails.engineSize });
    if (vehDetails.bodyType) details.push({ label: 'Body Type', value: vehDetails.bodyType });
  }

  // Equipment details
  if (product.equipmentDetails) {
    const equipDetails = product.equipmentDetails;
    if (equipDetails.manufacturer) details.push({ label: 'Manufacturer', value: equipDetails.manufacturer });
    if (equipDetails.model) details.push({ label: 'Model', value: equipDetails.model });
    if (equipDetails.year) details.push({ label: 'Year', value: equipDetails.year });
    if (equipDetails.hoursUsed) details.push({ label: 'Hours Used', value: equipDetails.hoursUsed });
    if (equipDetails.condition) details.push({ label: 'Condition', value: equipDetails.condition });
  }

  // Business details
  if (product.businessDetails) {
    const bizDetails = product.businessDetails;
    if (bizDetails.businessType) details.push({ label: 'Business Type', value: bizDetails.businessType });
    if (bizDetails.establishedYear) details.push({ label: 'Established Year', value: bizDetails.establishedYear });
    if (bizDetails.employees) details.push({ label: 'Employees', value: bizDetails.employees });
    if (bizDetails.annualRevenue) details.push({ label: 'Annual Revenue', value: `${product.pricing?.currency || 'ETB'} ${parseFloat(bizDetails.annualRevenue).toLocaleString()}` });
  }

  // General specifications
  if (product.specifications && product.specifications.length > 0) {
    product.specifications.forEach(spec => {
      if (spec.name && spec.value) {
        details.push({ label: spec.name, value: spec.value, group: spec.group });
      }
    });
  }

  // Warranty information
  if (product.warranty?.duration) {
    details.push({ 
      label: 'Warranty', 
      value: `${product.warranty.duration} ${product.warranty.unit} (${product.warranty.type})` 
    });
  }

  // Inventory information
  if (product.inventory?.sku) details.push({ label: 'SKU', value: product.inventory.sku });
  if (product.inventory?.stock) details.push({ label: 'Stock', value: product.inventory.stock });

  if (details.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Specifications
      </h3>
      
      <div className="space-y-4">
        {(() => {
          const grouped = details.reduce((acc, detail) => {
            const group = detail.group || 'General';
            if (!acc[group]) acc[group] = [];
            acc[group].push(detail);
            return acc;
          }, {});

          return Object.entries(grouped).map(([groupName, groupDetails]) => (
            <div key={groupName}>
              {Object.keys(grouped).length > 1 && (
                <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
                  {groupName}
                </h4>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groupDetails.map((detail, index) => (
                  <div 
                    key={index}
                    className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                  >
                    <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                      {detail.label}
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

// Updated Product Location Component - Compact
const ProductLocation = ({ product }) => {
  const location = product.propertyDetails?.location;

  if (!location && !product.fullAddress) {
    return null;
  }

  const hasAddress = location?.address || product.fullAddress;
  const hasCity = location?.city;
  const hasRegion = location?.region;
  const hasCoordinates = location?.coordinates && (location.coordinates.lat || location.coordinates.lng);
  const hasLandmarks = location?.landmarks && location.landmarks.length > 0;
  const hasFacilities = location?.nearbyFacilities && location.nearbyFacilities.length > 0;
  const hasDirections = location?.directions;
  const hasTransport = location?.publicTransport;

  if (!hasAddress && !hasCity && !hasRegion && !hasCoordinates && !hasLandmarks && !hasFacilities && !hasDirections && !hasTransport) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Location Details
      </h3>
      
      <div className="space-y-4">
        {/* Address Information */}
        {(hasAddress || hasCity || hasRegion) && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="space-y-1">
              {hasAddress && (
                <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {location?.address || product.fullAddress}
                </div>
              )}
              
              {(hasCity || hasRegion) && (
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  {[location?.subcity, location?.city, location?.region].filter(Boolean).join(', ')}
                </div>
              )}
              
              {location?.country && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {location.country}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coordinates */}
        {hasCoordinates && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">GPS Coordinates</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {location.coordinates.lat && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Latitude:</span>
                  <span className="ml-2 font-mono">{location.coordinates.lat}</span>
                </div>
              )}
              {location.coordinates.lng && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Longitude:</span>
                  <span className="ml-2 font-mono">{location.coordinates.lng}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        {(hasCoordinates || hasAddress) && (
          <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPinIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                Interactive Map
              </p>
              <p className="text-xs text-gray-400">
                Coming Soon
              </p>
            </div>
          </div>
        )}

        {/* Landmarks */}
        {hasLandmarks && (
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Nearby Landmarks
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {location.landmarks.map((landmark, index) => (
                <div key={index} className="flex items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-gray-100 text-sm">{landmark}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Facilities */}
        {hasFacilities && (
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Nearby Facilities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {location.nearbyFacilities.map((facility, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100 capitalize text-sm">
                    {facility.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Directions */}
        {hasDirections && (
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Directions
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm">
                {location.directions}
              </p>
            </div>
          </div>
        )}

        {/* Public Transport */}
        {hasTransport && (
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Public Transport
            </h4>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm">
                {location.publicTransport}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated Product Amenities Component - Compact
const ProductAmenities = ({ product }) => {
  const propDetails = product.propertyDetails;
  
  if (!propDetails) {
    return null;
  }

  const hasFeatures = propDetails.features && propDetails.features.length > 0;
  const hasAmenities = propDetails.amenities && propDetails.amenities.length > 0;
  const hasUtilities = propDetails.utilities && Object.values(propDetails.utilities).some(Boolean);
  const hasLandDetails = product.productType === 'plots' && propDetails.landDetails;

  if (!hasFeatures && !hasAmenities && !hasUtilities && !hasLandDetails) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Features & Amenities
      </h3>
      
      <div className="space-y-6">
        {/* Property Features */}
        {hasFeatures && (
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Property Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {propDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium capitalize text-sm">
                    {feature.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Building Amenities */}
        {hasAmenities && (
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Building Amenities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {propDetails.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium capitalize text-sm">
                    {amenity.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Utilities */}
        {hasUtilities && (
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Utilities & Services
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(propDetails.utilities)
                .filter(([utility, available]) => available !== undefined && available !== null)
                .map(([utility, available]) => (
                <div key={utility} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100 font-medium capitalize text-sm">
                    {utility.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`font-semibold text-xs ${
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

        {/* Land Details (for plots) */}
        {hasLandDetails && (
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Land Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {propDetails.landDetails.landUse && (
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Land Use:</span>
                  <div className="font-medium text-gray-900 dark:text-gray-100 capitalize text-sm">
                    {propDetails.landDetails.landUse.replace('-', ' ')}
                  </div>
                </div>
              )}
              {propDetails.landDetails.topography && (
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Topography:</span>
                  <div className="font-medium text-gray-900 dark:text-gray-100 capitalize text-sm">
                    {propDetails.landDetails.topography}
                  </div>
                </div>
              )}
              {propDetails.landDetails.soilType && (
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Soil Type:</span>
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {propDetails.landDetails.soilType}
                  </div>
                </div>
              )}
              {propDetails.landDetails.waterSource && (
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Water Source:</span>
                  <div className="font-medium text-gray-900 dark:text-gray-100 capitalize text-sm">
                    {propDetails.landDetails.waterSource}
                  </div>
                </div>
              )}
              {propDetails.landDetails.accessRoad && (
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Access Road:</span>
                  <div className="font-medium text-gray-900 dark:text-gray-100 capitalize text-sm">
                    {propDetails.landDetails.accessRoad}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;