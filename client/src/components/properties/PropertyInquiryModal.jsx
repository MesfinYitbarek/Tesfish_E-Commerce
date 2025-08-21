import { useState } from 'react';
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  CalendarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { toast } from 'react-hot-toast';

const PropertyInquiryModal = ({ property, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: 'general',
    preferredContactMethod: 'email',
    preferredViewingTime: '',
    agreeToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'viewing', label: 'Schedule Viewing' },
    { value: 'pricing', label: 'Pricing Information' },
    { value: 'availability', label: 'Availability Check' },
    { value: 'financing', label: 'Financing Options' },
    { value: 'documents', label: 'Request Documents' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (Ethiopian format)
    if (formData.phone && !/^(\+251|0)?[9]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Ethiopian phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store inquiry data
      const inquiryData = {
        ...formData,
        propertyId: property.id,
        propertyTitle: property.title,
        sellerInfo: property.seller,
        submittedAt: new Date().toISOString(),
        status: 'sent'
      };

      // In real app, this would be sent to backend
      console.log('Inquiry submitted:', inquiryData);
      
      toast.success('Inquiry sent successfully! The seller will contact you soon.');
      onClose();
      
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDefaultMessage = () => {
    switch (formData.inquiryType) {
      case 'viewing':
        return `Hi, I'm interested in viewing the property "${property.title}". Please let me know your available times. Thank you.`;
      case 'pricing':
        return `Hi, I would like to get more information about the pricing for "${property.title}". Are there any flexible payment options available?`;
      case 'availability':
        return `Hi, I'm interested in "${property.title}". Is this property still available? Thank you.`;
      case 'financing':
        return `Hi, I'm interested in "${property.title}" and would like to know about financing options and payment plans available.`;
      case 'documents':
        return `Hi, I'm interested in "${property.title}" and would like to request relevant documents such as title deed, permits, etc.`;
      default:
        return `Hi, I'm interested in your property "${property.title}". Could you please provide more information?`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Send Property Inquiry
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Contact the seller about "{property.title}"
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Your Information
                </h4>
                
                <div className="space-y-4">
                  <Input
                    label="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    error={errors.fullName}
                    placeholder="Enter your full name"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email Address *"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      placeholder="your.email@example.com"
                      leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                    />
                    
                    <Input
                      label="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={errors.phone}
                      placeholder="+251 911 123 456"
                      leftIcon={<PhoneIcon className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </div>

              {/* Inquiry Details */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Inquiry Details
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type of Inquiry
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => {
                        handleInputChange('inquiryType', e.target.value);
                        handleInputChange('message', getDefaultMessage());
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                    >
                      {inquiryTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {formData.inquiryType === 'viewing' && (
                    <Input
                      label="Preferred Viewing Time"
                      value={formData.preferredViewingTime}
                      onChange={(e) => handleInputChange('preferredViewingTime', e.target.value)}
                      placeholder="e.g., Weekdays after 5 PM, or Saturday morning"
                      leftIcon={<CalendarIcon className="h-4 w-4" />}
                    />
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={4}
                      placeholder="Tell the seller what you're looking for..."
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base ${
                        errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      value={formData.preferredContactMethod}
                      onChange={(e) => handleInputChange('preferredContactMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="any">Any Method</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className={`mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${
                    errors.agreeToTerms ? 'border-red-500' : ''
                  }`}
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to share my contact information with the property seller for this inquiry. I understand they will contact me regarding this property. *
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>
              )}
            </div>

            {/* Property Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Property Summary</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p><span className="font-medium">Property:</span> {property.title}</p>
                <p><span className="font-medium">Price:</span> {formatCurrency(property.price, property.currency)}</p>
                <p><span className="font-medium">Seller:</span> {property.seller.name}</p>
              </div>
            </div>

            {/* Response Time Info */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100">Response Time</p>
                  <p className="text-blue-800 dark:text-blue-200">
                    {property.seller.name} typically responds within {property.seller.responseTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyInquiryModal;