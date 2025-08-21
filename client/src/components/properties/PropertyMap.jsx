import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon,
  HomeIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/helpers';

const PropertyMap = ({ properties }) => {
  const mapRef = useRef(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Initialize map (using a simple div for demo - in real app would use Google Maps or Mapbox)
    initializeMap();
  }, []);

  useEffect(() => {
    if (map) {
      updateMarkers();
    }
  }, [properties, map]);

  const initializeMap = () => {
    // Mock map initialization - in real app would use actual map library
    const mockMap = {
      center: { lat: 9.0084, lng: 38.7975 }, // Addis Ababa center
      zoom: 12
    };
    setMap(mockMap);
  };

  const updateMarkers = () => {
    // Mock marker update - in real app would create actual map markers
    const newMarkers = properties.map(property => ({
      id: property.id,
      position: property.location.coordinates,
      property
    }));
    setMarkers(newMarkers);
  };

  const PropertyMarker = ({ property, onClick }) => {
    const priceText = formatCurrency(property.price, property.currency, { compact: true });
    
    return (
      <div
        onClick={() => onClick(property)}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
        style={{
          left: `${((property.location.coordinates.lng - 38.7) * 1000) + 50}%`,
          top: `${((9.1 - property.location.coordinates.lat) * 1000) + 50}%`
        }}
      >
        <div className="bg-white dark:bg-gray-800 border-2 border-primary-500 rounded-lg px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {priceText}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {property.features.bedrooms}BR • {property.features.area}m²
          </div>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary-500"></div>
        </div>
      </div>
    );
  };

  const PropertyPopup = ({ property, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md w-full relative z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        {/* Image */}
        <div className="relative h-48">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full capitalize">
              {property.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(property.price, property.currency)}
            </div>
            {property.seller.rating && (
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">{property.seller.rating}</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {property.title}
          </h3>

          <div className="flex items-center space-x-2 mb-3">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {property.location.address}, {property.location.city}
            </span>
          </div>

          {/* Features */}
          <div className="flex space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <HomeIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {property.features.bedrooms} beds
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {property.features.bathrooms} baths
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {property.features.area} sqm
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <EyeIcon className="h-3 w-3" />
                <span>{property.stats.views} views</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link to={`/properties/${property.id}`} className="flex-1">
              <button className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Ccircle cx='51' cy='51' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Map Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Interactive Map View</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {properties.length} properties shown
            </p>
          </div>
        </div>

        {/* Property Markers */}
        {markers.map((marker) => (
          <PropertyMarker
            key={marker.id}
            property={marker.property}
            onClick={setSelectedProperty}
          />
        ))}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="text-lg font-bold text-gray-600 dark:text-gray-400">+</span>
          </button>
          <button className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="text-lg font-bold text-gray-600 dark:text-gray-400">−</span>
          </button>
        </div>
      </div>

      {/* Property List Below Map */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start space-x-3">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                  {property.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                  {property.location.address}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {formatCurrency(property.price, property.currency, { compact: true })}
                  </span>
                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Popup */}
      {selectedProperty && (
        <PropertyPopup
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default PropertyMap;