import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import ProductFormWizard from '../../components/dashboard/ProductFormWizard';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Title, description, and category' },
    { id: 2, title: 'Details', description: 'Specific details and features' },
    { id: 3, title: 'Pricing', description: 'Set your price and terms' },
    { id: 4, title: 'Media', description: 'Add photos and videos' },
    { id: 5, title: 'Review', description: 'Review and update' }
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (formData && originalData) {
      const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, originalData]);

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to fetch product
      setTimeout(() => {
        const mockProduct = {
          _id: id,
          title: 'Modern 3BR Apartment in CMC',
          description: 'Beautiful modern apartment with stunning city views, located in the heart of CMC. This spacious 3-bedroom, 2-bathroom unit features contemporary design, high-quality finishes, and premium amenities.',
          category: 'real-estate',
          type: 'real-estate',
          
          pricing: {
            basePrice: 2500000,
            priceType: 'sale',
            currency: 'ETB',
            negotiable: true,
            discountPercentage: 0,
            originalPrice: ''
          },

          media: {
            images: [
              { id: 1, name: 'living-room.jpg', size: 1024000, type: 'image/jpeg', url: '/api/placeholder/400/300' },
              { id: 2, name: 'kitchen.jpg', size: 896000, type: 'image/jpeg', url: '/api/placeholder/400/300' }
            ],
            videos: [],
            documents: []
          },

          realEstateDetails: {
            propertyType: 'apartment',
            listingType: 'sale',
            bedrooms: '3',
            bathrooms: '2',
            area: '120',
            yearBuilt: '2020',
            furnishingStatus: 'semi-furnished',
            parkingSpaces: '1',
            floorNumber: '5',
            totalFloors: '12',
            facing: 'east',
            constructionStatus: 'ready',
            location: {
              address: 'CMC Area, near Edna Mall',
              city: 'Addis Ababa',
              state: 'Addis Ababa',
              zipCode: '',
              coordinates: null,
              nearbyPlaces: []
            },
            features: ['Swimming Pool', 'Gym/Fitness Center', 'Parking', 'Air Conditioning'],
            amenities: ['Security 24/7', 'Elevator', 'Generator', 'Water Tank']
          },

          serviceDetails: {
            serviceType: '',
            duration: '',
            serviceArea: '',
            availability: '',
            experienceLevel: '',
            teamSize: '',
            languages: [],
            certifications: [],
            features: [],
            instantBooking: false
          },

          condition: 'excellent',
          brand: '',
          model: '',
          warranty: '',
          tags: ['modern', 'luxury', 'prime location'],
          featured: true,
          status: 'active',
          availability: 'available',
          urgency: 'normal',
          terms: '',
          additionalInfo: '',
          
          // Metadata
          seller: user,
          views: 245,
          inquiries: 12,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        };

        setFormData(mockProduct);
        setOriginalData(JSON.parse(JSON.stringify(mockProduct)));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      navigate('/dashboard/products');
      setIsLoading(false);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.category) newErrors.category = 'Category is required';
        break;

      case 2:
        if (formData.type === 'real-estate') {
          if (!formData.realEstateDetails.propertyType) {
            newErrors['realEstateDetails.propertyType'] = 'Property type is required';
          }
          if (!formData.realEstateDetails.location.address.trim()) {
            newErrors['realEstateDetails.location.address'] = 'Address is required';
          }
        } else if (formData.type === 'service') {
          if (!formData.serviceDetails.serviceType) {
            newErrors['serviceDetails.serviceType'] = 'Service type is required';
          }
          if (!formData.serviceDetails.serviceArea.trim()) {
            newErrors['serviceDetails.serviceArea'] = 'Service area is required';
          }
        }
        break;

      case 3:
        if (!formData.pricing.basePrice || formData.pricing.basePrice <= 0) {
          newErrors['pricing.basePrice'] = 'Valid price is required';
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

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        status: publishImmediately ? 'active' : formData.status,
        updatedAt: new Date().toISOString()
      };

      // API call to update product
      console.log('Updating product:', submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update original data to reflect saved state
      setOriginalData(JSON.parse(JSON.stringify(submissionData)));
      setHasUnsavedChanges(false);
      
      toast.success('Listing updated successfully!');
      
      if (publishImmediately && formData.status === 'draft') {
        toast.success('Listing is now published and visible to customers!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      // API call to delete product
      console.log('Deleting product:', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Listing deleted successfully');
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete listing');
    }
  };

  const handleSaveDraft = () => handleSubmit(false);
  const handlePublish = () => handleSubmit(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The product you're trying to edit doesn't exist or you don't have permission to edit it.
        </p>
        <Button onClick={() => navigate('/dashboard/products')}>
          Back to My Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (hasUnsavedChanges) {
                if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                  navigate('/dashboard/products');
                }
              } else {
                navigate('/dashboard/products');
              }
            }}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Edit Listing
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your {formData.type === 'real-estate' ? 'property' : 'service'} listing
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              Unsaved changes
            </span>
          )}
          
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 border-red-300 hover:bg-red-50"
            leftIcon={<TrashIcon className="h-4 w-4" />}
          >
            Delete
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            loading={isSubmitting}
            disabled={!hasUnsavedChanges}
          >
            Save Changes
          </Button>
          
          {formData.status === 'draft' && (
            <Button
              onClick={handlePublish}
              loading={isSubmitting}
              disabled={currentStep !== steps.length}
            >
              Publish Now
            </Button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-lg p-4 ${
        formData.status === 'active'
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : formData.status === 'pending'
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
          : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              formData.status === 'active' ? 'bg-green-500'
              : formData.status === 'pending' ? 'bg-yellow-500'
              : 'bg-gray-500'
            }`} />
            <div>
              <p className={`font-medium ${
                formData.status === 'active' ? 'text-green-900 dark:text-green-100'
                : formData.status === 'pending' ? 'text-yellow-900 dark:text-yellow-100'
                : 'text-gray-900 dark:text-gray-100'
              }`}>
                Status: {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </p>
              <p className={`text-sm ${
                formData.status === 'active' ? 'text-green-700 dark:text-green-300'
                : formData.status === 'pending' ? 'text-yellow-700 dark:text-yellow-300'
                : 'text-gray-600 dark:text-gray-400'
              }`}>
                {formData.status === 'active' && 'Your listing is live and visible to customers'}
                {formData.status === 'pending' && 'Your listing is under review and will be published soon'}
                {formData.status === 'draft' && 'Your listing is saved as draft and not visible to customers'}
              </p>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formData.views} views • {formData.inquiries} inquiries
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                      : currentStep === step.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </button>
                <div className="ml-3 hidden sm:block">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.id
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
                  className={`hidden sm:block w-16 h-0.5 mx-4 transition-colors ${
                    currentStep > step.id
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
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Listing"
        message={`Are you sure you want to delete "${formData.title}"? This action cannot be undone and you will lose all associated data including views and inquiries.`}
        confirmText="Delete Listing"
        confirmVariant="danger"
      />
    </div>
  );
};

export default EditProduct;