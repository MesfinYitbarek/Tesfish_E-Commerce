import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentCheckIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

const CustomerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get data from localStorage (in real app, this would come from API)
      const registrations = Object.keys(localStorage)
        .filter(key => key.startsWith('registration_'))
        .map(key => JSON.parse(localStorage.getItem(key)))
        .filter(Boolean);

      const lastPayment = JSON.parse(localStorage.getItem('lastPayment') || 'null');

      const mockData = {
        user: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          memberSince: '2024-01-15',
          verificationStatus: 'verified'
        },
        stats: {
          activeRegistrations: registrations.filter(r => r.status === 'paid').length,
          pendingPayments: registrations.filter(r => r.status === 'pending_payment').length,
          unreadMessages: 3,
          savedProperties: 8,
          totalSpent: registrations.reduce((sum, r) => sum + (r.registrationFee || 0), 0)
        },
        recentRegistrations: registrations.slice(0, 3).map(reg => ({
          id: reg.propertyId || 'PROP-' + Date.now(),
          propertyTitle: reg.propertyTitle || 'Property Registration',
          status: reg.status || 'pending',
          registeredAt: reg.registrationDate || new Date().toISOString(),
          amount: reg.registrationFee || 5000,
          seller: reg.sellerInfo?.name || 'Property Owner',
          nextAction: reg.status === 'paid' ? 'Wait for seller contact' : 'Complete payment'
        })),
        recentMessages: [
          {
            id: 1,
            from: 'Prime Properties Ltd',
            subject: 'Property Viewing Scheduled',
            preview: 'Your viewing appointment has been confirmed for tomorrow at 2:00 PM...',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            unread: true,
            type: 'appointment'
          },
          {
            id: 2,
            from: 'Creative Interiors',
            subject: 'Quote Ready - Interior Design',
            preview: 'Thank you for your inquiry. We have prepared a detailed quote...',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            unread: true,
            type: 'quote'
          },
          {
            id: 3,
            from: 'System Notification',
            subject: 'Payment Confirmation',
            preview: 'Your registration payment of ETB 5,000 has been processed successfully...',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            unread: false,
            type: 'payment'
          }
        ],
        savedProperties: [
          {
            id: 1,
            title: 'Modern 3BR Apartment - CMC',
            price: 2500000,
            location: 'Addis Ababa, Yeka',
            image: '/api/placeholder/300/200',
            savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            status: 'available'
          },
          {
            id: 2,
            title: 'Luxury Villa - Old Airport',
            price: 15000000,
            location: 'Addis Ababa, Bole',
            image: '/api/placeholder/300/201',
            savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            status: 'available'
          }
        ],
        upcomingAppointments: [
          {
            id: 1,
            type: 'property_viewing',
            title: 'Property Viewing - Modern Apartment',
            company: 'Prime Properties Ltd',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000),
            location: 'CMC Area, Addis Ababa',
            status: 'confirmed'
          },
          {
            id: 2,
            type: 'consultation',
            title: 'Interior Design Consultation',
            company: 'Creative Interiors',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            location: 'Office - Bole Area',
            status: 'pending'
          }
        ],
        recentActivity: [
          {
            id: 1,
            type: 'registration',
            title: 'Registered interest in Modern 3BR Apartment',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            status: 'completed'
          },
          {
            id: 2,
            type: 'payment',
            title: 'Payment completed - Registration fee',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
            status: 'completed'
          },
          {
            id: 3,
            type: 'message',
            title: 'Received message from Prime Properties',
            timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
            status: 'unread'
          }
        ]
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, description, link }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
          {link && (
            <Link to={link} className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block">
              View details →
            </Link>
          )}
        </div>
        <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      pending_payment: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      confirmed: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
      pending: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    };
    return colors[status] || colors.pending;
  };

  const getActivityIcon = (type) => {
    const icons = {
      registration: DocumentCheckIcon,
      payment: CreditCardIcon,
      message: ChatBubbleLeftRightIcon,
      appointment: CalendarIcon
    };
    return icons[type] || DocumentCheckIcon;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {dashboardData.user.name}!
            </h1>
            <p className="opacity-90">
              Here's what's happening with your property interests and registrations.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Member since</p>
            <p className="font-semibold">{new Date(dashboardData.user.memberSince).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Registrations"
          value={dashboardData.stats.activeRegistrations}
          icon={DocumentCheckIcon}
          color="bg-green-500"
          description="Properties you're registered for"
          link="/customer/registrations"
        />
        <StatCard
          title="Pending Payments"
          value={dashboardData.stats.pendingPayments}
          icon={ExclamationTriangleIcon}
          color="bg-yellow-500"
          description="Registrations awaiting payment"
          link="/customer/payments"
        />
        <StatCard
          title="Unread Messages"
          value={dashboardData.stats.unreadMessages}
          icon={ChatBubbleLeftRightIcon}
          color="bg-blue-500"
          description="New messages from sellers"
          link="/customer/messages"
        />
        <StatCard
          title="Saved Properties"
          value={dashboardData.stats.savedProperties}
          icon={HeartIcon}
          color="bg-purple-500"
          description="Properties in your favorites"
          link="/customer/favorites"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Registrations
              </h2>
              <Link 
                to="/customer/registrations"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {dashboardData.recentRegistrations.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentRegistrations.map((registration) => (
                  <div key={registration.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {registration.propertyTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {registration.seller} • {formatCurrency(registration.amount, 'ETB')}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(registration.status)}`}>
                          {registration.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(registration.registeredAt)}
                        </span>
                      </div>
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                        Next: {registration.nextAction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No registrations yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start browsing properties to register your interest
                </p>
                <Link to="/properties">
                  <Button size="sm">Browse Properties</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Messages
              </h2>
              <Link 
                to="/customer/messages"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.recentMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-4">
                  <div className={`w-3 h-3 rounded-full mt-2 ${message.unread ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium text-gray-900 dark:text-gray-100 truncate ${message.unread ? 'font-semibold' : ''}`}>
                        {message.from}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(message.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm text-gray-900 dark:text-gray-100 truncate ${message.unread ? 'font-medium' : ''}`}>
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {message.preview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Upcoming Appointments
            </h2>
          </div>
          <div className="p-6">
            {dashboardData.upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {appointment.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.company}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {appointment.date.toLocaleDateString()} at {appointment.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No upcoming appointments
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Saved Properties */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recently Saved
              </h2>
              <Link 
                to="/customer/favorites"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {dashboardData.savedProperties.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.savedProperties.map((property) => (
                  <div key={property.id} className="flex items-start space-x-4">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(property.price, 'ETB')}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {property.location}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Saved {formatRelativeTime(property.savedAt)}
                      </p>
                    </div>
                    <Link to={`/properties/${property.id}`}>
                      <Button size="sm" variant="outline">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No saved properties yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <ActivityIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                  {activity.status === 'unread' && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/properties">
            <Button className="w-full" variant="outline">
              <BuildingOfficeIcon className="h-4 w-4 mr-2" />
              Browse Properties
            </Button>
          </Link>
          <Link to="/services">
            <Button className="w-full" variant="outline">
              <DocumentCheckIcon className="h-4 w-4 mr-2" />
              Find Services
            </Button>
          </Link>
          <Link to="/customer/profile">
            <Button className="w-full" variant="outline">
              <UserIcon className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;