// components/product/ProductPagination.jsx
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const ProductPagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  hasNext = false, 
  hasPrev = false,
  totalProducts = 0,
  limit = 12
}) => {
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 7; // Maximum number of page buttons to show
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Calculate range around current page
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        end = Math.min(totalPages, 5);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4);
      }
      
      // Add first page and ellipsis if needed
      if (start > 1) {
        visiblePages.push(1);
        if (start > 2) {
          visiblePages.push('...');
        }
      }
      
      // Add pages in range
      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
      
      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          visiblePages.push('...');
        }
        visiblePages.push(totalPages);
      }
    }
    
    return visiblePages;
  };

  const getPageRange = () => {
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalProducts);
    return { start, end };
  };

  // Don't render if there's only one page or no products
  if (totalPages <= 1 || totalProducts === 0) {
    return null;
  }

  const visiblePages = getVisiblePages();
  const { start, end } = getPageRange();

  // Safe page change handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        {/* Results Info */}
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">
            Showing {start.toLocaleString()} to {end.toLocaleString()}
          </span>
          <span className="mx-1">of</span>
          <span className="font-medium">{totalProducts.toLocaleString()}</span>
          <span className="ml-1">properties</span>
        </div>

        {/* Mobile pagination */}
        <div className="flex lg:hidden w-full justify-between items-center">
          <motion.button
            whileHover={{ scale: hasPrev ? 1.05 : 1 }}
            whileTap={{ scale: hasPrev ? 0.95 : 1 }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Previous</span>
          </motion.button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Page</span>
            <div className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-bold min-w-[3rem] text-center">
              {currentPage}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">of {totalPages}</span>
          </div>
          
          <motion.button
            whileHover={{ scale: hasNext ? 1.05 : 1 }}
            whileTap={{ scale: hasNext ? 0.95 : 1 }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNext}
            className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            <span>Next</span>
            <ChevronRightIcon className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Desktop pagination */}
        <div className="hidden lg:flex items-center justify-center">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            {/* Previous button */}
            <motion.button
              whileHover={{ scale: hasPrev ? 1.05 : 1 }}
              whileTap={{ scale: hasPrev ? 0.95 : 1 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrev}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Previous</span>
            </motion.button>

            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {visiblePages.map((page, index) => {
                if (page === '...') {
                  return (
                    <div
                      key={`ellipsis-${index}`}
                      className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400"
                    >
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </div>
                  );
                }

                const isCurrentPage = page === currentPage;
                
                return (
                  <motion.button
                    key={page}
                    whileHover={{ scale: isCurrentPage ? 1 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page)}
                    className={`w-12 h-12 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isCurrentPage
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-110'
                        : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-md'
                    }`}
                  >
                    {page}
                  </motion.button>
                );
              })}
            </div>

            {/* Next button */}
            <motion.button
              whileHover={{ scale: hasNext ? 1.05 : 1 }}
              whileTap={{ scale: hasNext ? 0.95 : 1 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              <span>Next</span>
              <ChevronRightIcon className="h-4 w-4" />
            </motion.button>
          </nav>
        </div>

        {/* Quick jump to page */}
        <div className="hidden lg:flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            defaultValue={currentPage}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.target.value);
                handlePageChange(page);
              }
            }}
            onBlur={(e) => {
              const page = parseInt(e.target.value);
              handlePageChange(page);
            }}
            className="w-16 px-3 py-2 text-sm font-medium text-center border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentPage / totalPages) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
        />
      </div>
    </motion.div>
  );
};

export default ProductPagination;