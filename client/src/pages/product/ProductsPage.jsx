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
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { fetchProducts, fetchCategories, setFilters, clearFilters } from '../../store/slices/productSlice';
import { setLoading } from '../../store/slices/uiSlice';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    products,
    isLoading,
    error,
    pagination,
    filters,
    viewMode,
    categories
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

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    if (!isInitialized) return;

    const fetchData = async () => {
      dispatch(setLoading({ key: 'products', value: true }));
      await dispatch(fetchProducts(filters));
      dispatch(setLoading({ key: 'products', value: false }));
    };

    fetchData();
  }, [dispatch, filters, isInitialized]);

  // Update URL when filters change
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== '') {
        params.set(key, filters[key]);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams, isInitialized]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
  };

  const renderProductView = () => {
    if (isLoading) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center py-12"
        >
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-sm text-gray-600 dark:text-gray-400"
            >
              Finding the perfect properties for you...
            </motion.p>
          </div>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex items-center justify-center py-12"
        >
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{error}</p>
            <button
              onClick={() => dispatch(fetchProducts(filters))}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      );
    }

    const viewTransition = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3 }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div key={viewMode} {...viewTransition}>
          {(() => {
            switch (viewMode) {
              case 'list':
                return <ProductList products={products} />;
              case 'map':
                return <ProductMap products={products} />;
              default:
                return <ProductGrid products={products} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderEmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        No properties found
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
        We couldn't find any properties matching your criteria. 
        Try adjusting your filters or browse different categories.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleClearFilters}
          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
          Clear all filters
        </button>
        <button
          onClick={() => handleFilterChange({ category: 'real-estate' })}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <HomeIcon className="h-4 w-4 mr-2" />
          Browse all properties
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <ProductHeader
        totalProducts={pagination.totalProducts}
        currentPage={pagination.currentPage}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearFilters={handleClearFilters}
        filters={filters}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full lg:w-72 flex-shrink-0"
              >
                <div className="sticky top-20">
                  <ProductFilters
                    filters={filters}
                    categories={categories}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {renderProductView()}

            {/* Pagination */}
            {!isLoading && products.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
              >
                <ProductPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => handleFilterChange({ page })}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                />
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && renderEmptyState()}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile Filters */}
      <AnimatePresence>
        {!showFilters && window.innerWidth < 1024 && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(true)}
            className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center lg:hidden"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;