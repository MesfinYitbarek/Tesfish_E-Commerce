// components/product/ProductHeader.jsx
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Squares2X2Icon, 
  ListBulletIcon, 
  MapIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon,
  EyeIcon,
  SparklesIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { setViewMode, setFilters } from '../../store/slices/productSlice';

// Sort options for properties
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'area-small', label: 'Area: Small to Large' },
  { value: 'area-large', label: 'Area: Large to Small' },
  { value: 'featured', label: 'Featured First' }
];

const ProductHeader = ({ 
  totalProducts = 0, 
  currentPage = 1, 
  showFilters = false, 
  onToggleFilters, 
  onClearFilters,
  filters = {} 
}) => {
  const dispatch = useDispatch();
  const { viewMode } = useSelector((state) => state.products);

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  const handleSortChange = (sort) => {
    dispatch(setFilters({ sort }));
  };

  const getActiveFiltersCount = () => {
    if (!filters || typeof filters !== 'object') return 0;
    return Object.entries(filters).filter(([key, value]) => {
      // Exclude pagination and sort from active filters count
      if (['page', 'limit', 'sort'].includes(key)) return false;
      return value && value !== '' && value !== 'all';
    }).length;
  };

  const getFilterSummary = () => {
    if (!filters || typeof filters !== 'object') return [];
    
    const activeFilters = [];
    
    // Property type mapping
    const propertyTypeMap = {
      'homes': 'Homes',
      'plots': 'Plots', 
      'commercials': 'Commercial',
      'others': 'Others'
    };

    // Sub property type mapping
    const subPropertyTypeMap = {
      'houses': 'Houses',
      'apartment': 'Apartments',
      'villas': 'Villas',
      'condos': 'Condos',
      'townhouses': 'Townhouses',
      'offices': 'Offices',
      'warehouses': 'Warehouses',
      'shops': 'Shops',
      'mixed-use-land': 'Mixed Use Land',
      'residential-land': 'Residential Land',
      'commercial-land': 'Commercial Land',
      'agricultural-land': 'Agricultural Land',
      'buildings': 'Buildings',
      'factories': 'Factories',
      'hotels': 'Hotels',
      'electronics': 'Electronics',
      'vehicles': 'Vehicles',
      'furnitures': 'Furniture'
    };

    if (filters.productType && filters.productType !== 'all') {
      activeFilters.push({ 
        key: 'Type', 
        value: propertyTypeMap[filters.productType] || filters.productType, 
        color: 'blue' 
      });
    }

    if (filters.subProductType && filters.subProductType !== 'all') {
      activeFilters.push({ 
        key: 'Category', 
        value: subPropertyTypeMap[filters.subProductType] || filters.subProductType, 
        color: 'indigo' 
      });
    }

    if (filters.listingType && filters.listingType !== 'all') {
      activeFilters.push({ 
        key: 'Listing', 
        value: filters.listingType === 'sell' ? 'For Sale' : 'For Rent', 
        color: 'green' 
      });
    }

    if (filters.search && filters.search.trim()) {
      activeFilters.push({ 
        key: 'Search', 
        value: `"${filters.search.trim()}"`, 
        color: 'purple' 
      });
    }

    if (filters.city && filters.city.trim()) {
      activeFilters.push({ 
        key: 'City', 
        value: filters.city, 
        color: 'orange' 
      });
    }

    if (filters.region && filters.region.trim()) {
      activeFilters.push({ 
        key: 'Region', 
        value: filters.region, 
        color: 'teal' 
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? Number(filters.minPrice).toLocaleString() : '0';
      const max = filters.maxPrice ? Number(filters.maxPrice).toLocaleString() : '∞';
      activeFilters.push({ 
        key: 'Price', 
        value: `${min} - ${max} ETB`, 
        color: 'pink' 
      });
    }

    if (filters.bedrooms) {
      activeFilters.push({ 
        key: 'Bedrooms', 
        value: `${filters.bedrooms}${filters.bedrooms === '5' ? '+' : ''}`, 
        color: 'cyan' 
      });
    }

    if (filters.bathrooms) {
      activeFilters.push({ 
        key: 'Bathrooms', 
        value: `${filters.bathrooms}${filters.bathrooms === '4' ? '+' : ''}`, 
        color: 'lime' 
      });
    }

    if (filters.minArea || filters.maxArea) {
      const min = filters.minArea ? Number(filters.minArea).toLocaleString() : '0';
      const max = filters.maxArea ? Number(filters.maxArea).toLocaleString() : '∞';
      activeFilters.push({ 
        key: 'Area', 
        value: `${min} - ${max} sqm`, 
        color: 'amber' 
      });
    }

    if (filters.furnishingStatus && filters.furnishingStatus !== 'all') {
      activeFilters.push({ 
        key: 'Furnishing', 
        value: filters.furnishingStatus.charAt(0).toUpperCase() + filters.furnishingStatus.slice(1), 
        color: 'violet' 
      });
    }

    if (filters.condition && filters.condition !== 'all') {
      activeFilters.push({ 
        key: 'Condition', 
        value: filters.condition.charAt(0).toUpperCase() + filters.condition.slice(1).replace('-', ' '), 
        color: 'emerald' 
      });
    }

    if (filters.featured === 'true') {
      activeFilters.push({ 
        key: 'Special', 
        value: 'Featured Only', 
        color: 'yellow' 
      });
    }

    if (filters.promoted === 'true') {
      activeFilters.push({ 
        key: 'Special', 
        value: 'Promoted Only', 
        color: 'red' 
      });
    }

    return activeFilters;
  };

  const viewModeOptions = [
    { id: 'grid', icon: Squares2X2Icon, label: 'Grid View', description: 'Card layout' },
    { id: 'list', icon: ListBulletIcon, label: 'List View', description: 'Detailed list' },
    { id: 'map', icon: MapIcon, label: 'Map View', description: 'Location map' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-30 shadow-lg"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Main Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                  Properties & Services
                </h1>
                {totalProducts > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <EyeIcon className="h-4 w-4" />
                    <span>{totalProducts.toLocaleString()} results found</span>
                    {currentPage > 1 && (
                      <span>• Page {currentPage}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced View Mode Switcher */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5 shadow-inner">
              {viewModeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleViewModeChange(option.id)}
                    className={`relative px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                      viewMode === option.id
                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                    title={option.label}
                  >
                    <IconComponent className="h-5 w-5" />
                    {viewMode === option.id && (
                      <motion.div
                        layoutId="activeView"
                        className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-xl"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Enhanced Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Side - Filters */}
          <div className="flex items-center space-x-4">
            {/* Mobile Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleFilters}
              className="lg:hidden flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-200"
            >
              {showFilters ? (
                <>
                  <XMarkIcon className="h-5 w-5" />
                  <span className="font-medium">Hide Filters</span>
                </>
              ) : (
                <>
                  <FunnelIcon className="h-5 w-5" />
                  <span className="font-medium">Filters</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs rounded-full px-2 py-1 font-bold">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </>
              )}
            </motion.button>

            {/* Desktop Filter Summary */}
            <div className="hidden lg:flex items-center space-x-3">
              {getActiveFiltersCount() > 0 ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <AdjustmentsHorizontalIcon className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                      {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
                    </span>
                  </div>
                  <button
                    onClick={onClearFilters}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  <span className="text-sm">No filters applied</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Quick Actions */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
              Sort by:
            </span>
          </div>
        </div>

        {/* Enhanced Active Filters Display */}
        {getFilterSummary().length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">
                  Active filters:
                </span>
              </div>
              {getFilterSummary().map((filter, index) => {
                const colorClasses = {
                  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200',
                  green: 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200',
                  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-200',
                  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-200',
                  pink: 'bg-pink-100 text-pink-800 dark:bg-pink-800/30 dark:text-pink-200',
                  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800/30 dark:text-indigo-200',
                  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-200',
                  cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800/30 dark:text-cyan-200',
                  lime: 'bg-lime-100 text-lime-800 dark:bg-lime-800/30 dark:text-lime-200',
                  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-200',
                  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-800/30 dark:text-violet-200',
                  emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-200',
                  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-200',
                  red: 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200'
                };

                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${colorClasses[filter.color] || colorClasses.blue}`}
                  >
                    <span className="font-semibold">{filter.key}:</span>
                    <span className="ml-1">{filter.value}</span>
                  </motion.span>
                );
              })}
              <button
                onClick={onClearFilters}
                className="ml-auto flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
              >
                <XMarkIcon className="h-3 w-3" />
                <span>Clear all</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductHeader;