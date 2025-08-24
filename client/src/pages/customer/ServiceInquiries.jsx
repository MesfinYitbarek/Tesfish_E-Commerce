import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ServiceInquiryModal from '../../components/Services/ServiceInquiryModal';
import { fetchMyInquiries } from '../../store/slices/serviceInquirySlice';
import { formatRelativeTime, formatCurrency } from '../../utils/helpers';

const ServiceInquiries = () => {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { myInquiries, isLoading, error } = useSelector((state) => state.serviceInquiry);

  useEffect(() => {
    dispatch(fetchMyInquiries({
      status: statusFilter,
      serviceType: serviceTypeFilter
    }));
  }, [dispatch, statusFilter, serviceTypeFilter]);

  const getStatusIcon = (status) => {
    const icons = {
      pending: ClockIcon,
      'under-review': ClockIcon,
      quoted: CurrencyDollarIcon,
      negotiating: ChatBubbleLeftRightIcon,
      accepted: CheckCircleIcon,
      'in-progress': ClockIcon,
      completed: CheckCircleIcon,
      cancelled: XCircleIcon,
      rejected: XCircleIcon
    };
    return icons[status] || ClockIcon;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
      'under-review': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      quoted: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
      negotiating: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
      accepted: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      'in-progress': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
      cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      rejected: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const getActionButton = (inquiry) => {
    switch (inquiry.status) {
      case 'quoted':
        return (
          <Button
            size="sm"
            onClick={() => navigate(`/customer/dashboard/inquiries/${inquiry._id}?action=review-quote`)}
            leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
          >
            Review Quote
          </Button>
        );
      case 'accepted':
      case 'in-progress':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/customer/dashboard/inquiries/${inquiry._id}?tab=progress`)}
            leftIcon={<ClockIcon className="h-4 w-4" />}
          >
            Track Progress
          </Button>
        );
      case 'completed':
        return (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/customer/dashboard/inquiries/${inquiry._id}?tab=summary`)}
            leftIcon={<DocumentTextIcon className="h-4 w-4" />}
          >
            View Summary
          </Button>
        );
      default:
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/customer/dashboard/inquiries/${inquiry._id}`)}
            leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
          >
            View Details
          </Button>
        );
    }
  };

  const getPendingQuotes = () => {
    return myInquiries.filter(inquiry => 
      inquiry.status === 'quoted' && 
      inquiry.quotes?.some(quote => quote.status === 'pending')
    );
  };

  const getActiveProjects = () => {
    return myInquiries.filter(inquiry => 
      ['accepted', 'in-progress'].includes(inquiry.status)
    );
  };

  if (isLoading && myInquiries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading your inquiries..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Service Inquiries
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your service requests and project progress
          </p>
        </div>
        <Button
          onClick={() => setShowInquiryModal(true)}
          leftIcon={<PlusIcon className="h-4 w-4" />}
        >
          New Service Request
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{myInquiries.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Quotes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{getPendingQuotes().length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{getActiveProjects().length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {myInquiries.filter(inquiry => inquiry.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="under-review">Under Review</option>
          <option value="quoted">Quoted</option>
          <option value="accepted">Accepted</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={serviceTypeFilter}
          onChange={(e) => setServiceTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Services</option>
          <option value="project-management">Project Management</option>
          <option value="engineering-design">Engineering Design</option>
          <option value="interior-design">Interior Design</option>
          <option value="real-estate-consultancy">Real Estate Consultancy</option>
        </select>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {myInquiries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Service Inquiries Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by submitting your first service request
            </p>
            <Button
              onClick={() => setShowInquiryModal(true)}
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              Submit Service Request
            </Button>
          </div>
        ) : (
          myInquiries.map((inquiry) => {
            const StatusIcon = getStatusIcon(inquiry.status);
            const hasNewQuote = inquiry.quotes?.some(quote => 
              quote.status === 'pending' && 
              new Date(quote.submittedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            );

            return (
              <div
                key={inquiry._id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {inquiry.projectDetails.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(inquiry.status)}`}>
                        <StatusIcon className="h-3 w-3 inline mr-1" />
                        {inquiry.status.replace('-', ' ')}
                      </span>
                      {hasNewQuote && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          New Quote
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {inquiry.projectDetails.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        {inquiry.serviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatRelativeTime(inquiry.createdAt)}
                      </span>
                      <span className="flex items-center">
                        ID: {inquiry.inquiryNumber}
                      </span>
                      {inquiry.projectDetails.budget.min && inquiry.projectDetails.budget.max && (
                        <span className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {formatCurrency(inquiry.projectDetails.budget.min, inquiry.projectDetails.budget.currency)} - {formatCurrency(inquiry.projectDetails.budget.max, inquiry.projectDetails.budget.currency)}
                        </span>
                      )}
                    </div>

                    {/* Latest Quote Info */}
                    {inquiry.quotes && inquiry.quotes.length > 0 && (
                      <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                            Latest Quote: {formatCurrency(inquiry.quotes[inquiry.quotes.length - 1].amount, inquiry.quotes[inquiry.quotes.length - 1].currency)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            inquiry.quotes[inquiry.quotes.length - 1].status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : inquiry.quotes[inquiry.quotes.length - 1].status === 'accepted'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {inquiry.quotes[inquiry.quotes.length - 1].status}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Consultation Info */}
                    {inquiry.consultation?.scheduled && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center text-sm text-blue-900 dark:text-blue-100">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Consultation scheduled for {new Date(inquiry.consultation.dateTime).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    {getActionButton(inquiry)}
                    {inquiry.messages && inquiry.messages.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/customer/dashboard/inquiries/${inquiry._id}?tab=messages`)}
                        leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
                      >
                        Messages ({inquiry.messages.length})
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Service Inquiry Modal */}
      <ServiceInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
      />
    </div>
  );
};

export default ServiceInquiries;