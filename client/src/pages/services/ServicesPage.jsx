import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  CheckBadgeIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  PaintBrushIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ServiceFilters from '../../components/services/ServiceFilters';
import ServiceInquiryModal from '../../components/services/ServiceInquiryModal';
import { fetchProducts, setFilters, clearFilters, setViewMode } from '../../store/slices/productSlice';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const ServicesPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: services, isLoading, pagination, filters, viewMode } = useSelector(state => state.products);
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Initialize filters from URL params
    const urlFilters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      location: searchParams.get('location') || '',
      serviceType: searchParams.get('serviceType') || '',
      productType: 'service' // Always filter for services
    };
    
    dispatch(setFilters(urlFilters));
  }, [dispatch, searchParams]);

  useEffect(() => {
    // Fetch services when filters change
    const fetchParams = {
      ...filters,
      productType: 'service',
      sort: sortBy,
      page: 1,
      limit: 12
    };
    dispatch(fetchProducts(fetchParams));
  }, [dispatch, filters, sortBy]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'productType') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setFilters({ productType: 'service' }));
  };

  const handleServiceInquiry = (service) => {
    setSelectedService(service);
    setShowInquiryModal(true);
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

  const ServiceCard = ({ service, viewMode }) => {
    const ServiceIcon = getServiceIcon(service.serviceDetails?.serviceType);
    const sellerName = service.seller?.companyProfile?.companyName || 
                     `${service.seller?.individualProfile?.firstName} ${service.seller?.individualProfile?.lastName}` ||
                     'Service Provider';

    if (viewMode === 'list') {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="flex">
            {/* Image */}
            <div className="relative w-80 h-48 flex-shrink-0">
              <img
                src={service.media?.images?.[0]?.url || '/api/placeholder/300/200'}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              
              {/* Service Type Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full flex items-center">
                  <ServiceIcon className="h-4 w-4 mr-1" />
                  {service.serviceDetails?.serviceType?.replace('-', ' ') || 'Service'}
                </span>
              </div>

              {/* Featured Badge */}
              {service.isFeatured && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {service.pricing?.priceType === 'starting-from' ? 'Starting from ' : ''}
                  {formatCurrency(service.pricing?.basePrice, service.pricing?.currency)}
                  {service.pricing?.priceType && service.pricing.priceType !== 'fixed' && (
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">
                      {service.pricing.priceType.replace('-', ' ')}
                    </span>
                  )}
                </div>
                {service.seller?.sellerRating && (
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {service.seller.sellerRating.average?.toFixed(1)} ({service.seller.sellerRating.count})
                    </span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {service.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {service.shortDescription || service.description}
              </p>

              {/* Service Details */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                {service.serviceDetails?.duration && (
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {service.serviceDetails.duration.value} {service.serviceDetails.duration.unit}
                    </span>
                  </div>
                )}
                
                {service.serviceDetails?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {service.serviceDetails.location}
                    </span>
                  </div>
                )}

                {service.serviceDetails?.deliveryTime && (
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Delivery: {service.serviceDetails.deliveryTime}
                    </span>
                  </div>
                )}
              </div>

              {/* Seller Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={service.seller?.companyProfile?.logo || '/api/placeholder/32/32'}
                    alt={sellerName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {sellerName}
                  </span>
                  {service.seller?.isVerified && (
                    <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{service.views || 0} views</span>
                  <span>{formatRelativeTime(service.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link to={`/services/${service._id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Button 
                  className="flex-1"
                  onClick={() => handleServiceInquiry(service)}
                >
                  Get Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid view
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.media?.images?.[0]?.url || '/api/placeholder/400/300'}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Service Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full flex items-center">
              <ServiceIcon className="h-3 w-3 mr-1" />
              {service.serviceDetails?.serviceType?.replace('-', ' ') || 'Service'}
            </span>
          </div>

          {/* Featured Badge */}
          {service.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price and Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {service.pricing?.priceType === 'starting-from' ? 'From ' : ''}
              {formatCurrency(service.pricing?.basePrice, service.pricing?.currency)}
              {service.pricing?.priceType && service.pricing.priceType !== 'fixed' && (
                <span className="text-xs font-normal text-gray-600 dark:text-gray-400 block">
                  {service.pricing.priceType.replace('-', ' ')}
                </span>
              )}
            </div>
            {service.seller?.sellerRating && (
              <div className="flex items-center space-x-1">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {service.seller.sellerRating.average?.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {service.title}
          </h3>

          {/* Service Details */}
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            {service.serviceDetails?.duration && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                {service.serviceDetails.duration.value} {service.serviceDetails.duration.unit}
              </span>
            )}
            
            {service.serviceDetails?.location && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full capitalize">
                {service.serviceDetails.location}
              </span>
            )}

            {service.serviceDetails?.deliveryTime && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                {service.serviceDetails.deliveryTime}
              </span>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <img
                src={service.seller?.companyProfile?.logo || '/api/placeholder/24/24'}
                alt={sellerName}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {sellerName}
              </span>
              {service.seller?.isVerified && (
                <CheckBadgeIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {service.views || 0} views
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link to={`/services/${service._id}`} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                View Details
              </Button>
            </Link>
            <Button 
              className="flex-1" 
              size="sm"
              onClick={() => handleServiceInquiry(service)}
            >
              Get Quote
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading services..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Professional Services
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {services.length} services found
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => dispatch(setViewMode('grid'))}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => dispatch(setViewMode('list'))}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ServiceFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FunnelIcon className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                
                {Object.values(filters).some(v => v && v !== 'service') && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Services Grid/List */}
            {services.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <WrenchScrewdriverIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                {pagination.hasPrev && (
                  <Button 
                    variant="outline" 
                    onClick={() => dispatch(fetchProducts({ ...filters, page: pagination.currentPage - 1 }))}
                  >
                    Previous
                  </Button>
                )}
                
                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                {pagination.hasNext && (
                  <Button 
                    variant="outline"
                    onClick={() => dispatch(fetchProducts({ ...filters, page: pagination.currentPage + 1 }))}
                  >
                    Next
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Inquiry Modal */}
      {showInquiryModal && selectedService && (
        <ServiceInquiryModal
          service={selectedService}
          onClose={() => {
            setShowInquiryModal(false);
            setSelectedService(null);
          }}
          onSuccess={() => {
            setShowInquiryModal(false);
            setSelectedService(null);
            toast.success('Service inquiry submitted successfully!');
          }}
        />
      )}
    </div>
  );
};

export default ServicesPage;