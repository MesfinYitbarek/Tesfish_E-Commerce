import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  HomeIcon, 
  CalendarIcon, 
  EyeIcon,
  HeartIcon,
  ArrowRightIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

const RecentListings = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [wishlistedItems, setWishlistedItems] = useState(new Set());

  useEffect(() => {
    fetchRecentListings();
  }, [activeTab]);

  const fetchRecentListings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const allListings = [
          {
            id: 1,
            title: 'Modern 3BR Apartment with Panoramic Views',
            subtitle: 'Luxury Living in Prime Location',
            location: 'CMC, Addis Ababa',
            price: 4500000,
            currency: 'ETB',
            type: 'apartment',
            bedrooms: 3,
            bathrooms: 2,
            area: 140,
            images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'],
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            views: 145,
            likes: 23,
            isHot: true,
            isNew: true,
            seller: {
              name: 'Prime Properties',
              type: 'company',
              verified: true,
              rating: 4.8
            },
            category: 'real-estate',
            amenities: ['Balcony', 'Parking', 'Elevator', 'Security']
          },
          {
            id: 2,
            title: 'Luxury Villa with Private Swimming Pool',
            subtitle: 'Exclusive Family Residence',
            location: 'Old Airport, Addis Ababa',
            price: 18000000,
            currency: 'ETB',
            type: 'villa',
            bedrooms: 5,
            bathrooms: 4,
            area: 450,
            images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'],
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            views: 323,
            likes: 45,
            isHot: true,
            isNew: false,
            seller: {
              name: 'Sarah Johnson',
              type: 'individual',
              verified: true,
              rating: 4.9
            },
            category: 'real-estate',
            amenities: ['Garden', 'Pool', 'Garage', 'Security']
          },
          {
            id: 3,
            title: 'Complete Interior Design Transformation',
            subtitle: 'Modern Home Makeover Package',
            location: 'Addis Ababa',
            price: 85000,
            currency: 'ETB',
            type: 'service',
            images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            views: 167,
            likes: 31,
            isHot: false,
            isNew: true,
            seller: {
              name: 'Creative Spaces Design',
              type: 'company',
              verified: true,
              rating: 4.7
            },
            category: 'services',
            serviceType: 'interior-design',
            duration: '2-4 weeks'
          },
          {
            id: 4,
            title: 'Prime Commercial Office Space',
            subtitle: 'Premium Business Location',
            location: 'Mexico Square, Addis Ababa',
            price: 25000,
            currency: 'ETB',
            priceType: 'monthly',
            type: 'commercial',
            area: 200,
            images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'],
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
            views: 189,
            likes: 18,
            isHot: true,
            isNew: false,
            seller: {
              name: 'Office Solutions Ltd',
              type: 'company',
              verified: true,
              rating: 4.6
            },
            category: 'real-estate',
            amenities: ['Parking', 'Security', 'Generator', 'Elevator']
          },
          {
            id: 5,
            title: 'Professional Construction Management',
            subtitle: 'Expert Project Oversight',
            location: 'Nationwide',
            price: 150000,
            currency: 'ETB',
            type: 'service',
            images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'],
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
            views: 134,
            likes: 27,
            isHot: false,
            isNew: true,
            seller: {
              name: 'BuildRight Solutions',
              type: 'company',
              verified: true,
              rating: 4.9
            },
            category: 'services',
            serviceType: 'project-management',
            duration: '6-12 months'
          },
          {
            id: 6,
            title: 'Cozy Studio Apartment - Fully Furnished',
            subtitle: 'Perfect for Young Professionals',
            location: 'Piazza, Addis Ababa',
            price: 1800000,
            currency: 'ETB',
            type: 'apartment',
            bedrooms: 1,
            bathrooms: 1,
            area: 45,
            images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'],
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            views: 178,
            likes: 12,
            isHot: false,
            isNew: false,
            seller: {
              name: 'Michael Tesfaye',
              type: 'individual',
              verified: false,
              rating: 4.3
            },
            category: 'real-estate',
            amenities: ['Furnished', 'WiFi', 'Kitchen', 'Utilities']
          }
        ];

        let filteredListings = allListings;
        if (activeTab === 'real-estate') {
          filteredListings = allListings.filter(item => item.category === 'real-estate');
        } else if (activeTab === 'services') {
          filteredListings = allListings.filter(item => item.category === 'services');
        }

        setListings(filteredListings);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching recent listings:', error);
      setIsLoading(false);
    }
  };

  const toggleWishlist = (listingId) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listingId)) {
        newSet.delete(listingId);
      } else {
        newSet.add(listingId);
      }
      return newSet;
    });
  };

  const tabs = [
    { id: 'all', label: 'All Listings', count: listings.length, icon: SparklesIcon },
    { id: 'real-estate', label: 'Properties', count: listings.filter(l => l.category === 'real-estate').length, icon: HomeIcon },
    { id: 'services', label: 'Services', count: listings.filter(l => l.category === 'services').length, icon: ClockIcon }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-xs font-medium mb-3">
            <ClockIcon className="h-3 w-3 mr-1" />
            Fresh Additions
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Latest Listings
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the newest properties and services added to our platform. 
            Be the first to explore these fresh opportunities.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-lg font-medium text-xs transition-all duration-300 flex items-center ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading latest listings..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {listings.map((listing, index) => (
              <RecentListingCard
                key={listing.id}
                listing={listing}
                index={index}
                isWishlisted={wishlistedItems.has(listing.id)}
                onToggleWishlist={() => toggleWishlist(listing.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && listings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              No listings found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try selecting a different category or check back later for new listings.
            </p>
          </div>
        )}

        {/* View More Button */}
        {!isLoading && listings.length > 0 && (
          <div className="text-center">
            <Link to={`/products${activeTab !== 'all' ? `?category=${activeTab}` : ''}`}>
              <Button size="md" className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Explore All Listings
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

// Enhanced Recent Listing Card Component
const RecentListingCard = ({ listing, index, isWishlisted, onToggleWishlist }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Link to={`/product/${listing.id}`} className="group block">
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
        style={{ animationDelay: `${index * 150}ms` }}
      >
        {/* Image Container */}
        <div className="relative h-40 overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          )}
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onLoad={() => setImageLoading(false)}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {listing.isNew && (
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center">
                <SparklesIcon className="h-2 w-2 mr-0.5" />
                New
              </span>
            )}
            {listing.isHot && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center">
                <FireIcon className="h-2 w-2 mr-0.5" />
                Hot
              </span>
            )}
            {listing.seller.verified && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                ✓ Verified
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist();
            }}
            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:scale-110"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-4 w-4 text-red-500" />
            ) : (
              <HeartIcon className="h-4 w-4 text-gray-600" />
            )}
          </button>

          {/* Category Badge */}
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
              {listing.category === 'real-estate' ? listing.type : listing.serviceType || 'service'}
            </span>
          </div>

          {/* Stats Overlay */}
          <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md text-xs flex items-center">
              <EyeIcon className="h-2 w-2 mr-0.5" />
              {listing.views}
            </div>
            <div className="bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md text-xs flex items-center">
              <HeartIcon className="h-2 w-2 mr-0.5" />
              {listing.likes}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-1 line-clamp-1">
              {listing.title}
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {listing.subtitle}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
            <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0 text-blue-500" />
            <span className="text-xs truncate">{listing.location}</span>
          </div>

          {/* Property Features */}
          {listing.category === 'real-estate' && (
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                {listing.bedrooms && (
                  <div className="flex items-center">
                    <HomeIcon className="h-3 w-3 mr-0.5" />
                    <span>{listing.bedrooms} bed</span>
                  </div>
                )}
                {listing.bathrooms && (
                  <div>
                    <span>{listing.bathrooms} bath</span>
                  </div>
                )}
              </div>
              {listing.area && (
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {listing.area} sqm
                </div>
              )}
            </div>
          )}

          {/* Service Duration */}
          {listing.category === 'services' && listing.duration && (
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <ClockIcon className="h-3 w-3 mr-1 text-blue-500" />
              <span>Duration: {listing.duration}</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-3">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(listing.price, listing.currency)}
              {listing.priceType && (
                <span className="text-xs text-gray-500 font-normal">
                  /{listing.priceType}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {listing.seller.name.charAt(0)}
                  </span>
                </div>
                {listing.seller.verified && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="ml-2 flex-1">
                <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {listing.seller.name}
                </div>
                <div className="text-xs text-gray-500 capitalize flex items-center">
                  <span>{listing.seller.type}</span>
                  {listing.seller.rating && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="flex items-center">
                        ⭐ {listing.seller.rating}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 flex items-center">
              <CalendarIcon className="h-2 w-2 mr-0.5" />
              <span>{formatRelativeTime(listing.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecentListings;