import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Step Components
import BasicInfoStep from '../../components/dashboard/form-steps/BasicInfoStep';
import DetailsStep from '../../components/dashboard/form-steps/DetailsStep';
import PricingStep from '../../components/dashboard/form-steps/PricingStep';
import LocationContactStep from '../../components/dashboard/form-steps/LocationContactStep';
import MediaStep from '../../components/dashboard/form-steps/MediaStep';
import ReviewStep from '../../components/dashboard/form-steps/ReviewStep';

import { createProduct } from '../../store/slices/productSlice';
import { PRODUCT_TYPE_CONFIG } from '../../config/productTypes';

const CreateProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Initial form data
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    shortDescription: '',
    productType: '',
    subProductType: '',
    listingType: '', // sell, rent
    sellerType: 'individual', // individual, company
    condition: '', // new, used, refurbished
    brand: '',
    model: '',
    status: 'draft', // draft, active, pending, sold, rented, out-of-stock
    featured: false,
    tags: [],

    // Pricing
    pricing: {
      basePrice: '',
      salePrice: '',
      priceType: 'fixed', // fixed, per-unit, starting-from, per-month
      currency: 'ETB',
      isNegotiable: false,
      rentPrice: {
        monthly: '',
        yearly: '',
        deposit: ''
      }
    },

    // Property Details (for real estate)
    propertyDetails: {
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
        region: '',
        country: 'Ethiopia',
        coordinates: { lat: '', lng: '' },
        landmarks: []
      },
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
        completionDate: '',
        constructionStatus: 'planning',
        paymentPlan: 'full-payment',
        projectFeatures: []
      }
    },

    // Vehicle Details (for others -> vehicles)
    vehicleDetails: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      fuelType: 'petrol',
      transmission: 'manual',
      color: '',
      engineSize: '',
      bodyType: ''
    },

    // Equipment Details (for others -> construction-equipment)
    equipmentDetails: {
      manufacturer: '',
      model: '',
      year: '',
      condition: '',
      hoursUsed: '',
      specifications: []
    },

    // Business Details (for others -> business-sale)
    businessDetails: {
      businessType: '',
      annualRevenue: '',
      employees: '',
      establishedYear: '',
      equipment: [],
      licenses: []
    },

    // General Product Specifications
    specifications: [],

    // Warranty & Return Policy (for products)
    warranty: {
      duration: '',
      unit: 'months',
      type: 'manufacturer',
      description: ''
    },

    returnPolicy: {
      returnable: false,
      returnPeriod: 30,
      conditions: []
    },

    // Shipping Information (for products)
    shipping: {
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      shippingClass: '',
      freeShipping: false,
      shippingCost: ''
    },

    // Contact Information
    contactInfo: {
      phone: '',
      email: '',
      whatsapp: '',
      preferredContactMethod: 'phone'
    },

    // Viewing Details (for real estate)
    viewingDetails: {
      allowViewings: true,
      viewingDays: [],
      viewingHours: { start: '', end: '' },
      specialInstructions: ''
    },

    // Media
    media: {
      images: [],
      videos: [],
      documents: [],
      virtualTour: ''
    },

    // Additional
    notes: '' // Internal notes
  });

  const steps = [
    { id: 1, name: 'Basic Info', component: BasicInfoStep },
    { id: 2, name: 'Details', component: DetailsStep },
    { id: 3, name: 'Pricing', component: PricingStep },
    { id: 4, name: 'Location & Contact', component: LocationContactStep },
    { id: 5, name: 'Media', component: MediaStep },
    { id: 6, name: 'Review', component: ReviewStep }
  ];

  const getCurrentProductTypeConfig = () => {
    return PRODUCT_TYPE_CONFIG[formData.productType] || PRODUCT_TYPE_CONFIG.others;
  };

  const handleFormDataChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const validateStep = (step) => {
    const stepErrors = {};

    switch (step) {
      case 1: // Basic Info
        if (!formData.title?.trim()) {
          stepErrors.title = 'Title is required';
        }
        if (!formData.productType) {
          stepErrors.productType = 'Product type is required';
        }
        if (!formData.subProductType) {
          stepErrors.subProductType = 'Sub-type is required';
        }
        if (['homes', 'plots', 'commercials'].includes(formData.productType) && !formData.listingType) {
          stepErrors.listingType = 'Listing type is required for real estate';
        }
        if (!formData.description?.trim()) {
          stepErrors.description = 'Description is required';
        }
        break;

      case 2: // Details
        if (['homes', 'plots', 'commercials'].includes(formData.productType)) {
          if (!formData.propertyDetails?.area?.value) {
            stepErrors['propertyDetails.area.value'] = 'Area is required';
          }
          if (formData.productType === 'plots' && !formData.propertyDetails?.landDetails?.landUse) {
            stepErrors['propertyDetails.landDetails.landUse'] = 'Land use is required';
          }
        }
        if (formData.productType === 'others' && formData.subProductType === 'vehicles') {
          if (!formData.vehicleDetails?.make?.trim()) {
            stepErrors['vehicleDetails.make'] = 'Make is required';
          }
          if (!formData.vehicleDetails?.year) {
            stepErrors['vehicleDetails.year'] = 'Year is required';
          }
        }
        if (formData.productType === 'others' && formData.subProductType === 'construction-equipment') {
          if (!formData.equipmentDetails?.manufacturer?.trim()) {
            stepErrors['equipmentDetails.manufacturer'] = 'Manufacturer is required';
          }
        }
        break;

      case 3: // Pricing
        if (formData.listingType !== 'rent') {
          if (!formData.pricing?.basePrice) {
            stepErrors['pricing.basePrice'] = 'Price is required';
          }
        } else {
          if (!formData.pricing?.rentPrice?.monthly) {
            stepErrors['pricing.rentPrice.monthly'] = 'Monthly rent is required';
          }
        }
        break;

      case 4: // Location & Contact
        if (!formData.contactInfo?.phone?.trim()) {
          stepErrors['contactInfo.phone'] = 'Phone number is required';
        }
        if (['homes', 'plots', 'commercials'].includes(formData.productType)) {
          if (!formData.propertyDetails?.location?.city?.trim()) {
            stepErrors['propertyDetails.location.city'] = 'City is required';
          }
          if (!formData.propertyDetails?.location?.address?.trim()) {
            stepErrors['propertyDetails.location.address'] = 'Address is required';
          }
        }
        break;

      case 5: // Media
        if (!formData.media?.images?.length) {
          stepErrors['media.images'] = 'At least one image is required';
        }
        break;

      case 6: // Review
        // Final validation - check all previous steps
        Object.assign(stepErrors, validateStep(1), validateStep(2), validateStep(3), validateStep(4), validateStep(5));
        break;

      default:
        break;
    }

    return stepErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error('Please fix the errors before continuing');
      return;
    }

    setErrors({});
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Helper function to clean form data before submission
  const prepareFormDataForSubmission = (data) => {
    const cleaned = { ...data };

    // Remove fields that should not be sent to backend
    delete cleaned.category;
    delete cleaned.subcategory;

    // Handle promotion expiry - only include if it's a valid date
    if (!cleaned.promotionExpiry || cleaned.promotionExpiry === 'null' || cleaned.promotionExpiry === '') {
      delete cleaned.promotionExpiry;
    }

    // Clean pricing object
    if (cleaned.pricing) {
      // Remove empty string values and convert to numbers
      Object.keys(cleaned.pricing).forEach(key => {
        if (cleaned.pricing[key] === '' || cleaned.pricing[key] === 'null') {
          delete cleaned.pricing[key];
        } else if (key === 'basePrice' || key === 'salePrice') {
          // Convert price strings to numbers
          if (cleaned.pricing[key]) {
            cleaned.pricing[key] = parseFloat(cleaned.pricing[key]) || 0;
          }
        }
      });

      // Clean rent price object
      if (cleaned.pricing.rentPrice) {
        Object.keys(cleaned.pricing.rentPrice).forEach(key => {
          if (cleaned.pricing.rentPrice[key] === '' || cleaned.pricing.rentPrice[key] === 'null') {
            delete cleaned.pricing.rentPrice[key];
          } else {
            // Convert to numbers
            cleaned.pricing.rentPrice[key] = parseFloat(cleaned.pricing.rentPrice[key]) || 0;
          }
        });
      }
    }

    // Clean property details for real estate
    if (cleaned.propertyDetails) {
      // Clean area object
      if (cleaned.propertyDetails.area) {
        if (cleaned.propertyDetails.area.value === '' || cleaned.propertyDetails.area.value === 'null') {
          delete cleaned.propertyDetails.area.value;
        } else {
          cleaned.propertyDetails.area.value = parseFloat(cleaned.propertyDetails.area.value) || 0;
        }
      }

      // Clean numeric fields
      ['bedrooms', 'bathrooms', 'floors', 'parkingSpaces', 'balconies', 'yearBuilt'].forEach(field => {
        if (cleaned.propertyDetails[field] === '' || cleaned.propertyDetails[field] === 'null') {
          delete cleaned.propertyDetails[field];
        } else if (cleaned.propertyDetails[field]) {
          cleaned.propertyDetails[field] = parseInt(cleaned.propertyDetails[field]) || 0;
        }
      });

      // Clean arrays - remove empty values
      ['features', 'amenities'].forEach(field => {
        if (cleaned.propertyDetails[field]) {
          cleaned.propertyDetails[field] = cleaned.propertyDetails[field].filter(item => item && item.trim());
        }
      });

      // Clean location object
      if (cleaned.propertyDetails.location) {
        Object.keys(cleaned.propertyDetails.location).forEach(key => {
          if (cleaned.propertyDetails.location[key] === '' || cleaned.propertyDetails.location[key] === 'null') {
            delete cleaned.propertyDetails.location[key];
          }
        });

        // Clean landmarks array
        if (cleaned.propertyDetails.location.landmarks) {
          cleaned.propertyDetails.location.landmarks = cleaned.propertyDetails.location.landmarks.filter(item => item && item.trim());
        }
      }
    }

    // Clean vehicle details
    if (cleaned.vehicleDetails) {
      Object.keys(cleaned.vehicleDetails).forEach(key => {
        if (cleaned.vehicleDetails[key] === '' || cleaned.vehicleDetails[key] === 'null') {
          delete cleaned.vehicleDetails[key];
        } else if (['year', 'mileage'].includes(key) && cleaned.vehicleDetails[key]) {
          cleaned.vehicleDetails[key] = parseInt(cleaned.vehicleDetails[key]) || 0;
        }
      });
    }

    // Clean equipment details
    if (cleaned.equipmentDetails) {
      Object.keys(cleaned.equipmentDetails).forEach(key => {
        if (cleaned.equipmentDetails[key] === '' || cleaned.equipmentDetails[key] === 'null') {
          delete cleaned.equipmentDetails[key];
        } else if (['year', 'hoursUsed'].includes(key) && cleaned.equipmentDetails[key]) {
          cleaned.equipmentDetails[key] = parseInt(cleaned.equipmentDetails[key]) || 0;
        }
      });

      // Clean specifications array
      if (cleaned.equipmentDetails.specifications) {
        cleaned.equipmentDetails.specifications = cleaned.equipmentDetails.specifications.filter(
          spec => spec.name && spec.value
        );
      }
    }

    // Clean general specifications array
    if (cleaned.specifications) {
      cleaned.specifications = cleaned.specifications.filter(
        spec => spec.name && spec.value
      );
    }

    // Clean contact info
    if (cleaned.contactInfo) {
      Object.keys(cleaned.contactInfo).forEach(key => {
        if (cleaned.contactInfo[key] === '' || cleaned.contactInfo[key] === 'null') {
          delete cleaned.contactInfo[key];
        }
      });
    }

    // Clean viewing details
    if (cleaned.viewingDetails) {
      if (cleaned.viewingDetails.viewingDays) {
        cleaned.viewingDetails.viewingDays = cleaned.viewingDetails.viewingDays.filter(day => day);
      }
      
      if (!cleaned.viewingDetails.allowViewings) {
        // If viewings are not allowed, remove viewing-related fields
        delete cleaned.viewingDetails.viewingDays;
        delete cleaned.viewingDetails.viewingHours;
        delete cleaned.viewingDetails.specialInstructions;
      }
    }

    // Clean media object
    if (cleaned.media) {
      // Filter out any invalid media items
      if (cleaned.media.images) {
        cleaned.media.images = cleaned.media.images.filter(img => img && img.url);
      }
      if (cleaned.media.videos) {
        cleaned.media.videos = cleaned.media.videos.filter(video => video && video.url);
      }
      if (cleaned.media.documents) {
        cleaned.media.documents = cleaned.media.documents.filter(doc => doc && doc.url);
      }
      
      // Remove empty virtual tour
      if (!cleaned.media.virtualTour || cleaned.media.virtualTour === '') {
        delete cleaned.media.virtualTour;
      }
    }

    // Clean warranty and shipping for products
    if (cleaned.warranty) {
      Object.keys(cleaned.warranty).forEach(key => {
        if (cleaned.warranty[key] === '' || cleaned.warranty[key] === 'null') {
          delete cleaned.warranty[key];
        } else if (key === 'duration' && cleaned.warranty[key]) {
          cleaned.warranty[key] = parseInt(cleaned.warranty[key]) || 0;
        }
      });
    }

    if (cleaned.shipping) {
      Object.keys(cleaned.shipping).forEach(key => {
        if (cleaned.shipping[key] === '' || cleaned.shipping[key] === 'null') {
          delete cleaned.shipping[key];
        } else if (['weight', 'shippingCost'].includes(key) && cleaned.shipping[key]) {
          cleaned.shipping[key] = parseFloat(cleaned.shipping[key]) || 0;
        }
      });

      // Clean dimensions
      if (cleaned.shipping.dimensions) {
        Object.keys(cleaned.shipping.dimensions).forEach(key => {
          if (cleaned.shipping.dimensions[key] === '' || cleaned.shipping.dimensions[key] === 'null') {
            delete cleaned.shipping.dimensions[key];
          } else {
            cleaned.shipping.dimensions[key] = parseFloat(cleaned.shipping.dimensions[key]) || 0;
          }
        });
      }
    }

    // Clean return policy
    if (cleaned.returnPolicy) {
      if (cleaned.returnPolicy.returnPeriod === '' || cleaned.returnPolicy.returnPeriod === 'null') {
        delete cleaned.returnPolicy.returnPeriod;
      } else if (cleaned.returnPolicy.returnPeriod) {
        cleaned.returnPolicy.returnPeriod = parseInt(cleaned.returnPolicy.returnPeriod) || 30;
      }

      if (cleaned.returnPolicy.conditions) {
        cleaned.returnPolicy.conditions = cleaned.returnPolicy.conditions.filter(condition => condition && condition.trim());
      }
    }

    // Clean tags array
    if (cleaned.tags) {
      cleaned.tags = cleaned.tags.filter(tag => tag && tag.trim());
    }

    // Set default status if not provided
    if (!cleaned.status) {
      cleaned.status = 'draft';
    }

    // Ensure seller type is set
    if (!cleaned.sellerType) {
      cleaned.sellerType = 'individual';
    }

    console.log('Cleaned form data:', cleaned);
    
    return cleaned;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate current step
      const stepErrors = validateStep(currentStep);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        toast.error('Please fix the errors before submitting');
        return;
      }

      // Clean and prepare form data for submission
      const cleanedData = prepareFormDataForSubmission(formData);
      
      // Submit the product
      const result = await dispatch(createProduct(cleanedData)).unwrap();
      
      toast.success('Listing created successfully!');
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(error.message || 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      
      const draftData = prepareFormDataForSubmission({
        ...formData,
        status: 'draft'
      });
      
      await dispatch(createProduct(draftData)).unwrap();
      toast.success('Draft saved successfully!');
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/products')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Listings
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New Listing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Fill in the details to create your listing
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    currentStep >= step.id
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium">{step.id}</span>
                </div>
                <span
                  className={`ml-2 text-sm font-medium hidden sm:block ${
                    currentStep >= step.id
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-colors ${
                      currentStep > step.id
                        ? 'bg-primary-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <CurrentStepComponent
            formData={formData}
            errors={errors}
            productTypeConfig={getCurrentProductTypeConfig()}
            onChange={handleFormDataChange}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                rightIcon={<ArrowRightIcon className="h-4 w-4" />}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Listing'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;