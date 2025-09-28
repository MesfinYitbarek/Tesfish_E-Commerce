// pages/admin/MineralManagement.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { 

  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  CheckIcon,
  XMarkIcon,
  ChartBarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TruckIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchMineralsForAdmin,
  fetchMineralStats,
  fetchMineralTypes,
  deleteMineral,
  updateMineralStatus,
  bulkUpdateMinerals,
  exportMinerals,
  setMineralFilters,
  clearMineralFilters,
  selectMinerals,
  selectMineralLoading,
  selectMineralError,
  selectMineralStats,
  selectMineralTypes,
  selectMineralPagination,
  selectMineralFilters,
  selectActiveMineralFiltersCount
} from '../../store/slices/productSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MineralCard from '../../components/admin/MineralCard';
import MineralFormModal from '../../components/admin/MineralFormModal';
import MineralDetailsModal from '../../components/admin/MineralDetailsModal';
import BulkMineralActionsModal from '../../components/admin/BulkMineralActionsModal';
import MineralStatsWidget from '../../components/admin/MineralStatsWidget';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/helpers';

const MineralManagement = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Redux state
  const minerals = useSelector(selectMinerals);
  const isLoading = useSelector(selectMineralLoading);
  const error = useSelector(selectMineralError);
  const stats = useSelector(selectMineralStats);
  const mineralTypes = useSelector(selectMineralTypes);
  const pagination = useSelector(selectMineralPagination);
  const filters = useSelector(selectMineralFilters);
  const activeFiltersCount = useSelector(selectActiveMineralFiltersCount);

  // Local state
  const [selectedMinerals, setSelectedMinerals] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMineral, setSelectedMineral] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    loadMinerals();
    dispatch(fetchMineralStats());
    dispatch(fetchMineralTypes());
  }, [dispatch, filters]);

  const loadMinerals = () => {
    dispatch(fetchMineralsForAdmin(filters));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setMineralFilters({ ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    dispatch(clearMineralFilters());
    toast.success('Filters cleared');
  };

  const handlePageChange = (page) => {
    dispatch(setMineralFilters({ page }));
  };

  const handleSelectMineral = (mineralId, selected) => {
    if (selected) {
      setSelectedMinerals([...selectedMinerals, mineralId]);
    } else {
      setSelectedMinerals(selectedMinerals.filter(id => id !== mineralId));
    }
  };

  const handleSelectAll = () => {
    if (selectedMinerals.length === minerals.length) {
      setSelectedMinerals([]);
    } else {
      setSelectedMinerals(minerals.map(mineral => mineral._id));
    }
  };

  const handleCreateMineral = () => {
    setSelectedMineral(null);
    setShowCreateModal(true);
  };

  const handleEditMineral = (mineral) => {
    setSelectedMineral(mineral);
    setShowEditModal(true);
  };

  const handleViewMineral = (mineral) => {
    setSelectedMineral(mineral);
    setShowDetailsModal(true);
  };

  const handleDeleteMineral = (mineral) => {
    setSelectedMineral(mineral);
    setShowDeleteDialog(true);
  };

  const confirmDeleteMineral = async () => {
    try {
      await dispatch(deleteMineral(selectedMineral._id)).unwrap();
      setShowDeleteDialog(false);
      setSelectedMineral(null);
      loadMinerals();
    } catch (error) {
      console.error('Error deleting mineral:', error);
    }
  };

  const handleStatusChange = async (mineralId, newStatus) => {
    try {
      await dispatch(updateMineralStatus({ mineralId, status: newStatus })).unwrap();
      loadMinerals();
    } catch (error) {
      console.error('Error updating mineral status:', error);
    }
  };

  const handleBulkAction = async (action, mineralIds, additionalData = {}) => {
    try {
      await dispatch(bulkUpdateMinerals({ 
        mineralIds, 
        updates: { 
          [action]: additionalData.value || true,
          ...additionalData 
        } 
      })).unwrap();
      setSelectedMinerals([]);
      setShowBulkActions(false);
      loadMinerals();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await dispatch(exportMinerals(filters)).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `minerals-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting minerals:', error);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'sold', label: 'Sold' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'discontinued', label: 'Discontinued' }
  ];

  const qualityGradeOptions = [
    { value: '', label: 'All Grades' },
    { value: 'premium', label: 'Premium' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'standard', label: 'Standard' },
    { value: 'low', label: 'Low' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'purity-high', label: 'Purity: High to Low' },
    { value: 'purity-low', label: 'Purity: Low to High' }
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <FunnelIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Minerals
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={loadMinerals}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <FunnelIcon className="h-8 w-8 mr-3 text-primary-600 dark:text-primary-400" />
            Mineral Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your mineral inventory, pricing, and availability
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Stats Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            leftIcon={<ChartBarIcon className="h-4 w-4" />}
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </Button>

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
          >
            Export CSV
          </Button>

          {/* Create Mineral */}
          <Button
            onClick={handleCreateMineral}
            leftIcon={<PlusIcon className="h-4 w-4" />}
          >
            Add Mineral
          </Button>
        </div>
      </div>

      {/* Statistics Widget */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MineralStatsWidget 
              stats={stats}
              mineralTypes={mineralTypes}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {mineralTypes.map(type => (
            <button
              key={type._id}
              onClick={() => handleFilterChange({ mineralType: filters.mineralType === type._id ? '' : type._id })}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filters.mineralType === type._id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {type._id}
              {type.count > 0 && (
                <span className="ml-2 text-xs">({type.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by name, type, origin..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<FunnelIcon className="h-4 w-4" />}
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quality Grade
                  </label>
                  <select 
                    value={filters.qualityGrade}
                    onChange={(e) => handleFilterChange({ qualityGrade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    {qualityGradeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Origin Country
                  </label>
                  <Input
                    placeholder="e.g., Ethiopia"
                    value={filters.originCountry}
                    onChange={(e) => handleFilterChange({ originCountry: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region
                  </label>
                  <Input
                    placeholder="e.g., Oromia"
                    value={filters.region}
                    onChange={(e) => handleFilterChange({ region: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select 
                    value={filters.sort}
                    onChange={(e) => handleFilterChange({ sort: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Price (ETB)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Price (ETB)
                  </label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Purity (%)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={filters.minPurity}
                    onChange={(e) => handleFilterChange({ minPurity: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Purity (%)
                  </label>
                  <Input
                    type="number"
                    placeholder="100"
                    min="0"
                    max="100"
                    value={filters.maxPurity}
                    onChange={(e) => handleFilterChange({ maxPurity: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        {/* Header with Bulk Actions */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {minerals.length > 0 && (
                  <input
                    type="checkbox"
                    checked={selectedMinerals.length === minerals.length && minerals.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMinerals.length > 0 
                    ? `${selectedMinerals.length} selected`
                    : `${pagination.totalMinerals || 0} minerals`
                  }
                </span>
              </div>

              {selectedMinerals.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => setShowBulkActions(true)}
                  leftIcon={<CheckIcon className="h-4 w-4" />}
                >
                  Bulk Actions
                </Button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4" />
                <span>Grid</span>
              </button>
              
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <ListBulletIcon className="h-4 w-4" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Minerals List/Grid */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" text="Loading minerals..." />
            </div>
          ) : minerals.length > 0 ? (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {minerals.map(mineral => (
                    <MineralCard
                      key={mineral._id}
                      mineral={mineral}
                      isSelected={selectedMinerals.includes(mineral._id)}
                      onSelect={handleSelectMineral}
                      onView={handleViewMineral}
                      onEdit={handleEditMineral}
                      onDelete={handleDeleteMineral}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {minerals.map(mineral => (
                    <MineralListItem
                      key={mineral._id}
                      mineral={mineral}
                      isSelected={selectedMinerals.includes(mineral._id)}
                      onSelect={handleSelectMineral}
                      onView={handleViewMineral}
                      onEdit={handleEditMineral}
                      onDelete={handleDeleteMineral}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                    {Math.min(pagination.currentPage * filters.limit, pagination.totalMinerals)} of{' '}
                    {pagination.totalMinerals} minerals
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    
                    <span className="px-3 py-2 text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FunnelIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No minerals found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {activeFiltersCount > 0
                  ? 'No minerals match your current filters. Try adjusting your search criteria.'
                  : 'Get started by adding your first mineral to the inventory.'
                }
              </p>
              {activeFiltersCount > 0 ? (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={handleCreateMineral} leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Add Your First Mineral
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <MineralFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadMinerals();
          }}
          mode="create"
        />
      )}

      {showEditModal && selectedMineral && (
        <MineralFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            loadMinerals();
          }}
          mode="edit"
          mineral={selectedMineral}
        />
      )}

      {showDetailsModal && selectedMineral && (
        <MineralDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          mineral={selectedMineral}
          onEdit={handleEditMineral}
          onDelete={handleDeleteMineral}
          onStatusChange={handleStatusChange}
        />
      )}

      {showBulkActions && (
        <BulkMineralActionsModal
          isOpen={showBulkActions}
          onClose={() => setShowBulkActions(false)}
          selectedMinerals={selectedMinerals}
          minerals={minerals.filter(m => selectedMinerals.includes(m._id))}
          onBulkAction={handleBulkAction}
        />
      )}

      {showDeleteDialog && selectedMineral && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDeleteMineral}
          title="Delete Mineral"
          message={`Are you sure you want to delete "${selectedMineral.title}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmVariant="danger"
        />
      )}
    </div>
  );
};

// Mineral List Item Component
const MineralListItem = ({ 
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary-500 border-primary-300' : ''
      }`}
    >
      {/* Selection Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(mineral._id, e.target.checked)}
        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      />

      {/* Mineral Image */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
        {mineral.media?.images?.[0]?.url ? (
          <img
            src={mineral.media.images[0].url}
            alt={mineral.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl">
            {getTypeIcon(mineral.mineralDetails?.mineralType)}
          </span>
        )}
      </div>

      {/* Mineral Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {mineral.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mineral.status)}`}>
            {mineral.status}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center space-x-1">
            <BeakerIcon className="h-4 w-4" />
            <span>{mineral.mineralDetails?.mineralType || 'Unknown'}</span>
          </span>
          
          <span className="flex items-center space-x-1">
            <CurrencyDollarIcon className="h-4 w-4" />
            <span>{formatCurrency(mineral.pricing?.basePrice || 0)}</span>
          </span>
          
          {mineral.mineralDetails?.quality?.purity && (
            <span className="flex items-center space-x-1">
              <span>🎯</span>
              <span>{mineral.mineralDetails.quality.purity}% purity</span>
            </span>
          )}
          
          <span className="flex items-center space-x-1">
            <TruckIcon className="h-4 w-4" />
            <span>{mineral.mineralDetails?.origin?.country || 'Unknown'}</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-500">
          <span>Grade: {mineral.mineralDetails?.quality?.grade || 'Standard'}</span>
          <span>•</span>
          <span>Stock: {mineral.inventory?.stock || 0} {mineral.inventory?.stockUnit || 'kg'}</span>
          <span>•</span>
          <span>Created: {formatDate(mineral.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(mineral)}
          leftIcon={<EyeIcon className="h-4 w-4" />}
        >
          View
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(mineral)}
          leftIcon={<PencilIcon className="h-4 w-4" />}
        >
          Edit
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(mineral)}
          leftIcon={<TrashIcon className="h-4 w-4" />}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
};

export default MineralManagement;