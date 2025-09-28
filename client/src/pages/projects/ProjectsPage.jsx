// pages/projects/ProjectsPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingOfficeIcon,
  CogIcon,
  HomeIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  StarIcon,
  SparklesIcon,
  CubeIcon,
  UsersIcon,
  PhotoIcon,
  PlayIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrophyIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  PauseCircleIcon,
  StopCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  fetchPublicProjects, 
  setFilter,
  resetFilters,
  setPage,
  incrementProjectViews,
  selectProjects,
  selectIsProjectsLoading,
  selectProjectsError,
  selectProjectsPagination,
  selectProjectsFilters,
} from '../../store/slices/projectSlice';

// Helper functions
const formatCurrency = (amount, currency = 'ETB') => {
  if (!amount || isNaN(amount)) return `${currency} 0`;
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'ETB' ? 'USD' : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  let formatted = formatter.format(amount);
  if (currency === 'ETB') {
    formatted = formatted.replace('$', 'ETB ');
  }
  
  // Convert to abbreviated form for large numbers
  if (amount >= 1000000000) {
    return `${currency} ${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `${currency} ${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${currency} ${(amount / 1000).toFixed(1)}K`;
  }
  
  return formatted;
};

const formatDate = (date) => {
  if (!date) return 'Not available';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};



const ProjectsPage = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const projects = useSelector(selectProjects);
  const isLoading = useSelector(selectIsProjectsLoading);
  const error = useSelector(selectProjectsError);
  const pagination = useSelector(selectProjectsPagination);
  const filters = useSelector(selectProjectsFilters);


  // Component state
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  // Categories configuration
  const categories = [
    { 
      id: 'all', 
      label: 'All Projects', 
      icon: BuildingOfficeIcon, 
      color: 'blue',
      description: 'View all our projects'
    },
    { 
      id: 'project-management', 
      label: 'Project Management', 
      icon: ChartBarIcon, 
      color: 'emerald',
      description: 'Comprehensive project management services'
    },
    { 
      id: 'landscape-design', 
      label: 'LandScape Design', 
      icon: ChartBarIcon, 
      color: 'emerald',
      description: 'Comprehensive LandScape Design services'
    },
    { 
      id: 'engineering', 
      label: 'Engineering Design', 
      icon: CogIcon, 
      color: 'purple',
      description: 'Civil and structural engineering solutions'
    },
    { 
      id: 'interior', 
      label: 'Interior Design', 
      icon: HomeIcon, 
      color: 'pink',
      description: 'Professional interior design services'
    },
    { 
      id: 'real-estate', 
      label: 'Real Estate', 
      icon: BuildingOfficeIcon, 
      color: 'orange',
      description: 'Real estate development and consulting'
    },
    { 
      id: 'mineral', 
      label: 'Mineral Services', 
      icon: CubeIcon, 
      color: 'amber',
      description: 'Mining and mineral exploration services'
    },
    {
      id: 'construction',
      label: 'Construction',
      icon: BuildingOfficeIcon,
      color: 'slate',
      description: 'Construction and building services'
    }
  ];

  const statuses = [
    { 
      id: 'all', 
      label: 'All Status', 
      color: 'gray',
      icon: CheckCircleIcon
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      color: 'green',
      icon: CheckCircleIcon
    },
    { 
      id: 'ongoing', 
      label: 'Ongoing', 
      color: 'blue',
      icon: ClockIcon
    },
    { 
      id: 'planning', 
      label: 'Planning', 
      color: 'yellow',
      icon: ExclamationTriangleIcon
    },
    {
      id: 'paused',
      label: 'Paused',
      color: 'orange',
      icon: PauseCircleIcon
    }
  ];

  // Fetch projects when filters change
  useEffect(() => {
    const queryParams = {
      page: pagination.currentPage,
      limit: 12,
      ...filters,
      search: searchTerm
    };
    
    // Remove empty or 'all' values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === 'all' || queryParams[key] === null) {
        delete queryParams[key];
      }
    });

    dispatch(fetchPublicProjects(queryParams));
  }, [dispatch, filters, pagination.currentPage, searchTerm]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilter({ key: 'search', value: searchTerm }));
        dispatch(setPage(1)); // Reset to first page
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters.search, dispatch]);

  const handleCategoryChange = (categoryId) => {
    dispatch(setFilter({ key: 'category', value: categoryId }));
    dispatch(setPage(1));
  };

  const handleStatusChange = (statusId) => {
    dispatch(setFilter({ key: 'status', value: statusId }));
    dispatch(setPage(1));
  };

  const handleSortChange = (sortValue) => {
    dispatch(setFilter({ key: 'sort', value: sortValue }));
    dispatch(setPage(1));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    dispatch(resetFilters());
  };

  const handleViewProject = async (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    setShowProjectModal(true);
    
    // Record view
    try {
      await dispatch(incrementProjectViews(project.slug)).unwrap();
    } catch (error) {
      console.error('Failed to record view:', error);
    }
  };

  const nextImage = () => {
    if (selectedProject && selectedProject.media?.images?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === selectedProject.media.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject && selectedProject.media?.images?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.media.images.length - 1 : prev - 1
      );
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', color: 'green', icon: CheckCircleIcon },
      ongoing: { label: 'Ongoing', color: 'blue', icon: ClockIcon },
      planning: { label: 'Planning', color: 'yellow', icon: ExclamationTriangleIcon },
      paused: { label: 'Paused', color: 'orange', icon: PauseCircleIcon },
      cancelled: { label: 'Cancelled', color: 'red', icon: StopCircleIcon }
    };
    
    const config = statusConfig[status] || statusConfig.planning;
    return (
      <Badge variant={config.color} size="sm">
        <config.icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'project-management': ChartBarIcon,
      'engineering': CogIcon,
      'interior': HomeIcon,
      'real-estate': BuildingOfficeIcon,
      'mineral': CubeIcon,
      'construction': BuildingOfficeIcon,
      'consulting': UsersIcon
    };
    return iconMap[category] || BuildingOfficeIcon;
  };

  const getCategoryGradient = (category) => {
    const gradientMap = {
      'project-management': 'from-blue-500 to-cyan-500',
      'engineering': 'from-emerald-500 to-teal-500',
      'interior': 'from-purple-500 to-indigo-500',
      'real-estate': 'from-orange-500 to-red-500',
      'mineral': 'from-amber-500 to-yellow-500',
      'construction': 'from-slate-500 to-gray-500',
      'consulting': 'from-rose-500 to-pink-500'
    };
    return gradientMap[category] || 'from-blue-500 to-cyan-500';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-12 lg:py-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-6 border border-white/20">
              <SparklesIcon className="h-3 w-3 mr-1.5" />
              Our Project Portfolio
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              <span className="block text-white mb-1">Our</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover our successful projects across engineering, construction, interior design, 
              and consulting services <span className="text-white font-semibold">throughout Ethiopia</span>
            </p>

            {/* Project Categories Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.slice(1, 6).map((category) => (
                <button
                  key={category.id}
                  className={`px-3 py-1.5 backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-200 text-xs font-medium hover:scale-105 ${
                    filters.category === category.id 
                      ? 'bg-white/30 text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 p-4 lg:p-6">
            {/* Mobile Filters Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<FunnelIcon className="h-4 w-4" />}
                className="w-full"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={filters.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={filters.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="budget-high">Highest Budget</option>
                    <option value="budget-low">Lowest Budget</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.category !== 'all' || filters.status !== 'all' || searchTerm) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                  {filters.category !== 'all' && (
                    <Badge variant="blue" size="sm">
                      Category: {categories.find(c => c.id === filters.category)?.label}
                    </Badge>
                  )}
                  {filters.status !== 'all' && (
                    <Badge variant="green" size="sm">
                      Status: {statuses.find(s => s.id === filters.status)?.label}
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge variant="gray" size="sm">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 lg:py-16 bg-white dark:bg-gray-900 relative">
        {/* Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && projects.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading projects...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <XMarkIcon className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-900 dark:text-red-100">
                    Error loading projects
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => dispatch(fetchPublicProjects({ 
                      page: pagination.currentPage,
                      ...filters 
                    }))}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && projects.length === 0 && !error && (
            <div className="text-center py-12">
              <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filters.category !== 'all' || filters.status !== 'all' 
                  ? 'No projects match your current filters. Try adjusting your search criteria.'
                  : 'No projects are currently available.'
                }
              </p>
              {(searchTerm || filters.category !== 'all' || filters.status !== 'all') && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Projects Grid */}
          {projects.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    index={index}
                    onViewProject={handleViewProject}
                    getCategoryIcon={getCategoryIcon}
                    getCategoryGradient={getCategoryGradient}
                    getStatusBadge={getStatusBadge}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {((pagination.currentPage - 1) * 12) + 1} to{' '}
                    {Math.min(pagination.currentPage * 12, pagination.total)} of{' '}
                    {pagination.total} projects
                  </p>
                  
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
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm rounded transition-colors ${
                              page === pagination.currentPage
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
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
              )}
            </>
          )}
        </div>
      </section>

      {/* Project Details Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Project Details"
        size="xl"
      >
        {selectedProject && (
          <ProjectDetailsModal
            project={selectedProject}
            currentImageIndex={currentImageIndex}
            onNextImage={nextImage}
            onPrevImage={prevImage}
            onClose={() => setShowProjectModal(false)}
            getCategoryIcon={getCategoryIcon}
            getCategoryGradient={getCategoryGradient}
            getStatusBadge={getStatusBadge}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        )}
      </Modal>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, index, onViewProject, getCategoryIcon, getCategoryGradient, getStatusBadge, formatCurrency }) => {
  const Icon = getCategoryIcon(project.category);
  const gradient = getCategoryGradient(project.category);
  
  // Get primary image or first image
  const primaryImage = project.media?.images?.find(img => img.isPrimary) || project.media?.images?.[0];
  const imageUrl = primaryImage?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80';
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}></div>
          
          {/* Category Icon */}
          <div className="absolute top-4 left-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {getStatusBadge(project.status)}
          </div>

          {/* Progress Bar for Ongoing Projects */}
          {project.status === 'ongoing' && project.progress?.percentage > 0 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${project.progress.percentage}%` }}
                ></div>
              </div>
              <div className="text-white text-xs mt-1 font-medium">
                {project.progress.percentage}% Complete
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {project.displaySettings?.isFeatured && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center">
                <StarIcon className="h-3 w-3 mr-1" />
                Featured
              </div>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {project.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {project.description}
            </p>
          </div>

          {/* Project Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {project.location?.city && project.location?.region 
                  ? `${project.location.city}, ${project.location.region}`
                  : project.location?.city || project.location?.region || 'Location not specified'
                }
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{project.timeline?.duration || 'Duration not specified'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{project.client?.name || 'Client not specified'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <BanknotesIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="font-medium">
                {formatCurrency(project.budget?.amount, project.budget?.currency)}
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.features?.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
            {project.features?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                +{project.features.length - 3} more
              </span>
            )}
          </div>

          {/* Views Counter */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <EyeIcon className="h-3 w-3 mr-1" />
              <span>{project.analytics?.views || 0} views</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Started {formatRelativeTime(project.timeline?.startDate)}
            </div>
          </div>

          {/* View Project Button */}
          <Button
            onClick={() => onViewProject(project)}
            size="sm"
            className={`w-full bg-gradient-to-r ${gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View Details
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Project Details Modal Component
const ProjectDetailsModal = ({ 
  project, 
  currentImageIndex, 
  onNextImage, 
  onPrevImage, 
  onClose,
  getCategoryIcon,
  getCategoryGradient,
  getStatusBadge,
  formatCurrency,
  formatDate
}) => {
  const Icon = getCategoryIcon(project.category);
  const gradient = getCategoryGradient(project.category);
  
  const images = project.media?.images || [];
  const currentImage = images[currentImageIndex];

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {project.title}
            </h2>
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              {getStatusBadge(project.status)}
              {project.displaySettings?.isFeatured && (
                <Badge variant="amber" size="sm">
                  <StarIcon className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {project.client?.name}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="relative mb-6">
          <div className="aspect-video rounded-xl overflow-hidden">
            <img
              src={currentImage?.url || images[0]?.url}
              alt={currentImage?.alt || `${project.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80';
              }}
            />
          </div>
          
          {images.length > 1 && (
            <>
              <button
                onClick={onPrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
              </button>
              <button
                onClick={onNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-800" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-xs rounded-md">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Image Caption */}
          {currentImage?.caption && (
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">
              {currentImage.caption}
            </p>
          )}
        </div>
      )}

      {/* Project Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Project Overview
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Key Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {project.services && project.services.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Services Provided
              </h3>
              <div className="space-y-2">
                {project.services.map((service, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {service.name}
                    </h4>
                    {service.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        {service.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress (for ongoing projects) */}
          {project.status === 'ongoing' && project.progress?.percentage > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Project Progress
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completion</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {project.progress.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${gradient} rounded-full h-3 transition-all duration-300`}
                    style={{ width: `${project.progress.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Milestones */}
              {project.progress?.milestones && project.progress.milestones.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">
                    Recent Milestones
                  </h4>
                  <div className="space-y-2">
                    {project.progress.milestones.slice(0, 3).map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700 dark:text-gray-300">{milestone.name}</span>
                        <Badge 
                          variant={milestone.status === 'completed' ? 'green' : 'blue'} 
                          size="sm"
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Project Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Project Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Client</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">
                  {project.client?.name || 'Not specified'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Location</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">
                  {project.location?.city && project.location?.region 
                    ? `${project.location.city}, ${project.location.region}`
                    : 'Not specified'
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Duration</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">
                  {project.timeline?.duration || 'Not specified'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Budget</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">
                  {formatCurrency(project.budget?.amount, project.budget?.currency)}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Started</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">
                  {formatDate(project.timeline?.startDate)}
                </span>
              </div>
              
              {project.timeline?.completedDate && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Completed</span>
                  <span className="text-gray-900 dark:text-gray-100 text-sm">
                    {formatDate(project.timeline.completedDate)}
                  </span>
                </div>
              )}
              
              {project.timeline?.expectedCompletion && project.status !== 'completed' && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Expected Completion</span>
                  <span className="text-gray-900 dark:text-gray-100 text-sm">
                    {formatDate(project.timeline.expectedCompletion)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Category</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm capitalize">
                  {project.category.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Project Team */}
          {project.team && project.team.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Project Team
              </h3>
              <div className="space-y-2">
                {project.team.slice(0, 4).map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {member.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {member.role} {member.department && `• ${member.department}`}
                      </p>
                    </div>
                  </div>
                ))}
                {project.team.length > 4 && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs text-center">
                    +{project.team.length - 4} more team members
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Testimonial */}
          {project.testimonial?.text && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Client Testimonial
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <StarIcon className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <blockquote className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed mb-3">
                      "{project.testimonial.text}"
                    </blockquote>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {project.testimonial.author?.name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">
                        {project.testimonial.author?.position}
                        {project.testimonial.author?.company && `, ${project.testimonial.author.company}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Awards */}
          {project.awards && project.awards.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Awards & Recognition
              </h3>
              <div className="space-y-2">
                {project.awards.map((award, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <TrophyIcon className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {award.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {award.organization} • {award.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sustainability */}
          {project.sustainability?.sustainabilityFeatures?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Sustainability Features
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {project.sustainability.sustainabilityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const formatRelativeTime = (date) => {
  if (!date) return 'Not available';
  const now = new Date();
  const diff = now - new Date(date);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};

export default ProjectsPage;