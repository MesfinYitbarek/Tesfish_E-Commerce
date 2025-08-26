import BasicInfoStep from './form-steps/BasicInfoStep';
import DetailsStep from './form-steps/DetailsStep';
import PricingStep from './form-steps/PricingStep';
import LocationContactStep from './form-steps/LocationContactStep';
import MediaStep from './form-steps/MediaStep';
import ReviewStep from './form-steps/ReviewStep';
import Button from '../ui/Button';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ProductFormWizard = ({
  currentStep,
  formData,
  errors,
  productTypeConfig,
  onFormDataChange,
  onNext,
  onPrevious,
  isSubmitting,
  canProceed,
  isEditing = false
}) => {
  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Product type, title, and description',
      required: ['title', 'description', 'productType', 'subProductType'],
      conditionalRequired: getStep1ConditionalRequirements(formData?.productType)
    },
    {
      id: 2,
      title: 'Product Details',
      description: 'Specifications and product-specific information',
      required: getStep2Requirements(formData?.productType, formData?.subProductType)
    },
    {
      id: 3,
      title: 'Pricing',
      description: 'Set pricing and payment terms',
      required: getStep3Requirements(formData?.listingType)
    },
    {
      id: 4,
      title: 'Location & Contact',
      description: 'Location details and contact information',
      required: getStep4Requirements(formData?.productType)
    },
    {
      id: 5,
      title: 'Media',
      description: 'Upload photos, videos, and documents',
      required: ['media.images']
    },
    {
      id: 6,
      title: 'Review & Publish',
      description: 'Review all information before publishing',
      required: []
    }
  ];

  // Get conditional required fields for step 1 based on product type
  function getStep1ConditionalRequirements(productType) {
    if (['homes', 'plots', 'commercials'].includes(productType)) {
      return ['listingType']; // Real estate requires listing type (sell/rent)
    }
    return [];
  }

  // Get required fields for step 2 based on product type
  function getStep2Requirements(productType, subProductType) {
    switch (productType) {
      case 'homes':
      case 'commercials':
        return ['propertyDetails.area.value'];
      case 'plots':
        return ['propertyDetails.area.value', 'propertyDetails.landDetails.landUse'];
      case 'others':
        if (subProductType === 'vehicles') {
          return ['vehicleDetails.make', 'vehicleDetails.year'];
        }
        if (subProductType === 'construction-equipment') {
          return ['equipmentDetails.manufacturer'];
        }
        return []; // Other products don't have strict requirements
      default:
        return [];
    }
  }

  // Get required fields for step 3 based on listing type
  function getStep3Requirements(listingType) {
    if (listingType === 'rent') {
      return ['pricing.rentPrice.monthly'];
    }
    return ['pricing.basePrice'];
  }

  // Get required fields for step 4 based on product type
  function getStep4Requirements(productType) {
    const baseRequirements = ['contactInfo.phone'];
    
    if (['homes', 'plots', 'commercials'].includes(productType)) {
      return [...baseRequirements, 'propertyDetails.location.address', 'propertyDetails.location.city'];
    }
    return baseRequirements;
  }

  // Check if field has a value (handles nested fields)
  const hasFieldValue = (fieldPath) => {
    if (!fieldPath) return true;
    
    if (fieldPath.includes('.')) {
      const fieldParts = fieldPath.split('.');
      let value = formData;
      for (const part of fieldParts) {
        value = value?.[part];
        if (value === undefined || value === null) return false;
      }
      
      // Handle array fields (like media.images)
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      
      // Handle string fields
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      
      // Handle number fields
      if (typeof value === 'number') {
        return value > 0;
      }
      
      return Boolean(value);
    }
    
    const value = formData[fieldPath];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return value > 0;
    return Boolean(value);
  };

  // Check if current step has validation errors or missing required fields
  const hasStepErrors = () => {
    const currentStepInfo = steps.find(step => step.id === currentStep);
    if (!currentStepInfo) return false;

    // Check required fields
    const missingRequired = currentStepInfo.required.some(field => !hasFieldValue(field));
    
    // Check conditional required fields
    const missingConditional = currentStepInfo.conditionalRequired?.some(field => !hasFieldValue(field)) || false;
    
    // Check if there are actual validation errors for this step
    const hasValidationErrors = Object.keys(errors).length > 0;

    return missingRequired || missingConditional || hasValidationErrors;
  };

  // Get step completion status
  const getStepStatus = (stepId) => {
    if (stepId < currentStep) {
      // Check if this completed step actually has all required fields
      const stepInfo = steps.find(step => step.id === stepId);
      const hasAllRequired = stepInfo?.required.every(field => hasFieldValue(field)) && 
                            (!stepInfo?.conditionalRequired || stepInfo.conditionalRequired.every(field => hasFieldValue(field)));
      return hasAllRequired ? 'completed' : 'warning';
    }
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  // Get completion percentage
  const getCompletionPercentage = () => {
    let completedSteps = 0;
    for (let i = 1; i < currentStep; i++) {
      if (getStepStatus(i) === 'completed') {
        completedSteps++;
      }
    }
    return Math.round(((completedSteps + 0.5) / steps.length) * 100); // +0.5 for current step in progress
  };

  // Get help text based on current step and product type
  const getHelpText = () => {
    const isRealEstate = ['homes', 'plots', 'commercials'].includes(formData?.productType);
    
    switch (currentStep) {
      case 1:
        return "Choose the right product type and provide a clear, descriptive title to help customers find your listing easily.";
      case 2:
        if (isRealEstate) {
          if (formData?.productType === 'plots') {
            return "Provide land details including size, land use type, and topography. This helps buyers understand the development potential.";
          }
          return "Provide detailed property information including size, number of rooms, and key features that buyers look for.";
        }
        if (formData?.subProductType === 'vehicles') {
          return "Vehicle make, model, and year are essential for buyers. Also include mileage and condition details.";
        }
        return "Add product specifications, condition, and key features that buyers need to make informed decisions.";
      case 3:
        if (formData?.listingType === 'rent') {
          return "Set competitive rental prices. Research similar properties in your area. Consider including utilities in the rent or separately.";
        }
        return "Research market prices for similar products. Consider your costs, desired profit, and competitor pricing.";
      case 4:
        if (isRealEstate) {
          return "Provide exact location details for property viewings. Include nearby landmarks and your contact information.";
        }
        return "Provide accurate contact information so buyers can reach you easily. Consider setting preferred contact methods.";
      case 5:
        return "High-quality images increase inquiries significantly. Add multiple angles, close-ups, and show the product in use if applicable.";
      case 6:
        return "Review all information carefully. Once published, your listing will be visible to potential buyers immediately.";
      default:
        return "";
    }
  };

  // Get step-specific tips
  const getStepTips = () => {
    const tips = [];
    
    if (currentStep === 1) {
      if (!formData?.title || formData.title.length < 10) {
        tips.push({
          type: 'warning',
          message: 'A descriptive title helps buyers find your listing. Aim for at least 10 characters.'
        });
      }
      if (formData?.productType && !formData?.subProductType) {
        tips.push({
          type: 'info',
          message: 'Select a specific sub-type to help categorize your listing properly.'
        });
      }
    }
    
    if (currentStep === 2) {
      if (formData?.productType === 'others' && formData?.subProductType === 'vehicles' && !formData?.vehicleDetails?.make) {
        tips.push({
          type: 'warning',
          message: 'Vehicle make, model, and year are essential information for car buyers.'
        });
      }
      if (['homes', 'commercials'].includes(formData?.productType) && !formData?.propertyDetails?.area?.value) {
        tips.push({
          type: 'warning',
          message: 'Property size is one of the most important factors for buyers.'
        });
      }
    }
    
    if (currentStep === 3) {
      if (formData?.listingType === 'rent' && !formData?.pricing?.rentPrice?.monthly) {
        tips.push({
          type: 'warning',
          message: 'Monthly rent amount is required for rental properties.'
        });
      }
      if (!formData?.pricing?.basePrice && formData?.listingType !== 'rent') {
        tips.push({
          type: 'warning',
          message: 'Set a competitive price based on market research.'
        });
      }
    }
    
    if (currentStep === 4) {
      if (['homes', 'plots', 'commercials'].includes(formData?.productType) && !formData?.propertyDetails?.location?.address) {
        tips.push({
          type: 'warning',
          message: 'Exact location details help buyers evaluate and visit your property.'
        });
      }
    }
    
    if (currentStep === 5) {
      if (!formData?.media?.images?.length) {
        tips.push({
          type: 'error',
          message: 'At least one high-quality image is required. Listings with images get 3x more inquiries.'
        });
      } else if (formData?.media?.images?.length < 3) {
        tips.push({
          type: 'info',
          message: 'Consider adding more images showing different angles and details.'
        });
      }
    }
    
    return tips;
  };

  const renderStep = () => {
    const commonProps = {
      formData,
      errors,
      onChange: onFormDataChange,
      isEditing
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...commonProps} />;
      case 2:
        return <DetailsStep {...commonProps} productTypeConfig={productTypeConfig} />;
      case 3:
        return <PricingStep {...commonProps} />;
      case 4:
        return <LocationContactStep {...commonProps} />;
      case 5:
        return <MediaStep {...commonProps} />;
      case 6:
        return <ReviewStep {...commonProps} productTypeConfig={productTypeConfig} />;
      default:
        return null;
    }
  };

  const stepTips = getStepTips();

  return (
    <div className="p-6">
      {/* Step Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {steps.find(step => step.id === currentStep)?.title}
          </h2>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {steps.find(step => step.id === currentStep)?.description}
        </p>
        
        {/* Help Text */}
        {getHelpText() && (
          <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {getHelpText()}
            </p>
          </div>
        )}

        {/* Step Tips */}
        {stepTips.map((tip, index) => (
          <div 
            key={index}
            className={`flex items-start space-x-2 p-3 rounded-lg mb-2 ${
              tip.type === 'error' 
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : tip.type === 'warning'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            }`}
          >
            <ExclamationTriangleIcon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
              tip.type === 'error'
                ? 'text-red-600 dark:text-red-400'
                : tip.type === 'warning'
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-green-600 dark:text-green-400'
            }`} />
            <p className={`text-sm ${
              tip.type === 'error'
                ? 'text-red-700 dark:text-red-300'
                : tip.type === 'warning'
                ? 'text-yellow-700 dark:text-yellow-300'
                : 'text-green-700 dark:text-green-300'
            }`}>
              {tip.message}
            </p>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Validation Errors Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2 flex items-center">
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            Please fix the following errors:
          </h4>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {Object.entries(errors).slice(0, 5).map(([field, message]) => (
              <li key={field} className="flex items-start">
                <span className="w-1 h-1 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                {message}
              </li>
            ))}
            {Object.keys(errors).length > 5 && (
              <li className="text-xs text-red-600 dark:text-red-400 italic">
                ... and {Object.keys(errors).length - 5} more errors
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{getCompletionPercentage()}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={onPrevious}
              leftIcon={<ChevronLeftIcon className="h-4 w-4" />}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              Previous
            </Button>
          )}
        </div>

        {/* Step Dots Indicator */}
        <div className="flex items-center space-x-2">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            return (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  status === 'completed'
                    ? 'bg-green-500 border-green-500'
                    : status === 'warning'
                    ? 'bg-yellow-500 border-yellow-500'
                    : status === 'current'
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-transparent border-gray-300 dark:border-gray-600'
                }`}
                title={`Step ${step.id}: ${step.title}`}
              />
            );
          })}
        </div>

        <div>
          {currentStep < steps.length ? (
            <Button
              onClick={onNext}
              rightIcon={<ChevronRightIcon className="h-4 w-4" />}
              disabled={isSubmitting || !canProceed || hasStepErrors()}
              className="min-w-[100px]"
            >
              {currentStep === steps.length - 1 ? 'Review' : 'Next'}
            </Button>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400 min-w-[100px] text-right">
              Ready to {isEditing ? 'update' : 'publish'}
            </div>
          )}
        </div>
      </div>

      {/* Final Step Success Message */}
      {currentStep === 6 && Object.keys(errors).length === 0 && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                🎉 Excellent! Your listing is ready to {isEditing ? 'update' : 'publish'}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                All required information has been provided. Use the buttons above to save as draft or publish your listing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFormWizard;