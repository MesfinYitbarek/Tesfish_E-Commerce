// components/dashboard/ProductFilters.jsx
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const ProductFilters = ({ filters = {}, onFilterChange, onClose }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: 'all',
      productType: 'all',
      subProductType: 'all',
      listingType: 'all',
      sort: 'newest',
      dateRange: 'all',
      featured: false,
      priceRange: 'all',
      hasImages: false,
      hasDescription: false,
      recentActivity: false,
      needsAttention: false
    });
  };

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const priceRangeOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-100k', label: 'Under 100K ETB' },
    { value: '100k-500k', label: '100K - 500K ETB' },
    { value: '500k-1m', label: '500K - 1M ETB' },
    { value: '1m-5m', label: '1M - 5M ETB' },
    { value: '5m-10m', label: '5M - 10M ETB' },
    { value: 'over-10m', label: 'Over 10M ETB' }
  ];

  const subProductTypeOptions = {
    homes: [
      { value: 'all', label: 'All Homes' },
      { value: 'houses', label: 'Houses' },
      { value: 'apartment', label: 'Apartments' },
      { value: 'villas', label: 'Villas' },
      { value: 'condos', label: 'Condos' },
      { value: 'townhouses', label: 'Townhouses' }
    ],
    plots: [
      { value: 'all', label: 'All Plots' },
      { value: 'mixed-use-land', label: 'Mixed Use Land' },
      { value: 'residential-land', label: 'Residential Land' },
      { value: 'commercial-land', label: 'Commercial Land' },
      { value: 'agricultural-land', label: 'Agricultural Land' }
    ],
    commercials: [
      { value: 'all', label: 'All Commercial' },
      { value: 'offices', label: 'Offices' },
      { value: 'warehouses', label: 'Warehouses' },
      { value: 'shops', label: 'Shops' },
      { value: 'buildings', label: 'Buildings' },
      { value: 'factories', label: 'Factories' },
      { value: 'hotels', label: 'Hotels' }
    ],
    others: [
      { value: 'all', label: 'All Products' },
      { value: 'vehicles', label: 'Vehicles' },
      { value: 'electronics', label: 'Electronics' },
      { value: 'furnitures', label: 'Furniture' },
      { value: 'agricultural-products', label: 'Agricultural Products' },
      { value: 'construction-equipment', label: 'Construction Equipment' }
    ]
  };

  const currentSubTypes = subProductTypeOptions[filters.productType] || subProductTypeOptions.others;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Advanced Filters
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sub Product Type */}
        {filters.productType !== 'all' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specific Type
            </label>
            <select
              value={filters.subProductType || 'all'}
              onChange={(e) => handleFilterChange('subProductType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
            >
              {currentSubTypes.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange || 'all'}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price Range
          </label>
          <select
            value={filters.priceRange || 'all'}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
          >
            {priceRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Performance Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Performance
          </label>
          <select
            value={filters.performance || 'all'}
            onChange={(e) => handleFilterChange('performance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
          >
            <option value="all">All Performance</option>
            <option value="high-views">High Views (100+)</option>
            <option value="high-inquiries">High Inquiries (10+)</option>
            <option value="low-performance">Low Performance</option>
            <option value="no-activity">No Activity</option>
          </select>
        </div>
      </div>

      {/* Location Filters (for real estate) */}
      {['homes', 'plots', 'commercials'].includes(filters.productType) && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Location Filters
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <select
                value={filters.city || 'all'}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
              >
                <option value="all">All Cities</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Dire Dawa">Dire Dawa</option>
                <option value="Adama">Adama</option>
                <option value="Gondar">Gondar</option>
                <option value="Mekelle">Mekelle</option>
                <option value="Awassa">Awassa</option>
                <option value="Bahir Dar">Bahir Dar</option>
              </select>
            </div>

            {filters.city === 'Addis Ababa' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subcity
                </label>
                <select
                  value={filters.subcity || 'all'}
                  onChange={(e) => handleFilterChange('subcity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                >
                  <option value="all">All Subcities</option>
                  <option value="Bole">Bole</option>
                  <option value="Yeka">Yeka</option>
                  <option value="Kirkos">Kirkos</option>
                  <option value="Arada">Arada</option>
                  <option value="Addis Ketema">Addis Ketema</option>
                  <option value="Lideta">Lideta</option>
                </select>
              </div>
            )}

            {filters.productType !== 'plots' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms || 'all'}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                >
                  <option value="all">Any Bedrooms</option>
                  <option value="1">1+ Bedroom</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Options */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Additional Options
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={filters.featured || false}
              onChange={(e) => handleFilterChange('featured', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Featured listings only
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="has-images"
              checked={filters.hasImages || false}
              onChange={(e) => handleFilterChange('hasImages', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="has-images" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Has images
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="has-description"
              checked={filters.hasDescription || false}
              onChange={(e) => handleFilterChange('hasDescription', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="has-description" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Has detailed description
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recent-activity"
              checked={filters.recentActivity || false}
              onChange={(e) => handleFilterChange('recentActivity', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="recent-activity" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Recent activity (last 7 days)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="needs-attention"
              checked={filters.needsAttention || false}
              onChange={(e) => handleFilterChange('needsAttention', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="needs-attention" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Needs attention
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="negotiable"
              checked={filters.negotiable || false}
              onChange={(e) => handleFilterChange('negotiable', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="negotiable" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Negotiable price
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {Object.values(filters).filter(value => 
            value && value !== 'all' && value !== false && value !== ''
          ).length} active filters
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;