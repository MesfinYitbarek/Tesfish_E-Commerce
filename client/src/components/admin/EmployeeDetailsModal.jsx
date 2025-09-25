import { useState } from 'react';
import {
  XMarkIcon,
  UserIcon,
  BriefcaseIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

import Button from '../ui/Button';
import Modal from '../ui/Modal';

const EmployeeDetailsModal = ({ isOpen, onClose, employee, onEdit }) => {
  if (!employee) return null;

  const emp = employee.employeeProfile || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Details"
      size="lg"
    >
      <div className="p-6">
        {/* Employee Header */}
        <div className="flex items-start space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
              {emp.firstName?.charAt(0) || employee.email.charAt(0).toUpperCase()}
              {emp.lastName?.charAt(0) || ''}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {emp.firstName} {emp.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{emp.position || 'Employee'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 capitalize">
              {emp.department?.replace('-', ' ') || 'No department assigned'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onEdit && onEdit(employee);
            }}
            leftIcon={<PencilIcon className="h-4 w-4" />}
          >
            Edit
          </Button>
        </div>

        {/* Employee Information */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <PhoneIcon className="h-5 w-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-gray-100">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-gray-100">{emp.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              Employment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
                <p className="text-gray-900 dark:text-gray-100">{emp.position || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                <p className="text-gray-900 dark:text-gray-100 capitalize">
                  {emp.department?.replace('-', ' ') || 'Not assigned'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Employee Since</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(employee.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">User Type</p>
                <p className="text-gray-900 dark:text-gray-100 capitalize">{employee.userType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.isVerified 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {employee.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(employee.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Employee ID</p>
                <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                  {employee._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onEdit && onEdit(employee);
            }}
            leftIcon={<PencilIcon className="h-4 w-4" />}
          >
            Edit Employee
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeDetailsModal;