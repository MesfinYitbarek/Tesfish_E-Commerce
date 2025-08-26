// components/property/PropertyRegistrationModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
//import { submitPropertyRegistration } from '../../store/slices/productSlice';
import { toast } from 'react-hot-toast';

const PropertyRegistrationModal = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch();
  const { isSubmitting } = useSelector((state) => state.property);
  const { user } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: user?.firstName || user?.customerProfile?.firstName || '',
      lastName: user?.lastName || user?.customerProfile?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || user?.customerProfile?.phone || '',
      alternatePhone: '',
      dateOfBirth: '',
      nationality: 'Ethiopian',
      occupation: '',
      employer: '',
      monthlyIncome: ''
    },
    address: {
      current: {
        street: '',
        city: '',
        region: '',
        country: 'Ethiopia',
        zipCode: ''
      },
      permanent: {
        street: '',
        city: '',
        region: '',
        country: 'Ethiopia',
        zipCode: '',
        sameAsCurrent: false
      }
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    financialInfo: {
      bankName: '',
      accountNumber: '',
      hasLoan: false,
      loanDetails: '',
      monthlyExpenses: ''
    }
  });
  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          firstName: user?.firstName || user?.customerProfile?.firstName || '',
          lastName: user?.lastName || user?.customerProfile?.lastName || '',
          email: user?.email || '',
          phone: user?.phone || user?.customerProfile?.phone || ''
        }
      }));
    }
  }, [isOpen, user]);

  const handleInputChange = (section, field, value, subsection = null) => {
    setFormData(prev => {
      if (subsection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...prev[section][subsection],
              [field]: value
            }
          }
        };
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      }
    });

    // Clear errors
    const errorKey = subsection ? `${section}.${subsection}.${field}` : `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: null }));
    }
  };

  const handleSameAsCurrent = (checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          permanent: {
            ...prev.address.current,
            sameAsCurrent: true
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          permanent: {
            ...prev.address.permanent,
            sameAsCurrent: false
          }
        }
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
      
      if (!['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        return;
      }

      validFiles.push(file);
    });

    setDocuments(prev => [...prev, ...validFiles]);
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Personal Information validation
      if (!formData.personalInfo.firstName.trim()) {
        newErrors['personalInfo.firstName'] = 'First name is required';
      }
      if (!formData.personalInfo.lastName.trim()) {
        newErrors['personalInfo.lastName'] = 'Last name is required';
      }
      if (!formData.personalInfo.email.trim()) {
        newErrors['personalInfo.email'] = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
        newErrors['personalInfo.email'] = 'Please enter a valid email';
      }
      if (!formData.personalInfo.phone.trim()) {
        newErrors['personalInfo.phone'] = 'Phone number is required';
      }
      if (!formData.personalInfo.occupation.trim()) {
        newErrors['personalInfo.occupation'] = 'Occupation is required';
      }
    }

    if (step === 2) {
      // Address validation
      if (!formData.address.current.street.trim()) {
        newErrors['address.current.street'] = 'Current address is required';
      }
      if (!formData.address.current.city.trim()) {
        newErrors['address.current.city'] = 'Current city is required';
      }
      if (!formData.address.current.region.trim()) {
        newErrors['address.current.region'] = 'Current region is required';
      }

      if (!formData.address.permanent.sameAsCurrent) {
        if (!formData.address.permanent.street.trim()) {
          newErrors['address.permanent.street'] = 'Permanent address is required';
        }
        if (!formData.address.permanent.city.trim()) {
          newErrors['address.permanent.city'] = 'Permanent city is required';
        }
        if (!formData.address.permanent.region.trim()) {
          newErrors['address.permanent.region'] = 'Permanent region is required';
        }
      }

      // Emergency contact validation
      if (!formData.emergencyContact.name.trim()) {
        newErrors['emergencyContact.name'] = 'Emergency contact name is required';
      }
      if (!formData.emergencyContact.phone.trim()) {
        newErrors['emergencyContact.phone'] = 'Emergency contact phone is required';
      }
      if (!formData.emergencyContact.relationship.trim()) {
        newErrors['emergencyContact.relationship'] = 'Relationship is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      const registrationData = new FormData();
      
      registrationData.append('propertyId', product._id);
      registrationData.append('personalInfo', JSON.stringify(formData.personalInfo));
      registrationData.append('address', JSON.stringify(formData.address));
      registrationData.append('emergencyContact', JSON.stringify(formData.emergencyContact));
      registrationData.append('financialInfo', JSON.stringify(formData.financialInfo));

      // Add documents
      documents.forEach((file, index) => {
        registrationData.append('documents', file);
      });

    //   const result = await dispatch(submitPropertyRegistration(registrationData)).unwrap();
      
    //   if (result.paymentUrl) {
    //     // Redirect to payment page
    //     window.open(result.paymentUrl, '_blank');
    //   }

      toast.success('Registration submitted successfully!');
      onClose();

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error || 'Failed to submit registration');
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal Information';
      case 2: return 'Address & Emergency Contact';
      case 3: return 'Financial Information';
      case 4: return 'Documents & Review';
      default: return '';
    }
  };

  const relationshipOptions = [
    'Parent', 'Sibling', 'Spouse', 'Child', 'Friend', 'Colleague', 'Other'
  ];

  const documentTypes = [
    { value: 'id-card', label: 'ID Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'license', label: 'Driving License' },
    { value: 'bank-statement', label: 'Bank Statement' },
    { value: 'salary-slip', label: 'Salary Slip' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Property Registration"
      size="xl"
      className="max-w-4xl"
    >
      <div className="p-6">
        {/* Property Info Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-4">
            {product.media?.images?.[0] && (
              <img
                src={product.media.images[0].url}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Registration Fee: {product.propertyDetails.registrationFee.toLocaleString()} {product.pricing.currency}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                This fee secures your interest in the property and will be processed via secure payment.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Step {currentStep} of 4: {getStepTitle()}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((currentStep / 4) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name *"
                      value={formData.personalInfo.firstName}
                      onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                      error={errors['personalInfo.firstName']}
                    />
                    <Input
                      label="Last Name *"
                      value={formData.personalInfo.lastName}
                      onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                      error={errors['personalInfo.lastName']}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email Address *"
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      error={errors['personalInfo.email']}
                    />
                    <Input
                      label="Phone Number *"
                      value={formData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      error={errors['personalInfo.phone']}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Alternate Phone"
                      value={formData.personalInfo.alternatePhone}
                      onChange={(e) => handleInputChange('personalInfo', 'alternatePhone', e.target.value)}
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={formData.personalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nationality"
                      value={formData.personalInfo.nationality}
                      onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                    />
                    <Input
                      label="Occupation *"
                      value={formData.personalInfo.occupation}
                      onChange={(e) => handleInputChange('personalInfo', 'occupation', e.target.value)}
                      error={errors['personalInfo.occupation']}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Employer"
                      value={formData.personalInfo.employer}
                      onChange={(e) => handleInputChange('personalInfo', 'employer', e.target.value)}
                    />
                    <Input
                      label="Monthly Income (Optional)"
                      type="number"
                      value={formData.personalInfo.monthlyIncome}
                      onChange={(e) => handleInputChange('personalInfo', 'monthlyIncome', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Address & Emergency Contact */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  {/* Current Address */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Current Address
                    </h4>
                    <div className="space-y-4">
                      <Input
                        label="Street Address *"
                        value={formData.address.current.street}
                        onChange={(e) => handleInputChange('address', 'street', e.target.value, 'current')}
                        error={errors['address.current.street']}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="City *"
                          value={formData.address.current.city}
                          onChange={(e) => handleInputChange('address', 'city', e.target.value, 'current')}
                          error={errors['address.current.city']}
                        />
                        <Input
                          label="Region *"
                          value={formData.address.current.region}
                          onChange={(e) => handleInputChange('address', 'region', e.target.value, 'current')}
                          error={errors['address.current.region']}
                        />
                        <Input
                          label="Zip Code"
                          value={formData.address.current.zipCode}
                          onChange={(e) => handleInputChange('address', 'zipCode', e.target.value, 'current')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Permanent Address
                      </h4>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.address.permanent.sameAsCurrent}
                          onChange={(e) => handleSameAsCurrent(e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Same as current</span>
                      </label>
                    </div>
                    {!formData.address.permanent.sameAsCurrent && (
                      <div className="space-y-4">
                        <Input
                          label="Street Address *"
                          value={formData.address.permanent.street}
                          onChange={(e) => handleInputChange('address', 'street', e.target.value, 'permanent')}
                          error={errors['address.permanent.street']}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            label="City *"
                            value={formData.address.permanent.city}
                            onChange={(e) => handleInputChange('address', 'city', e.target.value, 'permanent')}
                            error={errors['address.permanent.city']}
                          />
                          <Input
                            label="Region *"
                            value={formData.address.permanent.region}
                            onChange={(e) => handleInputChange('address', 'region', e.target.value, 'permanent')}
                            error={errors['address.permanent.region']}
                          />
                          <Input
                            label="Zip Code"
                            value={formData.address.permanent.zipCode}
                            onChange={(e) => handleInputChange('address', 'zipCode', e.target.value, 'permanent')}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Emergency Contact
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Full Name *"
                          value={formData.emergencyContact.name}
                          onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
                          error={errors['emergencyContact.name']}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Relationship *
                          </label>
                          <select
                            value={formData.emergencyContact.relationship}
                            onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Select relationship</option>
                            {relationshipOptions.map(option => (
                              <option key={option} value={option.toLowerCase()}>
                                {option}
                              </option>
                            ))}
                          </select>
                          {errors['emergencyContact.relationship'] && (
                            <p className="text-red-500 text-sm mt-1">{errors['emergencyContact.relationship']}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Phone Number *"
                          value={formData.emergencyContact.phone}
                          onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
                          error={errors['emergencyContact.phone']}
                        />
                        <Input
                          label="Email Address"
                          type="email"
                          value={formData.emergencyContact.email}
                          onChange={(e) => handleInputChange('emergencyContact', 'email', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Financial Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Financial Information (Optional)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Bank Name"
                      value={formData.financialInfo.bankName}
                      onChange={(e) => handleInputChange('financialInfo', 'bankName', e.target.value)}
                    />
                    <Input
                      label="Account Number"
                      value={formData.financialInfo.accountNumber}
                      onChange={(e) => handleInputChange('financialInfo', 'accountNumber', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.financialInfo.hasLoan}
                        onChange={(e) => handleInputChange('financialInfo', 'hasLoan', e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">I have existing loans</span>
                    </label>
                  </div>

                  {formData.financialInfo.hasLoan && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Loan Details
                      </label>
                      <textarea
                        value={formData.financialInfo.loanDetails}
                        onChange={(e) => handleInputChange('financialInfo', 'loanDetails', e.target.value)}
                        placeholder="Please provide details about your existing loans..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      />
                    </div>
                  )}

                  <Input
                    label="Monthly Expenses"
                    type="number"
                    value={formData.financialInfo.monthlyExpenses}
                    onChange={(e) => handleInputChange('financialInfo', 'monthlyExpenses', e.target.value)}
                    placeholder="Estimated monthly expenses"
                  />
                </div>
              )}

              {/* Step 4: Documents & Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* Document Upload */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Supporting Documents
                    </h4>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="document-upload"
                      />
                      <label
                        htmlFor="document-upload"
                        className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                      >
                        <CloudArrowUpIcon className="h-12 w-12 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload documents or drag and drop
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          PDF, JPG, PNG up to 10MB each
                        </span>
                      </label>
                    </div>

                    {documents.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                            <button
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Registration Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Registration Summary
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Property:</span>
                        <span className="font-medium">{product.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Applicant:</span>
                        <span className="font-medium">
                          {formData.personalInfo.firstName} {formData.personalInfo.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                        <span className="font-medium">{formData.personalInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                        <span className="font-medium">{formData.personalInfo.phone}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600 dark:text-gray-400">Registration Fee:</span>
                        <span className="font-bold text-lg">
                          {product.propertyDetails.registrationFee.toLocaleString()} {product.pricing.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Documents:</span>
                        <span className="font-medium">{documents.length} files</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms Notice */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        <p className="font-medium mb-1">Important Notes:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Registration fee is non-refundable</li>
                          <li>Payment will be processed securely</li>
                          <li>You will receive confirmation via email</li>
                          <li>Registration does not guarantee property allocation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                leftIcon={<CreditCardIcon className="h-4 w-4" />}
              >
                Pay & Register
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PropertyRegistrationModal;