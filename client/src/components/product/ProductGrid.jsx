import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProductGrid = ({ products }) => {
  const { isLoading } = useSelector((state) => state.products);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {[...Array(8)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

// Compact Skeleton component for loading state
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1.5"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;