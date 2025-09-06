import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CogIcon,
  ChevronDownIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { logout } from '../../store/slices/authSlice';
import { toggleDarkMode, toggleModal } from '../../store/slices/uiSlice';
import Button from '../ui/Button';
import { cn } from '../../utils/helpers';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);


  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'All Products', href: '/products' },
  ];

  const quickSearchSuggestions = [
    { query: 'Luxury Villas in Bole', category: 'real-estate' },
    { query: 'Commercial Offices', category: 'real-estate' },
    { query: 'Interior Design Services', category: 'services' },
    { query: 'Apartments under 5M ETB', category: 'real-estate' },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-200 dark:bg-gray-950/95 dark:border-gray-800'
        : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 dark:bg-gray-950/80 dark:border-gray-800/50'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Compact Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                  CitiLights
                </span>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium leading-none">
                  Premium Real Estate
                </div>
              </div>
            </Link>
          </div>

          {/* Compact Search Bar */}
          <div className="flex-1 max-w-lg mx-6 hidden lg:block">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''
                  }`}>
                  <input
                    type="text"
                    placeholder="Search properties, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="w-full h-8 pl-8 pr-10 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 transition-all duration-300"
                  />
                  <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1 h-6 w-6 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-110"
                  >
                    <MagnifyingGlassIcon className="h-3 w-3" />
                  </button>
                </div>
              </form>

              {/* Compact Quick Search Suggestions */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-50">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Popular Searches
                  </div>
                  <div className="space-y-1">
                    {quickSearchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion.query);
                          navigate(`/products?search=${encodeURIComponent(suggestion.query)}&category=${suggestion.category}`);
                          setIsSearchFocused(false);
                        }}
                        className="flex items-center w-full p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <MagnifyingGlassIcon className="h-3 w-3 text-gray-400 mr-2" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">{suggestion.query}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compact Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.key)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center px-2 py-1.5 text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                      {item.name}
                      <ChevronDownIcon className={`ml-1 h-3 w-3 transition-transform duration-200 ${activeDropdown === item.key ? 'rotate-180' : ''
                        }`} />
                    </button>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-2 py-1.5 text-xs font-medium transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 ${location.pathname === item.href
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                      }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Compact Right Side Actions */}
          <div className="flex items-center space-x-1">
            {/* Compact Dark Mode Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
            </button>
            {/* Compact Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-1">
                {/* Compact Notifications */}
                <button className="relative p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110">
                  <BellIcon className="h-4 w-4" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                </button>

                {/* Compact User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 rounded-lg p-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ring-1 ring-white dark:ring-gray-800">
                      <span className="text-white text-xs font-bold">
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                        {user?.fullName?.split(' ')[0] || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.userType || 'Member'}
                      </div>
                    </div>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-1 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-700">
                      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {user?.fullName || 'User'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </div>
                      </div>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={cn(
                              'flex items-center px-3 py-2 text-xs text-gray-700 dark:text-gray-300',
                              active && 'bg-gray-50 dark:bg-gray-700'
                            )}
                          >
                            <UserIcon className="h-3 w-3 mr-2" />
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={cn(
                              'flex items-center w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400',
                              active && 'bg-gray-50 dark:bg-gray-700'
                            )}
                          >
                            <XMarkIcon className="h-3 w-3 mr-2" />
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Link
                  to="/auth/login"
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex text-xs px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs px-2 py-1 round-md"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-4 w-4" />
              ) : (
                <Bars3Icon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Compact Mobile Menu */}
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-3">
            {/* Compact Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search properties, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-gray-200 bg-white text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
              <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
            </form>

            {/* Compact Mobile Navigation */}
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-2 px-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === item.href
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Compact Mobile Auth Section */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      dispatch(toggleModal({ modal: 'login', isOpen: true }));
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      dispatch(toggleModal({ modal: 'register', isOpen: true }));
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-xs"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Transition>
      </div>
    </header>
  );
};

export default Header;