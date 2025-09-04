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
  TagIcon
} from '@heroicons/react/24/outline';

const ProductFilters = ({ 
  filters, 
  categories, 
  propertyTypes, 
  aggregatedFilters,
  onFilterChange, 
  onClearFilters,
  isMobile = false
}) => {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    price: true,
    location: false,
    features: false
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

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value && value !== '' && value !== 'all'
    ).length;
  };

  // Simplified property types for mobile
  const propertyTypeOptions = [
    { value: 'homes', label: 'Homes', icon: <HomeIcon className="h-4 w-4" /> },
    { value: 'plots', label: 'Plots', icon: <MapPinIcon className="h-4 w-4" /> },
    { value: 'commercials', label: 'Commercial', icon: <BuildingOfficeIcon className="h-4 w-4" /> },
    { value: 'others', label: 'Others', icon: <TagIcon className="h-4 w-4" /> }
  ];

  const priceRanges = [
    { label: 'Under 1M', min: 0, max: 1000000 },
    { label: '1M - 5M', min: 1000000, max: 5000000 },
    { label: '5M - 10M', min: 5000000, max: 10000000 },
    { label: '10M+', min: 10000000, max: null }
  ];

  const popularCities = ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Mekelle', 'Adama', 'Awasa'];

  return (
    <div className={`bg-white dark:bg-gray-900 ${!isMobile ? 'rounded-xl shadow-lg border border-gray-200 dark:border-gray-800' : ''}`}>
      {/* Header - Desktop only */}
      {!isMobile && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h3>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={onClearFilters}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Clear all ({getActiveFiltersCount()})
              </button>
            )}
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Property Type */}
        <FilterSection
          title="Property Type"
          isExpanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
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
                  {option.icon}
                  <span className="text-xs font-medium">{option.label}</span>
                </div>
              </FilterButton>
            ))}
          </div>
        </FilterSection>

        {/* Listing Type */}
        <FilterSection
          title="Listing Type"
          isExpanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
        >
          <div className="grid grid-cols-2 gap-2">
            <FilterButton
              active={filters.listingType === 'sell'}
              onClick={() => handleFilterChange('listingType', 'sell')}
              className="text-center"
            >
              For Sale
            </FilterButton>
            <FilterButton
              active={filters.listingType === 'rent'}
              onClick={() => handleFilterChange('listingType', 'rent')}
              className="text-center"
            >
              For Rent
            </FilterButton>
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map((range, index) => (
                <FilterButton
                  key={index}
                  active={
                    filters.minPrice == range.min && 
                    (range.max === null ? !filters.maxPrice : filters.maxPrice == range.max)
                  }
                  onClick={() => onFilterChange({ minPrice: range.min, maxPrice: range.max })}
                  className="text-center text-sm"
                >
                  {range.label}
                </FilterButton>
              ))}
            </div>
            
            {/* Custom Range */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection
          title="Location"
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search city..."
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            
            <div className="grid grid-cols-2 gap-2">
              {popularCities.map((city) => (
                <FilterButton
                  key={city}
                  active={filters.city === city}
                  onClick={() => handleFilterChange('city', city)}
                  className="text-center text-sm"
                >
                  {city}
                </FilterButton>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Property Features */}
        <FilterSection
          title="Features"
          isExpanded={expandedSections.features}
          onToggle={() => toggleSection('features')}
        >
          <div className="space-y-4">
            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bedrooms
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['1', '2', '3', '4', '5+'].map((bed) => (
                  <FilterButton
                    key={bed}
                    active={filters.bedrooms === bed.replace('+', '')}
                    onClick={() => handleFilterChange('bedrooms', bed.replace('+', ''))}
                    className="text-center text-sm"
                  >
                    {bed}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bathrooms
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['1', '2', '3', '4+'].map((bath) => (
                  <FilterButton
                    key={bath}
                    active={filters.bathrooms === bath.replace('+', '')}
                    onClick={() => handleFilterChange('bathrooms', bath.replace('+', ''))}
                    className="text-center text-sm"
                  >
                    {bath}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Mobile Clear Button */}
        {isMobile && getActiveFiltersCount() > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClearFilters}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
            >
              Clear All Filters ({getActiveFiltersCount()})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Simplified Filter Section Component
const FilterSection = ({ title, isExpanded, onToggle, children }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </span>
        <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
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

// Simplified Filter Button Component
const FilterButton = ({ active, onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg transition-all text-base ${
        active
          ? 'bg-primary-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default ProductFilters;