import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import QuoteSubmissionModal from '../../components/Services/QuoteSubmissionModal';
import QuoteReviewModal from '../../components/Services/QuoteReviewModal';
import ConsultationScheduler from '../../components/Services/ConsultationScheduler';
import ConsultationManagement from '../../components/Services/ConsultationManagement';
import InquiryTimeline from '../../components/Services/InquiryTimeline';
import ServiceMessaging from '../../components/Services/ServiceMessaging';
import StatusUpdateModal from '../../components/Services/StatusUpdateModal';
import { 
  fetchInquiry, 
  updateInquiryStatus,
  clearCurrentInquiry 
} from '../../store/slices/serviceInquirySlice';
import { formatRelativeTime, formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';
import QuoteManagement from '../../components/Services/QuoteManagement';

const ServiceInquiryDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [showQuoteModal, setShowQuoteModal] = useState(searchParams.get('action') === 'quote');
  const [showReviewModal, setShowReviewModal] = useState(searchParams.get('action') === 'review-quote');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { currentInquiry, isLoading, error } = useSelector((state) => state.serviceInquiry);

  const isAdmin = user?.userType === 'admin';
  const isCustomer = currentInquiry?.customer?._id === user?.id;

  useEffect(() => {
    if (id) {
      dispatch(fetchInquiry(id));
    }
    return () => {
      dispatch(clearCurrentInquiry());
    };
  }, [dispatch, id]);

  useEffect(() => {
    const action = searchParams.get('action');
    const tab = searchParams.get('tab');
    
    if (action === 'quote') setShowQuoteModal(true);
    if (action === 'review-quote') setShowReviewModal(true);
    if (tab) setActiveTab(tab);
  }, [searchParams]);

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

  const getUrgencyColor = (urgency) => {
    const colors = {
      low: 'text-green-600 dark:text-green-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      high: 'text-orange-600 dark:text-orange-400',
      urgent: 'text-red-600 dark:text-red-400'
    };
    return colors[urgency] || colors.medium;
  };

  const handleStatusUpdate = async (newStatus, note) => {
    try {
      await dispatch(updateInquiryStatus({
        inquiryId: id,
        status: newStatus,
        note
      })).unwrap();
      
      toast.success('Status updated successfully');
      setShowStatusModal(false);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getServiceSpecificInfo = () => {
    if (!currentInquiry?.serviceSpecifics) return null;

    const { serviceType, serviceSpecifics } = currentInquiry;

    switch (serviceType) {
      case 'project-management':
        return serviceSpecifics.projectManagement && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Project Management Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Project Type:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {serviceSpecifics.projectManagement.projectType?.replace('-', ' ')}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Project Scale:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {serviceSpecifics.projectManagement.projectScale}
                </span>
              </div>
              {serviceSpecifics.projectManagement.servicesNeeded && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Services Needed:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {serviceSpecifics.projectManagement.servicesNeeded.map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded">
                        {service.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'engineering-design':
        return serviceSpecifics.engineeringDesign && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Engineering Design Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Design Type:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {serviceSpecifics.engineeringDesign.designType}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Project Category:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {serviceSpecifics.engineeringDesign.projectCategory}
                </span>
              </div>
            </div>
          </div>
        );

      case 'interior-design':
        return serviceSpecifics.interiorDesign && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Interior Design Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Building Type:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {serviceSpecifics.interiorDesign.buildingType?.replace('-', ' ')}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Service Scope:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {serviceSpecifics.interiorDesign.serviceScope?.replace('-', ' ')}
                </span>
              </div>
              {serviceSpecifics.interiorDesign.totalArea && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Area:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {serviceSpecifics.interiorDesign.totalArea} sq meters
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case 'real-estate-consultancy':
        return serviceSpecifics.realEstateConsultancy && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Real Estate Consultancy Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Consultation Type:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {serviceSpecifics.realEstateConsultancy.consultationType?.replace('-', ' ')}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Property Type:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {serviceSpecifics.realEstateConsultancy.propertyType}
                </span>
              </div>
              {serviceSpecifics.realEstateConsultancy.propertyDetails?.location && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Property Location:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {serviceSpecifics.realEstateConsultancy.propertyDetails.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case 'mineral-services':
        return serviceSpecifics.mineralServices && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Mineral Services Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {serviceSpecifics.mineralServices.serviceType && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Service Type:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {serviceSpecifics.mineralServices.serviceType.replace('-', ' ')}
                  </span>
                </div>
              )}
              {serviceSpecifics.mineralServices.mineralType && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Mineral Type:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {serviceSpecifics.mineralServices.mineralType}
                  </span>
                </div>
              )}
              {serviceSpecifics.mineralServices.surveyArea && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Survey Area:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {serviceSpecifics.mineralServices.surveyArea} hectares
                  </span>
                </div>
              )}
              {serviceSpecifics.mineralServices.explorationDepth && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Exploration Depth:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {serviceSpecifics.mineralServices.explorationDepth} meters
                  </span>
                </div>
              )}
              {serviceSpecifics.mineralServices.miningType && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Mining Type:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {serviceSpecifics.mineralServices.miningType.replace('-', ' ')}
                  </span>
                </div>
              )}
              {serviceSpecifics.mineralServices.environmentalAssessment !== undefined && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Environmental Assessment:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {serviceSpecifics.mineralServices.environmentalAssessment ? 'Required' : 'Not Required'}
                  </span>
                </div>
              )}
              {serviceSpecifics.mineralServices.existingPermits !== undefined && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Existing Permits:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {serviceSpecifics.mineralServices.existingPermits ? 'Yes' : 'No'}
                  </span>
                </div>
              )}
              {serviceSpecifics.mineralServices.geologicalData !== undefined && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Geological Data Available:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {serviceSpecifics.mineralServices.geologicalData ? 'Yes' : 'No'}
                  </span>
                </div>
              )}
              {serviceSpecifics.mineralServices.servicesRequired && serviceSpecifics.mineralServices.servicesRequired.length > 0 && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Services Required:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {serviceSpecifics.mineralServices.servicesRequired.map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 text-xs rounded">
                        {service.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {serviceSpecifics.mineralServices.sustainabilityRequirements && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Sustainability Requirements:</span>
                  <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm">
                    {serviceSpecifics.mineralServices.sustainabilityRequirements}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading && !currentInquiry) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading inquiry details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
            Error Loading Inquiry
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!currentInquiry) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Inquiry Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The inquiry you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DocumentTextIcon },
    { id: 'quotes', label: 'Quotes', icon: CurrencyDollarIcon, badge: currentInquiry.quotes?.length || 0 },
    { id: 'messages', label: 'Messages', icon: ChatBubbleLeftRightIcon, badge: currentInquiry.messages?.length || 0 },
    { id: 'consultation', label: 'Consultation', icon: CalendarIcon, badge: currentInquiry.consultation?.scheduled ? 1 : 0 },
    { id: 'timeline', label: 'Timeline', icon: ClockIcon }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
            size="sm"
          >
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {currentInquiry.projectDetails.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Inquiry #{currentInquiry.inquiryNumber}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-full border text-center ${getStatusColor(currentInquiry.status)}`}>
            {currentInquiry.status.replace('-', ' ')}
          </span>
          
          {isAdmin && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {currentInquiry.status === 'pending' && (
                <Button
                  onClick={() => setShowQuoteModal(true)}
                  leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Submit Quote
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(true)}
                size="sm"
                className="w-full sm:w-auto"
              >
                Update Status
              </Button>
            </div>
          )}

          {isCustomer && currentInquiry.quotes?.some(q => q.status === 'pending') && (
            <Button
              onClick={() => setShowReviewModal(true)}
              leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
              size="sm"
              className="w-full sm:w-auto"
            >
              Review Quotes
            </Button>
          )}
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Service Type</p>
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {currentInquiry.serviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Priority</p>
              <p className={`font-medium text-sm ${getUrgencyColor(currentInquiry.projectDetails.timeline.urgency)}`}>
                {currentInquiry.projectDetails.timeline.urgency.replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {formatRelativeTime(currentInquiry.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget Range</p>
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {currentInquiry.projectDetails.budget.min && currentInquiry.projectDetails.budget.max ? (
                  `${formatCurrency(currentInquiry.projectDetails.budget.min, currentInquiry.projectDetails.budget.currency)} - ${formatCurrency(currentInquiry.projectDetails.budget.max, currentInquiry.projectDetails.budget.currency)}`
                ) : (
                  'Contact for quote'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Project Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Project Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {currentInquiry.projectDetails.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Location</h4>
                      <div className="flex items-start space-x-2">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {currentInquiry.projectDetails.location.address && (
                            <div>{currentInquiry.projectDetails.location.address}</div>
                          )}
                          <div>
                            {currentInquiry.projectDetails.location.city}
                            {currentInquiry.projectDetails.location.region && 
                              `, ${currentInquiry.projectDetails.location.region}`}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Timeline</h4>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {currentInquiry.projectDetails.timeline.startDate && (
                          <div>Start Date: {new Date(currentInquiry.projectDetails.timeline.startDate).toLocaleDateString()}</div>
                        )}
                        {currentInquiry.projectDetails.timeline.endDate && (
                          <div>End Date: {new Date(currentInquiry.projectDetails.timeline.endDate).toLocaleDateString()}</div>
                        )}
                        <div className={`font-medium ${getUrgencyColor(currentInquiry.projectDetails.timeline.urgency)}`}>
                          Urgency: {currentInquiry.projectDetails.timeline.urgency}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Specific Information */}
                  {getServiceSpecificInfo()}
                </div>
              </div>

              {/* Attachments */}
              {currentInquiry.attachments && currentInquiry.attachments.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Attachments
                  </h3>
                  <div className="space-y-3">
                    {currentInquiry.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <PaperClipIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(attachment.size / 1024 / 1024).toFixed(2)} MB • 
                              Uploaded {formatRelativeTime(attachment.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(attachment.url, '_blank')}
                          className="ml-3 flex-shrink-0"
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'quotes' && (
            <QuoteManagement 
              inquiry={currentInquiry}
              isAdmin={isAdmin}
              isCustomer={isCustomer}
              onQuoteSubmit={() => setShowQuoteModal(true)}
              onQuoteReview={() => setShowReviewModal(true)}
            />
          )}

          {activeTab === 'messages' && (
            <ServiceMessaging 
              inquiry={currentInquiry}
              currentUserId={user?.id}
            />
          )}

          {activeTab === 'consultation' && (
            <ConsultationManagement
              inquiry={currentInquiry}
              isAdmin={isAdmin}
              onSchedule={() => setShowConsultationModal(true)}
            />
          )}

          {activeTab === 'timeline' && (
            <InquiryTimeline inquiry={currentInquiry} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer/Admin Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              {isAdmin ? 'Customer Information' : 'Service Provider'}
            </h3>
            
            {isAdmin ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {currentInquiry.customer?.customerProfile?.firstName} {currentInquiry.customer?.customerProfile?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {currentInquiry.customer?.email}
                    </p>
                  </div>
                </div>
                {currentInquiry.customer?.phone && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Phone: {currentInquiry.customer.phone}
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Button size="sm" className="w-full">
                    Contact Customer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      TesGold Services
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Professional Service Provider
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Button size="sm" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {isAdmin && (
                <>
                  {currentInquiry.status === 'pending' && (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => setShowQuoteModal(true)}
                      leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                    >
                      Submit Quote
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowConsultationModal(true)}
                    leftIcon={<CalendarIcon className="h-4 w-4" />}
                  >
                    Schedule Consultation
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowStatusModal(true)}
                  >
                    Update Status
                  </Button>
                </>
              )}

              {isCustomer && currentInquiry.quotes?.some(q => q.status === 'pending') && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => setShowReviewModal(true)}
                  leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                >
                  Review Quotes
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => setActiveTab('messages')}
                leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
              >
                Send Message
              </Button>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Status History
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Current: {currentInquiry.status.replace('-', ' ')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(currentInquiry.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Submitted
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(currentInquiry.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuoteSubmissionModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        inquiry={currentInquiry}
      />

      <QuoteReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        inquiry={currentInquiry}
      />

      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={currentInquiry.status}
        onUpdate={handleStatusUpdate}
      />

      <ConsultationScheduler
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        inquiry={currentInquiry}
      />
    </div>
  );
};

export default ServiceInquiryDetail;