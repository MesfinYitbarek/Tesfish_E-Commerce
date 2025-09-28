// components/admin/MineralDetailsModal.jsx - Fixed Modal with Modern Design
import { useState } from 'react';
import { 
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  TruckIcon,
  ScaleIcon,
  DocumentTextIcon,
  PhotoIcon,
  CalendarIcon,
  EyeIcon,
  TagIcon,
  MapPinIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const MineralDetailsModal = ({ 
  isOpen, 
  onClose, 
  mineral, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DocumentTextIcon },
    { id: 'details', label: 'Mineral Details', icon: BeakerIcon },
    { id: 'media', label: 'Media', icon: PhotoIcon },
    { id: 'history', label: 'History', icon: CalendarIcon }
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      draft: 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400',
      sold: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'out-of-stock': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      discontinued: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };
    return colors[status] || colors.draft;
  };

  const getTypeIcon = (type) => {
    const icons = {
      gold: '🥇',
      silver: '🥈',
      copper: '🟤',
      iron: '⚫',
      zinc: '⚪',
      lead: '⚫',
      gemstones: '💎',
      coal: '⚫',
      salt: '🧂',
      limestone: '🪨',
      marble: '⬜',
      granite: '🪨',
      sand: '🏖️',
      gravel: '🪨',
      other: '🪨'
    };
    return icons[type] || '🪨';
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(mineral._id);
    toast.success('Mineral ID copied to clipboard');
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Title</h4>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{mineral.title}</p>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Type</h4>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getTypeIcon(mineral.mineralDetails?.mineralType)}</span>
              <span className="text-sm capitalize text-slate-900 dark:text-slate-100">
                {mineral.mineralDetails?.mineralType || 'Unknown'}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status</h4>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mineral.status)}`}>
              {mineral.status}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Verification</h4>
            <div className="flex items-center space-x-2">
              {mineral.isVerified ? (
                <CheckBadgeIcon className="h-4 w-4 text-green-500" />
              ) : (
                <XMarkIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs text-slate-900 dark:text-slate-100">
                {mineral.isVerified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Price</h4>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(mineral.pricing?.basePrice || 0)}
              {mineral.pricing?.priceType === 'per-kg' && (
                <span className="text-xs font-normal text-slate-500"> /kg</span>
              )}
              {mineral.pricing?.priceType === 'per-ton' && (
                <span className="text-xs font-normal text-slate-500"> /ton</span>
              )}
            </div>
            {mineral.pricing?.isNegotiable && (
              <span className="text-xs text-blue-600 dark:text-blue-400">Negotiable</span>
            )}
          </div>

          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Stock</h4>
            <p className="text-sm text-slate-900 dark:text-slate-100">
              {mineral.inventory?.stock || 0} {mineral.inventory?.stockUnit || 'kg'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Origin</h4>
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-3 w-3 text-slate-400" />
              <span className="text-sm text-slate-900 dark:text-slate-100">
                {mineral.mineralDetails?.origin?.region && `${mineral.mineralDetails.origin.region}, `}
                {mineral.mineralDetails?.origin?.country || 'Unknown'}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Views</h4>
            <div className="flex items-center space-x-1">
              <EyeIcon className="h-3 w-3 text-slate-400" />
              <span className="text-sm text-slate-900 dark:text-slate-100">
                {mineral.views || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {mineral.description && (
        <div>
          <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Description</h4>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed">{mineral.description}</p>
          </div>
        </div>
      )}

      {/* Tags */}
      {mineral.tags && mineral.tags.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-1">
            {mineral.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full"
              >
                <TagIcon className="h-2 w-2" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div>
          <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Created</h4>
          <p className="text-xs text-slate-900 dark:text-slate-100">{formatDate(mineral.createdAt)}</p>
        </div>
        <div>
          <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Last Updated</h4>
          <p className="text-xs text-slate-900 dark:text-slate-100">{formatDate(mineral.updatedAt)}</p>
        </div>
        <div className="md:col-span-2">
          <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">ID</h4>
          <div className="flex items-center space-x-2">
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">
              {mineral._id}
            </code>
            <button
              onClick={handleCopyId}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <ClipboardDocumentIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-4">
      {/* Quality Information */}
      <div>
        <h4 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center">
          <BeakerIcon className="h-4 w-4 mr-2" />
          Quality Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
          <div>
            <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Grade</h5>
            <p className="text-sm capitalize text-slate-900 dark:text-slate-100">
              {mineral.mineralDetails?.quality?.grade || 'Standard'}
            </p>
          </div>
          {mineral.mineralDetails?.quality?.purity && (
            <div>
              <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Purity</h5>
              <p className="text-sm text-slate-900 dark:text-slate-100">
                {mineral.mineralDetails.quality.purity}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Origin Information */}
      <div>
        <h4 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center">
          <TruckIcon className="h-4 w-4 mr-2" />
          Origin Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
          <div>
            <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Country</h5>
            <p className="text-sm text-slate-900 dark:text-slate-100">
              {mineral.mineralDetails?.origin?.country || 'Not specified'}
            </p>
          </div>
          {mineral.mineralDetails?.origin?.region && (
            <div>
              <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Region</h5>
              <p className="text-sm text-slate-900 dark:text-slate-100">
                {mineral.mineralDetails.origin.region}
              </p>
            </div>
          )}
          {mineral.mineralDetails?.origin?.mine && (
            <div className="md:col-span-2">
              <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mine</h5>
              <p className="text-sm text-slate-900 dark:text-slate-100">
                {mineral.mineralDetails.origin.mine}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Physical Properties */}
      {mineral.mineralDetails?.weight && (
        <div>
          <h4 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center">
            <ScaleIcon className="h-4 w-4 mr-2" />
            Physical Properties
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <div>
              <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Weight</h5>
              <p className="text-sm text-slate-900 dark:text-slate-100">
                {mineral.mineralDetails.weight.value} {mineral.mineralDetails.weight.unit}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Certification */}
      {mineral.mineralDetails?.certification && (
        <div>
          <h4 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center">
            <CheckBadgeIcon className="h-4 w-4 mr-2" />
            Certification
          </h4>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status</h5>
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  {mineral.mineralDetails.certification.certified ? 'Certified' : 'Not Certified'}
                </p>
              </div>
              {mineral.mineralDetails.certification.certificationBody && (
                <div>
                  <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Certifying Body</h5>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {mineral.mineralDetails.certification.certificationBody}
                  </p>
                </div>
              )}
              {mineral.mineralDetails.certification.certificateNumber && (
                <div>
                  <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Certificate Number</h5>
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-mono">
                    {mineral.mineralDetails.certification.certificateNumber}
                  </p>
                </div>
              )}
              {mineral.mineralDetails.certification.validUntil && (
                <div>
                  <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Valid Until</h5>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {formatDate(mineral.mineralDetails.certification.validUntil)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Specifications */}
      {mineral.specifications && mineral.specifications.length > 0 && (
        <div>
          <h4 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-3">
            Additional Specifications
          </h4>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <div className="space-y-2">
              {mineral.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {spec.name}
                  </span>
                  <span className="text-xs text-slate-900 dark:text-slate-100">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-4">
      {/* Images */}
      {mineral.media?.images && mineral.media.images.length > 0 ? (
        <div>
          <h4 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-3">Images</h4>
          
          {/* Main Image */}
          <div className="mb-3">
            <img
              src={mineral.media.images[selectedImage]?.url}
              alt={mineral.media.images[selectedImage]?.alt || mineral.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Thumbnail Grid */}
          {mineral.media.images.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {mineral.media.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `${mineral.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <PhotoIcon className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">No images available</p>
        </div>
      )}

      {/* Documents */}
      {mineral.media?.documents && mineral.media.documents.length > 0 && (
        <div>
          <h4 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-3">Documents</h4>
          <div className="space-y-2">
            {mineral.media.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {doc.name || `Document ${index + 1}`}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(doc.url, '_blank')}
                  className="text-xs py-1 px-2"
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-3">
      <div className="text-center py-6">
        <CalendarIcon className="h-12 w-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">History tracking coming soon</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          This will show creation, updates, status changes, and other activities
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'details':
        return renderDetails();
      case 'media':
        return renderMedia();
      case 'history':
        return renderHistory();
      default:
        return renderOverview();
    }
  };

  if (!isOpen || !mineral) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-slate-200/60 dark:border-slate-700/60"
        >
          {/* Header - Fixed */}
          <div className="flex-shrink-0 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {getTypeIcon(mineral.mineralDetails?.mineralType)}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {mineral.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {mineral.mineralDetails?.mineralName || 'Mineral Details'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(mineral)}
                  leftIcon={<PencilIcon className="h-3 w-3" />}
                  className="text-xs py-1 px-2"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(mineral)}
                  leftIcon={<TrashIcon className="h-3 w-3" />}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs py-1 px-2"
                >
                  Delete
                </Button>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-3">
              <nav className="flex space-x-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-xs transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                    }`}
                  >
                    <tab.icon className="h-3 w-3" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
            <div className="px-5 py-4">
              {renderTabContent()}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MineralDetailsModal;