import { useState, useEffect } from 'react';
import Input from '../../ui/Input';
import { 
  InformationCircleIcon, 
  TagIcon,
  HomeIcon,
  BuildingOfficeIcon,
  MapIcon,
  ShoppingBagIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { PRODUCT_TYPE_CONFIG } from '../../../config/productTypes';

const BasicInfoStep = ({ formData, errors, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Safe form data with defaults aligned to model
  const safeFormData = {
    title: '',
    description: '',
    shortDescription: '',
    productType: '',
    subProductType: '',
    listingType: '',
    sellerType: 'individual',
    condition: 'new',
    brand: '',
    model: '',
    isFeatured: false,
    isPromoted: false,
    isVerified: false,
    tags: [],
    notes: '',
    status: 'draft',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    },
    availability: {
      isAvailable: true,
      availableFrom: '',
      availableUntil: ''
    },
    ...formData
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const keys = field.split('.');
      const updates = { ...formData };
      let current = updates;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      onChange(updates);
    } else if (field === 'productType') {
      // Reset dependent fields when product type changes
      onChange({
        [field]: value,
        subProductType: '',
        listingType: ['homes', 'plots', 'commercials'].includes(value) ? '' : undefined
      });
    } else {
      onChange({ [field]: value });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !safeFormData.tags.includes(newTag.trim())) {
      onChange({
        tags: [...safeFormData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    const updatedTags = safeFormData.tags.filter((_, i) => i !== index);
    onChange({ tags: updatedTags });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const currentProductConfig = PRODUCT_TYPE_CONFIG[safeFormData.productType];
  const isRealEstate = ['homes', 'plots', 'commercials'].includes(safeFormData.productType);

  // Get product type icon
  const getProductTypeIcon = (type) => {
    switch (type) {
      case 'homes':
        return <HomeIcon className="h-5 w-5" />;
      case 'plots':
        return <MapIcon className="h-5 w-5" />;
      case 'commercials':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'others':
        return <ShoppingBagIcon className="h-5 w-5" />;
      default:
        return <TagIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let's start with the basic details about your listing.
        </p>
      </div>

      {/* Product Type Selection */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            What are you listing? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(PRODUCT_TYPE_CONFIG).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleChange('productType', key)}
                className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                  safeFormData.productType === key
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded-lg ${
                    safeFormData.productType === key
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {getProductTypeIcon(key)}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {config.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {config.description}
                </p>
              </button>
            ))}
          </div>
          {errors.productType && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.productType}
            </p>
          )}
        </div>

        {/* Sub Product Type */}
        {safeFormData.productType && currentProductConfig && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specific Type *
            </label>
            <select
              value={safeFormData.subProductType}
              onChange={(e) => handleChange('subProductType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            >
              <option value="">Select {currentProductConfig.label} type</option>
              {currentProductConfig.subTypes.map(subType => (
                <option key={subType.value} value={subType.value}>
                  {subType.label}
                </option>
              ))}
            </select>
            {errors.subProductType && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.subProductType}
              </p>
            )}
          </div>
        )}

        {/* Listing Type (for real estate) */}
        {isRealEstate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Listing Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange('listingType', 'sell')}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  safeFormData.listingType === 'sell'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">For Sale</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sell your {safeFormData.productType === 'plots' ? 'land' : 'property'}
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('listingType', 'rent')}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  safeFormData.listingType === 'rent'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">For Rent</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Rent out your {safeFormData.productType === 'plots' ? 'land' : 'property'}
                </div>
              </button>
            </div>
            {errors.listingType && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.listingType}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <Input
        label="Title *"
        value={safeFormData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        placeholder={
          isRealEstate 
            ? `Beautiful ${safeFormData.subProductType || 'property'} in ${safeFormData.productType === 'plots' ? 'prime location' : 'great neighborhood'}`
            : `High-quality ${safeFormData.subProductType || 'product'} for sale`
        }
        helper="Create an attractive title that describes your listing"
        className="text-base"
        maxLength={100}
      />

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Short Description
        </label>
        <textarea
          value={safeFormData.shortDescription}
          onChange={(e) => handleChange('shortDescription', e.target.value)}
          rows={2}
          maxLength={150}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base resize-none"
          placeholder="Brief summary that will appear in search results..."
        />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This appears in search previews
          </p>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {safeFormData.shortDescription.length}/150
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Detailed Description *
        </label>
        <textarea
          value={safeFormData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={6}
          maxLength={2000}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base resize-none"
          placeholder={
            isRealEstate
              ? `Describe your ${safeFormData.productType === 'plots' ? 'land' : 'property'} in detail. Include location highlights, nearby amenities, unique features, and what makes it special...`
              : "Provide a comprehensive description of your product. Include features, benefits, condition, and any other relevant details..."
          }
        />
        <div className="flex justify-between mt-1">
          {errors.description && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.description}
            </p>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {safeFormData.description.length}/2000
          </span>
        </div>
      </div>

      {/* Seller Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          I am a *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleChange('sellerType', 'individual')}
            className={`p-3 border-2 rounded-lg text-center transition-colors ${
              safeFormData.sellerType === 'individual'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            }`}
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">Individual</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Personal seller</div>
          </button>
          <button
            type="button"
            onClick={() => handleChange('sellerType', 'company')}
            className={`p-3 border-2 rounded-lg text-center transition-colors ${
              safeFormData.sellerType === 'company'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            }`}
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">Company</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Business/Agency</div>
          </button>
        </div>
      </div>

      {/* Advanced Options */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-600"
        >
          <span>Advanced Options</span>
          <svg className={`w-4 h-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {/* Condition (for non-real estate) */}
            {!isRealEstate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Condition
                </label>
                <select
                  value={safeFormData.condition}
                  onChange={(e) => handleChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                >
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
            )}

            {/* Brand & Model (for products) */}
            {!isRealEstate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Brand"
                  value={safeFormData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  placeholder="e.g., Apple, Samsung, Toyota"
                  className="text-base"
                />
                <Input
                  label="Model"
                  value={safeFormData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="e.g., iPhone 14, Galaxy S23"
                  className="text-base"
                />
              </div>
            )}

            {/* Availability */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Availability</h4>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={safeFormData.availability?.isAvailable ?? true}
                  onChange={(e) => handleChange('availability.isAvailable', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="ml-3">
                  <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currently Available
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Uncheck if this item is temporarily unavailable
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Available From"
                  type="date"
                  value={safeFormData.availability?.availableFrom || ''}
                  onChange={(e) => handleChange('availability.availableFrom', e.target.value)}
                  helper="When will this become available?"
                  className="text-base"
                />
                <Input
                  label="Available Until"
                  type="date"
                  value={safeFormData.availability?.availableUntil || ''}
                  onChange={(e) => handleChange('availability.availableUntil', e.target.value)}
                  helper="When will this no longer be available?"
                  className="text-base"
                />
              </div>
            </div>

            {/* Promotion Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Promotion Options</h4>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={safeFormData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="ml-3">
                  <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    Featured Listing
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mark this as a featured listing for better visibility (additional fees may apply)
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="isPromoted"
                  checked={safeFormData.isPromoted}
                  onChange={(e) => handleChange('isPromoted', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="ml-3">
                  <label htmlFor="isPromoted" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Promoted Listing
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Promote this listing for increased visibility
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">SEO Settings</h4>
              
              <Input
                label="Meta Title"
                value={safeFormData.seo?.metaTitle || ''}
                onChange={(e) => handleChange('seo.metaTitle', e.target.value)}
                placeholder="SEO-friendly title for search engines"
                helper="Leave blank to use the main title"
                maxLength={60}
                className="text-base"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={safeFormData.seo?.metaDescription || ''}
                  onChange={(e) => handleChange('seo.metaDescription', e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base resize-none"
                  placeholder="Description for search engine results"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {safeFormData.seo?.metaDescription?.length || 0}/160 characters
                </p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="text-base"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              
              {safeFormData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {safeFormData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2 text-primary-500 hover:text-primary-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Add relevant keywords to help people find your listing
              </p>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Internal Notes
              </label>
              <textarea
                value={safeFormData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base resize-none"
                placeholder="Private notes for your own reference (not visible to customers)..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Tips for a Great Listing
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use a clear, descriptive title that highlights key features</li>
              <li>• Write a detailed description with specific information</li>
              {isRealEstate ? (
                <>
                  <li>• Mention nearby amenities, schools, and transportation</li>
                  <li>• Highlight unique features and recent improvements</li>
                </>
              ) : (
                <>
                  <li>• Include brand, model, and technical specifications</li>
                  <li>• Be honest about the condition and any defects</li>
                </>
              )}
              <li>• Use relevant tags to improve searchability</li>
              <li>• Consider featured/promoted options for better visibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;