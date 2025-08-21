import { useState } from 'react';
import { 
  XMarkIcon,
  BuildingOfficeIcon,
  CheckIcon,
  XMarkIcon as RejectIcon,
  ExclamationTriangleIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatCurrency, formatRelativeTime, formatDate } from '../../utils/helpers';

const ListingDetailsModal = ({ listing, onClose, onListingAction }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const tabs = [
    { id: 'details', label: 'Listing Details', icon: BuildingOfficeIcon },
    { id: 'seller', label: 'Seller Info', icon: UserIcon },
    { id: 'images', label: 'Images', icon: EyeIcon }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20',
      approved: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20',
      rejected: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
    };
    return colors[status] || colors.pending;
  };

  const handleApprove = () => {
    onListingAction('approve', listing);
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onListingAction('reject', listing, rejectionReason);
    onClose();
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const rejectionReasons = [
    'Inappropriate content',
    'Incomplete information',
    'Pricing issues',
    'Poor quality images',
    'Duplicate listing',
    'Missing documentation',
    'Suspicious activity',
    'Violation of terms'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {listing.title}
                </h3>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {listing.id}
                  </span>
                  {listing.flagged && (
                    <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <span className="text-xs">Flagged</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Action Buttons */}
          {listing.status === 'pending' && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleApprove}
                    leftIcon={<CheckIcon className="h-4 w-4" />}
                  >
                    Approve Listing
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectForm(!showRejectForm)}
                    leftIcon={<RejectIcon className="h-4 w-4" />}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Reject Listing
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted {formatRelativeTime(listing.submittedAt)}
                </div>
              </div>

              {/* Rejection Form */}
              {showRejectForm && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-3">
                    Reason for Rejection
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {rejectionReasons.map((reason) => (
                        <button
                          key={reason}
                          onClick={() => setRejectionReason(reason)}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            rejectionReason === reason
                              ? 'bg-red-500 text-white'
                              : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60'
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter custom rejection reason..."
                      rows={3}
                      className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectionReason('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleReject}
                        disabled={!rejectionReason.trim()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Reject Listing
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600 dark:text-red-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                      <p className="mt-1 text-gray-900 dark:text-gray-100">{listing.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                      <p className="mt-1 text-gray-900 dark:text-gray-100 capitalize">{listing.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                      <p className="mt-1 text-gray-900 dark:text-gray-100 capitalize">{listing.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                      <p className="mt-1 text-gray-900 dark:text-gray-100 font-semibold">
                        {formatCurrency(listing.price, listing.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Description
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                {/* Location */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Location
                  </h4>
                  <div className="flex items-start space-x-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {listing.location.city}, {listing.location.subcity}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {listing.location.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {listing.features && listing.features.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {listing.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {listing.specifications && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Specifications
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(listing.specifications).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flagged Information */}
                {listing.flagged && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-red-900 dark:text-red-100">
                          This listing has been flagged
                        </h4>
                        {listing.flagReason && (
                          <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                            {listing.flagReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="space-y-6">
                {/* Seller Profile */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {listing.seller.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 capitalize">
                      {listing.seller.type}
                    </p>
                    {listing.seller.verified && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full mt-2">
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h5 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Contact Information
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Email</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{listing.seller.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Phone</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{listing.seller.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seller Statistics */}
                <div>
                  <h5 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Seller Statistics
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Listings</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">12</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Listings</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">8</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">2023</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">95%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-4">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    {/* Main Image Display */}
                    <div className="relative">
                      <img
                        src={listing.images[activeImageIndex]}
                        alt={`${listing.title} - Image ${activeImageIndex + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      
                      {listing.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                          >
                            <ChevronLeftIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}

                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        {activeImageIndex + 1} / {listing.images.length}
                      </div>
                    </div>

                    {/* Image Thumbnails */}
                    {listing.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {listing.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`relative aspect-square rounded-lg overflow-hidden ${
                              index === activeImageIndex ? 'ring-2 ring-red-500' : ''
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <EyeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No images available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Submitted on {formatDate(listing.submittedAt)}
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsModal;