import { useState } from 'react';
import Input from '../../ui/Input';
import { PlusIcon, XMarkIcon, HomeIcon, TruckIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button';

const DetailsStep = ({ formData, errors, productTypeConfig, onChange }) => {
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newSpecification, setNewSpecification] = useState({ name: '', value: '', group: '' });

  // Helper function to safely get nested values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object') {
        return acc[part];
      }
      return undefined;
    }, obj);
  };

  // Ensure all nested objects are initialized with model-compliant structure
  const safeFormData = {
    ...formData,
    propertyDetails: {
      propertyId: '',
      propertyType: formData?.subProductType || '',
      area: { value: '', unit: 'sqm' },
      bedrooms: '',
      bathrooms: '',
      floors: '',
      parkingSpaces: '',
      balconies: '',
      furnishingStatus: 'unfurnished',
      yearBuilt: '',
      features: [],
      amenities: [],
      utilities: {
        electricity: false,
        water: false,
        internet: false,
        gas: false,
        sewerage: false,
        garbage: false
      },
      location: {
        address: '',
        city: '',
        subcity: '',
        woreda: '',
        kebele: '',
        region: '',
        country: 'Ethiopia',
        zipCode: '',
        coordinates: { lat: '', lng: '' },
        landmarks: [],
        nearbyFacilities: []
      },
      registrationFee: 0,
      hasLegalDocuments: false,
      legalDocuments: [],
      titleDeedStatus: 'not-applicable',
      landDetails: {
        landUse: 'residential',
        topography: 'flat',
        soilType: '',
        waterSource: 'none',
        accessRoad: 'paved',
        developmentPotential: ''
      },
      isProject: false,
      projectDetails: {
        projectName: '',
        developer: '',
        totalUnits: '',
        availableUnits: '',
        soldUnits: 0,
        completionDate: '',
        constructionStatus: 'planning',
        paymentPlan: 'full-payment',
        installmentOptions: [],
        projectFeatures: [],
        masterPlan: ''
      },
      ...formData.propertyDetails
    },
    vehicleDetails: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      fuelType: 'petrol',
      transmission: 'manual',
      color: '',
      engineSize: '',
      bodyType: '',
      ...formData.vehicleDetails
    },
    equipmentDetails: {
      manufacturer: '',
      model: '',
      year: '',
      condition: '',
      hoursUsed: '',
      specifications: [],
      ...formData.equipmentDetails
    },
    businessDetails: {
      businessType: '',
      annualRevenue: '',
      employees: '',
      establishedYear: '',
      equipment: [],
      licenses: [],
      financialDocuments: [],
      ...formData.businessDetails
    },
    specifications: formData.specifications || [],
    inventory: {
      sku: '',
      stock: 1,
      lowStockThreshold: 1,
      trackInventory: formData.productType === 'others',
      allowBackorders: false,
      ...formData.inventory
    },
    warranty: {
      duration: '',
      unit: 'months',
      type: 'manufacturer',
      description: '',
      ...formData.warranty
    },
    returnPolicy: {
      returnable: formData.productType === 'others',
      returnPeriod: 30,
      conditions: [],
      ...formData.returnPolicy
    },
    shipping: {
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      shippingClass: '',
      freeShipping: false,
      shippingCost: '',
      ...formData.shipping
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const keys = field.split('.');
      let updated = { ...formData };
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]] = { ...current[keys[i]] };
      }
      current[keys[keys.length - 1]] = value;

      onChange(updated);
    } else {
      onChange({ [field]: value });
    }
  };

  const addSpecification = () => {
    if (!newSpecification.name.trim() || !newSpecification.value.trim()) return;

    const updatedSpecs = [...safeFormData.specifications, { ...newSpecification }];
    onChange({ specifications: updatedSpecs });
    setNewSpecification({ name: '', value: '', group: '' });
  };

  const removeSpecification = (index) => {
    const updatedSpecs = safeFormData.specifications.filter((_, i) => i !== index);
    onChange({ specifications: updatedSpecs });
  };

  const addToArray = (arrayPath, value, setterFunction) => {
    if (!value || (typeof value === 'string' && !value.trim())) return;

    const keys = arrayPath.split('.');
    let updated = { ...formData };
    let current = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] = { ...current[keys[i]] };
    }

    const currentArray = current[keys[keys.length - 1]] || [];
    current[keys[keys.length - 1]] = [...currentArray, typeof value === 'string' ? value.trim() : value];

    onChange(updated);
    if (setterFunction) setterFunction('');
  };

  const removeFromArray = (arrayPath, index) => {
    const keys = arrayPath.split('.');
    let updated = { ...formData };
    let current = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = { ...current[keys[i]] };
    }

    const currentArray = current[keys[keys.length - 1]] || [];
    current[keys[keys.length - 1]] = currentArray.filter((_, i) => i !== index);

    onChange(updated);
  };

  // Common features for different property types
  const commonFeatures = {
    homes: [
      'Air Conditioning', 'Balcony', 'Garden', 'Parking', 'Swimming Pool', 
      'Gym/Fitness Center', 'Security 24/7', 'Elevator', 'Generator', 
      'Water Tank', 'Garage', 'Storage Room', "Maid's Room", 'Study Room',
      'Walk-in Closet', 'Laundry Room', 'Guest Room', 'Home Office',
      'Fireplace', 'Terrace', 'Basement', 'Attic', 'Panoramic View'
    ],
    commercials: [
      'Air Conditioning', 'Parking', 'Security 24/7', 'Elevator', 'Generator',
      'Reception Area', 'Conference Room', 'Cafeteria', 'Loading Dock',
      'Fire Safety', 'CCTV', 'Backup Power', 'High-Speed Internet',
      'Warehouse Space', 'Office Space', 'Retail Space', 'Kitchen Facilities'
    ]
  };

  const commonAmenities = [
    'Swimming Pool', 'Gym', 'Playground', 'Community Center', 'Security Gate',
    'CCTV Surveillance', '24/7 Security', 'Landscaped Gardens', 'Walking Paths',
    'Children Play Area', 'Basketball Court', 'Tennis Court', 'Clubhouse',
    'Parking', 'Elevator', 'Generator', 'Water Tank', 'Internet/WiFi',
    'Cable TV', 'Intercom', 'Gated Community', 'Mosque/Church Nearby',
    'School Nearby', 'Hospital Nearby', 'Shopping Center Nearby'
  ];

  // Render different content based on product type
  if (['homes', 'plots', 'commercials'].includes(safeFormData.productType)) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <HomeIcon className="h-6 w-6 mr-2 text-primary-500" />
            Property Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Provide specific information about your {formData.productType === 'plots' ? 'land' : 'property'}.
          </p>
        </div>

        {/* Property ID (Auto-generated) */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Property ID</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {safeFormData.propertyDetails.propertyId || 'Will be auto-generated upon submission'}
              </p>
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-400">
              Auto-Generated
            </div>
          </div>
        </div>

        {/* Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Area *"
            type="number"
            min="1"
            step="0.01"
            value={getNestedValue(safeFormData, 'propertyDetails.area.value') || ''}
            onChange={(e) => handleChange('propertyDetails.area', {
              ...getNestedValue(safeFormData, 'propertyDetails.area'),
              value: e.target.value
            })}
            error={errors['propertyDetails.area.value']}
            placeholder="120"
            className="text-base"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Area Unit
            </label>
            <select
              value={getNestedValue(safeFormData, 'propertyDetails.area.unit') || 'sqm'}
              onChange={(e) => handleChange('propertyDetails.area', {
                ...getNestedValue(safeFormData, 'propertyDetails.area'),
                unit: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            >
              <option value="sqm">Square Meters (m²)</option>
              <option value="sqft">Square Feet (ft²)</option>
              {safeFormData.productType === 'plots' && (
                <>
                  <option value="hectares">Hectares</option>
                  <option value="acres">Acres</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Property Specific Details */}
        {safeFormData.productType !== 'plots' && (
          <>
            {/* Basic Property Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label={safeFormData.subProductType === 'offices' ? 'Rooms' : 'Bedrooms'}
                type="number"
                min="0"
                max="20"
                value={getNestedValue(safeFormData, 'propertyDetails.bedrooms') || ''}
                onChange={(e) => handleChange('propertyDetails.bedrooms', e.target.value)}
                error={errors['propertyDetails.bedrooms']}
                placeholder="0"
                className="text-base"
              />
              <Input
                label="Bathrooms"
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={getNestedValue(safeFormData, 'propertyDetails.bathrooms') || ''}
                onChange={(e) => handleChange('propertyDetails.bathrooms', e.target.value)}
                error={errors['propertyDetails.bathrooms']}
                placeholder="0"
                className="text-base"
              />
              <Input
                label="Floors"
                type="number"
                min="1"
                max="100"
                value={getNestedValue(safeFormData, 'propertyDetails.floors') || ''}
                onChange={(e) => handleChange('propertyDetails.floors', e.target.value)}
                placeholder="1"
                className="text-base"
              />
              <Input
                label="Parking Spaces"
                type="number"
                min="0"
                max="20"
                value={getNestedValue(safeFormData, 'propertyDetails.parkingSpaces') || ''}
                onChange={(e) => handleChange('propertyDetails.parkingSpaces', e.target.value)}
                placeholder="0"
                className="text-base"
              />
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Year Built"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={getNestedValue(safeFormData, 'propertyDetails.yearBuilt') || ''}
                onChange={(e) => handleChange('propertyDetails.yearBuilt', e.target.value)}
                placeholder={new Date().getFullYear().toString()}
                className="text-base"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Furnishing Status
                </label>
                <select
                  value={getNestedValue(safeFormData, 'propertyDetails.furnishingStatus') || 'unfurnished'}
                  onChange={(e) => handleChange('propertyDetails.furnishingStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="furnished">Fully Furnished</option>
                  <option value="not-applicable">Not Applicable</option>
                </select>
              </div>

              <Input
                label="Balconies"
                type="number"
                min="0"
                max="10"
                value={getNestedValue(safeFormData, 'propertyDetails.balconies') || ''}
                onChange={(e) => handleChange('propertyDetails.balconies', e.target.value)}
                placeholder="0"
                className="text-base"
              />
            </div>
          </>
        )}

        {/* Land Details (for plots) */}
        {safeFormData.productType === 'plots' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Land Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Land Use *
                </label>
                <select
                  value={getNestedValue(safeFormData, 'propertyDetails.landDetails.landUse') || 'residential'}
                  onChange={(e) => handleChange('propertyDetails.landDetails.landUse', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="mixed-use">Mixed Use</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="industrial">Industrial</option>
                </select>
                {errors['propertyDetails.landDetails.landUse'] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors['propertyDetails.landDetails.landUse']}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topography
                </label>
                <select
                  value={getNestedValue(safeFormData, 'propertyDetails.landDetails.topography') || 'flat'}
                  onChange={(e) => handleChange('propertyDetails.landDetails.topography', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                >
                  <option value="flat">Flat</option>
                  <option value="sloped">Sloped</option>
                  <option value="hilly">Hilly</option>
                  <option value="mountainous">Mountainous</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Soil Type"
                value={getNestedValue(safeFormData, 'propertyDetails.landDetails.soilType') || ''}
                onChange={(e) => handleChange('propertyDetails.landDetails.soilType', e.target.value)}
                placeholder="e.g., Clay, Sandy, Loam"
                className="text-base"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Water Source
                </label>
                <select
                  value={getNestedValue(safeFormData, 'propertyDetails.landDetails.waterSource') || 'none'}
                  onChange={(e) => handleChange('propertyDetails.landDetails.waterSource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                >
                  <option value="none">None</option>
                  <option value="borehole">Borehole</option>
                  <option value="well">Well</option>
                  <option value="municipal">Municipal</option>
                  <option value="river">River</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Access Road
                </label>
                <select
                  value={getNestedValue(safeFormData, 'propertyDetails.landDetails.accessRoad') || 'paved'}
                  onChange={(e) => handleChange('propertyDetails.landDetails.accessRoad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                >
                  <option value="paved">Paved</option>
                  <option value="gravel">Gravel</option>
                  <option value="dirt">Dirt</option>
                  <option value="no-access">No Access</option>
                </select>
              </div>

              <Input
                label="Development Potential"
                value={getNestedValue(safeFormData, 'propertyDetails.landDetails.developmentPotential') || ''}
                onChange={(e) => handleChange('propertyDetails.landDetails.developmentPotential', e.target.value)}
                placeholder="Describe development possibilities"
                className="text-base"
              />
            </div>
          </div>
        )}

        {/* Legal & Registration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Legal & Registration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Registration Fee (ETB)"
              type="number"
              min="0"
              value={getNestedValue(safeFormData, 'propertyDetails.registrationFee') || ''}
              onChange={(e) => handleChange('propertyDetails.registrationFee', e.target.value)}
              placeholder="0"
              className="text-base"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title Deed Status
              </label>
              <select
                value={getNestedValue(safeFormData, 'propertyDetails.titleDeedStatus') || 'not-applicable'}
                onChange={(e) => handleChange('propertyDetails.titleDeedStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
              >
                <option value="not-applicable">Not Applicable</option>
                <option value="clear">Clear</option>
                <option value="pending">Pending</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="hasLegalDocuments"
              checked={getNestedValue(safeFormData, 'propertyDetails.hasLegalDocuments') || false}
              onChange={(e) => handleChange('propertyDetails.hasLegalDocuments', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="ml-3">
              <label htmlFor="hasLegalDocuments" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Legal documents available
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check if you have legal documentation for this property
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        {safeFormData.productType !== 'plots' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Property Features</h3>

            {/* Quick Add Features */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick add common features:</p>
              <div className="flex flex-wrap gap-2">
                {(commonFeatures[safeFormData.productType] || commonFeatures.homes).map(feature => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => {
                      if (!safeFormData.propertyDetails.features.includes(feature)) {
                        addToArray('propertyDetails.features', feature, () => {});
                      }
                    }}
                    disabled={safeFormData.propertyDetails.features.includes(feature)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      safeFormData.propertyDetails.features.includes(feature)
                        ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed'
                        : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    {feature}
                    {safeFormData.propertyDetails.features.includes(feature) && ' ✓'}
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
                    addToArray('propertyDetails.features', newFeature, setNewFeature);
                  }
                }}
                className="text-base"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addToArray('propertyDetails.features', newFeature, setNewFeature)}
                disabled={!newFeature.trim()}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Features */}
            {safeFormData.propertyDetails.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {safeFormData.propertyDetails.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFromArray('propertyDetails.features', index)}
                      className="ml-2 text-primary-500 hover:text-primary-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Amenities */}
        {safeFormData.productType !== 'plots' && (
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
                      if (!safeFormData.propertyDetails.amenities.includes(amenity)) {
                        addToArray('propertyDetails.amenities', amenity, () => {});
                      }
                    }}
                    disabled={safeFormData.propertyDetails.amenities.includes(amenity)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      safeFormData.propertyDetails.amenities.includes(amenity)
                        ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed'
                        : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    {amenity}
                    {safeFormData.propertyDetails.amenities.includes(amenity) && ' ✓'}
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
                    addToArray('propertyDetails.amenities', newAmenity, setNewAmenity);
                  }
                }}
                className="text-base"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addToArray('propertyDetails.amenities', newAmenity, setNewAmenity)}
                disabled={!newAmenity.trim()}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Amenities */}
            {safeFormData.propertyDetails.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {safeFormData.propertyDetails.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeFromArray('propertyDetails.amenities', index)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Utilities */}
        {safeFormData.productType !== 'plots' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Utilities & Services</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(safeFormData.propertyDetails.utilities).map(([utility, checked]) => (
                <label
                  key={utility}
                  className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleChange(`propertyDetails.utilities.${utility}`, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {utility.replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Project Details (for companies) */}
        {formData.sellerType === 'company' && (
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isProject"
                checked={safeFormData.propertyDetails.isProject}
                onChange={(e) => handleChange('propertyDetails.isProject', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isProject" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                This is part of a development project
              </label>
            </div>

            {safeFormData.propertyDetails.isProject && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Project Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Project Name"
                    value={getNestedValue(safeFormData, 'propertyDetails.projectDetails.projectName') || ''}
                    onChange={(e) => handleChange('propertyDetails.projectDetails.projectName', e.target.value)}
                    placeholder="e.g., Sunshine Residence"
                    className="text-base"
                  />
                  <Input
                    label="Developer"
                    value={getNestedValue(safeFormData, 'propertyDetails.projectDetails.developer') || ''}
                    onChange={(e) => handleChange('propertyDetails.projectDetails.developer', e.target.value)}
                    placeholder="Developer company name"
                    className="text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Total Units"
                    type="number"
                    value={getNestedValue(safeFormData, 'propertyDetails.projectDetails.totalUnits') || ''}
                    onChange={(e) => handleChange('propertyDetails.projectDetails.totalUnits', e.target.value)}
                    placeholder="100"
                    className="text-base"
                  />
                  <Input
                    label="Available Units"
                    type="number"
                    value={getNestedValue(safeFormData, 'propertyDetails.projectDetails.availableUnits') || ''}
                    onChange={(e) => handleChange('propertyDetails.projectDetails.availableUnits', e.target.value)}
                    placeholder="50"
                    className="text-base"
                  />
                  <Input
                    label="Completion Date"
                    type="date"
                    value={getNestedValue(safeFormData, 'propertyDetails.projectDetails.completionDate') || ''}
                    onChange={(e) => handleChange('propertyDetails.projectDetails.completionDate', e.target.value)}
                    className="text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Construction Status
                    </label>
                    <select
                      value={getNestedValue(safeFormData, 'propertyDetails.projectDetails.constructionStatus') || 'planning'}
                      onChange={(e) => handleChange('propertyDetails.projectDetails.constructionStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                    >
                      <option value="planning">Planning</option>
                      <option value="under-construction">Under Construction</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Plan
                    </label>
                    <select
                      value={getNestedValue(safeFormData, 'propertyDetails.projectDetails.paymentPlan') || 'full-payment'}
                      onChange={(e) => handleChange('propertyDetails.projectDetails.paymentPlan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                    >
                      <option value="full-payment">Full Payment</option>
                      <option value="installment">Installment</option>
                      <option value="both">Both Options</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Vehicle Details (for others -> vehicles)
  if (safeFormData.productType === 'others' && safeFormData.subProductType === 'vehicles') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <TruckIcon className="h-6 w-6 mr-2 text-primary-500" />
            Vehicle Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Provide specific information about your vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Make *"
            value={safeFormData.vehicleDetails.make}
            onChange={(e) => handleChange('vehicleDetails.make', e.target.value)}
            error={errors['vehicleDetails.make']}
            placeholder="e.g., Toyota, BMW, Mercedes"
            className="text-base"
          />
          <Input
            label="Model"
            value={safeFormData.vehicleDetails.model}
            onChange={(e) => handleChange('vehicleDetails.model', e.target.value)}
            placeholder="e.g., Camry, X5, C-Class"
            className="text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Year *"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={safeFormData.vehicleDetails.year}
            onChange={(e) => handleChange('vehicleDetails.year', e.target.value)}
            error={errors['vehicleDetails.year']}
            placeholder="2020"
            className="text-base"
          />
          <Input
            label="Mileage (km)"
            type="number"
            min="0"
            value={safeFormData.vehicleDetails.mileage}
            onChange={(e) => handleChange('vehicleDetails.mileage', e.target.value)}
            placeholder="50000"
            className="text-base"
          />
          <Input
            label="Color"
            value={safeFormData.vehicleDetails.color}
            onChange={(e) => handleChange('vehicleDetails.color', e.target.value)}
            placeholder="e.g., White, Black, Silver"
            className="text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fuel Type
            </label>
            <select
              value={safeFormData.vehicleDetails.fuelType}
              onChange={(e) => handleChange('vehicleDetails.fuelType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transmission
            </label>
            <select
              value={safeFormData.vehicleDetails.transmission}
              onChange={(e) => handleChange('vehicleDetails.transmission', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>

          <Input
            label="Engine Size"
            value={safeFormData.vehicleDetails.engineSize}
            onChange={(e) => handleChange('vehicleDetails.engineSize', e.target.value)}
            placeholder="e.g., 2.0L, 3000cc"
            className="text-base"
          />
        </div>

        <Input
          label="Body Type"
          value={safeFormData.vehicleDetails.bodyType}
          onChange={(e) => handleChange('vehicleDetails.bodyType', e.target.value)}
          placeholder="e.g., Sedan, SUV, Hatchback"
          className="text-base"
        />

        {/* Inventory Management for Vehicles */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Inventory</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="SKU (Optional)"
              value={safeFormData.inventory.sku}
              onChange={(e) => handleChange('inventory.sku', e.target.value)}
              placeholder="VEH-001"
              className="text-base"
            />
            <Input
              label="Stock Quantity"
              type="number"
              min="0"
              value={safeFormData.inventory.stock}
              onChange={(e) => handleChange('inventory.stock', e.target.value)}
              placeholder="1"
              className="text-base"
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="trackInventory"
              checked={safeFormData.inventory.trackInventory}
              onChange={(e) => handleChange('inventory.trackInventory', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="ml-3">
              <label htmlFor="trackInventory" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Track inventory levels
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable if you have multiple units of this vehicle
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Equipment Details (for others -> construction-equipment)
  if (safeFormData.productType === 'others' && safeFormData.subProductType === 'construction-equipment') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <TruckIcon className="h-6 w-6 mr-2 text-primary-500" />
            Equipment Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Provide specific information about your construction equipment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Manufacturer *"
            value={safeFormData.equipmentDetails.manufacturer}
            onChange={(e) => handleChange('equipmentDetails.manufacturer', e.target.value)}
            error={errors['equipmentDetails.manufacturer']}
            placeholder="e.g., Caterpillar, Komatsu, Volvo"
            className="text-base"
          />
          <Input
            label="Model"
            value={safeFormData.equipmentDetails.model}
            onChange={(e) => handleChange('equipmentDetails.model', e.target.value)}
            placeholder="e.g., 320D, PC200, EC20"
            className="text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Year"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={safeFormData.equipmentDetails.year}
            onChange={(e) => handleChange('equipmentDetails.year', e.target.value)}
            placeholder="2018"
            className="text-base"
          />
          <Input
            label="Hours Used"
            type="number"
            min="0"
            value={safeFormData.equipmentDetails.hoursUsed}
            onChange={(e) => handleChange('equipmentDetails.hoursUsed', e.target.value)}
            placeholder="2500"
            className="text-base"
          />
          <Input
            label="Condition"
            value={safeFormData.equipmentDetails.condition}
            onChange={(e) => handleChange('equipmentDetails.condition', e.target.value)}
            placeholder="e.g., Excellent, Good, Fair"
            className="text-base"
          />
        </div>

        {/* Equipment Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Equipment Specifications</h3>

          {/* Add New Specification */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input
              placeholder="Specification name"
              value={newSpecification.name}
              onChange={(e) => setNewSpecification({...newSpecification, name: e.target.value})}
              className="text-base"
            />
            <Input
              placeholder="Value"
              value={newSpecification.value}
              onChange={(e) => setNewSpecification({...newSpecification, value: e.target.value})}
              className="text-base"
            />
            <Input
              placeholder="Group (optional)"
              value={newSpecification.group}
              onChange={(e) => setNewSpecification({...newSpecification, group: e.target.value})}
              className="text-base"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (newSpecification.name && newSpecification.value) {
                  const updatedSpecs = [...safeFormData.equipmentDetails.specifications, { ...newSpecification }];
                  handleChange('equipmentDetails.specifications', updatedSpecs);
                  setNewSpecification({ name: '', value: '', group: '' });
                }
              }}
              disabled={!newSpecification.name.trim() || !newSpecification.value.trim()}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Existing Specifications */}
          {safeFormData.equipmentDetails.specifications.length > 0 && (
            <div className="space-y-2">
              {safeFormData.equipmentDetails.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{spec.name}: </span>
                    <span className="text-gray-600 dark:text-gray-400">{spec.value}</span>
                    {spec.group && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({spec.group})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedSpecs = safeFormData.equipmentDetails.specifications.filter((_, i) => i !== index);
                      handleChange('equipmentDetails.specifications', updatedSpecs);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Business Details (for others -> business-sale)
  if (safeFormData.productType === 'others' && safeFormData.subProductType === 'business-sale') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <ComputerDesktopIcon className="h-6 w-6 mr-2 text-primary-500" />
            Business Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Provide information about the business for sale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Business Type *"
            value={safeFormData.businessDetails.businessType}
            onChange={(e) => handleChange('businessDetails.businessType', e.target.value)}
            placeholder="e.g., Restaurant, Retail Store, Manufacturing"
            className="text-base"
          />
          <Input
            label="Established Year"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={safeFormData.businessDetails.establishedYear}
            onChange={(e) => handleChange('businessDetails.establishedYear', e.target.value)}
            placeholder="2010"
            className="text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Annual Revenue (ETB)"
            type="number"
            min="0"
            value={safeFormData.businessDetails.annualRevenue}
            onChange={(e) => handleChange('businessDetails.annualRevenue', e.target.value)}
            placeholder="1000000"
            className="text-base"
          />
          <Input
            label="Number of Employees"
            type="number"
            min="0"
            value={safeFormData.businessDetails.employees}
            onChange={(e) => handleChange('businessDetails.employees', e.target.value)}
            placeholder="10"
            className="text-base"
          />
        </div>
      </div>
    );
  }

  // General Product Details (for others category - electronics, furniture, etc.)
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
          <ComputerDesktopIcon className="h-6 w-6 mr-2 text-primary-500" />
          Product Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Provide specific information about your product.
        </p>
      </div>

      {/* Inventory Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Inventory Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="SKU (Stock Keeping Unit)"
            value={safeFormData.inventory.sku}
            onChange={(e) => handleChange('inventory.sku', e.target.value)}
            placeholder="PROD-001"
            helper="Unique identifier for this product"
            className="text-base"
          />
          <Input
            label="Stock Quantity"
            type="number"
            min="0"
            value={safeFormData.inventory.stock}
            onChange={(e) => handleChange('inventory.stock', e.target.value)}
            placeholder="10"
            className="text-base"
          />
          <Input
            label="Low Stock Threshold"
            type="number"
            min="0"
            value={safeFormData.inventory.lowStockThreshold}
            onChange={(e) => handleChange('inventory.lowStockThreshold', e.target.value)}
            placeholder="5"
            helper="Alert when stock falls below this level"
            className="text-base"
          />
        </div>

        <div className="flex items-start space-x-6">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="trackInventory"
              checked={safeFormData.inventory.trackInventory}
              onChange={(e) => handleChange('inventory.trackInventory', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="ml-3">
              <label htmlFor="trackInventory" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Track inventory levels
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monitor stock levels and get low stock alerts
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="allowBackorders"
              checked={safeFormData.inventory.allowBackorders}
              onChange={(e) => handleChange('inventory.allowBackorders', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="ml-3">
              <label htmlFor="allowBackorders" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Allow backorders
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Accept orders when out of stock
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Specifications</h3>

        {/* Add New Specification */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Input
            placeholder="Specification name"
            value={newSpecification.name}
            onChange={(e) => setNewSpecification({...newSpecification, name: e.target.value})}
            className="text-base"
          />
          <Input
            placeholder="Value"
            value={newSpecification.value}
            onChange={(e) => setNewSpecification({...newSpecification, value: e.target.value})}
            className="text-base"
          />
          <Input
            placeholder="Group (optional)"
            value={newSpecification.group}
            onChange={(e) => setNewSpecification({...newSpecification, group: e.target.value})}
            className="text-base"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addSpecification}
            disabled={!newSpecification.name.trim() || !newSpecification.value.trim()}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Existing Specifications */}
        {safeFormData.specifications.length > 0 && (
          <div className="space-y-2">
            {safeFormData.specifications.map((spec, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{spec.name}: </span>
                  <span className="text-gray-600 dark:text-gray-400">{spec.value}</span>
                  {spec.group && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({spec.group})</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warranty */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Warranty</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Duration"
            type="number"
            min="0"
            value={safeFormData.warranty.duration}
            onChange={(e) => handleChange('warranty.duration', e.target.value)}
            placeholder="12"
            className="text-base"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unit
            </label>
            <select
              value={safeFormData.warranty.unit}
              onChange={(e) => handleChange('warranty.unit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            >
              <option value="days">Days</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={safeFormData.warranty.type}
              onChange={(e) => handleChange('warranty.type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
            >
              <option value="manufacturer">Manufacturer</option>
              <option value="seller">Seller</option>
              <option value="none">No Warranty</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Warranty Description
          </label>
          <textarea
            value={safeFormData.warranty.description}
            onChange={(e) => handleChange('warranty.description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base resize-none"
            placeholder="Describe what the warranty covers..."
          />
        </div>
      </div>

      {/* Shipping Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Shipping Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Weight (kg)"
            type="number"
            min="0"
            step="0.1"
            value={safeFormData.shipping.weight}
            onChange={(e) => handleChange('shipping.weight', e.target.value)}
            placeholder="0.5"
            className="text-base"
          />

          <Input
            label="Shipping Class"
            value={safeFormData.shipping.shippingClass}
            onChange={(e) => handleChange('shipping.shippingClass', e.target.value)}
            placeholder="Standard"
            className="text-base"
          />

          <Input
            label="Shipping Cost (ETB)"
            type="number"
            min="0"
            value={safeFormData.shipping.shippingCost}
            onChange={(e) => handleChange('shipping.shippingCost', e.target.value)}
            placeholder="100"
            className="text-base"
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dimensions (cm)
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Length"
              type="number"
              min="0"
              step="0.1"
              value={safeFormData.shipping.dimensions.length}
              onChange={(e) => handleChange('shipping.dimensions', {
                ...safeFormData.shipping.dimensions,
                length: e.target.value
              })}
              placeholder="10"
              className="text-base"
            />
            <Input
              label="Width"
              type="number"
              min="0"
              step="0.1"
              value={safeFormData.shipping.dimensions.width}
              onChange={(e) => handleChange('shipping.dimensions', {
                ...safeFormData.shipping.dimensions,
                width: e.target.value
              })}
              placeholder="10"
              className="text-base"
            />
            <Input
              label="Height"
              type="number"
              min="0"
              step="0.1"
              value={safeFormData.shipping.dimensions.height}
              onChange={(e) => handleChange('shipping.dimensions', {
                ...safeFormData.shipping.dimensions,
                height: e.target.value
              })}
              placeholder="10"
              className="text-base"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="freeShipping"
            checked={safeFormData.shipping.freeShipping}
            onChange={(e) => handleChange('shipping.freeShipping', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="freeShipping" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Free shipping available
          </label>
        </div>
      </div>

      {/* Return Policy */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Return Policy</h3>
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="returnable"
            checked={safeFormData.returnPolicy.returnable}
            onChange={(e) => handleChange('returnPolicy.returnable', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="returnable" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Returns accepted
          </label>
        </div>

        {safeFormData.returnPolicy.returnable && (
          <Input
            label="Return Period (days)"
            type="number"
            min="1"
            max="365"
            value={safeFormData.returnPolicy.returnPeriod}
            onChange={(e) => handleChange('returnPolicy.returnPeriod', e.target.value)}
            placeholder="30"
            className="text-base"
          />
        )}
      </div>
    </div>
  );
};

export default DetailsStep;