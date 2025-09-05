// components/property/AppointmentBookingModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  BuildingOfficeIcon,
  HomeIcon,
  CheckCircleIcon,
  UserIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { 
  bookAppointment,
  selectIsBookingAppointment,
  selectBookingError 
} from '../../store/slices/appointmentSlice';
import { toast } from 'react-hot-toast';

const AppointmentBookingModal = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch();
  const isSubmitting = useSelector(selectIsBookingAppointment);
  const bookingError = useSelector(selectBookingError);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      preferredContactMethod: 'phone'
    },
    scheduledDateTime: '',
    appointmentType: 'property-viewing',
    meetingDetails: {
      location: 'property-site',
      address: '',
      meetingLink: '',
      specialInstructions: ''
    },
    customerNotes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          name: `${user?.customerProfile?.firstName || user?.firstName || ''} ${user?.customerProfile?.lastName || user?.lastName || ''}`.trim(),
          email: user?.email || '',
          phone: user?.customerProfile?.phone || user?.phone || ''
        }
      }));
    }
  }, [isOpen, user]);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear errors
    const errorKey = section ? `${section}.${field}` : field;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Contact info validation
    if (!formData.contactInfo.name.trim()) {
      newErrors['contactInfo.name'] = 'Name is required';
    }
    if (!formData.contactInfo.email.trim()) {
      newErrors['contactInfo.email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactInfo.email)) {
      newErrors['contactInfo.email'] = 'Please enter a valid email';
    }
    if (!formData.contactInfo.phone.trim()) {
      newErrors['contactInfo.phone'] = 'Phone number is required';
    }

    // Date/time validation
    if (!formData.scheduledDateTime) {
      newErrors.scheduledDateTime = 'Date and time is required';
    } else {
      const selectedDate = new Date(formData.scheduledDateTime);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.scheduledDateTime = 'Please select a future date and time';
      }

      // Check if it's within business hours (9 AM to 6 PM)
      const hour = selectedDate.getHours();
      if (hour < 9 || hour >= 18) {
        newErrors.scheduledDateTime = 'Please select a time between 9:00 AM and 6:00 PM';
      }

      // Check if it's not on weekends
      const dayOfWeek = selectedDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        newErrors.scheduledDateTime = 'Appointments are available Monday through Friday only';
      }
    }

    // Meeting details validation
    if (formData.meetingDetails.location === 'online' && !formData.meetingDetails.meetingLink.trim()) {
      newErrors['meetingDetails.meetingLink'] = 'Meeting link is required for online meetings';
    }

    if (formData.meetingDetails.location === 'customer-location' && !formData.meetingDetails.address.trim()) {
      newErrors['meetingDetails.address'] = 'Address is required for customer location meetings';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const appointmentData = {
        propertyId: product._id,
        ...formData
      };

      const result = await dispatch(bookAppointment(appointmentData)).unwrap();
      
      // Show success message with admin assignment info
      toast.success(
        <div>
          <p className="font-medium">Appointment booked successfully!</p>
          <p className="text-sm text-gray-600">
            Assigned to: {result.assignedAdmin?.name}
          </p>
        </div>,
        { duration: 5000 }
      );
      
      onClose();
      
      // Reset form
      setFormData({
        contactInfo: {
          name: '',
          email: '',
          phone: '',
          preferredContactMethod: 'phone'
        },
        scheduledDateTime: '',
        appointmentType: 'property-viewing',
        meetingDetails: {
          location: 'property-site',
          address: '',
          meetingLink: '',
          specialInstructions: ''
        },
        customerNotes: ''
      });

    } catch (error) {
      console.error('Appointment booking error:', error);
      toast.error(error?.message || 'Failed to book appointment. Please try again.');
    }
  };

  const appointmentTypes = [
    { value: 'property-viewing', label: 'Property Viewing', icon: <HomeIcon className="h-5 w-5" />, description: 'Tour the property in person' },
    { value: 'consultation', label: 'Consultation', icon: <ClockIcon className="h-5 w-5" />, description: 'Discuss property details and requirements' },
    { value: 'documentation', label: 'Documentation', icon: <CheckCircleIcon className="h-5 w-5" />, description: 'Review contracts and paperwork' },
    { value: 'negotiation', label: 'Negotiation', icon: <CalendarIcon className="h-5 w-5" />, description: 'Discuss terms and pricing' }
  ];

  const meetingLocations = [
    { 
      value: 'property-site', 
      label: 'At Property Location', 
      icon: <MapPinIcon className="h-5 w-5" />,
      description: 'Meet at the property for viewing'
    },
    { 
      value: 'office', 
      label: 'At Office', 
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
      description: 'Meet at our office location'
    },
    { 
      value: 'online', 
      label: 'Online Meeting', 
      icon: <VideoCameraIcon className="h-5 w-5" />,
      description: 'Virtual meeting via video call'
    },
    { 
      value: 'customer-location', 
      label: 'At Your Location', 
      icon: <HomeIcon className="h-5 w-5" />,
      description: 'We\'ll come to your preferred location'
    }
  ];

  const contactMethods = [
    { value: 'phone', label: 'Phone Call' },
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ];

  // Get minimum date (tomorrow) and maximum date (30 days from now)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);
  
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().slice(0, 16);

  // Get property owner info
  const propertyOwner = product.seller;
  const ownerName = propertyOwner?.companyProfile?.companyName || 
                   `${propertyOwner?.individualProfile?.firstName || ''} ${propertyOwner?.individualProfile?.lastName || ''}`.trim() ||
                   'Property Owner';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Property Viewing"
      size="lg"
      className="max-w-2xl"
    >
      <div className="p-6">
        {/* Property Info Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-4">
            {product.media?.images?.[0] && (
              <img
                src={product.media.images[0].url}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {product.propertyDetails?.location?.street && (
                  <span className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {product.propertyDetails.location.street}, {product.propertyDetails.location.city}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                <span className="flex items-center">
                  <UserIcon className="h-3 w-3 mr-1" />
                  Property Owner: {ownerName}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Admin Assignment Notice */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="text-sm text-green-700 dark:text-green-300">
              <p className="font-medium mb-1">Professional Service</p>
              <p>
                Your appointment will be handled by one of our professional agents who will coordinate 
                with the property owner to ensure a smooth viewing experience.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Contact Information
            </h4>
            <div className="space-y-4">
              <Input
                label="Full Name *"
                value={formData.contactInfo.name}
                onChange={(e) => handleInputChange('contactInfo', 'name', e.target.value)}
                error={errors['contactInfo.name']}
                placeholder="Enter your full name"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                  error={errors['contactInfo.email']}
                  placeholder="your@email.com"
                />
                <Input
                  label="Phone Number *"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                  error={errors['contactInfo.phone']}
                  placeholder="+251 9XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {contactMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => handleInputChange('contactInfo', 'preferredContactMethod', method.value)}
                      className={`p-3 text-sm border-2 rounded-lg transition-colors ${
                        formData.contactInfo.preferredContactMethod === method.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Appointment Details
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Appointment Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {appointmentTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange(null, 'appointmentType', type.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        formData.appointmentType === type.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`${
                          formData.appointmentType === type.value
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-400'
                        }`}>
                          {type.icon}
                        </div>
                        <div>
                          <span className="text-sm font-medium block">{type.label}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{type.description}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Preferred Date & Time *"
                type="datetime-local"
                value={formData.scheduledDateTime}
                onChange={(e) => handleInputChange(null, 'scheduledDateTime', e.target.value)}
                error={errors.scheduledDateTime}
                min={minDate}
                max={maxDateString}
                help="Available Monday-Friday, 9:00 AM - 6:00 PM"
              />
            </div>
          </div>

          {/* Meeting Location */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Meeting Location
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {meetingLocations.map((location) => (
                  <button
                    key={location.value}
                    type="button"
                    onClick={() => handleInputChange('meetingDetails', 'location', location.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.meetingDetails.location === location.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`${
                        formData.meetingDetails.location === location.value
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-400'
                      }`}>
                        {location.icon}
                      </div>
                      <div>
                        <span className="text-sm font-medium block">{location.label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{location.description}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {formData.meetingDetails.location === 'online' && (
                <Input
                  label="Meeting Link *"
                  placeholder="https://zoom.us/j/... or Google Meet link"
                  value={formData.meetingDetails.meetingLink}
                  onChange={(e) => handleInputChange('meetingDetails', 'meetingLink', e.target.value)}
                  error={errors['meetingDetails.meetingLink']}
                  help="Provide a video call link for the online meeting"
                />
              )}

              {formData.meetingDetails.location === 'customer-location' && (
                <Input
                  label="Your Address *"
                  placeholder="Street address, City, State"
                  value={formData.meetingDetails.address}
                  onChange={(e) => handleInputChange('meetingDetails', 'address', e.target.value)}
                  error={errors['meetingDetails.address']}
                  help="Our agent will come to this location"
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={formData.meetingDetails.specialInstructions}
                  onChange={(e) => handleInputChange('meetingDetails', 'specialInstructions', e.target.value)}
                  placeholder="Any special requirements, accessibility needs, or instructions for the meeting..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-base"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Questions or Specific Interests (Optional)
            </label>
            <textarea
              value={formData.customerNotes}
              onChange={(e) => handleInputChange(null, 'customerNotes', e.target.value)}
              placeholder="Any questions about the property, specific features you're interested in, or concerns you'd like to discuss..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-base"
            />
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-2">What happens next:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>A professional agent will be assigned to your appointment</li>
                  <li>You'll receive confirmation within 2 hours with agent details</li>
                  <li>Bring valid ID and any necessary documents</li>
                  <li>Viewing typically takes 30-60 minutes</li>
                  <li>Your agent will coordinate with the property owner</li>
                  <li>Feel free to ask questions during the visit</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Booking Error Display */}
          {bookingError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <XMarkIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="text-sm text-red-700 dark:text-red-300">
                  <p className="font-medium">Booking Failed</p>
                  <p>{bookingError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<CalendarIcon className="h-4 w-4" />}
            loadingText="Booking..."
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentBookingModal;