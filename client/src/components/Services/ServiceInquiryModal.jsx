import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  CalendarIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ClockIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { createServiceInquiry } from '../../store/slices/serviceInquirySlice';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const ServiceInquiryModal = ({ service, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.serviceInquiry);

  const [formData, setFormData] = useState({
    // Customer Information (pre-filled from user profile)
    customerInfo: {
      firstName: user?.customerProfile?.firstName || user?.individualProfile?.firstName || '',
      lastName: user?.customerProfile?.lastName || user?.individualProfile?.lastName || '',
      email: user?.email || '',
      phone: user?.customerProfile?.phone || user?.individualProfile?.phone || '',
      company: user?.companyProfile?.companyName || ''
    },

    // Project Details
    projectDetails: {
      title: '',
      description: '',
      budget: {
        min: '',
        max: '',
        currency: 'ETB'
      },
      timeline: {
        startDate: '',
        endDate: '',
        duration: ''
      },
      location: '',
      requirements: [''],
      deliverables: ['']
    },

    priority: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);

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
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    const errorKey = section ? `${section}.${field}` : field;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleArrayInputChange = (section, field, index, value) => {
    const newArray = [...formData[section][field]];
    newArray[index] = value;

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newArray
      }
    }));
  };

  const addArrayItem = (section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], '']
      }
    }));
  };

  const removeArrayItem = (section, field, index) => {
    const newArray = formData[section][field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newArray
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Customer info validation
    if (!formData.customerInfo.firstName.trim()) {
      newErrors['customerInfo.firstName'] = 'First name is required';
    }
    if (!formData.customerInfo.lastName.trim()) {
      newErrors['customerInfo.lastName'] = 'Last name is required';
    }
    if (!formData.customerInfo.email.trim()) {
      newErrors['customerInfo.email'] = 'Email is required';
    }
    if (!formData.customerInfo.phone.trim()) {
      newErrors['customerInfo.phone'] = 'Phone number is required';
    }

    // Email validation
    if (formData.customerInfo.email && !/\S+@\S+\.\S+/.test(formData.customerInfo.email)) {
      newErrors['customerInfo.email'] = 'Please enter a valid email address';
    }

    // Project details validation
    if (!formData.projectDetails.title.trim()) {
      newErrors['projectDetails.title'] = 'Project title is required';
    }
    if (!formData.projectDetails.description.trim()) {
      newErrors['projectDetails.description'] = 'Project description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const inquiryData = {
        serviceProvider: service.seller._id,
        serviceType: service.serviceDetails?.serviceType || 'other',
        customerInfo: formData.customerInfo,
        projectDetails: {
          ...formData.projectDetails,
          requirements: formData.projectDetails.requirements.filter(r => r.trim()),
          deliverables: formData.projectDetails.deliverables.filter(d => d.trim())
        },
        priority: formData.priority
      };

      const result = await dispatch(createServiceInquiry(inquiryData));

      if (createServiceInquiry.fulfilled.match(result)) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    }
  };

  const serviceProviderName = service.seller?.companyProfile?.companyName ||
    `${service.seller?.individualProfile?.firstName} ${service.seller?.individualProfile?.lastName}` ||
    'Service Provider';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 relative">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative z-10 inline-block align-bottom bg-white dark:bg-gray-900 
                    rounded-lg text-left overflow-hidden shadow-xl transform transition-all 
                    sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Request Service Quote
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Get a quote for "{service.title}"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Customer & Project Info */}
              <div className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Your Information
                  </h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name *"
                        value={formData.customerInfo.firstName}
                        onChange={(e) => handleInputChange('customerInfo', 'firstName', e.target.value)}
                        error={errors['customerInfo.firstName']}
                        placeholder="Your first name"
                      />

                      <Input
                        label="Last Name *"
                        value={formData.customerInfo.lastName}
                        onChange={(e) => handleInputChange('customerInfo', 'lastName', e.target.value)}
                        error={errors['customerInfo.lastName']}
                        placeholder="Your last name"
                      />
                    </div>

                    <Input
                      label="Email Address *"
                      type="email"
                      value={formData.customerInfo.email}
                      onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
                      error={errors['customerInfo.email']}
                      placeholder="your.email@example.com"
                      leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                    />

                    <Input
                      label="Phone Number *"
                      value={formData.customerInfo.phone}
                      onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
                      error={errors['customerInfo.phone']}
                      placeholder="+251 911 123 456"
                      leftIcon={<PhoneIcon className="h-4 w-4" />}
                    />

                    <Input
                      label="Company (Optional)"
                      value={formData.customerInfo.company}
                      onChange={(e) => handleInputChange('customerInfo', 'company', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Project Details
                  </h4>

                  <div className="space-y-4">
                    <Input
                      label="Project Title *"
                      value={formData.projectDetails.title}
                      onChange={(e) => handleInputChange('projectDetails', 'title', e.target.value)}
                      error={errors['projectDetails.title']}
                      placeholder="Brief title for your project"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project Description *
                      </label>
                      <textarea
                        value={formData.projectDetails.description}
                        onChange={(e) => handleInputChange('projectDetails', 'description', e.target.value)}
                        rows={4}
                        placeholder="Describe your project requirements, goals, and any specific details..."
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base ${errors['projectDetails.description'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                      />
                      {errors['projectDetails.description'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['projectDetails.description']}</p>
                      )}
                    </div>

                    <Input
                      label="Project Location"
                      value={formData.projectDetails.location}
                      onChange={(e) => handleInputChange('projectDetails', 'location', e.target.value)}
                      placeholder="Where will this project take place?"
                      leftIcon={<MapPinIcon className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Budget, Timeline & Requirements */}
              <div className="space-y-6">
                {/* Budget */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                    Budget Range
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Minimum Budget"
                      type="number"
                      value={formData.projectDetails.budget.min}
                      onChange={(e) => handleNestedInputChange('projectDetails', 'budget', 'min', e.target.value)}
                      placeholder="Min amount"
                      leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                    />

                    <Input
                      label="Maximum Budget"
                      type="number"
                      value={formData.projectDetails.budget.max}
                      onChange={(e) => handleNestedInputChange('projectDetails', 'budget', 'max', e.target.value)}
                      placeholder="Max amount"
                      leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Timeline
                  </h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Start Date"
                        type="date"
                        value={formData.projectDetails.timeline.startDate}
                        onChange={(e) => handleNestedInputChange('projectDetails', 'timeline', 'startDate', e.target.value)}
                      />

                      <Input
                        label="End Date"
                        type="date"
                        value={formData.projectDetails.timeline.endDate}
                        onChange={(e) => handleNestedInputChange('projectDetails', 'timeline', 'endDate', e.target.value)}
                      />
                    </div>

                    <Input
                      label="Duration Description"
                      value={formData.projectDetails.timeline.duration}
                      onChange={(e) => handleNestedInputChange('projectDetails', 'timeline', 'duration', e.target.value)}
                      placeholder="e.g., 2 weeks, 1 month, flexible"
                      leftIcon={<ClockIcon className="h-4 w-4" />}
                    />
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specific Requirements
                  </label>
                  <div className="space-y-2">
                    {formData.projectDetails.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => handleArrayInputChange('projectDetails', 'requirements', index, e.target.value)}
                          placeholder="Enter a requirement"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                        />
                        {formData.projectDetails.requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('projectDetails', 'requirements', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('projectDetails', 'requirements')}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      + Add requirement
                    </button>
                  </div>
                </div>

                {/* Expected Deliverables */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expected Deliverables
                  </label>
                  <div className="space-y-2">
                    {formData.projectDetails.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={deliverable}
                          onChange={(e) => handleArrayInputChange('projectDetails', 'deliverables', index, e.target.value)}
                          placeholder="Enter a deliverable"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                        />
                        {formData.projectDetails.deliverables.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('projectDetails', 'deliverables', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('projectDetails', 'deliverables')}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      + Add deliverable
                    </button>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange(null, 'priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                  >
                    <option value="low">Low - No rush</option>
                    <option value="medium">Medium - Standard timeline</option>
                    <option value="high">High - Need it soon</option>
                    <option value="urgent">Urgent - ASAP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Service Summary */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Service Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Service:</span> {service.title}</p>
                  <p><span className="font-medium">Provider:</span> {serviceProviderName}</p>
                </div>
                <div>
                  <p><span className="font-medium">Base Price:</span> {formatCurrency(service.pricing?.basePrice, service.pricing?.currency)}</p>
                  <p><span className="font-medium">Type:</span> {service.serviceDetails?.serviceType?.replace('-', ' ') || 'Service'}</p>
                </div>
                <div>
                  {service.serviceDetails?.duration && (
                    <p><span className="font-medium">Duration:</span> {service.serviceDetails.duration.value} {service.serviceDetails.duration.unit}</p>
                  )}
                  {service.serviceDetails?.location && (
                    <p><span className="font-medium">Location:</span> {service.serviceDetails.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Info Notice */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100">What happens next?</p>
                  <ul className="text-blue-800 dark:text-blue-200 mt-1 space-y-1">
                    <li>• The service provider will review your requirements</li>
                    <li>• You'll receive a detailed quote within 24-48 hours</li>
                    <li>• You can discuss and negotiate the terms</li>
                    <li>• Once agreed, you can proceed with the project</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Send Inquiry'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceInquiryModal;