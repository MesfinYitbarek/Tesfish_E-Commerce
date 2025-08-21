import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const ProductDescription = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const description = product.description || '';
  const isLongDescription = description.length > 500;
  const displayDescription = showFullDescription || !isLongDescription 
    ? description 
    : description.substring(0, 500) + '...';

  const features = product.type === 'real-estate' 
    ? product.realEstateDetails?.features || []
    : product.serviceDetails?.features || [];

  const amenities = product.realEstateDetails?.amenities || [];
  const specifications = getSpecifications(product);

  return (
    <div className="space-y-6">
      {/* Main Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Description
        </h3>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {displayDescription}
          </p>
          
          {isLongDescription && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center"
            >
              {showFullDescription ? (
                <>
                  Show less
                  <ChevronUpIcon className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Read more
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {product.type === 'real-estate' ? 'Property Features' : 'Service Features'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amenities (Real Estate) */}
      {product.type === 'real-estate' && amenities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Amenities
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specifications */}
      {specifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Specifications
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {spec.label}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Information */}
      {product.additionalInfo && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Additional Information
          </h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300">
              {product.additionalInfo}
            </p>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      {(product.terms || product.type === 'service') && (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Terms & Conditions
            </h3>
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              {product.terms ? (
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                  {product.terms}
                </p>
              ) : (
                <div className="text-gray-700 dark:text-gray-300 text-sm space-y-2">
                  <p>• All prices are subject to change without notice</p>
                  <p>• Payment terms to be discussed with seller</p>
                  <p>• Inspection recommended before purchase</p>
                  {product.type === 'service' && (
                    <>
                      <p>• Service availability subject to schedule</p>
                      <p>• Cancellation policy applies</p>
                      <p>• Additional charges may apply for extra services</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get specifications
function getSpecifications(product) {
  const specs = [];

  if (product.type === 'real-estate' && product.realEstateDetails) {
    const details = product.realEstateDetails;
    
    if (details.yearBuilt) specs.push({ label: 'Year Built', value: details.yearBuilt });
    if (details.floorNumber) specs.push({ label: 'Floor', value: details.floorNumber });
    if (details.totalFloors) specs.push({ label: 'Total Floors', value: details.totalFloors });
    if (details.furnishingStatus) specs.push({ label: 'Furnishing', value: details.furnishingStatus });
    if (details.facing) specs.push({ label: 'Facing', value: details.facing });
    if (details.constructionStatus) specs.push({ label: 'Construction Status', value: details.constructionStatus });
  }

  if (product.type === 'service' && product.serviceDetails) {
    const details = product.serviceDetails;
    
    if (details.experienceLevel) specs.push({ label: 'Experience Level', value: details.experienceLevel });
    if (details.teamSize) specs.push({ label: 'Team Size', value: details.teamSize });
    if (details.languages) specs.push({ label: 'Languages', value: details.languages.join(', ') });
    if (details.certifications && details.certifications.length > 0) {
      specs.push({ label: 'Certifications', value: details.certifications.join(', ') });
    }
  }

  // General product specs
  if (product.brand) specs.push({ label: 'Brand', value: product.brand });
  if (product.model) specs.push({ label: 'Model', value: product.model });
  if (product.warranty) specs.push({ label: 'Warranty', value: product.warranty });

  return specs;
}

export default ProductDescription;