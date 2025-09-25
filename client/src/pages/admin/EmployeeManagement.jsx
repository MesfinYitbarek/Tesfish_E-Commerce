import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    UserGroupIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import {
    fetchEmployees,
    deleteEmployee,
    setFilters,
    clearFilters,
    selectEmployees,
    selectAllEmployees,
    selectEmployeeLoading,
    selectEmployeeError,
    selectEmployeeFilters
} from '../../store/slices/employeeSlice';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CreateEmployeeModal from '../../components/admin/CreateEmployeeModal';
import EmployeeDetailsModal from '../../components/admin/EmployeeDetailsModal';
import { toast } from 'react-hot-toast';

const EmployeeManagement = () => {
    const dispatch = useDispatch();
    const employees = useSelector(selectEmployees);
    const allEmployees = useSelector(selectAllEmployees);
    const loading = useSelector(selectEmployeeLoading);
    const error = useSelector(selectEmployeeError);
    const filters = useSelector(selectEmployeeFilters);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState({ show: false, employee: null });

    const departments = [
        'project-management',
        'engineering',
        'interior-design',
        'real-estate',
        'mineral-services',
        'marketing',
        'sales',
        'finance',
        'hr',
        'admin',
        'it',
        'operations'
    ];

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }));
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        dispatch(setFilters({ search: searchTerm }));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    const handleViewEmployee = (employee) => {
        setSelectedEmployee(employee);
        setShowDetailsModal(true);
    };

    const handleEditEmployee = (employee) => {
        setSelectedEmployee(employee);
        setShowCreateModal(true);
    };

    const handleDeleteEmployee = async () => {
        try {
            await dispatch(deleteEmployee(deleteConfirmModal.employee._id)).unwrap();
            toast.success('Employee deleted successfully');
            setDeleteConfirmModal({ show: false, employee: null });
        } catch (error) {
            toast.error(error || 'Failed to delete employee');
        }
    };

    // Calculate stats from client-side data
    const stats = {
        totalEmployees: allEmployees.length,
        departments: [...new Set(allEmployees.map(emp => emp.employeeProfile?.department).filter(Boolean))].length,
        recentHires: allEmployees.filter(emp => {
            const createdAt = new Date(emp.createdAt);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return createdAt > thirtyDaysAgo;
        }).length
    };

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => dispatch(fetchEmployees())}
                        className="mt-3"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Employee Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your team members and their details
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        leftIcon={<FunnelIcon className="h-4 w-4" />}
                    >
                        Filters
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                            setSelectedEmployee(null);
                            setShowCreateModal(true);
                        }}
                        leftIcon={<PlusIcon className="h-4 w-4" />}
                    >
                        Add Employee
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {stats.totalEmployees}
                            </p>
                        </div>
                        <UserGroupIcon className="h-8 w-8 text-blue-500" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {stats.departments}
                            </p>
                        </div>
                        <UserGroupIcon className="h-8 w-8 text-green-500" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Hires</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {stats.recentHires}
                            </p>
                        </div>
                        <UserGroupIcon className="h-8 w-8 text-purple-500" />
                    </div>
                </motion.div>
            </div>

            {/* Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Department
                                </label>
                                <select
                                    value={filters.department || ''}
                                    onChange={(e) => handleFilterChange('department', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Position
                                </label>
                                <input
                                    type="text"
                                    placeholder="Filter by position..."
                                    value={filters.position || ''}
                                    onChange={(e) => handleFilterChange('position', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base"
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                    className="w-full"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(filters.search || filters.department || filters.position) && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                                    {filters.search && (
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                            Search: "{filters.search}"
                                        </span>
                                    )}
                                    {filters.department && (
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-full">
                                            Department: {filters.department.replace('-', ' ')}
                                        </span>
                                    )}
                                    {filters.position && (
                                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                                            Position: "{filters.position}"
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search employees by name, email, or position..."
                    value={filters.search}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
            </div>

            {/* Employee List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="lg" />
                </div>
            ) : employees.length === 0 ? (
                <div className="text-center py-12">
                    <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No employees found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {filters.search || filters.department || filters.position
                            ? 'No employees match your current filters.'
                            : 'Get started by adding your first employee.'}
                    </p>
                    {filters.search || filters.department || filters.position ? (
                        <Button variant="outline" onClick={handleClearFilters}>
                            Clear Filters
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={() => {
                                setSelectedEmployee(null);
                                setShowCreateModal(true);
                            }}
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Employee
                        </Button>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Employee
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {employees.map((employee, index) => (
                                    <motion.tr
                                        key={employee._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                                        {employee.employeeProfile?.firstName?.charAt(0) || employee.email.charAt(0).toUpperCase()}
                                                        {employee.employeeProfile?.lastName?.charAt(0) || ''}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {employee.employeeProfile?.firstName} {employee.employeeProfile?.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {employee.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                                                {employee.employeeProfile?.department?.replace('-', ' ') || 'Not specified'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                                {employee.employeeProfile?.position || 'Not specified'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                                {employee.employeeProfile?.phone || 'Not provided'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(employee.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewEmployee(employee)}
                                                    leftIcon={<EyeIcon className="h-4 w-4" />}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditEmployee(employee)}
                                                    leftIcon={<PencilIcon className="h-4 w-4" />}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteConfirmModal({ show: true, employee })}
                                                    leftIcon={<TrashIcon className="h-4 w-4" />}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit Employee Modal */}
            <CreateEmployeeModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setSelectedEmployee(null);
                }}
                employee={selectedEmployee}
            />

            {/* Employee Details Modal */}
            <EmployeeDetailsModal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedEmployee(null);
                }}
                employee={selectedEmployee}
                onEdit={(employee) => {
                    setSelectedEmployee(employee);
                    setShowCreateModal(true);
                }}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteConfirmModal.show}
                onClose={() => setDeleteConfirmModal({ show: false, employee: null })}
                title="Delete Employee"
            >
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Are you sure you want to delete this employee?
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                This action cannot be undone. All employee data will be permanently removed.
                            </p>
                        </div>
                    </div>

                    {deleteConfirmModal.employee && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                        {deleteConfirmModal.employee.employeeProfile?.firstName?.charAt(0) || deleteConfirmModal.employee.email.charAt(0).toUpperCase()}
                                        {deleteConfirmModal.employee.employeeProfile?.lastName?.charAt(0) || ''}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {deleteConfirmModal.employee.employeeProfile?.firstName}{' '}
                                        {deleteConfirmModal.employee.employeeProfile?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {deleteConfirmModal.employee.employeeProfile?.position || 'Employee'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {deleteConfirmModal.employee.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmModal({ show: false, employee: null })}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteEmployee}
                        >
                            Delete Employee
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EmployeeManagement;