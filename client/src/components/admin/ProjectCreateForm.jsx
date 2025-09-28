// components/admin/ProjectCreateForm.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UsersIcon,
  DocumentIcon,
  StarIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { createProject } from '../../store/slices/projectSlice';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/helpers';

const ProjectCreateForm = ({ isOpen, onClose, categories = [] }) => {
  const dispatch = useDispatch();
  
  // Initialize default form data
  const getInitialFormData = () => ({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    status: 'planning',
    client: { 
      name: '', 
      email: '', 
      phone: '', 
      company: '', 
      website: '' 
    },
    location: { 
      address: '', 
      city: '', 
      region: '', 
      country: 'Ethiopia' 
    },
    timeline: { 
      startDate: '', 
      endDate: '', 
      expectedCompletion: '', 
      duration: '' 
    },
    budget: { 
      amount: '', 
      currency: 'ETB', 
      breakdown: [] 
    },
    features: [],
    services: [],
    team: [],
    images: [],
    displaySettings: { 
      isFeatured: false, 
      isPublic: true, 
      showInPortfolio: true, 
      displayOrder: 0 
    },
    progress: { 
      percentage: 0, 
      milestones: [], 
      phases: [] 
    },
    testimonial: { 
      text: '', 
      author: { 
        name: '', 
        position: '', 
        company: '' 
      } 
    },
    sustainability: { 
      environmentalImpact: '', 
      sustainabilityFeatures: [] 
    }
  });

  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());

  // Form steps configuration
  const steps = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: InformationCircleIcon,
      description: 'Project title, description, and category'
    },
    {
      id: 'client',
      title: 'Client Details',
      icon: UsersIcon,
      description: 'Client information and contact details'
    },
    {
      id: 'location',
      title: 'Location & Timeline',
      icon: MapPinIcon,
      description: 'Project location and timeline details'
    },
    {
      id: 'budget',
      title: 'Budget & Resources',
      icon: CurrencyDollarIcon,
      description: 'Budget information and resource planning'
    },
    {
      id: 'details',
      title: 'Project Details',
      icon: DocumentIcon,
      description: 'Features, services, and team information'
    },
    {
      id: 'media',
      title: 'Media & Settings',
      icon: PhotoIcon,
      description: 'Images, display settings, and final configuration'
    }
  ];

  // Reset form when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setErrors({});
      setFormData(getInitialFormData());
    } else {
      // Ensure form data is properly initialized when opening
      setFormData(prevData => ({
        ...getInitialFormData(),
        ...prevData
      }));
    }
  }, [isOpen]);

  // Safe getter for nested properties
  const getNestedValue = (obj, path, defaultValue = '') => {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    
    return current !== undefined ? current : defaultValue;
  };

  // Validation functions
  const validateStep = (stepIndex) => {
    const newErrors = {};
    
    switch (stepIndex) {
      case 0: // Basic Information
        if (!formData.title?.trim()) newErrors.title = 'Project title is required';
        if (!formData.description?.trim()) newErrors.description = 'Project description is required';
        if (!formData.category) newErrors.category = 'Project category is required';
        break;
        
      case 1: // Client Details
        if (!getNestedValue(formData, 'client.name', '').trim()) {
          newErrors['client.name'] = 'Client name is required';
        }
        const email = getNestedValue(formData, 'client.email', '');
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          newErrors['client.email'] = 'Invalid email format';
        }
        break;
        
      case 2: // Location & Timeline
        if (!getNestedValue(formData, 'location.city', '').trim()) {
          newErrors['location.city'] = 'City is required';
        }
        if (!getNestedValue(formData, 'timeline.startDate', '')) {
          newErrors['timeline.startDate'] = 'Start date is required';
        }
        if (!getNestedValue(formData, 'timeline.duration', '').trim()) {
          newErrors['timeline.duration'] = 'Duration is required';
        }
        break;
        
      case 3: // Budget
        const budgetAmount = getNestedValue(formData, 'budget.amount', '');
        if (!budgetAmount || Number(budgetAmount) <= 0) {
          newErrors['budget.amount'] = 'Budget amount is required and must be greater than 0';
        }
        break;
        
      case 4: // Project Details
        if (!formData.features || formData.features.length === 0) {
          newErrors.features = 'At least one feature is required';
        }
        break;
        
      case 5: // Media & Settings
        // Optional validations for final step
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      // Ensure nested objects exist
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    
    // Clear error for this field
    if (errors[path]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    }
  };

  // Handle array operations
  const addArrayItem = (arrayPath, item) => {
    setFormData(prev => ({
      ...prev,
      [arrayPath]: [...(prev[arrayPath] || []), item]
    }));
  };

  const removeArrayItem = (arrayPath, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayPath]: (prev[arrayPath] || []).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (arrayPath, index, updatedItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayPath]: (prev[arrayPath] || []).map((item, i) => i === index ? updatedItem : item)
    }));
  };

  // Handle file uploads
  const handleFileUpload = (files) => {
    const newImages = Array.from(files).filter(file => file.type.startsWith('image/'));
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  // Navigation functions
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (stepIndex) => {
    // Validate all previous steps
    for (let i = 0; i < stepIndex; i++) {
      if (!validateStep(i)) {
        toast.error(`Please complete step ${i + 1} before proceeding`);
        return;
      }
    }
    setCurrentStep(stepIndex);
  };

  // Submit form
  const handleSubmit = async () => {
    // Validate all steps
    let isValid = true;
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        isValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (!isValid) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await dispatch(createProject(formData)).unwrap();
      toast.success('Project created successfully!');
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create New Project" 
      size="2xl"
      showCloseButton={false}
    >
      <div className="flex flex-col h-[80vh] max-h-[800px]">
        {/* Header with Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Create New Project
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              const isAccessible = index <= currentStep || currentStep === steps.length - 1;

              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => goToStep(index)}
                    disabled={!isAccessible}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : isCompleted
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/30'
                        : isAccessible
                        ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                        : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center',
                      isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    )}>
                      {isCompleted ? (
                        <CheckCircleIcon className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span className="hidden sm:block">{step.title}</span>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-gray-200 dark:bg-gray-700 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {currentStep === 0 && (
                <BasicInformationStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  categories={categories}
                  getNestedValue={getNestedValue}
                />
              )}
              
              {currentStep === 1 && (
                <ClientDetailsStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  getNestedValue={getNestedValue}
                />
              )}
              
              {currentStep === 2 && (
                <LocationTimelineStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  getNestedValue={getNestedValue}
                />
              )}
              
              {currentStep === 3 && (
                <BudgetResourcesStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onAddBudgetItem={addArrayItem}
                  onRemoveBudgetItem={removeArrayItem}
                  onUpdateBudgetItem={updateArrayItem}
                  getNestedValue={getNestedValue}
                />
              )}
              
              {currentStep === 4 && (
                <ProjectDetailsStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onAddFeature={addArrayItem}
                  onRemoveFeature={removeArrayItem}
                  onAddService={addArrayItem}
                  onRemoveService={removeArrayItem}
                  onAddTeamMember={addArrayItem}
                  onRemoveTeamMember={removeArrayItem}
                  onUpdateTeamMember={updateArrayItem}
                />
              )}
              
              {currentStep === 5 && (
                <MediaSettingsStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onFileUpload={handleFileUpload}
                  onRemoveImage={removeArrayItem}
                  dragActive={dragActive}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  getNestedValue={getNestedValue}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer with Navigation */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].description}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                leftIcon={<ChevronLeftIcon className="h-4 w-4" />}
              >
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={nextStep}
                  rightIcon={<ChevronRightIcon className="h-4 w-4" />}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Updated step components with safety checks

// Basic Information Step
const BasicInformationStep = ({ formData, errors, onChange, categories, getNestedValue }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Basic Project Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Provide the essential details about your project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Enter project title"
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
            )}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) => onChange('category', e.target.value)}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.category ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
            )}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={formData.status || 'planning'}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="planning">Planning</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Brief description of the project"
            rows={3}
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detailed Description
          </label>
          <textarea
            value={formData.longDescription || ''}
            onChange={(e) => onChange('longDescription', e.target.value)}
            placeholder="Detailed description of the project, scope, and objectives"
            rows={5}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

// Client Details Step
const ClientDetailsStep = ({ formData, errors, onChange, getNestedValue }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Client Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Provide details about the project client or stakeholder.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={getNestedValue(formData, 'client.name', '')}
            onChange={(e) => onChange('client.name', e.target.value)}
            placeholder="Enter client name"
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors['client.name'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
            )}
          />
          {errors['client.name'] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['client.name']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company
          </label>
          <input
            type="text"
            value={getNestedValue(formData, 'client.company', '')}
            onChange={(e) => onChange('client.company', e.target.value)}
            placeholder="Enter company name"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={getNestedValue(formData, 'client.email', '')}
            onChange={(e) => onChange('client.email', e.target.value)}
            placeholder="Enter email address"
            className={cn(
              'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors['client.email'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
            )}
          />
          {errors['client.email'] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['client.email']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={getNestedValue(formData, 'client.phone', '')}
            onChange={(e) => onChange('client.phone', e.target.value)}
            placeholder="Enter phone number"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Website
          </label>
          <input
            type="url"
            value={getNestedValue(formData, 'client.website', '')}
            onChange={(e) => onChange('client.website', e.target.value)}
            placeholder="Enter website URL"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

// Location Timeline Step
const LocationTimelineStep = ({ formData, errors, onChange, getNestedValue }) => {
  return (
    <div className="space-y-8">
      {/* Location Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Project Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <input
              type="text"
              value={getNestedValue(formData, 'location.address', '')}
              onChange={(e) => onChange('location.address', e.target.value)}
              placeholder="Enter project address"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={getNestedValue(formData, 'location.city', '')}
              onChange={(e) => onChange('location.city', e.target.value)}
              placeholder="Enter city"
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors['location.city'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
              )}
            />
            {errors['location.city'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['location.city']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Region/State
            </label>
            <input
              type="text"
              value={getNestedValue(formData, 'location.region', '')}
              onChange={(e) => onChange('location.region', e.target.value)}
              placeholder="Enter region or state"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            <select
              value={getNestedValue(formData, 'location.country', 'Ethiopia')}
              onChange={(e) => onChange('location.country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Ethiopia">Ethiopia</option>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Project Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={getNestedValue(formData, 'timeline.startDate', '')}
              onChange={(e) => onChange('timeline.startDate', e.target.value)}
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors['timeline.startDate'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
              )}
            />
            {errors['timeline.startDate'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['timeline.startDate']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={getNestedValue(formData, 'timeline.endDate', '')}
              onChange={(e) => onChange('timeline.endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected Completion
            </label>
            <input
              type="date"
              value={getNestedValue(formData, 'timeline.expectedCompletion', '')}
              onChange={(e) => onChange('timeline.expectedCompletion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={getNestedValue(formData, 'timeline.duration', '')}
              onChange={(e) => onChange('timeline.duration', e.target.value)}
              placeholder="e.g., 6 months, 1 year"
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors['timeline.duration'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
              )}
            />
            {errors['timeline.duration'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['timeline.duration']}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Budget Resources Step
const BudgetResourcesStep = ({ formData, errors, onChange, onAddBudgetItem, onRemoveBudgetItem, onUpdateBudgetItem, getNestedValue }) => {
  const [newBudgetItem, setNewBudgetItem] = useState({ category: '', amount: '', description: '' });

  const addBudgetItem = () => {
    if (newBudgetItem.category && newBudgetItem.amount) {
      onAddBudgetItem('budget.breakdown', { ...newBudgetItem, amount: Number(newBudgetItem.amount) });
      setNewBudgetItem({ category: '', amount: '', description: '' });
    }
  };

  const budgetBreakdown = getNestedValue(formData, 'budget.breakdown', []);

  return (
    <div className="space-y-8">
      {/* Main Budget */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Project Budget
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Budget <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={getNestedValue(formData, 'budget.amount', '')}
              onChange={(e) => onChange('budget.amount', e.target.value)}
              placeholder="Enter total budget amount"
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors['budget.amount'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
              )}
            />
            {errors['budget.amount'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['budget.amount']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={getNestedValue(formData, 'budget.currency', 'ETB')}
              onChange={(e) => onChange('budget.currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ETB">Ethiopian Birr (ETB)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
          Budget Breakdown (Optional)
        </h4>
        
        {/* Add New Budget Item */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                value={newBudgetItem.category}
                onChange={(e) => setNewBudgetItem(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Category (e.g., Materials)"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                value={newBudgetItem.amount}
                onChange={(e) => setNewBudgetItem(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Amount"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={newBudgetItem.description}
                onChange={(e) => setNewBudgetItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <Button
                onClick={addBudgetItem}
                disabled={!newBudgetItem.category || !newBudgetItem.amount}
                leftIcon={<PlusIcon className="h-4 w-4" />}
                size="sm"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Budget Items List */}
        {budgetBreakdown.length > 0 && (
          <div className="space-y-3">
            {budgetBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {getNestedValue(formData, 'budget.currency', 'ETB')} {item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">{item.description}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveBudgetItem('budget.breakdown', index)}
                  leftIcon={<TrashIcon className="h-4 w-4" />}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Project Details Step
const ProjectDetailsStep = ({ 
  formData, 
  errors, 
  onChange, 
  onAddFeature, 
  onRemoveFeature,
  onAddService,
  onRemoveService,
  onAddTeamMember,
  onRemoveTeamMember,
  onUpdateTeamMember
}) => {
  const [newFeature, setNewFeature] = useState('');
  const [newService, setNewService] = useState({ name: '', description: '', category: '' });
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', department: '', expertise: [] });

  const addFeature = () => {
    if (newFeature.trim()) {
      onAddFeature('features', newFeature.trim());
      setNewFeature('');
    }
  };

  const addService = () => {
    if (newService.name && newService.description) {
      onAddService('services', newService);
      setNewService({ name: '', description: '', category: '' });
    }
  };

  const addTeamMember = () => {
    if (newTeamMember.name && newTeamMember.role) {
      onAddTeamMember('team', newTeamMember);
      setNewTeamMember({ name: '', role: '', department: '', expertise: [] });
    }
  };

  const features = formData.features || [];
  const services = formData.services || [];
  const team = formData.team || [];

  return (
    <div className="space-y-8">
      {/* Features Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Project Features <span className="text-red-500">*</span>
        </h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Enter a project feature"
            className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addFeature()}
          />
          <Button
            onClick={addFeature}
            disabled={!newFeature.trim()}
            leftIcon={<PlusIcon className="h-4 w-4" />}
            size="sm"
          >
            Add
          </Button>
        </div>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm rounded-full"
              >
                {feature}
                <button
                  onClick={() => onRemoveFeature('features', index)}
                  className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {errors.features && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.features}</p>
        )}
      </div>

      {/* Services Section */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
          Services Provided (Optional)
        </h4>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Service name"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={newService.category}
                onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Category"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <Button
                onClick={addService}
                disabled={!newService.name || !newService.description}
                leftIcon={<PlusIcon className="h-4 w-4" />}
                size="sm"
              >
                Add Service
              </Button>
            </div>
          </div>
          <div>
            <textarea
              value={newService.description}
              onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Service description"
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {services.length > 0 && (
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">{service.name}</h5>
                    {service.category && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full mt-1 inline-block">
                        {service.category}
                      </span>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveService('services', index)}
                    leftIcon={<TrashIcon className="h-4 w-4" />}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Section */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
          Team Members (Optional)
        </h4>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                value={newTeamMember.name}
                onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Team member name"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Role/Position"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={newTeamMember.department}
                onChange={(e) => setNewTeamMember(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Department"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <Button
                onClick={addTeamMember}
                disabled={!newTeamMember.name || !newTeamMember.role}
                leftIcon={<PlusIcon className="h-4 w-4" />}
                size="sm"
              >
                Add Member
              </Button>
            </div>
          </div>
        </div>

        {team.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((member, index) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">{member.name}</h5>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{member.role}</p>
                    {member.department && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">{member.department}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveTeamMember('team', index)}
                    leftIcon={<TrashIcon className="h-4 w-4" />}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Media Settings Step
const MediaSettingsStep = ({ 
  formData, 
  errors, 
  onChange, 
  onFileUpload, 
  onRemoveImage,
  dragActive,
  onDrop,
  onDragOver,
  onDragLeave,
  getNestedValue
}) => {
  const images = formData.images || [];
  const displaySettings = formData.displaySettings || {
    isFeatured: false,
    isPublic: true,
    showInPortfolio: true,
    displayOrder: 0
  };
  const testimonial = formData.testimonial || {
    text: '',
    author: { name: '', position: '', company: '' }
  };

  return (
    <div className="space-y-8">
      {/* Image Upload Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Project Images
        </h3>
        
        {/* File Upload Area */}
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          )}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            <p className="text-lg font-medium mb-2">Drag and drop images here</p>
            <p className="text-sm">or click to browse files</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onFileUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button size="sm">
            Choose Files
          </Button>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
              Selected Images ({images.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => onRemoveImage('images', index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    {index === 0 ? 'Primary' : `Image ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Display Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Display Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Featured Project</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mark this project as featured on the homepage</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={displaySettings.isFeatured}
                onChange={(e) => onChange('displaySettings.isFeatured', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Public Project</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Make this project visible to the public</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={displaySettings.isPublic}
                onChange={(e) => onChange('displaySettings.isPublic', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Show in Portfolio</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Include this project in the portfolio section</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={displaySettings.showInPortfolio}
                onChange={(e) => onChange('displaySettings.showInPortfolio', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={displaySettings.displayOrder}
              onChange={(e) => onChange('displaySettings.displayOrder', Number(e.target.value))}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Lower numbers appear first</p>
          </div>
        </div>
      </div>

      {/* Optional Testimonial */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Client Testimonial (Optional)
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Testimonial Text
            </label>
            <textarea
              value={testimonial.text}
              onChange={(e) => onChange('testimonial.text', e.target.value)}
              placeholder="Enter client testimonial or feedback"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author Name
              </label>
              <input
                type="text"
                value={getNestedValue(testimonial, 'author.name', '')}
                onChange={(e) => onChange('testimonial.author.name', e.target.value)}
                placeholder="Client name"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position
              </label>
              <input
                type="text"
                value={getNestedValue(testimonial, 'author.position', '')}
                onChange={(e) => onChange('testimonial.author.position', e.target.value)}
                placeholder="Job title"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company
              </label>
              <input
                type="text"
                value={getNestedValue(testimonial, 'author.company', '')}
                onChange={(e) => onChange('testimonial.author.company', e.target.value)}
                placeholder="Company name"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreateForm;