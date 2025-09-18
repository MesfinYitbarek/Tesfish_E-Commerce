// pages/ProductsPage.jsx - Compact Design
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductFilters from '../../components/product/ProductFilters';
import ProductGrid from '../../components/product/ProductGrid';
import ProductList from '../../components/product/ProductList';
import ProductMap from '../../components/product/ProductMap';
import ProductHeader from '../../components/product/ProductHeader';
import ProductPagination from '../../components/product/ProductPagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  SparklesIcon,
  ShoppingBagIcon,
  HomeIcon,
  MapIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { fetchProducts, fetchCategories, fetchPropertyTypes, setFilters, clearFilters } from '../../store/slices/productSlice';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    products,
    isLoading,
    error,
    pagination,
    filters,
    viewMode,
    categories,
    propertyTypes,
    aggregatedFilters
  } = useSelector((state) => state.products);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      urlFilters[key] = value;
    }
    
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
    }
    setIsInitialized(true);
  }, [searchParams, dispatch]);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPropertyTypes());
  }, [dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    if (!isInitialized) return;
    dispatch(fetchProducts(filters));
  }, [dispatch, filters, isInitialized]);

  // Update URL when filters change
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== '' && filters[key] !== 1) {
        params.set(key, filters[key]);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams, isInitialized]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
    setShowMobileFilters(false);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (['page', 'limit', 'sort'].includes(key)) return false;
      return value && value !== '' && value !== 'all';
    }).length;
  };

  // Simplified quick filters for mobile
  const quickFilters = [
    { key: 'productType', value: 'homes', label: 'Homes', icon: <HomeIcon className="h-3 w-3" /> },
    { key: 'productType', value: 'plots', label: 'Plots', icon: <MapIcon className="h-3 w-3" /> },
    { key: 'productType', value: 'commercials', label: 'Commercial', icon: <BuildingOfficeIcon className="h-3 w-3" /> },
    { key: 'productType', value: 'others', label: 'Others', icon: <BuildingOfficeIcon className="h-3 w-3" /> },
    { key: 'listingType', value: 'sell', label: 'For Sale', icon: <ShoppingBagIcon className="h-3 w-3" /> },
    { key: 'listingType', value: 'rent', label: 'For Rent', icon: <HomeIcon className="h-3 w-3" /> },
    { key: 'featured', value: 'true', label: 'Featured', icon: <SparklesIcon className="h-3 w-3" /> }
  ];

  const renderQuickFilters = () => (
    <div className="px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {quickFilters.map((filter) => (
          <button
            key={`${filter.key}-${filter.value}`}
            onClick={() => handleFilterChange({ [filter.key]: filter.value })}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filters[filter.key] === filter.value
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {filter.icon}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderProductView = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Loading properties...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-center max-w-md px-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchProducts(filters))}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-8 px-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No properties found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto text-sm">
            Try adjusting your filters or browse different categories to find what you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
            >
              Clear Filters
            </button>
            <button
              onClick={() => handleFilterChange({ productType: '', category: '' })}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
            >
              Browse All
            </button>
          </div>
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'list' ? (
            <ProductList products={products} />
          ) : viewMode === 'map' && ['homes', 'plots', 'commercials'].includes(filters.productType) ? (
            <ProductMap products={products.filter(p => ['homes', 'plots', 'commercials'].includes(p.productType))} />
          ) : (
            <ProductGrid products={products} />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simplified Header */}
      <ProductHeader
        totalProducts={pagination?.totalProducts || 0}
        currentPage={pagination?.currentPage || 1}
        filters={filters}
        onClearFilters={handleClearFilters}
      />

      {/* Quick Filters */}
      {renderQuickFilters()}

      {/* Desktop Filter Toggle Button */}
      <div className="hidden lg:block">
        <button
          onClick={() => setShowDesktopFilters(!showDesktopFilters)}
          className="fixed left-3 top-1/2 transform -translate-y-1/2 z-30 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 p-2.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300"
          aria-label={showDesktopFilters ? "Hide filters" : "Show filters"}
        >
          {showDesktopFilters ? (
            <ChevronLeftIcon className="h-4 w-4" />
          ) : (
            <div className="flex items-center space-x-1.5">
              <ChevronRightIcon className="h-4 w-4" />
              {getActiveFiltersCount() > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {getActiveFiltersCount()}
                </span>
              )}
            </div>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Desktop Sidebar with Animation */}
        <AnimatePresence>
          {showDesktopFilters && (
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="hidden lg:block w-72 flex-shrink-0"
            >
              <div className="sticky top-24 p-3">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowDesktopFilters(false)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <ProductFilters
                    filters={filters}
                    categories={categories || []}
                    propertyTypes={propertyTypes || []}
                    aggregatedFilters={aggregatedFilters || {}}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className={`flex-1 min-w-0 transition-all duration-300 ${showDesktopFilters ? 'lg:pl-0' : 'lg:pl-12'}`}>
          <div className="p-3">
            {renderProductView()}

            {/* Pagination */}
            {!isLoading && products && products.length > 0 && (
              <div className="mt-6">
                <ProductPagination
                  currentPage={pagination?.currentPage || 1}
                  totalPages={pagination?.totalPages || 1}
                  onPageChange={(page) => handleFilterChange({ page })}
                  hasNext={pagination?.hasNext || false}
                  hasPrev={pagination?.hasPrev || false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button - Fixed styling */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <FunnelIcon className="h-5 w-5" />
        {getActiveFiltersCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="ml-auto w-full max-w-sm bg-white dark:bg-gray-900 h-full overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Filters
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ProductFilters
                  filters={filters}
                  categories={categories || []}
                  propertyTypes={propertyTypes || []}
                  aggregatedFilters={aggregatedFilters || {}}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  isMobile={true}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;