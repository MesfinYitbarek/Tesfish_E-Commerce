// pages/customer/CustomerRegistrations.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  EyeIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  HomeIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchMyRegistrations,
  setRegistrationFilters,
  clearRegistrationFilters
} from '../../store/slices/productSlice';
import { REGISTRATION_STATUS, REGISTRATION_PAYMENT_STATUS } from '../../constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { toast } from 'react-hot-toast';

// Helper functions
const formatCurrency = (amount, currency = 'ETB') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'ETB' ? 'USD' : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('$', currency === 'ETB' ? 'ETB ' : '$');
};

const formatDate = (date) => {
  if (!date) return 'Not available';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (date) => {
  if (!date) return 'Not available';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Status configurations - Updated to include all statuses
const statusConfig = {
  pending: {
    label: 'Pending',
    icon: ClockIcon,
    color: 'yellow',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  'under-review': {
    label: 'Under Review',
    icon: ExclamationTriangleIcon,
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  approved: {
    label: 'Approved',
    icon: CheckCircleIcon,
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  rejected: {
    label: 'Rejected',
    icon: XCircleIcon,
    color: 'red',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircleIcon,
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircleIcon,
    color: 'gray',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-200 dark:border-gray-600'
  },
  expired: {
    label: 'Expired',
    icon: ClockIcon,
    color: 'gray',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-200 dark:border-gray-600'
  }
};

// Payment status configurations
const paymentStatusConfig = {
  pending: {
    label: 'Payment Pending',
    color: 'yellow'
  },
  completed: {
    label: 'Payment Completed',
    color: 'green'
  },
  failed: {
    label: 'Payment Failed',
    color: 'red'
  },
  refunded: {
    label: 'Refunded',
    color: 'blue'
  }
};

const CustomerRegistrations = () => {
  const dispatch = useDispatch();
  const {
    myRegistrations = [],
    registrationLoading = false,
    registrationError = null,
    registrationPagination = {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      hasNext: false,
      hasPrev: false
    },
    registrationFilters = {}
  } = useSelector((state) => state.products || {});

  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchMyRegistrations(registrationFilters));
  }, [dispatch, registrationFilters]);

  const handleFilterChange = (key, value) => {
    dispatch(setRegistrationFilters({ [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    dispatch(setRegistrationFilters({ search: term, page: 1 }));
  };

  const handlePageChange = (page) => {
    dispatch(setRegistrationFilters({ page }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    dispatch(clearRegistrationFilters());
  };

  const viewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  const downloadReceipt = (registration) => {
    if (registration.payment?.receiptUrl) {
      window.open(registration.payment.receiptUrl, '_blank');
    } else {
      toast.error('Receipt not available');
    }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.color} size="sm">
        <config.icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const config = paymentStatusConfig[paymentStatus] || paymentStatusConfig.pending;
    return (
      <Badge variant={config.color} size="sm">
        {config.label}
      </Badge>
    );
  };

  // Get safe status config with fallback
  const getSafeStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.pending;
  };

  if (registrationLoading && myRegistrations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Property Registrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your property registration applications and payment status
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
          
          <Link to="/properties">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = myRegistrations.filter(reg => reg.status === status).length;
          
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${config.textColor} text-sm font-medium`}>
                    {config.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {count}
                  </p>
                </div>
                <config.icon className={`h-8 w-8 ${config.textColor}`} />
              </div>
            </motion.div>
          );
        })}
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
                  Status
                </label>
                <select
                  value={registrationFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 text-base"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <option key={status} value={status}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={registrationFilters.sort || 'newest'}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 text-base"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="status">By Status</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
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
          placeholder="Search by property name or registration number..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
        />
      </div>

      {/* Registrations List */}
      {registrationError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{registrationError}</p>
        </div>
      )}

      {myRegistrations.length === 0 && !registrationLoading ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No registrations found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't registered for any properties yet.
          </p>
          <Link to="/properties">
            <Button variant="primary">
              Browse Properties
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myRegistrations.map((registration) => (
            <motion.div
              key={registration._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  {/* Property Info */}
                  <div className="flex items-start space-x-4">
                    {registration.property?.media?.images?.[0] && (
                      <img
                        src={registration.property.media.images[0].url}
                        alt={registration.property.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/64/64';
                        }}
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {registration.property?.title || 'Property Registration'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Registration #{registration.registrationNumber}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(registration.status)}
                        </div>
                      </div>

                      {/* Location */}
                      {registration.property?.propertyDetails?.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>
                            {[
                              registration.property.propertyDetails.location.city,
                              registration.property.propertyDetails.location.region
                            ].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}

                      {/* Registration Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Registration Fee</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(registration.payment?.registrationFee, registration.payment?.currency)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Payment Status</p>
                          <div className="mt-1">
                            {getPaymentStatusBadge(registration.payment?.paymentStatus)}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Submitted</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {formatDate(registration.createdAt)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {formatDate(registration.updatedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Admin Notes */}
                      {registration.adminNotes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Admin Notes:</p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {registration.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewDetails(registration)}
                    leftIcon={<EyeIcon className="h-4 w-4" />}
                  >
                    Details
                  </Button>
                  
                  {registration.payment?.paymentStatus === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadReceipt(registration)}
                      leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
                    >
                      Receipt
                    </Button>
                  )}

                  {registration.property && (
                    <Link to={`/properties/${registration.property._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<ArrowTopRightOnSquareIcon className="h-4 w-4" />}
                      >
                        View Property
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {registrationPagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((registrationPagination.currentPage - 1) * 10) + 1} to{' '}
            {Math.min(registrationPagination.currentPage * 10, registrationPagination.total)} of{' '}
            {registrationPagination.total} results
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(registrationPagination.currentPage - 1)}
              disabled={!registrationPagination.hasPrev}
            >
              Previous
            </Button>
            
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {registrationPagination.currentPage} of {registrationPagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(registrationPagination.currentPage + 1)}
              disabled={!registrationPagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Registration Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Registration Details"
        size="xl"
      >
        {selectedRegistration && (
          <div className="p-6 space-y-6">
            {/* Property Info */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Property Information
              </h3>
              
              <div className="flex items-start space-x-4">
                {selectedRegistration.property?.media?.images?.[0] && (
                  <img
                    src={selectedRegistration.property.media.images[0].url}
                    alt={selectedRegistration.property.title}
                    className="w-24 h-24 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/96/96';
                    }}
                  />
                )}
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {selectedRegistration.property?.title}
                  </h4>
                  
                  {selectedRegistration.property?.propertyDetails?.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>
                        {[
                          selectedRegistration.property.propertyDetails.location.street,
                          selectedRegistration.property.propertyDetails.location.city,
                          selectedRegistration.property.propertyDetails.location.region
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Registration Status */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Registration Status
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedRegistration.status)}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Registration Number</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedRegistration.registrationNumber}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDateTime(selectedRegistration.createdAt)}
                  </p>
                </div>
                
                {selectedRegistration.reviewedAt && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reviewed</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDateTime(selectedRegistration.reviewedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Payment Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Registration Fee</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(selectedRegistration.payment?.registrationFee, selectedRegistration.payment?.currency)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                  <div className="mt-1">
                    {getPaymentStatusBadge(selectedRegistration.payment?.paymentStatus)}
                  </div>
                </div>
                
                {selectedRegistration.payment?.paymentDate && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDateTime(selectedRegistration.payment.paymentDate)}
                    </p>
                  </div>
                )}
                
                {selectedRegistration.payment?.transactionId && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                      {selectedRegistration.payment.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedRegistration.personalInfo?.firstName} {selectedRegistration.personalInfo?.lastName}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedRegistration.personalInfo?.email}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedRegistration.personalInfo?.phone}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Occupation</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedRegistration.personalInfo?.occupation}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents */}
            {selectedRegistration.documents && selectedRegistration.documents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Submitted Documents
                </h3>
                
                <div className="space-y-2">
                  {selectedRegistration.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{doc.name}</span>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-500 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {selectedRegistration.adminNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Admin Notes
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedRegistration.adminNotes}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              {selectedRegistration.payment?.paymentStatus === 'completed' && (
                <Button
                  variant="outline"
                  onClick={() => downloadReceipt(selectedRegistration)}
                  leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
                >
                  Download Receipt
                </Button>
              )}
              
              {selectedRegistration.property && (
                <Link to={`/properties/${selectedRegistration.property._id}`}>
                  <Button
                    variant="primary"
                    leftIcon={<ArrowTopRightOnSquareIcon className="h-4 w-4" />}
                  >
                    View Property
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerRegistrations;