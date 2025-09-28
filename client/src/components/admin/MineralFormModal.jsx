// components/admin/MineralFormModal.jsx - Fixed Step Navigation
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  XMarkIcon,
  PhotoIcon,
  DocumentIcon,
  TrashIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { createMineral, updateMineral } from '../../store/slices/productSlice';
import { toast } from 'react-hot-toast';

const MineralFormModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  mode = 'create', // 'create' or 'edit'
  mineral = null 
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    shortDescription: '',
    productType: 'minerals',
    
    // Mineral Details
    mineralDetails: {
      mineralName: '',
      mineralType: '',
      origin: {
        country: 'Ethiopia',
        region: '',
        mine: ''
      },
      quality: {
        grade: 'standard',
        purity: ''
      },
      weight: {
        value: '',
        unit: 'kg'
      },
      certification: {
        certified: false,
        certificationBody: '',
        certificateNumber: '',
        validUntil: ''
      }
    },
    
    // Pricing
    pricing: {
      basePrice: '',
      currency: 'ETB',
      priceType: 'per-kg',
      isNegotiable: false
    },
    
    // Inventory
    inventory: {
      stock: '',
      stockUnit: 'kg',
      lowStockThreshold: '1',
      trackInventory: true
    },
    
    // Contact Info
    contactInfo: {
      phone: '',
      email: '',
      preferredContactMethod: 'phone'
    },
    
    // Media
    media: {
      images: [],
      documents: []
    },
    
    // Additional
    tags: '',
    specifications: []
  });

  const [newImages, setNewImages] = useState([]);
  const [newDocuments, setNewDocuments] = useState([]);

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Title, type, and description' },
    { id: 2, title: 'Mineral Details', description: 'Quality, origin, and properties' },
    { id: 3, title: 'Pricing & Stock', description: 'Price and inventory details' },
    { id: 4, title: 'Media & Contact', description: 'Images, documents, and contact info' }
  ];

  const mineralTypes = [
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'copper', label: 'Copper' },
    { value: 'iron', label: 'Iron' },
    { value: 'zinc', label: 'Zinc' },
    { value: 'lead', label: 'Lead' },
    { value: 'gemstones', label: 'Gemstones' },
    { value: 'coal', label: 'Coal' },
    { value: 'salt', label: 'Salt' },
    { value: 'limestone', label: 'Limestone' },
    { value: 'marble', label: 'Marble' },
    { value: 'granite', label: 'Granite' },
    { value: 'sand', label: 'Sand' },
    { value: 'gravel', label: 'Gravel' },
    { value: 'other', label: 'Other' }
  ];

  const qualityGrades = [
    { value: 'premium', label: 'Premium' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'standard', label: 'Standard' },
    { value: 'low', label: 'Low' }
  ];

  const weightUnits = [
    { value: 'grams', label: 'Grams' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'tons', label: 'Tons' }
  ];

  const priceTypes = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'per-kg', label: 'Per Kilogram' },
    { value: 'per-ton', label: 'Per Ton' },
    { value: 'per-unit', label: 'Per Unit' }
  ];

  useEffect(() => {
    if (mode === 'edit' && mineral) {
      setFormData({
        title: mineral.title || '',
        description: mineral.description || '',
        shortDescription: mineral.shortDescription || '',
        productType: 'minerals',
        mineralDetails: {
          mineralName: mineral.mineralDetails?.mineralName || '',
          mineralType: mineral.mineralDetails?.mineralType || '',
          origin: {
            country: mineral.mineralDetails?.origin?.country || 'Ethiopia',
            region: mineral.mineralDetails?.origin?.region || '',
            mine: mineral.mineralDetails?.origin?.mine || ''
          },
          quality: {
            grade: mineral.mineralDetails?.quality?.grade || 'standard',
            purity: mineral.mineralDetails?.quality?.purity || ''
          },
          weight: {
            value: mineral.mineralDetails?.weight?.value || '',
            unit: mineral.mineralDetails?.weight?.unit || 'kg'
          },
          certification: {
            certified: mineral.mineralDetails?.certification?.certified || false,
            certificationBody: mineral.mineralDetails?.certification?.certificationBody || '',
            certificateNumber: mineral.mineralDetails?.certification?.certificateNumber || '',
            validUntil: mineral.mineralDetails?.certification?.validUntil || ''
          }
        },
        pricing: {
          basePrice: mineral.pricing?.basePrice || '',
          currency: mineral.pricing?.currency || 'ETB',
          priceType: mineral.pricing?.priceType || 'per-kg',
          isNegotiable: mineral.pricing?.isNegotiable || false
        },
        inventory: {
          stock: mineral.inventory?.stock || '',
          stockUnit: mineral.inventory?.stockUnit || 'kg',
          lowStockThreshold: mineral.inventory?.lowStockThreshold || '1',
          trackInventory: mineral.inventory?.trackInventory !== false
        },
        contactInfo: {
          phone: mineral.contactInfo?.phone || '',
          email: mineral.contactInfo?.email || '',
          preferredContactMethod: mineral.contactInfo?.preferredContactMethod || 'phone'
        },
        media: {
          images: mineral.media?.images || [],
          documents: mineral.media?.documents || []
        },
        tags: mineral.tags?.join(', ') || '',
        specifications: mineral.specifications || []
      });
    }
  }, [mode, mineral]);

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.mineralDetails.mineralName.trim()) newErrors.mineralName = 'Mineral name is required';
        if (!formData.mineralDetails.mineralType) newErrors.mineralType = 'Mineral type is required';
        break;
        
      case 2:
        if (!formData.mineralDetails.origin.country) newErrors.originCountry = 'Origin country is required';
        if (!formData.mineralDetails.quality.grade) newErrors.qualityGrade = 'Quality grade is required';
        break;
        
      case 3:
        if (!formData.pricing.basePrice || isNaN(formData.pricing.basePrice) || formData.pricing.basePrice <= 0) {
          newErrors.basePrice = 'Valid price is required';
        }
        if (!formData.inventory.stock || isNaN(formData.inventory.stock) || formData.inventory.stock < 0) {
          newErrors.stock = 'Valid stock quantity is required';
        }
        break;
        
      case 4:
        // Optional validation for contact info - step 4 is mainly for media
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate all required steps before final submission
  const validateAllSteps = () => {
    const allErrors = {};
    
    // Validate step 1
    if (!formData.title.trim()) allErrors.title = 'Title is required';
    if (!formData.description.trim()) allErrors.description = 'Description is required';
    if (!formData.mineralDetails.mineralName.trim()) allErrors.mineralName = 'Mineral name is required';
    if (!formData.mineralDetails.mineralType) allErrors.mineralType = 'Mineral type is required';
    
    // Validate step 2
    if (!formData.mineralDetails.origin.country) allErrors.originCountry = 'Origin country is required';
    if (!formData.mineralDetails.quality.grade) allErrors.qualityGrade = 'Quality grade is required';
    
    // Validate step 3
    if (!formData.pricing.basePrice || isNaN(formData.pricing.basePrice) || formData.pricing.basePrice <= 0) {
      allErrors.basePrice = 'Valid price is required';
    }
    if (!formData.inventory.stock || isNaN(formData.inventory.stock) || formData.inventory.stock < 0) {
      allErrors.stock = 'Valid stock quantity is required';
    }
    
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const handleNext = () => {
    console.log('handleNext called, current step:', activeStep);
    if (validateStep(activeStep)) {
      console.log('Validation passed, moving to next step');
      setActiveStep(prev => Math.min(prev + 1, steps.length));
    } else {
      console.log('Validation failed for step:', activeStep, 'errors:', errors);
    }
  };

  const handlePrev = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    
    // Clear error for this field
    if (errors[path.split('.').pop()]) {
      setErrors(prev => ({
        ...prev,
        [path.split('.').pop()]: undefined
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImageFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      alt: '',
      isMain: newImages.length === 0 && formData.media.images.length === 0
    }));
    setNewImages(prev => [...prev, ...newImageFiles]);
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocFiles = files.map(file => ({
      file,
      name: file.name,
      size: file.size
    }));
    setNewDocuments(prev => [...prev, ...newDocFiles]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        images: prev.media.images.filter((_, i) => i !== index)
      }
    }));
  };

  const removeNewDocument = (index) => {
    setNewDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        documents: prev.media.documents.filter((_, i) => i !== index)
      }
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { name: '', value: '', group: 'general' }]
    }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called, current step:', activeStep);
    
    // Only submit if we're on the last step
    if (activeStep !== steps.length) {
      console.log('Not on last step, returning');
      return;
    }
    
    // Validate all steps before submission
    if (!validateAllSteps()) {
      console.log('Validation failed for all steps:', errors);
      toast.error('Please fill in all required fields');
      // Go to the first step with errors
      if (errors.title || errors.description || errors.mineralName || errors.mineralType) {
        setActiveStep(1);
      } else if (errors.originCountry || errors.qualityGrade) {
        setActiveStep(2);
      } else if (errors.basePrice || errors.stock) {
        setActiveStep(3);
      }
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        media: {
          ...formData.media,
          images: [
            ...formData.media.images,
            ...newImages.map(img => ({
              file: img.file,
              alt: img.alt,
              isMain: img.isMain
            }))
          ],
          documents: [
            ...formData.media.documents,
            ...newDocuments
          ]
        }
      };

      console.log('Submitting data:', submitData);

      if (mode === 'create') {
        await dispatch(createMineral(submitData)).unwrap();
        toast.success('Mineral created successfully!');
      } else {
        await dispatch(updateMineral({ id: mineral._id, mineralData: submitData })).unwrap();
        toast.success('Mineral updated successfully!');
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(mode === 'create' ? 'Failed to create mineral' : 'Failed to update mineral');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    newImages.forEach(img => URL.revokeObjectURL(img.preview));
    setNewImages([]);
    setNewDocuments([]);
    setActiveStep(1);
    setErrors({});
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Title *
        </label>
        <Input
          placeholder="e.g., High Grade Gold Ore"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          error={errors.title}
          className="text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Mineral Name *
        </label>
        <Input
          placeholder="e.g., Gold"
          value={formData.mineralDetails.mineralName}
          onChange={(e) => handleInputChange('mineralDetails.mineralName', e.target.value)}
          error={errors.mineralName}
          className="text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Mineral Type *
        </label>
        <select
          value={formData.mineralDetails.mineralType}
          onChange={(e) => handleInputChange('mineralDetails.mineralType', e.target.value)}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
            errors.mineralType ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
        >
          <option value="">Select mineral type</option>
          {mineralTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.mineralType && (
          <p className="text-red-500 text-xs mt-1">{errors.mineralType}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Description *
        </label>
        <textarea
          placeholder="Detailed description of the mineral..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200 ${
            errors.description ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Short Description
        </label>
        <Input
          placeholder="Brief summary..."
          value={formData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          className="text-sm"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Origin */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Origin Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Country *
            </label>
            <Input
              placeholder="e.g., Ethiopia"
              value={formData.mineralDetails.origin.country}
              onChange={(e) => handleInputChange('mineralDetails.origin.country', e.target.value)}
              error={errors.originCountry}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Region
            </label>
            <Input
              placeholder="e.g., Oromia"
              value={formData.mineralDetails.origin.region}
              onChange={(e) => handleInputChange('mineralDetails.origin.region', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Mine/Source
            </label>
            <Input
              placeholder="e.g., Lega Dembi Mine"
              value={formData.mineralDetails.origin.mine}
              onChange={(e) => handleInputChange('mineralDetails.origin.mine', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Quality */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Quality Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Quality Grade *
            </label>
            <select
              value={formData.mineralDetails.quality.grade}
              onChange={(e) => handleInputChange('mineralDetails.quality.grade', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors.qualityGrade ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
            >
              {qualityGrades.map(grade => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
            {errors.qualityGrade && (
              <p className="text-red-500 text-xs mt-1">{errors.qualityGrade}</p>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Purity (%)
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g., 99.5"
              value={formData.mineralDetails.quality.purity}
              onChange={(e) => handleInputChange('mineralDetails.quality.purity', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Weight */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Physical Properties</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Weight
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 1.5"
              value={formData.mineralDetails.weight.value}
              onChange={(e) => handleInputChange('mineralDetails.weight.value', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Weight Unit
            </label>
            <select
              value={formData.mineralDetails.weight.unit}
              onChange={(e) => handleInputChange('mineralDetails.weight.unit', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              {weightUnits.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Certification */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Certification</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.mineralDetails.certification.certified}
              onChange={(e) => handleInputChange('mineralDetails.certification.certified', e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm text-slate-700 dark:text-slate-300">
              This mineral is certified
            </label>
          </div>
          
          {formData.mineralDetails.certification.certified && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Certifying Body
                </label>
                <Input
                  placeholder="e.g., Ethiopian Geological Survey"
                  value={formData.mineralDetails.certification.certificationBody}
                  onChange={(e) => handleInputChange('mineralDetails.certification.certificationBody', e.target.value)}
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Certificate Number
                </label>
                <Input
                  placeholder="e.g., EGS-2024-001"
                  value={formData.mineralDetails.certification.certificateNumber}
                  onChange={(e) => handleInputChange('mineralDetails.certification.certificateNumber', e.target.value)}
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Valid Until
                </label>
                <Input
                  type="date"
                  value={formData.mineralDetails.certification.validUntil}
                  onChange={(e) => handleInputChange('mineralDetails.certification.validUntil', e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      {/* Pricing */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Pricing Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Base Price (ETB) *
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 50000"
              value={formData.pricing.basePrice}
              onChange={(e) => handleInputChange('pricing.basePrice', e.target.value)}
              error={errors.basePrice}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Price Type
            </label>
            <select
              value={formData.pricing.priceType}
              onChange={(e) => handleInputChange('pricing.priceType', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              {priceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.pricing.isNegotiable}
                onChange={(e) => handleInputChange('pricing.isNegotiable', e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Price is negotiable
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Inventory Management</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Stock Quantity *
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 100"
              value={formData.inventory.stock}
              onChange={(e) => handleInputChange('inventory.stock', e.target.value)}
              error={errors.stock}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Stock Unit
            </label>
            <select
              value={formData.inventory.stockUnit}
              onChange={(e) => handleInputChange('inventory.stockUnit', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              {weightUnits.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Low Stock Threshold
            </label>
            <Input
              type="number"
              min="0"
              placeholder="e.g., 10"
              value={formData.inventory.lowStockThreshold}
              onChange={(e) => handleInputChange('inventory.lowStockThreshold', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.inventory.trackInventory}
              onChange={(e) => handleInputChange('inventory.trackInventory', e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm text-slate-700 dark:text-slate-300">
              Track inventory levels
            </label>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center justify-between">
          Additional Specifications
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSpecification}
            leftIcon={<PlusIcon className="h-3 w-3" />}
            className="text-xs py-1 px-2"
          >
            Add Specification
          </Button>
        </h4>
        
        {formData.specifications.length > 0 ? (
          <div className="space-y-2">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Property name"
                  value={spec.name}
                  onChange={(e) => updateSpecification(index, 'name', e.target.value)}
                  className="flex-1 text-sm"
                />
                <Input
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSpecification(index)}
                  leftIcon={<TrashIcon className="h-3 w-3" />}
                  className="text-red-600 hover:text-red-700 text-xs py-1 px-2"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-xs italic">
            No specifications added yet. Click "Add Specification" to add custom properties.
          </p>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      {/* Images */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Images</h4>
        
        {/* Existing Images */}
        {formData.media.images.length > 0 && (
          <div className="mb-3">
            <h5 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Current Images</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {formData.media.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        {newImages.length > 0 && (
          <div className="mb-3">
            <h5 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">New Images</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {newImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`New image ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                  {image.isMain && (
                    <div className="absolute bottom-0.5 left-0.5 bg-blue-500 text-white px-1 py-0.5 text-xs rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 transition-colors duration-200 hover:border-blue-400">
          <div className="text-center">
            <PhotoIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              <label className="cursor-pointer">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Upload images
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
              <span> or drag and drop</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Documents</h4>
        
        {/* Existing Documents */}
        {formData.media.documents.length > 0 && (
          <div className="mb-3">
            <h5 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Current Documents</h5>
            <div className="space-y-1">
              {formData.media.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DocumentIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-xs text-slate-900 dark:text-slate-100">
                      {doc.name || `Document ${index + 1}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingDocument(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Documents */}
        {newDocuments.length > 0 && (
          <div className="mb-3">
            <h5 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">New Documents</h5>
            <div className="space-y-1">
              {newDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DocumentIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <span className="text-xs text-slate-900 dark:text-slate-100">{doc.name}</span>
                      <span className="text-xs text-slate-500 ml-2">
                        ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewDocument(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 transition-colors duration-200 hover:border-blue-400">
          <div className="text-center">
            <DocumentIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              <label className="cursor-pointer">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Upload documents
                </span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleDocumentUpload}
                  className="sr-only"
                />
              </label>
              <span> or drag and drop</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              PDF, DOC, DOCX, TXT up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <Input
              placeholder="e.g., +251911123456"
              value={formData.contactInfo.phone}
              onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="e.g., contact@example.com"
              value={formData.contactInfo.email}
              onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Preferred Contact Method
            </label>
            <select
              value={formData.contactInfo.preferredContactMethod}
              onChange={(e) => handleInputChange('contactInfo.preferredContactMethod', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="any">Any</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Tags</h4>
        <Input
          placeholder="e.g., rare, premium, certified (comma-separated)"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          className="text-sm"
        />
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
          Enter tags separated by commas to help with search and categorization
        </p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200/60 dark:border-slate-700/60"
        >
          {/* Header - Fixed */}
          <div className="flex-shrink-0 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {mode === 'create' ? 'Add New Mineral' : 'Edit Mineral'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Step {activeStep} of {steps.length}: {steps[activeStep - 1].description}
                </p>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Compact Progress Steps */}
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      activeStep >= step.id
                        ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                        : 'border-slate-300 text-slate-400'
                    }`}>
                      {activeStep > step.id ? (
                        <CheckIcon className="h-3 w-3" />
                      ) : (
                        <span className="text-xs font-bold">{step.id}</span>
                      )}
                    </div>
                    <div className="ml-2 text-xs">
                      <div className={`font-medium ${
                        activeStep >= step.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 mx-3 h-0.5 transition-all duration-300 ${
                        activeStep > step.id ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
            <div className="px-5 py-4">
              {renderStepContent()}
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex-shrink-0 bg-gradient-to-r from-slate-100/80 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 px-5 py-3 border-t border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {activeStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={isLoading}
                    className="text-sm py-2 px-4"
                  >
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="text-sm py-2 px-4"
                >
                  Cancel
                </Button>
                
                {activeStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm py-2 px-4"
                  >
                    Next
                  </Button>
                ) : (
                  <form onSubmit={handleSubmit} className="inline">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      leftIcon={isLoading ? <LoadingSpinner size="sm" /> : null}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-sm py-2 px-4"
                    >
                      {isLoading 
                        ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                        : (mode === 'create' ? 'Create Mineral' : 'Update Mineral')
                      }
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MineralFormModal;