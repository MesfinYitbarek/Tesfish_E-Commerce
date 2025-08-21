import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MapPinIcon, 
  HomeIcon,
  EyeIcon,
  CalendarIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { HeartIcon, PlayIcon } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || viewMode !== 'carousel') return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(properties.length / getItemsPerSlide()));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, properties.length, viewMode]);

  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  };

  const fetchFeaturedProperties = async () => {
    try {
      // Simulate API call with enhanced data
      setTimeout(() => {
        setProperties([
          {
            id: 1,
            title: 'Luxury Modern Villa',
            subtitle: 'Exclusive Bole Residence',
            location: 'Bole, Addis Ababa',
            price: 8500000,
            currency: 'ETB',
            originalPrice: 9200000,
            bedrooms: 4,
            bathrooms: 3,
            area: 350,
            lotSize: 800,
            yearBuilt: 2023,
            propertyType: 'villa',
            status: 'new',
            images: [
              'https://pfst.cf2.poecdn.net/base/image/70fc72a6f139f7623b25514d5c5b01d32c3115c8447048c0be1aca5a1e4c5603?w=400&h=300',
              'https://pfst.cf2.poecdn.net/base/image/b0fde61b62d48888ae7ab01620281a9c802c8d39a03486f05e360cb5b168c34f?w=400&h=300',
              'https://pfst.cf2.poecdn.net/base/image/38cffc87dfc5ef9f0bfd994fae5da0984e5b4cc545d5e69eb78ebccb9707ee0f?w=400&h=300'
            ],
            virtualTour: true,
            featured: true,
            trending: true,
            views: 1250,
            daysListed: 5,
            seller: {
              name: 'Ethiopian Real Estate Co.',
              type: 'company',
              rating: 4.8,
              verified: true,
              responseTime: '2 hours'
            },
            amenities: ['Swimming Pool', 'Garden', 'Garage', 'Security'],
            description: 'Stunning modern villa with panoramic city views and premium finishes.'
          },
          {
            id: 2,
            title: 'Modern Penthouse Apartment',
            subtitle: 'Downtown Premium Living',
            location: 'Kazanchis, Addis Ababa',
            price: 3200000,
            currency: 'ETB',
            originalPrice: 3500000,
            bedrooms: 2,
            bathrooms: 2,
            area: 120,
            yearBuilt: 2022,
            propertyType: 'apartment',
            status: 'hot',
            images: [
              'https://pfst.cf2.poecdn.net/base/image/48ac674d3c841ecbe9558a3b8b612ea8d55a83c7d0f36afad825d931ee50b193?w=400&h=300',
              'https://pfst.cf2.poecdn.net/base/image/75f85cac6379d6beef1257a412ceb179c81657d7b512b9fe0b67ddd9d052dccf?w=400&h=300'
            ],
            virtualTour: false,
            featured: true,
            trending: false,
            views: 890,
            daysListed: 12,
            seller: {
              name: 'John Doe',
              type: 'individual',
              rating: 4.5,
              verified: true,
              responseTime: '1 hour'
            },
            amenities: ['Balcony', 'Parking', 'Elevator', 'Gym'],
            description: 'Stylish penthouse with modern amenities in the heart of the city.'
          },
          {
            id: 3,
            title: 'Prime Commercial Space',
            subtitle: 'Investment Opportunity',
            location: 'Merkato, Addis Ababa',
            price: 12000000,
            currency: 'ETB',
            area: 500,
            yearBuilt: 2021,
            propertyType: 'commercial',
            status: 'investment',
            images: [
              'https://pfst.cf2.poecdn.net/base/image/cd7b1680a45c74758acc3c4d8f1ffd52cdcefba38b486e3b1224552df90611c6?w=400&h=300',
              'https://pfst.cf2.poecdn.net/base/image/ea23fcbc93ff81847940047abdb95f94ae1e4b38fff2bd61ebc5b0339b5c145d?w=400&h=300'
            ],
            virtualTour: true,
            featured: true,
            trending: true,
            views: 2100,
            daysListed: 8,
            seller: {
              name: 'Prime Properties Ltd.',
              type: 'company',
              rating: 4.9,
              verified: true,
              responseTime: '30 minutes'
            },
            amenities: ['Parking', 'Security', 'Generator', 'Elevator'],
            description: 'Excellent commercial space in high-traffic area with great ROI potential.'
          },
          {
            id: 4,
            title: 'Luxury Penthouse Suite',
            subtitle: 'Sky-High Living',
            location: 'Gerji, Addis Ababa',
            price: 15000000,
            currency: 'ETB',
            bedrooms: 3,
            bathrooms: 2,
            area: 200,
            yearBuilt: 2023,
            propertyType: 'apartment',
            status: 'luxury',
            images: [
              'https://pfst.cf2.poecdn.net/base/image/c34db93ea0de6414b64552693881eb9c866c920f171ee40d6cbbcd873036052a?w=400&h=300'
            ],
            virtualTour: true,
            featured: true,
            trending: false,
            views: 1580,
            daysListed: 3,
            seller: {
              name: 'Luxury Homes Ethiopia',
              type: 'company',
              rating: 4.7,
              verified: true,
              responseTime: '1 hour'
            },
            amenities: ['City View', 'Terrace', 'Jacuzzi', 'Smart Home'],
            description: 'Exclusive penthouse with breathtaking views and luxury amenities.'
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(properties.length / getItemsPerSlide()));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(properties.length / getItemsPerSlide())) % Math.ceil(properties.length / getItemsPerSlide()));
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Featured Properties
            </h2>
          </div>
          <LoadingSpinner size="lg" text="Loading featured properties..." />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="max-w-xl">
            <div className="flex items-center mb-2">
              <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
              <span className="px-2 py-1 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 rounded-full text-xs font-medium">
                Hand-picked Selection
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Featured Properties
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover our curated collection of premium properties across Ethiopia.
            </p>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2">
            {/* Compact View Mode Toggle */}
            <div className="flex bg-white dark:bg-gray-800 rounded-md p-0.5 shadow-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Carousel
              </button>
            </div>
            
            {/* Compact Navigation Controls */}
            {viewMode === 'carousel' && (
              <div className="flex space-x-1">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                >
                  <ChevronLeftIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                >
                  <ChevronRightIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border ${
                    autoPlay
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <PlayIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Compact Properties Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(properties.length / getItemsPerSlide()) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
                    {properties
                      .slice(slideIndex * getItemsPerSlide(), slideIndex * getItemsPerSlide() + getItemsPerSlide())
                      .map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Compact Carousel Indicators */}
            <div className="flex justify-center mt-4 space-x-1">
              {Array.from({ length: Math.ceil(properties.length / getItemsPerSlide()) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-purple-500 scale-125'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-purple-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {viewMode === 'carousel' && (
          <div className="flex lg:hidden justify-center mt-4 space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Compact Call to Action */}
        <div className="text-center mt-8">
          <Link to="/products?category=real-estate">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm px-6 py-2">
              Explore All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Compact Property Card Component
const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const getStatusBadge = () => {
    const statusConfig = {
      new: { color: 'bg-green-500', text: 'New' },
      hot: { color: 'bg-red-500', text: 'Hot' },
      luxury: { color: 'bg-purple-500', text: 'Luxury' },
      investment: { color: 'bg-blue-500', text: 'Investment' }
    };
    
    return statusConfig[property.status] || { color: 'bg-gray-500', text: 'Available' };
  };

  const statusBadge = getStatusBadge();

  return (
    <Link to={`/product/${property.id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
        {/* Compact Image Gallery */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onLoad={() => setIsImageLoading(false)}
          />
          
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Compact Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80"
              >
                <ChevronLeftIcon className="h-3 w-3" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80"
              >
                <ChevronRightIcon className="h-3 w-3" />
              </button>
              
              {/* Compact Image Indicators */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Compact Top Badges Row */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
            <div className="flex flex-col space-y-1">
              <span className={`${statusBadge.color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                {statusBadge.text}
              </span>
              {property.trending && (
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center">
                  <FireIcon className="h-2.5 w-2.5 mr-0.5" />
                  Trending
                </span>
              )}
            </div>
            
            <div className="flex flex-col space-y-1">
              {property.virtualTour && (
                <div className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center">
                  <EyeIcon className="h-2.5 w-2.5 mr-0.5" />
                  VR
                </div>
              )}
              <button
                onClick={handleWishlist}
                className="p-1 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
              >
                <HeartIcon 
                  className={`h-3.5 w-3.5 transition-colors duration-200 ${
                    isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Property Details */}
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-500 transition-colors duration-200 mb-0.5 line-clamp-1">
                {property.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {property.subtitle}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(property.price, property.currency)}
              </div>
              {property.originalPrice && property.originalPrice > property.price && (
                <div className="text-xs text-gray-400 line-through">
                  {formatCurrency(property.originalPrice, property.currency)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
            <MapPinIcon className="h-3 w-3 mr-1 text-purple-500" />
            <span className="text-xs line-clamp-1">{property.location}</span>
          </div>

          {/* Compact Property Features */}
          {(property.bedrooms || property.bathrooms || property.area) && (
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center space-x-3">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <HomeIcon className="h-3 w-3 mr-0.5" />
                    <span>{property.bedrooms} bed</span>
                  </div>
                )}
                {property.bathrooms && (
                  <span>{property.bathrooms} bath</span>
                )}
              </div>
              {property.area && (
                <div className="font-medium text-purple-600 dark:text-purple-400">
                  {property.area} sqm
                </div>
              )}
            </div>
          )}

          {/* Compact Stats Row */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <div className="flex items-center">
              <EyeIcon className="h-3 w-3 mr-0.5" />
              <span>{property.views}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-0.5" />
              <span>{property.daysListed}d ago</span>
            </div>
          </div>

          {/* Compact Seller Info */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {property.seller.name.charAt(0)}
                  </span>
                </div>
                {property.seller.verified && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="ml-2">
                <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {property.seller.name}
                </div>
                <div className="text-xs text-gray-500 capitalize flex items-center">
                  <span>{property.seller.type}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <StarIcon className="h-3 w-3 text-yellow-400 mr-0.5" />
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {property.seller.rating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedProperties;