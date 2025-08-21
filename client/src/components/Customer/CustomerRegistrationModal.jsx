import { useState } from 'react';
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
import PaymentMethodSelection from './PaymentMethodSelection';
import { ETHIOPIAN_CITIES } from '../../constants';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const CustomerRegistrationModal = ({ property, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    alternativePhone: '',
    nationality: 'Ethiopian',
    
    // Address Information
    currentAddress: {
      city: '',
      subcity: '',
      kebele: '',
      houseNumber: ''
    },
    
    // Employment/Financial Information
    occupation: '',
    employerName: '',
    monthlyIncome: '',
    bankName: '',
    bankAccountNumber: '',
    
    // Property Interest Details
    interestedUnits: [],
    preferredFloor: '',
    preferredOrientation: '',
    financingMethod: '',
    downPaymentAmount: '',
    
    // Additional Information
    previousPropertyOwnership: false,
    purposeOfPurchase: '',
    additionalRequirements: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    
    // Terms and Agreements
    agreeToTerms: false,
    agreeToDataProcessing: false,
    agreeToMarketing: false
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [registrationFee] = useState(5000); // ETB 5,000 registration fee

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic personal information' },
    { number: 2, title: 'Address & Employment', description: 'Address and employment details' },
    { number: 3, title: 'Property Interest', description: 'Specific property preferences' },
    { number: 4, title: 'Payment', description: 'Registration fee payment' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUnitSelection = (unitId) => {
    const currentUnits = formData.interestedUnits;
    const updatedUnits = currentUnits.includes(unitId)
      ? currentUnits.filter(id => id !== unitId)
      : [...currentUnits, unitId];
    
    handleInputChange('interestedUnits', updatedUnits);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        
        // Email validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        
        // Phone validation (Ethiopian format)
        if (formData.phone && !/^(\+251|0)?[9]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid Ethiopian phone number';
        }
        break;
        
      case 2:
        if (!formData.currentAddress.city) newErrors['currentAddress.city'] = 'City is required';
        if (!formData.currentAddress.subcity.trim()) newErrors['currentAddress.subcity'] = 'Subcity is required';
        if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
        if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Monthly income is required';
        break;
        
      case 3:
        if (formData.interestedUnits.length === 0) newErrors.interestedUnits = 'Please select at least one unit';
        if (!formData.financingMethod) newErrors.financingMethod = 'Please select financing method';
        if (!formData.purposeOfPurchase.trim()) newErrors.purposeOfPurchase = 'Purpose of purchase is required';
        break;
        
      case 4:
        if (!selectedPaymentMethod) newErrors.paymentMethod = 'Please select a payment method';
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
      // Prepare registration data
      const registrationData = {
        ...formData,
        propertyId: property.id,
        propertyTitle: property.title,
        sellerInfo: property.seller,
        registrationFee,
        paymentMethod: selectedPaymentMethod,
        registrationDate: new Date().toISOString(),
        status: 'pending_payment'
      };

      // Simulate API call to create registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store registration data temporarily (in real app, this would be handled by backend)
      const registrationId = `REG-${Date.now()}`;
      localStorage.setItem(`registration_${registrationId}`, JSON.stringify(registrationData));
      
      toast.success('Registration created successfully!');
      
      // Proceed to payment
      onSuccess({ registrationId, registrationData, paymentMethod: selectedPaymentMethod });
      
    } catch (error) {
      console.error('Error creating registration:', error);
      toast.error('Failed to create registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableUnits = [
    { id: 'A-101', type: '2BR Apartment', floor: '1st Floor', price: 2500000, area: '85 sqm' },
    { id: 'A-201', type: '3BR Apartment', floor: '2nd Floor', price: 3200000, area: '120 sqm' },
    { id: 'A-301', type: '3BR Apartment', floor: '3rd Floor', price: 3500000, area: '120 sqm' },
    { id: 'B-101', type: '1BR Apartment', floor: '1st Floor', price: 1800000, area: '65 sqm' },
    { id: 'B-201', type: '2BR Apartment', floor: '2nd Floor', price: 2200000, area: '85 sqm' }
  ];

  const financingMethods = [
    { value: 'cash', label: 'Full Cash Payment' },
    { value: 'bank_loan', label: 'Bank Loan/Mortgage' },
    { value: 'installment', label: 'Developer Installment Plan' },
    { value: 'mixed', label: 'Mixed (Cash + Loan)' }
  ];

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
                <div className="md:col-span-2">
                  <Input
                    label="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    error={errors.fullName}
                    placeholder="Enter your full name as it appears on ID"
                  />
                </div>
                
                <div>
                  <Input
                    label="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    placeholder="your.email@example.com"
                    leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <Input
                    label="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                    placeholder="+251 911 123 456"
                    leftIcon={<PhoneIcon className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <Input
                    label="Alternative Phone (Optional)"
                    value={formData.alternativePhone}
                    onChange={(e) => handleInputChange('alternativePhone', e.target.value)}
                    placeholder="+251 911 654 321"
                    leftIcon={<PhoneIcon className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nationality
                  </label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                  >
                    <option value="Ethiopian">Ethiopian</option>
                    <option value="Other">Other (Foreign National)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Current Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <select
                    value={formData.currentAddress.city}
                    onChange={(e) => handleInputChange('currentAddress.city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base ${
                      errors['currentAddress.city'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select city</option>
                    {ETHIOPIAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors['currentAddress.city'] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['currentAddress.city']}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    label="Subcity/District *"
                    value={formData.currentAddress.subcity}
                    onChange={(e) => handleInputChange('currentAddress.subcity', e.target.value)}
                    error={errors['currentAddress.subcity']}
                    placeholder="e.g., Bole, Yeka, Kirkos"
                  />
                </div>
                
                <div>
                  <Input
                    label="Kebele"
                    value={formData.currentAddress.kebele}
                    onChange={(e) => handleInputChange('currentAddress.kebele', e.target.value)}
                    placeholder="Kebele number"
                  />
                </div>
                
                <div>
                  <Input
                    label="House Number"
                    value={formData.currentAddress.houseNumber}
                    onChange={(e) => handleInputChange('currentAddress.houseNumber', e.target.value)}
                    placeholder="House/building number"
                  />
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Employment & Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Occupation *"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    error={errors.occupation}
                    placeholder="Your job title/profession"
                  />
                </div>
                
                <div>
                  <Input
                    label="Employer Name"
                    value={formData.employerName}
                    onChange={(e) => handleInputChange('employerName', e.target.value)}
                    placeholder="Company/organization name"
                  />
                </div>
                
                <div>
                  <Input
                    label="Monthly Income (ETB) *"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    error={errors.monthlyIncome}
                    placeholder="Your monthly income"
                    leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <Input
                    label="Bank Name"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="Your primary bank"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="Contact Name"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                
                <div>
                  <Input
                    label="Relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
                
                <div>
                  <Input
                    label="Phone Number"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    placeholder="+251 911 123 456"
                    leftIcon={<PhoneIcon className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Available Units */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                Select Interested Units *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {availableUnits.map(unit => (
                  <label
                    key={unit.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.interestedUnits.includes(unit.id)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.interestedUnits.includes(unit.id)}
                      onChange={() => handleUnitSelection(unit.id)}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          Unit {unit.id}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{unit.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{unit.floor}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{unit.area}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-gray-100">
                          {formatCurrency(unit.price, 'ETB')}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.interestedUnits && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.interestedUnits}</p>
              )}
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Preferred Floor"
                  value={formData.preferredFloor}
                  onChange={(e) => handleInputChange('preferredFloor', e.target.value)}
                  placeholder="e.g., Ground floor, High floor"
                />
              </div>
              
              <div>
                <Input
                  label="Preferred Orientation"
                  value={formData.preferredOrientation}
                  onChange={(e) => handleInputChange('preferredOrientation', e.target.value)}
                  placeholder="e.g., East facing, South facing"
                />
              </div>
            </div>

            {/* Financing Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Financing Method *
              </label>
              <div className="space-y-3">
                {financingMethods.map(method => (
                  <label key={method.value} className="flex items-center">
                    <input
                      type="radio"
                      name="financingMethod"
                      value={method.value}
                      checked={formData.financingMethod === method.value}
                      onChange={(e) => handleInputChange('financingMethod', e.target.value)}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{method.label}</span>
                  </label>
                ))}
              </div>
              {errors.financingMethod && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.financingMethod}</p>
              )}
            </div>

            {/* Down Payment */}
            {formData.financingMethod && formData.financingMethod !== 'cash' && (
              <div>
                <Input
                  label="Down Payment Amount (ETB)"
                  type="number"
                  value={formData.downPaymentAmount}
                  onChange={(e) => handleInputChange('downPaymentAmount', e.target.value)}
                  placeholder="Amount you can pay upfront"
                  leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                />
              </div>
            )}

            {/* Purpose of Purchase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Purpose of Purchase *
              </label>
              <textarea
                value={formData.purposeOfPurchase}
                onChange={(e) => handleInputChange('purposeOfPurchase', e.target.value)}
                rows={3}
                placeholder="e.g., Primary residence, Investment, Rental income"
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base ${
                  errors.purposeOfPurchase ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.purposeOfPurchase && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.purposeOfPurchase}</p>
              )}
            </div>

            {/* Previous Property Ownership */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.previousPropertyOwnership}
                  onChange={(e) => handleInputChange('previousPropertyOwnership', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I have previously owned property in Ethiopia
                </span>
              </label>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Requirements or Comments
              </label>
              <textarea
                value={formData.additionalRequirements}
                onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                rows={3}
                placeholder="Any specific requirements or additional information..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
              />
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
                  <span className="text-gray-600 dark:text-gray-400">Interested Units:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formData.interestedUnits.length} unit(s)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Financing Method:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {financingMethods.find(m => m.value === formData.financingMethod)?.label}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Registration Fee:</span>
                  <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                    {formatCurrency(registrationFee, 'ETB')}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Select Payment Method
              </h3>
              <PaymentMethodSelection
                onMethodSelect={setSelectedPaymentMethod}
                selectedMethod={selectedPaymentMethod}
                amount={registrationFee}
              />
              {errors.paymentMethod && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.paymentMethod}</p>
              )}
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
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
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
                    onChange={(e) => handleInputChange('agreeToDataProcessing', e.target.checked)}
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
                    onChange={(e) => handleInputChange('agreeToMarketing', e.target.value)}
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
                    <li>• You will receive confirmation within 24 hours of payment</li>
                    <li>• The seller will contact you within 48 hours to schedule a viewing</li>
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
        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Customer Registration
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
                    {isSubmitting ? 'Processing...' : `Pay ${formatCurrency(registrationFee, 'ETB')} & Register`}
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