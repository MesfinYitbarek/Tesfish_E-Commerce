import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../store/slices/authSlice';
import NotificationPanel from '../../pages/dashboard/NotificationPanel';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.serviceInquiry);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Admin stats - replace with actual data from Redux
  const pendingApprovals = 12;
  const flaggedUsers = 3;
  const pendingServiceInquiries = stats?.statusDistribution?.find(s => s._id === 'pending')?.count || 0;
  const pendingQuotes = stats?.statusDistribution?.find(s => s._id === 'quoted')?.count || 0;
  const totalNotifications = pendingApprovals + flaggedUsers + pendingServiceInquiries;

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

  const NavItem = ({ to, icon, label, badge, end = false }) => {
    const isActive = end
      ? location.pathname === to
      : location.pathname.startsWith(to);

    return (
      <Link
        to={to}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
            ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        onClick={() => setSidebarOpen(false)}
      >
        <span className="mr-3">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              CitiLights
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Administrator Mode</p>
                <p className="text-xs text-red-600 dark:text-red-400">Full system access</p>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <NavItem
              to="/admin"
              icon={<HomeIcon className="h-5 w-5" />}
              label="Overview"
              end
            />

            <NavItem
              to="/admin/users"
              icon={<UsersIcon className="h-5 w-5" />}
              label="User Management"
            />

            <NavItem
              to="/admin/listings"
              icon={<BuildingOfficeIcon className="h-5 w-5" />}
              label="Listing Moderation"
            />

            <NavItem
              to="/admin/services"
              icon={<WrenchScrewdriverIcon className="h-5 w-5" />}
              label="Service Management"
            />
            <NavItem
              to="/admin/messages"
              icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
              label="Messages"
            />
            <NavItem
              to="/admin/bookings"
              icon={<CalendarIcon className="h-5 w-5" />}
              label="Bookings"
            />
            <NavItem
              to="/admin/registrations"
              icon={<CalendarIcon className="h-5 w-5" />}
              label="Property Registrations"
            />
            <NavItem
              to="/admin/analytics"
              icon={<CalendarIcon className="h-5 w-5" />}
              label="Analytics"
            />
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.charAt(0) || 'A'}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden xl:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                {pendingServiceInquiries > 0 && (
                  <Link
                    to="/admin/services"
                    className="flex items-center space-x-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    <ClipboardDocumentListIcon className="h-4 w-4" />
                    <span>{pendingServiceInquiries} inquiries</span>
                  </Link>
                )}
                {pendingQuotes > 0 && (
                  <Link
                    to="/admin/services"
                    className="flex items-center space-x-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    <CurrencyDollarIcon className="h-4 w-4" />
                    <span>{pendingQuotes} quotes</span>
                  </Link>
                )}
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
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <BellIcon className="h-5 w-5" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.firstName?.charAt(0) || 'A'}
                  </div>
                  <span className="hidden lg:block font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
};

export default AdminLayout;