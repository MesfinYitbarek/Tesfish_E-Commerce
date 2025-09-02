import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  HomeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  EyeIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CameraIcon,
  PlayIcon,
  CubeIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CustomerRegistrationModal from '../../components/Customer/CustomerRegistrationModal';
import PropertyInquiryModal from '../../components/properties/PropertyInquiryModal';
import { formatCurrency,formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
    checkFavoriteStatus();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock property data
      const mockProperty = {
        id: propertyId,
        title: 'Modern 3BR Apartment in CMC',
        description: 'Spacious and modern apartment with stunning city views, premium finishes, and convenient location near shopping centers. This beautiful property offers contemporary living with high-quality materials and thoughtful design throughout.',
        longDescription: `
          This exceptional 3-bedroom apartment represents the pinnacle of modern urban living in one of Addis Ababa's most sought-after neighborhoods. Located in the heart of CMC area, this property offers unparalleled convenience with easy access to major business districts, shopping centers, restaurants, and cultural attractions.

          The apartment features an open-plan living and dining area with floor-to-ceiling windows that flood the space with natural light and offer breathtaking city views. The modern kitchen is equipped with high-end appliances, granite countertops, and ample storage space.

          Each bedroom is generously sized with built-in wardrobes and large windows. The master bedroom includes an en-suite bathroom with premium fixtures. The property also features a spacious balcony perfect for relaxation and entertaining.

          Building amenities include 24/7 security, elevator access, backup generator, and dedicated parking. The location offers excellent connectivity to major roads and public transportation.
        `,
        price: 2500000,
        currency: 'ETB',
        type: 'apartment',
        status: 'available',
        images: [
          '/api/placeholder/800/600',
          '/api/placeholder/800/601',
          '/api/placeholder/800/602',
          '/api/placeholder/800/603',
          '/api/placeholder/800/604',
          '/api/placeholder/800/605',
          '/api/placeholder/800/606',
          '/api/placeholder/800/607'
        ],
        virtualTour: 'https://example.com/virtual-tour',
        videoTour: 'https://example.com/video-tour',
        location: {
          city: 'Addis Ababa',
          subcity: 'Yeka',
          kebele: '08',
          address: 'CMC area, near Megenagna',
          coordinates: { lat: 9.0084, lng: 38.7975 },
          landmarks: [
            'Megenagna Shopping Center (500m)',
            'CMC Hospital (300m)',
            'Bole International Airport (15km)',
            'Meskel Square (8km)'
          ]
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
          yearBuilt: 2022,
          orientation: 'East-facing',
          ceiling: '3.2m high'
        },
        amenities: [
          'Elevator', 'Security Guard', 'CCTV', 'Backup Generator', 
          'Water Tank', 'Parking Space', 'Balcony', 'Modern Kitchen',
          'Built-in Wardrobes', 'Tiled Flooring', 'Internet Ready',
          'Cable TV Ready'
        ],
        included: [
          'Kitchen appliances',
          'Light fixtures',
          'Built-in wardrobes',
          'Air conditioning units',
          'Window blinds'
        ],
        nearby: [
          { name: 'Megenagna Shopping Center', distance: '500m', type: 'shopping' },
          { name: 'CMC Hospital', distance: '300m', type: 'healthcare' },
          { name: 'International School', distance: '1.2km', type: 'education' },
          { name: 'Bole International Airport', distance: '15km', type: 'transport' },
          { name: 'Unity University', distance: '2km', type: 'education' },
          { name: 'Friendship Mall', distance: '1.5km', type: 'shopping' }
        ],
        seller: {
          name: 'Prime Properties Ltd',
          type: 'company',
          verified: true,
          avatar: '/api/placeholder/100/100',
          rating: 4.8,
          reviewCount: 156,
          totalProperties: 45,
          memberSince: '2018',
          responseTime: '2-4 hours',
          contact: {
            phone: '+251 911 123 456',
            email: 'info@primeproperties.et',
            website: 'www.primeproperties.et',
            address: 'Bole Medhanialem, Addis Ababa'
          },
          languages: ['English', 'Amharic', 'Oromo'],
          specializations: ['Residential', 'Commercial', 'Investment Properties']
        },
        stats: {
          views: 1250,
          inquiries: 45,
          savedBy: 89,
          lastViewed: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        featured: true,
        urgent: false,
        priceHistory: [
          { price: 2600000, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          { price: 2500000, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) }
        ],
        similarProperties: [
          {
            id: 'PROP-002',
            title: '2BR Apartment - Bole',
            price: 1800000,
            image: '/api/placeholder/300/200',
            bedrooms: 2,
            area: 85
          },
          {
            id: 'PROP-003',
            title: '4BR Villa - Old Airport',
            price: 4500000,
            image: '/api/placeholder/300/201',
            bedrooms: 4,
            area: 200
          }
        ],
        documents: [
          { name: 'Title Deed', verified: true },
          { name: 'Building Permit', verified: true },
          { name: 'Occupancy Certificate', verified: true },
          { name: 'Tax Clearance', verified: false }
        ]
      };

      setProperty(mockProperty);
    } catch (error) {
      console.error('Error fetching property details:', error);
      toast.error('Failed to load property details');
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
    setIsFavorite(favorites.includes(propertyId));
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
    const newFavorites = isFavorite
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    localStorage.setItem('favoriteProperties', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading property details..." />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Property Not Found
          </h1>
          <Link to="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/properties" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Properties
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {property.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="relative h-96">
                <img
                  src={property.images[activeImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowImageGallery(true)}
                />
                
                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Overlays */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full capitalize">
                    {property.type}
                  </span>
                  {property.featured && (
                    <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full">
                      Featured
                    </span>
                  )}
                  {property.urgent && (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                      Urgent
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ShareIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {activeImageIndex + 1} / {property.images.length}
                </div>

                {/* Tour Buttons */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  <button
                    onClick={() => setShowImageGallery(true)}
                    className="flex items-center space-x-2 bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    <CameraIcon className="h-4 w-4" />
                    <span>View All Photos</span>
                  </button>
                  {property.virtualTour && (
                    <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
                      <CubeIcon className="h-4 w-4" />
                      <span>3D Tour</span>
                    </button>
                  )}
                  {property.videoTour && (
                    <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
                      <PlayIcon className="h-4 w-4" />
                      <span>Video Tour</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {property.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === activeImageIndex
                          ? 'border-primary-500'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {property.location.address}, {property.location.city}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(property.price, property.currency)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ~{formatCurrency(Math.round(property.price / property.features.area), property.currency)} per sqm
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <HomeIcon className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {property.features.bedrooms}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {property.features.bathrooms}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {property.features.area}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Square Meters</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {property.features.yearBuilt}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Long Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  About This Property
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  {property.longDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>

              {/* Property Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Property Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(property.features).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Amenities & Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(showAllAmenities ? property.amenities : property.amenities.slice(0, 6)).map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                    </div>
                  ))}
                </div>
                {property.amenities.length > 6 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-3 text-primary-600 dark:text-primary-400 hover:underline text-sm"
                  >
                    {showAllAmenities ? 'Show Less' : `Show All ${property.amenities.length} Amenities`}
                  </button>
                )}
              </div>

              {/* Included Items */}
              {property.included && property.included.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    What's Included
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.included.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Places */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Nearby Places
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.nearby.map((place, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{place.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2 capitalize">({place.type})</span>
                      </div>
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {place.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {formatCurrency(property.price, property.currency)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(Math.round(property.price / property.features.area), property.currency)} per sqm
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button 
                  onClick={() => setShowRegistrationModal(true)}
                  className="w-full"
                  size="lg"
                >
                  Register Interest
                </Button>
                <Button 
                  onClick={() => setShowInquiryModal(true)}
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  Send Inquiry
                </Button>
              </div>

              {/* Seller Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Listed by
                </h4>
                
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={property.seller.avatar}
                    alt={property.seller.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                        {property.seller.name}
                      </h5>
                      {property.seller.verified && (
                        <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(property.seller.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {property.seller.rating} ({property.seller.reviewCount} reviews)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {property.seller.totalProperties} properties • Member since {property.seller.memberSince}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Typically responds in {property.seller.responseTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    <a 
                      href={`tel:${property.seller.contact.phone}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {property.seller.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <a 
                      href={`mailto:${property.seller.contact.email}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {property.seller.contact.email}
                    </a>
                  </div>
                </div>

                <div className="mt-4">
                  <Link to={`/companies/${property.seller.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Property Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Property Statistics
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Views</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {property.stats.views}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HeartIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Saved by</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {property.stats.savedBy} people
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Listed</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatRelativeTime(property.publishedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Updated</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatRelativeTime(property.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            {property.similarProperties && property.similarProperties.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Similar Properties
                </h4>
                <div className="space-y-4">
                  {property.similarProperties.map((similar) => (
                    <Link key={similar.id} to={`/properties/${similar.id}`}>
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <img
                          src={similar.image}
                          alt={similar.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {similar.title}
                          </h5>
                          <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                            {formatCurrency(similar.price, property.currency)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {similar.bedrooms} beds • {similar.area} sqm
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRegistrationModal && (
        <CustomerRegistrationModal
          property={property}
          onClose={() => setShowRegistrationModal(false)}
          onSuccess={() => {
            setShowRegistrationModal(false);
            // Handle success (e.g., redirect to payment)
          }}
        />
      )}

      {showInquiryModal && (
        <PropertyInquiryModal
          property={property}
          onClose={() => setShowInquiryModal(false)}
        />
      )}

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95">
          <div className="flex items-center justify-center min-h-screen p-4">
            <button
              onClick={() => setShowImageGallery(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            
            <div className="relative w-full max-w-4xl">
              <img
                src={property.images[activeImageIndex]}
                alt={property.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {activeImageIndex + 1} / {property.images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;