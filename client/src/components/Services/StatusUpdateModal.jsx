// components/Services/StatusUpdateModal.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { updateInquiryStatus } from '../../store/slices/serviceInquirySlice';
import { toast } from 'react-hot-toast';

const StatusUpdateModal = ({ isOpen, onClose, currentStatus, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [note, setNote] = useState('');

  const { isSubmitting } = useSelector((state) => state.serviceInquiry);

  const statusOptions = [
    { 
      value: 'pending', 
      label: 'Pending Review', 
      description: 'Inquiry is waiting for initial review',
      icon: ClockIcon,
      color: 'yellow'
    },
    { 
      value: 'under-review', 
      label: 'Under Review', 
      description: 'Currently reviewing the inquiry details',
      icon: ClockIcon,
      color: 'blue'
    },
    { 
      value: 'quoted', 
      label: 'Quoted', 
      description: 'Quote has been submitted to customer',
      icon: CurrencyDollarIcon,
      color: 'purple'
    },
    { 
      value: 'negotiating', 
      label: 'Negotiating', 
      description: 'In discussion with customer about terms',
      icon: CurrencyDollarIcon,
      color: 'orange'
    },
    { 
      value: 'accepted', 
      label: 'Accepted', 
      description: 'Customer accepted the quote',
      icon: CheckCircleIcon,
      color: 'green'
    },
    { 
      value: 'in-progress', 
      label: 'In Progress', 
      description: 'Project work has started',
      icon: ClockIcon,
      color: 'indigo'
    },
    { 
      value: 'completed', 
      label: 'Completed', 
      description: 'Project has been completed successfully',
      icon: CheckCircleIcon,
      color: 'emerald'
    },
    { 
      value: 'cancelled', 
      label: 'Cancelled', 
      description: 'Inquiry was cancelled',
      icon: ExclamationTriangleIcon,
      color: 'red'
    },
    { 
      value: 'rejected', 
      label: 'Rejected', 
      description: 'Inquiry was rejected',
      icon: ExclamationTriangleIcon,
      color: 'gray'
    }
  ];

  const getStatusColor = (color) => {
    const colors = {
      yellow: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
      blue: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
      purple: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20',
      orange: 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20',
      green: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
      indigo: 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20',
      emerald: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20',
      red: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
      gray: 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
    };
    return colors[color] || colors.gray;
  };

  const getIconColor = (color) => {
    const colors = {
      yellow: 'text-yellow-600 dark:text-yellow-400',
      blue: 'text-blue-600 dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
      orange: 'text-orange-600 dark:text-orange-400',
      green: 'text-green-600 dark:text-green-400',
      indigo: 'text-indigo-600 dark:text-indigo-400',
      emerald: 'text-emerald-600 dark:text-emerald-400',
      red: 'text-red-600 dark:text-red-400',
      gray: 'text-gray-600 dark:text-gray-400'
    };
    return colors[color] || colors.gray;
  };

  const handleSubmit = async () => {
    if (selectedStatus === currentStatus && !note.trim()) {
      toast.error('No changes to update');
      return;
    }

    try {
      await onUpdate(selectedStatus, note.trim());
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const selectedOption = statusOptions.find(option => option.value === selectedStatus);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Inquiry Status"
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Current Status */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Current Status</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {statusOptions.find(option => option.value === currentStatus)?.label || currentStatus}
          </p>
        </div>

        {/* Status Selection */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Select New Status</h4>
          <div className="grid grid-cols-1 gap-3">
            {statusOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedStatus === option.value;
              const isCurrent = currentStatus === option.value;
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedStatus(option.value)}
                  disabled={isCurrent}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    isCurrent
                      ? 'border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? `border-primary-500 ${getStatusColor(option.color)}`
                      : `border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${getStatusColor(option.color)}`
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${
                      isCurrent
                        ? 'text-gray-400'
                        : isSelected
                        ? 'text-primary-600 dark:text-primary-400'
                        : getIconColor(option.color)
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className={`font-medium ${
                          isCurrent
                            ? 'text-gray-500 dark:text-gray-400'
                            : isSelected
                            ? 'text-primary-900 dark:text-primary-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {option.label}
                          {isCurrent && <span className="ml-2 text-xs">(Current)</span>}
                        </h5>
                        {isSelected && !isCurrent && (
                          <CheckCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${
                        isCurrent
                          ? 'text-gray-400'
                          : isSelected
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Change Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Update Note {selectedStatus !== currentStatus ? '(Optional)' : ''}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              selectedStatus !== currentStatus
                ? `Add a note about the status change to ${selectedOption?.label}...`
                : 'Add a note about this inquiry...'
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This note will be visible to the customer and added to the inquiry timeline.
          </p>
        </div>

        {/* Warning for critical status changes */}
        {(selectedStatus === 'cancelled' || selectedStatus === 'rejected' || selectedStatus === 'completed') && selectedStatus !== currentStatus && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                <p className="font-medium mb-1">Important:</p>
                <p>
                  {selectedStatus === 'cancelled' && 'Cancelling this inquiry will end the project and notify the customer.'}
                  {selectedStatus === 'rejected' && 'Rejecting this inquiry will decline the project and notify the customer.'}
                  {selectedStatus === 'completed' && 'Marking as completed will close the inquiry and may trigger final processes.'}
                </p>
              </div>
            </div>
          </div>
        )}

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
            disabled={isSubmitting || (selectedStatus === currentStatus && !note.trim())}
            className={selectedStatus === 'cancelled' || selectedStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {selectedStatus === currentStatus ? 'Add Note' : `Update to ${selectedOption?.label}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusUpdateModal;