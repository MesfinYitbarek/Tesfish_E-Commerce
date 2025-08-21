import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const ProductFilters = ({ filters, onFilterChange, onClose }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: 'all',
      type: 'all',
      sort: 'newest',
      dateRange: 'all',
      featured: false,
      priceRange: 'all'
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
    { value: 'under-1m', label: 'Under 1M ETB' },
    { value: '1m-5m', label: '1M - 5M ETB' },
    { value: '5m-10m', label: '5M - 10M ETB' },
    { value: 'over-10m', label: 'Over 10M ETB' }
  ];

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
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange || 'all'}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {priceRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Featured Listings
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={filters.featured || false}
              onChange={(e) => handleFilterChange('featured', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Show only featured listings
            </label>
          </div>
        </div>

        {/* Performance Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Performance
          </label>
          <select
            value={filters.performance || 'all'}
            onChange={(e) => handleFilterChange('performance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Performance</option>
            <option value="high-views">High Views (100+)</option>
            <option value="high-inquiries">High Inquiries (10+)</option>
            <option value="low-performance">Low Performance</option>
            <option value="no-activity">No Activity</option>
          </select>
        </div>
      </div>

      {/* Additional Options */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Additional Options
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has-images"
              checked={filters.hasImages || false}
              onChange={(e) => handleFilterChange('hasImages', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
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
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
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
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
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
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="needs-attention" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Needs attention
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
          {Object.values(filters).filter(value => value && value !== 'all' && value !== false).length} active filters
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;