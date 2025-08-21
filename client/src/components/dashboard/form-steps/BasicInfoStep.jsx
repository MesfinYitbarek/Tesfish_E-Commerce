import { useState, useEffect } from 'react';
import Input from '../../ui/Input';
import { PROPERTY_TYPES, SERVICE_TYPES } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../store/slices/productSlice';

const BasicInfoStep = ({ formData, errors, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Ensure all fields have proper initial values
  const safeFormData = {
    type: 'real-estate',
    title: '',
    category: '',
    description: '',
    tags: [],
    brand: '',
    model: '',
    condition: 'excellent',
    warranty: '',
    ...formData
  };

  const handleChange = (field, value) => {
    // Convert empty string to null for subcategory
  if (field === 'subcategory' && value === '') {
    onChange({ [field]: null });
  } else {
    onChange({ [field]: value });
  }
  };

  // Filter main categories (those without a parent)
  const mainCategories = categories.filter(cat => !cat.parent);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let's start with the essential details about your listing.
        </p>
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          What are you listing? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleChange('type', 'real-estate')}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              safeFormData.type === 'real-estate'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Real Estate</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Properties for sale or rent - apartments, villas, commercial spaces
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleChange('type', 'service')}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              safeFormData.type === 'service'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Service</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional services - design, construction, consulting, management
            </p>
          </button>
        </div>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <Input
          label="Listing Title"
          required
          value={safeFormData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          placeholder={
            safeFormData.type === 'real-estate' 
              ? "e.g., Modern 3BR Apartment in CMC with City View"
              : "e.g., Professional Interior Design Services"
          }
          maxLength={100}
          helper="Write a clear, descriptive title that highlights the key features"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category *
        </label>
        <select
          value={safeFormData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select a category</option>
          {mainCategories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
        )}
      </div>

      {/* Subcategory - Only show if a category is selected and has subcategories */}
      {safeFormData.category && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subcategory
          </label>
          <select
            value={safeFormData.subcategory || ''}
            onChange={(e) => handleChange('subcategory', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">No subcategory</option>
            {categories
              .filter(cat => cat.parent === safeFormData.category)
              .map(subcategory => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          value={safeFormData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder={
            safeFormData.type === 'real-estate' 
              ? "Describe your property in detail. Include information about the location, features, amenities, and what makes it special..."
              : "Describe your service in detail. Include your experience, approach, what's included, and what makes you different..."
          }
          maxLength={2000}
        />
        <div className="flex justify-between mt-1">
          {errors.description && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {safeFormData.description?.length || 0}/2000 characters
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
          <span>Advanced Options</span>
          <svg className={`w-4 h-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
            {/* Tags */}
            <div>
              <Input
                label="Tags (comma-separated)"
                value={safeFormData.tags?.join(', ') || ''}
                onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                placeholder="modern, luxury, furnished, prime location"
                helper="Add relevant tags to help customers find your listing"
              />
            </div>

            {/* Brand and Model (for applicable items) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Brand"
                value={safeFormData.brand || ''}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="e.g., Tesla, Apple, etc."
              />
              <Input
                label="Model"
                value={safeFormData.model || ''}
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="e.g., Model S, iPhone 15"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Condition
              </label>
              <select
                value={safeFormData.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="needs-renovation">Needs Renovation</option>
              </select>
            </div>

            {/* Warranty */}
            <Input
              label="Warranty"
              value={safeFormData.warranty || ''}
              onChange={(e) => handleChange('warranty', e.target.value)}
              placeholder="e.g., 2 years manufacturer warranty"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoStep;