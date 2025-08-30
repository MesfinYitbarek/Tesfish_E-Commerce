import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ShareIcon,
  EyeIcon,
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  BuildingOfficeIcon,
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { fetchWishlist, toggleWishlist, setViewMode } from '../../store/slices/productSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/helpers';

const SavedProperties = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wishlistedItems, isLoading, error, viewMode } = useSelector(state => state.products);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [propertyToRemove, setPropertyToRemove] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  // Filter and sort properties with proper immutability handling
  const filteredProperties = useMemo(() => {
    if (!wishlistedItems || wishlistedItems.length === 0) return [];

    // Create a completely new array with new object references
    let filtered = wishlistedItems.map(property => ({
      ...property,
      // Ensure all nested objects are also copied
      pricing: property.pricing ? { ...property.pricing } : {},
      media: property.media ? { 
        ...property.media,
        images: property.media.images ? [...property.media.images] : []
      } : { images: [] },
      propertyDetails: property.propertyDetails ? {
        ...property.propertyDetails,
        location: property.propertyDetails.location ? { ...property.propertyDetails.location } : {}
      } : {}
    }));

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(query) ||
        property.propertyDetails?.location?.address?.toLowerCase().includes(query) ||
        property.propertyDetails?.location?.city?.toLowerCase().includes(query) ||
        property.fullAddress?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(property => 
        property.category === filterType || 
        property.propertyDetails?.propertyType === filterType
      );
    }

    // Sort using a non-mutating approach
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        case 'oldest':
          const dateA2 = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB2 = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA2 - dateB2;
        case 'price-low':
          const priceA = a.pricing?.basePrice || a.pricing?.salePrice || a.displayPrice || 0;
          const priceB = b.pricing?.basePrice || b.pricing?.salePrice || b.displayPrice || 0;
          return priceA - priceB;
        case 'price-high':
          const priceA2 = a.pricing?.basePrice || a.pricing?.salePrice || a.displayPrice || 0;
          const priceB2 = b.pricing?.basePrice || b.pricing?.salePrice || b.displayPrice || 0;
          return priceB2 - priceA2;
        case 'title':
          const titleA = a.title || '';
          const titleB = b.title || '';
          return titleA.localeCompare(titleB);
        default:
          return 0;
      }
    });

    return sorted;
  }, [wishlistedItems, searchQuery, filterType, sortBy]);

  const handleRemoveFromWishlist = async (propertyId) => {
    try {
      await dispatch(toggleWishlist(propertyId)).unwrap();
      setPropertyToRemove(null);
      setShowRemoveDialog(false);
      setSelectedProperties(prev => prev.filter(id => id !== propertyId));
      
      // Refresh the wishlist to get updated data
      dispatch(fetchWishlist());
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleBulkRemove = async () => {
    try {
      const removePromises = selectedProperties.map(propertyId => 
        dispatch(toggleWishlist(propertyId)).unwrap()
      );
      await Promise.all(removePromises);
      setSelectedProperties([]);
      
      // Refresh the wishlist to get updated data
      dispatch(fetchWishlist());
    } catch (error) {
      console.error('Error removing properties:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(p => p._id || p.id));
    }
  };

  const propertyTypes = useMemo(() => {
    if (!wishlistedItems) return [];
    
    const types = new Set();
    wishlistedItems.forEach(property => {
      if (property.category) types.add(property.category);
      if (property.propertyDetails?.propertyType) types.add(property.propertyDetails.propertyType);
    });
    return Array.from(types);
  }, [wishlistedItems]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <HeartIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Saved Properties
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchWishlist())}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Saved Properties
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Properties you've saved for later viewing ({filteredProperties.length} total)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => dispatch(setViewMode('grid'))}
              className={`px-3 py-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button
              onClick={() => dispatch(setViewMode('list'))}
              className={`px-3 py-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedProperties.length > 0 && (
            <Button
              variant="outline"
              onClick={handleBulkRemove}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Remove Selected ({selectedProperties.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search saved properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">A-Z</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-primary-50 border-primary-300 text-primary-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <FunnelIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} saved
            </span>
            
            {filteredProperties.length > 0 && (
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-600 dark:text-gray-400">Select All</span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading saved properties..." />
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredProperties.map(property => (
              <PropertyCard
                key={property._id || property.id}
                property={property}
                viewMode={viewMode}
                isSelected={selectedProperties.includes(property._id || property.id)}
                onSelect={(selected) => {
                  const propertyId = property._id || property.id;
                  if (selected) {
                    setSelectedProperties(prev => [...prev, propertyId]);
                  } else {
                    setSelectedProperties(prev => prev.filter(id => id !== propertyId));
                  }
                }}
                onRemove={() => {
                  setPropertyToRemove(property);
                  setShowRemoveDialog(true);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState searchQuery={searchQuery} />
        )}
      </div>

      {/* Remove Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRemoveDialog}
        onClose={() => {
          setShowRemoveDialog(false);
          setPropertyToRemove(null);
        }}
        onConfirm={() => handleRemoveFromWishlist(propertyToRemove?._id || propertyToRemove?.id)}
        title="Remove from Saved Properties"
        message={`Are you sure you want to remove "${propertyToRemove?.title}" from your saved properties?`}
        confirmText="Remove"
        confirmVariant="danger"
      />
    </div>
  );
};

// Property Card Component (same as before)
const PropertyCard = ({ property, viewMode, isSelected, onSelect, onRemove }) => {
  const propertyImage = property.media?.images?.find(img => img.isMain)?.url || 
                       property.media?.images?.[0]?.url;

  const propertyLocation = property.propertyDetails?.location?.address || 
                          property.propertyDetails?.location?.city || 
                          property.fullAddress ||
                          'Location not specified';

  const propertyPrice = property.pricing?.basePrice || property.pricing?.salePrice || property.displayPrice;
  const propertyType = property.propertyDetails?.propertyType || property.category;
  const bedrooms = property.propertyDetails?.bedrooms;
  const bathrooms = property.propertyDetails?.bathrooms;
  const area = property.propertyDetails?.area;

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-start space-x-6">
          {/* Checkbox */}
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          {/* Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {propertyImage ? (
                <img
                  src={propertyImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <HomeIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link
                  to={`/products/${property._id || property.id}`}
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {property.title}
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{propertyLocation}</span>
                </div>
                
                {propertyPrice && (
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                    {formatCurrency(propertyPrice, property.pricing?.currency || 'ETB')}
                  </p>
                )}

                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {propertyType && (
                    <span className="flex items-center space-x-1">
                      <TagIcon className="h-4 w-4" />
                      <span>{propertyType.replace('-', ' ')}</span>
                    </span>
                  )}
                  {bedrooms && (
                    <span>{bedrooms} bed{bedrooms > 1 ? 's' : ''}</span>
                  )}
                  {bathrooms && (
                    <span>{bathrooms} bath{bathrooms > 1 ? 's' : ''}</span>
                  )}
                  {area && (
                    <span>{area.value} {area.unit}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to={`/products/${property._id || property.id}`}
                  className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="View property"
                >
                  <EyeIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={onRemove}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  title="Remove from saved"
                >
                  <HeartSolidIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow relative">
      {/* Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 bg-white"
        />
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-800 rounded-full text-red-500 hover:text-red-600 transition-colors shadow-md"
        title="Remove from saved"
      >
        <HeartSolidIcon className="h-5 w-5" />
      </button>

      {/* Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {propertyImage ? (
          <img
            src={propertyImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HomeIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Property Type Badge */}
        {propertyType && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-full">
              {propertyType.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link
          to={`/products/${property._id || property.id}`}
          className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2"
        >
          {property.title}
        </Link>
        
        <div className="flex items-center space-x-1 mt-2">
          <MapPinIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{propertyLocation}</span>
        </div>

        {propertyPrice && (
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-3">
            {formatCurrency(propertyPrice, property.pricing?.currency || 'ETB')}
          </p>
        )}

        {/* Property Details */}
        <div className="flex items-center justify-between mt-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-3">
            {bedrooms && <span>{bedrooms} bed{bedrooms > 1 ? 's' : ''}</span>}
            {bathrooms && <span>{bathrooms} bath{bathrooms > 1 ? 's' : ''}</span>}
          </div>
          {area && (
            <span>{area.value} {area.unit}</span>
          )}
        </div>

        {/* Saved Date */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <CalendarIcon className="h-3 w-3" />
            <span>
              Saved {property.createdAt 
                ? formatDate(property.createdAt, { month: 'short', day: 'numeric' })
                : 'recently'
              }
            </span>
          </div>
          
          <Link
            to={`/products/${property._id || property.id}`}
            className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="View property"
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ searchQuery }) => {
  return (
    <div className="text-center py-12">
      <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {searchQuery ? 'No properties match your search' : 'No saved properties yet'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {searchQuery 
          ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
          : 'Start browsing properties and save your favorites to see them here.'
        }
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
        {searchQuery ? (
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Clear Search
          </Button>
        ) : (
          <Link to="/products">
            <Button>
              Browse Properties
            </Button>
          </Link>
        )}
        <Link to="/customer/dashboard">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SavedProperties;