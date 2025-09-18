// components/product/ProductHeader.jsx - Compact Design
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Squares2X2Icon, 
  ListBulletIcon, 
  ChevronDownIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { setViewMode, setFilters } from '../../store/slices/productSlice';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const ProductHeader = ({ totalProducts = 0, filters = {}, onClearFilters }) => {
  const dispatch = useDispatch();
  const { viewMode } = useSelector((state) => state.products);

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  const handleSortChange = (sort) => {
    dispatch(setFilters({ sort }));
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (['page', 'limit', 'sort'].includes(key)) return false;
      return value && value !== '' && value !== 'all';
    }).length;
  };

  const viewModeOptions = [
    { id: 'grid', icon: Squares2X2Icon, label: 'Grid' },
    { id: 'list', icon: ListBulletIcon, label: 'List' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="px-3 py-3">
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden">    
          <div className="flex items-center space-x-2">
            {/* Sort */}
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-xs border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1.5 bg-white dark:bg-gray-800"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-0.5">
              {viewModeOptions.slice(0, 2).map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleViewModeChange(option.id)}
                    className={`p-1.5 rounded-sm transition-colors ${
                      viewMode === option.id
                        ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {totalProducts.toLocaleString()} results
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {totalProducts.toLocaleString()}
              </span> properties found
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Active Filters Indicator */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex items-center space-x-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-md">
                <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                  {getActiveFiltersCount()} filters
                </span>
                <button
                  onClick={onClearFilters}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* View Mode Switcher */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-0.5">
              {viewModeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleViewModeChange(option.id)}
                    className={`px-2.5 py-1.5 rounded-md transition-colors ${
                      viewMode === option.id
                        ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none px-3 py-1.5 pr-7 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;