import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  HomeIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/helpers';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Enhanced custom marker icons
const createCustomIcon = (product, isSelected = false, isHovered = false) => {
  const price = product.pricing?.basePrice || 0;
  const priceText = price > 1000000 ? `${(price / 1000000).toFixed(1)}M` : 
                   price > 1000 ? `${(price / 1000).toFixed(0)}K` : 
                   price.toLocaleString();
  
  const markerClass = isSelected ? 'selected' : isHovered ? 'hovered' : '';
  
  return L.divIcon({
    className: `custom-property-marker ${markerClass}`,
    html: `
      <div class="relative flex flex-col items-center">
        <div class="bg-white rounded-2xl shadow-xl border-2 border-blue-500 px-3 py-2 transform ${isSelected ? 'scale-110' : isHovered ? 'scale-105' : ''} transition-transform duration-200">
          <div class="text-xs font-bold text-blue-600">${priceText} ETB</div>
          <div class="text-xs text-gray-600">${product.realEstateDetails?.propertyType || 'Property'}</div>
        </div>
        <div class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white -mt-1"></div>
      </div>
    `,
    iconSize: [80, 60],
    iconAnchor: [40, 60],
    popupAnchor: [0, -60],
  });
};

const ProductMap = ({ products, onProductSelect }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [mapCenter, setMapCenter] = useState([9.0320, 38.7460]); // Addis Ababa coordinates
  const [mapZoom, setMapZoom] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [propertyType, setPropertyType] = useState('');
  const { isLoading } = useSelector((state) => state.products);

  // Filter products that have location coordinates
  const productsWithLocation = products.filter(product => {
    if (product.type === 'real-estate') {
      const hasCoords = product.realEstateDetails?.location?.coordinates?.latitude &&
                       product.realEstateDetails?.location?.coordinates?.longitude;
      
      if (!hasCoords) return false;
      
      // Apply filters
      const price = product.pricing?.basePrice || 0;
      const minPrice = priceRange.min ? parseInt(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseInt(priceRange.max) : Infinity;
      
      if (price < minPrice || price > maxPrice) return false;
      
      if (propertyType && product.realEstateDetails?.propertyType !== propertyType) return false;
      
      return true;
    }
    return false;
  });

  // Auto-fit map to show all markers
  const FitBounds = ({ products }) => {
    const map = useMap();
    
    useEffect(() => {
      if (products.length > 0) {
        const bounds = L.latLngBounds(
          products.map(product => [
            product.realEstateDetails.location.coordinates.latitude,
            product.realEstateDetails.location.coordinates.longitude
          ])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [products, map]);
    
    return null;
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-96 lg:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading map...</h3>
          <p className="text-gray-500 dark:text-gray-400">Fetching property locations</p>
        </div>
      </motion.div>
    );
  }

  if (productsWithLocation.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-96 lg:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPinIcon className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            No locations to display
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Properties need location coordinates to appear on the map. Try adjusting your filters or check back later.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Enhanced Map Controls Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between"
      >
        <div className="bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 px-6 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MapPinIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {productsWithLocation.length} Properties
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  on the map
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
          >
            <FunnelIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Map Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="absolute top-20 left-4 z-10 w-80"
          >
            <div className="bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Map Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Price Range (ETB)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setPriceRange({ min: '', max: '' });
                    setPropertyType('');
                  }}
                  className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Map Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <FitBounds products={productsWithLocation} />
          
          {productsWithLocation.map((product) => {
            const lat = product.realEstateDetails.location.coordinates.latitude;
            const lng = product.realEstateDetails.location.coordinates.longitude;
            
            return (
              <Marker
                key={product._id}
                position={[lat, lng]}
                icon={createCustomIcon(
                  product, 
                  selectedProduct?._id === product._id,
                  hoveredProduct?._id === product._id
                )}
                eventHandlers={{
                  click: () => handleProductSelect(product),
                  mouseover: () => setHoveredProduct(product),
                  mouseout: () => setHoveredProduct(null),
                }}
              >
                <Popup className="custom-popup">
                  <EnhancedProductMapPopup 
                    product={product} 
                    onClose={() => setSelectedProduct(null)}
                  />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </motion.div>

      {/* Enhanced Selected Product Details */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-6 left-6 right-6 z-10"
          >
            <div className="bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start space-x-6">
                {/* Enhanced Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={selectedProduct.media?.images?.[0]?.url || '/api/placeholder/96/96'}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                  />
                  {selectedProduct.featured && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">★</span>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Product Info */}
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/product/${selectedProduct._id}`}
                    className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                      {selectedProduct.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      {selectedProduct.realEstateDetails?.location?.city || 'Location'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(selectedProduct.pricing?.basePrice || 0, 'ETB')}
                    </div>
                    
                    {/* Enhanced Features */}
                    {selectedProduct.realEstateDetails && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        {selectedProduct.realEstateDetails.bedrooms && (
                          <div className="flex items-center space-x-1">
                            <HomeIcon className="h-4 w-4" />
                            <span>{selectedProduct.realEstateDetails.bedrooms} bed</span>
                          </div>
                        )}
                        {selectedProduct.realEstateDetails.bathrooms && (
                          <span>{selectedProduct.realEstateDetails.bathrooms} bath</span>
                        )}
                        {selectedProduct.realEstateDetails.area && (
                          <span>{selectedProduct.realEstateDetails.area} sqm</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-4">
                    <Link
                      to={`/product/${selectedProduct._id}`}
                      className="flex-1 text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                    >
                      View Details
                    </Link>
                    <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <ShareIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Enhanced Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedProduct(null)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Map Controls */}
      <div className="absolute bottom-6 right-6 z-10 space-y-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (productsWithLocation.length > 0) {
              const bounds = L.latLngBounds(
                productsWithLocation.map(product => [
                  product.realEstateDetails.location.coordinates.latitude,
                  product.realEstateDetails.location.coordinates.longitude
                ])
              );
            }
          }}
          className="bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 p-3 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
          title="Fit all markers"
        >
          <ViewColumnsIcon className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Map Legend */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 right-4 z-10"
      >
        <div className="bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
            Legend
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Property Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Featured Property</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Enhanced Product Map Popup Component
const EnhancedProductMapPopup = ({ product, onClose }) => {
  const getPropertyFeatures = () => {
    const features = [];
    if (product.realEstateDetails?.bedrooms) {
      features.push(`${product.realEstateDetails.bedrooms} bed`);
    }
    if (product.realEstateDetails?.bathrooms) {
      features.push(`${product.realEstateDetails.bathrooms} bath`);
    }
    if (product.realEstateDetails?.area) {
      features.push(`${product.realEstateDetails.area} sqm`);
    }
    return features;
  };

  const propertyFeatures = getPropertyFeatures();

  return (
    <div className="w-80 p-4">
      {/* Enhanced Image */}
      {product.media?.images?.[0] && (
        <div className="relative mb-4">
          <img
            src={product.media.images[0].url}
            alt={product.title}
            className="w-full h-40 object-cover rounded-xl shadow-lg"
          />
          {product.featured && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
              Featured
            </div>
          )}
          <div className="absolute top-3 right-3 flex space-x-2">
            <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
              <HeartIcon className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
              <ShareIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
      
      {/* Enhanced Content */}
      <div>
        <Link 
          to={`/product/${product._id}`}
          className="block hover:text-blue-600 transition-colors"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPinIcon className="h-4 w-4 mr-2" />
          <span className="text-sm">
            {product.realEstateDetails?.location?.address || 
             `${product.realEstateDetails?.location?.city || 'Location'}`}
          </span>
        </div>
        
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {formatCurrency(product.pricing?.basePrice || 0, 'ETB')}
        </div>
        
        {/* Enhanced Features */}
        {propertyFeatures.length > 0 && (
          <div className="flex items-center mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <HomeIcon className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {propertyFeatures.join(' • ')}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <EyeIcon className="h-3 w-3 mr-1" />
            <span>{product.views || 0} views</span>
          </div>
          <span>Listed recently</span>
        </div>
        
        {/* Enhanced View Details Button */}
        <Link
          to={`/product/${product._id}`}
          className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          View Full Details
        </Link>
      </div>
    </div>
  );
};

export default ProductMap;