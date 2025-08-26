// components/dashboard/form-steps/LocationContactStep.jsx
import { useState } from 'react';
import Input from '../../ui/Input';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  PlusIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Default config values if not imported
const ETHIOPIAN_CITIES = [
  'Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Mekelle', 'Adama', 'Awasa', 
  'Jimma', 'Dessie', 'Gondar', 'Harar', 'Jijiga', 'Shashamane', 'Arba Minch'
];

const TIME_SLOTS = [
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' }
];

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' }
];

const LocationContactStep = ({ formData = {}, errors = {}, onChange }) => {
  const [newLandmark, setNewLandmark] = useState('');
  const [newFacility, setNewFacility] = useState({ type: '', name: '', distance: '' });

  const isRealEstate = ['homes', 'plots', 'commercials'].includes(formData.productType);

  // Enhanced safe access with comprehensive defaults
  const safeFormData = {
    ...formData,
    propertyDetails: {
      ...formData.propertyDetails,
      location: {
        address: '',
        city: 'Addis Ababa',
        subcity: '',
        woreda: '',
        kebele: '',
        region: 'Addis Ababa',
        country: 'Ethiopia',
        zipCode: '',
        landmarks: [],
        nearbyFacilities: [],
        ...formData.propertyDetails?.location
      }
    },
    contactInfo: {
      phone: '',
      email: '',
      whatsapp: '',
      preferredContactMethod: 'phone',
      ...formData.contactInfo
    },
    viewingDetails: {
      allowViewings: true,
      viewingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      viewingHours: {
        start: '09:00',
        end: '17:00'
      },
      viewingRequirements: [],
      ...formData.viewingDetails
    }
  };

  // Ensure arrays are always arrays
  const landmarks = Array.isArray(safeFormData.propertyDetails.location.landmarks) 
    ? safeFormData.propertyDetails.location.landmarks 
    : [];
    
  const nearbyFacilities = Array.isArray(safeFormData.propertyDetails.location.nearbyFacilities)
    ? safeFormData.propertyDetails.location.nearbyFacilities
    : [];

  const viewingDays = Array.isArray(safeFormData.viewingDetails.viewingDays)
    ? safeFormData.viewingDetails.viewingDays
    : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const keys = field.split('.');
      let updated = { ...formData };
      let current = updated;

      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]] = { ...current[keys[i]] };
      }
      
      // Set the value
      current[keys[keys.length - 1]] = value;
      onChange(updated);
    } else {
      onChange({ [field]: value });
    }
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

    const currentArray = Array.isArray(current[keys[keys.length - 1]]) 
      ? current[keys[keys.length - 1]] 
      : [];
    current[keys[keys.length - 1]] = [...currentArray, value];

    onChange(updated);
    if (setterFunction) setterFunction('');
  };

  const removeFromArray = (arrayPath, index) => {
    const keys = arrayPath.split('.');
    let updated = { ...formData };
    let current = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] = { ...current[keys[i]] };
    }

    const currentArray = Array.isArray(current[keys[keys.length - 1]]) 
      ? current[keys[keys.length - 1]] 
      : [];
    current[keys[keys.length - 1]] = currentArray.filter((_, i) => i !== index);

    onChange(updated);
  };

  const facilityTypes = [
    'school', 'hospital', 'market', 'bank', 'restaurant', 'shopping-mall', 
    'gas-station', 'pharmacy', 'police-station', 'church', 'mosque', 'park'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {isRealEstate ? 'Location & Contact Information' : 'Contact Information'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isRealEstate 
            ? 'Provide property location details and your contact information.'
            : 'Provide your contact information for potential buyers.'
          }
        </p>
      </div>

      {/* Location Details (for real estate) */}
      {isRealEstate && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPinIcon className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Property Location
            </h3>
          </div>

          {/* Address */}
          <div>
            <Input
              label="Street Address *"
              value={safeFormData.propertyDetails.location.address || ''}
              onChange={(e) => handleChange('propertyDetails.location.address', e.target.value)}
              error={errors['propertyDetails.location.address']}
              placeholder="e.g., Bole, near Edna Mall, behind Friendship Hotel"
              helper="Provide specific address or area description to help buyers find the property"
              className="text-base"
            />
          </div>

          {/* City and Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City *
              </label>
              <select
                value={safeFormData.propertyDetails.location.city || 'Addis Ababa'}
                onChange={(e) => handleChange('propertyDetails.location.city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
              >
                {ETHIOPIAN_CITIES.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors['propertyDetails.location.city'] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors['propertyDetails.location.city']}
                </p>
              )}
            </div>

            <Input
              label="Region/State"
              value={safeFormData.propertyDetails.location.region || ''}
              onChange={(e) => handleChange('propertyDetails.location.region', e.target.value)}
              placeholder="e.g., Addis Ababa, Oromia"
              className="text-base"
            />
          </div>

          {/* Detailed Location (Addis Ababa specific) */}
          {safeFormData.propertyDetails.location.city === 'Addis Ababa' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Subcity"
                value={safeFormData.propertyDetails.location.subcity || ''}
                onChange={(e) => handleChange('propertyDetails.location.subcity', e.target.value)}
                placeholder="e.g., Bole, Yeka, Kirkos"
                className="text-base"
              />
              <Input
                label="Woreda"
                value={safeFormData.propertyDetails.location.woreda || ''}
                onChange={(e) => handleChange('propertyDetails.location.woreda', e.target.value)}
                placeholder="e.g., 03, 07, 12"
                className="text-base"
              />
              <Input
                label="Kebele"
                value={safeFormData.propertyDetails.location.kebele || ''}
                onChange={(e) => handleChange('propertyDetails.location.kebele', e.target.value)}
                placeholder="e.g., 14, 25, 08"
                className="text-base"
              />
            </div>
          )}

          {/* Landmarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Landmarks
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add nearby landmark"
                value={newLandmark}
                onChange={(e) => setNewLandmark(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('propertyDetails.location.landmarks', newLandmark, setNewLandmark);
                  }
                }}
                className="text-base"
              />
              <button
                type="button"
                onClick={() => addToArray('propertyDetails.location.landmarks', newLandmark, setNewLandmark)}
                disabled={!newLandmark.trim()}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>

            {landmarks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {landmarks.map((landmark, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  >
                    {landmark}
                    <button
                      type="button"
                      onClick={() => removeFromArray('propertyDetails.location.landmarks', index)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Nearby Facilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Nearby Facilities
            </label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
              <select
                value={newFacility.type}
                onChange={(e) => setNewFacility({...newFacility, type: e.target.value})}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
              >
                <option value="">Facility type</option>
                {facilityTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Facility name"
                value={newFacility.name}
                onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                className="text-base"
              />
              <Input
                placeholder="Distance (m)"
                type="number"
                value={newFacility.distance}
                onChange={(e) => setNewFacility({...newFacility, distance: e.target.value})}
                className="text-base"
              />
              <button
                type="button"
                onClick={() => {
                  if (newFacility.type && newFacility.name) {
                    addToArray('propertyDetails.location.nearbyFacilities', {
                      type: newFacility.type,
                      name: newFacility.name,
                      distance: parseInt(newFacility.distance) || 0
                    });
                    setNewFacility({ type: '', name: '', distance: '' });
                  }
                }}
                disabled={!newFacility.type || !newFacility.name}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>

            {nearbyFacilities.length > 0 && (
              <div className="space-y-2">
                {nearbyFacilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {facility.name || 'Unnamed Facility'}
                      </span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        ({(facility.type || '').replace('-', ' ')})
                      </span>
                      {facility.distance > 0 && (
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          - {facility.distance}m away
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromArray('propertyDetails.location.nearbyFacilities', index)}
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
      )}

      {/* Contact Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <PhoneIcon className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Contact Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number *"
            type="tel"
            value={safeFormData.contactInfo.phone || ''}
            onChange={(e) => handleChange('contactInfo.phone', e.target.value)}
            error={errors['contactInfo.phone'] || errors.contactInfo}
            placeholder="+251 911 123 456"
            leftIcon={<PhoneIcon className="h-4 w-4" />}
            className="text-base"
          />

          <Input
            label="Email Address"
            type="email"
            value={safeFormData.contactInfo.email || ''}
            onChange={(e) => handleChange('contactInfo.email', e.target.value)}
            placeholder="your.email@example.com"
            leftIcon={<EnvelopeIcon className="h-4 w-4" />}
            className="text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="WhatsApp Number"
            type="tel"
            value={safeFormData.contactInfo.whatsapp || ''}
            onChange={(e) => handleChange('contactInfo.whatsapp', e.target.value)}
            placeholder="+251 911 123 456"
            helper="Can be the same as phone number"
            className="text-base"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preferred Contact Method
            </label>
            <select
              value={safeFormData.contactInfo.preferredContactMethod || 'phone'}
              onChange={(e) => handleChange('contactInfo.preferredContactMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
            >
              <option value="phone">Phone Call</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="any">Any Method</option>
            </select>
          </div>
        </div>
      </div>

      {/* Viewing Details (for real estate) */}
      {isRealEstate && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <ClockIcon className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Viewing Arrangements
            </h3>
          </div>

          {/* Allow Viewings */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="allowViewings"
              checked={safeFormData.viewingDetails.allowViewings || false}
              onChange={(e) => handleChange('viewingDetails.allowViewings', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="ml-3">
              <label htmlFor="allowViewings" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Allow property viewings
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable potential buyers/tenants to schedule property visits
              </p>
            </div>
          </div>

          {safeFormData.viewingDetails.allowViewings && (
            <>
              {/* Viewing Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Available Days
                </label>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                  {DAYS_OF_WEEK.map(day => (
                    <label
                      key={day.value}
                      className="flex items-center space-x-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={viewingDays.includes(day.label.toLowerCase())}
                        onChange={(e) => {
                          const currentDays = viewingDays;
                          const dayName = day.label.toLowerCase();
                          if (e.target.checked) {
                            handleChange('viewingDetails.viewingDays', [...currentDays, dayName]);
                          } else {
                            handleChange('viewingDetails.viewingDays', currentDays.filter(d => d !== dayName));
                          }
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {day.short}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Viewing Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <select
                    value={safeFormData.viewingDetails.viewingHours?.start || '09:00'}
                    onChange={(e) => handleChange('viewingDetails.viewingHours', {
                      ...safeFormData.viewingDetails.viewingHours,
                      start: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <select
                    value={safeFormData.viewingDetails.viewingHours?.end || '17:00'}
                    onChange={(e) => handleChange('viewingDetails.viewingHours', {
                      ...safeFormData.viewingDetails.viewingHours,
                      end: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationContactStep;