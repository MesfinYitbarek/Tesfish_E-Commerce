import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  HomeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  UserIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../store/slices/authSlice';

const CustomerDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myInquiries } = useSelector((state) => state.serviceInquiry);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Calculate service inquiry counts
  const pendingQuotes = myInquiries?.filter(inquiry => 
    inquiry.status === 'quoted' && 
    inquiry.quotes?.some(quote => quote.status === 'pending')
  ).length || 0;

  const activeProjects = myInquiries?.filter(inquiry => 
    ['accepted', 'in-progress'].includes(inquiry.status)
  ).length || 0;

  const unreadMessages = 3; // This should come from your messages state
  const unreadNotifications = 5; // This should come from your notifications state

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/customer/dashboard', 
      icon: HomeIcon,
      description: 'Overview and recent activity'
    },
    { 
      name: 'Service Inquiries', 
      href: '/customer/dashboard/inquiries', 
      icon: WrenchScrewdriverIcon,
      description: 'Your service requests and projects',
      badge: pendingQuotes > 0 ? pendingQuotes : null,
      subItems: [
        { name: 'All Inquiries', href: '/customer/dashboard/inquiries' },
        { name: 'Pending Quotes', href: '/customer/dashboard/inquiries?status=quoted', badge: pendingQuotes },
        { name: 'Active Projects', href: '/customer/dashboard/inquiries?status=in-progress', badge: activeProjects }
      ]
    },
    { 
      name: 'My Registrations', 
      href: '/customer/registrations', 
      icon: DocumentTextIcon,
      description: 'Property registration status'
    },
    { 
      name: 'My Appointments', 
      href: '/customer/bookings', 
      icon: DocumentTextIcon,
      description: 'Property Appointment status'
    },
    { 
      name: 'Payment History', 
      href: '/customer/payments', 
      icon: CreditCardIcon,
      description: 'Payment records and receipts'
    },
    { 
      name: 'Messages', 
      href: '/customer/messages', 
      icon: ChatBubbleLeftRightIcon,
      description: 'Communication with providers',
      badge: unreadMessages > 0 ? unreadMessages : null
    },
    { 
      name: 'Saved Properties', 
      href: '/customer/favorites', 
      icon: HeartIcon,
      description: 'Your favorite properties'
    },
    { 
      name: 'Notifications', 
      href: '/customer/notifications', 
      icon: BellIcon,
      description: 'Updates and alerts',
      badge: unreadNotifications > 0 ? unreadNotifications : null
    },
    { 
      name: 'Profile', 
      href: '/customer/profile', 
      icon: UserIcon,
      description: 'Account settings and preferences'
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can dispatch this to your theme slice if you have one
  };

  const isActive = (path) => {
    if (path === '/customer/dashboard') {
      return location.pathname === '/customer' || location.pathname === '/customer/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }) => {
    const active = isActive(item.href);
    const [isExpanded, setIsExpanded] = useState(active);

    return (
      <div>
        <Link
          to={item.href}
          onClick={(e) => {
            if (item.subItems) {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            } else {
              setIsSidebarOpen(false);
            }
          }}
          className={`flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
            active
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block truncate">
                {item.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {item.badge && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
            {item.subItems && (
              <svg
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </Link>

        {/* Sub Items */}
        {item.subItems && isExpanded && (
          <div className="ml-8 mt-2 space-y-1">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                  location.pathname === subItem.href || 
                  (subItem.href.includes('?') && location.pathname === subItem.href.split('?')[0] && location.search.includes(subItem.href.split('?')[1]))
                    ? 'bg-primary-100 dark:bg-primary-800/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="truncate">{subItem.name}</span>
                {subItem.badge && subItem.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[18px] text-center flex-shrink-0 ml-2">
                    {subItem.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgb(156 163 175);
          border-radius: 3px;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgb(75 85 99);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgb(107 114 128);
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgb(55 65 81);
        }
      `}</style>

      {/* Navbar for Desktop */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="pl-64"> {/* Account for sidebar width */}
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left Side - Breadcrumbs/Page Title */}
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {(() => {
                  switch (location.pathname) {
                    case '/customer':
                    case '/customer/dashboard':
                      return 'Dashboard';
                    case '/customer/dashboard/inquiries':
                      return 'Service Inquiries';
                    case '/customer/registrations':
                      return 'My Registrations';
                    case '/customer/payments':
                      return 'Payment History';
                    case '/customer/messages':
                      return 'Messages';
                    case '/customer/favorites':
                      return 'Saved Properties';
                    case '/customer/notifications':
                      return 'Notifications';
                    case '/customer/profile':
                      return 'Profile';
                    default:
                      return 'Customer Portal';
                  }
                })()}
              </h1>
            </div>

            {/* Right Side - Search, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <BellIcon className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>

              {/* Messages */}
              <Link
                to="/customer/messages"
                className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.customerProfile?.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.customerProfile?.firstName 
                        ? `${user.customerProfile.firstName} ${user.customerProfile.lastName}` 
                        : user?.firstName 
                        ? `${user.firstName} ${user.lastName}`
                        : 'Customer User'
                      }
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col h-full`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <Link to="/">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Customer Portal
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back!
              </p>
            </Link>
          </div>
          
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user?.customerProfile?.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'C'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.customerProfile?.firstName 
                  ? `${user.customerProfile.firstName} ${user.customerProfile.lastName}` 
                  : user?.firstName 
                  ? `${user.firstName} ${user.lastName}`
                  : 'Customer User'
                }
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'customer@email.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {(pendingQuotes > 0 || activeProjects > 0) && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3">
              {pendingQuotes > 0 && (
                <Link
                  to="/customer/dashboard/inquiries?status=quoted"
                  className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100">{pendingQuotes}</p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">Pending</p>
                    </div>
                  </div>
                </Link>
              )}
              
              {activeProjects > 0 && (
                <Link
                  to="/customer/dashboard/inquiries?status=in-progress"
                  className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">{activeProjects}</p>
                      <p className="text-xs text-green-700 dark:text-green-300">Active</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Navigation - Scrollable Area */}
        <div className="flex-1 overflow-hidden min-h-0">
          <nav className="h-full p-4 space-y-2 overflow-y-auto scrollbar-thin">
            {navigationItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="space-y-2">
            <Link
              to="/customer/settings"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Customer Portal
          </h1>
          <div className="flex items-center space-x-2">
            {/* Mobile notification badges */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <BellIcon className="h-5 w-5" />
              {(unreadNotifications + unreadMessages) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {(unreadNotifications + unreadMessages) > 9 ? '9+' : (unreadNotifications + unreadMessages)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 lg:pt-16"> {/* ml-64 for sidebar width, pt-16 for navbar height on desktop */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;