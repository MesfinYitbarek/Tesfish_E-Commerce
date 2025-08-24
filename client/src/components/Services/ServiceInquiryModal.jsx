// components/Services/ServiceInquiryModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  XMarkIcon,
  DocumentTextIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { createServiceInquiry } from '../../store/slices/serviceInquirySlice';
import { toast } from 'react-hot-toast';

const ServiceInquiryModal = ({ isOpen, onClose, preSelectedService = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: preSelectedService || '',
    projectDetails: {
      title: '',
      description: '',
      location: {
        address: '',
        city: '',
        region: ''
      },
      timeline: {
        startDate: '',
        endDate: '',
        urgency: 'medium'
      },
      budget: {
        min: '',
        max: '',
        currency: 'ETB',
        isFlexible: true
      }
    },
    serviceSpecifics: {}
  });
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { isSubmitting } = useSelector((state) => state.serviceInquiry);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setCurrentStep(1);
      setFormData({
        serviceType: preSelectedService || '',
        projectDetails: {
          title: '',
          description: '',
          location: { address: '', city: '', region: '' },
          timeline: { startDate: '', endDate: '', urgency: 'medium' },
          budget: { min: '', max: '', currency: 'ETB', isFlexible: true }
        },
        serviceSpecifics: {}
      });
      setAttachments([]);
      setErrors({});
    }
  }, [isOpen, preSelectedService]);

  const serviceOptions = [
    {
      value: 'project-management',
      label: 'Project Management',
      description: 'Professional project planning, execution, and oversight for construction and development projects.',
      icon: '🏗️'
    },
    {
      value: 'engineering-design',
      label: 'Engineering Design',
      description: 'Comprehensive engineering design services including civil, architectural, and MEP design.',
      icon: '📐'
    },
    {
      value: 'interior-design',
      label: 'Interior Design',
      description: 'Complete interior design solutions for residential and commercial spaces.',
      icon: '🏠'
    },
    {
      value: 'real-estate-consultancy',
      label: 'Real Estate Consultancy',
      description: 'Expert advisory services for property investment, legal, and technical consultation.',
      icon: '🏢'
    }
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low Priority', description: 'No rush, flexible timeline' },
    { value: 'medium', label: 'Medium Priority', description: 'Standard timeline' },
    { value: 'high', label: 'High Priority', description: 'Important, needs attention soon' },
    { value: 'urgent', label: 'Urgent', description: 'Critical, immediate attention required' }
  ];

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

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      projectDetails: {
        ...prev.projectDetails,
        location: {
          ...prev.projectDetails.location,
          [field]: value
        }
      }
    }));
  };

  const handleTimelineChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      projectDetails: {
        ...prev.projectDetails,
        timeline: {
          ...prev.projectDetails.timeline,
          [field]: value
        }
      }
    }));
  };

  const handleBudgetChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      projectDetails: {
        ...prev.projectDetails,
        budget: {
          ...prev.projectDetails.budget,
          [field]: value
        }
      }
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.serviceType) {
        newErrors.serviceType = 'Please select a service type';
      }
    }

    if (step === 2) {
      if (!formData.projectDetails.title.trim()) {
        newErrors['projectDetails.title'] = 'Project title is required';
      }
      if (!formData.projectDetails.description.trim()) {
        newErrors['projectDetails.description'] = 'Project description is required';
      }
      if (!formData.projectDetails.location.city.trim()) {
        newErrors['projectDetails.location.city'] = 'Project location is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

const handleSubmit = async () => {
  // Run validation for all steps
  for (let step = 1; step <= 3; step++) {
    if (!validateStep(step)) {
      setCurrentStep(step);
      return;
    }
  }

  try {
    const submissionData = new FormData();
    submissionData.append('serviceType', formData.serviceType);
    submissionData.append('projectDetails', JSON.stringify(formData.projectDetails));
    submissionData.append('serviceSpecifics', JSON.stringify(formData.serviceSpecifics));
    attachments.forEach((file) => submissionData.append('attachments', file));

    await dispatch(createServiceInquiry(submissionData)).unwrap();

    toast.success('Service inquiry submitted successfully!');
    onClose();
  } catch (error) {
    console.error('Submit inquiry error:', error);

    if (error?.errors) {
      const newErrors = {};
      error.errors.forEach((err) => {
        newErrors[err.field] = err.message;
      });
      setErrors(newErrors);
      toast.error('Please fix the highlighted errors');
    } else {
      toast.error(error?.message || 'Failed to submit inquiry');
    }
  }
};


  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Select Service Type';
      case 2: return 'Project Details';
      case 3: return 'Timeline & Budget';
      case 4: return 'Review & Submit';
      default: return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Service Consultation"
      size="lg"
      className="max-w-2xl"
    >
      <div className="p-6">
        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Step {currentStep} of 4: {getStepTitle()}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((currentStep / 4) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Service Provider Notice */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Professional Service by TesGold</p>
              <p>Your inquiry will be handled by our expert team. We'll review your requirements and provide a comprehensive consultation and quote.</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Service Type Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                What type of service do you need?
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {serviceOptions.map((service) => (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => handleInputChange(null, 'serviceType', service.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.serviceType === service.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {service.label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.serviceType && (
                <p className="text-red-500 text-sm">{errors.serviceType}</p>
              )}
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Title *
                </label>
                <Input
                  value={formData.projectDetails.title}
                  onChange={(e) => handleInputChange('projectDetails', 'title', e.target.value)}
                  placeholder="Brief title for your project"
                  error={errors['projectDetails.title']}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={formData.projectDetails.description}
                  onChange={(e) => handleInputChange('projectDetails', 'description', e.target.value)}
                  placeholder="Describe your project requirements, goals, and any specific needs..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base"
                />
                {errors['projectDetails.description'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['projectDetails.description']}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City/Location *
                  </label>
                  <Input
                    value={formData.projectDetails.location.city}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                    placeholder="Project location"
                    leftIcon={<MapPinIcon className="h-4 w-4" />}
                    error={errors['projectDetails.location.city']}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region/State
                  </label>
                  <Input
                    value={formData.projectDetails.location.region}
                    onChange={(e) => handleLocationChange('region', e.target.value)}
                    placeholder="Region or state"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specific Address (Optional)
                </label>
                <Input
                  value={formData.projectDetails.location.address}
                  onChange={(e) => handleLocationChange('address', e.target.value)}
                  placeholder="Street address, building name, etc."
                />
              </div>
            </div>
          )}

          {/* Step 3: Timeline & Budget */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.projectDetails.timeline.startDate}
                    onChange={(e) => handleTimelineChange('startDate', e.target.value)}
                    leftIcon={<CalendarIcon className="h-4 w-4" />}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Completion Date
                  </label>
                  <Input
                    type="date"
                    value={formData.projectDetails.timeline.endDate}
                    onChange={(e) => handleTimelineChange('endDate', e.target.value)}
                    leftIcon={<CalendarIcon className="h-4 w-4" />}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Project Urgency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {urgencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleTimelineChange('urgency', option.value)}
                      className={`p-3 border-2 rounded-lg text-left transition-colors ${
                        formData.projectDetails.timeline.urgency === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Budget Range (Optional)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    type="number"
                    value={formData.projectDetails.budget.min}
                    onChange={(e) => handleBudgetChange('min', e.target.value)}
                    placeholder="Minimum"
                    leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                  />
                  <Input
                    type="number"
                    value={formData.projectDetails.budget.max}
                    onChange={(e) => handleBudgetChange('max', e.target.value)}
                    placeholder="Maximum"
                    leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                  />
                  <select
                    value={formData.projectDetails.budget.currency}
                    onChange={(e) => handleBudgetChange('currency', e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                  >
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Budget range helps us provide more accurate quotes. Leave blank for consultation.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Review Your Request
                </h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Service Type:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {serviceOptions.find(s => s.value === formData.serviceType)?.label}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Project:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {formData.projectDetails.title}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Location:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {formData.projectDetails.location.city}
                      {formData.projectDetails.location.region && `, ${formData.projectDetails.location.region}`}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Urgency:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {urgencyOptions.find(u => u.value === formData.projectDetails.timeline.urgency)?.label}
                    </span>
                  </div>
                  
                  {(formData.projectDetails.budget.min || formData.projectDetails.budget.max) && (
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Budget:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        {formData.projectDetails.budget.min && formData.projectDetails.budget.max
                          ? `${formData.projectDetails.budget.min} - ${formData.projectDetails.budget.max} ${formData.projectDetails.budget.currency}`
                          : formData.projectDetails.budget.min
                          ? `From ${formData.projectDetails.budget.min} ${formData.projectDetails.budget.currency}`
                          : `Up to ${formData.projectDetails.budget.max} ${formData.projectDetails.budget.currency}`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <PaperClipIcon className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload files or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      PDF, DOC, images up to 10MB each
                    </span>
                  </label>
                </div>
                
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms Notice */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <p className="font-medium mb-1">Next Steps</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Our team will review your inquiry within 24 hours</li>
                      <li>We'll contact you to schedule a consultation</li>
                      <li>You'll receive a detailed quote after consultation</li>
                      <li>No obligation until you accept our proposal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                leftIcon={<DocumentTextIcon className="h-4 w-4" />}
              >
                Submit Request
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ServiceInquiryModal;