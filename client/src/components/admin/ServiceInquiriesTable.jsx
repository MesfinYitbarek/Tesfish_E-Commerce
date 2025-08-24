import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { fetchProviderInquiries  } from '../../store/slices/serviceInquirySlice';
import { formatRelativeTime, formatCurrency } from '../../utils/helpers';

const ServiceInquiriesTable = ({ filter = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(filter || '');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { inquiries, isLoading, pagination, error } = useSelector((state) => state.serviceInquiry);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter,
      serviceType: serviceTypeFilter,
      sortBy,
      sortOrder
    };

    dispatch(fetchProviderInquiries(params));
  }, [dispatch, currentPage, searchTerm, statusFilter, serviceTypeFilter, sortBy, sortOrder]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleServiceTypeFilter = (serviceType) => {
    setServiceTypeFilter(serviceType);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'under-review': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      quoted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      negotiating: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'in-progress': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      rejected: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[status] || colors.pending;
  };

  const getUrgencyIcon = (urgency) => {
    if (urgency === 'urgent' || urgency === 'high') {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getPriorityColor = (urgency) => {
    const colors = {
      low: 'text-green-600 dark:text-green-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      high: 'text-orange-600 dark:text-orange-400',
      urgent: 'text-red-600 dark:text-red-400'
    };
    return colors[urgency] || colors.medium;
  };

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header with filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Service Inquiries {filter && `(${filter.replace('-', ' ')})`}
          </h3>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="quoted">Quoted</option>
              <option value="negotiating">Negotiating</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Service Type Filter */}
            <select
              value={serviceTypeFilter}
              onChange={(e) => handleServiceTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Services</option>
              <option value="project-management">Project Management</option>
              <option value="engineering-design">Engineering Design</option>
              <option value="interior-design">Interior Design</option>
              <option value="real-estate-consultancy">Real Estate Consultancy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('inquiryNumber')}
              >
                Inquiry #
                {sortBy === 'inquiryNumber' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('projectDetails.title')}
              >
                Project
                {sortBy === 'projectDetails.title' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Service Type
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('status')}
              >
                Status
                {sortBy === 'status' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Budget Range
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('createdAt')}
              >
                Created
                {sortBy === 'createdAt' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center">
                  <LoadingSpinner size="md" text="Loading inquiries..." />
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
                    <p>No inquiries found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getUrgencyIcon(inquiry.projectDetails.timeline.urgency)}
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-2">
                        {inquiry.inquiryNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {inquiry.projectDetails.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {inquiry.projectDetails.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {inquiry.customer?.customerProfile?.firstName} {inquiry.customer?.customerProfile?.lastName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {inquiry.customer?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {inquiry.serviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPriorityColor(inquiry.projectDetails.timeline.urgency)}`}>
                      {inquiry.projectDetails.timeline.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {inquiry.projectDetails.budget.min && inquiry.projectDetails.budget.max ? (
                        `${formatCurrency(inquiry.projectDetails.budget.min, inquiry.projectDetails.budget.currency)} - ${formatCurrency(inquiry.projectDetails.budget.max, inquiry.projectDetails.budget.currency)}`
                      ) : (
                        'Contact for quote'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(inquiry.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/services/inquiries/${inquiry._id}`)}
                      leftIcon={<EyeIcon className="h-4 w-4" />}
                    >
                      View
                    </Button>
                    {inquiry.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/services/inquiries/${inquiry._id}?action=quote`)}
                        leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
                      >
                        Quote
                      </Button>
                    )}
                    {inquiry.consultation?.scheduled && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/admin/services/inquiries/${inquiry._id}?tab=consultation`)}
                        leftIcon={<CalendarIcon className="h-4 w-4" />}
                      >
                        Meeting
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((pagination.current - 1) * 10) + 1} to {Math.min(pagination.current * 10, pagination.totalRecords)} of {pagination.totalRecords} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.current === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.current} of {pagination.total}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total))}
                disabled={pagination.current === pagination.total}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceInquiriesTable;