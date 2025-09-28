// components/admin/BulkMineralActionsModal.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  TruckIcon,
  TagIcon,
  ClockIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';

const BulkMineralActionsModal = ({ 
  isOpen, 
  onClose, 
  selectedMinerals, 
  minerals, 
  onBulkAction 
}) => {
  const [activeAction, setActiveAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    price: '',
    priceType: 'fixed',
    qualityGrade: '',
    verified: '',
    tags: '',
    notes: ''
  });

  const bulkActions = [
    {
      id: 'status',
      title: 'Update Status',
      description: 'Change the status of selected minerals',
      icon: TagIcon,
      color: 'blue'
    },
    {
      id: 'price',
      title: 'Update Pricing',
      description: 'Modify prices for selected minerals',
      icon: CurrencyDollarIcon,
      color: 'green'
    },
    {
      id: 'quality',
      title: 'Update Quality',
      description: 'Change quality grades',
      icon: BeakerIcon,
      color: 'purple'
    },
    {
      id: 'verify',
      title: 'Verification Status',
      description: 'Mark minerals as verified/unverified',
      icon: CheckIcon,
      color: 'emerald'
    },
    {
      id: 'tags',
      title: 'Add Tags',
      description: 'Add tags to selected minerals',
      icon: TagIcon,
      color: 'indigo'
    },
    {
      id: 'delete',
      title: 'Delete Minerals',
      description: 'Permanently delete selected minerals',
      icon: TrashIcon,
      color: 'red'
    }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'sold', label: 'Sold' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'discontinued', label: 'Discontinued' }
  ];

  const qualityGradeOptions = [
    { value: 'premium', label: 'Premium' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'standard', label: 'Standard' },
    { value: 'low', label: 'Low' }
  ];

  const priceTypeOptions = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'per-kg', label: 'Per Kilogram' },
    { value: 'per-ton', label: 'Per Ton' },
    { value: 'per-unit', label: 'Per Unit' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let actionData = {};

      switch (activeAction) {
        case 'status':
          if (!formData.status) {
            toast.error('Please select a status');
            return;
          }
          actionData = { status: formData.status };
          break;

        case 'price':
          if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
            toast.error('Please enter a valid price');
            return;
          }
          actionData = {
            'pricing.basePrice': parseFloat(formData.price),
            'pricing.priceType': formData.priceType
          };
          break;

        case 'quality':
          if (!formData.qualityGrade) {
            toast.error('Please select a quality grade');
            return;
          }
          actionData = { 'mineralDetails.quality.grade': formData.qualityGrade };
          break;

        case 'verify':
          if (formData.verified === '') {
            toast.error('Please select verification status');
            return;
          }
          actionData = { isVerified: formData.verified === 'true' };
          break;

        case 'tags':
          if (!formData.tags.trim()) {
            toast.error('Please enter tags');
            return;
          }
          const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
          actionData = { $addToSet: { tags: { $each: tags } } };
          break;

        case 'delete':
          if (!window.confirm(`Are you sure you want to delete ${selectedMinerals.length} minerals? This action cannot be undone.`)) {
            return;
          }
          actionData = { delete: true };
          break;

        default:
          toast.error('Please select an action');
          return;
      }

      await onBulkAction(activeAction, selectedMinerals, actionData);
      onClose();
      
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Failed to perform bulk action');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      status: '',
      price: '',
      priceType: 'fixed',
      qualityGrade: '',
      verified: '',
      tags: '',
      notes: ''
    });
    setActiveAction('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
      red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
    };
    return colors[color] || colors.blue;
  };

  const renderActionForm = () => {
    switch (activeAction) {
      case 'status':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'price':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Price (ETB)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter new price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Type
              </label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
              >
                {priceTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'quality':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quality Grade
            </label>
            <select
              value={formData.qualityGrade}
              onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select Quality Grade</option>
              {qualityGradeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'verify':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verification Status
            </label>
            <select
              value={formData.verified}
              onChange={(e) => setFormData({ ...formData, verified: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select Verification Status</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
        );

      case 'tags':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <Input
              placeholder="e.g., rare, premium, certified"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter tags separated by commas. They will be added to existing tags.
            </p>
          </div>
        );

      case 'delete':
        return (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400 mb-2">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span className="font-medium">Warning: Permanent Deletion</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">
              This action will permanently delete {selectedMinerals.length} minerals. 
              This cannot be undone. All associated data including images and documents will be lost.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Bulk Actions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Perform actions on {selectedMinerals.length} selected minerals
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Selected Minerals Preview */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected Minerals ({selectedMinerals.length})
              </h4>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {minerals.slice(0, 10).map(mineral => (
                  <span
                    key={mineral._id}
                    className="inline-block px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    {mineral.title}
                  </span>
                ))}
                {minerals.length > 10 && (
                  <span className="inline-block px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                    +{minerals.length - 10} more
                  </span>
                )}
              </div>
            </div>

            {/* Action Selection */}
            {!activeAction ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Choose an action to perform:
                </h4>
                {bulkActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => setActiveAction(action.id)}
                    className={`w-full flex items-center space-x-3 p-4 border-2 rounded-lg transition-all hover:shadow-md ${getColorClasses(action.color)}`}
                  >
                    <action.icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm opacity-75">{action.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Action Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setActiveAction('')}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    ← Back to actions
                  </button>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {bulkActions.find(a => a.id === activeAction)?.title}
                  </h4>
                  {renderActionForm()}
                </div>

                {/* Notes */}
                {activeAction !== 'delete' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      placeholder="Add any notes about this bulk action..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant={activeAction === 'delete' ? 'danger' : 'primary'}
                    disabled={isLoading}
                    leftIcon={isLoading ? <LoadingSpinner size="sm" /> : null}
                  >
                    {isLoading 
                      ? 'Processing...' 
                      : activeAction === 'delete' 
                        ? `Delete ${selectedMinerals.length} Minerals`
                        : 'Apply Changes'
                    }
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default BulkMineralActionsModal;