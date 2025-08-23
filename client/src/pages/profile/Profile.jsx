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
  XMarkIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ETHIOPIAN_CITIES} from '../../constants';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Location
    address: '',
    city: 'Addis Ababa',
    region: '',
    
    // Professional
    title: '',
    bio: '',
    website: '',
    
    // Social Media
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    
    // Settings
    isProfilePublic: true,
    showContactInfo: true,
    allowMessages: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || 'Addis Ababa',
        region: user.region || '',
        title: user.title || '',
        bio: user.bio || '',
        website: user.website || '',
        socialMedia: user.socialMedia || {
          linkedin: '',
          twitter: '',
          facebook: '',
          instagram: ''
        },
        isProfilePublic: user.isProfilePublic ?? true,
        showContactInfo: user.showContactInfo ?? true,
        allowMessages: user.allowMessages ?? true
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update Redux state (in real app, this would come from API response)
      // dispatch(updateUser(formData));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
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

    setAvatarUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, upload to server and get URL
      const avatarUrl = URL.createObjectURL(file);
      
      // Update user avatar (dispatch action)
      // dispatch(updateUserAvatar(avatarUrl));
      
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || 'Addis Ababa',
        region: user.region || '',
        title: user.title || '',
        bio: user.bio || '',
        website: user.website || '',
        socialMedia: user.socialMedia || {
          linkedin: '',
          twitter: '',
          facebook: '',
          instagram: ''
        },
        isProfilePublic: user.isProfilePublic ?? true,
        showContactInfo: user.showContactInfo ?? true,
        allowMessages: user.allowMessages ?? true
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Profile Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and public profile
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                loading={isLoading}
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
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="h-16 w-16 text-gray-500 dark:text-gray-400" />
                  </div>
                )}

                {/* Avatar Upload Overlay */}
                {avatarUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>

              {/* Edit Avatar Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute bottom-2 right-2 w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <CameraIcon className="h-4 w-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="ml-6 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.title || 'No title set'}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{user?.city || 'Location not set'}</span>
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  <span>{user?.userType === 'individual' ? 'Individual' : 'Company'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name *"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={errors.firstName}
                  disabled={!isEditing}
                />
                <Input
                  label="Last Name *"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={errors.lastName}
                  disabled={!isEditing}
                />
                <Input
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  disabled={!isEditing}
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  disabled={!isEditing}
                  placeholder="+251 911 234 567"
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Street address, building name, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                  >
                    {ETHIOPIAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Region/State"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., Addis Ababa"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Professional Information
              </h3>
              <div className="space-y-6">
                <Input
                  label="Professional Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., Senior Interior Designer, Real Estate Agent"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                    placeholder="Tell people about yourself, your experience, and what you do..."
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Brief description for your public profile
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.bio.length}/500
                    </span>
                  </div>
                </div>
                <Input
                  label="Website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  error={errors.website}
                  disabled={!isEditing}
                  placeholder="https://your-website.com"
                  leftIcon={<GlobeAltIcon className="h-4 w-4" />}
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
                  label="LinkedIn"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                <Input
                  label="Twitter"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://twitter.com/yourusername"
                />
                <Input
                  label="Facebook"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://facebook.com/yourpage"
                />
                <Input
                  label="Instagram"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://instagram.com/yourusername"
                />
              </div>
            </div>

            {/* Privacy Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Privacy Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="isProfilePublic"
                    checked={formData.isProfilePublic}
                    onChange={(e) => handleInputChange('isProfilePublic', e.target.checked)}
                    disabled={!isEditing}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                  />
                  <div className="ml-3">
                    <label htmlFor="isProfilePublic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Make my profile public
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow other users to view your profile and contact you about listings
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="showContactInfo"
                    checked={formData.showContactInfo}
                    onChange={(e) => handleInputChange('showContactInfo', e.target.checked)}
                    disabled={!isEditing}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                  />
                  <div className="ml-3">
                    <label htmlFor="showContactInfo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show contact information on public profile
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display your phone number and email on your public profile
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="allowMessages"
                    checked={formData.allowMessages}
                    onChange={(e) => handleInputChange('allowMessages', e.target.checked)}
                    disabled={!isEditing}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                  />
                  <div className="ml-3">
                    <label htmlFor="allowMessages" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allow direct messages
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Let other users send you direct messages about your listings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Profile Preview */}
      {formData.isProfilePublic && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Public Profile Preview
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${formData.firstName} ${formData.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formData.firstName} {formData.lastName}
                </h4>
                {formData.title && (
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{formData.title}</p>
                )}
                {formData.bio && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{formData.bio}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  {formData.city && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{formData.city}</span>
                    </div>
                  )}
                  {formData.showContactInfo && formData.phone && (
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      <span>{formData.phone}</span>
                    </div>
                  )}
                  {formData.showContactInfo && formData.email && (
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      <span>{formData.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;