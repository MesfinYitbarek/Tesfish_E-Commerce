// components/layout/Header.jsx - Compact Tailwind/Expo Inspired Design
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
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { logout } from '../../store/slices/authSlice';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import Button from '../ui/Button';
import { cn } from '../../utils/helpers';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href:'/about-us'},
    { name: 'Projects', href:'/projects'}
  ];

  const quickSearchSuggestions = [
    'Luxury Apartments in Bole',
    'Commercial Offices',
    'Land in Addis Ababa',
    'Toyota Vehicles'
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/60 dark:bg-slate-900/95 dark:border-slate-800/60 dark:shadow-slate-900/20'
        : 'bg-white/80 backdrop-blur-md border-b border-slate-200/40 dark:bg-slate-900/80 dark:border-slate-800/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  TesGold
                </span>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium -mt-0.5">
                  Marketplace
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === item.href
                    ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Enhanced Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-6">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <div className={`relative transition-all duration-300 ${
                  isSearchFocused ? 'transform scale-105' : ''
                }`}>
                  <input
                    type="text"
                    placeholder="Search properties, vehicles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="w-full h-9 pl-9 pr-10 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm focus:shadow-md transition-all duration-200"
                  />
                  <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 h-6 w-6 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                  >
                    <MagnifyingGlassIcon className="h-3 w-3" />
                  </button>
                </div>
              </form>

              {/* Quick Search Suggestions */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 backdrop-blur-sm">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center">
                    <SparklesIcon className="h-3 w-3 mr-1" />
                    Popular Searches
                  </div>
                  <div className="space-y-1">
                    {quickSearchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          navigate(`/products?search=${encodeURIComponent(suggestion)}`);
                          setIsSearchFocused(false);
                        }}
                        className="flex items-center w-full p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
                      >
                        <MagnifyingGlassIcon className="h-3 w-3 text-slate-400 mr-2 group-hover:text-blue-500 transition-colors" />
                        <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          {suggestion}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200">
                  <BellIcon className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                </button>
                
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group">
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                      <span className="text-white text-xs font-semibold">
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {user?.fullName?.split(' ')[0] || 'User'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {user?.userType || 'Member'}
                      </div>
                    </div>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-800 rounded-lg shadow-xl ring-1 ring-black/5 dark:ring-white/5 focus:outline-none backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                      <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {user?.fullName || 'User'}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {user?.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={cn(
                                'flex items-center px-2 py-2 text-sm rounded-md transition-colors',
                                active ? 'bg-slate-100 dark:bg-slate-700' : '',
                                'text-slate-700 dark:text-slate-300'
                              )}
                            >
                              <UserIcon className="h-4 w-4 mr-2" />
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={cn(
                                'flex items-center w-full px-2 py-2 text-sm rounded-md transition-colors',
                                active ? 'bg-red-50 dark:bg-red-900/20' : '',
                                'text-red-600 dark:text-red-400'
                              )}
                            >
                              <XMarkIcon className="h-4 w-4 mr-2" />
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-sm px-3 py-1.5">
                    Sign in
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 text-sm px-3 py-1.5">
                    Get started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      location.pathname === item.href
                        ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth */}
              {!isAuthenticated && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="space-y-2">
                    <Link to="/auth/login" className="block">
                      <Button variant="ghost" size="sm" className="w-full justify-center text-sm py-2">
                        Sign in
                      </Button>
                    </Link>
                    <Link to="/auth/register" className="block">
                      <Button size="sm" className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm py-2">
                        Get started
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Transition>
      </div>
    </header>
  );
};

export default Header;