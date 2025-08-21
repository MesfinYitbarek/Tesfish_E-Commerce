import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ListingDetailsModal from '../../components/admin/ListingDetailsModal';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const ListingModeration = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', listing: null });
  const [selectedListings, setSelectedListings] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  useEffect(() => {
    fetchListings();
  }, [searchQuery, statusFilter, typeFilter, sortBy, pagination.currentPage]);

  useEffect(() => {
    filterAndSortListings();
  }, [listings]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.currentPage.toString());
      queryParams.append('limit', '20');
      
      if (searchQuery) queryParams.append('search', searchQuery);
      if (statusFilter !== 'all') {
        // Map component status to backend status
        const statusMap = {
          pending: 'draft',
          approved: 'active',
          rejected: 'discontinued'
        };
        queryParams.append('status', statusMap[statusFilter] || statusFilter);
      }
      if (typeFilter !== 'all') queryParams.append('productType', typeFilter);
      
      // Map sorting options
      const sortMap = {
        newest: 'newest',
        oldest: 'oldest',
        'price-high': 'price-high',
        'price-low': 'price-low',
        priority: 'newest' // fallback to newest for priority
      };
      queryParams.append('sort', sortMap[sortBy] || 'newest');

      const response = await api.get(`/products?${queryParams.toString()}`);

      if (response.data.success) {
        // Transform product data to listing format
        const transformedListings = response.data.data.products.map(product => ({
          id: product._id,
          title: product.title,
          description: product.description,
          price: product.pricing.basePrice,
          currency: product.pricing.currency,
          type: product.productType,
          category: product.category?.name || 'Uncategorized',
          status: mapProductStatusToListingStatus(product.status),
          images: product.media?.images?.map(img => img.url) || [],
          location: {
            city: product.realEstateDetails?.location?.city || 'N/A',
            subcity: product.realEstateDetails?.location?.state || '',
            address: product.realEstateDetails?.location?.address || ''
          },
          seller: {
            id: product.seller._id,
            name: product.seller.companyProfile?.companyName || 
                  `${product.seller.individualProfile?.firstName || ''} ${product.seller.individualProfile?.lastName || ''}`.trim() ||
                  'Unknown Seller',
            type: product.sellerType,
            email: product.seller.email || 'N/A',
            phone: product.seller.companyProfile?.contactInfo?.phone || 
                   product.seller.individualProfile?.phone || 'N/A',
            verified: product.seller.isVerified || false
          },
          submittedAt: new Date(product.createdAt),
          features: extractFeatures(product),
          specifications: extractSpecifications(product),
          flagged: false, // TODO: Implement flagging system
          priority: determinePriority(product),
          views: product.views || 0,
          originalProduct: product // Keep original product data
        }));

        setListings(transformedListings);
        setPagination(response.data.data.pagination);
      } else {
        throw new Error(response.data.message || 'Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (!error.response) {
        toast.error('Failed to load listings. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to map product status to listing status
  const mapProductStatusToListingStatus = (productStatus) => {
    const statusMap = {
      draft: 'pending',
      active: 'approved',
      sold: 'approved',
      'out-of-stock': 'approved',
      discontinued: 'rejected'
    };
    return statusMap[productStatus] || 'pending';
  };

  // Helper function to extract features from product
  const extractFeatures = (product) => {
    const features = [];
    
    if (product.realEstateDetails) {
      const { bedrooms, bathrooms, area, features: propertyFeatures } = product.realEstateDetails;
      if (bedrooms) features.push(`${bedrooms} bedrooms`);
      if (bathrooms) features.push(`${bathrooms} bathrooms`);
      if (area) features.push(`${area.value} ${area.unit}`);
      if (propertyFeatures) features.push(...propertyFeatures);
    }
    
    if (product.serviceDetails) {
      const { duration, location, requirements } = product.serviceDetails;
      if (duration) features.push(`${duration.value} ${duration.unit} duration`);
      if (location) features.push(`${location} service`);
      if (requirements) features.push(...requirements);
    }
    
    return features;
  };

  // Helper function to extract specifications from product
  const extractSpecifications = (product) => {
    const specs = {};
    
    if (product.specifications && product.specifications.length > 0) {
      product.specifications.forEach(spec => {
        specs[spec.name] = spec.value;
      });
    }
    
    if (product.realEstateDetails) {
      const { area, floors, parkingSpaces, yearBuilt } = product.realEstateDetails;
      if (area) specs.area = `${area.value} ${area.unit}`;
      if (floors) specs.floors = floors.toString();
      if (parkingSpaces) specs.parking = `${parkingSpaces} spaces`;
      if (yearBuilt) specs.yearBuilt = yearBuilt.toString();
    }
    
    return specs;
  };

  // Helper function to determine priority based on product data
  const determinePriority = (product) => {
    if (product.isFeatured || product.isPromoted) return 'high';
    if (product.pricing.basePrice > 1000000) return 'high'; // High-value properties
    if (product.views > 100) return 'medium';
    return 'low';
  };

  const filterAndSortListings = () => {
    // Since filtering is now done server-side, just set the listings
    setFilteredListings(listings);
  };

  const handleListingAction = (action, listing, reason = '') => {
    const actions = {
      approve: {
        title: 'Approve Listing',
        message: `Are you sure you want to approve "${listing.title}"?`,
        confirmText: 'Approve',
        confirmVariant: 'primary'
      },
      reject: {
        title: 'Reject Listing',
        message: `Are you sure you want to reject "${listing.title}"?`,
        confirmText: 'Reject',
        confirmVariant: 'danger'
      },
      delete: {
        title: 'Delete Listing',
        message: `Are you sure you want to permanently delete "${listing.title}"? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmVariant: 'danger'
      }
    };

    setConfirmAction({
      show: true,
      type: action,
      listing,
      reason,
      ...actions[action]
    });
  };

  const executeListingAction = async () => {
    const { type, listing, reason } = confirmAction;
    
    try {
      let response;
      
      switch (type) {
        case 'approve':
          response = await api.put(`/products/${listing.id}`, { status: 'active' });
          break;
        case 'reject':
          response = await api.put(`/products/${listing.id}`, { 
            status: 'discontinued',
            rejectionReason: reason || 'No reason provided'
          });
          break;
        case 'delete':
          response = await api.delete(`/products/${listing.id}`);
          break;
        default:
          throw new Error('Invalid action type');
      }

      if (response.data.success) {
        // Update local state
        if (type === 'delete') {
          setListings(prev => prev.filter(l => l.id !== listing.id));
        } else {
          setListings(prev => prev.map(l => {
            if (l.id === listing.id) {
              switch (type) {
                case 'approve':
                  return { 
                    ...l, 
                    status: 'approved',
                    approvedAt: new Date(),
                    approvedBy: 'Current Admin'
                  };
                case 'reject':
                  return { 
                    ...l, 
                    status: 'rejected',
                    rejectedAt: new Date(),
                    rejectedBy: 'Current Admin',
                    rejectionReason: reason || 'No reason provided'
                  };
                default:
                  return l;
              }
            }
            return l;
          }));
        }

        toast.success(response.data.message || `Listing ${type}d successfully`);
      } else {
        throw new Error(response.data.message || `Failed to ${type} listing`);
      }
    } catch (error) {
      console.error('Error executing listing action:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Failed to ${type} listing. Please try again.`);
      }
    } finally {
      setConfirmAction({ show: false, type: '', listing: null });
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedListings.length === 0) {
      toast.error('Please select listings first');
      return;
    }

    try {
      const bulkUpdatePromises = selectedListings.map(listingId => {
        const updateData = action === 'approve' 
          ? { status: 'active' }
          : { status: 'discontinued', rejectionReason: 'Bulk rejection' };
        
        return api.put(`/products/${listingId}`, updateData);
      });

      await Promise.all(bulkUpdatePromises);
      
      setListings(prev => prev.map(listing => {
        if (selectedListings.includes(listing.id)) {
          switch (action) {
            case 'approve':
              return { 
                ...listing, 
                status: 'approved',
                approvedAt: new Date(),
                approvedBy: 'Current Admin'
              };
            case 'reject':
              return { 
                ...listing, 
                status: 'rejected',
                rejectedAt: new Date(),
                rejectedBy: 'Current Admin',
                rejectionReason: 'Bulk rejection'
              };
            default:
              return listing;
          }
        }
        return listing;
      }));

      setSelectedListings([]);
      setShowBulkActions(false);
      toast.success(`${selectedListings.length} listings ${action}d successfully`);
    } catch (error) {
      console.error('Error executing bulk action:', error);
      toast.error(`Failed to ${action} listings`);
    }
  };

  const exportListings = async () => {
    try {
      const response = await api.get('/products/export', {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'listings.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Listings exported successfully');
    } catch (error) {
      console.error('Error exporting listings:', error);
      toast.error('Failed to export listings');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      approved: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
    };
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority] || colors.medium;
  };

  const statusCounts = {
    all: pagination.totalProducts,
    pending: listings.filter(l => l.status === 'pending').length,
    approved: listings.filter(l => l.status === 'approved').length,
    rejected: listings.filter(l => l.status === 'rejected').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading listings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Listing Moderation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and moderate user-submitted listings
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {selectedListings.length > 0 && (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedListings.length} selected
              </span>
              <Button
                size="sm"
                onClick={() => setShowBulkActions(!showBulkActions)}
              >
                Bulk Actions
              </Button>
            </>
          )}
          <Button
            onClick={exportListings}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && selectedListings.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Bulk Actions for {selectedListings.length} listings:
              </span>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                  leftIcon={<CheckIcon className="h-4 w-4" />}
                >
                  Approve All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('reject')}
                  leftIcon={<XMarkIcon className="h-4 w-4" />}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Reject All
                </Button>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedListings([]);
                setShowBulkActions(false);
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {status === 'all' ? 'Total Listings' : `${status} Listings`}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {count}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                status === 'pending' ? 'bg-yellow-500' :
                status === 'approved' ? 'bg-green-500' :
                status === 'rejected' ? 'bg-red-500' :
                'bg-blue-500'
              }`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by title, description, seller, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Types</option>
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
              <option value="service">Service</option>
              <option value="real-estate">Real Estate</option>
              <option value="rental">Rental</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredListings.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedListings.includes(listing.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedListings(prev => [...prev, listing.id]);
                      } else {
                        setSelectedListings(prev => prev.filter(id => id !== listing.id));
                      }
                    }}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />

                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {listing.title}
                          </h3>
                          
                          {/* Priority Indicator */}
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(listing.priority)}`} title={`${listing.priority} priority`}></div>
                          
                          {/* Flagged Indicator */}
                          {listing.flagged && (
                            <ExclamationTriangleIcon 
                              className="h-5 w-5 text-red-500" 
                              title={listing.flagReason || 'This listing has been flagged'}
                            />
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {listing.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {formatCurrency(listing.price, listing.currency)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <MapPinIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {listing.location.city}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {listing.seller.name}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {formatRelativeTime(listing.submittedAt)}
                            </span>
                          </div>
                        </div>

                        {/* Status and Additional Info */}
                        <div className="flex items-center space-x-4 mt-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                          </span>

                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {listing.type}
                          </span>

                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                            {listing.category}
                          </span>

                          {listing.seller.verified && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                              Verified Seller
                            </span>
                          )}

                          {listing.views > 0 && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                              {listing.views} views
                            </span>
                          )}
                        </div>

                        {/* Rejection/Approval Info */}
                        {listing.status === 'rejected' && listing.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-200">
                              <span className="font-medium">Rejected:</span> {listing.rejectionReason}
                            </p>
                          </div>
                        )}

                        {listing.status === 'approved' && listing.approvedBy && (
                          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              Approved by {listing.approvedBy} • {formatRelativeTime(listing.approvedAt)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedListing(listing)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>

                        {listing.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleListingAction('approve', listing)}
                              className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                              title="Approve listing"
                            >
                              <CheckIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleListingAction('reject', listing)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Reject listing"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No listings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{((pagination.currentPage - 1) * 20) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * 20, pagination.totalProducts)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalProducts}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Listing Details Modal */}
      {selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onListingAction={handleListingAction}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmAction.show}
        onClose={() => setConfirmAction({ show: false, type: '', listing: null })}
        onConfirm={executeListingAction}
        title={confirmAction.title}
        message={confirmAction.message}
        confirmText={confirmAction.confirmText}
        confirmVariant={confirmAction.confirmVariant}
      />
    </div>
  );
};

export default ListingModeration;