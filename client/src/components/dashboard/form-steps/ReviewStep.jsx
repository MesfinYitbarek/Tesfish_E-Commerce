import { 
  HomeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PhoneIcon,
  ClockIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../../utils/helpers';

const ReviewStep = ({ formData, errors, productTypeConfig, onChange, isEditing = false }) => {
  const isRealEstate = ['homes', 'plots', 'commercials'].includes(formData.productType);
  const isRental = formData.listingType === 'rent';
  const currentConfig = productTypeConfig[formData.productType];

  // Helper function to get display value
  const getDisplayValue = (value, fallback = 'Not specified') => {
    if (value === null || value === undefined || value === '') return fallback;
    return value;
  };

  // Helper function to format array values
  const formatArray = (arr, fallback = 'None') => {
    if (!arr || arr.length === 0) return fallback;
    return arr.join(', ');
  };

  // Helper function to format boolean utilities
  const formatUtilities = (utilities) => {
    if (!utilities) return 'Not specified';
    const available = Object.entries(utilities)
      .filter(([key, value]) => value)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    return available.length > 0 ? available.join(', ') : 'None specified';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Review Your Listing
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please review all information before publishing your {isRealEstate ? 'property' : 'product'} listing.
        </p>
      </div>

      {/* Listing Overview */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <TagIcon className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                {currentConfig?.label} - {currentConfig?.subTypes.find(st => st.value === formData.subProductType)?.label}
                {formData.listingType && ` (${formData.listingType === 'sell' ? 'For Sale' : 'For Rent'})`}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {formData.title || 'Untitled Listing'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
              {formData.shortDescription || formData.description?.substring(0, 150) + '...'}
            </p>
          </div>
          <div className="text-right ml-6">
            {isRental && formData.pricing?.rentPrice?.monthly ? (
              <div>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(formData.pricing.rentPrice.monthly, 'ETB')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">per month</p>
              </div>
            ) : formData.pricing?.basePrice ? (
              <div>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(formData.pricing.salePrice || formData.pricing.basePrice, 'ETB')}
                </p>
                {formData.pricing.salePrice && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatCurrency(formData.pricing.basePrice, 'ETB')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-lg text-gray-500 dark:text-gray-400">Price not set</p>
            )}
            {formData.pricing?.isNegotiable && (
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                Negotiable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Property/Product Details */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <HomeIcon className="h-5 w-5 mr-2 text-primary-500" />
          {isRealEstate ? 'Property Details' : 'Product Details'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Real Estate Details */}
          {isRealEstate && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Area</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {formData.propertyDetails?.area?.value ? 
                    `${formData.propertyDetails.area.value} ${formData.propertyDetails.area.unit}` : 
                    'Not specified'
                  }
                </p>
              </div>
              
              {formData.productType !== 'plots' && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formData.subProductType === 'offices' ? 'Rooms' : 'Bedrooms'}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {getDisplayValue(formData.propertyDetails?.bedrooms)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bathrooms</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {getDisplayValue(formData.propertyDetails?.bathrooms)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Parking</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {getDisplayValue(formData.propertyDetails?.parkingSpaces, '0')} spaces
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Floors</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {getDisplayValue(formData.propertyDetails?.floors)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Year Built</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {getDisplayValue(formData.propertyDetails?.yearBuilt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Furnishing</p>
                    <p className="text-gray-900 dark:text-gray-100 capitalize">
                      {getDisplayValue(formData.propertyDetails?.furnishingStatus)?.replace('-', ' ')}
                    </p>
                  </div>
                </>
              )}

              {/* Land Details for plots */}
              {formData.productType === 'plots' && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Land Use</p>
                    <p className="text-gray-900 dark:text-gray-100 capitalize">
                      {getDisplayValue(formData.propertyDetails?.landDetails?.landUse)?.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Topography</p>
                    <p className="text-gray-900 dark:text-gray-100 capitalize">
                      {getDisplayValue(formData.propertyDetails?.landDetails?.topography)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Access Road</p>
                    <p className="text-gray-900 dark:text-gray-100 capitalize">
                      {getDisplayValue(formData.propertyDetails?.landDetails?.accessRoad)?.replace('-', ' ')}
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          {/* Vehicle Details */}
          {formData.productType === 'others' && formData.subProductType === 'vehicles' && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Make</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {getDisplayValue(formData.vehicleDetails?.make)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Model</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {getDisplayValue(formData.vehicleDetails?.model)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Year</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {getDisplayValue(formData.vehicleDetails?.year)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Mileage</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {formData.vehicleDetails?.mileage ? `${formData.vehicleDetails.mileage} km` : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fuel Type</p>
                <p className="text-gray-900 dark:text-gray-100 capitalize">
                  {getDisplayValue(formData.vehicleDetails?.fuelType)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Transmission</p>
                <p className="text-gray-900 dark:text-gray-100 capitalize">
                  {getDisplayValue(formData.vehicleDetails?.transmission)}
                </p>
              </div>
            </>
          )}

          {/* General Product Details */}
          {formData.productType === 'others' && formData.subProductType !== 'vehicles' && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {getDisplayValue(formData.brand)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Model</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {getDisplayValue(formData.model)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Condition</p>
                <p className="text-gray-900 dark:text-gray-100 capitalize">
                  {getDisplayValue(formData.condition)?.replace('-', ' ')}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Features and Amenities for Real Estate */}
        {isRealEstate && formData.productType !== 'plots' && (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {formatArray(formData.propertyDetails?.features)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {formatArray(formData.propertyDetails?.amenities)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Utilities</p>
              <p className="text-gray-900 dark:text-gray-100">
                {formatUtilities(formData.propertyDetails?.utilities)}
              </p>
            </div>
          </div>
        )}

        {/* Specifications for Others */}
        {formData.productType === 'others' && formData.specifications?.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specifications</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{spec.name}:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Location & Contact (for real estate) */}
      {isRealEstate && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-primary-500" />
            Location
          </h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</p>
              <p className="text-gray-900 dark:text-gray-100">
                {getDisplayValue(formData.propertyDetails?.location?.address)}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">City</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {getDisplayValue(formData.propertyDetails?.location?.city)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Region</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {getDisplayValue(formData.propertyDetails?.location?.region)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {getDisplayValue(formData.propertyDetails?.location?.country)}
                </p>
              </div>
            </div>
            
            {formData.propertyDetails?.location?.landmarks?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Landmarks</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {formatArray(formData.propertyDetails.location.landmarks)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Details */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <CurrencyDollarIcon className="h-5 w-5 mr-2 text-primary-500" />
          Pricing
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isRental ? (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Rent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formData.pricing?.rentPrice?.monthly ? 
                    formatCurrency(formData.pricing.rentPrice.monthly, 'ETB') : 
                    'Not set'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Security Deposit</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formData.pricing?.rentPrice?.deposit ? 
                    formatCurrency(formData.pricing.rentPrice.deposit, 'ETB') : 
                    'Not specified'
                  }
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formData.pricing?.basePrice ? 
                    formatCurrency(formData.pricing.basePrice, 'ETB') : 
                    'Not set'
                  }
                </p>
              </div>
              {formData.pricing?.salePrice && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sale Price</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(formData.pricing.salePrice, 'ETB')}
                  </p>
                </div>
              )}
            </>
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Price Type</p>
            <p className="text-gray-900 dark:text-gray-100 capitalize">
              {getDisplayValue(formData.pricing?.priceType)?.replace('-', ' ')}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Negotiable</p>
            <p className="text-gray-900 dark:text-gray-100">
              {formData.pricing?.isNegotiable ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <PhoneIcon className="h-5 w-5 mr-2 text-primary-500" />
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
            <p className="text-gray-900 dark:text-gray-100">
              {getDisplayValue(formData.contactInfo?.phone)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
            <p className="text-gray-900 dark:text-gray-100">
              {getDisplayValue(formData.contactInfo?.email)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp</p>
            <p className="text-gray-900 dark:text-gray-100">
              {getDisplayValue(formData.contactInfo?.whatsapp, 'Not provided')}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Contact</p>
            <p className="text-gray-900 dark:text-gray-100 capitalize">
              {getDisplayValue(formData.contactInfo?.preferredContactMethod)}
            </p>
          </div>
        </div>

        {/* Viewing Details for Real Estate */}
        {isRealEstate && formData.viewingDetails?.allowViewings && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Viewing Schedule
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Days</p>
                <p className="text-gray-900 dark:text-gray-100 capitalize">
                  {formatArray(formData.viewingDetails.viewingDays, 'Not specified')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Viewing Hours</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {formData.viewingDetails.viewingHours ? 
                    `${formData.viewingDetails.viewingHours.start} - ${formData.viewingDetails.viewingHours.end}` : 
                    'Not specified'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Summary */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <PhotoIcon className="h-5 w-5 mr-2 text-primary-500" />
          Media & Documentation
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <PhotoIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formData.media?.images?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Images</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <TruckIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formData.media?.videos?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <DocumentCheckIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formData.media?.documents?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Documents</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <ShieldCheckIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formData.media?.virtualTour ? '✓' : '✗'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Virtual Tour</p>
          </div>
        </div>

        {formData.media?.images?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview</p>
            <div className="flex space-x-2 overflow-x-auto">
              {formData.media.images.slice(0, 5).map((image, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  {image.isPrimary && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {formData.media.images.length > 5 && (
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    +{formData.media.images.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      {(formData.tags?.length > 0 || formData.notes) && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Additional Information
          </h3>
          
          {formData.tags?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.notes && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Internal Notes</p>
              <p className="text-gray-900 dark:text-gray-100 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {formData.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Final Check */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          Final Check
        </h3>
        <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
          <div className="flex items-center">
            <input type="checkbox" className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500 mr-2" />
            <span>All information provided is accurate and up-to-date</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500 mr-2" />
            <span>Images and media represent the {isRealEstate ? 'property' : 'product'} correctly</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500 mr-2" />
            <span>Contact information is correct and accessible</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500 mr-2" />
            <span>I agree to the terms and conditions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;