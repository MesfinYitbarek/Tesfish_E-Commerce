// pages/admin/AdminProjects.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CubeIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UsersIcon,
  PhotoIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import {
  fetchAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
  toggleFeaturedProject,
  duplicateProject,
  deleteMultipleProjects,
  fetchProjectStats,
  fetchProjectCategories,
  setFilter,
  updateFilters,
  resetFilters,
  clearError,
  selectAdminProjects,
  selectProjectStats,
  selectProjectCategories,
  selectIsProjectsLoading,
  selectIsCreatingProject,
  selectIsUpdatingProject,
  selectIsDeletingProject,
  selectAdminProjectsError,
  selectProjectsPagination,
  selectProjectsFilters
} from '../../store/slices/projectSlice';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-hot-toast';
import { formatDate, formatCurrency, cn } from '../../utils/helpers';
import ProjectCreateForm from '../../components/admin/ProjectCreateForm';

const AdminProjects = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux state
  const projects = useSelector(selectAdminProjects);
  const stats = useSelector(selectProjectStats);
  const categories = useSelector(selectProjectCategories);
  const isLoading = useSelector(selectIsProjectsLoading);
  const isCreating = useSelector(selectIsCreatingProject);
  const isUpdating = useSelector(selectIsUpdatingProject);
  const isDeleting = useSelector(selectIsDeletingProject);
  const error = useSelector(selectAdminProjectsError);
  const pagination = useSelector(selectProjectsPagination);
  const filters = useSelector(selectProjectsFilters);

  // Local state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter options
  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: BuildingOfficeIcon },
    { value: 'project-management', label: 'Project Management', icon: ChartBarIcon },
    { value: 'engineering', label: 'Engineering', icon: CogIcon },
    { value: 'interior', label: 'Interior Design', icon: HomeIcon },
    { value: 'real-estate', label: 'Real Estate', icon: BuildingOfficeIcon },
    { value: 'mineral', label: 'Mineral Services', icon: CubeIcon }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'planning', label: 'Planning', color: 'yellow' },
    { value: 'ongoing', label: 'Ongoing', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'paused', label: 'Paused', color: 'orange' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'budget-high', label: 'Budget (High to Low)' },
    { value: 'budget-low', label: 'Budget (Low to High)' },
    { value: 'progress', label: 'Progress' },
    { value: 'views', label: 'Most Viewed' }
  ];

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchAdminProjects(filters));
    dispatch(fetchProjectStats());
    dispatch(fetchProjectCategories());
  }, [dispatch, filters]);

  // Handle URL search params
  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    if (Object.keys(params).length > 0) {
      dispatch(updateFilters(params));
    }
  }, [searchParams, dispatch]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setSearchParams({});
  };

  // Handle project actions
  const handleCreateProject = () => {
    setSelectedProject(null);
    setShowCreateModal(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = async () => {
    if (projectToDelete) {
      await dispatch(deleteProject(projectToDelete._id));
      setShowDeleteModal(false);
      setProjectToDelete(null);
      // Refresh the list
      dispatch(fetchAdminProjects(filters));
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    await dispatch(updateProjectStatus({ projectId, status: newStatus }));
  };

  const handleToggleFeatured = async (projectId) => {
    await dispatch(toggleFeaturedProject(projectId));
  };

  const handleDuplicateProject = async (projectId) => {
    await dispatch(duplicateProject(projectId));
    // Refresh the list
    dispatch(fetchAdminProjects(filters));
  };

  // Bulk actions
  const handleSelectProject = (projectId) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAllProjects = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(p => p._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.length > 0) {
      await dispatch(deleteMultipleProjects(selectedProjects));
      setSelectedProjects([]);
      setShowBulkActions(false);
      // Refresh the list
      dispatch(fetchAdminProjects(filters));
    }
  };

  // Pagination
  const handlePageChange = (page) => {
    dispatch(setFilter({ key: 'page', value: page }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: { label: 'Planning', color: 'yellow', icon: ClockIcon },
      ongoing: { label: 'Ongoing', color: 'blue', icon: ArrowPathIcon },
      completed: { label: 'Completed', color: 'green', icon: CheckCircleIcon },
      paused: { label: 'Paused', color: 'orange', icon: ExclamationTriangleIcon },
      cancelled: { label: 'Cancelled', color: 'red', icon: XMarkIcon }
    };
    const config = statusConfig[status] || statusConfig.planning;
    const Icon = config.icon;
    return (
      <Badge variant={config.color} size="sm" leftIcon={<Icon className="h-3 w-3" />}>
        {config.label}
      </Badge>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'project-management': ChartBarIcon,
      'engineering': CogIcon,
      'interior': HomeIcon,
      'real-estate': BuildingOfficeIcon,
      'mineral': CubeIcon
    };
    return icons[category] || BuildingOfficeIcon;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Projects
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchAdminProjects(filters))}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Project Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and oversee all company projects
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<ArrowPathIcon className="h-4 w-4" />}
            onClick={() => dispatch(fetchAdminProjects(filters))}
            disabled={isLoading}
          >
            Refresh
          </Button>
          
          <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={handleCreateProject}
            disabled={isCreating}
          >
            Create Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Projects"
            value={stats.overview?.[0]?.totalProjects || 0}
            icon={BuildingOfficeIcon}
            color="blue"
          />
          <StatsCard
            title="Ongoing Projects"
            value={stats.byStatus?.find(s => s._id === 'ongoing')?.count || 0}
            icon={ArrowPathIcon}
            color="yellow"
          />
          <StatsCard
            title="Completed Projects"
            value={stats.byStatus?.find(s => s._id === 'completed')?.count || 0}
            icon={CheckCircleIcon}
            color="green"
          />
          <StatsCard
            title="Total Budget"
            value={formatCurrency(stats.overview?.[0]?.totalBudget || 0)}
            icon={CurrencyDollarIcon}
            color="purple"
          />
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* View Mode & Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>

            {selectedProjects.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<TrashIcon className="h-4 w-4" />}
                onClick={() => setShowBulkActions(true)}
                className="text-red-600 hover:text-red-700"
              >
                Delete Selected ({selectedProjects.length})
              </Button>
            )}

            <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 text-sm font-medium rounded-l-lg transition-colors',
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                )}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'p-2 text-sm font-medium rounded-r-lg transition-colors border-l border-gray-200 dark:border-gray-600',
                  viewMode === 'table'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                )}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minBudget || ''}
                      onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                      className="w-full px-2 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxBudget || ''}
                      onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                      className="w-full px-2 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.featured === 'true'}
                      onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : null)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured Only</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.public === 'true'}
                      onChange={(e) => handleFilterChange('public', e.target.checked ? 'true' : null)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Public Only</span>
                  </label>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        {(filters.category !== 'all' || filters.status !== 'all' || filters.search || 
          filters.featured || filters.public || filters.minBudget || filters.maxBudget) && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              
              {filters.category !== 'all' && (
                <Badge variant="blue" size="sm">
                  Category: {categoryOptions.find(c => c.value === filters.category)?.label}
                </Badge>
              )}
              
              {filters.status !== 'all' && (
                <Badge variant="green" size="sm">
                  Status: {statusOptions.find(s => s.value === filters.status)?.label}
                </Badge>
              )}
              
              {filters.search && (
                <Badge variant="gray" size="sm">
                  Search: "{filters.search}"
                </Badge>
              )}
              
              {filters.featured === 'true' && (
                <Badge variant="yellow" size="sm">Featured</Badge>
              )}
              
              {filters.public === 'true' && (
                <Badge variant="purple" size="sm">Public</Badge>
              )}
              
              {(filters.minBudget || filters.maxBudget) && (
                <Badge variant="orange" size="sm">
                  Budget: {filters.minBudget || '0'} - {filters.maxBudget || '∞'}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Projects Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {isLoading && projects.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filters.search || filters.category !== 'all' || filters.status !== 'all'
                ? 'No projects match your current filters. Try adjusting your search criteria.'
                : 'Get started by creating your first project.'
              }
            </p>
            <Button onClick={handleCreateProject}>
              Create Project
            </Button>
          </div>
        ) : (
          <>
            {/* Bulk Actions Header */}
            {selectedProjects.length > 0 && (
              <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProjects([])}
                    >
                      Clear Selection
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      leftIcon={<TrashIcon className="h-4 w-4" />}
                      onClick={() => setShowBulkActions(true)}
                    >
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Table Header (for table view) */}
            {viewMode === 'table' && (
              <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={selectedProjects.length === projects.length}
                      onChange={handleSelectAllProjects}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-8 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="col-span-2">Project</div>
                    <div>Category</div>
                    <div>Status</div>
                    <div>Budget</div>
                    <div>Progress</div>
                    <div>Created</div>
                    <div>Actions</div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects List */}
            <div className={viewMode === 'grid' ? 'p-6' : ''}>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      index={index}
                      isSelected={selectedProjects.includes(project._id)}
                      onSelect={handleSelectProject}
                      onEdit={handleEditProject}
                      onDelete={handleDeleteProject}
                      onStatusChange={handleStatusChange}
                      onToggleFeatured={handleToggleFeatured}
                      onDuplicate={handleDuplicateProject}
                      getStatusBadge={getStatusBadge}
                      getCategoryIcon={getCategoryIcon}
                    />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {projects.map((project) => (
                    <ProjectTableRow
                      key={project._id}
                      project={project}
                      isSelected={selectedProjects.includes(project._id)}
                      onSelect={handleSelectProject}
                      onEdit={handleEditProject}
                      onDelete={handleDeleteProject}
                      onStatusChange={handleStatusChange}
                      onToggleFeatured={handleToggleFeatured}
                      onDuplicate={handleDuplicateProject}
                      getStatusBadge={getStatusBadge}
                      getCategoryIcon={getCategoryIcon}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.total)} of {pagination.total} projects
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      leftIcon={<ChevronLeftIcon className="h-4 w-4" />}
                    >
                      Previous
                    </Button>
                    
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      rightIcon={<ChevronRightIcon className="h-4 w-4" />}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ProjectCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categories={categoryOptions.slice(1)} // Exclude 'all' option
      />

      <ProjectEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        project={selectedProject}
        categories={categoryOptions.slice(1)} // Exclude 'all' option
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      <BulkDeleteModal
        isOpen={showBulkActions}
        onClose={() => setShowBulkActions(false)}
        onConfirm={handleBulkDelete}
        count={selectedProjects.length}
        isLoading={isDeleting}
      />
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ 
  project, 
  index, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  onToggleFeatured, 
  onDuplicate,
  getStatusBadge,
  getCategoryIcon 
}) => {
  const CategoryIcon = getCategoryIcon(project.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 hover:shadow-lg',
        isSelected 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      )}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {project.media?.images?.[0] ? (
          <img
            src={project.media.images[0].url}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/api/placeholder/400/300';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <PhotoIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Overlay with selection checkbox */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-start justify-between p-4">
          <div>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(project._id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white rounded"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {project.displaySettings?.isFeatured && (
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            )}
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CategoryIcon className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="ml-3 flex-shrink-0">
            {getStatusBadge(project.status)}
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <UsersIcon className="h-4 w-4 mr-2" />
            <span className="truncate">{project.client?.name || 'No client'}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span className="truncate">{project.location?.city || 'No location'}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            <span>{formatCurrency(project.budget?.amount || 0)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{formatDate(project.timeline?.startDate)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {project.status === 'ongoing' && project.progress?.percentage !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{project.progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                style={{ width: `${project.progress.percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(project)}
              leftIcon={<PencilIcon className="h-3 w-3" />}
            >
              Edit
            </Button>
            
            <Menu as="div" className="relative">
              <Menu.Button as={Button} size="sm" variant="outline">
                <EllipsisVerticalIcon className="h-3 w-3" />
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onToggleFeatured(project._id)}
                          className={cn(
                            'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            'text-gray-900 dark:text-gray-100'
                          )}
                        >
                          <StarIcon className="w-4 h-4 mr-2" />
                          {project.displaySettings?.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                        </button>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onDuplicate(project._id)}
                          className={cn(
                            'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            'text-gray-900 dark:text-gray-100'
                          )}
                        >
                          <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                          Duplicate Project
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onDelete(project)}
                          className={cn(
                            'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                            active ? 'bg-red-50 dark:bg-red-900/20' : '',
                            'text-red-600 dark:text-red-400'
                          )}
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete Project
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Status Change Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button as={Button} size="sm" variant="outline">
              Change Status
            </Menu.Button>
            
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="px-1 py-1">
                  {['planning', 'ongoing', 'completed', 'paused', 'cancelled'].map((status) => (
                    <Menu.Item key={status}>
                      {({ active }) => (
                        <button
                          onClick={() => onStatusChange(project._id, status)}
                          disabled={project.status === status}
                          className={cn(
                            'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            project.status === status 
                              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                              : 'text-gray-900 dark:text-gray-100'
                          )}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </motion.div>
  );
};

// Project Table Row Component
const ProjectTableRow = ({ 
  project, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  onToggleFeatured, 
  onDuplicate,
  getStatusBadge,
  getCategoryIcon 
}) => {
  const CategoryIcon = getCategoryIcon(project.category);

  return (
    <div className={cn(
      'px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
      isSelected && 'bg-blue-50 dark:bg-blue-900/20'
    )}>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(project._id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        
        <div className="flex-1 grid grid-cols-8 gap-4 items-center">
          {/* Project */}
          <div className="col-span-2 flex items-center space-x-3">
            <div className="flex-shrink-0">
              {project.media?.images?.[0] ? (
                <img
                  src={project.media.images[0].url}
                  alt={project.title}
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/40/40';
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <PhotoIcon className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {project.title}
                </p>
                {project.displaySettings?.isFeatured && (
                  <StarIconSolid className="h-4 w-4 text-yellow-400" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {project.client?.name || 'No client'}
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center space-x-2">
            <CategoryIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">
              {project.category.replace('-', ' ')}
            </span>
          </div>

          {/* Status */}
          <div>
            {getStatusBadge(project.status)}
          </div>

          {/* Budget */}
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formatCurrency(project.budget?.amount || 0)}
          </div>

          {/* Progress */}
          <div>
            {project.status === 'ongoing' && project.progress?.percentage !== undefined ? (
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${project.progress.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-0">
                  {project.progress.percentage}%
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
            )}
          </div>

          {/* Created */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(project.createdAt)}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              size="xs"
              variant="outline"
              onClick={() => onEdit(project)}
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
            
            <Menu as="div" className="relative">
              <Menu.Button as={Button} size="xs" variant="outline">
                <EllipsisVerticalIcon className="h-3 w-3" />
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onToggleFeatured(project._id)}
                          className={cn(
                            'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            'text-gray-900 dark:text-gray-100'
                          )}
                        >
                          <StarIcon className="w-4 h-4 mr-2" />
                          {project.displaySettings?.isFeatured ? 'Remove Featured' : 'Mark Featured'}
                        </button>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onDuplicate(project._id)}
                          className={cn(
                            'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            'text-gray-900 dark:text-gray-100'
                          )}
                        >
                          <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                          Duplicate
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onDelete(project)}
                          className={cn(
                            'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                            active ? 'bg-red-50 dark:bg-red-900/20' : '',
                            'text-red-600 dark:text-red-400'
                          )}
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        
        <div className="flex items-center justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Bulk Delete Modal Component
const BulkDeleteModal = ({ isOpen, onClose, onConfirm, count, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Multiple Projects" size="sm">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Delete {count} Projects
            </h3>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete {count} selected project{count !== 1 ? 's' : ''}? 
          This action cannot be undone.
        </p>
        
        <div className="flex items-center justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : `Delete ${count} Projects`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Project Create Modal Component (placeholder - you'll need to implement the full form)
const ProjectCreateModal = ({ isOpen, onClose, categories }) => {
  return (
    <ProjectCreateForm
      isOpen={isOpen}
      onClose={onClose}
      categories={categories}
    />
  );
};

// Project Edit Modal Component (placeholder - you'll need to implement the full form)
const ProjectEditModal = ({ isOpen, onClose, project, categories }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Project" size="xl">
      <div className="p-6">
        <div className="text-center py-12">
          <InformationCircleIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Project Edit Form
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The detailed project edit form would go here with all the project data pre-filled.
            Project: {project?.title}
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminProjects;