import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import ProductCard from './ProductCard';

const RelatedProducts = ({ products }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const productsPerPage = 3;
  const maxSlides = Math.max(0, Math.ceil(products.length / productsPerPage) - 1);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  const getCurrentProducts = () => {
    const startIndex = currentSlide * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Related {products[0]?.type === 'real-estate' ? 'Properties' : 'Services'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            You might also be interested in these listings
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Navigation Arrows */}
          {products.length > productsPerPage && (
            <>
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                disabled={products.length <= productsPerPage}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                disabled={products.length <= productsPerPage}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}

          {/* View All Button */}
          <Link
            to={`/products?category=${products[0]?.category || 'all'}`}
            className="flex items-center px-4 py-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            View All
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .slice(slideIndex * productsPerPage, slideIndex * productsPerPage + productsPerPage)
                  .map((product) => (
                    <div key={product._id} className="transform transition-transform hover:scale-[1.02]">
                      <ProductCard product={product} variant="compact" />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      {products.length > productsPerPage && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxSlides + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-primary-500'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Mobile View All Button */}
      <div className="mt-6 text-center md:hidden">
        <Link
          to={`/products?category=${products[0]?.category || 'all'}`}
          className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors"
        >
          View All {products[0]?.type === 'real-estate' ? 'Properties' : 'Services'}
          <ArrowRightIcon className="h-4 w-4 ml-2" />
        </Link>
      </div>

      {/* Alternative Layout for Mobile */}
      <div className="block md:hidden mt-6">
        <div className="grid grid-cols-1 gap-4">
          {products.slice(0, 2).map((product) => (
            <div key={product._id}>
              <RelatedProductItem product={product} />
            </div>
          ))}
        </div>
        
        {products.length > 2 && (
          <div className="mt-4 text-center">
            <Link
              to={`/products?category=${products[0]?.category || 'all'}`}
              className="text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              See {products.length - 2} more {products[0]?.type === 'real-estate' ? 'properties' : 'services'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Compact Related Product Item for Mobile
const RelatedProductItem = ({ product }) => {
  const getPropertyFeatures = () => {
    if (product.type !== 'real-estate' || !product.realEstateDetails) return [];
    
    const features = [];
    const details = product.realEstateDetails;
    
    if (details.bedrooms) features.push(`${details.bedrooms} bed`);
    if (details.bathrooms) features.push(`${details.bathrooms} bath`);
    if (details.area) features.push(`${details.area} sqm`);
    
    return features;
  };

  const features = getPropertyFeatures();

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="flex space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={product.media?.images?.[0]?.url || '/api/placeholder/80/80'}
            alt={product.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 text-sm mb-1">
            {product.title}
          </h3>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {product.type === 'real-estate' 
              ? product.realEstateDetails?.location?.city || 'Location'
              : product.serviceDetails?.serviceArea || 'Service Area'
            }
          </p>

          {features.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {features.join(' • ')}
            </p>
          )}

          <div className="text-sm font-semibold text-primary-500">
            {formatCurrency(product.pricing?.basePrice || 0, 'ETB')}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RelatedProducts;