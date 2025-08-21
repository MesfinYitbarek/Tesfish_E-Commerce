import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const BookingSection = ({ product }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    duration: 1,
  });

  const serviceDetails = product.serviceDetails;
  const pricing = product.pricing;

  // Get available dates (next 30 days, excluding weekends if specified)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends if service doesn't work weekends
      if (serviceDetails?.availability?.includes('weekends') === false) {
        if (date.getDay() === 0 || date.getDay() === 6) continue;
      }
      
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    setIsLoadingSlots(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockSlots = [
          { time: '09:00', available: true },
          { time: '10:00', available: true },
          { time: '11:00', available: false },
          { time: '12:00', available: true },
          { time: '13:00', available: false },
          { time: '14:00', available: true },
          { time: '15:00', available: true },
          { time: '16:00', available: true },
          { time: '17:00', available: false },
        ];
        setAvailableSlots(mockSlots);
        setIsLoadingSlots(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setIsLoadingSlots(false);
    }
  };

  const calculateTotal = () => {
    const basePrice = pricing?.basePrice || 0;
    const duration = bookingDetails.duration;
    return basePrice * duration;
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }
    setShowBookingModal(true);
  };

  const submitBooking = async () => {
    try {
      // API call to create booking
      const bookingData = {
        product: product._id,
        date: selectedDate,
        time: selectedTime,
        duration: bookingDetails.duration,
        total: calculateTotal(),
        ...bookingDetails
      };

      console.log('Booking data:', bookingData);
      toast.success('Booking request submitted successfully!');
      setShowBookingModal(false);
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setBookingDetails({
        name: '',
        email: '',
        phone: '',
        message: '',
        duration: 1,
      });
    } catch (error) {
      toast.error('Failed to submit booking request');
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Book This Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {serviceDetails?.duration && (
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-blue-800 dark:text-blue-200">
                Duration: {serviceDetails.duration}
              </span>
            </div>
          )}
          
          <div className="flex items-center">
            <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-blue-800 dark:text-blue-200">
              Price: {formatCurrency(pricing?.basePrice || 0, 'ETB')}
              {pricing?.priceType && ` per ${pricing.priceType}`}
            </span>
          </div>

          {serviceDetails?.serviceArea && (
            <div className="flex items-center">
              <span className="text-blue-800 dark:text-blue-200">
                Service Area: {serviceDetails.serviceArea}
              </span>
            </div>
          )}

          {serviceDetails?.availability && (
            <div className="flex items-center">
              <span className="text-blue-800 dark:text-blue-200">
                Available: {serviceDetails.availability}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Date
        </label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Choose a date</option>
          {availableDates.map((date) => {
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            return (
              <option key={date} value={date}>
                {formattedDate}
              </option>
            );
          })}
        </select>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Time
          </label>
          
          {isLoadingSlots ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    selectedTime === slot.time
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : slot.available
                      ? 'border-gray-300 dark:border-gray-600 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                  {!slot.available && (
                    <div className="text-xs text-red-500 mt-1">Booked</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {availableSlots.length === 0 && !isLoadingSlots && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No available time slots for this date
            </div>
          )}
        </div>
      )}

      {/* Duration Selection */}
      {selectedDate && selectedTime && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Duration (hours)
          </label>
          <select
            value={bookingDetails.duration}
            onChange={(e) => setBookingDetails(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
              <option key={hour} value={hour}>
                {hour} hour{hour > 1 ? 's' : ''} - {formatCurrency((pricing?.basePrice || 0) * hour, 'ETB')}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Summary */}
      {selectedDate && selectedTime && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Date:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {new Date(selectedDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Time:</span>
              <span className="text-gray-900 dark:text-gray-100">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Duration:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {bookingDetails.duration} hour{bookingDetails.duration > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-gray-100">Total:</span>
              <span className="text-primary-500">{formatCurrency(calculateTotal(), 'ETB')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Book Button */}
      <div className="flex space-x-3">
        <Button
          onClick={handleBooking}
          disabled={!selectedDate || !selectedTime}
          className="flex-1"
          leftIcon={<CalendarIcon className="h-4 w-4" />}
        >
          Book Appointment
        </Button>
      </div>

      {/* Booking Terms */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Booking confirmation will be sent via email</p>
        <p>• Cancellation allowed up to 24 hours before appointment</p>
        <p>• Payment can be made at the time of service</p>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={submitBooking}
        bookingDetails={bookingDetails}
        setBookingDetails={setBookingDetails}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        total={calculateTotal()}
      />
    </div>
  );
};

// Booking Modal Component
const BookingModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  bookingDetails, 
  setBookingDetails, 
  selectedDate, 
  selectedTime, 
  total 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit();
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Your Booking"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Booking Summary */}
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
          <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-2">
            Appointment Details
          </h4>
          <div className="space-y-1 text-sm text-primary-800 dark:text-primary-200">
            <p>Date: {new Date(selectedDate).toLocaleDateString()}</p>
            <p>Time: {selectedTime}</p>
            <p>Duration: {bookingDetails.duration} hour{bookingDetails.duration > 1 ? 's' : ''}</p>
            <p className="font-medium">Total: {formatCurrency(total, 'ETB')}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Full Name"
            value={bookingDetails.name}
            onChange={(e) => setBookingDetails(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={bookingDetails.email}
            onChange={(e) => setBookingDetails(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={bookingDetails.phone}
            onChange={(e) => setBookingDetails(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>

        {/* Additional Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Requirements (Optional)
          </label>
          <textarea
            value={bookingDetails.message}
            onChange={(e) => setBookingDetails(prev => ({ ...prev, message: e.target.value }))}
            rows={3}
            placeholder="Any specific requirements or notes for the service provider..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Terms */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Booking Terms:</p>
              <ul className="space-y-1 text-xs">
                <li>• This is a booking request and subject to confirmation</li>
                <li>• You will receive confirmation within 2 hours</li>
                <li>• Cancellation allowed up to 24 hours before appointment</li>
                <li>• Payment arrangements will be confirmed separately</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!bookingDetails.name || !bookingDetails.email || !bookingDetails.phone}
            className="flex-1"
            leftIcon={<CheckCircleIcon className="h-4 w-4" />}
          >
            Confirm Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingSection;