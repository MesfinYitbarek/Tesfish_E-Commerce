// components/layout/EmployeeLayout.jsx - Remove automatic redirects
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  HomeIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CalendarIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../store/slices/authSlice';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import NotificationPanel from '../../pages/dashboard/NotificationPanel';

const EmployeeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // ✅ Removed automatic redirects - let React Router handle navigation naturally

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const NavItem = ({ to, icon, label, badge, end = false }) => {
    const isActive = end 
      ? location.pathname === to 
      : location.pathname.startsWith(to);

    return (
      <Link
        to={to}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TesGold</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.employeeProfile?.firstName?.charAt(0) || user?.fullName?.charAt(0) || 'E'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.employeeProfile?.firstName || user?.fullName?.split(' ')[0] || 'Employee'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.employeeProfile?.position || 'Employee'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="space-y-1">
              <NavItem 
                to="/employee" 
                icon={<HomeIcon className="h-5 w-5" />}
                label="Dashboard"
                end 
              />
              <NavItem
                to="/employee/appointments"
                icon={<CalendarIcon className="h-5 w-5" />}
                label="All Appointments"
              />
              <NavItem
                to="/employee/registrations"
                icon={<BuildingOfficeIcon className="h-5 w-5" />}
                label="Property Registrations"
              />
              <NavItem 
                to="/employee/analytics" 
                icon={<ChartBarIcon className="h-5 w-5" />}
                label="Analytics"
              />
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Account
              </p>
              <NavItem 
                to="/employee/profile" 
                icon={<UserIcon className="h-5 w-5" />}
                label="Profile"
              />
              <NavItem 
                to="/employee/settings" 
                icon={<CogIcon className="h-5 w-5" />}
                label="Settings"
              />
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">
                    {user?.employeeProfile?.firstName?.charAt(0) || user?.fullName?.charAt(0) || 'E'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user?.employeeProfile?.firstName || user?.fullName?.split(' ')[0] || 'Employee'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Employee
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg"
                title="Logout"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
              
              {/* Breadcrumb */}
              <div className="hidden md:block ml-4 lg:ml-0">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2">
                    <li>
                      <Link to="/employee" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        Employee
                      </Link>
                    </li>
                    {location.pathname !== '/employee' && (
                      <>
                        <span className="text-gray-500 dark:text-gray-400">/</span>
                        <li className="text-gray-900 dark:text-gray-100 font-medium">
                          {location.pathname.split('/').pop().replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </li>
                      </>
                    )}
                  </ol>
                </nav>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={handleDarkModeToggle}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-lg"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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
                className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-lg"
                title="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile info */}
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.employeeProfile?.firstName?.charAt(0) || user?.fullName?.charAt(0) || 'E'}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {user?.employeeProfile?.firstName || user?.fullName?.split(' ')[0] || 'Employee'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.employeeProfile?.department || 'Employee'}
                  </p>
                </div>
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

export default EmployeeLayout;