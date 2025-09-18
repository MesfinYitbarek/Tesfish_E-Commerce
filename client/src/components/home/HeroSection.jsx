// components/home/HeroSection.jsx - Compact Design
import { useState } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();

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

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (location) params.append('city', location);
    params.append('productType', searchType);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSearching(false);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[75vh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
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
        <div className="text-center max-w-4xl mx-auto">
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

            {/* Search Inputs */}
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Search Input */}
                <div className="lg:col-span-2 relative group">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder={`Search ${searchTypes.find(t => t.id === searchType)?.label.toLowerCase()}...`}
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

              {/* Search Button */}
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={isSearching}
                  size="md"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {isSearching ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                      Search Now
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center group">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                15K+
              </div>
              <div className="text-sm lg:text-base text-slate-600 dark:text-slate-300">
                Properties Listed
              </div>
            </div>
            <div className="text-center group">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                8K+
              </div>
              <div className="text-sm lg:text-base text-slate-600 dark:text-slate-300">
                Products Available
              </div>
            </div>
            <div className="text-center group">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                50K+
              </div>
              <div className="text-sm lg:text-base text-slate-600 dark:text-slate-300">
                Happy Customers
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;