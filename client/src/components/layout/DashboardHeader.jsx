import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const DashboardHeader = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const getPageInfo = () => {
    const path = location.pathname;
    
    const pageMap = {
      '/dashboard': {
        title: 'Dashboard',
        subtitle: 'Overview of your account activity',
        breadcrumb: ['Dashboard']
      },
      '/dashboard/products': {
        title: 'My Listings',
        subtitle: 'Manage your property and service listings',
        breadcrumb: ['Dashboard', 'My Listings']
      },
      '/dashboard/products/create': {
        title: 'Add New Listing',
        subtitle: 'Create a new property or service listing',
        breadcrumb: ['Dashboard', 'My Listings', 'Add New']
      },
      '/dashboard/messages': {
        title: 'Messages',
        subtitle: 'Communicate with potential customers',
        breadcrumb: ['Dashboard', 'Messages']
      },
      '/dashboard/bookings': {
        title: 'Bookings',
        subtitle: 'Manage your service bookings and appointments',
        breadcrumb: ['Dashboard', 'Bookings']
      },
      '/dashboard/wishlist': {
        title: 'Wishlist',
        subtitle: 'Properties and services you\'ve saved',
        breadcrumb: ['Dashboard', 'Wishlist']
      },
      '/dashboard/analytics': {
        title: 'Analytics',
        subtitle: 'Insights into your listing performance',
        breadcrumb: ['Dashboard', 'Analytics']
      },
      '/dashboard/orders': {
        title: 'Orders',
        subtitle: 'Track your service orders and transactions',
        breadcrumb: ['Dashboard', 'Orders']
      },
      '/dashboard/notifications': {
        title: 'Notifications',
        subtitle: 'Stay updated with important alerts',
        breadcrumb: ['Dashboard', 'Notifications']
      },
      '/dashboard/profile': {
        title: 'Profile',
        subtitle: 'Manage your account information',
        breadcrumb: ['Dashboard', 'Profile']
      },
      '/dashboard/settings': {
        title: 'Settings',
        subtitle: 'Configure your account preferences',
        breadcrumb: ['Dashboard', 'Settings']
      }
    };

    // Handle dynamic routes (like /dashboard/products/:id/edit)
    if (path.includes('/dashboard/products/') && path.includes('/edit')) {
      return {
        title: 'Edit Listing',
        subtitle: 'Update your property or service listing',
        breadcrumb: ['Dashboard', 'My Listings', 'Edit']
      };
    }

    if (path.includes('/dashboard/products/') && !path.includes('/create')) {
      return {
        title: 'Listing Details',
        subtitle: 'View and manage your listing',
        breadcrumb: ['Dashboard', 'My Listings', 'Details']
      };
    }

    return pageMap[path] || {
      title: 'Dashboard',
      subtitle: 'Manage your account',
      breadcrumb: ['Dashboard']
    };
  };

  const pageInfo = getPageInfo();

  const getGreeting = () => {
    const hour = new Date().getHours();
    const userName = user?.userType === 'company' 
      ? user.companyProfile?.companyName 
      : user?.individualProfile?.firstName || 'User';

    if (hour < 12) return `Good morning, ${userName}`;
    if (hour < 17) return `Good afternoon, ${userName}`;
    return `Good evening, ${userName}`;
  };

  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex mb-2" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {pageInfo.breadcrumb.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    index === pageInfo.breadcrumb.length - 1
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </nav>

          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:truncate">
              {pageInfo.title}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Stats or Actions */}
        <div className="mt-4 sm:mt-0 sm:ml-6">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getGreeting()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;