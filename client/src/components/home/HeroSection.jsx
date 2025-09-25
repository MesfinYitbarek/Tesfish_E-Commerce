import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  SparklesIcon,
  ArrowRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const HeroSection = () => {
  const [searchType, setSearchType] = useState('homes');
  const [searchSubType, setSearchSubType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSubTypes, setShowSubTypes] = useState(false);
  
  const navigate = useNavigate();

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

  const searchTypes = [
    { id: 'homes', label: 'Homes', description: 'Houses & apartments' },
    { id: 'commercials', label: 'Commercial', description: 'Offices & shops' },
    { id: 'plots', label: 'Land', description: 'Plots & lots' },
    { id: 'others', label: 'Products', description: 'Electronics & more' }
  ];

  const locations = [
    'Addis Ababa', 'Bole', 'Kazanchis', 'Kirkos', 'Piazza', 'Megenagna',
    'Bahir Dar', 'Mekelle', 'Gondar', 'Awassa', 'Dire Dawa', 'Jimma'
  ];

  // Reset subtype when main type changes
  useEffect(() => {
    setSearchSubType('');
    setShowSubTypes(false);
  }, [searchType]);

  // Show subtypes after a brief delay when type is selected
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubTypes(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchType]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (location) params.append('city', location);
    params.append('productType', searchType);
    if (searchSubType) params.append('subProductType', searchSubType);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSearching(false);
    navigate(`/products?${params.toString()}`);
  };

  const currentSubTypes = productTypes[searchType]?.subTypes || [];

  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-sm mb-6">
            <SparklesIcon className="h-3 w-3 text-blue-600 mr-1.5" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Ethiopia's Premier Marketplace
            </span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="block text-slate-900 dark:text-white mb-1">
              Find your perfect
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              property & products
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover exceptional properties, vehicles, electronics and more 
            across Ethiopia with TesGold's trusted marketplace.
          </p>

          {/* Enhanced Search Form */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-4 lg:p-6 mb-8">
            {/* Search Type Selector */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 shadow-inner">
                {searchTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSearchType(type.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 relative group ${
                      searchType === type.id
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-sm">{type.label}</div>
                      <div className="text-xs opacity-75">{type.description}</div>
                    </div>
                    {searchType === type.id && (
                      <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtype Selector */}
            {showSubTypes && currentSubTypes.length > 0 && (
              <div className="mb-6 animate-fadeIn">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                  Choose {productTypes[searchType]?.label} Type
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setSearchSubType('')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      searchSubType === ''
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    All {productTypes[searchType]?.label}
                  </button>
                  {currentSubTypes.map((subType) => (
                    <button
                      key={subType.value}
                      onClick={() => setSearchSubType(subType.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        searchSubType === subType.value
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {subType.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Inputs */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Search Input */}
                <div className="lg:col-span-2 relative group">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder={`Search ${searchSubType ? 
                      currentSubTypes.find(st => st.value === searchSubType)?.label?.toLowerCase() : 
                      searchTypes.find(t => t.id === searchType)?.label.toLowerCase()
                    }...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
                
                {/* Location Selector */}
                <div className="relative group">
                  <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none"
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Filters Display */}
              {(searchSubType || location) && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Searching for:
                  </span>
                  {searchSubType && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-md">
                      {currentSubTypes.find(st => st.value === searchSubType)?.label}
                      <button
                        type="button"
                        onClick={() => setSearchSubType('')}
                        className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {location && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-medium rounded-md">
                      📍 {location}
                      <button
                        type="button"
                        onClick={() => setLocation('')}
                        className="ml-1 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Search Button */}
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={isSearching}
                  size="md"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {isSearching ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                      Search {searchSubType ? currentSubTypes.find(st => st.value === searchSubType)?.label : productTypes[searchType]?.label}
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Search Suggestions */}
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Popular searches:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { type: 'homes', subType: 'apartment', label: 'Apartments in Addis Ababa' },
                { type: 'commercials', subType: 'offices', label: 'Office Spaces' },
                { type: 'plots', subType: 'residential-land', label: 'Residential Land' },
                { type: 'others', subType: 'vehicles', label: 'Vehicles' }
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchType(suggestion.type);
                    setSearchSubType(suggestion.subType);
                    if (suggestion.label.includes('Addis Ababa')) {
                      setLocation('Addis Ababa');
                    }
                  }}
                  className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors duration-200"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;