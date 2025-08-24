// components/Services/QuoteSubmissionModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { submitQuote } from '../../store/slices/serviceInquirySlice';
import { toast } from 'react-hot-toast';

const QuoteSubmissionModal = ({ isOpen, onClose, inquiry }) => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'ETB',
    breakdown: [],
    timeline: {
      estimatedDays: '',
      startDate: '',
      milestones: []
    },
    terms: '',
    validUntil: ''
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { isSubmitting } = useSelector((state) => state.serviceInquiry);

  useEffect(() => {
    if (isOpen) {
      // Set default valid until date (30 days from now)
      const defaultValidUntil = new Date();
      defaultValidUntil.setDate(defaultValidUntil.getDate() + 30);
      
      setFormData(prev => ({
        ...prev,
        validUntil: defaultValidUntil.toISOString().split('T')[0],
        currency: inquiry?.projectDetails?.budget?.currency || 'ETB'
      }));
    } else {
      // Reset form when modal closes
      setFormData({
        amount: '',
        currency: 'ETB',
        breakdown: [],
        timeline: {
          estimatedDays: '',
          startDate: '',
          milestones: []
        },
        terms: '',
        validUntil: ''
      });
      setErrors({});
    }
  }, [isOpen, inquiry]);

  const handleInputChange = (field, value) => {
    const keys = field.split('.');
    setFormData(prev => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addBreakdownItem = () => {
    setFormData(prev => ({
      ...prev,
      breakdown: [...prev.breakdown, { item: '', cost: '', description: '' }]
    }));
  };

  const updateBreakdownItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      breakdown: prev.breakdown.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeBreakdownItem = (index) => {
    setFormData(prev => ({
      ...prev,
      breakdown: prev.breakdown.filter((_, i) => i !== index)
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: [...prev.timeline.milestones, { name: '', date: '', description: '' }]
      }
    }));
  };

  const updateMilestone = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: prev.timeline.milestones.map((milestone, i) => 
          i === index ? { ...milestone, [field]: value } : milestone
        )
      }
    }));
  };

  const removeMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: prev.timeline.milestones.filter((_, i) => i !== index)
      }
    }));
  };

  const calculateTotal = () => {
    const breakdownTotal = formData.breakdown.reduce((sum, item) => 
      sum + (parseFloat(item.cost) || 0), 0
    );
    
    if (breakdownTotal > 0 && breakdownTotal !== parseFloat(formData.amount)) {
      return breakdownTotal;
    }
    
    return parseFloat(formData.amount) || 0;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Quote amount is required and must be greater than 0';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required';
    } else if (new Date(formData.validUntil) <= new Date()) {
      newErrors.validUntil = 'Valid until date must be in the future';
    }

    if (formData.timeline.estimatedDays && parseFloat(formData.timeline.estimatedDays) <= 0) {
      newErrors['timeline.estimatedDays'] = 'Estimated days must be greater than 0';
    }

    if (formData.timeline.startDate && new Date(formData.timeline.startDate) < new Date()) {
      newErrors['timeline.startDate'] = 'Start date cannot be in the past';
    }

    // Validate breakdown if provided
    formData.breakdown.forEach((item, index) => {
      if (item.item && (!item.cost || parseFloat(item.cost) <= 0)) {
        newErrors[`breakdown.${index}.cost`] = 'Cost is required for breakdown items';
      }
    });

    // Validate milestones if provided
    formData.timeline.milestones.forEach((milestone, index) => {
      if (milestone.name && !milestone.date) {
        newErrors[`milestone.${index}.date`] = 'Date is required for milestones';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Prepare quote data
      const quoteData = {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        breakdown: formData.breakdown.filter(item => item.item && item.cost),
        timeline: {
          estimatedDays: formData.timeline.estimatedDays ? parseInt(formData.timeline.estimatedDays) : undefined,
          startDate: formData.timeline.startDate || undefined,
          milestones: formData.timeline.milestones.filter(milestone => milestone.name && milestone.date)
        },
        terms: formData.terms,
        validUntil: formData.validUntil
      };

      await dispatch(submitQuote({
        inquiryId: inquiry._id,
        quoteData
      })).unwrap();

      toast.success('Quote submitted successfully!');
      onClose();

    } catch (error) {
      console.error('Submit quote error:', error);
      toast.error(error || 'Failed to submit quote');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Quote"
      size="xl"
      className="max-w-4xl"
    >
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        {/* Inquiry Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Quote for: {inquiry?.projectDetails?.title}
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Service: {inquiry?.serviceType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
          {inquiry?.projectDetails?.budget?.min && inquiry?.projectDetails?.budget?.max && (
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Customer Budget: {inquiry.projectDetails.budget.min.toLocaleString()} - {inquiry.projectDetails.budget.max.toLocaleString()} {inquiry.projectDetails.budget.currency}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {/* Basic Quote Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quote Amount *
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="Enter quote amount"
                leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                error={errors.amount}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
              >
                <option value="ETB">ETB (Ethiopian Birr)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Duration (days)
              </label>
              <Input
                type="number"
                value={formData.timeline.estimatedDays}
                onChange={(e) => handleInputChange('timeline.estimatedDays', e.target.value)}
                placeholder="Number of days"
                error={errors['timeline.estimatedDays']}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Proposed Start Date
              </label>
              <Input
                type="date"
                value={formData.timeline.startDate}
                onChange={(e) => handleInputChange('timeline.startDate', e.target.value)}
                leftIcon={<CalendarIcon className="h-4 w-4" />}
                error={errors['timeline.startDate']}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valid Until *
            </label>
            <Input
              type="date"
              value={formData.validUntil}
              onChange={(e) => handleInputChange('validUntil', e.target.value)}
              leftIcon={<CalendarIcon className="h-4 w-4" />}
              error={errors.validUntil}
            />
          </div>

          {/* Cost Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Cost Breakdown (Optional)
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={addBreakdownItem}
                leftIcon={<PlusIcon className="h-4 w-4" />}
              >
                Add Item
              </Button>
            </div>

            {formData.breakdown.length > 0 && (
              <div className="space-y-3">
                {formData.breakdown.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-4">
                      <Input
                        placeholder="Item name"
                        value={item.item}
                        onChange={(e) => updateBreakdownItem(index, 'item', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Cost"
                        value={item.cost}
                        onChange={(e) => updateBreakdownItem(index, 'cost', e.target.value)}
                        error={errors[`breakdown.${index}.cost`]}
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        placeholder="Description (optional)"
                        value={item.description}
                        onChange={(e) => updateBreakdownItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeBreakdownItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Breakdown:</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {calculateTotal().toLocaleString()} {formData.currency}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Project Milestones (Optional)
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={addMilestone}
                leftIcon={<PlusIcon className="h-4 w-4" />}
              >
                Add Milestone
              </Button>
            </div>

            {formData.timeline.milestones.length > 0 && (
              <div className="space-y-3">
                {formData.timeline.milestones.map((milestone, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-3">
                      <Input
                        placeholder="Milestone name"
                        value={milestone.name}
                        onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="date"
                        value={milestone.date}
                        onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                        error={errors[`milestone.${index}.date`]}
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        placeholder="Description (optional)"
                        value={milestone.description}
                        onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeMilestone(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Terms & Conditions
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              placeholder="Enter any terms, conditions, or additional notes..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<DocumentTextIcon className="h-4 w-4" />}
          >
            Submit Quote
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QuoteSubmissionModal;