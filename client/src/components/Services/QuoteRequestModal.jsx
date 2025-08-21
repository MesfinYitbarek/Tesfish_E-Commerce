import { useState } from 'react';
import { 
  XMarkIcon,
  PaperClipIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ETHIOPIAN_CITIES } from '../../constants';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const QuoteRequestModal = ({ service, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Service Selection
    selectedPackage: '',
    customRequirements: false,
    
    // Step 2: Project Details
    projectTitle: '',
    projectDescription: '',
    projectType: '',
    location: '',
    propertyType: '',
    projectSize: '',
    
    // Step 3: Specifications
    specifications: {
      area: '',
      rooms: '',
      floors: '',
      style: '',
      materials: '',
      features: []
    },
    timeline: {
      startDate: '',
      completionDate: '',
      flexibility: 'normal'
    },
    
    // Step 4: Budget & Contact
    budgetRange: '',
    budgetFlexibility: 'firm',
    fullName: '',
    email: '',
    phone: '',
    company: '',
    preferredContactMethod: 'email',
    
    // Step 5: Additional Info
    additionalRequirements: '',
    previousExperience: '',
    referenceProjects: false,
    urgency: 'normal'
  });

  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: 'Service Package', description: 'Choose your service package' },
    { number: 2, title: 'Project Details', description: 'Tell us about your project' },
    { number: 3, title: 'Specifications', description: 'Detailed requirements' },
    { number: 4, title: 'Budget & Contact', description: 'Budget and contact info' },
    { number: 5, title: 'Review & Submit', description: 'Review and submit' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFeatureToggle = (feature) => {
    const currentFeatures = formData.specifications.features;
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    
    handleInputChange('specifications.features', updatedFeatures);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.selectedPackage && !formData.customRequirements) {
          newErrors.selectedPackage = 'Please select a package or choose custom requirements';
        }
        break;
        
      case 2:
        if (!formData.projectTitle.trim()) newErrors.projectTitle = 'Project title is required';
        if (!formData.projectDescription.trim()) newErrors.projectDescription = 'Project description is required';
        if (!formData.location) newErrors.location = 'Location is required';
        break;
        
      case 4:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.budgetRange) newErrors.budgetRange = 'Budget range is required';
        
        // Email validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        
        // Phone validation
        if (formData.phone && !/^(\+251|0)?[9]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid Ethiopian phone number';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form fields
      submitData.append('quoteData', JSON.stringify(formData));
      submitData.append('serviceId', service.id);
      submitData.append('serviceName', service.title);
      submitData.append('providerId', service.provider.name);
      
      // Add attachments
      attachments.forEach((file, index) => {
        submitData.append(`attachment_${index}`, file);
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Quote request submitted successfully! You will receive a detailed quote within 24-48 hours.');
      onClose();
      
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    'New Construction',
    'Renovation/Remodeling',
    'Interior Design',
    'Engineering Design',
    'Consulting',
    'Project Management',
    'Other'
  ];

  const propertyTypes = [
    'Residential House',
    'Apartment/Condo',
    'Villa',
    'Commercial Office',
    'Retail Space',
    'Restaurant/Cafe',
    'Hotel',
    'Industrial',
    'Mixed-Use',
    'Other'
  ];

  const budgetRanges = [
    { value: 'under-50k', label: 'Under ETB 50,000' },
    { value: '50k-100k', label: 'ETB 50,000 - 100,000' },
    { value: '100k-250k', label: 'ETB 100,000 - 250,000' },
    { value: '250k-500k', label: 'ETB 250,000 - 500,000' },
    { value: '500k-1m', label: 'ETB 500,000 - 1,000,000' },
    { value: 'over-1m', label: 'Over ETB 1,000,000' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const availableFeatures = [
    'Modern Design',
    'Traditional Design',
    'Sustainable/Eco-friendly',
    'Smart Home Technology',
    'Security Systems',
    'Landscaping',
    'Swimming Pool',
    'Gym/Fitness Area',
    'Parking Garage',
    'Storage Areas',
    'Outdoor Living Space',
    'Home Office',
    'Guest Accommodation',
    'Accessibility Features'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Choose Your Service Package
              </h3>
              <div className="space-y-4">
                {service.pricing.packages.map((pkg, index) => (
                  <label
                    key={index}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.selectedPackage === pkg.name
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="package"
                      value={pkg.name}
                      checked={formData.selectedPackage === pkg.name}
                      onChange={(e) => {
                        handleInputChange('selectedPackage', e.target.value);
                        handleInputChange('customRequirements', false);
                      }}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {pkg.name}
                          </h4>
                          {pkg.popular && (
                            <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Duration: {pkg.duration}
                        </p>
                        <ul className="space-y-1">
                          {pkg.features.slice(0, 4).map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                              <CheckIcon className="h-3 w-3 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            </li>
                          ))}
                          {pkg.features.length > 4 && (
                            <li className="text-sm text-primary-600 dark:text-primary-400">
                              +{pkg.features.length - 4} more features
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatCurrency(pkg.price, service.pricing.currency)}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
                
                {/* Custom Requirements Option */}
                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.customRequirements
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.customRequirements}
                    onChange={(e) => {
                      handleInputChange('customRequirements', e.target.checked);
                      if (e.target.checked) {
                        handleInputChange('selectedPackage', '');
                      }
                    }}
                    className="sr-only"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Custom Requirements
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      I have specific requirements not covered by the standard packages
                    </p>
                  </div>
                </label>
              </div>
              {errors.selectedPackage && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.selectedPackage}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Project Details
              </h3>
              <div className="space-y-4">
                <Input
                  label="Project Title *"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                  error={errors.projectTitle}
                  placeholder="Brief title of your project"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => handleInputChange('projectType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base ${
                        errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select location</option>
                      {ETHIOPIAN_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Property Type
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => handleInputChange('propertyType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Input
                    label="Project Size"
                    value={formData.projectSize}
                    onChange={(e) => handleInputChange('projectSize', e.target.value)}
                    placeholder="e.g., 150 sqm, 3 bedrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    rows={4}
                    placeholder="Describe your project in detail..."
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base ${
                      errors.projectDescription ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.projectDescription && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.projectDescription}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Project Specifications
              </h3>
              
              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                  label="Total Area"
                  value={formData.specifications.area}
                  onChange={(e) => handleInputChange('specifications.area', e.target.value)}
                  placeholder="e.g., 200 sqm"
                />
                
                <Input
                  label="Number of Rooms"
                  value={formData.specifications.rooms}
                  onChange={(e) => handleInputChange('specifications.rooms', e.target.value)}
                  placeholder="e.g., 4 bedrooms, 3 bathrooms"
                />
                
                <Input
                  label="Number of Floors"
                  value={formData.specifications.floors}
                  onChange={(e) => handleInputChange('specifications.floors', e.target.value)}
                  placeholder="e.g., 2 floors"
                />
                
                <Input
                  label="Preferred Style"
                  value={formData.specifications.style}
                  onChange={(e) => handleInputChange('specifications.style', e.target.value)}
                  placeholder="e.g., Modern, Traditional, Contemporary"
                />
              </div>

              {/* Features */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Desired Features (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableFeatures.map(feature => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.specifications.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Material Preferences
                </label>
                <textarea
                  value={formData.specifications.materials}
                  onChange={(e) => handleInputChange('specifications.materials', e.target.value)}
                  rows={3}
                  placeholder="Specify preferred materials, finishes, quality levels, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                />
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Timeline</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Preferred Start Date"
                    type="date"
                    value={formData.timeline.startDate}
                    onChange={(e) => handleInputChange('timeline.startDate', e.target.value)}
                  />
                  
                  <Input
                    label="Desired Completion Date"
                    type="date"
                    value={formData.timeline.completionDate}
                    onChange={(e) => handleInputChange('timeline.completionDate', e.target.value)}
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeline Flexibility
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'flexible', label: 'Flexible' },
                      { value: 'normal', label: 'Somewhat Flexible' },
                      { value: 'strict', label: 'Strict Deadline' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="flexibility"
                          value={option.value}
                          checked={formData.timeline.flexibility === option.value}
                          onChange={(e) => handleInputChange('timeline.flexibility', e.target.value)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Budget & Contact Information
              </h3>
              
              {/* Budget */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Range *
                </label>
                <div className="space-y-2">
                  {budgetRanges.map(range => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="budgetRange"
                        value={range.value}
                        checked={formData.budgetRange === range.value}
                        onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                        className="mr-3 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{range.label}</span>
                    </label>
                  ))}
                </div>
                {errors.budgetRange && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.budgetRange}</p>
                )}
              </div>

              {/* Budget Flexibility */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Flexibility
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'firm', label: 'Firm Budget' },
                    { value: 'flexible', label: 'Somewhat Flexible' },
                    { value: 'very-flexible', label: 'Very Flexible' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="budgetFlexibility"
                        value={option.value}
                        checked={formData.budgetFlexibility === option.value}
                        onChange={(e) => handleInputChange('budgetFlexibility', e.target.value)}
                        className="mr-2 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    error={errors.fullName}
                    placeholder="Enter your full name"
                  />
                  
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
                  
                  <Input
                    label="Company (Optional)"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Your company name"
                  />
                </div>
                
                <div className="mt-4">
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
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Additional Information & Review
              </h3>
              
              {/* Additional Requirements */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Requirements or Special Requests
                </label>
                <textarea
                  value={formData.additionalRequirements}
                  onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                  rows={4}
                  placeholder="Any specific requirements, constraints, or special requests..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                />
              </div>

              {/* Previous Experience */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Previous Experience with Similar Projects
                </label>
                <textarea
                  value={formData.previousExperience}
                  onChange={(e) => handleInputChange('previousExperience', e.target.value)}
                  rows={3}
                  placeholder="Tell us about any previous experience with similar projects..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                />
              </div>

              {/* Reference Projects */}
              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.referenceProjects}
                    onChange={(e) => handleInputChange('referenceProjects', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I would like to see reference projects and speak to previous clients
                  </span>
                </label>
              </div>

              {/* Quote Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Quote Request Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="font-medium">Service:</span> {service.title}</p>
                    <p><span className="font-medium">Package:</span> {formData.selectedPackage || 'Custom Requirements'}</p>
                    <p><span className="font-medium">Project:</span> {formData.projectTitle}</p>
                    <p><span className="font-medium">Location:</span> {formData.location}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Budget:</span> {budgetRanges.find(r => r.value === formData.budgetRange)?.label}</p>
                    <p><span className="font-medium">Contact:</span> {formData.fullName}</p>
                    <p><span className="font-medium">Email:</span> {formData.email}</p>
                    <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                  </div>
                </div>
              </div>

              {/* Expected Response Time */}
              <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <ClockIcon className="h-5 w-5 text-blue-500" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100">Expected Response Time</p>
                  <p className="text-blue-700 dark:text-blue-300">
                    You will receive a detailed quote within 24-48 hours. The service provider will contact you via {formData.preferredContactMethod} to discuss project details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Request Quote
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Get a detailed quote for "{service.title}" from {service.provider.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.number
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="hidden md:block">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="max-h-96 overflow-y-auto pr-2">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <InformationCircleIcon className="h-4 w-4" />
                <span>Step {currentStep} of {steps.length}</span>
              </div>
              
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                
                {currentStep < 5 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestModal;