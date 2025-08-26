import { useState } from 'react';
import Input from '../../ui/Input';
import { formatCurrency } from '../../../utils/helpers';
import { InformationCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const PricingStep = ({ formData, errors, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isRealEstate = ['homes', 'plots', 'commercials'].includes(formData.productType);
  const isRental = formData.listingType === 'rent';

  // Ensure pricing object exists with all properties
  const safePricing = {
    basePrice: '',
    salePrice: '',
    priceType: 'fixed',
    currency: 'ETB',
    isNegotiable: false,
    rentPrice: {
      monthly: '',
      yearly: '',
      deposit: ''
    },
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

  const handleRentPriceChange = (field, value) => {
    onChange({
      pricing: {
        ...formData.pricing,
        rentPrice: {
          ...formData.pricing.rentPrice,
          [field]: value
        }
      }
    });
  };

  const priceTypeOptions = {
    'homes': [
      { value: 'fixed', label: 'Total Price' },
      { value: 'per-unit', label: 'Per Square Meter' },
      { value: 'starting-from', label: 'Starting From' }
    ],
    'plots': [
      { value: 'fixed', label: 'Total Price' },
      { value: 'per-unit', label: 'Per Square Meter' },
      { value: 'starting-from', label: 'Starting From' }
    ],
    'commercials': [
      { value: 'fixed', label: 'Total Price' },
      { value: 'per-unit', label: 'Per Square Meter' },
      { value: 'per-month', label: 'Per Month' },
      { value: 'starting-from', label: 'Starting From' }
    ],
    'others': [
      { value: 'fixed', label: 'Fixed Price' },
      { value: 'starting-from', label: 'Starting From' },
      { value: 'per-unit', label: 'Per Unit' }
    ]
  };

  const currentPriceTypes = priceTypeOptions[formData.productType] || priceTypeOptions['others'];

  // Calculate yearly rent from monthly
  const calculateYearlyRent = (monthly) => {
    const monthlyAmount = parseFloat(monthly);
    return monthlyAmount ? (monthlyAmount * 12).toString() : '';
  };

  // Calculate monthly rent from yearly
  const calculateMonthlyRent = (yearly) => {
    const yearlyAmount = parseFloat(yearly);
    return yearlyAmount ? (yearlyAmount / 12).toString() : '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
          <CurrencyDollarIcon className="h-6 w-6 mr-2 text-primary-500" />
          Pricing Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your {isRental ? 'rental' : 'sale'} price and payment terms for this {isRealEstate ? 'property' : 'product'}.
        </p>
      </div>

      {/* Sale Price (for non-rental or both sale and rent) */}
      {!isRental && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {isRealEstate ? 'Sale Price' : 'Product Price'}
          </h3>
          
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
                className="text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Type
              </label>
              <select
                value={safePricing.priceType}
                onChange={(e) => handleChange('pricing.priceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
              >
                {currentPriceTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sale Price */}
          <div>
            <Input
              label="Discounted Price (Optional)"
              type="number"
              min="0"
              step="1"
              value={safePricing.salePrice}
              onChange={(e) => handleChange('pricing.salePrice', e.target.value)}
              error={errors['pricing.salePrice']}
              placeholder="0"
              helper="Set a discounted price if this item is on sale"
              leftAddon="ETB"
              className="text-base"
            />
          </div>
        </div>
      )}

      {/* Rental Price (for rental properties) */}
      {isRealEstate && isRental && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Rental Pricing
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Monthly Rent *"
              type="number"
              min="0"
              step="1"
              value={safePricing.rentPrice.monthly}
              onChange={(e) => {
                handleRentPriceChange('monthly', e.target.value);
                // Auto-calculate yearly rent
                if (e.target.value) {
                  handleRentPriceChange('yearly', calculateYearlyRent(e.target.value));
                }
              }}
              error={errors['pricing.rentPrice.monthly']}
              placeholder="5000"
              leftAddon="ETB"
              className="text-base"
            />

            <Input
              label="Yearly Rent"
              type="number"
              min="0"
              step="1"
              value={safePricing.rentPrice.yearly}
              onChange={(e) => {
                handleRentPriceChange('yearly', e.target.value);
                // Auto-calculate monthly rent
                if (e.target.value) {
                  handleRentPriceChange('monthly', calculateMonthlyRent(e.target.value));
                }
              }}
              placeholder="60000"
              leftAddon="ETB"
              helper="Automatically calculated from monthly rent"
              className="text-base"
            />
          </div>

          <div>
            <Input
              label="Security Deposit"
              type="number"
              min="0"
              step="1"
              value={safePricing.rentPrice.deposit}
              onChange={(e) => handleRentPriceChange('deposit', e.target.value)}
              placeholder="10000"
              leftAddon="ETB"
              helper="Refundable security deposit amount"
              className="text-base"
            />
          </div>

          {/* Also show base price for rental properties */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reference Sale Price (Optional)
            </h4>
            <Input
              label="Estimated Sale Value"
              type="number"
              min="0"
              step="1"
              value={safePricing.basePrice}
              onChange={(e) => handleChange('pricing.basePrice', e.target.value)}
              placeholder="500000"
              leftAddon="ETB"
              helper="Reference price for property value (not shown to renters)"
              className="text-base"
            />
          </div>
        </div>
      )}

      {/* Price Preview */}
      {(safePricing.basePrice || safePricing.rentPrice.monthly) && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-3">
            Price Preview
          </h4>
          
          {isRental && safePricing.rentPrice.monthly ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-primary-600 dark:text-primary-400">Monthly Rent:</span>
                <span className="text-xl font-bold text-primary-900 dark:text-primary-100">
                  {formatCurrency(safePricing.rentPrice.monthly, 'ETB')}/month
                </span>
              </div>
              {safePricing.rentPrice.yearly && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-primary-600 dark:text-primary-400">Yearly Rent:</span>
                  <span className="text-lg font-semibold text-primary-800 dark:text-primary-200">
                    {formatCurrency(safePricing.rentPrice.yearly, 'ETB')}/year
                  </span>
                </div>
              )}
              {safePricing.rentPrice.deposit && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-primary-600 dark:text-primary-400">Security Deposit:</span>
                  <span className="text-lg font-semibold text-primary-800 dark:text-primary-200">
                    {formatCurrency(safePricing.rentPrice.deposit, 'ETB')}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                  {formatCurrency(
                    safePricing.salePrice || safePricing.basePrice, 
                    'ETB'
                  )}
                  {safePricing.priceType !== 'fixed' && (
                    <span className="text-sm font-normal text-primary-600 dark:text-primary-400">
                      {safePricing.priceType === 'per-unit' && (isRealEstate ? ' /sqm' : ' /unit')}
                      {safePricing.priceType === 'per-month' && ' /month'}
                      {safePricing.priceType === 'starting-from' && ' (starting from)'}
                    </span>
                  )}
                </p>
                {safePricing.salePrice && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    Original: {formatCurrency(safePricing.basePrice, 'ETB')}
                  </p>
                )}
              </div>
              {safePricing.isNegotiable && (
                <div className="text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                  Negotiable
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Negotiable */}
      <div className="flex items-start">
        <input
          type="checkbox"
          id="negotiable"
          checked={safePricing.isNegotiable}
          onChange={(e) => handleChange('pricing.isNegotiable', e.target.checked)}
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

      {/* Advanced Options */}
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
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={safePricing.currency}
                onChange={(e) => handleChange('pricing.currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
              >
                <option value="ETB">Ethiopian Birr (ETB)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            {/* Registration Fee (for real estate) */}
            {isRealEstate && (
              <div>
                <Input
                  label="Registration Fee"
                  type="number"
                  min="0"
                  value={formData.propertyDetails?.registrationFee || ''}
                  onChange={(e) => onChange({
                    propertyDetails: {
                      ...formData.propertyDetails,
                      registrationFee: e.target.value
                    }
                  })}
                  placeholder="5000"
                  leftAddon="ETB"
                  helper="Property registration/transfer fee"
                  className="text-base"
                />
              </div>
            )}
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
              <li>• Research similar {isRealEstate ? 'properties' : 'products'} in your area to set competitive prices</li>
              {isRental ? (
                <>
                  <li>• Monthly rent should typically be 1-2% of property value</li>
                  <li>• Security deposit is usually 1-3 months of rent</li>
                  <li>• Consider utilities when setting rental prices</li>
                </>
              ) : (
                <>
                  <li>• Consider offering discounts to attract more customers</li>
                  <li>• Be transparent about any additional fees or charges</li>
                  <li>• Price negotiability can attract more inquiries but may result in lower final prices</li>
                </>
              )}
              {isRealEstate && (
                <li>• Consider the property's unique features and location when setting the price</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Price Analysis */}
      {(safePricing.basePrice || safePricing.rentPrice.monthly) && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Market Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Your Price</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isRental && safePricing.rentPrice.monthly
                  ? formatCurrency(safePricing.rentPrice.monthly, 'ETB')
                  : formatCurrency(safePricing.salePrice || safePricing.basePrice, 'ETB')
                }
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Market Average*</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isRental && safePricing.rentPrice.monthly
                  ? formatCurrency(safePricing.rentPrice.monthly * 1.1, 'ETB')
                  : formatCurrency((safePricing.salePrice || safePricing.basePrice) * 1.1, 'ETB')
                }
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