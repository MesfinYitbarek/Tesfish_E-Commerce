import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  UserIcon,
  PencilIcon,
  CameraIcon,
  MapPinIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ETHIOPIAN_CITIES, BUSINESS_CATEGORIES } from '../../constants';
import { toast } from 'react-hot-toast';

// Redux imports
import {
  getCurrentProfile,
  updateCompanyProfile,
  updateIndividualProfile,
  updateCustomerProfile,
  updateNotificationSettings,
  selectProfile,
  selectIsLoading,
  selectIsUpdating,
  selectUpdateError,
  selectUpdateSuccess,
  selectProfileCompletion,
  clearError,
  clearUpdateSuccess
} from '../../store/slices/profileSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const isLoading = useSelector(selectIsLoading);
  const isUpdating = useSelector(selectIsUpdating);
  const updateError = useSelector(selectUpdateError);
  const updateSuccess = useSelector(selectUpdateSuccess);
  const profileCompletion = useSelector(selectProfileCompletion);
  
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Form data structure based on user type
  const [formData, setFormData] = useState({
    // Company Profile Fields
    companyProfile: {
      companyName: '',
      registrationNumber: '',
      establishedYear: '',
      description: '',
      website: '',
      businessCategories: [],
      address: {
        street: '',
        city: 'Addis Ababa',
        state: '',
        country: 'Ethiopia',
        zipCode: ''
      },
      contactInfo: {
        phone: '',
        alternatePhone: '',
        whatsapp: '',
        telegram: '',
        email: ''
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: ''
      },
      certifications: [],
      licenses: [],
      businessHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '17:00', closed: false },
        sunday: { open: '09:00', close: '17:00', closed: true }
      }
    },
    
    // Individual Profile Fields
    individualProfile: {
      firstName: '',
      lastName: '',
      phone: '',
      alternatePhone: '',
      dateOfBirth: '',
      gender: '',
      address: {
        street: '',
        city: 'Addis Ababa',
        state: '',
        country: 'Ethiopia',
        zipCode: ''
      },
      idDocument: {
        type: '',
        number: ''
      },
      sellingCategories: []
    },
    
    // Customer Profile Fields
    customerProfile: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      addresses: [{
        label: 'home',
        street: '',
        city: 'Addis Ababa',
        state: '',
        country: 'Ethiopia',
        zipCode: '',
        isDefault: true
      }],
      preferences: {
        categories: [],
        priceRange: {
          min: 0,
          max: 1000000
        },
        brands: [],
        notifications: {
          newProducts: true,
          priceDrops: true,
          orderUpdates: true,
          promotions: false
        }
      }
    },
    
    // Common fields
    notificationSettings: {
      email: true,
      sms: false,
      push: true
    }
  });

  const [errors, setErrors] = useState({});

  // Load profile data on component mount
  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  // Clear errors and success messages
  useEffect(() => {
    if (updateError) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [updateError, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      const timer = setTimeout(() => dispatch(clearUpdateSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  // Populate form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        companyProfile: {
          ...prev.companyProfile,
          ...profile.companyProfile,
          address: {
            ...prev.companyProfile.address,
            ...profile.companyProfile?.address
          },
          contactInfo: {
            ...prev.companyProfile.contactInfo,
            ...profile.companyProfile?.contactInfo
          },
          socialMedia: {
            ...prev.companyProfile.socialMedia,
            ...profile.companyProfile?.socialMedia
          },
          businessHours: {
            ...prev.companyProfile.businessHours,
            ...profile.companyProfile?.businessHours
          }
        },
        individualProfile: {
          ...prev.individualProfile,
          ...profile.individualProfile,
          address: {
            ...prev.individualProfile.address,
            ...profile.individualProfile?.address
          },
          idDocument: {
            ...prev.individualProfile.idDocument,
            ...profile.individualProfile?.idDocument
          }
        },
        customerProfile: {
          ...prev.customerProfile,
          ...profile.customerProfile,
          addresses: profile.customerProfile?.addresses?.length > 0 
            ? profile.customerProfile.addresses 
            : prev.customerProfile.addresses,
          preferences: {
            ...prev.customerProfile.preferences,
            ...profile.customerProfile?.preferences,
            notifications: {
              ...prev.customerProfile.preferences.notifications,
              ...profile.customerProfile?.preferences?.notifications
            }
          }
        },
        notificationSettings: {
          ...prev.notificationSettings,
          ...profile.notificationSettings
        }
      }));
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    const fieldParts = field.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < fieldParts.length - 1; i++) {
        if (!current[fieldParts[i]]) {
          current[fieldParts[i]] = {};
        }
        current = current[fieldParts[i]];
      }
      
      current[fieldParts[fieldParts.length - 1]] = value;
      return newData;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field, value, index = null) => {
    setFormData(prev => {
      const fieldParts = field.split('.');
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < fieldParts.length - 1; i++) {
        current = current[fieldParts[i]];
      }
      
      const arrayField = fieldParts[fieldParts.length - 1];
      
      if (index !== null) {
        // Update specific index
        current[arrayField] = [...current[arrayField]];
        current[arrayField][index] = value;
      } else {
        // Add/remove from array
        const currentArray = current[arrayField] || [];
        if (currentArray.includes(value)) {
          current[arrayField] = currentArray.filter(item => item !== value);
        } else {
          current[arrayField] = [...currentArray, value];
        }
      }
      
      return newData;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (profile?.userType === 'company') {
      if (!formData.companyProfile.companyName?.trim()) {
        newErrors['companyProfile.companyName'] = 'Company name is required';
      }
      if (!formData.companyProfile.contactInfo.phone?.trim()) {
        newErrors['companyProfile.contactInfo.phone'] = 'Phone number is required';
      }
      if (formData.companyProfile.website && !formData.companyProfile.website.startsWith('http')) {
        newErrors['companyProfile.website'] = 'Website must start with http:// or https://';
      }
    } else if (profile?.userType === 'individual') {
      if (!formData.individualProfile.firstName?.trim()) {
        newErrors['individualProfile.firstName'] = 'First name is required';
      }
      if (!formData.individualProfile.lastName?.trim()) {
        newErrors['individualProfile.lastName'] = 'Last name is required';
      }
      if (!formData.individualProfile.phone?.trim()) {
        newErrors['individualProfile.phone'] = 'Phone number is required';
      }
    } else if (profile?.userType === 'customer') {
      if (!formData.customerProfile.firstName?.trim()) {
        newErrors['customerProfile.firstName'] = 'First name is required';
      }
      if (!formData.customerProfile.lastName?.trim()) {
        newErrors['customerProfile.lastName'] = 'Last name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const userId = profile._id;
      
      if (profile.userType === 'company') {
        await dispatch(updateCompanyProfile({
          userId,
          companyData: formData.companyProfile,
          logo: avatarFile
        })).unwrap();
      } else if (profile.userType === 'individual') {
        await dispatch(updateIndividualProfile({
          userId,
          individualData: formData.individualProfile,
          avatar: avatarFile
        })).unwrap();
      } else if (profile.userType === 'customer') {
        await dispatch(updateCustomerProfile({
          userId,
          customerData: formData.customerProfile,
          avatar: avatarFile
        })).unwrap();
      }

      // Update notification settings
      await dispatch(updateNotificationSettings({
        userId,
        settings: formData.notificationSettings
      })).unwrap();

    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Image size must be less than 5MB');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setAvatarFile(null);
    setAvatarPreview(null);
    
    // Reset form data to original profile data
    if (profile) {
      setFormData(prev => ({
        ...prev,
        companyProfile: {
          ...prev.companyProfile,
          ...profile.companyProfile
        },
        individualProfile: {
          ...prev.individualProfile,
          ...profile.individualProfile
        },
        customerProfile: {
          ...prev.customerProfile,
          ...profile.customerProfile
        },
        notificationSettings: {
          ...prev.notificationSettings,
          ...profile.notificationSettings
        }
      }));
    }
  };

  const getProfileData = () => {
    if (!profile) return {};
    
    switch (profile.userType) {
      case 'company':
        return profile.companyProfile || {};
      case 'individual':
        return profile.individualProfile || {};
      case 'customer':
        return profile.customerProfile || {};
      default:
        return {};
    }
  };

  const getCurrentAvatar = () => {
    const profileData = getProfileData();
    if (avatarPreview) return avatarPreview;
    
    switch (profile?.userType) {
      case 'company':
        return profileData.logo;
      case 'individual':
      case 'customer':
        return profileData.avatar;
      default:
        return null;
    }
  };

  const getDisplayName = () => {
    const profileData = getProfileData();
    
    switch (profile?.userType) {
      case 'company':
        return profileData.companyName || 'Company Name';
      case 'individual':
      case 'customer':
        return `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'User Name';
      default:
        return 'User';
    }
  };

  const renderCompanyForm = () => (
    <>
      {/* Company Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Company Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name *"
            value={formData.companyProfile.companyName}
            onChange={(e) => handleInputChange('companyProfile.companyName', e.target.value)}
            error={errors['companyProfile.companyName']}
            disabled={!isEditing}
          />
          <Input
            label="Registration Number"
            value={formData.companyProfile.registrationNumber}
            onChange={(e) => handleInputChange('companyProfile.registrationNumber', e.target.value)}
            disabled={!isEditing}
          />
          <Input
            label="Established Year"
            type="number"
            value={formData.companyProfile.establishedYear}
            onChange={(e) => handleInputChange('companyProfile.establishedYear', e.target.value)}
            disabled={!isEditing}
            min="1900"
            max={new Date().getFullYear()}
          />
          <Input
            label="Website"
            type="url"
            value={formData.companyProfile.website}
            onChange={(e) => handleInputChange('companyProfile.website', e.target.value)}
            error={errors['companyProfile.website']}
            disabled={!isEditing}
            placeholder="https://your-website.com"
            leftIcon={<GlobeAltIcon className="h-4 w-4" />}
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Description
          </label>
          <textarea
            value={formData.companyProfile.description}
            onChange={(e) => handleInputChange('companyProfile.description', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            placeholder="Describe your company, services, and what makes you unique..."
            maxLength={1000}
          />
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Company overview for your profile
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formData.companyProfile.description?.length || 0}/1000
            </span>
          </div>
        </div>

        {/* Business Categories */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Business Categories
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BUSINESS_CATEGORIES.map(category => (
              <label key={category.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.companyProfile.businessCategories?.includes(category.value)}
                  onChange={() => handleArrayChange('companyProfile.businessCategories', category.value)}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{category.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Primary Phone *"
            type="tel"
            value={formData.companyProfile.contactInfo.phone}
            onChange={(e) => handleInputChange('companyProfile.contactInfo.phone', e.target.value)}
            error={errors['companyProfile.contactInfo.phone']}
            disabled={!isEditing}
            placeholder="+251 911 234 567"
          />
          <Input
            label="Alternative Phone"
            type="tel"
            value={formData.companyProfile.contactInfo.alternatePhone}
            onChange={(e) => handleInputChange('companyProfile.contactInfo.alternatePhone', e.target.value)}
            disabled={!isEditing}
            placeholder="+251 911 234 567"
          />
          <Input
            label="WhatsApp"
            type="tel"
            value={formData.companyProfile.contactInfo.whatsapp}
            onChange={(e) => handleInputChange('companyProfile.contactInfo.whatsapp', e.target.value)}
            disabled={!isEditing}
            placeholder="+251 911 234 567"
          />
          <Input
            label="Telegram"
            value={formData.companyProfile.contactInfo.telegram}
            onChange={(e) => handleInputChange('companyProfile.contactInfo.telegram', e.target.value)}
            disabled={!isEditing}
            placeholder="@username or phone number"
          />
          <Input
            label="Contact Email"
            type="email"
            value={formData.companyProfile.contactInfo.email}
            onChange={(e) => handleInputChange('companyProfile.contactInfo.email', e.target.value)}
            disabled={!isEditing}
            placeholder="contact@company.com"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Business Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={formData.companyProfile.address.street}
              onChange={(e) => handleInputChange('companyProfile.address.street', e.target.value)}
              disabled={!isEditing}
              placeholder="Building name, street address, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <select
              value={formData.companyProfile.address.city}
              onChange={(e) => handleInputChange('companyProfile.address.city', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {ETHIOPIAN_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <Input
            label="State/Region"
            value={formData.companyProfile.address.state}
            onChange={(e) => handleInputChange('companyProfile.address.state', e.target.value)}
            disabled={!isEditing}
            placeholder="e.g., Addis Ababa"
          />
          <Input
            label="ZIP Code"
            value={formData.companyProfile.address.zipCode}
            onChange={(e) => handleInputChange('companyProfile.address.zipCode', e.target.value)}
            disabled={!isEditing}
            placeholder="12345"
          />
          <Input
            label="Country"
            value={formData.companyProfile.address.country}
            onChange={(e) => handleInputChange('companyProfile.address.country', e.target.value)}
            disabled={!isEditing}
            placeholder="Ethiopia"
          />
        </div>
      </div>

      {/* Social Media */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Facebook"
            value={formData.companyProfile.socialMedia.facebook}
            onChange={(e) => handleInputChange('companyProfile.socialMedia.facebook', e.target.value)}
            disabled={!isEditing}
            placeholder="https://facebook.com/yourcompany"
          />
          <Input
            label="Instagram"
            value={formData.companyProfile.socialMedia.instagram}
            onChange={(e) => handleInputChange('companyProfile.socialMedia.instagram', e.target.value)}
            disabled={!isEditing}
            placeholder="https://instagram.com/yourcompany"
          />
          <Input
            label="Twitter"
            value={formData.companyProfile.socialMedia.twitter}
            onChange={(e) => handleInputChange('companyProfile.socialMedia.twitter', e.target.value)}
            disabled={!isEditing}
            placeholder="https://twitter.com/yourcompany"
          />
          <Input
            label="LinkedIn"
            value={formData.companyProfile.socialMedia.linkedin}
            onChange={(e) => handleInputChange('companyProfile.socialMedia.linkedin', e.target.value)}
            disabled={!isEditing}
            placeholder="https://linkedin.com/company/yourcompany"
          />
          <Input
            label="YouTube"
            value={formData.companyProfile.socialMedia.youtube}
            onChange={(e) => handleInputChange('companyProfile.socialMedia.youtube', e.target.value)}
            disabled={!isEditing}
            placeholder="https://youtube.com/channel/yourchannel"
          />
        </div>
      </div>
    </>
  );

  const renderIndividualForm = () => (
    <>
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name *"
            value={formData.individualProfile.firstName}
            onChange={(e) => handleInputChange('individualProfile.firstName', e.target.value)}
            error={errors['individualProfile.firstName']}
            disabled={!isEditing}
          />
          <Input
            label="Last Name *"
            value={formData.individualProfile.lastName}
            onChange={(e) => handleInputChange('individualProfile.lastName', e.target.value)}
            error={errors['individualProfile.lastName']}
            disabled={!isEditing}
          />
          <Input
            label="Phone *"
            type="tel"
            value={formData.individualProfile.phone}
            onChange={(e) => handleInputChange('individualProfile.phone', e.target.value)}
            error={errors['individualProfile.phone']}
            disabled={!isEditing}
            placeholder="+251 911 234 567"
          />
          <Input
            label="Alternative Phone"
            type="tel"
            value={formData.individualProfile.alternatePhone}
            onChange={(e) => handleInputChange('individualProfile.alternatePhone', e.target.value)}
            disabled={!isEditing}
            placeholder="+251 911 234 567"
          />
          <Input
            label="Date of Birth"
            type="date"
            value={formData.individualProfile.dateOfBirth}
            onChange={(e) => handleInputChange('individualProfile.dateOfBirth', e.target.value)}
            disabled={!isEditing}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={formData.individualProfile.gender}
              onChange={(e) => handleInputChange('individualProfile.gender', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={formData.individualProfile.address.street}
              onChange={(e) => handleInputChange('individualProfile.address.street', e.target.value)}
              disabled={!isEditing}
              placeholder="Building name, street address, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <select
              value={formData.individualProfile.address.city}
              onChange={(e) => handleInputChange('individualProfile.address.city', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {ETHIOPIAN_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <Input
            label="State/Region"
            value={formData.individualProfile.address.state}
            onChange={(e) => handleInputChange('individualProfile.address.state', e.target.value)}
            disabled={!isEditing}
            placeholder="e.g., Addis Ababa"
          />
          <Input
            label="ZIP Code"
            value={formData.individualProfile.address.zipCode}
            onChange={(e) => handleInputChange('individualProfile.address.zipCode', e.target.value)}
            disabled={!isEditing}
            placeholder="12345"
          />
          <Input
            label="Country"
            value={formData.individualProfile.address.country}
            onChange={(e) => handleInputChange('individualProfile.address.country', e.target.value)}
            disabled={!isEditing}
            placeholder="Ethiopia"
          />
        </div>
      </div>

      {/* ID Document */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Identity Document
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Type
            </label>
            <select
              value={formData.individualProfile.idDocument.type}
              onChange={(e) => handleInputChange('individualProfile.idDocument.type', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              <option value="">Select document type</option>
              <option value="passport">Passport</option>
              <option value="nationalId">National ID</option>
              <option value="drivingLicense">Driving License</option>
            </select>
          </div>
          <Input
            label="Document Number"
            value={formData.individualProfile.idDocument.number}
            onChange={(e) => handleInputChange('individualProfile.idDocument.number', e.target.value)}
            disabled={!isEditing}
            placeholder="Enter document number"
          />
        </div>
      </div>

      {/* Selling Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Selling Categories
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Select the categories of products you typically sell
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {BUSINESS_CATEGORIES.map(category => (
            <label key={category.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.individualProfile.sellingCategories?.includes(category.value)}
                onChange={() => handleArrayChange('individualProfile.sellingCategories', category.value)}
                disabled={!isEditing}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{category.label}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  const renderCustomerForm = () => (
    <>
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name *"
            value={formData.customerProfile.firstName}
            onChange={(e) => handleInputChange('customerProfile.firstName', e.target.value)}
            error={errors['customerProfile.firstName']}
            disabled={!isEditing}
          />
          <Input
            label="Last Name *"
            value={formData.customerProfile.lastName}
            onChange={(e) => handleInputChange('customerProfile.lastName', e.target.value)}
            error={errors['customerProfile.lastName']}
            disabled={!isEditing}
          />
          <Input
            label="Phone"
            type="tel"
            value={formData.customerProfile.phone}
            onChange={(e) => handleInputChange('customerProfile.phone', e.target.value)}
            disabled={!isEditing}
            placeholder="+251 911 234 567"
          />
          <Input
            label="Date of Birth"
            type="date"
            value={formData.customerProfile.dateOfBirth}
            onChange={(e) => handleInputChange('customerProfile.dateOfBirth', e.target.value)}
            disabled={!isEditing}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={formData.customerProfile.gender}
              onChange={(e) => handleInputChange('customerProfile.gender', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Default Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address Label
            </label>
            <select
              value={formData.customerProfile.addresses[0]?.label}
              onChange={(e) => handleArrayChange('customerProfile.addresses', 
                { ...formData.customerProfile.addresses[0], label: e.target.value }, 0)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div></div>
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={formData.customerProfile.addresses[0]?.street}
              onChange={(e) => handleArrayChange('customerProfile.addresses', 
                { ...formData.customerProfile.addresses[0], street: e.target.value }, 0)}
              disabled={!isEditing}
              placeholder="Building name, street address, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <select
              value={formData.customerProfile.addresses[0]?.city}
              onChange={(e) => handleArrayChange('customerProfile.addresses', 
                { ...formData.customerProfile.addresses[0], city: e.target.value }, 0)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {ETHIOPIAN_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <Input
            label="State/Region"
            value={formData.customerProfile.addresses[0]?.state}
            onChange={(e) => handleArrayChange('customerProfile.addresses', 
              { ...formData.customerProfile.addresses[0], state: e.target.value }, 0)}
            disabled={!isEditing}
            placeholder="e.g., Addis Ababa"
          />
        </div>
      </div>

      {/* Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Shopping Preferences
        </h3>
        
        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Price Range (ETB)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimum"
              type="number"
              value={formData.customerProfile.preferences.priceRange.min}
              onChange={(e) => handleInputChange('customerProfile.preferences.priceRange.min', parseInt(e.target.value) || 0)}
              disabled={!isEditing}
              placeholder="0"
            />
            <Input
              label="Maximum"
              type="number"
              value={formData.customerProfile.preferences.priceRange.max}
              onChange={(e) => handleInputChange('customerProfile.preferences.priceRange.max', parseInt(e.target.value) || 1000000)}
              disabled={!isEditing}
              placeholder="1000000"
            />
          </div>
        </div>

        {/* Preferred Categories */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preferred Categories
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BUSINESS_CATEGORIES.map(category => (
              <label key={category.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.customerProfile.preferences.categories?.includes(category.value)}
                  onChange={() => handleArrayChange('customerProfile.preferences.categories', category.value)}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Notification Preferences
          </label>
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="newProducts"
                checked={formData.customerProfile.preferences.notifications.newProducts}
                onChange={(e) => handleInputChange('customerProfile.preferences.notifications.newProducts', e.target.checked)}
                disabled={!isEditing}
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
              />
              <div className="ml-3">
                <label htmlFor="newProducts" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Products
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when new products in your preferred categories are listed
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="priceDrops"
                checked={formData.customerProfile.preferences.notifications.priceDrops}
                onChange={(e) => handleInputChange('customerProfile.preferences.notifications.priceDrops', e.target.checked)}
                disabled={!isEditing}
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
              />
              <div className="ml-3">
                <label htmlFor="priceDrops" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price Drops
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when products in your wishlist go on sale
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="orderUpdates"
                checked={formData.customerProfile.preferences.notifications.orderUpdates}
                onChange={(e) => handleInputChange('customerProfile.preferences.notifications.orderUpdates', e.target.checked)}
                disabled={!isEditing}
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
              />
              <div className="ml-3">
                <label htmlFor="orderUpdates" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Order Updates
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified about your order status and delivery updates
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="promotions"
                checked={formData.customerProfile.preferences.notifications.promotions}
                onChange={(e) => handleInputChange('customerProfile.preferences.notifications.promotions', e.target.checked)}
                disabled={!isEditing}
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
              />
              <div className="ml-3">
                <label htmlFor="promotions" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Promotions & Deals
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive promotional offers and special deals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Profile Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load your profile. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Profile Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your {profile.userType} profile information
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                loading={isUpdating}
                leftIcon={<CheckIcon className="h-4 w-4" />}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              leftIcon={<PencilIcon className="h-4 w-4" />}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Profile Completion
          </h3>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {profileCompletion}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Complete your profile to increase visibility and trust
        </p>
      </div>

      {/* Error/Success Messages */}
      {updateError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Update Failed
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {updateError}
              </p>
            </div>
          </div>
        </div>
      )}

      {updateSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start">
            <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Profile Updated Successfully
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your profile information has been saved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Cover Section */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          {/* Avatar Section */}
          <div className="flex items-end -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {getCurrentAvatar() ? (
                  <img
                    src={getCurrentAvatar()}
                    alt={getDisplayName()}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {profile.userType === 'company' ? (
                      <BuildingOfficeIcon className="h-16 w-16 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <UserIcon className="h-16 w-16 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                )}
              </div>

              {/* Edit Avatar Button */}
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="ml-6 flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {getDisplayName()}
                </h2>
                {profile.isVerified && (
                  <CheckIcon className="h-6 w-6 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  <span className="capitalize">{profile.userType}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Render appropriate form based on user type */}
            {profile.userType === 'company' && renderCompanyForm()}
            {profile.userType === 'individual' && renderIndividualForm()}
            {profile.userType === 'customer' && renderCustomerForm()}

            {/* Notification Settings (Common for all types) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Notification Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={formData.notificationSettings.email}
                    onChange={(e) => handleInputChange('notificationSettings.email', e.target.checked)}
                    disabled={!isEditing}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                  />
                  <div className="ml-3">
                    <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Notifications
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={formData.notificationSettings.sms}
                    onChange={(e) => handleInputChange('notificationSettings.sms', e.target.checked)}
                    disabled={!isEditing}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                  />
                  <div className="ml-3">
                    <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      SMS Notifications
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via SMS
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={formData.notificationSettings.push}
                    onChange={(e) => handleInputChange('notificationSettings.push', e.target.checked)}
                    disabled={!isEditing}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                  />
                  <div className="ml-3">
                    <label htmlFor="pushNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Push Notifications
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive browser/app push notifications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="flex items-center">
              <p className="text-gray-900 dark:text-gray-100">{profile.email}</p>
              {profile.isVerified ? (
                <CheckIcon className="h-4 w-4 text-green-500 ml-2" />
              ) : (
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 ml-2" />
              )}
            </div>
            {!profile.isVerified && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Email not verified
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Status
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              profile.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {profile.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subscription
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
              profile.subscriptionStatus === 'premium' 
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            }`}>
              {profile.subscriptionStatus}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User ID
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {profile._id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;