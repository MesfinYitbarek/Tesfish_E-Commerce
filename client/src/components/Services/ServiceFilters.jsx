import { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  BriefcaseIcon,
  PaintBrushIcon,
  CogIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ETHIOPIAN_CITIES } from '../../constants';
import { formatCurrency } from '../../utils/helpers';

const ServiceFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const serviceTypes = [
    { 
      value: '', 
      label: 'All Services',
      icon: WrenchScrewdriverIcon,
      description: 'All service categories'
    },
    { 
      value: 'project-management', 
      label: 'Project Management',
      icon: BriefcaseIcon,
      description: 'Construction & project oversight'
    },
    { 
      value: 'engineering-design', 
      label: 'Engineering & Design',
      icon: CogIcon,
      description: 'Structural & technical design'
    },
    { 
      value: 'interior-design', 
      label: 'Interior Design',
      icon: PaintBrushIcon,
      description: 'Space planning & decoration'
    },
    { 
      value: 'consultancy', 
      label: 'Consultancy',
      icon: UserIcon,
      description: 'Professional consultation'
    },
    { 
      value: 'construction', 
      label: 'Construction',
      icon: BuildingOfficeIcon,
      description: 'Building & construction services'
    }
  ];

  const priceRanges = [
    { min: '', max: '', label: 'Any Price' },
    { min: '0', max: '10000', label: 'Under 10K ETB' },
    { min: '10000', max: '50000', label: '10K - 50K ETB' },
    { min: '50000', max: '100000', label: '50K - 100K ETB' },
    { min: '100000', max: '500000', label: '100K - 500K ETB' },
    { min: '500000', max: '', label: 'Over 500K ETB' }
  ];

  const locationTypes = [
    { value: '', label: 'Any Location' },
    { value: 'on-site', label: 'On-site' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const durationOptions = [
    { value: '', label: 'Any Duration' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' }
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
            Search Services
          </label>
          <Input
            placeholder="Search for services..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
          />
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Service Type
          </label>
          <div className="space-y-2">
            {serviceTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <label key={type.value} className="flex items-start cursor-pointer group">
                  <input
                    type="radio"
                    name="serviceType"
                    value={type.value}
                    checked={filters.serviceType === type.value}
                    onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                    className="mt-1 mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20 transition-colors">
                      <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {type.label}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City/Location
          </label>
          <select
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
          >
            <option value="">All Locations</option>
            {ETHIOPIAN_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
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
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
              />
              <Input
                placeholder="Max price"
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
              />
            </div>
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
            {/* Service Location Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Location
              </label>
              <select
                value={filters.serviceLocation || ''}
                onChange={(e) => handleFilterChange('serviceLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
              >
                {locationTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration Type
              </label>
              <select
                value={filters.duration || ''}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
              >
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Verified Providers Only */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.verified || false}
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Verified providers only
                </span>
              </label>
            </div>

            {/* Featured Services Only */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featured || false}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Featured services only
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {Object.values(filters).some(v => v && v !== 'service') && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Active Filters
            </h4>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 text-xs rounded-full">
                  Search: {filters.search}
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.serviceType && (
                <span className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 text-xs rounded-full">
                  {serviceTypes.find(t => t.value === filters.serviceType)?.label}
                  <button
                    onClick={() => handleFilterChange('serviceType', '')}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceFilters;