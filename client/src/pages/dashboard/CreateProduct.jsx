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

  // Initial form data based on the Product model
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    shortDescription: '',
    
    // Main Product Type
    productType: '', // 'homes', 'plots', 'commercials', 'others'
    subProductType: '', // Based on main type
    listingType: '', // 'sell', 'rent' - required for real estate
    
    // Seller Information
    sellerType: 'individual', // 'company', 'individual'
    
    // Product Details
    brand: '',
    model: '',
    condition: 'new',
    
    // Pricing
    pricing: {
      basePrice: '',
      salePrice: '',
      currency: 'ETB',
      isNegotiable: false,
      priceType: 'fixed', // 'fixed', 'starting-from', 'per-unit', 'per-day', 'per-month', 'per-year'
      rentPrice: {
        monthly: '',
        yearly: '',
        deposit: ''
      }
    },
    
    // Inventory
    inventory: {
      sku: '',
      stock: 1,
      lowStockThreshold: 1,
      trackInventory: false,
      allowBackorders: false
    },
    
    // Media
    media: {
      images: [],
      videos: [],
      documents: [],
      virtualTour: ''
    },
    
    // Product Specifications
    specifications: [],
    
    // Property Details (for homes, plots, commercials)
    propertyDetails: {
      propertyId: '',
      propertyType: '',
      
      // Dimensions
      area: {
        value: '',
        unit: 'sqm' // 'sqft', 'sqm', 'hectares', 'acres'
      },
      
      // For Homes/Buildings
      bedrooms: '',
      bathrooms: '',
      floors: '',
      parkingSpaces: '',
      balconies: '',
      
      // Property Features
      furnishingStatus: 'unfurnished', // 'furnished', 'semi-furnished', 'unfurnished', 'not-applicable'
      yearBuilt: '',
      features: [],
      amenities: [],
      
      // Location Details
      location: {
        address: '',
        city: '',
        subcity: '',
        woreda: '',
        kebele: '',
        region: '',
        country: 'Ethiopia',
        zipCode: '',
        coordinates: {
          lat: '',
          lng: ''
        },
        landmarks: [],
        nearbyFacilities: []
      },
      
      // Legal & Registration
      registrationFee: 0,
      hasLegalDocuments: false,
      legalDocuments: [],
      titleDeedStatus: 'not-applicable', // 'clear', 'pending', 'disputed', 'not-applicable'
      
      // Project Details (for companies)
      isProject: false,
      projectDetails: {
        projectName: '',
        developer: '',
        totalUnits: '',
        availableUnits: '',
        soldUnits: 0,
        completionDate: '',
        constructionStatus: 'planning', // 'planning', 'under-construction', 'completed'
        paymentPlan: 'full-payment', // 'full-payment', 'installment', 'both'
        installmentOptions: [],
        projectFeatures: [],
        masterPlan: ''
      },
      
      // Utilities & Services
      utilities: {
        electricity: false,
        water: false,
        internet: false,
        gas: false,
        sewerage: false,
        garbage: false
      },
      
      // For Plots/Land
      landDetails: {
        landUse: 'residential', // 'residential', 'commercial', 'mixed-use', 'agricultural', 'industrial'
        topography: 'flat', // 'flat', 'sloped', 'hilly', 'mountainous'
        soilType: '',
        waterSource: 'none', // 'borehole', 'well', 'municipal', 'river', 'none'
        accessRoad: 'paved', // 'paved', 'gravel', 'dirt', 'no-access'
        developmentPotential: ''
      }
    },
    
    // Business/Commercial Details
    businessDetails: {
      businessType: '',
      annualRevenue: '',
      employees: '',
      establishedYear: '',
      equipment: [],
      licenses: [],
      financialDocuments: []
    },
    
    // Vehicle Details (for others category)
    vehicleDetails: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      fuelType: 'petrol', // 'petrol', 'diesel', 'electric', 'hybrid'
      transmission: 'manual', // 'manual', 'automatic'
      color: '',
      engineSize: '',
      bodyType: ''
    },
    
    // Equipment Details
    equipmentDetails: {
      manufacturer: '',
      model: '',
      year: '',
      condition: '',
      hoursUsed: '',
      specifications: []
    },
    
    // Status
    status: 'draft', // 'draft', 'active', 'sold', 'rented', 'out-of-stock', 'discontinued', 'pending-approval'
    
    // Availability
    availability: {
      isAvailable: true,
      availableFrom: '',
      availableUntil: ''
    },
    
    // SEO
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    },
    
    // Reviews
    reviews: {
      average: 0,
      count: 0
    },
    
    // Features
    isFeatured: false,
    isPromoted: false,
    promotionExpiry: '',
    isVerified: false,
    
    // Contact & Viewing
    contactInfo: {
      phone: '',
      email: '',
      whatsapp: '',
      preferredContactMethod: 'phone' // 'phone', 'email', 'whatsapp', 'any'
    },
    
    viewingDetails: {
      allowViewings: true,
      viewingDays: [],
      viewingHours: {
        start: '',
        end: ''
      },
      viewingRequirements: []
    },
    
    // Additional Fields
    tags: [],
    notes: '',
    
    // Warranty (for others category)
    warranty: {
      duration: '',
      unit: 'months', // 'days', 'months', 'years'
      type: 'manufacturer', // 'manufacturer', 'seller', 'none'
      description: ''
    },

    // Return Policy (for others category)
    returnPolicy: {
      returnable: false,
      returnPeriod: 30,
      conditions: []
    },
    
    // Shipping (for others category)
    shipping: {
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      shippingClass: '',
      freeShipping: false,
      shippingCost: ''
    }
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
    setFormData(prev => {
      // Deep merge for nested objects
      const merged = { ...prev };
      
      Object.keys(updates).forEach(key => {
        if (updates[key] && typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          merged[key] = { ...prev[key], ...updates[key] };
        } else {
          merged[key] = updates[key];
        }
      });
      
      return merged;
    });
    
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
    const isRealEstate = ['homes', 'plots', 'commercials'].includes(formData.productType);

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
        if (isRealEstate && !formData.listingType) {
          stepErrors.listingType = 'Listing type is required for real estate';
        }
        if (!formData.description?.trim()) {
          stepErrors.description = 'Description is required';
        }
        break;

      case 2: // Details
        if (isRealEstate) {
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
        if (formData.listingType === 'rent') {
          if (!formData.pricing?.rentPrice?.monthly) {
            stepErrors['pricing.rentPrice.monthly'] = 'Monthly rent is required';
          }
        } else {
          if (!formData.pricing?.basePrice) {
            stepErrors['pricing.basePrice'] = 'Price is required';
          }
        }
        break;

      case 4: // Location & Contact
        if (!formData.contactInfo?.phone?.trim()) {
          stepErrors['contactInfo.phone'] = 'Phone number is required';
        }
        if (isRealEstate) {
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

    // Convert string numbers to actual numbers
    if (cleaned.pricing) {
      if (cleaned.pricing.basePrice) {
        cleaned.pricing.basePrice = parseFloat(cleaned.pricing.basePrice) || 0;
      }
      if (cleaned.pricing.salePrice) {
        cleaned.pricing.salePrice = parseFloat(cleaned.pricing.salePrice) || 0;
      }
      if (cleaned.pricing.rentPrice) {
        Object.keys(cleaned.pricing.rentPrice).forEach(key => {
          if (cleaned.pricing.rentPrice[key]) {
            cleaned.pricing.rentPrice[key] = parseFloat(cleaned.pricing.rentPrice[key]) || 0;
          }
        });
      }
    }

    // Clean property details for real estate
    if (cleaned.propertyDetails) {
      // Convert area value to number
      if (cleaned.propertyDetails.area?.value) {
        cleaned.propertyDetails.area.value = parseFloat(cleaned.propertyDetails.area.value) || 0;
      }

      // Convert numeric fields
      ['bedrooms', 'bathrooms', 'floors', 'parkingSpaces', 'balconies', 'yearBuilt'].forEach(field => {
        if (cleaned.propertyDetails[field]) {
          cleaned.propertyDetails[field] = parseInt(cleaned.propertyDetails[field]) || 0;
        }
      });

      // Convert registration fee
      if (cleaned.propertyDetails.registrationFee) {
        cleaned.propertyDetails.registrationFee = parseFloat(cleaned.propertyDetails.registrationFee) || 0;
      }

      // Convert coordinates
      if (cleaned.propertyDetails.location?.coordinates) {
        if (cleaned.propertyDetails.location.coordinates.lat) {
          cleaned.propertyDetails.location.coordinates.lat = parseFloat(cleaned.propertyDetails.location.coordinates.lat);
        }
        if (cleaned.propertyDetails.location.coordinates.lng) {
          cleaned.propertyDetails.location.coordinates.lng = parseFloat(cleaned.propertyDetails.location.coordinates.lng);
        }
      }

      // Convert project details numbers
      if (cleaned.propertyDetails.projectDetails) {
        ['totalUnits', 'availableUnits', 'soldUnits'].forEach(field => {
          if (cleaned.propertyDetails.projectDetails[field]) {
            cleaned.propertyDetails.projectDetails[field] = parseInt(cleaned.propertyDetails.projectDetails[field]) || 0;
          }
        });
      }
    }

    // Clean vehicle details
    if (cleaned.vehicleDetails) {
      ['year', 'mileage'].forEach(field => {
        if (cleaned.vehicleDetails[field]) {
          cleaned.vehicleDetails[field] = parseInt(cleaned.vehicleDetails[field]) || 0;
        }
      });
    }

    // Clean equipment details
    if (cleaned.equipmentDetails) {
      ['year', 'hoursUsed'].forEach(field => {
        if (cleaned.equipmentDetails[field]) {
          cleaned.equipmentDetails[field] = parseInt(cleaned.equipmentDetails[field]) || 0;
        }
      });
    }

    // Clean business details
    if (cleaned.businessDetails) {
      ['annualRevenue', 'employees', 'establishedYear'].forEach(field => {
        if (cleaned.businessDetails[field]) {
          cleaned.businessDetails[field] = parseInt(cleaned.businessDetails[field]) || 0;
        }
      });
    }

    // Clean inventory
    if (cleaned.inventory) {
      ['stock', 'lowStockThreshold'].forEach(field => {
        if (cleaned.inventory[field]) {
          cleaned.inventory[field] = parseInt(cleaned.inventory[field]) || 0;
        }
      });
    }

    // Clean warranty
    if (cleaned.warranty?.duration) {
      cleaned.warranty.duration = parseInt(cleaned.warranty.duration) || 0;
    }

    // Clean return policy
    if (cleaned.returnPolicy?.returnPeriod) {
      cleaned.returnPolicy.returnPeriod = parseInt(cleaned.returnPolicy.returnPeriod) || 30;
    }

    // Clean shipping
    if (cleaned.shipping) {
      if (cleaned.shipping.weight) {
        cleaned.shipping.weight = parseFloat(cleaned.shipping.weight) || 0;
      }
      if (cleaned.shipping.shippingCost) {
        cleaned.shipping.shippingCost = parseFloat(cleaned.shipping.shippingCost) || 0;
      }
      if (cleaned.shipping.dimensions) {
        ['length', 'width', 'height'].forEach(field => {
          if (cleaned.shipping.dimensions[field]) {
            cleaned.shipping.dimensions[field] = parseFloat(cleaned.shipping.dimensions[field]) || 0;
          }
        });
      }
    }

    // Remove empty arrays and objects
    const removeEmpty = (obj) => {
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
          if (Array.isArray(obj[key])) {
            obj[key] = obj[key].filter(item => item !== null && item !== undefined && item !== '');
            if (obj[key].length === 0) {
              delete obj[key];
            }
          } else {
            removeEmpty(obj[key]);
            if (Object.keys(obj[key]).length === 0) {
              delete obj[key];
            }
          }
        } else if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
          delete obj[key];
        }
      });
    };

    // Don't remove the main structure, just clean empty values
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === null || cleaned[key] === undefined || cleaned[key] === '') {
        delete cleaned[key];
      } else if (typeof cleaned[key] === 'object' && !Array.isArray(cleaned[key])) {
        removeEmpty(cleaned[key]);
      } else if (Array.isArray(cleaned[key])) {
        cleaned[key] = cleaned[key].filter(item => item !== null && item !== undefined && item !== '');
      }
    });

    // Set default values
    if (!cleaned.status) {
      cleaned.status = 'draft';
    }
    if (!cleaned.sellerType) {
      cleaned.sellerType = 'individual';
    }
    if (!cleaned.condition) {
      cleaned.condition = 'new';
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
      const cleanedData = prepareFormDataForSubmission({
        ...formData,
        status: 'active'
      });
      
      // Submit the product
      const result = await dispatch(createProduct(cleanedData)).unwrap();
      
      toast.success('Listing published successfully!');
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

  // Auto-save draft every 2 minutes
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (formData.title?.trim()) {
        // Only auto-save if there's meaningful content
        localStorage.setItem('productDraft', JSON.stringify(formData));
      }
    }, 120000); // 2 minutes

    return () => clearInterval(autoSave);
  }, [formData]);

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('productDraft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.title?.trim()) {
          setFormData(parsed);
          toast.success('Draft loaded from previous session');
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

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
                    Publishing...
                  </>
                ) : (
                  'Publish Listing'
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