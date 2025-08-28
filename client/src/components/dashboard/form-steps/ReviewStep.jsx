import { useState } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PencilIcon,
  EyeIcon,
  PhotoIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Button from '../../ui/Button';
import { formatCurrency } from '../../../utils/helpers';

const ReviewStep = ({ 
  formData, 
  errors, 
  onEdit, 
  onSubmit, 
  isSubmitting = false,
  productTypeConfig 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [submitType, setSubmitType] = useState('draft'); // 'draft', 'published'

  const isRealEstate = ['homes', 'plots', 'commercials'].includes(formData.productType);
  const isRental = formData.listingType === 'rent';

  // Validation summary
  const getValidationSummary = () => {
    const issues = [];
    const warnings = [];

    // Required fields check
    if (!formData.title) issues.push('Title is required');
    if (!formData.description) issues.push('Description is required');
    if (!formData.productType) issues.push('Product type is required');
    if (!formData.subProductType) issues.push('Specific type is required');
    
    // Real estate specific
    if (isRealEstate) {
      if (!formData.listingType) issues.push('Listing type (sale/rent) is required');
      if (!formData.propertyDetails?.area?.value) issues.push('Property area is required');
      if (!formData.propertyDetails?.location?.address) issues.push('Property address is required');
      if (!formData.propertyDetails?.location?.city) issues.push('City is required');
    }

    // Pricing checks
    if (!formData.pricing?.basePrice && !formData.pricing?.rentPrice?.monthly) {
      issues.push('Price is required');
    }

    // Contact info
    if (!formData.contactInfo?.phone) issues.push('Phone number is required');

    // Media checks
    if (!formData.media?.images?.length) issues.push('At least one image is required');

    // Warnings
    if (!formData.shortDescription) warnings.push('Short description improves search visibility');
    if (!formData.contactInfo?.email) warnings.push('Email address helps with inquiries');
    if (formData.media?.images?.length < 3) warnings.push('More images increase viewer interest');
    if (isRealEstate && formData.propertyDetails?.features?.length < 3) {
      warnings.push('Adding more features helps attract buyers');
    }

    return { issues, warnings };
  };

  const { issues, warnings } = getValidationSummary();
  const canSubmit = issues.length === 0;

  // Section completion status
  const getSectionStatus = (section) => {
    switch (section) {
      case 'basic':
        return formData.title && formData.description && formData.productType && formData.subProductType;
      case 'details':
        if (isRealEstate) {
          return formData.propertyDetails?.area?.value && formData.propertyDetails?.location?.address;
        }
        return true; // Details optional for products
      case 'pricing':
        return formData.pricing?.basePrice || formData.pricing?.rentPrice?.monthly;
      case 'location':
        if (isRealEstate) {
          return formData.propertyDetails?.location?.city && formData.contactInfo?.phone;
        }
        return formData.contactInfo?.phone;
      case 'media':
        return formData.media?.images?.length > 0;
      default:
        return false;
    }
  };

  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: InformationCircleIcon,
      completed: getSectionStatus('basic')
    },
    {
      id: 'details',
      title: isRealEstate ? 'Property Details' : 'Product Details',
      icon: ClockIcon,
      completed: getSectionStatus('details')
    },
    {
      id: 'pricing',
      title: 'Pricing',
      icon: CurrencyDollarIcon,
      completed: getSectionStatus('pricing')
    },
    {
      id: 'location',
      title: isRealEstate ? 'Location & Contact' : 'Contact Information',
      icon: MapPinIcon,
      completed: getSectionStatus('location')
    },
    {
      id: 'media',
      title: 'Media & Documents',
      icon: PhotoIcon,
      completed: getSectionStatus('media')
    }
  ];

  const handleSubmit = (type) => {
    setSubmitType(type);
    onSubmit({
      ...formData,
      status: type === 'published' ? 'active' : 'draft',
      submittedAt: new Date().toISOString()
    });
  };

  // Generate listing preview
  const generatePreview = () => {
    const mainImage = formData.media?.images?.find(img => img.isMain) || formData.media?.images?.[0];
    const price = isRental 
      ? formData.pricing?.rentPrice?.monthly 
      : (formData.pricing?.salePrice || formData.pricing?.basePrice);

    return {
      title: formData.title,
      price: price ? formatCurrency(price, formData.pricing?.currency || 'ETB') : 'Price on request',
      priceLabel: isRental ? '/month' : '',
      location: isRealEstate 
        ? `${formData.propertyDetails?.location?.address || ''}, ${formData.propertyDetails?.location?.city || ''}`.trim().replace(/^,/, '')
        : formData.propertyDetails?.location?.city || 'Location not specified',
      image: mainImage?.url,
      features: isRealEstate ? [
        formData.propertyDetails?.area?.value && `${formData.propertyDetails.area.value} ${formData.propertyDetails.area.unit}`,
        formData.propertyDetails?.bedrooms && `${formData.propertyDetails.bedrooms} bedrooms`,
        formData.propertyDetails?.bathrooms && `${formData.propertyDetails.bathrooms} bathrooms`,
        formData.propertyDetails?.parkingSpaces && `${formData.propertyDetails.parkingSpaces} parking`
      ].filter(Boolean) : [
        formData.brand,
        formData.model,
        formData.condition
      ].filter(Boolean),
      description: formData.shortDescription || formData.description?.substring(0, 150) + '...'
    };
  };

  const preview = generatePreview();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your listing details and submit for approval.
        </p>
      </div>

      {/* Validation Summary */}
      <div className="space-y-4">
        {issues.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                  Please fix these issues before submitting:
                </h4>
                <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                  {issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  Recommendations to improve your listing:
                </h4>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {canSubmit && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-sm text-green-800 dark:text-green-200">
                Your listing is ready to submit!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section Status */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Completion Status
        </h3>
        <div className="space-y-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    section.completed 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {section.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {section.completed ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(section.id)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Listing Preview */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Listing Preview
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Full Preview
          </Button>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="flex">
            {/* Image */}
            <div className="w-48 h-32 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {preview.image ? (
                <img
                  src={preview.image}
                  alt={preview.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {preview.title || 'Untitled Listing'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {preview.location}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {preview.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {preview.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    {preview.price}
                    {preview.priceLabel && (
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {preview.priceLabel}
                      </span>
                    )}
                  </div>
                  {formData.pricing?.isNegotiable && (
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Negotiable
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listing Details Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Basic Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {productTypeConfig?.subTypes?.find(st => st.value === formData.subProductType)?.label || formData.subProductType}
              </span>
            </div>
            {isRealEstate && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Listing:</span>
                <span className="text-gray-900 dark:text-gray-100 capitalize">{formData.listingType}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Seller:</span>
              <span className="text-gray-900 dark:text-gray-100 capitalize">{formData.sellerType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="text-gray-900 dark:text-gray-100">{formData.status || 'Draft'}</span>
            </div>
          </div>
        </div>

        {/* Media Summary */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Media Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Images:</span>
              <span className="text-gray-900 dark:text-gray-100">{formData.media?.images?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Videos:</span>
              <span className="text-gray-900 dark:text-gray-100">{formData.media?.videos?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Documents:</span>
              <span className="text-gray-900 dark:text-gray-100">{formData.media?.documents?.length || 0}</span>
            </div>
            {isRealEstate && formData.media?.virtualTour && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Virtual Tour:</span>
                <span className="text-green-600 dark:text-green-400">Yes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Submit Your Listing
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Save as Draft</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Save your progress and continue editing later. Not visible to public.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting && submitType === 'draft' ? 'Saving...' : 'Save as Draft'}
              </Button>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Publish Listing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Submit for review and make visible to potential buyers once approved.
              </p>
              <Button
                type="button"
                onClick={() => handleSubmit('published')}
                disabled={!canSubmit || isSubmitting}
                className="w-full"
              >
                {isSubmitting && submitType === 'published' ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By submitting, you agree to our{' '}
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                Listing Guidelines
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Listing Preview
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </Button>
              </div>

              {/* Full listing preview would go here */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Gallery */}
                  <div>
                    <div className="aspect-w-16 aspect-h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                      {preview.image ? (
                        <img
                          src={preview.image}
                          alt={preview.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-64">
                          <PhotoIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {formData.media?.images?.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {formData.media.images.slice(0, 4).map((image, index) => (
                          <div key={image.id} className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                              src={image.url}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {preview.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {preview.location}
                    </p>
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                      {preview.price}{preview.priceLabel}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {preview.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {formData.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;