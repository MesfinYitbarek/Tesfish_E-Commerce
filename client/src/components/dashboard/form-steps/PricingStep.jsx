import { useState } from 'react';
import Input from '../../ui/Input';
import { formatCurrency } from '../../../utils/helpers';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const PricingStep = ({ formData, errors, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Ensure pricing object exists with all properties
  const safePricing = {
    basePrice: '',
    priceType: 'sale',
    currency: 'ETB',
    negotiable: false,
    discountPercentage: 0,
    originalPrice: '',
    minimumCharge: '',
    travelFee: '',
    rushFee: '',
    cancellationFee: '',
    paymentMethods: [],
    depositPercentage: '',
    paymentTerms: '',
    ...formData.pricing
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onChange({
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      onChange({ [field]: value });
    }
  };

  const calculateDiscountedPrice = () => {
    const basePrice = parseFloat(safePricing.basePrice) || 0;
    const discount = parseFloat(safePricing.discountPercentage) || 0;
    return basePrice - (basePrice * discount / 100);
  };

  const priceTypeOptions = {
    'real-estate': [
      { value: 'sale', label: 'Total Price' },
      { value: 'monthly', label: 'Per Month' },
      { value: 'yearly', label: 'Per Year' },
      { value: 'sqm', label: 'Per Square Meter' }
    ],
    'service': [
      { value: 'hour', label: 'Per Hour' },
      { value: 'day', label: 'Per Day' },
      { value: 'week', label: 'Per Week' },
      { value: 'month', label: 'Per Month' },
      { value: 'project', label: 'Per Project' },
      { value: 'consultation', label: 'Per Consultation' }
    ]
  };

  const currentPriceTypes = priceTypeOptions[formData.type] || priceTypeOptions['real-estate'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Pricing Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your price and payment terms for this {formData.type === 'real-estate' ? 'property' : 'service'}.
        </p>
      </div>

      {/* Price and Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Price *"
            type="number"
            min="0"
            step="1"
            value={safePricing.basePrice}
            onChange={(e) => handleChange('pricing.basePrice', e.target.value)}
            error={errors['pricing.basePrice']}
            placeholder="0"
            helper="Enter the price in Ethiopian Birr (ETB)"
            leftAddon="ETB"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price Type
          </label>
          <select
            value={safePricing.priceType}
            onChange={(e) => handleChange('pricing.priceType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {currentPriceTypes.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Preview */}
      {safePricing.basePrice && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 dark:text-primary-300">Price Preview</p>
              <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                {formatCurrency(
                  safePricing.discountPercentage > 0 
                    ? calculateDiscountedPrice() 
                    : safePricing.basePrice, 
                  'ETB'
                )}
                {safePricing.priceType !== 'sale' && safePricing.priceType !== 'project' && (
                  <span className="text-sm font-normal text-primary-600 dark:text-primary-400">
                    /{safePricing.priceType}
                  </span>
                )}
              </p>
              {safePricing.discountPercentage > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  Original: {formatCurrency(safePricing.basePrice, 'ETB')}
                </p>
              )}
            </div>
            {safePricing.negotiable && (
              <div className="text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                Negotiable
              </div>
            )}
          </div>
        </div>
      )}

      {/* Negotiable */}
      <div className="flex items-start">
        <input
          type="checkbox"
          id="negotiable"
          checked={safePricing.negotiable}
          onChange={(e) => handleChange('pricing.negotiable', e.target.checked)}
          className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <div className="ml-3">
          <label htmlFor="negotiable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Price is negotiable
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Allow customers to negotiate the price with you
          </p>
        </div>
      </div>

      {/* Advanced Pricing Options */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-600"
        >
          <span>Advanced Pricing Options</span>
          <svg className={`w-4 h-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-6">
            {/* Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Discount Percentage"
                  type="number"
                  min="0"
                  max="99"
                  step="1"
                  value={safePricing.discountPercentage}
                  onChange={(e) => handleChange('pricing.discountPercentage', e.target.value)}
                  placeholder="0"
                  rightAddon="%"
                  helper="Offer a discount to attract more customers"
                />
              </div>

              {safePricing.discountPercentage > 0 && (
                <div>
                  <Input
                    label="Original Price (Optional)"
                    type="number"
                    min="0"
                    step="1"
                    value={safePricing.originalPrice}
                    onChange={(e) => handleChange('pricing.originalPrice', e.target.value)}
                    placeholder="Auto-calculated"
                    leftAddon="ETB"
                    helper="Leave empty to auto-calculate from base price"
                  />
                </div>
              )}
            </div>

            {/* Service-specific pricing */}
            {formData.type === 'service' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Service Pricing Options
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Minimum Charge"
                    type="number"
                    min="0"
                    value={safePricing.minimumCharge}
                    onChange={(e) => handleChange('pricing.minimumCharge', e.target.value)}
                    placeholder="0"
                    leftAddon="ETB"
                    helper="Minimum amount you charge regardless of time"
                  />

                  <Input
                    label="Travel Fee"
                    type="number"
                    min="0"
                    value={safePricing.travelFee}
                    onChange={(e) => handleChange('pricing.travelFee', e.target.value)}
                    placeholder="0"
                    leftAddon="ETB"
                    helper="Additional fee for travel/transportation"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Rush Fee (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={safePricing.rushFee}
                    onChange={(e) => handleChange('pricing.rushFee', e.target.value)}
                    placeholder="0"
                    rightAddon="%"
                    helper="Extra charge for urgent/rush jobs"
                  />

                  <Input
                    label="Cancellation Fee"
                    type="number"
                    min="0"
                    value={safePricing.cancellationFee}
                    onChange={(e) => handleChange('pricing.cancellationFee', e.target.value)}
                    placeholder="0"
                    leftAddon="ETB"
                    helper="Fee charged for last-minute cancellations"
                  />
                </div>
              </div>
            )}

            {/* Payment Terms */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Terms
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Methods Accepted
                  </label>
                  <div className="space-y-2">
                    {['Cash', 'Bank Transfer', 'Mobile Money', 'Check', 'Credit Card'].map(method => (
                      <div key={method} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`payment-${method}`}
                          checked={(safePricing.paymentMethods || []).includes(method)}
                          onChange={(e) => {
                            const currentMethods = safePricing.paymentMethods || [];
                            const newMethods = e.target.checked
                              ? [...currentMethods, method]
                              : currentMethods.filter(m => m !== method);
                            handleChange('pricing.paymentMethods', newMethods);
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`payment-${method}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {method}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Input
                    label="Deposit Required (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={safePricing.depositPercentage}
                    onChange={(e) => handleChange('pricing.depositPercentage', e.target.value)}
                    placeholder="0"
                    rightAddon="%"
                    helper="Percentage of total price required as deposit"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Terms Description
                </label>
                <textarea
                  value={safePricing.paymentTerms || ''}
                  onChange={(e) => handleChange('pricing.paymentTerms', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 50% deposit required, balance due on completion. Payment due within 30 days."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Pricing Tips
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Research similar {formData.type === 'real-estate' ? 'properties' : 'services'} in your area to set competitive prices</li>
              <li>• Consider offering package deals or discounts for longer commitments</li>
              <li>• Be transparent about any additional fees or charges</li>
              <li>• Price negotiability can attract more inquiries but may result in lower final prices</li>
              {formData.type === 'service' && (
                <li>• Consider different pricing models (hourly vs. project-based) based on your service type</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Price Comparison */}
      {safePricing.basePrice && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Price Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Your Price</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(safePricing.basePrice, 'ETB')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Market Average*</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(safePricing.basePrice * 1.1, 'ETB')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Competitiveness</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                Competitive
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            * Estimated based on similar listings
          </p>
        </div>
      )}
    </div>
  );
};

export default PricingStep;