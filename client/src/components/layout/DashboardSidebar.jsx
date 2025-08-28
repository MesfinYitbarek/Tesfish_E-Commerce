import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  HomeIcon,
  BuildingOfficeIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  HeartIcon,
  UserIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BellIcon,
  DocumentTextIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../store/slices/authSlice';
import { APP_CONFIG } from '../../constants';

const DashboardSidebar = ({ onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    if (onClose) onClose();
  };

  const getUserInfo = () => {
    if (user?.userType === 'company') {
      return {
        name: user.companyProfile?.companyName || 'Company',
        email: user.email,
        avatar: user.companyProfile?.logo,
        type: 'Company Account'
      };
    } else if (user?.userType === 'individual') {
      return {
        name: `${user.individualProfile?.firstName || ''} ${user.individualProfile?.lastName || ''}`.trim() || 'User',
        email: user.email,
        avatar: user.individualProfile?.avatar,
        type: 'Individual Account'
      };
    }
    return {
      name: 'User',
      email: user?.email || '',
      avatar: null,
      type: 'Account'
    };
  };

  const userInfo = getUserInfo();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      exact: true
    },
    {
      name: 'My Listings',
      href: '/dashboard/products',
      icon: BuildingOfficeIcon,
      badge: user?.totalListings || 0
    },
    {
      name: 'Add Listing',
      href: '/dashboard/products/create',
      icon: PlusIcon,
      highlight: true
    },
    {
      name: 'Property Registrations',
      href: '/dashboard/registrations',
      icon: ClipboardDocumentListIcon,
      badge: user?.pendingRegistrations || 0,
      subItems: [
        {
          name: 'All Registrations',
          href: '/dashboard/registrations',
          badge: user?.totalRegistrations || 0
        },
        {
          name: 'Pending Review',
          href: '/dashboard/registrations?status=under-review',
          badge: user?.pendingRegistrations || 0
        },
        {
          name: 'Payment Completed',
          href: '/dashboard/registrations?status=completed',
          badge: user?.completedPayments || 0
        }
      ]
    },
    {
      name: 'Messages',
      href: '/dashboard/messages',
      icon: ChatBubbleLeftRightIcon,
      badge: user?.unreadMessages || 0
    },
    {
      name: 'Bookings',
      href: '/dashboard/bookings',
      icon: CalendarIcon,
      badge: user?.pendingBookings || 0
    },
    {
      name: 'Wishlist',
      href: '/dashboard/wishlist',
      icon: HeartIcon,
      badge: user?.wishlistCount || 0
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: ChartBarIcon
    },
    {
      name: 'Orders',
      href: '/dashboard/orders',
      icon: DocumentTextIcon
    },
    {
      name: 'Notifications',
      href: '/dashboard/notifications',
      icon: BellIcon
    }
  ];

  const settingsItems = [
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: UserIcon
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Cog6ToothIcon
    }
  ];

  const isActive = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const NavItem = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(isActive(item.href));
    
    return (
      <div>
        <Link
          to={item.href}
          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive(item.href, item.exact)
              ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : item.highlight
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={(e) => {
            if (item.subItems) {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            } else {
              onClose && onClose();
            }
          }}
        >
          <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
            item.highlight ? 'text-white' : ''
          }`} />
          <span className="truncate flex-1">{item.name}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className={`ml-2 inline-block py-0.5 px-2 text-xs rounded-full ${
              item.highlight
                ? 'bg-white text-primary-600'
                : 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
            }`}>
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
          {item.subItems && (
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

        {/* Sub Items */}
        {item.subItems && isExpanded && (
          <div className="ml-8 mt-1 space-y-1">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  location.pathname === subItem.href || 
                  (subItem.href.includes('?') && location.pathname === subItem.href.split('?')[0] && location.search.includes(subItem.href.split('?')[1]))
                    ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={onClose}
              >
                <span className="truncate flex-1">{subItem.name}</span>
                {subItem.badge !== undefined && subItem.badge > 0 && (
                  <span className="ml-2 inline-block py-0.5 px-2 text-xs rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                    {subItem.badge > 99 ? '99+' : subItem.badge}
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CL</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {APP_CONFIG.APP_NAME}
          </span>
        </Link>
        
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-medium">
                {userInfo.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {userInfo.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userInfo.type}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>

        {/* Settings Section */}
        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Account
          </h3>
          <div className="space-y-1">
            {settingsItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;