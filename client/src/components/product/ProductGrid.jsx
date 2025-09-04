import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  const { isLoading } = useSelector((state) => state.products);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {[...Array(8)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Let parent handle empty state
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

// Simplified mobile-optimized skeleton
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 relative">
        {/* Badge skeleton */}
        <div className="absolute top-2 left-2 w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        {/* Action buttons skeleton */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-3">
        {/* Price skeleton */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
        
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        
        {/* Location skeleton */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        
        {/* Features skeleton */}
        <div className="flex space-x-1 mb-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
        
        {/* Seller skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;