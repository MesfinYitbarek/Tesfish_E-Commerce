// pages/dashboard/PropertyRegistrations.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
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
  PlusIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchCompanyRegistrations,
  updateRegistrationStatus,
//   exportRegistrationsCSV,
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

// Status configurations
const statusConfig = {
  pending: {
    label: 'Pending',
    icon: ClockIcon,
    color: 'yellow',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    description: 'Awaiting payment confirmation'
  },
  'under-review': {
    label: 'Under Review',
    icon: ExclamationTriangleIcon,
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    description: 'Payment received, reviewing application'
  },
  approved: {
    label: 'Approved',
    icon: CheckCircleIcon,
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800',
    description: 'Registration approved'
  },
  rejected: {
    label: 'Rejected',
    icon: XCircleIcon,
    color: 'red',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
    description: 'Registration rejected'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircleIcon,
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800',
    description: 'Process completed'
  }
};

const paymentStatusConfig = {
  pending: { label: 'Payment Pending', color: 'yellow' },
  completed: { label: 'Payment Completed', color: 'green' },
  failed: { label: 'Payment Failed', color: 'red' },
  refunded: { label: 'Refunded', color: 'blue' }
};

const PropertyRegistrations = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    companyRegistrations = [],
    registrationLoading = false,
    registrationError = null,
    registrationPagination = {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      hasNext: false,
      hasPrev: false
    },
    registrationStats = [],
    registrationFilters = {}
  } = useSelector((state) => state.products || {});

  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    adminNotes: ''
  });
  const [updating, setUpdating] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const property = searchParams.get('property');
    
    if (status || search || property) {
      dispatch(setRegistrationFilters({
        status: status || '',
        search: search || '',
        property: property || ''
      }));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchCompanyRegistrations(registrationFilters));
  }, [dispatch, registrationFilters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { [key]: value, page: 1 };
    dispatch(setRegistrationFilters(newFilters));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleFilterChange('search', term);
  };

  const handlePageChange = (page) => {
    dispatch(setRegistrationFilters({ page }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    dispatch(clearRegistrationFilters());
    setSearchParams({});
  };

  const viewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  const openStatusModal = (registration) => {
    setSelectedRegistration(registration);
    setStatusUpdate({
      status: registration.status,
      adminNotes: registration.adminNotes || ''
    });
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedRegistration || !statusUpdate.status) return;

    setUpdating(true);
    try {
      await dispatch(updateRegistrationStatus({
        id: selectedRegistration._id,
        status: statusUpdate.status,
        adminNotes: statusUpdate.adminNotes
      })).unwrap();

      toast.success('Registration status updated successfully');
      setShowStatusModal(false);
      dispatch(fetchCompanyRegistrations(registrationFilters));
    } catch (error) {
      toast.error(error || 'Failed to update registration status');
    } finally {
      setUpdating(false);
    }
  };

//   const handleExportCSV = async () => {
//     try {
//       await dispatch(exportRegistrationsCSV()).unwrap();
//       toast.success('Registration data exported successfully');
//     } catch (error) {
//       toast.error(error || 'Failed to export data');
//     }
//   };

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

  // Calculate stats
  const totalRegistrations = companyRegistrations.length;
  const totalRevenue = companyRegistrations
    .filter(reg => reg.payment?.paymentStatus === 'completed')
    .reduce((sum, reg) => sum + (reg.payment?.registrationFee || 0), 0);

  if (registrationLoading && companyRegistrations.length === 0) {
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
            Property Registrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer registrations for your properties
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
          
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
          >
            Export CSV
          </Button> */}
          
          <Link to="/dashboard/products/create">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Total Registrations
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {totalRegistrations}
              </p>
            </div>
            <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>

        {Object.entries(statusConfig).slice(0, 2).map(([status, config], index) => {
          const count = companyRegistrations.filter(reg => reg.status === status).length;
          
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6`}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  Property
                </label>
                <select
                  value={registrationFilters.property || ''}
                  onChange={(e) => handleFilterChange('property', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 text-base"
                >
                  <option value="">All Properties</option>
                  {/* You can populate this with your properties */}
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
                  <option value="amount">By Amount</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                  leftIcon={<XCircleIcon className="h-4 w-4" />}
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
          placeholder="Search by customer name, property, or registration number..."
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

      {companyRegistrations.length === 0 && !registrationLoading ? (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No registrations found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No customers have registered for your properties yet.
          </p>
          <Link to="/dashboard/products/create">
            <Button variant="primary">
              Add Your First Property
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {companyRegistrations.map((registration) => (
            <motion.div
              key={registration._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  {/* Registration Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {/* Property Image */}
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
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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

                        {/* Customer Info */}
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-gray-100 font-medium">
                              {registration.personalInfo?.firstName} {registration.personalInfo?.lastName}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {registration.personalInfo?.email}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {registration.personalInfo?.phone}
                            </span>
                          </div>
                        </div>

                        {/* Registration Details */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                      </div>
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
                    View Details
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openStatusModal(registration)}
                    leftIcon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
                  >
                    Update Status
                  </Button>

                  {registration.property && (
                    <Link to={`/dashboard/products/${registration.property._id}`}>
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
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Property & Customer Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Property Info */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Property Information
                </h3>
                
                <div className="space-y-3">
                  {selectedRegistration.property?.media?.images?.[0] && (
                    <img
                      src={selectedRegistration.property.media.images[0].url}
                      alt={selectedRegistration.property.title}
                      className="w-full h-32 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/300/200';
                      }}
                    />
                  )}
                  
                  <div>
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

              {/* Customer Info */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Customer Information
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedRegistration.personalInfo?.firstName} {selectedRegistration.personalInfo?.lastName}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {selectedRegistration.personalInfo?.email}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {selectedRegistration.personalInfo?.phone}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {selectedRegistration.personalInfo?.occupation}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration & Payment Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Registration Status
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    {getStatusBadge(selectedRegistration.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Registration #</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedRegistration.registrationNumber}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Submitted</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDateTime(selectedRegistration.createdAt)}
                    </span>
                  </div>
                  
                  {selectedRegistration.reviewedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Reviewed</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDateTime(selectedRegistration.reviewedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Payment Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Registration Fee</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(selectedRegistration.payment?.registrationFee, selectedRegistration.payment?.currency)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Payment Status</span>
                    {getPaymentStatusBadge(selectedRegistration.payment?.paymentStatus)}
                  </div>
                  
                  {selectedRegistration.payment?.paymentDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment Date</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDateTime(selectedRegistration.payment.paymentDate)}
                      </span>
                    </div>
                  )}
                  
                  {selectedRegistration.payment?.transactionId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                        {selectedRegistration.payment.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Documents */}
            {selectedRegistration.documents && selectedRegistration.documents.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Submitted Documents
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

            {/* Emergency Contact */}
            {selectedRegistration.emergencyContact && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Emergency Contact
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedRegistration.emergencyContact.name}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Relationship</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedRegistration.emergencyContact.relationship}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedRegistration.emergencyContact.phone}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedRegistration.emergencyContact.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {selectedRegistration.adminNotes && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => openStatusModal(selectedRegistration)}
                leftIcon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
              >
                Update Status
              </Button>
              
              {selectedRegistration.property && (
                <Link to={`/dashboard/products/${selectedRegistration.property._id}`}>
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

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Registration Status"
        size="md"
      >
        {selectedRegistration && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Registration #{selectedRegistration.registrationNumber}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Customer: {selectedRegistration.personalInfo?.firstName} {selectedRegistration.personalInfo?.lastName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusUpdate.status}
                onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 text-base"
              >
                {Object.entries(statusConfig).map(([status, config]) => (
                  <option key={status} value={status}>
                    {config.label} - {config.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={statusUpdate.adminNotes}
                onChange={(e) => setStatusUpdate(prev => ({ ...prev, adminNotes: e.target.value }))}
                placeholder="Add any notes about this status change..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 resize-none text-base"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </Button>
              
              <Button
                variant="primary"
                onClick={handleStatusUpdate}
                loading={updating}
                disabled={updating || !statusUpdate.status}
              >
                Update Status
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PropertyRegistrations;