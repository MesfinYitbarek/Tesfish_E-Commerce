import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  EyeIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  BuildingOfficeIcon,
  CameraIcon,
  PlayIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  PaintBrushIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  GlobeAltIcon,
  VideoCameraIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ServiceInquiryModal from '../../components/services/ServiceInquiryModal';
import { fetchProduct, fetchRelatedProducts, toggleWishlist } from '../../store/slices/productSlice';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: service, relatedProducts, productLoading, wishlistedItems } = useSelector(state => state.products);
  const { user } = useSelector(state => state.auth);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showAllSpecifications, setShowAllSpecifications] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const isWishlisted = wishlistedItems.includes(serviceId);

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchProduct(serviceId));
    }
  }, [dispatch, serviceId]);

  useEffect(() => {
    if (service && service.category) {
      dispatch(fetchRelatedProducts(serviceId));
    }
  }, [dispatch, serviceId, service]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.title,
        text: service.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error('Please login to save services');
      return;
    }
    dispatch(toggleWishlist(serviceId));
  };

  const nextImage = () => {
    if (service?.media?.images?.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % service.media.images.length);
    }
  };

  const prevImage = () => {
    if (service?.media?.images?.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + service.media.images.length) % service.media.images.length);
    }
  };

  const getServiceIcon = (serviceType) => {
    const icons = {
      'project-management': BriefcaseIcon,
      'engineering-design': CogIcon,
      'interior-design': PaintBrushIcon,
      'consultancy': UserIcon,
      'construction': BuildingOfficeIcon,
      'other': WrenchScrewdriverIcon
    };
    return icons[serviceType] || WrenchScrewdriverIcon;
  };

  const getProviderName = () => {
    if (!service?.seller) return 'Service Provider';
    return service.seller.companyProfile?.companyName || 
           `${service.seller.individualProfile?.firstName} ${service.seller.individualProfile?.lastName}` ||
           'Service Provider';
  };

  const getProviderType = () => {
    return service?.seller?.companyProfile ? 'company' : 'individual';
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading service details..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Service Not Found
          </h1>
          <Link to="/services">
            <Button>Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const ServiceIcon = getServiceIcon(service.serviceDetails?.serviceType);
  const providerName = getProviderName();
  const providerType = getProviderType();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'reviews', label: `Reviews (${service.reviews?.count || 0})` },
    { id: 'provider', label: 'Provider' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/services" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Services
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {service.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="relative h-96">
                <img
                  src={service.media?.images?.[activeImageIndex]?.url || '/api/placeholder/800/600'}
                  alt={service.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowImageGallery(true)}
                />
                
                {/* Navigation Arrows */}
                {service.media?.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Overlays */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full flex items-center">
                    <ServiceIcon className="h-4 w-4 mr-1" />
                    {service.serviceDetails?.serviceType?.replace('-', ' ') || 'Service'}
                  </span>
                  {service.isFeatured && (
                    <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full">
                      Featured
                    </span>
                  )}
                  {service.isPromoted && (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                      Promoted
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleToggleWishlist}
                    className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    {isWishlisted ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ShareIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Image Counter */}
                {service.media?.images?.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {activeImageIndex + 1} / {service.media.images.length}
                  </div>
                )}

                {/* Media Buttons */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {service.media?.images?.length > 0 && (
                    <button
                      onClick={() => setShowImageGallery(true)}
                      className="flex items-center space-x-2 bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      <CameraIcon className="h-4 w-4" />
                      <span>View All Photos</span>
                    </button>
                  )}
                  {service.media?.videos?.length > 0 && (
                    <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
                      <VideoCameraIcon className="h-4 w-4" />
                      <span>Watch Video</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {service.media?.images?.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {service.media.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === activeImageIndex
                          ? 'border-primary-500'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${service.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Service Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
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
                  <div className="space-y-6">
                    {/* Title and Basic Info */}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {service.title}
                      </h1>
                      
                      {/* Service Quick Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {service.serviceDetails?.duration && (
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <ClockIcon className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {service.serviceDetails.duration.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {service.serviceDetails.duration.unit}
                            </div>
                          </div>
                        )}
                        
                        {service.serviceDetails?.location && (
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <MapPinIcon className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                              {service.serviceDetails.location}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Location</div>
                          </div>
                        )}
                        
                        {service.serviceDetails?.deliveryTime && (
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <CalendarIcon className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {service.serviceDetails.deliveryTime}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Delivery</div>
                          </div>
                        )}
                        
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <EyeIcon className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {service.views || 0}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Service Description
                        </h3>
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {service.description}
                          </p>
                          {service.shortDescription && service.shortDescription !== service.description && (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                              {service.shortDescription}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Service Requirements */}
                      {service.serviceDetails?.requirements?.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Requirements
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {service.serviceDetails.requirements.map((requirement, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Specifications */}
                    {service.specifications?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Service Specifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(showAllSpecifications ? service.specifications : service.specifications.slice(0, 8)).map((spec, index) => (
                            <div key={index} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                              <span className="text-gray-600 dark:text-gray-400">{spec.name}:</span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                        {service.specifications.length > 8 && (
                          <button
                            onClick={() => setShowAllSpecifications(!showAllSpecifications)}
                            className="mt-3 text-primary-600 dark:text-primary-400 hover:underline text-sm"
                          >
                            {showAllSpecifications ? 'Show Less' : `Show All ${service.specifications.length} Specifications`}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Service Process */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        How It Works
                      </h3>
                      <div className="space-y-4">
                        {[
                          { step: 1, title: 'Send Inquiry', description: 'Submit your project requirements and get a detailed quote' },
                          { step: 2, title: 'Review Proposal', description: 'Review the detailed proposal and negotiate terms if needed' },
                          { step: 3, title: 'Start Project', description: 'Once agreed, the service provider will begin your project' },
                          { step: 4, title: 'Delivery', description: 'Receive your completed project within the agreed timeline' }
                        ].map((item) => (
                          <div key={item.step} className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {item.step}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Documents */}
                    {service.media?.documents?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Additional Documents
                        </h3>
                        <div className="space-y-2">
                          {service.media.documents.map((doc, index) => (
                            <a
                              key={index}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                              <DocumentIcon className="h-6 w-6 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{doc.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{doc.type}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Reviews Summary */}
                    {service.reviews?.count > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                            {service.reviews.average?.toFixed(1) || '0.0'}
                          </div>
                          <div className="flex items-center justify-center space-x-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(service.reviews.average) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Based on {service.reviews.count} reviews
                          </p>
                        </div>
                        
                        <div className="col-span-2">
                          {/* Rating Breakdown */}
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center space-x-2 mb-2">
                              <span className="text-sm w-3">{rating}</span>
                              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full" 
                                  style={{ width: `${Math.random() * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                                {Math.floor(Math.random() * 20)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                          No reviews yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Be the first to review this service
                        </p>
                      </div>
                    )}

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      {/* Mock reviews */}
                      {service.reviews?.count > 0 && [
                        {
                          id: 1,
                          customer: 'John D.',
                          rating: 5,
                          comment: 'Excellent service! Very professional and delivered exactly what was promised.',
                          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        },
                        {
                          id: 2,
                          customer: 'Sarah M.',
                          rating: 4,
                          comment: 'Great work quality and good communication throughout the project.',
                          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
                        }
                      ].map((review) => (
                        <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 dark:text-gray-100">{review.customer}</span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatRelativeTime(review.date)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'provider' && (
                  <div className="space-y-6">
                    {/* Provider Info */}
                    <div className="flex items-start space-x-6">
                      <img
                        src={service.seller?.companyProfile?.logo || '/api/placeholder/100/100'}
                        alt={providerName}
                        className="w-20 h-20 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {providerName}
                          </h3>
                          {service.seller?.isVerified && (
                            <CheckBadgeIcon className="h-6 w-6 text-blue-500" />
                          )}
                          {providerType === 'company' ? (
                            <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        
                        {service.seller?.sellerRating && (
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(service.seller.sellerRating.average) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {service.seller.sellerRating.average?.toFixed(1)} ({service.seller.sellerRating.count} reviews)
                            </span>
                          </div>
                        )}

                        {/* Provider Details */}
                        <div className="space-y-2 text-sm">
                          {service.seller?.companyProfile?.businessCategories && (
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Specializes in:</span> {service.seller.companyProfile.businessCategories.join(', ')}
                            </p>
                          )}
                          {service.seller?.companyProfile?.yearEstablished && (
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Established:</span> {service.seller.companyProfile.yearEstablished}
                            </p>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center space-x-4 mt-4">
                          {service.seller?.companyProfile?.contactInfo?.phone && (
                            <a 
                              href={`tel:${service.seller.companyProfile.contactInfo.phone}`}
                              className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              <PhoneIcon className="h-4 w-4" />
                              <span>{service.seller.companyProfile.contactInfo.phone}</span>
                            </a>
                          )}
                          {service.seller?.companyProfile?.contactInfo?.website && (
                            <a 
                              href={service.seller.companyProfile.contactInfo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              <GlobeAltIcon className="h-4 w-4" />
                              <span>Website</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Company Description */}
                    {service.seller?.companyProfile?.description && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">About {providerName}</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {service.seller.companyProfile.description}
                        </p>
                      </div>
                    )}

                    {/* Other Services */}
                    {relatedProducts.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                          Other Services by {providerName}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {relatedProducts.slice(0, 4).map((relatedService) => (
                            <Link key={relatedService._id} to={`/services/${relatedService._id}`}>
                              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                  {relatedService.title}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {relatedService.shortDescription}
                                </p>
                                <p className="text-primary-600 dark:text-primary-400 font-semibold">
                                  {formatCurrency(relatedService.pricing?.basePrice, relatedService.pricing?.currency)}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {service.pricing?.priceType === 'starting-from' ? 'Starting from ' : ''}
                  {formatCurrency(service.pricing?.basePrice, service.pricing?.currency)}
                </div>
                {service.pricing?.priceType && service.pricing.priceType !== 'fixed' && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {service.pricing.priceType.replace('-', ' ')}
                  </div>
                )}
                {service.pricing?.isNegotiable && (
                  <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Price negotiable
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <Button 
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full"
                  size="lg"
                >
                  Get Quote
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                  onClick={() => window.open(`tel:${service.seller?.companyProfile?.contactInfo?.phone}`, '_self')}
                >
                  Call Now
                </Button>
              </div>

              {/* Service Stats */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Service Statistics
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Views</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {service.views || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HeartIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Saved by</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {Math.floor(Math.random() * 50) + 10} people
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Listed</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatRelativeTime(service.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Services */}
            {relatedProducts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Related Services
                </h4>
                <div className="space-y-4">
                  {relatedProducts.slice(0, 3).map((related) => (
                    <Link key={related._id} to={`/services/${related._id}`}>
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <img
                          src={related.media?.images?.[0]?.url || '/api/placeholder/60/60'}
                          alt={related.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
                            {related.title}
                          </h5>
                          <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm mt-1">
                            {formatCurrency(related.pricing?.basePrice, related.pricing?.currency)}
                          </p>
                          {related.seller?.sellerRating && (
                            <div className="flex items-center space-x-1 mt-1">
                              <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {related.seller.sellerRating.average?.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Inquiry Modal */}
      {showInquiryModal && (
        <ServiceInquiryModal
          service={service}
          onClose={() => setShowInquiryModal(false)}
          onSuccess={() => {
            setShowInquiryModal(false);
            toast.success('Service inquiry submitted successfully!');
          }}
        />
      )}

      {/* Image Gallery Modal */}
      {showImageGallery && service.media?.images?.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95">
          <div className="flex items-center justify-center min-h-screen p-4">
            <button
              onClick={() => setShowImageGallery(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            
            <div className="relative w-full max-w-4xl">
              <img
                src={service.media.images[activeImageIndex].url}
                alt={service.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {service.media.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {activeImageIndex + 1} / {service.media.images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage;