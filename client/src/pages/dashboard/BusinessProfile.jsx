import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  BuildingOfficeIcon,
  PlusIcon,
  XMarkIcon,
  CameraIcon,
  UserIcon,
  DocumentIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckBadgeIcon,
  StarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { BUSINESS_CATEGORIES, ETHIOPIAN_CITIES } from '../../constants';
import { formatFileSize } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const BusinessProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const logoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const [businessData, setBusinessData] = useState({
    // Basic Information
    companyName: '',
    businessType: 'company',
    category: '',
    subCategory: '',
    registrationNumber: '',
    taxId: '',
    yearEstablished: '',
    employeeCount: '',
    
    // Contact Information
    businessEmail: '',
    businessPhone: '',
    website: '',
    
    // Address
    address: '',
    city: 'Addis Ababa',
    region: '',
    postalCode: '',
    
    // Description
    description: '',
    specialties: [],
    services: [],
    
    // Documents
    documents: [],
    
    // Team Members
    teamMembers: [],
    
    // Certifications
    certifications: [],
    
    // Business Hours
    businessHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    },
    
    // Social Media
    socialMedia: {
      linkedin: '',
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
    
    // Settings
    isVerified: false,
    showTeamMembers: true,
    showBusinessHours: true,
    allowDirectBooking: true
  });

  const [errors, setErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ show: false, type: '', data: null });

  // Form state for adding new items
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    bio: '',
    avatar: null
  });
  
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuedBy: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    document: null
  });

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: BuildingOfficeIcon },
    { id: 'team', label: 'Team Members', icon: UserIcon },
    { id: 'certifications', label: 'Certifications', icon: CheckBadgeIcon },
    { id: 'documents', label: 'Documents', icon: DocumentIcon }
  ];

  useEffect(() => {
    if (user && user.businessProfile) {
      setBusinessData({
        ...businessData,
        ...user.businessProfile
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const keys = field.split('.');
      setBusinessData(prev => {
        const updated = { ...prev };
        let current = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setBusinessData(prev => ({
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

    if (!businessData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!businessData.category) {
      newErrors.category = 'Business category is required';
    }

    if (!businessData.businessEmail.trim()) {
      newErrors.businessEmail = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(businessData.businessEmail)) {
      newErrors.businessEmail = 'Please enter a valid email';
    }

    if (businessData.businessPhone && !/^\+?[\d\s-()]+$/.test(businessData.businessPhone)) {
      newErrors.businessPhone = 'Please enter a valid phone number';
    }

    if (businessData.website && !businessData.website.startsWith('http')) {
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Business profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating business profile:', error);
      toast.error('Failed to update business profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo size must be less than 5MB');
      return;
    }

    setLogoUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const logoUrl = URL.createObjectURL(file);
      
      setBusinessData(prev => ({ ...prev, logo: logoUrl }));
      toast.success('Logo updated successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo. Please try again.');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleDocumentUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      const document = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      };

      setBusinessData(prev => ({
        ...prev,
        documents: [...prev.documents, document]
      }));
    }

    toast.success('Documents uploaded successfully!');
  };

  const removeDocument = (documentId) => {
    setBusinessData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  const addTeamMember = () => {
    if (!newTeamMember.name.trim() || !newTeamMember.position.trim()) {
      toast.error('Name and position are required');
      return;
    }

    const teamMember = {
      id: Date.now() + Math.random(),
      ...newTeamMember,
      joinedAt: new Date().toISOString()
    };

    setBusinessData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, teamMember]
    }));

    setNewTeamMember({
      name: '',
      position: '',
      email: '',
      phone: '',
      bio: '',
      avatar: null
    });

    toast.success('Team member added successfully!');
  };

  const removeTeamMember = (memberId) => {
    setConfirmDialog({
      show: true,
      type: 'removeTeamMember',
      data: memberId,
      title: 'Remove Team Member',
      message: 'Are you sure you want to remove this team member?'
    });
  };

  const addCertification = () => {
    if (!newCertification.name.trim() || !newCertification.issuedBy.trim()) {
      toast.error('Certification name and issuing organization are required');
      return;
    }

    const certification = {
      id: Date.now() + Math.random(),
      ...newCertification,
      addedAt: new Date().toISOString()
    };

    setBusinessData(prev => ({
      ...prev,
      certifications: [...prev.certifications, certification]
    }));

    setNewCertification({
      name: '',
      issuedBy: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      document: null
    });

    toast.success('Certification added successfully!');
  };

  const removeCertification = (certId) => {
    setConfirmDialog({
      show: true,
      type: 'removeCertification',
      data: certId,
      title: 'Remove Certification',
      message: 'Are you sure you want to remove this certification?'
    });
  };

  const handleConfirmAction = () => {
    const { type, data } = confirmDialog;

    if (type === 'removeTeamMember') {
      setBusinessData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(member => member.id !== data)
      }));
      toast.success('Team member removed successfully!');
    } else if (type === 'removeCertification') {
      setBusinessData(prev => ({
        ...prev,
        certifications: prev.certifications.filter(cert => cert.id !== data)
      }));
      toast.success('Certification removed successfully!');
    }

    setConfirmDialog({ show: false, type: '', data: null });
  };

  const addSpecialty = (specialty) => {
    if (specialty && !businessData.specialties.includes(specialty)) {
      setBusinessData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    }
  };

  const removeSpecialty = (specialty) => {
    setBusinessData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const businessCategories = BUSINESS_CATEGORIES.filter(cat => cat.type === 'both' || cat.type === 'business');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Business Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set up your company profile to attract more customers
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                loading={isLoading}
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

      {/* Business Card Preview */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        <div className="px-6 pb-6">
          <div className="flex items-end -mt-12 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {businessData.logo ? (
                  <img
                    src={businessData.logo}
                    alt={businessData.companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                  </div>
                )}

                {logoUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>

              {isEditing && (
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={logoUploading}
                  className="absolute bottom-1 right-1 w-6 h-6 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <CameraIcon className="h-3 w-3" />
                </button>
              )}

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            <div className="ml-6 flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {businessData.companyName || 'Company Name'}
                </h2>
                {businessData.isVerified && (
                  <CheckBadgeIcon className="h-5 w-5 text-blue-500" title="Verified Business" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {businessData.category || 'Business Category'}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                {businessData.yearEstablished && (
                  <span>Est. {businessData.yearEstablished}</span>
                )}
                {businessData.employeeCount && (
                  <span>{businessData.employeeCount} employees</span>
                )}
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{businessData.city || 'Location'}</span>
                </div>
              </div>
            </div>
          </div>

          {businessData.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
              {businessData.description}
            </p>
          )}

          {businessData.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {businessData.specialties.slice(0, 5).map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                >
                  {specialty}
                </span>
              ))}
              {businessData.specialties.length > 5 && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                  +{businessData.specialties.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'basic' && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Company Name *"
                    value={businessData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    error={errors.companyName}
                    disabled={!isEditing}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Type
                    </label>
                    <select
                      value={businessData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                      <option value="company">Company</option>
                      <option value="partnership">Partnership</option>
                      <option value="sole-proprietorship">Sole Proprietorship</option>
                      <option value="ngo">NGO</option>
                      <option value="government">Government Agency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Category *
                    </label>
                    <select
                      value={businessData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                      <option value="">Select category</option>
                      {businessCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                    )}
                  </div>

                  <Input
                    label="Sub Category"
                    value={businessData.subCategory}
                    onChange={(e) => handleInputChange('subCategory', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Interior Design, Residential Construction"
                  />

                  <Input
                    label="Registration Number"
                    value={businessData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Company registration number"
                  />

                  <Input
                    label="Tax ID"
                    value={businessData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tax identification number"
                  />

                  <Input
                    label="Year Established"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={businessData.yearEstablished}
                    onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                    disabled={!isEditing}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Size
                    </label>
                    <select
                      value={businessData.employeeCount}
                      onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
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
                    label="Business Email *"
                    type="email"
                    value={businessData.businessEmail}
                    onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                    error={errors.businessEmail}
                    disabled={!isEditing}
                    leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                  />

                  <Input
                    label="Business Phone"
                    type="tel"
                    value={businessData.businessPhone}
                    onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                    error={errors.businessPhone}
                    disabled={!isEditing}
                    leftIcon={<PhoneIcon className="h-4 w-4" />}
                    placeholder="+251 111 123 456"
                  />

                  <Input
                    label="Website"
                    type="url"
                    value={businessData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    error={errors.website}
                    disabled={!isEditing}
                    leftIcon={<GlobeAltIcon className="h-4 w-4" />}
                    placeholder="https://your-company.com"
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
                      value={businessData.address}
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
                      value={businessData.city}
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
                    value={businessData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Addis Ababa"
                  />

                  <Input
                    label="Postal Code"
                    value={businessData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Postal/ZIP code"
                  />
                </div>
              </div>

              {/* Description & Specialties */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  About Your Business
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Description
                    </label>
                    <textarea
                      value={businessData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                      placeholder="Describe your business, what you do, your experience, and what makes you unique..."
                      maxLength={1000}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Tell customers about your business
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {businessData.description.length}/1000
                      </span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Specialties & Services
                    </label>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add a specialty or service"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSpecialty(e.target.value.trim());
                                e.target.value = '';
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={(e) => {
                              const input = e.target.closest('div').querySelector('input');
                              addSpecialty(input.value.trim());
                              input.value = '';
                            }}
                            size="sm"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {businessData.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                            >
                              {specialty}
                              <button
                                type="button"
                                onClick={() => removeSpecialty(specialty)}
                                className="ml-2 text-primary-500 hover:text-primary-700"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {businessData.specialties.length > 0 ? (
                          businessData.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                            >
                              {specialty}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">No specialties added yet</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Business Hours
                </h3>
                <div className="space-y-4">
                  {Object.entries(businessData.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-24">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {day}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!hours.closed}
                          onChange={(e) => handleInputChange(`businessHours.${day}.closed`, !e.target.checked)}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Open</span>
                      </div>

                      {!hours.closed && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleInputChange(`businessHours.${day}.open`, e.target.value)}
                            disabled={!isEditing}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleInputChange(`businessHours.${day}.close`, e.target.value)}
                            disabled={!isEditing}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                          />
                        </div>
                      )}

                      {hours.closed && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Social Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="LinkedIn"
                    value={businessData.socialMedia.linkedin}
                    onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                  <Input
                    label="Facebook"
                    value={businessData.socialMedia.facebook}
                    onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://facebook.com/yourcompany"
                  />
                  <Input
                    label="Twitter"
                    value={businessData.socialMedia.twitter}
                    onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://twitter.com/yourcompany"
                  />
                  <Input
                    label="Instagram"
                    value={businessData.socialMedia.instagram}
                    onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://instagram.com/yourcompany"
                  />
                  <Input
                    label="YouTube"
                    value={businessData.socialMedia.youtube}
                    onChange={(e) => handleInputChange('socialMedia.youtube', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://youtube.com/c/yourcompany"
                  />
                </div>
              </div>
            </form>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Team Members
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showTeamMembers"
                    checked={businessData.showTeamMembers}
                    onChange={(e) => handleInputChange('showTeamMembers', e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="showTeamMembers" className="text-sm text-gray-600 dark:text-gray-400">
                    Show team members on public profile
                  </label>
                </div>
              </div>

              {/* Add Team Member */}
              {isEditing && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Add Team Member
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Name *"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name"
                    />
                    <Input
                      label="Position *"
                      value={newTeamMember.position}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Job title"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={newTeamMember.email}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@company.com"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={newTeamMember.phone}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+251 911 234 567"
                    />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={newTeamMember.bio}
                        onChange={(e) => setNewTeamMember(prev => ({ ...prev, bio: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Brief description of their role and experience..."
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={addTeamMember} leftIcon={<PlusIcon className="h-4 w-4" />}>
                      Add Team Member
                    </Button>
                  </div>
                </div>
              )}

              {/* Team Members List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businessData.teamMembers.map((member) => (
                  <div key={member.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            {member.name}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.position}
                          </p>
                          {member.bio && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                              {member.bio}
                            </p>
                          )}
                          <div className="flex items-center space-x-3 mt-2">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="text-xs text-primary-500 hover:text-primary-600"
                              >
                                <EnvelopeIcon className="h-4 w-4" />
                              </a>
                            )}
                            {member.phone && (
                              <a
                                href={`tel:${member.phone}`}
                                className="text-xs text-primary-500 hover:text-primary-600"
                              >
                                <PhoneIcon className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {businessData.teamMembers.length === 0 && (
                <div className="text-center py-8">
                  <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No team members added yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Add team members to showcase your company's expertise
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Certifications & Awards
              </h3>

              {/* Add Certification */}
              {isEditing && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Add Certification
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Certification Name *"
                      value={newCertification.name}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., ISO 9001 Quality Management"
                    />
                    <Input
                      label="Issued By *"
                      value={newCertification.issuedBy}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, issuedBy: e.target.value }))}
                      placeholder="e.g., International Organization for Standardization"
                    />
                    <Input
                      label="Issue Date"
                      type="date"
                      value={newCertification.issueDate}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, issueDate: e.target.value }))}
                    />
                    <Input
                      label="Expiry Date"
                      type="date"
                      value={newCertification.expiryDate}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
                    />
                    <Input
                      label="Credential ID"
                      value={newCertification.credentialId}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                      placeholder="Verification ID or certificate number"
                    />
                  </div>
                  <div className="mt-4">
                    <Button onClick={addCertification} leftIcon={<PlusIcon className="h-4 w-4" />}>
                      Add Certification
                    </Button>
                  </div>
                </div>
              )}

              {/* Certifications List */}
              <div className="space-y-4">
                {businessData.certifications.map((cert) => (
                  <div key={cert.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckBadgeIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            {cert.name}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Issued by {cert.issuedBy}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {cert.issueDate && (
                              <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                            )}
                            {cert.expiryDate && (
                              <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                            )}
                            {cert.credentialId && (
                              <span>ID: {cert.credentialId}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeCertification(cert.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {businessData.certifications.length === 0 && (
                <div className="text-center py-8">
                  <CheckBadgeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No certifications added yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Add certifications to build trust with potential customers
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Business Documents
                </h3>
                {isEditing && (
                  <Button
                    onClick={() => documentInputRef.current?.click()}
                    leftIcon={<PlusIcon className="h-4 w-4" />}
                  >
                    Upload Documents
                  </Button>
                )}
              </div>

              <input
                ref={documentInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleDocumentUpload}
                className="hidden"
              />

              {/* Document Upload Area */}
              {isEditing && (
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => documentInputRef.current?.click()}
                >
                  <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Upload Business Documents
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Click to select files or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports: PDF, DOC, DOCX, JPG, PNG up to 10MB each
                  </p>
                </div>
              )}

              {/* Documents List */}
              <div className="space-y-3">
                {businessData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DocumentIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(doc.url, '_blank')}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="View document"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {isEditing && (
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="p-2 text-red-400 hover:text-red-600"
                          title="Remove document"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {businessData.documents.length === 0 && (
                <div className="text-center py-8">
                  <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No documents uploaded yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload business licenses, certificates, or other relevant documents
                  </p>
                </div>
              )}

              {/* Document Guidelines */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Recommended Documents:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Business registration certificate</li>
                  <li>• Professional licenses and permits</li>
                  <li>• Insurance certificates</li>
                  <li>• Industry certifications</li>
                  <li>• Tax clearance certificates</li>
                  <li>• Portfolio samples or case studies</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.show}
        onClose={() => setConfirmDialog({ show: false, type: '', data: null })}
        onConfirm={handleConfirmAction}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Remove"
        confirmVariant="danger"
      />
    </div>
  );
};

export default BusinessProfile;