import { useSelector } from 'react-redux';
import ProductListItem from './ProductListItem';

const ProductList = ({ products }) => {
  const { isLoading } = useSelector((state) => state.products);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <ProductListItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductListItem key={product._id} product={product} />
      ))}
    </div>
  );
};

// Compact Skeleton component for loading state
const ProductListItemSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 h-32 bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1 p-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1.5"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;