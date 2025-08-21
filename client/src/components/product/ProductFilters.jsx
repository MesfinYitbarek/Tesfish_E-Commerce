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
  FireIcon
} from '@heroicons/react/24/outline';
import { PROPERTY_TYPES, PRICE_RANGES } from '../../constants';

const ProductFilters = ({ filters, categories, onFilterChange, onClearFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    location: true,
    propertyType: true,
    features: false,
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
    if (range.min !== null) onFilterChange({ minPrice: range.min });
    if (range.max !== null) onFilterChange({ maxPrice: range.max });
  };

  const clearSpecificFilter = (key) => {
    onFilterChange({ [key]: '' });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length;
  };

  const popularLocations = [
    { name: 'Addis Ababa', count: 2840, trending: true },
    { name: 'Bole', count: 850, trending: true },
    { name: 'Kazanchis', count: 420, trending: false },
    { name: 'Kirkos', count: 310, trending: false },
    { name: 'Piazza', count: 200, trending: false },
    { name: 'Megenagna', count: 180, trending: true },
    { name: 'CMC', count: 160, trending: false },
    { name: 'Old Airport', count: 140, trending: false }
  ];

  const bedroomOptions = [
    { value: '1', label: '1 Bedroom', count: 120 },
    { value: '2', label: '2 Bedrooms', count: 340 },
    { value: '3', label: '3 Bedrooms', count: 280 },
    { value: '4', label: '4 Bedrooms', count: 150 },
    { value: '5', label: '5+ Bedrooms', count: 80 },
  ];

  const bathroomOptions = [
    { value: '1', label: '1 Bathroom', count: 200 },
    { value: '2', label: '2 Bathrooms', count: 450 },
    { value: '3', label: '3 Bathrooms', count: 250 },
    { value: '4', label: '4+ Bathrooms', count: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="h-3 w-3 text-white" />
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
        {/* Category Filter */}
        <FilterSection
          title="Category"
          icon={BuildingOfficeIcon}
          isExpanded={expandedSections.category}
          onToggle={() => toggleSection('category')}
          count={categories.length}
        >
          <div className="space-y-1">
            <FilterButton
              active={!filters.category}
              onClick={() => handleFilterChange('category', '')}
              icon={SparklesIcon}
            >
              <div className="flex justify-between items-center w-full">
                <span>All Categories</span>
                <span className="text-xs text-gray-400">All</span>
              </div>
            </FilterButton>
            {categories.map((category) => (
              <FilterButton
                key={category._id}
                active={filters.category === category.slug}
                onClick={() => handleFilterChange('category', category.slug)}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="capitalize">{category.name}</span>
                  {category.productCount && (
                    <span className="text-xs text-gray-400">
                      {category.productCount}
                    </span>
                  )}
                </div>
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
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Popular Ranges
              </div>
              {PRICE_RANGES.map((range, index) => (
                <FilterButton
                  key={index}
                  active={filters.minPrice == range.min && filters.maxPrice == range.max}
                  onClick={() => handlePriceRangeChange(range)}
                >
                  {range.label}
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
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
                placeholder="Search location..."
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 pl-8 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
              <MapPinIcon className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
            </div>
            
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Popular Locations
              </div>
              {popularLocations.map((location) => (
                <FilterButton
                  key={location.name}
                  active={filters.location === location.name}
                  onClick={() => handleFilterChange('location', location.name)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-1">
                      <span>{location.name}</span>
                      {location.trending && (
                        <FireIcon className="h-2 w-2 text-orange-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{location.count}</span>
                  </div>
                </FilterButton>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Property Type Filter */}
        {(filters.category === 'real-estate' || !filters.category) && (
          <FilterSection
            title="Property Type"
            icon={HomeIcon}
            isExpanded={expandedSections.propertyType}
            onToggle={() => toggleSection('propertyType')}
          >
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(PROPERTY_TYPES).map(([key, value]) => (
                <FilterButton
                  key={key}
                  active={filters.propertyType === value}
                  onClick={() => handleFilterChange('propertyType', value)}
                  className="text-center"
                >
                  <span className="capitalize text-xs">{value.replace('-', ' ')}</span>
                </FilterButton>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Property Features */}
        {(filters.category === 'real-estate' || !filters.category) && (
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
                <div className="grid grid-cols-2 gap-1">
                  {bedroomOptions.map((option) => (
                    <FilterButton
                      key={option.value}
                      active={filters.bedrooms === option.value}
                      onClick={() => handleFilterChange('bedrooms', option.value)}
                      className="text-center"
                    >
                      <div>
                        <div className="text-xs font-medium">{option.label.split(' ')[0]}</div>
                        <div className="text-xs text-gray-400">{option.count}</div>
                      </div>
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bathrooms
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {bathroomOptions.map((option) => (
                    <FilterButton
                      key={option.value}
                      active={filters.bathrooms === option.value}
                      onClick={() => handleFilterChange('bathrooms', option.value)}
                      className="text-center"
                    >
                      <div>
                        <div className="text-xs font-medium">{option.label.split(' ')[0]}</div>
                        <div className="text-xs text-gray-400">{option.count}</div>
                      </div>
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Listing Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Listing Type
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <FilterButton
                    active={filters.type === 'sale'}
                    onClick={() => handleFilterChange('type', 'sale')}
                    className="text-center"
                  >
                    <div>
                      <div className="text-xs font-medium">For Sale</div>
                      <div className="text-xs text-gray-400">Own it</div>
                    </div>
                  </FilterButton>
                  <FilterButton
                    active={filters.type === 'rental'}
                    onClick={() => handleFilterChange('type', 'rental')}
                    className="text-center"
                  >
                    <div>
                      <div className="text-xs font-medium">For Rent</div>
                      <div className="text-xs text-gray-400">Lease it</div>
                    </div>
                  </FilterButton>
                </div>
              </div>
            </div>
          </FilterSection>
        )}

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Active Filters ({getActiveFiltersCount()})
            </div>
            <div className="space-y-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === '') return null;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <span className="text-xs text-blue-700 dark:text-blue-300 font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                    </span>
                    <button
                      onClick={() => clearSpecificFilter(key)}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
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
        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          {Icon && (
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
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
const FilterButton = ({ active, onClick, children, icon: Icon, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
      } ${className}`}
    >
      <div className="flex items-center space-x-1">
        {Icon && <Icon className="h-3 w-3" />}
        <div className="flex-1 text-xs">{children}</div>
      </div>
    </motion.button>
  );
};

export default ProductFilters;