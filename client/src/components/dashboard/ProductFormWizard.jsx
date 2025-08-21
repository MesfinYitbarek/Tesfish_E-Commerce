import BasicInfoStep from './form-steps/BasicInfoStep';
import DetailsStep from './form-steps/DetailsStep';
import PricingStep from './form-steps/PricingStep';
import MediaStep from './form-steps/MediaStep';
import ReviewStep from './form-steps/ReviewStep';
import Button from '../ui/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ProductFormWizard = ({
  currentStep,
  formData,
  errors,
  onFormDataChange,
  onNext,
  onPrevious,
  isSubmitting
}) => {
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            errors={errors}
            onChange={onFormDataChange}
          />
        );
      case 2:
        return (
          <DetailsStep
            formData={formData}
            errors={errors}
            onChange={onFormDataChange}
          />
        );
      case 3:
        return (
          <PricingStep
            formData={formData}
            errors={errors}
            onChange={onFormDataChange}
          />
        );
      case 4:
        return (
          <MediaStep
            formData={formData}
            errors={errors}
            onChange={onFormDataChange}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            errors={errors}
            onChange={onFormDataChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Step Content */}
      <div className="mb-8">
        {renderStep()}
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
            >
              Previous
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep} of 5
        </div>

        <div>
          {currentStep < 5 ? (
            <Button
              onClick={onNext}
              rightIcon={<ChevronRightIcon className="h-4 w-4" />}
              disabled={isSubmitting}
            >
              Next
            </Button>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Use the buttons above to save or publish
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFormWizard;