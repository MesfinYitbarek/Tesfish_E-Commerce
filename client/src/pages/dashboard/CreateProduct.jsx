import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import ProductFormWizard from '../../components/dashboard/ProductFormWizard';
import { toast } from 'react-hot-toast';
import { createProduct } from '../../store/slices/productSlice';

const CreateProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, error } = useSelector((state) => state.products);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    category: '',
    subcategory: '',
    productType: 'real-estate', // 'real-estate', 'service', 'physical', 'digital', 'rental'
    seller: user?._id,
    sellerType: user?.userType === 'company' ? 'company' : 'individual',

    // Pricing
    pricing: {
      basePrice: '',
      salePrice: '',
      priceType: 'fixed',
      currency: 'ETB',
      isNegotiable: false
    },

    // Inventory
    inventory: {
      stock: 0,
      trackInventory: false,
      allowBackorders: false,
      lowStockThreshold: 5
    },

    // Media
    media: {
      images: [],
      videos: [],
      documents: []
    },

    // Specifications
    specifications: [],

    // Variants
    variants: [],

    // Real Estate Specific
    realEstateDetails: {
      propertyType: 'apartment',
      bedrooms: '',
      bathrooms: '',
      area: {
        value: '',
        unit: 'sqm'
      },
      floors: '',
      parkingSpaces: '',
      furnishingStatus: 'unfurnished',
      yearBuilt: '',
      features: [],
      location: {
        address: '',
        city: 'Addis Ababa',
        state: '',
        country: 'Ethiopia',
        zipCode: '',
        coordinates: {
          lat: null,
          lng: null
        },
        landmarks: []
      },
      registrationFee: '',
      isProject: false,
      projectDetails: {
        totalUnits: '',
        availableUnits: '',
        completionDate: '',
        paymentPlan: ''
      }
    },

    // Service Specific
    serviceDetails: {
      serviceType: 'project-management',
      duration: {
        value: '',
        unit: 'hours'
      },
      deliveryTime: '',
      location: 'on-site',
      requirements: []
    },

    // Status
    status: 'draft',

    // SEO
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    },

    // Features
    isFeatured: false,
    isPromoted: false,
    promotionExpiry: null,

    // Shipping (for physical products)
    shipping: {
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      shippingClass: '',
      freeShipping: false
    }
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Title, description, and category' },
    { id: 2, title: 'Details', description: 'Specific details and features' },
    { id: 3, title: 'Pricing', description: 'Set your price and terms' },
    { id: 4, title: 'Media', description: 'Add photos and videos' },
    { id: 5, title: 'Review', description: 'Review and publish' }
  ];

  useEffect(() => {
    // Check if user can create listings
    if (!user) {
      navigate('/auth/login');
      return;
    }

    // Set default values based on user type
    if (user.userType === 'company') {
      setFormData(prev => ({
        ...prev,
        sellerType: 'company',
        serviceDetails: {
          ...prev.serviceDetails,
          location: 'on-site'
        }
      }));
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.productType) newErrors.productType = 'Product type is required';
        break;

      case 2:
        if (formData.productType === 'real-estate') {
          if (!formData.realEstateDetails.propertyType) {
            newErrors['realEstateDetails.propertyType'] = 'Property type is required';
          }
          if (!formData.realEstateDetails.location.address) {
            newErrors['realEstateDetails.location.address'] = 'Address is required';
          }
        } else if (formData.productType === 'service') {
          if (!formData.serviceDetails.serviceType) {
            newErrors['serviceDetails.serviceType'] = 'Service type is required';
          }
        }
        break;

      case 3:
        if (!formData.pricing.basePrice ||
          isNaN(Number(formData.pricing.basePrice))) {
          newErrors['pricing.basePrice'] = 'Valid price is required';
        } else if (Number(formData.pricing.basePrice) <= 0) {
          newErrors['pricing.basePrice'] = 'Price must be greater than 0';
        }
        break;

      case 4:
        if (formData.media.images.length === 0) {
          newErrors['media.images'] = 'At least one image is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormDataChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear related errors
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  
const handleSubmit = async (publishImmediately = false) => {
  if (!validateStep(currentStep)) return;

  try {
    // Prepare the submission data with proper type conversions
    const submissionData = {
      ...formData,
      // Ensure subcategory is null if empty
      subcategory: formData.subcategory === '' ? null : formData.subcategory,
      // Parse stringified arrays if they exist
      specifications: Array.isArray(formData.specifications) ? 
        formData.specifications : 
        (formData.specifications ? JSON.parse(formData.specifications) : []),
      variants: Array.isArray(formData.variants) ? 
        formData.variants : 
        (formData.variants ? JSON.parse(formData.variants) : []),
      // Convert promotionExpiry to null if it's "null" string
      promotionExpiry: formData.promotionExpiry === "null" ? 
        null : 
        formData.promotionExpiry,
      pricing: {
        ...formData.pricing,
        basePrice: Number(formData.pricing.basePrice),
        salePrice: formData.pricing.salePrice ? Number(formData.pricing.salePrice) : null
      },
      status: publishImmediately ? 'pending' : 'draft'
    };

    // Dispatch the createProduct action
    const resultAction = await dispatch(createProduct(submissionData));

    if (createProduct.fulfilled.match(resultAction)) {
      toast.success(
        publishImmediately
          ? 'Listing submitted for review!'
          : 'Draft saved successfully!'
      );
      navigate('/dashboard/products');
    }
  } catch (error) {
    console.error('Error creating product:', error);
    toast.error('Failed to create listing. Please try again.');
  }
};

  const handleSaveDraft = () => handleSubmit(false);
  const handlePublish = () => handleSubmit(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/products')}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Add New Listing
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create a new property or service listing
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            loading={isLoading}
            disabled={!formData.title.trim()}
          >
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            loading={isLoading}
            disabled={currentStep !== steps.length}
          >
            Publish Listing
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                >
                  {currentStep > step.id ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div
                    className={`text-sm font-medium ${currentStep >= step.id
                        ? 'text-gray-900 dark:text-gray-100'
                        : 'text-gray-500 dark:text-gray-400'
                      }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
                  </div>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block w-16 h-0.5 mx-4 transition-colors ${currentStep > step.id
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <ProductFormWizard
          currentStep={currentStep}
          formData={formData}
          errors={errors}
          onFormDataChange={handleFormDataChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isSubmitting={isLoading}
        />
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Tips for a Great Listing
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use high-quality, well-lit photos to showcase your property/service</li>
              <li>• Write a detailed description highlighting key features and benefits</li>
              <li>• Set competitive pricing based on market research</li>
              <li>• Include all relevant details to help customers make informed decisions</li>
              <li>• Respond quickly to inquiries to increase conversion rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;