// components/product/ProductGrid.jsx
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProductGrid = ({ products }) => {
  const { isLoading } = useSelector((state) => state.products);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <ProductCardSkeleton key={index} />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

// Enhanced Skeleton component for loading state
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="relative">
        <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
        {/* Status badge skeleton */}
        <div className="absolute top-3 left-3 w-16 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        {/* Action buttons skeleton */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Price skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
        
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        
        {/* Location skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
        
        {/* Features skeleton */}
        <div className="flex space-x-2 mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        
        {/* Seller info skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;