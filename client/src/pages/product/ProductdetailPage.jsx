// pages/products/ProductDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeftIcon, 
  ShareIcon, 
  HeartIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { 
  fetchProduct, 
  fetchRelatedProducts, 
  toggleWishlist,
  clearCurrentProduct 
} from '../../store/slices/productSlice';
import ProductImageGallery from '../../components/product/ProductImageGallery';
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
  const [activeTab, setActiveTab] = useState('description');

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
      toast.error('Please login to add to wishlist');
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
  const hasRegistrationFee = product?.propertyDetails?.registrationFee > 0;

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading property details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The property you are looking for does not exist or has been removed.'}
          </p>
          <div className="space-x-4">
            <Button variant="outline" onClick={handleBack}>
              Go Back
            </Button>
            <Button onClick={() => navigate('/products')}>
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
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Details' },
    ...(isPropertyProduct ? [
      { id: 'location', label: 'Location' },
      { id: 'features', label: 'Features' }
    ] : []),
    { id: 'reviews', label: `Reviews (${product.reviews?.count || 0})` },
  ];

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
      'real-estate': 'Real Estate',
      'companies': 'Company',
      'electronics': 'Electronics',
      'vehicles': 'Vehicle',
      'furnitures': 'Furniture',
      'agricultural-products': 'Agricultural Products',
      'construction-equipment': 'Construction Equipment'
    };
    return typeMap[product.subProductType] || product.subProductType;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-3">
              {/* Property Type Badge */}
              <Badge 
                variant={product.listingType === 'rent' ? 'warning' : 'success'}
                className="hidden sm:inline-flex"
              >
                For {product.listingType === 'rent' ? 'Rent' : 'Sale'}
              </Badge>

              {!isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWishlist}
                  leftIcon={
                    isWishlisted ? (
                      <HeartSolidIcon className="h-4 w-4 text-red-500" />
                    ) : (
                      <HeartIcon className="h-4 w-4" />
                    )
                  }
                >
                  {isWishlisted ? 'Saved' : 'Save'}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareModal(true)}
                leftIcon={<ShareIcon className="h-4 w-4" />}
              >
                Share
              </Button>
              
              {!isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FlagIcon className="h-4 w-4" />}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Report
                </Button>
              )}
              
              {isOwner && (
                <Button
                  size="sm"
                  onClick={() => navigate(`/dashboard/products/${product._id}/edit`)}
                >
                  Edit Listing
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ProductImageGallery product={product} />

            {/* Product Info */}
            <ProductInfo product={product} />

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <ProductDescription product={product} />
                )}
                
                {activeTab === 'details' && (
                  <ProductDetails product={product} />
                )}
                
                {activeTab === 'location' && isPropertyProduct && (
                  <ProductLocation product={product} />
                )}

                {activeTab === 'features' && isPropertyProduct && (
                  <ProductFeatures product={product} />
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
            {/* Price & Action Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {product.pricing?.basePrice?.toLocaleString()} {product.pricing?.currency || 'ETB'}
                  </span>
                  {product.pricing?.isNegotiable && (
                    <Badge variant="info" size="sm">Negotiable</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {getPropertyTypeDisplay()} • {product.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </div>
              </div>

              {!isOwner && (
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => setShowContactModal(true)}
                    leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
                  >
                    Contact Seller
                  </Button>
                  
                  {isPropertyProduct && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowAppointmentModal(true)}
                      leftIcon={<CalendarIcon className="h-4 w-4" />}
                    >
                      Schedule Viewing
                    </Button>
                  )}

                  {hasRegistrationFee && (
                    <Button 
                      variant="success" 
                      className="w-full"
                      onClick={() => setShowRegistrationModal(true)}
                      leftIcon={<DocumentTextIcon className="h-4 w-4" />}
                    >
                      Register Interest
                      <span className="ml-2 text-xs">
                        Fee: {product.propertyDetails.registrationFee} {product.pricing?.currency || 'ETB'}
                      </span>
                    </Button>
                  )}

                  {product.pricing?.isNegotiable && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowContactModal(true)}
                      leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                    >
                      Make Offer
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Seller Info */}
            <SellerInfo 
              product={product} 
              onContactSeller={() => setShowContactModal(true)}
              isOwner={isOwner}
            />

            {/* Key Details Card */}
            {isPropertyProduct && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Key Details
                </h3>
                <div className="space-y-3">
                  {product.propertyDetails?.bedrooms && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Bedrooms</span>
                      <span className="font-medium">{product.propertyDetails.bedrooms}</span>
                    </div>
                  )}
                  {product.propertyDetails?.bathrooms && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Bathrooms</span>
                      <span className="font-medium">{product.propertyDetails.bathrooms}</span>
                    </div>
                  )}
                  {product.propertyDetails?.area?.value && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Area</span>
                      <span className="font-medium">
                        {product.propertyDetails.area.value} {product.propertyDetails.area.unit || 'sqm'}
                      </span>
                    </div>
                  )}
                  {product.propertyDetails?.yearBuilt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Year Built</span>
                      <span className="font-medium">{product.propertyDetails.yearBuilt}</span>
                    </div>
                  )}
                  {product.propertyDetails?.furnishingStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Furnishing</span>
                      <span className="font-medium capitalize">
                        {product.propertyDetails.furnishingStatus.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location Card */}
            {isPropertyProduct && product.propertyDetails?.location && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Location
                </h3>
                <div className="space-y-2 text-sm">
                  {product.propertyDetails.location.city && (
                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                      {product.propertyDetails.location.city}
                    </div>
                  )}
                  {product.propertyDetails.location.subcity && (
                    <div className="text-gray-600 dark:text-gray-400">
                      {product.propertyDetails.location.subcity}
                    </div>
                  )}
                  {product.propertyDetails.location.region && (
                    <div className="text-gray-600 dark:text-gray-400">
                      {product.propertyDetails.location.region}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Safety Tips */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Safety Tips
              </h4>
              <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Meet in a public place</li>
                <li>• Verify seller identity</li>
                <li>• Don't send money in advance</li>
                <li>• Inspect property before purchasing</li>
                <li>• Use secure payment methods</li>
                <li>• Report suspicious activity</li>
              </ul>
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

// Enhanced Product Details Component
const ProductDetails = ({ product }) => {
  const details = [];

  // Basic product info
  if (product.brand) details.push({ label: 'Brand', value: product.brand });
  if (product.model) details.push({ label: 'Model', value: product.model });
  if (product.condition) details.push({ 
    label: 'Condition', 
    value: product.condition.charAt(0).toUpperCase() + product.condition.slice(1).replace('-', ' ')
  });
  
  // Product type info
  if (product.productType) details.push({ 
    label: 'Category', 
    value: product.productType.charAt(0).toUpperCase() + product.productType.slice(1)
  });
  
  if (product.subProductType) details.push({ 
    label: 'Type', 
    value: product.subProductType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  });

  // Inventory details
  if (product.inventory?.sku) details.push({ label: 'SKU', value: product.inventory.sku });
  if (product.inventory?.stock !== undefined && product.inventory?.trackInventory) {
    details.push({ label: 'Stock', value: product.inventory.stock });
  }

  // Property specific details
  if (['homes', 'plots', 'commercials'].includes(product.productType)) {
    const propDetails = product.propertyDetails;
    
    if (propDetails?.area?.value) {
      details.push({ 
        label: 'Total Area', 
        value: `${propDetails.area.value} ${propDetails.area.unit || 'sqm'}` 
      });
    }
    
    if (propDetails?.bedrooms) details.push({ label: 'Bedrooms', value: propDetails.bedrooms });
    if (propDetails?.bathrooms) details.push({ label: 'Bathrooms', value: propDetails.bathrooms });
    if (propDetails?.floors) details.push({ label: 'Floors', value: propDetails.floors });
    if (propDetails?.parkingSpaces) details.push({ label: 'Parking Spaces', value: propDetails.parkingSpaces });
    if (propDetails?.yearBuilt) details.push({ label: 'Year Built', value: propDetails.yearBuilt });
    
    if (propDetails?.furnishingStatus) {
      details.push({ 
        label: 'Furnishing Status', 
        value: propDetails.furnishingStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
      });
    }

    // Project details for companies
    if (propDetails?.isProject && propDetails?.projectDetails) {
      const projDetails = propDetails.projectDetails;
      if (projDetails.totalUnits) details.push({ label: 'Total Units', value: projDetails.totalUnits });
      if (projDetails.availableUnits) details.push({ label: 'Available Units', value: projDetails.availableUnits });
      if (projDetails.completionDate) {
        details.push({ 
          label: 'Completion Date', 
          value: new Date(projDetails.completionDate).toLocaleDateString() 
        });
      }
      if (projDetails.constructionStatus) {
        details.push({ 
          label: 'Construction Status', 
          value: projDetails.constructionStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        });
      }
    }

    // Land specific details
    if (product.productType === 'plots' && propDetails?.landDetails) {
      const landDetails = propDetails.landDetails;
      if (landDetails.landUse) {
        details.push({ 
          label: 'Land Use', 
          value: landDetails.landUse.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        });
      }
      if (landDetails.topography) details.push({ label: 'Topography', value: landDetails.topography });
      if (landDetails.soilType) details.push({ label: 'Soil Type', value: landDetails.soilType });
      if (landDetails.waterSource) {
        details.push({ 
          label: 'Water Source', 
          value: landDetails.waterSource.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        });
      }
      if (landDetails.accessRoad) {
        details.push({ 
          label: 'Access Road', 
          value: landDetails.accessRoad.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        });
      }
    }

    // Legal documents
    if (propDetails?.hasLegalDocuments) {
      details.push({ label: 'Legal Documents', value: 'Available' });
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
    if (vehDetails.color) details.push({ label: 'Color', value: vehDetails.color });
  }

  // Equipment details
  if (product.equipmentDetails) {
    const equipDetails = product.equipmentDetails;
    if (equipDetails.manufacturer) details.push({ label: 'Manufacturer', value: equipDetails.manufacturer });
    if (equipDetails.year) details.push({ label: 'Year', value: equipDetails.year });
    if (equipDetails.hoursUsed) details.push({ label: 'Hours Used', value: equipDetails.hoursUsed });
  }

  // Shipping details for physical products
  if (product.shipping?.weight) details.push({ label: 'Weight', value: `${product.shipping.weight} kg` });
  
  // Warranty information
  if (product.warranty?.duration) {
    details.push({ 
      label: 'Warranty', 
      value: `${product.warranty.duration} ${product.warranty.unit}${product.warranty.duration > 1 ? 's' : ''} (${product.warranty.type})` 
    });
  }

  // Custom specifications
  if (product.specifications && product.specifications.length > 0) {
    product.specifications.forEach(spec => {
      details.push({ label: spec.name, value: spec.value });
    });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Detailed Specifications
      </h3>
      
      {details.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div 
              key={index}
              className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {detail.label}
              </span>
              <span className="text-gray-900 dark:text-gray-100 text-right">
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          No detailed specifications available.
        </p>
      )}
    </div>
  );
};

// Enhanced Product Location Component
const ProductLocation = ({ product }) => {
  const location = product.propertyDetails?.location;

  if (!location) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Location Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No location information available.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Location Details
      </h3>
      
      <div className="space-y-6">
        {/* Address Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {location.address && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Street Address
              </label>
              <p className="text-gray-900 dark:text-gray-100">{location.address}</p>
            </div>
          )}
          
          {location.city && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <p className="text-gray-900 dark:text-gray-100">{location.city}</p>
            </div>
          )}
          
          {location.subcity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sub City
              </label>
              <p className="text-gray-900 dark:text-gray-100">{location.subcity}</p>
            </div>
          )}

          {location.woreda && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Woreda
              </label>
              <p className="text-gray-900 dark:text-gray-100">{location.woreda}</p>
            </div>
          )}

          {location.kebele && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kebele
              </label>
              <p className="text-gray-900 dark:text-gray-100">{location.kebele}</p>
            </div>
          )}
          
          {location.region && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Region
              </label>
              <p className="text-gray-900 dark:text-gray-100">{location.region}</p>
            </div>
          )}
        </div>

        {/* Map placeholder */}
        {location.coordinates && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Map Location
            </label>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <MapPinIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Interactive map will be displayed here
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Lat: {location.coordinates.lat}, Lng: {location.coordinates.lng}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nearby Facilities */}
        {location.nearbyFacilities && location.nearbyFacilities.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
              Nearby Facilities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {location.nearbyFacilities.map((facility, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {facility.type.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {facility.name}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {facility.distance}m away
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Landmarks */}
        {location.landmarks && location.landmarks.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
              Notable Landmarks
            </h4>
            <div className="space-y-2">
              {location.landmarks.map((landmark, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {landmark}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Features Component
const ProductFeatures = ({ product }) => {
  const propDetails = product.propertyDetails;
  
  if (!propDetails) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Features & Amenities
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No features information available.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Features & Amenities
      </h3>
      
      <div className="space-y-6">
        {/* Property Features */}
        {propDetails.features && propDetails.features.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
              Property Features
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {propDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="capitalize">{feature.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        {propDetails.amenities && propDetails.amenities.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
              Building Amenities
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {propDetails.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="capitalize">{amenity.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Utilities */}
        {propDetails.utilities && (
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
              Utilities & Services
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(propDetails.utilities).map(([utility, available]) => (
                <div key={utility} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                    {utility.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Features */}
        {propDetails.isProject && propDetails.projectDetails?.projectFeatures && propDetails.projectDetails.projectFeatures.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
              Project Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {propDetails.projectDetails.projectFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="capitalize">{feature.replace('-', ' ')}</span>
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