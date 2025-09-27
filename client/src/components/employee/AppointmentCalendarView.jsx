// components/employee/AppointmentCalendarView.jsx
import { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  PlusIcon,
  ListBulletIcon,
  Squares2X2Icon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

const AppointmentCalendarView = ({ 
  appointments = [], 
  onAppointmentSelect, 
  onStatusChange, 
  isLoading = false,
  selectedDate = new Date(),
  onDateChange
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [calendarView, setCalendarView] = useState('month'); // month, week, day
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  // Calendar navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    onDateChange && onDateChange(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
    onDateChange && onDateChange(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
    onDateChange && onDateChange(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateChange && onDateChange(today);
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateStr = date.toDateString();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.scheduledDateTime);
      return appointmentDate.toDateString() === dateStr;
    }).sort((a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime));
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-400',
      confirmed: 'bg-green-400',
      completed: 'bg-blue-400',
      cancelled: 'bg-red-400',
      rescheduled: 'bg-purple-400',
      'no-show': 'bg-gray-400'
    };
    return colors[status] || colors.pending;
  };

  // Generate calendar days for month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDateIter = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
    
    return days;
  };

  // Generate week days
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Generate time slots for day/week view
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push({
        hour,
        time: new Date(2000, 0, 1, hour, 0).toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true
        })
      });
    }
    return slots;
  };

  const monthDays = useMemo(() => generateMonthDays(), [currentDate]);
  const weekDays = useMemo(() => generateWeekDays(), [currentDate]);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment, event) => {
    event.stopPropagation();
    setSelectedAppointment(appointment);
    onAppointmentSelect && onAppointmentSelect(appointment);
  };

  // Handle quick status change
  const handleQuickStatusChange = (appointment, newStatus, event) => {
    event.stopPropagation();
    onStatusChange && onStatusChange(appointment._id, newStatus);
  };

  // Appointment Card Component
  const AppointmentCard = ({ appointment, isCompact = false }) => {
    const appointmentTime = new Date(appointment.scheduledDateTime);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={`
          relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm 
          hover:shadow-md transition-all duration-200 cursor-pointer group
          ${isCompact ? 'p-2 mb-1' : 'p-3 mb-2'}
        `}
        onClick={(e) => handleAppointmentClick(appointment, e)}
      >
        {/* Status indicator */}
        <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(appointment.status)} rounded-l-lg`} />
        
        <div className="ml-2">
          {/* Time */}
          <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
            <ClockIcon className="h-3 w-3" />
            <span>
              {appointmentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          {/* Property title */}
          <p className={`font-medium text-gray-900 dark:text-gray-100 truncate ${
            isCompact ? 'text-xs' : 'text-sm'
          }`}>
            {appointment.property?.title || 'Property Viewing'}
          </p>
          
          {/* Customer */}
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500">
            <UserIcon className="h-3 w-3" />
            <span className="truncate">{appointment.contactInfo?.name}</span>
          </div>
          
          {!isCompact && (
            <>
              {/* Location */}
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500 mt-1">
                <MapPinIcon className="h-3 w-3" />
                <span className="truncate">
                  {appointment.meetingDetails?.address || 
                   appointment.property?.propertyDetails?.location?.city || 
                   'Property location'}
                </span>
              </div>
              
              {/* Quick actions (visible on hover) */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-1">
                  {appointment.status === 'pending' && (
                    <button
                      onClick={(e) => handleQuickStatusChange(appointment, 'confirmed', e)}
                      className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                      title="Confirm"
                    >
                      <CheckIcon className="h-3 w-3" />
                    </button>
                  )}
                  
                  {appointment.status === 'confirmed' && new Date(appointment.scheduledDateTime) <= new Date() && (
                    <button
                      onClick={(e) => handleQuickStatusChange(appointment, 'completed', e)}
                      className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Complete"
                    >
                      <CheckIcon className="h-3 w-3" />
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => handleAppointmentClick(appointment, e)}
                    className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    title="View Details"
                  >
                    <EyeIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  // Month View
  const MonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {/* Day headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {monthDays.map((date, index) => {
        const dayAppointments = getAppointmentsForDate(date);
        const isCurrentMonthDay = isCurrentMonth(date);
        const isTodayDate = isToday(date);
        
        return (
          <div
            key={index}
            className={`
              min-h-32 p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900
              hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer
              ${!isCurrentMonthDay ? 'opacity-40' : ''}
              ${isTodayDate ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}
            `}
            onMouseEnter={() => setHoveredDate(date)}
            onMouseLeave={() => setHoveredDate(null)}
            onClick={() => {
              setCurrentDate(date);
              if (calendarView !== 'day') setCalendarView('day');
            }}
          >
            {/* Date number */}
            <div className={`
              text-sm font-medium mb-2
              ${isTodayDate ? 'text-primary-600 dark:text-primary-400' : 
                isCurrentMonthDay ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}
            `}>
              {date.getDate()}
            </div>
            
            {/* Appointments */}
            <div className="space-y-1">
              {dayAppointments.slice(0, 3).map(appointment => (
                <AppointmentCard 
                  key={appointment._id} 
                  appointment={appointment} 
                  isCompact={true}
                />
              ))}
              
              {dayAppointments.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  +{dayAppointments.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Week View
  const WeekView = () => (
    <div className="flex flex-col">
      {/* Week header */}
      <div className="grid grid-cols-8 gap-1 mb-4">
        <div className="p-3"></div> {/* Empty cell for time column */}
        {weekDays.map(date => (
          <div key={date.toISOString()} className={`
            p-3 text-center border border-gray-200 dark:border-gray-700 rounded-lg
            ${isToday(date) ? 'bg-primary-100 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700' : 'bg-gray-50 dark:bg-gray-800'}
          `}>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-bold ${
              isToday(date) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
      
      {/* Time slots */}
      <div className="grid grid-cols-8 gap-1 flex-1">
        {timeSlots.map(slot => (
          <React.Fragment key={slot.hour}>
            {/* Time label */}
            <div className="p-2 text-sm text-gray-500 dark:text-gray-400 text-right border-r border-gray-200 dark:border-gray-700">
              {slot.time}
            </div>
            
            {/* Day columns */}
            {weekDays.map(date => {
              const slotAppointments = getAppointmentsForDate(date).filter(appointment => {
                const appointmentHour = new Date(appointment.scheduledDateTime).getHours();
                return appointmentHour === slot.hour;
              });
              
              return (
                <div
                  key={`${date.toISOString()}-${slot.hour}`}
                  className="min-h-16 p-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {slotAppointments.map(appointment => (
                    <AppointmentCard 
                      key={appointment._id} 
                      appointment={appointment} 
                      isCompact={true}
                    />
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // Day View
  const DayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate);
    
    return (
      <div className="flex flex-col">
        {/* Day header */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
        
        {/* Time slots */}
        <div className="space-y-2">
          {timeSlots.map(slot => {
            const slotAppointments = dayAppointments.filter(appointment => {
              const appointmentHour = new Date(appointment.scheduledDateTime).getHours();
              return appointmentHour === slot.hour;
            });
            
            return (
              <div key={slot.hour} className="flex">
                {/* Time label */}
                <div className="w-20 p-3 text-sm text-gray-500 dark:text-gray-400 text-right">
                  {slot.time}
                </div>
                
                {/* Appointments */}
                <div className="flex-1 min-h-16 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                  {slotAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {slotAppointments.map(appointment => (
                        <AppointmentCard 
                          key={appointment._id} 
                          appointment={appointment} 
                          isCompact={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                      <span className="text-sm">No appointments</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const viewComponents = {
    month: MonthView,
    week: WeekView,
    day: DayView
  };

  const ViewComponent = viewComponents[calendarView];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (calendarView === 'month') navigateMonth(-1);
                  else if (calendarView === 'week') navigateWeek(-1);
                  else navigateDay(-1);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 min-w-48 text-center">
                {calendarView === 'month' && 
                  currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                }
                {calendarView === 'week' && 
                  `Week of ${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                }
                {calendarView === 'day' && 
                  currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                }
              </h2>
              
              <button
                onClick={() => {
                  if (calendarView === 'month') navigateMonth(1);
                  else if (calendarView === 'week') navigateWeek(1);
                  else navigateDay(1);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Today
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setCalendarView('month')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                  calendarView === 'month'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4" />
                <span>Month</span>
              </button>
              
              <button
                onClick={() => setCalendarView('week')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                  calendarView === 'week'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <ViewColumnsIcon className="h-4 w-4" />
                <span>Week</span>
              </button>
              
              <button
                onClick={() => setCalendarView('day')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                  calendarView === 'day'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <ListBulletIcon className="h-4 w-4" />
                <span>Day</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 mt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Status:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-xs">Pending</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-xs">Confirmed</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-xs">Completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-xs">Cancelled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" text="Loading calendar..." />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={calendarView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ViewComponent />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Stats Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {appointments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Confirmed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {appointments.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendarView;