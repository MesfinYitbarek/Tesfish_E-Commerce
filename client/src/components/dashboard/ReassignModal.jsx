// components/dashboard/ReassignModal.jsx
import { useState } from 'react';
import { XMarkIcon, ArrowPathIcon, UserIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ReassignModal = ({ appointment, employees, onClose, onReassign }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    setLoading(true);
    try {
      await onReassign(appointment._id, selectedEmployee, reason);
    } finally {
      setLoading(false);
    }
  };

  const currentEmployee = appointment.assignedTo;
  const availableEmployees = employees.filter(emp => emp._id !== currentEmployee?._id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

        <div className="relative inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <ArrowPathIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Reassign Appointment
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Current Assignment */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currently Assigned To:
              </h4>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {currentEmployee?.employeeProfile?.firstName} {currentEmployee?.employeeProfile?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {currentEmployee?.employeeProfile?.department?.replace('-', ' ')} - {currentEmployee?.employeeProfile?.position}
                  </p>
                </div>
              </div>
            </div>

            {/* New Assignment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reassign to Employee *
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value="">Select an employee...</option>
                {availableEmployees.map(employee => (
                  <option key={employee._id} value={employee._id}>
                    {employee.employeeProfile?.firstName} {employee.employeeProfile?.lastName} - 
                    {employee.employeeProfile?.department?.replace('-', ' ')} ({employee.employeeProfile?.position})
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <Input
                label="Reason for Reassignment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optional reason for reassignment..."
                multiline
                rows={3}
              />
            </div>

            {/* Appointment Details */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Appointment Details:
              </h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Property:</span> {appointment.property?.title}</p>
                <p><span className="font-medium">Customer:</span> {appointment.contactInfo?.name}</p>
                <p><span className="font-medium">Date:</span> {new Date(appointment.scheduledDateTime).toLocaleDateString()}</p>
                <p><span className="font-medium">Time:</span> {new Date(appointment.scheduledDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
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
                disabled={!selectedEmployee || loading}
                leftIcon={<ArrowPathIcon className="h-4 w-4" />}
              >
                {loading ? 'Reassigning...' : 'Reassign'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReassignModal;