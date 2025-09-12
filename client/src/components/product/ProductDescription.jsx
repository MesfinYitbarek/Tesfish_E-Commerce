// components/product/ProductDescription.jsx
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// Updated Product Description Component
const ProductDescription = ({ product }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullShortDescription, setShowFullShortDescription] = useState(false);

  const description = product.description || '';
  const shortDescription = product.shortDescription || '';
  const isLongDescription = description.length > 500;
  const isLongShortDescription = shortDescription.length > 150;

  const displayDescription = showFullDescription || !isLongDescription
    ? description
    : description.substring(0, 500) + '...';

  const displayShortDescription = showFullShortDescription || !isLongShortDescription
    ? shortDescription
    : shortDescription.substring(0, 150) + '...';

  const hasTags = product.tags && product.tags.length > 0;
  const hasPaymentMethods = product.paymentMethods && product.paymentMethods.length > 0;
  const hasInstallments = product.installmentOptions && product.installmentOptions.length > 0;
  const hasWarranty = product.warranty?.duration;
  const hasReturnPolicy = product.returnPolicy?.returnable;
  const hasShipping = product.shipping && (product.shipping.freeShipping || product.shipping.shippingCost || product.shipping.weight || product.shipping.shippingClass);
  const hasNotes = product.notes;

  return (
    <div className="space-y-6">
      {/* Short Description */}
      {shortDescription && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Summary
          </h3>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {displayShortDescription}
            </p>

            {isLongShortDescription && (
              <button
                onClick={() => setShowFullShortDescription(!showFullShortDescription)}
                className="mt-2 text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center"
              >
                {showFullShortDescription ? (
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
      )}

      {/* Main Description */}
      {description && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {shortDescription ? 'Detailed Description' : 'Description'}
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
      )}

      {/* Tags */}
      {hasTags && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Payment Methods */}
      {hasPaymentMethods && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Accepted Payment Methods
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.paymentMethods.map((method, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Installment Options */}
      {hasInstallments && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Installment Plans Available
          </h3>
          <div className="space-y-3">
            {product.installmentOptions.map((option, index) => (
              <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      {option.months} months plan
                    </span>
                    {option.description && (
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {option.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-900 dark:text-blue-100">
                      {product.currency || 'ETB'} {option.monthlyAmount.toLocaleString()}/month
                    </div>
                    {option.downPayment > 0 && (
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        Down: {product.currency || 'ETB'} {option.downPayment.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warranty Information */}
      {hasWarranty && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Warranty Information
          </h3>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300 font-medium">Duration:</span>
                <span className="text-green-900 dark:text-green-100">
                  {product.warranty.duration} {product.warranty.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300 font-medium">Type:</span>
                <span className="text-green-900 dark:text-green-100 capitalize">
                  {product.warranty.type}
                </span>
              </div>
              {product.warranty.description && (
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    {product.warranty.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Return Policy */}
      {hasReturnPolicy && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Return Policy
          </h3>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-orange-700 dark:text-orange-300 font-medium">Returns Accepted:</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">Yes</span>
              </div>
              {product.returnPolicy.returnPeriod && (
                <div className="flex justify-between">
                  <span className="text-orange-700 dark:text-orange-300 font-medium">Return Period:</span>
                  <span className="text-orange-900 dark:text-orange-100">
                    {product.returnPolicy.returnPeriod} days
                  </span>
                </div>
              )}
              {product.returnPolicy.conditions && product.returnPolicy.conditions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800">
                  <p className="text-orange-700 dark:text-orange-300 font-medium mb-2">Conditions:</p>
                  <ul className="list-disc list-inside text-orange-800 dark:text-orange-200 text-sm space-y-1">
                    {product.returnPolicy.conditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shipping Information */}
      {hasShipping && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Shipping Information
          </h3>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="space-y-2">
              {product.shipping.freeShipping ? (
                <div className="flex justify-between">
                  <span className="text-purple-700 dark:text-purple-300 font-medium">Shipping:</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
                </div>
              ) : product.shipping.shippingCost && (
                <div className="flex justify-between">
                  <span className="text-purple-700 dark:text-purple-300 font-medium">Shipping Cost:</span>
                  <span className="text-purple-900 dark:text-purple-100">
                    {product.currency || 'ETB'} {parseFloat(product.shipping.shippingCost).toLocaleString()}
                  </span>
                </div>
              )}

              {product.shipping.weight && (
                <div className="flex justify-between">
                  <span className="text-purple-700 dark:text-purple-300 font-medium">Weight:</span>
                  <span className="text-purple-900 dark:text-purple-100">
                    {product.shipping.weight} kg
                  </span>
                </div>
              )}

              {product.shipping.shippingClass && (
                <div className="flex justify-between">
                  <span className="text-purple-700 dark:text-purple-300 font-medium">Shipping Class:</span>
                  <span className="text-purple-900 dark:text-purple-100">
                    {product.shipping.shippingClass}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {hasNotes && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Additional Notes
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {product.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;