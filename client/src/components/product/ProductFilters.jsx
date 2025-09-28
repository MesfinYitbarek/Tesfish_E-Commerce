// components/product/ProductFilters.jsx - Compact Design with Subtypes
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

  const productTypes = {
    homes: {
      label: 'Homes',
      subTypes: [
        { value: 'houses', label: 'Houses' },
        { value: 'apartment', label: 'Apartments' },
        { value: 'villas', label: 'Villas' },
        { value: 'condos', label: 'Condos' },
        { value: 'townhouses', label: 'Townhouses' }
      ]
    },
    plots: {
      label: 'Land & Plots',
      subTypes: [
        { value: 'residential-land', label: 'Residential' },
        { value: 'commercial-land', label: 'Commercial' },
        { value: 'mixed-use-land', label: 'Mixed Use' },
        { value: 'agricultural-land', label: 'Agricultural' }
      ]
    },
    commercials: {
      label: 'Commercial',
      subTypes: [
        { value: 'offices', label: 'Offices' },
        { value: 'warehouses', label: 'Warehouses' },
        { value: 'shops', label: 'Shops' },
        { value: 'buildings', label: 'Buildings' },
        { value: 'factories', label: 'Factories' },
        { value: 'hotels', label: 'Hotels' }
      ]
    },
    minerals: {
      label: 'minerals',
      icon: <TagIcon className="h-4 w-4" />,
      subTypes: [
        { value: 'gold', label: 'Gold' },
        { value: 'industrial-minerals', label: 'Industrial Minerals' },
        { value: 'metallic-minerals', label: 'Metallic Minerals' },
        { value: 'gemstones', label: 'Gemstones' },
      ]
    },
    others: {
      label: 'Others',
      subTypes: [
        { value: 'vehicles', label: 'Vehicles' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'furnitures', label: 'Furniture' },
        { value: 'construction-equipment', label: 'Equipment' },
        { value: 'agricultural-products', label: 'Agriculture' }
      ]
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    // If changing main product type, clear subtype
    if (key === 'productType') {
      onFilterChange({
        [key]: value,
        subProductType: '' // Clear subtype when main type changes
      });
    } else {
      onFilterChange({ [key]: value });
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value =>
      value && value !== '' && value !== 'all'
    ).length;
  };

  // Simplified property types for mobile
  const propertyTypeOptions = [
    { value: 'homes', label: 'Homes', icon: <HomeIcon className="h-3 w-3" /> },
    { value: 'plots', label: 'Plots', icon: <MapPinIcon className="h-3 w-3" /> },
    { value: 'commercials', label: 'Commercial', icon: <BuildingOfficeIcon className="h-3 w-3" /> },
    { value: 'minerals', label: 'Minerals', icon: <TagIcon className="h-3 w-3" /> },
    { value: 'others', label: 'Others', icon: <TagIcon className="h-3 w-3" /> }
  ];

  const priceRanges = [
    { label: 'Under 1M', min: 0, max: 1000000 },
    { label: '1M - 5M', min: 1000000, max: 5000000 },
    { label: '5M - 10M', min: 5000000, max: 10000000 },
    { label: '10M+', min: 10000000, max: null }
  ];

  const popularCities = ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Mekelle', 'Adama', 'Awasa'];

  // Get current subtypes based on selected main type
  const currentSubTypes = filters.productType ? productTypes[filters.productType]?.subTypes || [] : [];

  return (
    <div className={`bg-white dark:bg-gray-900 ${!isMobile ? 'rounded-lg shadow-lg border border-gray-200 dark:border-gray-800' : ''}`}>
      {/* Header - Desktop only */}
      {!isMobile && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h3>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={onClearFilters}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Clear ({getActiveFiltersCount()})
              </button>
            )}
          </div>
        </div>
      )}

      <div className="p-2 space-y-2">
        {/* Property Type */}
        <FilterSection
          title="Property Type"
          isExpanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
        >
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              {propertyTypeOptions.map((option) => (
                <FilterButton
                  key={option.value}
                  active={filters.productType === option.value}
                  onClick={() => handleFilterChange('productType', option.value)}
                  className="text-center p-1.5"
                >
                  <div className="flex flex-col items-center space-y-0.5">
                    {option.icon}
                    <span className="text-xs font-medium">{option.label}</span>
                  </div>
                </FilterButton>
              ))}
            </div>

            {/* Subtypes */}
            {filters.productType && currentSubTypes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="mb-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {productTypes[filters.productType]?.label} Type:
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <FilterButton
                    active={!filters.subProductType}
                    onClick={() => handleFilterChange('subProductType', '')}
                    className="text-center text-xs"
                  >
                    All
                  </FilterButton>
                  {currentSubTypes.map((subType) => (
                    <FilterButton
                      key={subType.value}
                      active={filters.subProductType === subType.value}
                      onClick={() => handleFilterChange('subProductType', subType.value)}
                      className="text-center text-xs"
                    >
                      {subType.label}
                    </FilterButton>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </FilterSection>

        {/* Listing Type */}
        <FilterSection
          title="Listing Type"
          isExpanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
        >
          <div className="grid grid-cols-2 gap-1.5">
            <FilterButton
              active={filters.listingType === 'sell'}
              onClick={() => handleFilterChange('listingType', 'sell')}
              className="text-center text-xs"
            >
              For Sale
            </FilterButton>
            <FilterButton
              active={filters.listingType === 'rent'}
              onClick={() => handleFilterChange('listingType', 'rent')}
              className="text-center text-xs"
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
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              {priceRanges.map((range, index) => (
                <FilterButton
                  key={index}
                  active={
                    filters.minPrice == range.min &&
                    (range.max === null ? !filters.maxPrice : filters.maxPrice == range.max)
                  }
                  onClick={() => onFilterChange({ minPrice: range.min, maxPrice: range.max })}
                  className="text-center text-xs p-1"
                >
                  {range.label}
                </FilterButton>
              ))}
            </div>

            {/* Custom Range */}
            <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search city..."
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />

            <div className="grid grid-cols-2 gap-1">
              {popularCities.map((city) => (
                <FilterButton
                  key={city}
                  active={filters.city === city}
                  onClick={() => handleFilterChange('city', city)}
                  className="text-center text-xs p-1"
                >
                  {city}
                </FilterButton>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Property Features - Only for real estate */}
        {filters.productType && ['homes', 'plots', 'commercials'].includes(filters.productType) && (
          <FilterSection
            title="Features"
            isExpanded={expandedSections.features}
            onToggle={() => toggleSection('features')}
          >
            <div className="space-y-2">
              {/* Bedrooms - Only for homes */}
              {filters.productType === 'homes' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bedrooms
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {['1', '2', '3', '4', '5+'].map((bed) => (
                      <FilterButton
                        key={bed}
                        active={filters.bedrooms === bed.replace('+', '')}
                        onClick={() => handleFilterChange('bedrooms', bed.replace('+', ''))}
                        className="text-center text-xs p-1"
                      >
                        {bed}
                      </FilterButton>
                    ))}
                  </div>
                </div>
              )}

              {/* Bathrooms - Only for homes */}
              {filters.productType === 'homes' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bathrooms
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {['1', '2', '3', '4+'].map((bath) => (
                      <FilterButton
                        key={bath}
                        active={filters.bathrooms === bath.replace('+', '')}
                        onClick={() => handleFilterChange('bathrooms', bath.replace('+', ''))}
                        className="text-center text-xs p-1"
                      >
                        {bath}
                      </FilterButton>
                    ))}
                  </div>
                </div>
              )}

              {/* Area - For plots and homes */}
              {(filters.productType === 'plots' || filters.productType === 'homes') && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Area (sqm)
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="number"
                      placeholder="Min area"
                      value={filters.minArea || ''}
                      onChange={(e) => handleFilterChange('minArea', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-1 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max area"
                      value={filters.maxArea || ''}
                      onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </FilterSection>
        )}

        {/* Condition - For others category */}
        {filters.productType === 'others' && (
          <FilterSection
            title="Condition"
            isExpanded={expandedSections.features}
            onToggle={() => toggleSection('features')}
          >
            <div className="grid grid-cols-2 gap-1">
              {['new', 'like-new', 'good', 'fair', 'poor'].map((condition) => (
                <FilterButton
                  key={condition}
                  active={filters.condition === condition}
                  onClick={() => handleFilterChange('condition', condition)}
                  className="text-center text-xs p-1 capitalize"
                >
                  {condition.replace('-', ' ')}
                </FilterButton>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-1">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === '' || value === 'all') return null;

                let displayValue = value;
                if (key === 'subProductType' && filters.productType) {
                  const subType = productTypes[filters.productType]?.subTypes?.find(st => st.value === value);
                  displayValue = subType?.label || value;
                } else if (key === 'productType') {
                  displayValue = propertyTypeOptions.find(p => p.value === value)?.label || value;
                }

                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 py-0.5 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                  >
                    {displayValue}
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Clear Button */}
        {isMobile && getActiveFiltersCount() > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClearFilters}
              className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-xs"
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
    <div className="border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </span>
        <ChevronDownIcon className={`h-3 w-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
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
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
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
      className={`px-1.5 py-1 rounded transition-all text-xs ${active
          ? 'bg-primary-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        } ${className}`}
    >
      {children}
    </button>
  );
};

export default ProductFilters;