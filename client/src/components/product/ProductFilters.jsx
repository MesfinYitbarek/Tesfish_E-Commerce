// components/product/ProductFilters.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  TagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const ProductFilters = ({ 
  filters, 
  categories, 
  propertyTypes, 
  aggregatedFilters,
  onFilterChange, 
  onClearFilters 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    location: true,
    propertyType: true,
    features: false,
    condition: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handlePriceRangeChange = (range) => {
    const updates = {};
    if (range.min !== null && range.min !== undefined) updates.minPrice = range.min;
    if (range.max !== null && range.max !== undefined) updates.maxPrice = range.max;
    onFilterChange(updates);
  };

  const clearSpecificFilter = (key) => {
    onFilterChange({ [key]: '' });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value && value !== '' && value !== 'all'
    ).length;
  };

  // Property type options with icons
  const propertyTypeOptions = [
    { value: 'homes', label: 'Homes', icon: <HomeIcon className="h-4 w-4" />, count: aggregatedFilters?.propertyTypes?.find(p => p._id === 'homes')?.count || 0 },
    { value: 'plots', label: 'Plots', icon: <MapPinIcon className="h-4 w-4" />, count: aggregatedFilters?.propertyTypes?.find(p => p._id === 'plots')?.count || 0 },
    { value: 'commercials', label: 'Commercial', icon: <BuildingOfficeIcon className="h-4 w-4" />, count: aggregatedFilters?.propertyTypes?.find(p => p._id === 'commercials')?.count || 0 },
    { value: 'others', label: 'Others', icon: <TagIcon className="h-4 w-4" />, count: aggregatedFilters?.propertyTypes?.find(p => p._id === 'others')?.count || 0 }
  ];

  // Price ranges based on Ethiopian real estate market
  const priceRanges = [
    { label: 'Under 1M ETB', min: 0, max: 1000000 },
    { label: '1M - 5M ETB', min: 1000000, max: 5000000 },
    { label: '5M - 10M ETB', min: 5000000, max: 10000000 },
    { label: '10M - 25M ETB', min: 10000000, max: 25000000 },
    { label: '25M - 50M ETB', min: 25000000, max: 50000000 },
    { label: 'Above 50M ETB', min: 50000000, max: null }
  ];

  // Popular Ethiopian cities
  const popularCities = [
    'Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Mekelle', 
    'Adama', 'Awasa', 'Jimma', 'Dessie', 'Gondar', 'Harar'
  ];

  // Bedroom options
  const bedroomOptions = [
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5', label: '5+ Bedrooms' }
  ];

  // Bathroom options
  const bathroomOptions = [
    { value: '1', label: '1 Bathroom' },
    { value: '2', label: '2 Bathrooms' },
    { value: '3', label: '3 Bathrooms' },
    { value: '4', label: '4+ Bathrooms' }
  ];

  // Condition options
  const conditionOptions = [
    { value: 'new', label: 'Brand New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'needs-work', label: 'Needs Work' }
  ];

  // Listing type options
  const listingTypeOptions = [
    { value: 'sell', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <AdjustmentsHorizontalIcon className="h-3 w-3 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Filters
            </h3>
          </div>
          {getActiveFiltersCount() > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearFilters}
              className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="h-3 w-3" />
              <span>Clear all ({getActiveFiltersCount()})</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {/* Property Type Filter */}
        <FilterSection
          title="Property Type"
          icon={HomeIcon}
          isExpanded={expandedSections.propertyType}
          onToggle={() => toggleSection('propertyType')}
        >
          <div className="grid grid-cols-2 gap-2">
            {propertyTypeOptions.map((option) => (
              <FilterButton
                key={option.value}
                active={filters.productType === option.value}
                onClick={() => handleFilterChange('productType', option.value)}
                className="text-center p-3"
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className={`${
                    filters.productType === option.value
                      ? 'text-white'
                      : 'text-gray-400'
                  }`}>
                    {option.icon}
                  </div>
                  <span className="text-xs font-medium">{option.label}</span>
                  <span className="text-xs text-gray-400">{option.count}</span>
                </div>
              </FilterButton>
            ))}
          </div>
        </FilterSection>

        {/* Listing Type Filter */}
        <FilterSection
          title="Listing Type"
          icon={TagIcon}
          isExpanded={expandedSections.category}
          onToggle={() => toggleSection('category')}
        >
          <div className="grid grid-cols-2 gap-2">
            {listingTypeOptions.map((option) => (
              <FilterButton
                key={option.value}
                active={filters.listingType === option.value}
                onClick={() => handleFilterChange('listingType', option.value)}
                className="text-center"
              >
                <span className="text-sm font-medium">{option.label}</span>
              </FilterButton>
            ))}
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection
          title="Price Range"
          icon={CurrencyDollarIcon}
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-4">
            {/* Quick Price Ranges */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Popular Ranges
              </div>
              {priceRanges.map((range, index) => (
                <FilterButton
                  key={index}
                  active={
                    filters.minPrice == range.min && 
                    (range.max === null ? !filters.maxPrice : filters.maxPrice == range.max)
                  }
                  onClick={() => handlePriceRangeChange(range)}
                  className="w-full text-left"
                >
                  <span className="text-sm">{range.label}</span>
                </FilterButton>
              ))}
            </div>

            {/* Custom Price Range */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Custom Range (ETB)
              </label>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 text-base border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 text-base border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Location Filter */}
        <FilterSection
          title="Location"
          icon={MapPinIcon}
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
        >
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search city or area..."
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 pl-8 text-base border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
              <MapPinIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Popular Cities
              </div>
              {popularCities.map((city) => (
                <FilterButton
                  key={city}
                  active={filters.city === city}
                  onClick={() => handleFilterChange('city', city)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{city}</span>
                    {city === 'Addis Ababa' && (
                      <FireIcon className="h-3 w-3 text-orange-500" />
                    )}
                  </div>
                </FilterButton>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Property Features */}
        <FilterSection
          title="Property Features"
          icon={BoltIcon}
          isExpanded={expandedSections.features}
          onToggle={() => toggleSection('features')}
        >
          <div className="space-y-4">
            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Bedrooms
              </label>
              <div className="grid grid-cols-3 gap-2">
                {bedroomOptions.map((option) => (
                  <FilterButton
                    key={option.value}
                    active={filters.bedrooms === option.value}
                    onClick={() => handleFilterChange('bedrooms', option.value)}
                    className="text-center text-xs"
                  >
                    {option.value}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Bathrooms
              </label>
              <div className="grid grid-cols-2 gap-2">
                {bathroomOptions.map((option) => (
                  <FilterButton
                    key={option.value}
                    active={filters.bathrooms === option.value}
                    onClick={() => handleFilterChange('bathrooms', option.value)}
                    className="text-center text-xs"
                  >
                    {option.value}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Area Range */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Area (sqm)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min area"
                  value={filters.minArea || ''}
                  onChange={(e) => handleFilterChange('minArea', e.target.value)}
                  className="w-full px-3 py-2 text-base border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
                <input
                  type="number"
                  placeholder="Max area"
                  value={filters.maxArea || ''}
                  onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                  className="w-full px-3 py-2 text-base border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Furnishing Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Furnishing
              </label>
              <div className="grid grid-cols-2 gap-2">
                <FilterButton
                  active={filters.furnishingStatus === 'furnished'}
                  onClick={() => handleFilterChange('furnishingStatus', 'furnished')}
                  className="text-center text-xs"
                >
                  Furnished
                </FilterButton>
                <FilterButton
                  active={filters.furnishingStatus === 'unfurnished'}
                  onClick={() => handleFilterChange('furnishingStatus', 'unfurnished')}
                  className="text-center text-xs"
                >
                  Unfurnished
                </FilterButton>
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Condition Filter */}
        <FilterSection
          title="Condition"
          icon={SparklesIcon}
          isExpanded={expandedSections.condition}
          onToggle={() => toggleSection('condition')}
        >
          <div className="space-y-1">
            {conditionOptions.map((option) => (
              <FilterButton
                key={option.value}
                active={filters.condition === option.value}
                onClick={() => handleFilterChange('condition', option.value)}
                className="w-full text-left"
              >
                <span className="text-sm">{option.label}</span>
              </FilterButton>
            ))}
          </div>
        </FilterSection>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Active Filters ({getActiveFiltersCount()})
            </div>
            <div className="space-y-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === '' || value === 'all') return null;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                  >
                    <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                    </span>
                    <button
                      onClick={() => clearSpecificFilter(key)}
                      className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Filter Section Component
const FilterSection = ({ title, icon: Icon, isExpanded, onToggle, children, count }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <motion.button
        whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          {Icon && (
            <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon className="h-3 w-3 text-white" />
            </div>
          )}
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </span>
          {count && (
            <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Filter Button Component
const FilterButton = ({ active, onClick, children, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
      } ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default ProductFilters;