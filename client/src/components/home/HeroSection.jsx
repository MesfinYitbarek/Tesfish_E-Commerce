import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  HomeIcon, 
  CurrencyDollarIcon,
  SparklesIcon,
  ChartBarIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import { PROPERTY_TYPES, PRICE_RANGES } from '../../constants';

const HeroSection = () => {
  const [searchType, setSearchType] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  // const [currentStatIndex, setCurrentStatIndex] = useState(0);
  // const [animatedValues, setAnimatedValues] = useState({ properties: 0, companies: 0, customers: 0 });
  
  const navigate = useNavigate();

  // // Animated stats
  // const stats = [
  //   { key: 'properties', value: 10000, label: 'Properties', suffix: '+', icon: HomeIcon },
  //   { key: 'companies', value: 500, label: 'Companies', suffix: '+', icon: BuildingOffice2Icon },
  //   { key: 'customers', value: 50000, label: 'Happy Customers', suffix: '+', icon: SparklesIcon }
  // ];

  // // Animate numbers on mount
  // useEffect(() => {
  //   const animateValue = (key, end) => {
  //     let start = 0;
  //     const duration = 2000;
  //     const stepTime = Math.abs(Math.floor(duration / end));
      
  //     const timer = setInterval(() => {
  //       start += Math.ceil(end / 100);
  //       setAnimatedValues(prev => ({ ...prev, [key]: Math.min(start, end) }));
  //       if (start >= end) clearInterval(timer);
  //     }, stepTime);
  //   };

  //   stats.forEach(stat => {
  //     animateValue(stat.key, stat.value);
  //   });
  // }, []);

  // // Auto-rotate featured highlight
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentStatIndex((prev) => (prev + 1) % stats.length);
  //   }, 4000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (location) params.append('location', location);
    if (propertyType) params.append('propertyType', propertyType);
    if (priceRange) {
      const range = PRICE_RANGES.find(r => r.label === priceRange);
      if (range?.min) params.append('minPrice', range.min);
      if (range?.max) params.append('maxPrice', range.max);
    }
    
    params.append('category', searchType === 'services' ? 'services' : 'real-estate');
    if (searchType === 'rent') {
      params.append('type', 'rental');
    }
    
    // Simulate search delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSearching(false);
    navigate(`/products?${params.toString()}`);
  };

  const searchTabs = [
    { id: 'buy', label: 'Buy Property', icon: HomeIcon, description: 'Find your dream home' },
    { id: 'rent', label: 'Rent Property', icon: HomeIcon, description: 'Discover rental options' },
    { id: 'services', label: 'Our Services', icon: CurrencyDollarIcon, description: 'Professional solutions' },
  ];

  const popularLocations = [
    'Addis Ababa', 'Bole', 'Kazanchis', 'Kirkos', 'Piazza', 'Megenagna', 'Gerji', 'CMC'
  ];

  const quickSearchTerms = [
    { term: 'Luxury Villas in Bole', type: 'buy', trending: true },
    { term: 'Modern Apartments', type: 'buy', trending: false },
    { term: 'Commercial Spaces', type: 'buy', trending: true },
    { term: 'Interior Design Services', type: 'services', trending: false },
    { term: 'Project Management', type: 'services', trending: true }
  ];

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
            Ethiopia's Premier Real Estate Platform
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Dream Property
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-purple-100 max-w-2xl mx-auto mb-6 leading-relaxed">
            Discover exceptional properties and premium services with{' '}
            <span className="font-semibold text-yellow-400">CitiLights</span>. 
            Your trusted partner for real estate, construction, and professional consulting.
          </p>
          
          {/* Compact Animated Statistics */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              const isHighlighted = currentStatIndex === index;
              
              return (
                <div 
                  key={stat.key}
                  className={`group relative p-3 rounded-lg transition-all duration-500 transform ${
                    isHighlighted 
                      ? 'bg-white/20 backdrop-blur-md scale-105 border border-yellow-400/50' 
                      : 'bg-white/10 backdrop-blur-md hover:bg-white/15 border border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    <IconComponent className={`h-5 w-5 transition-colors duration-300 ${
                      isHighlighted ? 'text-yellow-400' : 'text-purple-300'
                    }`} />
                  </div>
                  <div className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                    isHighlighted ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {animatedValues[stat.key].toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-purple-200 font-medium text-sm">{stat.label}</div>
                  
                  {isHighlighted && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute top-0 w-3 h-3 bg-yellow-400 rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div> */}
        </div>

        {/* Compact Search Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl p-4 lg:p-6 border border-white/20">
            {/* Compact Search Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
              {searchTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSearchType(tab.id)}
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

            <form onSubmit={handleSearch} className="space-y-4">
              {searchType !== 'services' ? (
                <>
                  {/* Compact Main Search Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="relative group">
                      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search properties, neighborhoods..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    
                    <div className="relative group">
                      <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm appearance-none bg-white/80 backdrop-blur-sm"
                      >
                        <option value="">Select Location</option>
                        {popularLocations.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Compact Filters Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm bg-white/80 backdrop-blur-sm"
                    >
                      <option value="">Property Type</option>
                      {Object.entries(PROPERTY_TYPES).map(([key, value]) => (
                        <option key={key} value={value}>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </option>
                      ))}
                    </select>

                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm bg-white/80 backdrop-blur-sm"
                    >
                      <option value="">Price Range</option>
                      {PRICE_RANGES.map((range) => (
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
                          Search Properties
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Compact Services Search */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                    <div className="relative group lg:col-span-3">
                      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search for project management, interior design..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    
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
                          Find Services
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>

            {/* Compact Quick Search Terms */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-600">Popular searches:</p>
                <ChartBarIcon className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-2">
                {quickSearchTerms.map((item) => (
                  <button
                    key={item.term}
                    onClick={() => {
                      setSearchQuery(item.term);
                      setSearchType(item.type);
                      const event = { preventDefault: () => {} };
                      handleSearch(event);
                    }}
                    className="group relative inline-flex items-center px-2.5 py-1 text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 transition-all duration-200 border border-gray-200 hover:border-purple-300"
                  >
                    <span>{item.term}</span>
                    {item.trending && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full font-medium">
                        Hot
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
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