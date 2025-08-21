import { useState } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PencilIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../../utils/helpers';
import Input from '../../ui/Input';

const ReviewStep = ({ formData, errors, onChange }) => {
  const [showTerms, setShowTerms] = useState(false);

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const getCompletionStatus = () => {
    const checks = [
      { label: 'Basic Information', completed: formData.title && formData.description && formData.category },
      { label: 'Details', completed: formData.type === 'real-estate' 
        ? formData.realEstateDetails?.propertyType && formData.realEstateDetails?.location?.address
        : formData.serviceDetails?.serviceType && formData.serviceDetails?.serviceArea },
      { label: 'Pricing', completed: formData.pricing?.basePrice > 0 },
      { label: 'Media', completed: formData.media?.images && formData.media.images.length > 0 }
    ];

    const completedCount = checks.filter(check => check.completed).length;
    const percentage = (completedCount / checks.length) * 100;

    return { checks, completedCount, percentage };
  };

  const { checks, completedCount, percentage } = getCompletionStatus();

  const getListingType = () => {
    return formData.type === 'real-estate' ? 'Property' : 'Service';
  };

  // Helper function to format area display
  const formatArea = (area) => {
    if (!area) return '';
    if (typeof area === 'object') {
      return `${area.value} ${area.unit}`;
    }
    return area;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Review & Publish
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your listing details before publishing. You can always edit it later.
        </p>
      </div>

      {/* Completion Status */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Listing Completion
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            percentage === 100 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
          }`}>
            {percentage.toFixed(0)}% Complete
          </span>
        </div>

        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                check.completed 
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {check.completed && <CheckCircleIcon className="h-3 w-3" />}
              </div>
              <span className={`text-sm ${
                check.completed 
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {check.label}
              </span>
            </div>
          ))}
        </div>

        {percentage < 100 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Complete all sections to maximize your listing's visibility and effectiveness.
            </p>
          </div>
        )}
      </div>

      {/* Listing Preview */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <EyeIcon className="h-5 w-5 mr-2" />
            Preview
          </h3>
        </div>

        <div className="p-6">
          {/* Preview Card */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Image */}
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
              {formData.media?.images && formData.media.images.length > 0 ? (
                <img
                  src={formData.media.images[0].url}
                  alt={formData.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-48">
                  <p className="text-gray-500 dark:text-gray-400">No image available</p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                  {formData.title || 'Untitled Listing'}
                </h4>
                {formData.featured && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {formData.description || 'No description provided'}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary-500">
                    {formData.pricing?.basePrice 
                      ? formatCurrency(formData.pricing.basePrice, 'ETB')
                      : 'Price not set'
                    }
                  </span>
                  {formData.pricing?.priceType && formData.pricing.priceType !== 'sale' && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      /{formData.pricing.priceType}
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {getListingType()}
                </div>
              </div>

              {/* Quick Stats */}
              {formData.type === 'real-estate' && formData.realEstateDetails && (
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {formData.realEstateDetails.bedrooms && (
                    <span>{formData.realEstateDetails.bedrooms} bed</span>
                  )}
                  {formData.realEstateDetails.bathrooms && (
                    <span>{formData.realEstateDetails.bathrooms} bath</span>
                  )}
                  {formData.realEstateDetails.area && (
                    <span>{formatArea(formData.realEstateDetails.area)}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
            Basic Information
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span className="text-gray-900 dark:text-gray-100 capitalize">
                {formData.type?.replace('-', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Category:</span>
              <span className="text-gray-900 dark:text-gray-100 capitalize">
                {formData.category?.replace('-', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Condition:</span>
              <span className="text-gray-900 dark:text-gray-100 capitalize">
                {formData.condition}
              </span>
            </div>
          </div>
        </div>

        {/* Media Summary */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
            Media Files
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Photos:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {formData.media?.images?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Videos:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {formData.media?.videos?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Documents:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {formData.media?.documents?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-6">
        {/* Publishing Options */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
            Publishing Options
          </h4>
          
          <div className="space-y-4">
            {/* Featured Listing */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3">
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Make this a featured listing
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Featured listings get more visibility and appear at the top of search results (additional fee may apply)
                </p>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Urgency Level
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => handleChange('urgency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent (quick sale/booking needed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
              Terms & Conditions
            </h4>
            <button
              type="button"
              onClick={() => setShowTerms(!showTerms)}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              {showTerms ? 'Hide' : 'Add Custom Terms'}
            </button>
          </div>

          {showTerms && (
            <div>
              <textarea
                value={formData.terms || ''}
                onChange={(e) => handleChange('terms', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add any specific terms, conditions, or requirements for this listing..."
              />
            </div>
          )}

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By publishing this listing, you agree to CitiLights' 
              <a href="#" className="text-primary-500 hover:text-primary-600 ml-1">Terms of Service</a> and 
              <a href="#" className="text-primary-500 hover:text-primary-600 ml-1">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
            Additional Information
          </h4>
          <textarea
            value={formData.additionalInfo || ''}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Any additional information you'd like to share with potential customers..."
          />
        </div>
      </div>

      {/* Final Checklist */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start">
          <DocumentTextIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Pre-Publishing Checklist
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• All information is accurate and up-to-date</li>
              <li>• Photos are high-quality and properly represent the {getListingType().toLowerCase()}</li>
              <li>• Price is competitive and clearly stated</li>
              <li>• Contact information is correct</li>
              <li>• You have the right to list this {getListingType().toLowerCase()}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;