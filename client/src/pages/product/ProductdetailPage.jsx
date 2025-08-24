import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeftIcon, 
  ShareIcon, 
  HeartIcon,
  ExclamationTriangleIcon 
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
import BookingSection from '../../components/product/BookingSection';
import RelatedProducts from '../../components/product/RelatedProducts';
import ShareModal from '../../components/product/ShareModal';
import ContactSellerModal from '../../components/chat/ContactSellerModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
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
      document.title = `${product.title} | CitiLights`;
    }
    
    return () => {
      document.title = 'CitiLights';
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

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading product details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The product you are looking for does not exist or has been removed.'}
          </p>
          <div className="space-x-4">
            <Button variant="outline" onClick={handleBack}>
              Go Back
            </Button>
            <Button onClick={() => navigate('/products')}>
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

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Details' },
    { id: 'location', label: 'Location' },
    ...(product.type === 'service' ? [{ id: 'booking', label: 'Booking' }] : []),
    { id: 'reviews', label: `Reviews (${product.reviews?.count || 0})` },
  ];

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
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
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
                
                {activeTab === 'location' && (
                  <ProductLocation product={product} />
                )}
                
                {activeTab === 'booking' && product.type === 'service' && (
                  <BookingSection product={product} />
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
            {/* Seller Info */}
            <SellerInfo 
              product={product} 
              onContactSeller={() => setShowContactModal(true)}
              isOwner={isOwner}
            />

            {/* Quick Contact */}
            {!isOwner && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Interested in this {product.type === 'real-estate' ? 'property' : 'service'}?
                </h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => setShowContactModal(true)}
                  >
                    Contact Seller
                  </Button>
                  
                  {product.type === 'service' && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab('booking')}
                    >
                      Book Appointment
                    </Button>
                  )}
                  
                  {product.type === 'real-estate' && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowContactModal(true)}
                    >
                      Schedule Viewing
                    </Button>
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
    </div>
  );
};

// Product Details Component
const ProductDetails = ({ product }) => {
  const details = [];

  if (product.type === 'real-estate') {
    const reDetails = product.realEstateDetails;
    
    if (reDetails?.bedrooms) details.push({ label: 'Bedrooms', value: reDetails.bedrooms });
    if (reDetails?.bathrooms) details.push({ label: 'Bathrooms', value: reDetails.bathrooms });
    if (reDetails?.area) details.push({ label: 'Area', value: `${reDetails.area} sqm` });
    if (reDetails?.yearBuilt) details.push({ label: 'Year Built', value: reDetails.yearBuilt });
    if (reDetails?.propertyType) details.push({ label: 'Property Type', value: reDetails.propertyType });
    if (reDetails?.furnishingStatus) details.push({ label: 'Furnishing', value: reDetails.furnishingStatus });
    if (reDetails?.parkingSpaces) details.push({ label: 'Parking Spaces', value: reDetails.parkingSpaces });
    if (reDetails?.floorNumber) details.push({ label: 'Floor', value: reDetails.floorNumber });
    if (reDetails?.totalFloors) details.push({ label: 'Total Floors', value: reDetails.totalFloors });
  } else if (product.type === 'service') {
    const sDetails = product.serviceDetails;
    
    if (sDetails?.serviceType) details.push({ label: 'Service Type', value: sDetails.serviceType });
    if (sDetails?.duration) details.push({ label: 'Duration', value: sDetails.duration });
    if (sDetails?.serviceArea) details.push({ label: 'Service Area', value: sDetails.serviceArea });
    if (sDetails?.availability) details.push({ label: 'Availability', value: sDetails.availability });
  }

  // General details
  if (product.condition) details.push({ label: 'Condition', value: product.condition });
  if (product.brand) details.push({ label: 'Brand', value: product.brand });
  if (product.model) details.push({ label: 'Model', value: product.model });

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Specifications
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
              <span className="text-gray-900 dark:text-gray-100 capitalize">
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

// Product Location Component
const ProductLocation = ({ product }) => {
  const location = product.type === 'real-estate' 
    ? product.realEstateDetails?.location 
    : { city: product.serviceDetails?.serviceArea || 'Addis Ababa' };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Location Information
      </h3>
      
      <div className="space-y-4">
        {location?.address && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <p className="text-gray-900 dark:text-gray-100">{location.address}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {location?.city && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <p className="text-gray-900 dark:text-gray-100">{location.city}</p>
            </div>
          )}
          
          {location?.state && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State/Region
              </label>
              <p className="text-gray-900 dark:text-gray-100">{location.state}</p>
            </div>
          )}
        </div>

        {/* Map placeholder */}
        {location?.coordinates && (
          <div className="mt-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Interactive map would be displayed here
              </p>
            </div>
          </div>
        )}

        {/* Nearby Places */}
        {product.type === 'real-estate' && location?.nearbyPlaces && location.nearbyPlaces.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
              Nearby Places
            </h4>
            <div className="space-y-2">
              {location.nearbyPlaces.map((place, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{place.name}</span>
                  <span className="text-gray-900 dark:text-gray-100">{place.distance}</span>
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