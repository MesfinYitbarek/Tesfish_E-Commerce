import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import BookingCard from '../../components/dashboard/BookingCard';
import BookingCalendar from '../../components/dashboard/BookingCalendar';
import BookingDetailsModal from '../../components/dashboard/BookingDetailsModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

const Bookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, calendar
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all'); // all, today, week, month
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [filter, dateRange]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockBookings = [
          {
            id: '1',
            service: {
              id: 'service1',
              title: 'Interior Design Consultation',
              type: 'service',
              image: '/api/placeholder/60/60'
            },
            customer: {
              id: 'customer1',
              name: 'Sarah Johnson',
              email: 'sarah@example.com',
              phone: '+251911234567',
              avatar: '/api/placeholder/40/40'
            },
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            time: '10:00',
            duration: 2,
            status: 'confirmed',
            amount: 30000,
            paymentStatus: 'paid',
            notes: 'Looking for modern kitchen design ideas. Has specific color preferences.',
            location: 'Customer\'s home - Bole, Addis Ababa',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            requirements: ['Kitchen renovation', 'Modern style', 'Budget 500K ETB']
          },
          {
            id: '2',
            service: {
              id: 'service2',
              title: 'Project Management Service',
              type: 'service',
              image: '/api/placeholder/60/60'
            },
            customer: {
              id: 'customer2',
              name: 'Michael Chen',
              email: 'michael@example.com',
              phone: '+251922345678',
              avatar: null
            },
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            time: '14:30',
            duration: 4,
            status: 'pending',
            amount: 100000,
            paymentStatus: 'pending',
            notes: 'Residential construction project planning. Need detailed timeline.',
            location: 'Office meeting - CMC area',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            requirements: ['Construction project', 'Timeline planning', 'Cost estimation']
          },
          {
            id: '3',
            service: {
              id: 'service3',
              title: 'Architecture Consultation',
              type: 'service',
              image: '/api/placeholder/60/60'
            },
            customer: {
              id: 'customer3',
              name: 'Emma Wilson',
              email: 'emma@example.com',
              phone: '+251933456789',
              avatar: '/api/placeholder/40/40'
            },
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            time: '09:00',
            duration: 3,
            status: 'confirmed',
            amount: 75000,
            paymentStatus: 'paid',
            notes: 'Villa renovation plans review. Has existing blueprints.',
            location: 'Site visit - Old Airport area',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            requirements: ['Villa renovation', 'Blueprint review', 'Permit assistance']
          },
          {
            id: '4',
            service: {
              id: 'service1',
              title: 'Interior Design Consultation',
              type: 'service',
              image: '/api/placeholder/60/60'
            },
            customer: {
              id: 'customer4',
              name: 'David Lee',
              email: 'david@example.com',
              phone: '+251944567890',
              avatar: null
            },
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            time: '16:00',
            duration: 1.5,
            status: 'completed',
            amount: 22500,
            paymentStatus: 'paid',
            notes: 'Office space redesign completed successfully.',
            location: 'Customer\'s office - Kazanchis',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            requirements: ['Office redesign', 'Professional look', 'Space optimization']
          },
          {
            id: '5',
            service: {
              id: 'service2',
              title: 'Project Management Service',
              type: 'service',
              image: '/api/placeholder/60/60'
            },
            customer: {
              id: 'customer5',
              name: 'Lisa Zhang',
              email: 'lisa@example.com',
              phone: '+251955678901',
              avatar: '/api/placeholder/40/40'
            },
            date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
            time: '11:00',
            duration: 2,
            status: 'cancelled',
            amount: 50000,
            paymentStatus: 'refunded',
            notes: 'Cancelled due to customer\'s schedule conflict.',
            location: 'Video call',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            requirements: ['Project consultation', 'Remote meeting']
          }
        ];

        setBookings(mockBookings);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Status filter
    if (filter !== 'all' && booking.status !== filter) return false;
    
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesCustomer = booking.customer.name.toLowerCase().includes(searchLower);
      const matchesService = booking.service.title.toLowerCase().includes(searchLower);
      const matchesLocation = booking.location.toLowerCase().includes(searchLower);
      
      if (!matchesCustomer && !matchesService && !matchesLocation) return false;
    }

    // Date range filter
    if (dateRange !== 'all') {
      const bookingDate = new Date(booking.date);
      const now = new Date();
      
      switch (dateRange) {
        case 'today':
          return bookingDate.toDateString() === now.toDateString();
        case 'week':
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return bookingDate >= now && bookingDate <= weekFromNow;
        case 'month':
          const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          return bookingDate >= now && bookingDate <= monthFromNow;
      }
    }

    return true;
  });

  const getStatusCounts = () => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
  };

  const statusCounts = getStatusCounts();

  const statusFilters = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'pending', label: 'Pending', count: statusCounts.pending },
    { key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
    { key: 'completed', label: 'Completed', count: statusCounts.completed },
    { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your service bookings and appointments
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statusFilters.map(status => (
            <button
              key={status.key}
              onClick={() => setFilter(status.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === status.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {status.label}
              {status.count > 0 && (
                <span className="ml-2">({status.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by customer, service, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Next 7 Days</option>
            <option value="month">Next 30 Days</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        {viewMode === 'list' ? (
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" text="Loading bookings..." />
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onStatusChange={handleStatusChange}
                    onViewDetails={setSelectedBooking}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'all' 
                    ? 'You don\'t have any bookings yet. Once customers book your services, they\'ll appear here.'
                    : `No ${filter} bookings found. Try adjusting your filters.`
                  }
                </p>
              </div>
            )}
          </div>
        ) : (
          <BookingCalendar 
            bookings={filteredBookings}
            onBookingSelect={setSelectedBooking}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default Bookings;