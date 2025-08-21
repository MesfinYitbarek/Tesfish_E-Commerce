import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  MapIcon,
  ListBulletIcon,
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  EyeIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  CheckBadgeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PropertyFilters from '../../components/properties/PropertyFilters';
import PropertyMap from '../../components/properties/PropertyMap';
import { formatCurrency } from '../../utils/helpers';
import { ETHIOPIAN_CITIES } from '../../constants';
import { toast } from 'react-hot-toast';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Filter states
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    features: searchParams.getAll('features') || [],
    availability: searchParams.get('availability') || 'all',
    verified: searchParams.get('verified') === 'true'
  });

  useEffect(() => {
    fetchProperties();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterAndSortProperties();
  }, [properties, filters, sortBy]);

  useEffect(() => {
    updateURLParams();
  }, [filters]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProperties = [
        {
          id: 'PROP-001',
          title: 'Modern 3BR Apartment in CMC',
          description: 'Spacious and modern apartment with stunning city views, premium finishes, and convenient location near shopping centers.',
          price: 2500000,
          currency: 'ETB',
          type: 'apartment',
          status: 'available',
          images: [
            '/api/placeholder/600/400',
            '/api/placeholder/600/401',
            '/api/placeholder/600/402',
            '/api/placeholder/600/403'
          ],
          location: {
            city: 'Addis Ababa',
            subcity: 'Yeka',
            kebele: '08',
            address: 'CMC area, near Megenagna',
            coordinates: { lat: 9.0084, lng: 38.7975 }
          },
          features: {
            bedrooms: 3,
            bathrooms: 2,
            area: 120,
            floor: 2,
            totalFloors: 5,
            parking: true,
            balcony: true,
            furnished: 'semi',
            yearBuilt: 2022
          },
          amenities: ['Elevator', 'Security', 'Generator', 'Water Tank', 'Parking'],
          seller: {
            name: 'Prime Properties Ltd',
            type: 'company',
            verified: true,
            avatar: '/api/placeholder/50/50',
            rating: 4.8,
            totalProperties: 45
          },
          stats: {
            views: 1250,
            inquiries: 45,
            savedBy: 89
          },
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          featured: true,
          virtualTour: true,
          videoTour: true
        },
        {
          id: 'PROP-002',
          title: 'Luxury Villa in Old Airport',
          description: 'Stunning villa with private garden, swimming pool, and panoramic views. Perfect for families seeking luxury living.',
          price: 15000000,
          currency: 'ETB',
          type: 'villa',
          status: 'available',
          images: [
            '/api/placeholder/600/404',
            '/api/placeholder/600/405',
            '/api/placeholder/600/406'
          ],
          location: {
            city: 'Addis Ababa',
            subcity: 'Bole',
            kebele: '12',
            address: 'Old Airport area, near Bole International',
            coordinates: { lat: 8.9806, lng: 38.7578 }
          },
          features: {
            bedrooms: 5,
            bathrooms: 4,
            area: 400,
            lotSize: 800,
            floors: 2,
            parking: true,
            garden: true,
            pool: true,
            furnished: 'unfurnished',
            yearBuilt: 2021
          },
          amenities: ['Swimming Pool', 'Garden', 'Security', 'Generator', 'Garage', 'Maid Room'],
          seller: {
            name: 'Sarah Johnson',
            type: 'individual',
            verified: true,
            avatar: '/api/placeholder/50/51',
            rating: 4.9,
            totalProperties: 3
          },
          stats: {
            views: 2850,
            inquiries: 78,
            savedBy: 156
          },
          publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          featured: true,
          virtualTour: false,
          videoTour: true
        },
        {
          id: 'PROP-003',
          title: 'Commercial Office Space - Piazza',
          description: 'Prime commercial space in the heart of Addis Ababa. Ideal for businesses looking for a prestigious address.',
          price: 8500000,
          currency: 'ETB',
          type: 'commercial',
          status: 'available',
          images: [
            '/api/placeholder/600/407',
            '/api/placeholder/600/408'
          ],
          location: {
            city: 'Addis Ababa',
            subcity: 'Addis Ketema',
            kebele: '05',
            address: 'Piazza area, near Arat Kilo',
            coordinates: { lat: 9.0370, lng: 38.7468 }
          },
          features: {
            area: 250,
            floors: 2,
            parking: true,
            furnished: 'furnished',
            yearBuilt: 2020,
            offices: 8,
            meetingRooms: 3
          },
          amenities: ['Elevator', 'Security', 'Generator', 'Parking', 'Reception'],
          seller: {
            name: 'Metro Real Estate',
            type: 'company',
            verified: true,
            avatar: '/api/placeholder/50/52',
            rating: 4.7,
            totalProperties: 28
          },
          stats: {
            views: 980,
            inquiries: 32,
            savedBy: 67
          },
          publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          featured: false,
          virtualTour: true,
          videoTour: false
        },
        {
          id: 'PROP-004',
          title: '2BR Apartment - Bole Atlas',
          description: 'Cozy apartment in the heart of Bole with easy access to restaurants, cafes, and shopping centers.',
          price: 1800000,
          currency: 'ETB',
          type: 'apartment',
          status: 'available',
          images: [
            '/api/placeholder/600/409',
            '/api/placeholder/600/410',
            '/api/placeholder/600/411'
          ],
          location: {
            city: 'Addis Ababa',
            subcity: 'Bole',
            kebele: '03',
            address: 'Bole Atlas area',
            coordinates: { lat: 8.9915, lng: 38.7635 }
          },
          features: {
            bedrooms: 2,
            bathrooms: 1,
            area: 85,
            floor: 3,
            totalFloors: 6,
            parking: false,
            balcony: true,
            furnished: 'unfurnished',
            yearBuilt: 2019
          },
          amenities: ['Security', 'Generator', 'Water Tank'],
          seller: {
            name: 'John Smith',
            type: 'individual',
            verified: false,
            avatar: '/api/placeholder/50/53',
            rating: 4.2,
            totalProperties: 1
          },
          stats: {
            views: 650,
            inquiries: 28,
            savedBy: 43
          },
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          featured: false,
          virtualTour: false,
          videoTour: false
        },
        {
          id: 'PROP-005',
          title: 'Penthouse with Rooftop - Kazanchis',
          description: 'Exclusive penthouse with private rooftop terrace and 360-degree city views. Premium location.',
          price: 12000000,
          currency: 'ETB',
          type: 'apartment',
          status: 'sold',
          images: [
            '/api/placeholder/600/412',
            '/api/placeholder/600/413'
          ],
          location: {
            city: 'Addis Ababa',
            subcity: 'Kirkos',
            kebele: '09',
            address: 'Kazanchis business district',
            coordinates: { lat: 9.0192, lng: 38.7525 }
          },
          features: {
            bedrooms: 4,
            bathrooms: 3,
            area: 200,
            floor: 15,
            totalFloors: 15,
            parking: true,
            rooftop: true,
            furnished: 'fully',
            yearBuilt: 2023
          },
          amenities: ['Elevator', 'Security', 'Generator', 'Gym', 'Pool', 'Concierge'],
          seller: {
            name: 'Luxury Homes Ethiopia',
            type: 'company',
            verified: true,
            avatar: '/api/placeholder/50/54',
            rating: 4.9,
            totalProperties: 12
          },
          stats: {
            views: 3200,
            inquiries: 95,
            savedBy: 234
          },
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          featured: true,
          virtualTour: true,
          videoTour: true
        }
      ];

      setProperties(mockProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
    setFavorites(savedFavorites);
  };

  const toggleFavorite = (propertyId) => {
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteProperties', JSON.stringify(newFavorites));
    
    toast.success(
      favorites.includes(propertyId) 
        ? 'Removed from favorites' 
        : 'Added to favorites'
    );
  };

  const filterAndSortProperties = () => {
    let filtered = [...properties];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.address.toLowerCase().includes(query) ||
        property.seller.name.toLowerCase().includes(query)
      );
    }

    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.city === filters.location ||
        property.location.subcity === filters.location
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(property => property.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice));
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property => 
        property.features.bedrooms >= parseInt(filters.bedrooms)
      );
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(property => 
        property.features.bathrooms >= parseInt(filters.bathrooms)
      );
    }

    if (filters.minArea) {
      filtered = filtered.filter(property => 
        property.features.area >= parseInt(filters.minArea)
      );
    }

    if (filters.maxArea) {
      filtered = filtered.filter(property => 
        property.features.area <= parseInt(filters.maxArea)
      );
    }

    if (filters.availability !== 'all') {
      filtered = filtered.filter(property => property.status === filters.availability);
    }

    if (filters.verified) {
      filtered = filtered.filter(property => property.seller.verified);
    }

    if (filters.features.length > 0) {
      filtered = filtered.filter(property => 
        filters.features.some(feature => 
          property.amenities.some(amenity => 
            amenity.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'oldest':
          return new Date(a.publishedAt) - new Date(b.publishedAt);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popularity':
          return b.stats.views - a.stats.views;
        case 'area-large':
          return b.features.area - a.features.area;
        case 'area-small':
          return a.features.area - b.features.area;
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  };

  const updateURLParams = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, value.toString());
        }
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      type: 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      features: [],
      availability: 'all',
      verified: false
    });
  };

  const PropertyCard = ({ property, viewMode }) => {
    const isFavorite = favorites.includes(property.id);
    
    if (viewMode === 'list') {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="flex">
            {/* Image */}
            <div className="relative w-80 h-48 flex-shrink-0">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlays */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full capitalize">
                  {property.type}
                </span>
                {property.featured && (
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
                {property.status === 'sold' && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                    Sold
                  </span>
                )}
              </div>
              
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={() => toggleFavorite(property.id)}
                  className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-4 w-4 text-red-500" />
                  ) : (
                    <HeartIcon className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>

              <div className="absolute bottom-3 right-3 flex space-x-1">
                {property.virtualTour && (
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">3D Tour</span>
                )}
                {property.videoTour && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Video</span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
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

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {property.description}
              </p>

              <div className="flex items-center space-x-2 mb-4">
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {property.location.address}, {property.location.city}
                </span>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-3 mb-4">
                {property.features.bedrooms && (
                  <div className="flex items-center space-x-1">
                    <HomeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {property.features.bedrooms} beds
                    </span>
                  </div>
                )}
                {property.features.bathrooms && (
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {property.features.bathrooms} baths
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {property.features.area} sqm
                  </span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={property.seller.avatar}
                    alt={property.seller.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {property.seller.name}
                  </span>
                  {property.seller.verified && (
                    <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="h-3 w-3" />
                    <span>{property.stats.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <HeartIcon className="h-3 w-3" />
                    <span>{property.stats.savedBy}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-2">
                <Link to={`/properties/${property.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Button className="flex-1">
                  Contact Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid view
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlays */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full capitalize">
              {property.type}
            </span>
            {property.featured && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                Featured
              </span>
            )}
            {property.status === 'sold' && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                Sold
              </span>
            )}
          </div>
          
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={() => toggleFavorite(property.id)}
              className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              {isFavorite ? (
                <HeartSolidIcon className="h-4 w-4 text-red-500" />
              ) : (
                <HeartIcon className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>

          <div className="absolute bottom-3 right-3 flex space-x-1">
            {property.virtualTour && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">3D</span>
            )}
            {property.videoTour && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Video</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
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

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center space-x-2 mb-3">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {property.location.address}, {property.location.city}
            </span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.features.bedrooms && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                {property.features.bedrooms} beds
              </span>
            )}
            {property.features.bathrooms && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                {property.features.bathrooms} baths
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
              {property.features.area} sqm
            </span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <img
                src={property.seller.avatar}
                alt={property.seller.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {property.seller.name}
              </span>
              {property.seller.verified && (
                <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <EyeIcon className="h-3 w-3" />
                <span>{property.stats.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <HeartIcon className="h-3 w-3" />
                <span>{property.stats.savedBy}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link to={`/properties/${property.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            <Button className="flex-1">
              Contact
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading properties..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Properties
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredProperties.length} properties found
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <MapIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FunnelIcon className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                
                {Object.values(filters).some(v => v && v !== 'all' && !(Array.isArray(v) && v.length === 0)) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popularity">Most Popular</option>
                  <option value="area-large">Largest Area</option>
                  <option value="area-small">Smallest Area</option>
                </select>
              </div>
            </div>

            {/* Content */}
            {viewMode === 'map' ? (
              <PropertyMap properties={filteredProperties} />
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;