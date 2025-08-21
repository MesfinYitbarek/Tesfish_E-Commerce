import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/helpers';
import Button from '../ui/Button';

const UpcomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setBookings([
          {
            _id: '1',
            service: {
              _id: 's1',
              title: 'Interior Design Consultation',
              type: 'service'
            },
            customer: {
              name: 'Sarah Johnson',
              email: 'sarah@example.com',
              phone: '+251911234567'
            },
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            time: '10:00',
            duration: 2,
            status: 'confirmed',
            amount: 30000,
            notes: 'Looking for modern kitchen design ideas'
          },
          {
            _id: '2',
            service: {
              _id: 's2',
              title: 'Project Management Service',
              type: 'service'
            },
            customer: {
              name: 'Michael Chen',
              email: 'michael@example.com',
              phone: '+251922345678'
            },
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            time: '14:30',
            duration: 4,
            status: 'pending',
            amount: 100000,
            notes: 'Residential construction project planning'
          },
          {
            _id: '3',
            service: {
              _id: 's3',
              title: 'Architecture Consultation',
              type: 'service'
            },
            customer: {
              name: 'Emma Wilson',
              email: 'emma@example.com',
              phone: '+251933456789'
            },
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            time: '09:00',
            duration: 3,
            status: 'confirmed',
            amount: 75000,
            notes: 'Villa renovation plans review'
          }
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      setIsLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      // API call to update booking status
      setBookings(prev => 
        prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: action === 'accept' ? 'confirmed' : 'cancelled' }
            : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20',
      confirmed: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20',
      cancelled: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
      completed: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
    };
    return colors[status] || colors.pending;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Upcoming Bookings
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Upcoming Bookings
        </h3>
        <Link 
          to="/dashboard/bookings"
          className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
        >
          View all
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Link
                  to={`/dashboard/bookings/${booking._id}`}
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500"
                >
                  {booking.service.title}
                </Link>
                <div className="flex items-center mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {booking.amount.toLocaleString()} ETB
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-3">
                <UserIcon className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {booking.customer.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {booking.customer.email}
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDate(booking.date, { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{booking.time} ({booking.duration}h)</span>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {booking.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            {booking.status === 'pending' && (
              <div className="flex items-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  onClick={() => handleBookingAction(booking._id, 'accept')}
                  leftIcon={<CheckIcon className="h-4 w-4" />}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBookingAction(booking._id, 'decline')}
                  leftIcon={<XMarkIcon className="h-4 w-4" />}
                >
                  Decline
                </Button>
              </div>
            )}

            {booking.status === 'confirmed' && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-green-600 dark:text-green-400">
                  ✓ Confirmed - Customer will receive booking details
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            No upcoming bookings
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your upcoming service bookings will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;