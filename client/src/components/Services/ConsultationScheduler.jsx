import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { scheduleConsultation } from '../../store/slices/serviceInquirySlice';
import { toast } from 'react-hot-toast';

const ConsultationScheduler = ({ isOpen, onClose, inquiry }) => {
  const [formData, setFormData] = useState({
    dateTime: '',
    duration: 60,
    location: 'online',
    meetingLink: '',
    notes: '',
    reminderEnabled: true
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { isSubmitting } = useSelector((state) => state.serviceInquiry);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        dateTime: '',
        duration: 60,
        location: 'online',
        meetingLink: '',
        notes: '',
        reminderEnabled: true
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.dateTime) {
      newErrors.dateTime = 'Date and time is required';
    } else if (new Date(formData.dateTime) <= new Date()) {
      newErrors.dateTime = 'Date and time must be in the future';
    }

    if (formData.duration <= 0 || formData.duration > 480) {
      newErrors.duration = 'Duration must be between 1 and 480 minutes';
    }

    if (formData.location === 'online' && !formData.meetingLink.trim()) {
      newErrors.meetingLink = 'Meeting link is required for online consultations';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const consultationData = {
        dateTime: formData.dateTime,
        duration: parseInt(formData.duration),
        location: formData.location,
        meetingLink: formData.location === 'online' ? formData.meetingLink : undefined,
        notes: formData.notes.trim()
      };

      await dispatch(scheduleConsultation({
        inquiryId: inquiry._id,
        consultationData
      })).unwrap();

      toast.success('Consultation scheduled successfully!');
      onClose();

    } catch (error) {
      console.error('Schedule consultation error:', error);
      toast.error(error || 'Failed to schedule consultation');
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Minimum 1 hour from now
    return now.toISOString().slice(0, 16);
  };

  const locationOptions = [
    { value: 'online', label: 'Online Meeting', icon: VideoCameraIcon },
    { value: 'office', label: 'Our Office', icon: BuildingOfficeIcon },
    { value: 'site-visit', label: 'Site Visit', icon: MapPinIcon },
    { value: 'client-location', label: 'Client Location', icon: UserIcon }
  ];

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Consultation"
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Inquiry Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Consultation for: {inquiry?.projectDetails?.title}
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>Service: {inquiry?.serviceType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            <p>Customer: {inquiry?.customer?.customerProfile?.firstName} {inquiry?.customer?.customerProfile?.lastName}</p>
            <p>Email: {inquiry?.customer?.email}</p>
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date & Time *
            </label>
            <Input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => handleInputChange('dateTime', e.target.value)}
              min={getMinDateTime()}
              leftIcon={<CalendarIcon className="h-4 w-4" />}
              error={errors.dateTime}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration *
            </label>
            <select
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            >
              {durationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
            )}
          </div>
        </div>

        {/* Location Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Consultation Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {locationOptions.map(option => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('location', option.value)}
                  className={`p-3 border-2 rounded-lg transition-colors text-left ${
                    formData.location === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${
                      formData.location === option.value
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      formData.location === option.value
                        ? 'text-primary-900 dark:text-primary-100'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Meeting Link for Online Consultations */}
        {formData.location === 'online' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meeting Link *
            </label>
            <Input
              type="url"
              value={formData.meetingLink}
              onChange={(e) => handleInputChange('meetingLink', e.target.value)}
              placeholder="https://zoom.us/j/... or https://meet.google.com/..."
              leftIcon={<VideoCameraIcon className="h-4 w-4" />}
              error={errors.meetingLink}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Provide a Zoom, Google Meet, Teams, or other video conferencing link
            </p>
          </div>
        )}

        {/* Location Details for Physical Meetings */}
        {(formData.location === 'office' || formData.location === 'client-location' || formData.location === 'site-visit') && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              {formData.location === 'office' && 'Office Address'}
              {formData.location === 'client-location' && 'Client Location'}
              {formData.location === 'site-visit' && 'Site Visit Location'}
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formData.location === 'office' && (
                <div>
                  <p>TesGold Services Office</p>
                  <p>123 Business District, Addis Ababa</p>
                  <p>Ethiopia</p>
                </div>
              )}
              {formData.location === 'client-location' && (
                <p>We'll meet at the customer's preferred location. Address will be confirmed separately.</p>
              )}
              {formData.location === 'site-visit' && (
                <p>We'll visit the project site. Location: {inquiry?.projectDetails?.location?.address || inquiry?.projectDetails?.location?.city}</p>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any specific topics to discuss, preparation requirements, or other notes..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base"
          />
        </div>

        {/* Reminder Setting */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="reminder"
            checked={formData.reminderEnabled}
            onChange={(e) => handleInputChange('reminderEnabled', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="reminder" className="text-sm text-gray-700 dark:text-gray-300">
            Send email reminder to customer 24 hours before the consultation
          </label>
        </div>

        {/* Consultation Guidelines */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Consultation Guidelines</h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Be prepared to discuss project requirements and timeline</li>
            <li>• Have any relevant documents or references ready</li>
            <li>• Allow extra time for technical discussions</li>
            <li>• Test video/audio connection 15 minutes before online meetings</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
          >
            Schedule Consultation
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConsultationScheduler;