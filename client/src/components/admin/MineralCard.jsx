// components/admin/MineralCard.jsx
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  TruckIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/helpers';

const MineralCard = ({ 
  mineral, 
  isSelected, 
  onSelect, 
  onView, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
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

  const getQualityBadgeColor = (grade) => {
    const colors = {
      premium: 'bg-purple-100 text-purple-800 border-purple-200',
      high: 'bg-blue-100 text-blue-800 border-blue-200',
      medium: 'bg-green-100 text-green-800 border-green-200',
      standard: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[grade] || colors.standard;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white dark:bg-gray-800 border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
        isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(mineral._id, e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mineral.status)}`}>
          {mineral.status}
        </span>
      </div>

      {/* Mineral Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
        {mineral.media?.images?.[0]?.url ? (
          <img
            src={mineral.media.images[0].url}
            alt={mineral.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <span className="text-6xl">
              {getTypeIcon(mineral.mineralDetails?.mineralType)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {mineral.title}
          </h3>
          
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">
              {getTypeIcon(mineral.mineralDetails?.mineralType)}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
              {mineral.mineralDetails?.mineralType || 'Unknown Type'}
            </span>
          </div>

          {mineral.mineralDetails?.quality?.grade && (
            <span className={`inline-block px-2 py-1 text-xs font-medium border rounded-full ${
              getQualityBadgeColor(mineral.mineralDetails.quality.grade)
            }`}>
              {mineral.mineralDetails.quality.grade} Grade
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <CurrencyDollarIcon className="h-4 w-4" />
              <span>Price</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(mineral.pricing?.basePrice || 0)}
              {mineral.pricing?.priceType === 'per-kg' && '/kg'}
              {mineral.pricing?.priceType === 'per-ton' && '/ton'}
            </span>
          </div>

          {mineral.mineralDetails?.quality?.purity && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <BeakerIcon className="h-4 w-4" />
                <span>Purity</span>
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {mineral.mineralDetails.quality.purity}%
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <ScaleIcon className="h-4 w-4" />
              <span>Stock</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {mineral.inventory?.stock || 0} {mineral.inventory?.stockUnit || 'kg'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <TruckIcon className="h-4 w-4" />
              <span>Origin</span>
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {mineral.mineralDetails?.origin?.country || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(mineral)}
            leftIcon={<EyeIcon className="h-4 w-4" />}
            className="flex-1"
          >
            View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(mineral)}
            leftIcon={<PencilIcon className="h-4 w-4" />}
            className="flex-1"
          >
            Edit
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(mineral)}
            leftIcon={<TrashIcon className="h-4 w-4" />}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Delete
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>Views: {mineral.views || 0}</span>
            <span>Created: {formatDate(mineral.createdAt)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MineralCard;