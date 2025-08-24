import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../store/slices/authSlice';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.serviceInquiry);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Mock admin stats (you can replace with actual data from Redux)
  const pendingApprovals = 12;
  const flaggedUsers = 3;
  const pendingServiceInquiries = stats?.statusDistribution?.find(s => s._id === 'pending')?.count || 0;
  const pendingQuotes = stats?.statusDistribution?.find(s => s._id === 'quoted')?.count || 0;

  useEffect(() => {
    // Check for dark mode preference
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const NavItem = ({ to, icon, label, badge, end = false, children = null }) => {
    const isActive = end 
      ? location.pathname === to 
      : location.pathname.startsWith(to);

    const [isExpanded, setIsExpanded] = useState(isActive);

    return (
      <div>
        <Link
          to={to}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive
              ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={(e) => {
            if (children) {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            } else {
              setSidebarOpen(false);
            }
          }}
        >
          <span className="mr-3">{icon}</span>
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
          {children && (
            <svg
              className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </Link>
        
        {children && isExpanded && (
          <div className="ml-6 mt-2 space-y-1">
            {children}
          </div>
        )}
      </div>
    );
  };

  const SubNavItem = ({ to, label, badge }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link
        to={to}
        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
          isActive
            ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="flex items-center justify-between">
          <span>{label}</span>
          {badge && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/admin" className="text-xl font-bold text-red-600 dark:text-red-400">
              Admin Panel
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <NavItem 
              to="/admin" 
              icon={<HomeIcon className="h-5 w-5" />}
              label="Dashboard"
              end 
            />
            
            <NavItem 
              to="/admin/users" 
              icon={<UsersIcon className="h-5 w-5" />}
              label="User Management"
              badge={flaggedUsers > 0 ? flaggedUsers : null}
            />
            
            <NavItem 
              to="/admin/listings" 
              icon={<BuildingOfficeIcon className="h-5 w-5" />}
              label="Listing Moderation"
              badge={pendingApprovals > 0 ? pendingApprovals : null}
            />

            {/* Service Management */}
            <NavItem 
              to="/admin/services" 
              icon={<WrenchScrewdriverIcon className="h-5 w-5" />}
              label="Service Management"
              badge={pendingServiceInquiries + pendingQuotes > 0 ? pendingServiceInquiries + pendingQuotes : null}
            >
              <SubNavItem 
                to="/admin/services" 
                label="Overview" 
              />
              <SubNavItem 
                to="/admin/services/inquiries" 
                label="All Inquiries" 
                badge={pendingServiceInquiries > 0 ? pendingServiceInquiries : null}
              />
              <SubNavItem 
                to="/admin/services/analytics" 
                label="Analytics" 
              />
            </NavItem>
            
            <NavItem 
              to="/admin/analytics" 
              icon={<ChartBarIcon className="h-5 w-5" />}
              label="Platform Analytics"
            />
            
            <NavItem 
              to="/admin/reports" 
              icon={<ExclamationTriangleIcon className="h-5 w-5" />}
              label="Reports & Issues"
            />
            
            <NavItem 
              to="/admin/content" 
              icon={<DocumentTextIcon className="h-5 w-5" />}
              label="Content Management"
            />
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                System
              </p>
              <NavItem 
                to="/admin/settings" 
                icon={<CogIcon className="h-5 w-5" />}
                label="System Settings"
              />
              <NavItem 
                to="/admin/security" 
                icon={<ShieldCheckIcon className="h-5 w-5" />}
                label="Security & Logs"
              />
            </div>
          </nav>

          {/* Admin Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.charAt(0) || 'A'}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 truncate">
                  Administrator
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Logout"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              
              {/* Search */}
              <div className="hidden md:block ml-4 lg:ml-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users, listings, inquiries..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden xl:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                {pendingServiceInquiries > 0 && (
                  <Link
                    to="/admin/services/inquiries?status=pending"
                    className="flex items-center space-x-1 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    <ClipboardDocumentListIcon className="h-4 w-4" />
                    <span>{pendingServiceInquiries} pending</span>
                  </Link>
                )}
                {pendingQuotes > 0 && (
                  <Link
                    to="/admin/services/inquiries?status=quoted"
                    className="flex items-center space-x-1 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    <CurrencyDollarIcon className="h-4 w-4" />
                    <span>{pendingQuotes} quotes</span>
                  </Link>
                )}
              </div>

              {/* Admin Badge */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Admin Mode</span>
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                <BellIcon className="h-5 w-5" />
                {(pendingApprovals + flaggedUsers + pendingServiceInquiries + pendingQuotes) > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Quick Actions */}
              <Link
                to="/dashboard"
                className="hidden md:flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <HomeIcon className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;