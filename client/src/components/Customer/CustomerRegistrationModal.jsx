// components/Registration/CustomerRegistrationModal.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  CheckIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { submitPropertyRegistration } from '../../store/slices/productSlice';
import { ETHIOPIAN_CITIES } from '../../constants';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const CustomerRegistrationModal = ({ property, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      alternativePhone: '',
      nationality: 'Ethiopian',
      occupation: '',
      monthlyIncome: ''
    },
    
    // Address Information
    address: {
      current: {
        street: '',
        city: '',
        subcity: '',
        kebele: '',
        woreda: '',
        region: '',
        postalCode: ''
      },
      permanent: {
        street: '',
        city: '',
        subcity: '',
        kebele: '',
        woreda: '',
        region: '',
        postalCode: '',
        sameAsCurrent: false
      }
    },
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    
    // Financial Information
    financialInfo: {
      bankName: '',
      accountNumber: '',
      employerName: '',
      employmentType: '',
      workExperience: ''
    },
    
    // Terms and Agreements
    agreeToTerms: false,
    agreeToDataProcessing: false,
    agreeToMarketing: false
  });

  const [errors, setErrors] = useState({});
  const [documents, setDocuments] = useState([]);

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic personal information' },
    { number: 2, title: 'Address & Contact', description: 'Address and emergency contact' },
    { number: 3, title: 'Financial Info', description: 'Employment and financial details' },
    { number: 4, title: 'Review & Submit', description: 'Review and submit registration' }
  ];

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    const errorKey = section ? `${section}.${field}` : field;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
    
    // Clear error when user starts typing
    const errorKey = `${section}.${subsection}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.personalInfo.firstName.trim()) newErrors['personalInfo.firstName'] = 'First name is required';
        if (!formData.personalInfo.lastName.trim()) newErrors['personalInfo.lastName'] = 'Last name is required';
        if (!formData.personalInfo.email.trim()) newErrors['personalInfo.email'] = 'Email is required';
        if (!formData.personalInfo.phone.trim()) newErrors['personalInfo.phone'] = 'Phone number is required';
        if (!formData.personalInfo.occupation.trim()) newErrors['personalInfo.occupation'] = 'Occupation is required';
        
        // Email validation
        if (formData.personalInfo.email && !/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
          newErrors['personalInfo.email'] = 'Please enter a valid email address';
        }
        
        // Phone validation (Ethiopian format)
        if (formData.personalInfo.phone && !/^(\+251|0)?[9]\d{8}$/.test(formData.personalInfo.phone.replace(/\s/g, ''))) {
          newErrors['personalInfo.phone'] = 'Please enter a valid Ethiopian phone number';
        }
        break;
        
      case 2:
        if (!formData.address.current.city) newErrors['address.current.city'] = 'City is required';
        if (!formData.address.current.subcity.trim()) newErrors['address.current.subcity'] = 'Subcity is required';
        if (!formData.emergencyContact.name.trim()) newErrors['emergencyContact.name'] = 'Emergency contact name is required';
        if (!formData.emergencyContact.phone.trim()) newErrors['emergencyContact.phone'] = 'Emergency contact phone is required';
        break;
        
      case 3:
        if (!formData.financialInfo.employerName.trim()) newErrors['financialInfo.employerName'] = 'Employer name is required';
        if (!formData.personalInfo.monthlyIncome) newErrors['personalInfo.monthlyIncome'] = 'Monthly income is required';
        break;
        
      case 4:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        if (!formData.agreeToDataProcessing) newErrors.agreeToDataProcessing = 'You must agree to data processing';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Handle permanent address
      if (formData.address.permanent.sameAsCurrent) {
        formData.address.permanent = { ...formData.address.current, sameAsCurrent: true };
      }

      // Prepare registration data according to backend schema
      const registrationData = {
        propertyId: property._id,
        personalInfo: formData.personalInfo,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        financialInfo: formData.financialInfo
      };

      // Submit registration
      const result = await dispatch(submitPropertyRegistration(registrationData)).unwrap();
      
      toast.success('Registration submitted successfully!');
      
      // Call success callback with registration data and payment URL
      onSuccess({ 
        registration: result.registration,
        paymentUrl: result.paymentUrl 
      });
      
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error(error || 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="First Name *"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                    error={errors['personalInfo.firstName']}
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <Input
                    label="Last Name *"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                    error={errors['personalInfo.lastName']}
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div>
                  <Input
                    label="Email Address *"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    error={errors['personalInfo.email']}
                    placeholder="your.email@example.com"
                    leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <Input
                    label="Phone Number *"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    error={errors['personalInfo.phone']}
                    placeholder="+251 911 123 456"
                    leftIcon={<PhoneIcon className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <Input
                    label="Alternative Phone (Optional)"
                    value={formData.personalInfo.alternativePhone}
                    onChange={(e) => handleInputChange('personalInfo', 'alternativePhone', e.target.value)}
                    placeholder="+251 911 654 321"
                    leftIcon={<PhoneIcon className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nationality
                  </label>
                  <select
                    value={formData.personalInfo.nationality}
                    onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                  >
                    <option value="Ethiopian">Ethiopian</option>
                    <option value="Other">Other (Foreign National)</option>
                  </select>
                </div>

                <div>
                  <Input
                    label="Occupation *"
                    value={formData.personalInfo.occupation}
                    onChange={(e) => handleInputChange('personalInfo', 'occupation', e.target.value)}
                    error={errors['personalInfo.occupation']}
                    placeholder="Your job title/profession"
                  />
                </div>

                <div>
                  <Input
                    label="Monthly Income (ETB)"
                    type="number"
                    value={formData.personalInfo.monthlyIncome}
                    onChange={(e) => handleInputChange('personalInfo', 'monthlyIncome', e.target.value)}
                    error={errors['personalInfo.monthlyIncome']}
                    placeholder="Your monthly income"
                    leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Current Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Current Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Street Address"
                    value={formData.address.current.street}
                    onChange={(e) => handleNestedInputChange('address', 'current', 'street', e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <select
                    value={formData.address.current.city}
                    onChange={(e) => handleNestedInputChange('address', 'current', 'city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base ${
                      errors['address.current.city'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select city</option>
                    {ETHIOPIAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors['address.current.city'] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['address.current.city']}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    label="Subcity/District *"
                    value={formData.address.current.subcity}
                    onChange={(e) => handleNestedInputChange('address', 'current', 'subcity', e.target.value)}
                    error={errors['address.current.subcity']}
                    placeholder="e.g., Bole, Yeka, Kirkos"
                  />
                </div>
                
                <div>
                  <Input
                    label="Kebele"
                    value={formData.address.current.kebele}
                    onChange={(e) => handleNestedInputChange('address', 'current', 'kebele', e.target.value)}
                    placeholder="Kebele number"
                  />
                </div>

                <div>
                  <Input
                    label="Woreda"
                    value={formData.address.current.woreda}
                    onChange={(e) => handleNestedInputChange('address', 'current', 'woreda', e.target.value)}
                    placeholder="Woreda number"
                  />
                </div>

                <div>
                  <Input
                    label="Region"
                    value={formData.address.current.region}
                    onChange={(e) => handleNestedInputChange('address', 'current', 'region', e.target.value)}
                    placeholder="Region"
                  />
                </div>
              </div>
            </div>

            {/* Permanent Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Permanent Address
              </h3>
              
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.address.permanent.sameAsCurrent}
                    onChange={(e) => handleNestedInputChange('address', 'permanent', 'sameAsCurrent', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Same as current address
                  </span>
                </label>
              </div>

              {!formData.address.permanent.sameAsCurrent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Street Address"
                      value={formData.address.permanent.street}
                      onChange={(e) => handleNestedInputChange('address', 'permanent', 'street', e.target.value)}
                      placeholder="Street address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    <select
                      value={formData.address.permanent.city}
                      onChange={(e) => handleNestedInputChange('address', 'permanent', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                    >
                      <option value="">Select city</option>
                      {ETHIOPIAN_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Input
                      label="Subcity/District"
                      value={formData.address.permanent.subcity}
                      onChange={(e) => handleNestedInputChange('address', 'permanent', 'subcity', e.target.value)}
                      placeholder="e.g., Bole, Yeka, Kirkos"
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Kebele"
                      value={formData.address.permanent.kebele}
                      onChange={(e) => handleNestedInputChange('address', 'permanent', 'kebele', e.target.value)}
                      placeholder="Kebele number"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Contact Name *"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
                    error={errors['emergencyContact.name']}
                    placeholder="Full name"
                  />
                </div>
                
                <div>
                  <Input
                    label="Relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
                
                <div>
                  <Input
                    label="Phone Number *"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
                    error={errors['emergencyContact.phone']}
                    placeholder="+251 911 123 456"
                    leftIcon={<PhoneIcon className="h-4 w-4" />}
                  />
                </div>

                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.emergencyContact.email}
                    onChange={(e) => handleInputChange('emergencyContact', 'email', e.target.value)}
                    placeholder="email@example.com"
                    leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Employment & Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Employer Name *"
                    value={formData.financialInfo.employerName}
                    onChange={(e) => handleInputChange('financialInfo', 'employerName', e.target.value)}
                    error={errors['financialInfo.employerName']}
                    placeholder="Company/organization name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={formData.financialInfo.employmentType}
                    onChange={(e) => handleInputChange('financialInfo', 'employmentType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                  >
                    <option value="">Select employment type</option>
                    <option value="permanent">Permanent Employee</option>
                    <option value="contract">Contract Employee</option>
                    <option value="self-employed">Self Employed</option>
                    <option value="business-owner">Business Owner</option>
                    <option value="freelancer">Freelancer</option>
                  </select>
                </div>
                
                <div>
                  <Input
                    label="Work Experience (Years)"
                    type="number"
                    value={formData.financialInfo.workExperience}
                    onChange={(e) => handleInputChange('financialInfo', 'workExperience', e.target.value)}
                    placeholder="Years of work experience"
                  />
                </div>
                
                <div>
                  <Input
                    label="Bank Name"
                    value={formData.financialInfo.bankName}
                    onChange={(e) => handleInputChange('financialInfo', 'bankName', e.target.value)}
                    placeholder="Your primary bank"
                  />
                </div>

                <div>
                  <Input
                    label="Account Number"
                    value={formData.financialInfo.accountNumber}
                    onChange={(e) => handleInputChange('financialInfo', 'accountNumber', e.target.value)}
                    placeholder="Bank account number"
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Supporting Documents (Optional)
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload supporting documents (ID, salary certificate, etc.)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer"
                >
                  Choose Files
                </label>
              </div>

              {documents.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Documents:
                  </h4>
                  <div className="space-y-2">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{doc.name}</span>
                        <button
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Registration Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Registration Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Property:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Applicant:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formData.personalInfo.firstName} {formData.personalInfo.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formData.personalInfo.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formData.personalInfo.phone}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Registration Fee:</span>
                  <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                    {formatCurrency(property.propertyDetails?.registrationFee || 5000, 'ETB')}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Agreements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Terms and Agreements
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange(null, 'agreeToTerms', e.target.checked)}
                    className={`mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${
                      errors.agreeToTerms ? 'border-red-500' : ''
                    }`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to the <a href="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">Terms and Conditions</a> and understand that the registration fee is non-refundable. *
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600 dark:text-red-400 ml-6">{errors.agreeToTerms}</p>
                )}
                
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.agreeToDataProcessing}
                    onChange={(e) => handleInputChange(null, 'agreeToDataProcessing', e.target.checked)}
                    className={`mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${
                      errors.agreeToDataProcessing ? 'border-red-500' : ''
                    }`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I consent to the processing of my personal data for the purpose of property registration and communication. *
                  </span>
                </label>
                {errors.agreeToDataProcessing && (
                  <p className="text-sm text-red-600 dark:text-red-400 ml-6">{errors.agreeToDataProcessing}</p>
                )}
                
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.agreeToMarketing}
                    onChange={(e) => handleInputChange(null, 'agreeToMarketing', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I would like to receive updates about similar properties and promotional offers (optional).
                  </span>
                </label>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Important Information</h4>
                  <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                    <li>• Registration fee is required to secure your interest in the property</li>
                    <li>• Admin will review your application within 24 hours</li>
                    <li>• You will receive email updates on your registration status</li>
                    <li>• Registration fee may be applied towards the final purchase price</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Property Registration
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Register your interest in "{property.title}"
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.number
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="hidden md:block">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="max-h-96 overflow-y-auto pr-2">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <ClockIcon className="h-4 w-4" />
                <span>Step {currentStep} of {steps.length}</span>
              </div>
              
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                
                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistrationModal;