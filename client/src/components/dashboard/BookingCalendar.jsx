import { useState, useEffect } from 'react';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../ui/LoadingSpinner';

const BookingCalendar = ({ bookings, onBookingSelect, isLoading }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, bookings]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get first day of calendar (might be from previous month)
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // Get last day of calendar (might be from next month)
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const currentCalendarDate = new Date(startDate);
    
    while (currentCalendarDate <= endDate) {
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.toDateString() === currentCalendarDate.toDateString();
      });
      
      days.push({
        date: new Date(currentCalendarDate),
        isCurrentMonth: currentCalendarDate.getMonth() === month,
        isToday: currentCalendarDate.toDateString() === new Date().toDateString(),
        bookings: dayBookings
      });
      
      currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      confirmed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      completed: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
    };
    return colors[status] || colors.pending;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading calendar..." />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors"
          >
            Today
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0 bg-gray-50 dark:bg-gray-900">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-32 border-r border-b border-gray-200 dark:border-gray-700 p-2 ${
                !day.isCurrentMonth 
                  ? 'bg-gray-50 dark:bg-gray-900/50' 
                  : 'bg-white dark:bg-gray-800'
              } ${
                day.isToday 
                  ? 'ring-2 ring-primary-500 ring-inset' 
                  : ''
              }`}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  day.isCurrentMonth 
                    ? day.isToday 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-400 dark:text-gray-600'
                }`}>
                  {day.date.getDate()}
                </span>
                
                {day.bookings.length > 0 && (
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded-full">
                    {day.bookings.length}
                  </span>
                )}
              </div>

              {/* Bookings */}
              <div className="space-y-1">
                {day.bookings.slice(0, 3).map((booking) => (
                  <button
                    key={booking.id}
                    onClick={() => onBookingSelect(booking)}
                    className={`w-full text-left p-1.5 rounded text-xs border transition-colors hover:shadow-sm ${getStatusColor(booking.status)}`}
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      <ClockIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="font-medium truncate">{booking.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{booking.customer.name}</span>
                    </div>
                    <div className="truncate font-medium mt-1">
                      {booking.service.title}
                    </div>
                  </button>
                ))}
                
                {day.bookings.length > 3 && (
                  <button
                    onClick={() => {
                      // Show all bookings for this day
                      console.log('Show all bookings for', day.date);
                    }}
                    className="w-full text-left p-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    +{day.bookings.length - 3} more
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Confirmed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Cancelled</span>
        </div>
      </div>

      {/* Calendar Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {bookings.filter(b => b.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Confirmed</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {bookings.filter(b => b.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(
              bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0),
              'ETB'
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;