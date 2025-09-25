// pages/admin/components/CreateEmployeeModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  createEmployee,
  updateEmployee,
  selectCreateLoading,
  selectUpdateLoading
} from '../../store/slices/employeeSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const CreateEmployeeModal = ({ isOpen, onClose, employee }) => {
  const dispatch = useDispatch();
  const createLoading = useSelector(selectCreateLoading);
  const updateLoading = useSelector(selectUpdateLoading);
  const loading = createLoading || updateLoading;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    position: '',
    department: ''
  });

  const departments = [
    { value: 'project-management', label: 'Project Management' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'interior-design', label: 'Interior Design' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'mineral-services', label: 'Mineral Services' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'admin', label: 'Administration' },
    { value: 'it', label: 'IT' },
    { value: 'operations', label: 'Operations' }
  ];

  useEffect(() => {
    if (employee) {
      // Edit mode - populate form with employee data
      const emp = employee.employeeProfile || {};
      setFormData({
        email: employee.email || '',
        password: '', // Don't prefill password in edit mode
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        phone: emp.phone || '',
        position: emp.position || '',
        department: emp.department || ''
      });
    } else {
      // Create mode - reset form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        position: '',
        department: ''
      });
    }
  }, [employee, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (employee) {
        // Update employee
        const updateData = {
          employeeProfile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            position: formData.position,
            department: formData.department
          }
        };

        // Only include password if it's provided
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }

        await dispatch(updateEmployee({
          id: employee._id,
          data: updateData
        })).unwrap();
        toast.success('Employee updated successfully');
      } else {
        // Create employee
        await dispatch(createEmployee(formData)).unwrap();
        toast.success('Employee created successfully');
      }

      onClose();
    } catch (error) {
      toast.error(error || 'Failed to save employee');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? 'Edit Employee' : 'Add New Employee'}
      size="lg"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={!!employee} // Can't change email in edit mode
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 text-base"
                placeholder="employee@tesgold.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password {employee ? '(leave empty to keep current)' : '*'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!employee}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base"
                placeholder={employee ? "Enter new password" : "Enter password"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="First name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="Last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="+251912345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="e.g., Senior Engineer, Project Manager"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
              disabled={loading}
            >
              {loading ? 'Saving...' : employee ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateEmployeeModal;