// components/product/ProductList.jsx
import { useSelector } from 'react-redux';
import ProductListItem from './ProductListItem';

const ProductList = ({ products }) => {
  const { isLoading } = useSelector((state) => state.products);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <ProductListItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400">
          No properties found matching your criteria.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductListItem key={product._id} product={product} />
      ))}
    </div>
  );
};

// Enhanced Skeleton component for loading state
const ProductListItemSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Image skeleton */}
        <div className="relative w-full md:w-80 h-48 md:h-64 flex-shrink-0">
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 md:rounded-l-xl rounded-t-xl md:rounded-tr-none"></div>
          
          {/* Badges skeleton */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            <div className="w-16 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="w-20 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
          
          {/* Action buttons skeleton */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              {/* Header skeleton */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                </div>
                <div className="text-right ml-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>

              {/* Description skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>

              {/* Features skeleton */}
              <div className="flex space-x-2 mb-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="ml-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;