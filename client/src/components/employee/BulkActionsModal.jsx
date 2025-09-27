// components/employee/BulkActionsModal.jsx
import { useState } from 'react';
import { XMarkIcon, CheckIcon, XMarkIcon as CancelIcon, ClockIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const BulkActionsModal = ({ selectedAppointments, appointments, isOpen, onClose, onBulkAction }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAction) return;

    setLoading(true);
    try {
      await onBulkAction(selectedAction, selectedAppointments, { notes });
    } finally {
      setLoading(false);
    }
  };

  const actionOptions = [
    { value: 'confirmed', label: 'Confirm Appointments', icon: <CheckIcon className="h-4 w-4" />, color: 'green' },
    { value: 'completed', label: 'Mark as Completed', icon: <CheckIcon className="h-4 w-4" />, color: 'blue' },
    { value: 'cancelled', label: 'Cancel Appointments', icon: <CancelIcon className="h-4 w-4" />, color: 'red' },
    { value: 'no-show', label: 'Mark as No Show', icon: <ClockIcon className="h-4 w-4" />, color: 'gray' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

        <div className="relative inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Bulk Actions ({selectedAppointments.length} appointments)
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Selected Appointments Preview */}
            <div className="mb-6 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected Appointments:
              </h4>
              <div className="space-y-2">
                {appointments.slice(0, 5).map(appointment => (
                  <div key={appointment._id} className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    {appointment.property?.title} - {appointment.contactInfo?.name}
                  </div>
                ))}
                {appointments.length > 5 && (
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    +{appointments.length - 5} more appointments
                  </div>
                )}
              </div>
            </div>

            {/* Action Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Action *
              </label>
              <div className="space-y-2">
                {actionOptions.map(action => (
                  <label key={action.value} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input
                      type="radio"
                      name="action"
                      value={action.value}
                      checked={selectedAction === action.value}
                      onChange={(e) => setSelectedAction(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className={`w-8 h-8 rounded-lg ml-3 mr-3 flex items-center justify-center text-white ${
                      action.color === 'green' ? 'bg-green-500' :
                      action.color === 'blue' ? 'bg-blue-500' :
                      action.color === 'red' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}>
                      {action.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {action.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <Input
                label="Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for this bulk action..."
                multiline
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!selectedAction || loading}
              >
                {loading ? 'Processing...' : `Apply to ${selectedAppointments.length} appointments`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsModal;