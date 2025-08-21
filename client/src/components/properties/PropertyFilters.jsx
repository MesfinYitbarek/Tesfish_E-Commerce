import { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ETHIOPIAN_CITIES } from '../../constants';
import { formatCurrency } from '../../utils/helpers';

const PropertyFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleFeatureToggle = (feature) => {
    const currentFeatures = filters.features || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    
    handleFilterChange('features', updatedFeatures);
  };

  const propertyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'house', label: 'House' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
    { value: 'office', label: 'Office' }
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All Properties' },
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' }
  ];

  const commonFeatures = [
    'Parking', 'Security', 'Generator', 'Elevator', 'Garden', 'Pool', 
    'Gym', 'Balcony', 'Furnished', 'Air Conditioning', 'Internet', 'Water Tank'
  ];

  const priceRanges = [
    { min: '', max: '', label: 'Any Price' },
    { min: '0', max: '1000000', label: 'Under 1M ETB' },
    { min: '1000000', max: '3000000', label: '1M - 3M ETB' },
    { min: '3000000', max: '5000000', label: '3M - 5M ETB' },
    { min: '5000000', max: '10000000', label: '5M - 10M ETB' },
    { min: '10000000', max: '', label: 'Over 10M ETB' }
  ];

  const bedroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ];

  const bathroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Filters
        </h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <Input
            placeholder="Search properties..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
          >
            <option value="">All Locations</option>
            {ETHIOPIAN_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
          >
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price Range
          </label>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                  onChange={() => {
                    handleFilterChange('minPrice', range.min);
                    handleFilterChange('maxPrice', range.max);
                  }}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
          
          {/* Custom Price Range */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Range</p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
              />
              <Input
                placeholder="Max price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bedrooms
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            >
              {bedroomOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bathrooms
            </label>
            <select
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            >
              {bathroomOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Area Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Area (sqm)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min area"
              type="number"
              value={filters.minArea}
              onChange={(e) => handleFilterChange('minArea', e.target.value)}
            />
            <Input
              placeholder="Max area"
              type="number"
              value={filters.maxArea}
              onChange={(e) => handleFilterChange('maxArea', e.target.value)}
            />
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:underline"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4" />
          <span className="text-sm">
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </span>
        </button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            {/* Availability Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
              >
                {availabilityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Verified Sellers Only */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Verified sellers only
                </span>
              </label>
            </div>

            {/* Features & Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Features & Amenities
              </label>
              <div className="grid grid-cols-1 gap-2">
                {commonFeatures.map(feature => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {(filters.query || filters.location || filters.type !== 'all' || filters.minPrice || filters.maxPrice || filters.features.length > 0) && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Active Filters
            </h4>
            <div className="flex flex-wrap gap-2">
              {filters.query && (
                <span className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 text-xs rounded-full">
                  Search: {filters.query}
                  <button
                    onClick={() => handleFilterChange('query', '')}
                    className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.location && (
                <span className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 text-xs rounded-full">
                  {filters.location}
                  <button
                    onClick={() => handleFilterChange('location', '')}
                    className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.type !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 text-xs rounded-full">
                  {filters.type}
                  <button
                    onClick={() => handleFilterChange('type', 'all')}
                    className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 text-xs rounded-full">
                  {filters.minPrice && filters.maxPrice 
                    ? `${formatCurrency(filters.minPrice, 'ETB', {compact: true})} - ${formatCurrency(filters.maxPrice, 'ETB', {compact: true})}`
                    : filters.minPrice 
                      ? `From ${formatCurrency(filters.minPrice, 'ETB', {compact: true})}`
                      : `Up to ${formatCurrency(filters.maxPrice, 'ETB', {compact: true})}`
                  }
                  <button
                    onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }}
                    className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.features.map(feature => (
                <span key={feature} className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 text-xs rounded-full">
                  {feature}
                  <button
                    onClick={() => handleFeatureToggle(feature)}
                    className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;