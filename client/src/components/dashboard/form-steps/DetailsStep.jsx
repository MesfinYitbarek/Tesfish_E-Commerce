import { useState } from 'react';
import Input from '../../ui/Input';
import { ETHIOPIAN_CITIES } from '../../../constants';
import { PlusIcon, XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button';

const DetailsStep = ({ formData, errors, onChange }) => {
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newCertification, setNewCertification] = useState('');

  // Helper function to safely get nested values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object') {
        return acc[part];
      }
      return undefined;
    }, obj);
  };

  // Helper function to format area display
  const formatArea = (area) => {
    if (!area) return '';
    if (typeof area === 'object') {
      return `${area.value || ''} ${area.unit || 'sqm'}`;
    }
    return area;
  };

  // Ensure all arrays are initialized
  const safeFormData = {
    ...formData,
    realEstateDetails: {
      features: [],
      amenities: [],
      ...formData.realEstateDetails,
      location: {
        landmarks: [],
        ...formData.realEstateDetails?.location
      }
    },
    serviceDetails: {
      languages: [],
      certifications: [],
      features: [],
      ...formData.serviceDetails
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const keys = field.split('.');
      let updated = { ...safeFormData };
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] };
      }
      current[keys[keys.length - 1]] = value;

      onChange(updated);
    } else {
      onChange({ [field]: value });
    }
  };

  const addToArray = (arrayPath, value, setterFunction) => {
    if (!value.trim()) return;

    const keys = arrayPath.split('.');
    let updated = { ...safeFormData };
    let current = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = { ...current[keys[i]] };
    }

    const currentArray = current[keys[keys.length - 1]] || [];
    current[keys[keys.length - 1]] = [...currentArray, value.trim()];

    onChange(updated);
    setterFunction('');
  };

  const removeFromArray = (arrayPath, index) => {
    const keys = arrayPath.split('.');
    let updated = { ...safeFormData };
    let current = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = { ...current[keys[i]] };
    }

    const currentArray = current[keys[keys.length - 1]] || [];
    current[keys[keys.length - 1]] = currentArray.filter((_, i) => i !== index);

    onChange(updated);
  };

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'house', label: 'House' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'condo', label: 'Condominium' },
    { value: 'studio', label: 'Studio' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'office', label: 'Office' },
    { value: 'retail', label: 'Retail' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'land', label: 'Land' }
  ];

  const serviceTypes = [
    { value: 'interior-design', label: 'Interior Design' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'construction', label: 'Construction' },
    { value: 'project-management', label: 'Project Management' },
    { value: 'real-estate-consulting', label: 'Real Estate Consulting' },
    { value: 'property-management', label: 'Property Management' },
    { value: 'legal-services', label: 'Legal Services' },
    { value: 'financial-services', label: 'Financial Services' },
    { value: 'home-inspection', label: 'Home Inspection' },
    { value: 'moving-services', label: 'Moving Services' }
  ];

  const commonFeatures = [
    'Swimming Pool', 'Gym/Fitness Center', 'Parking', 'Garden', 'Balcony',
    'Air Conditioning', 'Central Heating', 'Fireplace', 'Walk-in Closet',
    'Laundry Room', 'Storage Room', 'Maid\'s Room', 'Guest Room'
  ];

  const commonAmenities = [
    'Security 24/7', 'Elevator', 'Generator', 'Water Tank', 'Garage',
    'Playground', 'Community Center', 'Shopping Center Nearby',
    'School Nearby', 'Hospital Nearby', 'Public Transport', 'Restaurant Nearby'
  ];

  if (safeFormData.type === 'real-estate') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Property Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Provide specific information about your property.
          </p>
        </div>

        {/* Property Type and Listing Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property Type *
            </label>
            <select
              value={getNestedValue(safeFormData, 'realEstateDetails.propertyType') || ''}
              onChange={(e) => handleChange('realEstateDetails.propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select property type</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors['realEstateDetails.propertyType'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors['realEstateDetails.propertyType']}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Listing Type
            </label>
            <select
              value={getNestedValue(safeFormData, 'realEstateDetails.listingType') || 'sale'}
              onChange={(e) => handleChange('realEstateDetails.listingType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="sale">For Sale</option>
              <option value="rental">For Rent</option>
              <option value="both">Sale or Rent</option>
            </select>
          </div>
        </div>

        {/* Basic Property Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Bedrooms"
            type="number"
            min="0"
            max="20"
            value={getNestedValue(safeFormData, 'realEstateDetails.bedrooms') || ''}
            onChange={(e) => handleChange('realEstateDetails.bedrooms', e.target.value)}
            placeholder="0"
          />
          <Input
            label="Bathrooms"
            type="number"
            min="0"
            max="20"
            step="0.5"
            value={getNestedValue(safeFormData, 'realEstateDetails.bathrooms') || ''}
            onChange={(e) => handleChange('realEstateDetails.bathrooms', e.target.value)}
            placeholder="0"
          />
          <Input
            label="Area"
            type="number"
            min="1"
            value={getNestedValue(safeFormData, 'realEstateDetails.area.value') || ''}
            onChange={(e) => handleChange('realEstateDetails.area', {
              ...getNestedValue(safeFormData, 'realEstateDetails.area'),
              value: e.target.value
            })}
            placeholder="120"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Area Unit
          </label>
          <select
            value={getNestedValue(safeFormData, 'realEstateDetails.area.unit') || 'sqm'}
            onChange={(e) => handleChange('realEstateDetails.area', {
              ...getNestedValue(safeFormData, 'realEstateDetails.area'),
              unit: e.target.value
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="sqm">Square Meters</option>
            <option value="sqft">Square Feet</option>
            <option value="hectare">Hectares</option>
            <option value="acre">Acres</option>
          </select>
        </div>

        {/* Additional Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Year Built"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={getNestedValue(safeFormData, 'realEstateDetails.yearBuilt') || ''}
            onChange={(e) => handleChange('realEstateDetails.yearBuilt', e.target.value)}
            placeholder={new Date().getFullYear().toString()}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Furnishing Status
            </label>
            <select
              value={getNestedValue(safeFormData, 'realEstateDetails.furnishingStatus') || ''}
              onChange={(e) => handleChange('realEstateDetails.furnishingStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select status</option>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="fully-furnished">Fully Furnished</option>
            </select>
          </div>

          <Input
            label="Parking Spaces"
            type="number"
            min="0"
            max="10"
            value={getNestedValue(safeFormData, 'realEstateDetails.parkingSpaces') || ''}
            onChange={(e) => handleChange('realEstateDetails.parkingSpaces', e.target.value)}
            placeholder="0"
          />
        </div>

        {/* Floor Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Floor Number"
            type="number"
            min="0"
            max="100"
            value={getNestedValue(safeFormData, 'realEstateDetails.floorNumber') || ''}
            onChange={(e) => handleChange('realEstateDetails.floorNumber', e.target.value)}
            placeholder="e.g., 3"
            helper="Ground floor = 0"
          />
          <Input
            label="Total Floors"
            type="number"
            min="1"
            max="100"
            value={getNestedValue(safeFormData, 'realEstateDetails.totalFloors') || ''}
            onChange={(e) => handleChange('realEstateDetails.totalFloors', e.target.value)}
            placeholder="e.g., 12"
          />
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2" />
            Location
          </h3>

          <div>
            <Input
              label="Address *"
              value={getNestedValue(safeFormData, 'realEstateDetails.location.address') || ''}
              onChange={(e) => handleChange('realEstateDetails.location.address', e.target.value)}
              error={errors['realEstateDetails.location.address']}
              placeholder="e.g., Bole, near Edna Mall"
              helper="Provide a specific address or area description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <select
                value={getNestedValue(safeFormData, 'realEstateDetails.location.city') || ''}
                onChange={(e) => handleChange('realEstateDetails.location.city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {ETHIOPIAN_CITIES.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="State/Region"
              value={getNestedValue(safeFormData, 'realEstateDetails.location.state') || ''}
              onChange={(e) => handleChange('realEstateDetails.location.state', e.target.value)}
              placeholder="e.g., Addis Ababa"
            />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Features</h3>

          {/* Quick Add Features */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick add common features:</p>
            <div className="flex flex-wrap gap-2">
              {commonFeatures.map(feature => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => {
                    if (!safeFormData.realEstateDetails.features.includes(feature)) {
                      addToArray('realEstateDetails.features', feature, () => {});
                    }
                  }}
                  disabled={safeFormData.realEstateDetails.features.includes(feature)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${safeFormData.realEstateDetails.features.includes(feature)
                    ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed'
                    : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                    }`}
                >
                  {feature}
                  {safeFormData.realEstateDetails.features.includes(feature) && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Features */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('realEstateDetails.features', newFeature, setNewFeature);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addToArray('realEstateDetails.features', newFeature, setNewFeature)}
              disabled={!newFeature.trim()}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Features */}
          {safeFormData.realEstateDetails.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {safeFormData.realEstateDetails.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFromArray('realEstateDetails.features', index)}
                    className="ml-2 text-primary-500 hover:text-primary-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Amenities</h3>

          {/* Quick Add Amenities */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick add common amenities:</p>
            <div className="flex flex-wrap gap-2">
              {commonAmenities.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => {
                    if (!safeFormData.realEstateDetails.amenities.includes(amenity)) {
                      addToArray('realEstateDetails.amenities', amenity, () => {});
                    }
                  }}
                  disabled={safeFormData.realEstateDetails.amenities.includes(amenity)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${safeFormData.realEstateDetails.amenities.includes(amenity)
                    ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed'
                    : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                    }`}
                >
                  {amenity}
                  {safeFormData.realEstateDetails.amenities.includes(amenity) && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amenities */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom amenity"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('realEstateDetails.amenities', newAmenity, setNewAmenity);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addToArray('realEstateDetails.amenities', newAmenity, setNewAmenity)}
              disabled={!newAmenity.trim()}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Amenities */}
          {safeFormData.realEstateDetails.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {safeFormData.realEstateDetails.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeFromArray('realEstateDetails.amenities', index)}
                    className="ml-2 text-green-500 hover:text-green-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Service Details
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Service Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Provide specific information about your service.
        </p>
      </div>

      {/* Service Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Service Type *
        </label>
        <select
          value={getNestedValue(safeFormData, 'serviceDetails.serviceType') || ''}
          onChange={(e) => handleChange('serviceDetails.serviceType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select service type</option>
          {serviceTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors['serviceDetails.serviceType'] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors['serviceDetails.serviceType']}
          </p>
        )}
      </div>

      {/* Service Area and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Service Area *"
            value={getNestedValue(safeFormData, 'serviceDetails.serviceArea') || ''}
            onChange={(e) => handleChange('serviceDetails.serviceArea', e.target.value)}
            error={errors['serviceDetails.serviceArea']}
            placeholder="e.g., Addis Ababa, Ethiopia"
            helper="Where do you provide this service?"
          />
        </div>
        <div>
          <Input
            label="Typical Duration"
            value={getNestedValue(safeFormData, 'serviceDetails.duration.value') || ''}
            onChange={(e) => handleChange('serviceDetails.duration', {
              ...getNestedValue(safeFormData, 'serviceDetails.duration'),
              value: e.target.value
            })}
            placeholder="e.g., 2-4 hours, 1-2 weeks"
            helper="How long does this service typically take?"
          />
        </div>
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Duration Unit
        </label>
        <select
          value={getNestedValue(safeFormData, 'serviceDetails.duration.unit') || 'hours'}
          onChange={(e) => handleChange('serviceDetails.duration', {
            ...getNestedValue(safeFormData, 'serviceDetails.duration'),
            unit: e.target.value
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="hours">Hours</option>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </select>
      </div>

      {/* Experience and Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Experience Level
          </label>
          <select
            value={getNestedValue(safeFormData, 'serviceDetails.experienceLevel') || ''}
            onChange={(e) => handleChange('serviceDetails.experienceLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select experience level</option>
            <option value="entry">Entry Level (0-2 years)</option>
            <option value="intermediate">Intermediate (2-5 years)</option>
            <option value="experienced">Experienced (5-10 years)</option>
            <option value="expert">Expert (10+ years)</option>
          </select>
        </div>

        <Input
          label="Team Size"
          value={getNestedValue(safeFormData, 'serviceDetails.teamSize') || ''}
          onChange={(e) => handleChange('serviceDetails.teamSize', e.target.value)}
          placeholder="e.g., 1-3 people, 5-10 people"
          helper="How many people are involved in delivering this service?"
        />
      </div>

      {/* Availability */}
      <div>
        <Input
          label="Availability"
          value={getNestedValue(safeFormData, 'serviceDetails.availability') || ''}
          onChange={(e) => handleChange('serviceDetails.availability', e.target.value)}
          placeholder="e.g., Monday-Friday 9AM-6PM, Weekends available"
          helper="When are you available to provide this service?"
        />
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Languages</h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {['English', 'Amharic', 'Oromo', 'Tigrinya', 'Arabic', 'French'].map(language => (
            <button
              key={language}
              type="button"
              onClick={() => {
                if (!safeFormData.serviceDetails.languages.includes(language)) {
                  addToArray('serviceDetails.languages', language, () => {});
                }
              }}
              disabled={safeFormData.serviceDetails.languages.includes(language)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${safeFormData.serviceDetails.languages.includes(language)
                ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed'
                : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                }`}
            >
              {language}
              {safeFormData.serviceDetails.languages.includes(language) && ' ✓'}
            </button>
          ))}
        </div>

        {/* Selected Languages */}
        {safeFormData.serviceDetails.languages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {safeFormData.serviceDetails.languages.map((language, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              >
                {language}
                <button
                  type="button"
                  onClick={() => removeFromArray('serviceDetails.languages', index)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Certifications</h3>

        <div className="flex gap-2">
          <Input
            placeholder="Add certification or qualification"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addToArray('serviceDetails.certifications', newCertification, setNewCertification);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addToArray('serviceDetails.certifications', newCertification, setNewCertification)}
            disabled={!newCertification.trim()}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Certifications */}
        {safeFormData.serviceDetails.certifications.length > 0 && (
          <div className="space-y-2">
            {safeFormData.serviceDetails.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <span className="text-sm text-gray-900 dark:text-gray-100">{cert}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('serviceDetails.certifications', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Service Features</h3>

        <div className="flex gap-2">
          <Input
            placeholder="Add service feature (e.g., Free consultation, 24/7 support)"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addToArray('serviceDetails.features', newFeature, setNewFeature);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addToArray('serviceDetails.features', newFeature, setNewFeature)}
            disabled={!newFeature.trim()}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Features */}
        {safeFormData.serviceDetails.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {safeFormData.serviceDetails.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFromArray('serviceDetails.features', index)}
                  className="ml-2 text-purple-500 hover:text-purple-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Instant Booking */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="instantBooking"
          checked={getNestedValue(safeFormData, 'serviceDetails.instantBooking') || false}
          onChange={(e) => handleChange('serviceDetails.instantBooking', e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="instantBooking" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Allow instant booking (customers can book immediately without approval)
        </label>
      </div>
    </div>
  );
};

export default DetailsStep;