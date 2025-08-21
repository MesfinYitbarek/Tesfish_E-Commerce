import { useState, useRef } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  XMarkIcon,
  MagnifyingGlassPlusIcon 
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';

const ProductImageGallery = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const thumbnailsRef = useRef(null);

  const images = product.media?.images || [];
  const hasMultipleImages = images.length > 1;

  // Fallback image if no images available
  const fallbackImage = '/api/placeholder/600/400';
  const displayImages = images.length > 0 ? images : [{ url: fallbackImage, alt: product.title }];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setShowLightbox(true);
  };

  const nextLightboxImage = () => {
    setLightboxImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevLightboxImage = () => {
    setLightboxImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailsRef.current) {
      const scrollAmount = 120;
      thumbnailsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* Main Image */}
        <div className="relative aspect-[4/3] lg:aspect-[16/10] group">
          <img
            src={displayImages[selectedImageIndex]?.url || fallbackImage}
            alt={displayImages[selectedImageIndex]?.alt || product.title}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => openLightbox(selectedImageIndex)}
          />

          {/* Image Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Zoom Icon */}
          <button
            onClick={() => openLightbox(selectedImageIndex)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MagnifyingGlassPlusIcon className="h-5 w-5" />
          </button>

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          )}

          {/* Property Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {product.featured && (
              <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full">
                Featured
              </span>
            )}
            {product.status === 'urgent' && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                Urgent
              </span>
            )}
            {product.pricing?.negotiable && (
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                Negotiable
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {hasMultipleImages && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              {/* Thumbnail Scroll Buttons */}
              {displayImages.length > 5 && (
                <>
                  <button
                    onClick={() => scrollThumbnails('left')}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-1 border border-gray-200 dark:border-gray-700"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollThumbnails('right')}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-1 border border-gray-200 dark:border-gray-700"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Thumbnails */}
              <div 
                ref={thumbnailsRef}
                className="flex space-x-2 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex
                        ? 'border-primary-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        size="full"
        className="bg-black/95"
        showCloseButton={false}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-50 bg-black/70 text-white px-4 py-2 rounded-full">
            {lightboxImageIndex + 1} of {displayImages.length}
          </div>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevLightboxImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </button>
              <button
                onClick={nextLightboxImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Main Lightbox Image */}
          <div className="max-w-7xl max-h-full p-8">
            <img
              src={displayImages[lightboxImageIndex]?.url || fallbackImage}
              alt={displayImages[lightboxImageIndex]?.alt || product.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Thumbnail Strip */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
              <div className="flex space-x-2 bg-black/50 rounded-lg p-2">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === lightboxImageIndex
                        ? 'border-white'
                        : 'border-white/50 hover:border-white/80'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProductImageGallery;