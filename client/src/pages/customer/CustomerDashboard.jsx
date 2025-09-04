import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

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
    </div>
  );
};

export default CustomerDashboard;