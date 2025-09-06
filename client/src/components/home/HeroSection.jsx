// components/home/HeroSection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  HomeIcon, 
  BuildingOfficeIcon,
  SparklesIcon,
  ChartBarIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const HeroSection = () => {
  const [searchType, setSearchType] = useState('homes');
  const [listingType, setListingType] = useState('sell');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [subProductType, setSubProductType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();

  // Product type configurations based on backend schema
  const productTypes = {
    homes: {
      label: 'Homes',
      subTypes: [
        { value: 'houses', label: 'Houses' },
        { value: 'apartment', label: 'Apartments' },
        { value: 'villas', label: 'Villas' },
        { value: 'condos', label: 'Condos' },
        { value: 'townhouses', label: 'Townhouses' }
      ]
    },
    plots: {
      label: 'Land & Plots',
      subTypes: [
        { value: 'residential-land', label: 'Residential Land' },
        { value: 'commercial-land', label: 'Commercial Land' },
        { value: 'mixed-use-land', label: 'Mixed Use Land' },
        { value: 'agricultural-land', label: 'Agricultural Land' }
      ]
    },
    commercials: {
      label: 'Commercial',
      subTypes: [
        { value: 'offices', label: 'Offices' },
        { value: 'warehouses', label: 'Warehouses' },
        { value: 'shops', label: 'Shops' },
        { value: 'buildings', label: 'Buildings' },
        { value: 'factories', label: 'Factories' },
        { value: 'hotels', label: 'Hotels' }
      ]
    },
    others: {
      label: 'Others',
      subTypes: [
        { value: 'vehicles', label: 'Vehicles' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'furnitures', label: 'Furniture' },
        { value: 'construction-equipment', label: 'Construction Equipment' },
        { value: 'agricultural-products', label: 'Agricultural Products' }
      ]
    }
  };

  const priceRanges = [
    { min: 0, max: 100000, label: 'Under 100K ETB' },
    { min: 100000, max: 500000, label: '100K - 500K ETB' },
    { min: 500000, max: 1000000, label: '500K - 1M ETB' },
    { min: 1000000, max: 2000000, label: '1M - 2M ETB' },
    { min: 2000000, max: 5000000, label: '2M - 5M ETB' },
    { min: 5000000, max: 10000000, label: '5M - 10M ETB' },
    { min: 10000000, max: 50000000, label: '10M - 50M ETB' },
    { min: 50000000, max: null, label: 'Above 50M ETB' }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    const params = new URLSearchParams();
    
    // Basic search parameters
    if (searchQuery) params.append('search', searchQuery);
    if (location) params.append('city', location);
    
    // Product type parameters
    params.append('productType', searchType);
    if (subProductType) params.append('subProductType', subProductType);
    
    // For real estate types, add listing type
    if (['homes', 'plots', 'commercials'].includes(searchType)) {
      params.append('listingType', listingType);
    }
    
    // Price range
    if (priceRange) {
      const range = priceRanges.find(r => r.label === priceRange);
      if (range?.min) params.append('minPrice', range.min);
      if (range?.max) params.append('maxPrice', range.max);
    }
    
    // Default sort
    params.append('sort', 'featured');
    
    // Simulate search delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSearching(false);
    navigate(`/products?${params.toString()}`);
  };

  const searchTabs = [
    { 
      id: 'homes', 
      label: 'Homes', 
      icon: HomeIcon, 
      description: 'Houses, apartments, villas' 
    },
    { 
      id: 'plots', 
      label: 'Land & Plots', 
      icon: MapPinIcon, 
      description: 'Residential & commercial land' 
    },
    { 
      id: 'commercials', 
      label: 'Commercial', 
      icon: BuildingOfficeIcon, 
      description: 'Offices, shops, warehouses' 
    },
    { 
      id: 'others', 
      label: 'Others', 
      icon: BuildingOffice2Icon, 
      description: 'Vehicles, electronics & more' 
    }
  ];

  const popularLocations = [
    'Addis Ababa', 'Bole', 'Kazanchis', 'Kirkos', 'Piazza', 'Megenagna', 'Gerji', 'CMC',
    'Bahir Dar', 'Mekelle', 'Gondar', 'Awassa', 'Dire Dawa', 'Jimma', 'Dessie', 'Harar'
  ];

  // Check if current search type supports rental
  const supportsRental = ['homes', 'commercials'].includes(searchType);

  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-5 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-20 right-5 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-4 left-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-pattern-cross-light"></div>
      
      <div className="relative container mx-auto px-4 py-8 lg:py-12">
        {/* Compact Header Content */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-medium mb-4 border border-white/20">
            <SparklesIcon className="h-3 w-3 mr-1 text-yellow-400" />
            Ethiopia's Premier Properties & Services
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Property & Products
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-purple-100 max-w-2xl mx-auto mb-6 leading-relaxed">
            Discover exceptional properties, vehicles, electronics and more with{' '}
            <span className="font-semibold text-yellow-400">CitiLights</span>. 
            Your trusted marketplace for buying, selling, and renting in Ethiopia.
          </p>                     
        </div>

        {/* Compact Search Form */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl p-4 lg:p-6 border border-white/20">
            {/* Compact Search Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {searchTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSearchType(tab.id);
                      setSubProductType(''); // Reset sub type when changing main type
                    }}
                    className={`relative p-3 rounded-lg transition-all duration-300 text-left ${
                      searchType === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <IconComponent className="h-4 w-4 mr-2" />
                      <span className="font-semibold text-sm">{tab.label}</span>
                    </div>
                    <p className={`text-xs ${searchType === tab.id ? 'text-purple-100' : 'text-gray-500'}`}>
                      {tab.description}
                    </p>
                    
                    {searchType === tab.id && (
                      <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Listing Type Toggle for Real Estate */}
            {supportsRental && (
              <div className="flex items-center justify-center mb-4">
                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setListingType('sell')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      listingType === 'sell'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setListingType('rent')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      listingType === 'rent'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    Rent
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSearch} className="space-y-4">
              {/* Main Search Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="relative group">
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="text"
                    placeholder={`Search ${productTypes[searchType]?.label.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm bg-white/80 backdrop-blur-sm text-base"
                  />
                </div>
                
                <div className="relative group">
                  <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm appearance-none bg-white/80 backdrop-blur-sm text-base"
                  >
                    <option value="">Select Location</option>
                    {popularLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={subProductType}
                  onChange={(e) => setSubProductType(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm bg-white/80 backdrop-blur-sm text-base"
                >
                  <option value="">{productTypes[searchType]?.label} Type</option>
                  {productTypes[searchType]?.subTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm bg-white/80 backdrop-blur-sm text-base"
                >
                  <option value="">Price Range</option>
                  {priceRanges.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>

                <Button 
                  type="submit" 
                  disabled={isSearching}
                  className="w-full py-2.5 text-sm bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                      Search Now
                    </>
                  )}
                </Button>
              </div>
            </form>          
          </div>
        </div>

      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;