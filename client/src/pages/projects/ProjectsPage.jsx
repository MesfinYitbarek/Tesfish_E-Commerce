import { useState, useEffect } from 'react';
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
  TrophyIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const categories = [
    { id: 'all', label: 'All Projects', icon: BuildingOfficeIcon, color: 'blue' },
    { id: 'project-management', label: 'Project Management', icon: ChartBarIcon, color: 'emerald' },
    { id: 'engineering', label: 'Engineering Design', icon: CogIcon, color: 'purple' },
    { id: 'interior', label: 'Interior Design', icon: HomeIcon, color: 'pink' },
    { id: 'real-estate', label: 'Real Estate', icon: BuildingOfficeIcon, color: 'orange' },
    { id: 'mineral', label: 'Mineral Services', icon: CubeIcon, color: 'amber' }
  ];

  const statuses = [
    { id: 'all', label: 'All Status', color: 'gray' },
    { id: 'completed', label: 'Completed', color: 'green' },
    { id: 'ongoing', label: 'Ongoing', color: 'blue' },
    { id: 'planning', label: 'Planning', color: 'yellow' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Addis Ababa Commercial Complex',
      category: 'project-management',
      status: 'completed',
      description: 'Complete project management for a 15-story commercial complex in the heart of Addis Ababa.',
      longDescription: 'This landmark project involved comprehensive project management services for a state-of-the-art commercial complex. Our team managed every aspect from initial planning to final delivery, ensuring quality, timeline adherence, and budget optimization.',
      client: 'Ethiopian Investment Holdings',
      location: 'Addis Ababa, Ethiopia',
      duration: '24 months',
      budget: 'ETB 250 Million',
      completedDate: '2024-01-15',
      startDate: '2022-01-15',
      images: [
        'https://pfst.cf2.poecdn.net/base/image/a7ebd329058e60fd4be32d41d5d4e682c2d7024ac312200dc7bd68880ef70d2d?w=600&h=400',
        'https://pfst.cf2.poecdn.net/base/image/ac20eb9645b34914dcd9f201c3a2791d7c99a05481240775a24a9e2111e20b92?w=600&h=400',
        'https://pfst.cf2.poecdn.net/base/image/c320d548c8b2c1aa59e22626f1db5c3435ba3843fe2360185212e2dbcb744aa3?w=600&h=400'
      ],
      features: ['Project Planning', 'Budget Management', 'Quality Control', 'Stakeholder Management'],
      gradient: 'from-blue-500 to-cyan-500',
      testimonial: {
        text: 'TesGold delivered exceptional project management services. The project was completed on time and within budget.',
        author: 'Alemayehu Tadesse',
        position: 'Project Director, Ethiopian Investment Holdings'
      }
    },
    {
      id: 2,
      title: 'Bahir Dar Bridge Engineering',
      category: 'engineering',
      status: 'completed',
      description: 'Structural engineering design for a major bridge connecting Bahir Dar city districts.',
      longDescription: 'A complex engineering project involving the design of a 800-meter bridge with advanced structural engineering solutions. Our team provided complete civil and structural engineering services.',
      client: 'Bahir Dar City Administration',
      location: 'Bahir Dar, Ethiopia',
      duration: '18 months',
      budget: 'ETB 180 Million',
      completedDate: '2023-11-20',
      startDate: '2022-05-20',
      images: [
        'https://pfst.cf2.poecdn.net/base/image/763e0062cb793025f0fefe65ca4c668155d726aec37b25070895ecc3b6bf0057?w=600&h=400',
        'https://pfst.cf2.poecdn.net/base/image/fea195a2949fde522245bbd28148c6b90167d3963b24140a7e073a3b43e67196?w=600&h=400'
      ],
      features: ['Structural Design', 'Load Analysis', 'Environmental Assessment', 'Safety Engineering'],
      gradient: 'from-emerald-500 to-teal-500',
      testimonial: {
        text: 'Outstanding engineering expertise. The bridge design exceeded our expectations and community needs.',
        author: 'Dr. Mulugeta Alemu',
        position: 'Chief Engineer, Bahir Dar City'
      }
    },
    {
      id: 3,
      title: 'Luxury Hotel Interior Design',
      category: 'interior',
      status: 'completed',
      description: 'Complete interior design and build for a 5-star luxury hotel in Addis Ababa.',
      longDescription: 'An elegant interior design project for a luxury hotel featuring 120 rooms, restaurants, conference facilities, and spa. Our design team created a modern Ethiopian aesthetic with international standards.',
      client: 'Skylight Hotels Group',
      location: 'Bole, Addis Ababa',
      duration: '12 months',
      budget: 'ETB 85 Million',
      completedDate: '2024-03-10',
      startDate: '2023-03-10',
      images: [
        'https://pfst.cf2.poecdn.net/base/image/a7ebd329058e60fd4be32d41d5d4e682c2d7024ac312200dc7bd68880ef70d2d?w=600&h=400',
        'https://pfst.cf2.poecdn.net/base/image/c320d548c8b2c1aa59e22626f1db5c3435ba3843fe2360185212e2dbcb744aa3?w=600&h=400'
      ],
      features: ['Space Planning', 'Custom Furniture', 'Lighting Design', 'Art Curation'],
      gradient: 'from-purple-500 to-indigo-500',
      testimonial: {
        text: 'The interior design transformed our vision into reality. Guest satisfaction has increased significantly.',
        author: 'Sarah Johnson',
        position: 'General Manager, Skylight Hotels'
      }
    },
    {
      id: 4,
      title: 'Residential Estate Development',
      category: 'real-estate',
      status: 'ongoing',
      description: 'Comprehensive real estate development project for 200 residential units.',
      longDescription: 'A large-scale residential development project featuring modern townhouses and apartments. Our team provides complete real estate consultancy and development management services.',
      client: 'Green Valley Developers',
      location: 'Lebu, Addis Ababa',
      duration: '30 months',
      budget: 'ETB 400 Million',
      startDate: '2023-08-01',
      expectedCompletion: '2026-02-01',
      images: [
        'https://pfst.cf2.poecdn.net/base/image/ac20eb9645b34914dcd9f201c3a2791d7c99a05481240775a24a9e2111e20b92?w=600&h=400',
        'https://pfst.cf2.poecdn.net/base/image/fea195a2949fde522245bbd28148c6b90167d3963b24140a7e073a3b43e67196?w=600&h=400'
      ],
      features: ['Market Analysis', 'Development Planning', 'Investment Consultation', 'Sales Strategy'],
      gradient: 'from-orange-500 to-red-500',
      progress: 65
    },
    {
      id: 5,
      title: 'Gold Mine Development',
      category: 'mineral',
      status: 'ongoing',
      description: 'Comprehensive mineral exploration and mine development consultation.',
      longDescription: 'A complex mineral development project involving geological surveys, environmental assessments, and sustainable mining consultation for a gold mining operation.',
      client: 'Ethiopian Mineral Development Corp',
      location: 'Oromia Region, Ethiopia',
      duration: '36 months',
      budget: 'ETB 320 Million',
      startDate: '2023-01-15',
      expectedCompletion: '2026-01-15',
      images: [
        'https://pfst.cf2.poecdn.net/base/image/763e0062cb793025f0fefe65ca4c668155d726aec37b25070895ecc3b6bf0057?w=600&h=400'
      ],
      features: ['Geological Survey', 'Environmental Assessment', 'Mining Planning', 'Sustainability Consulting'],
      gradient: 'from-amber-500 to-yellow-500',
      progress: 45
    },
    {
      id: 6,
      title: 'Modern Office Complex',
      category: 'engineering',
      status: 'planning',
      description: 'Architectural and engineering design for a sustainable office complex.',
      longDescription: 'An innovative office complex design featuring sustainable architecture, energy-efficient systems, and modern workplace solutions. Currently in the detailed planning phase.',
      client: 'Tech Park Ethiopia',
      location: 'CMC, Addis Ababa',
      duration: '20 months',
      budget: 'ETB 150 Million',
      startDate: '2024-06-01',
      expectedCompletion: '2026-02-01',
      images: [
        'https://pfst.cf2.poecdn.net/base/image/c320d548c8b2c1aa59e22626f1db5c3435ba3843fe2360185212e2dbcb744aa3?w=600&h=400'
      ],
      features: ['Sustainable Design', 'MEP Systems', 'Smart Building Integration', 'Energy Efficiency'],
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  const stats = [
    { label: 'Completed Projects', value: '150+', icon: CheckCircleIcon, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Ongoing Projects', value: '25+', icon: ClockIcon, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Happy Clients', value: '200+', icon: UsersIcon, gradient: 'from-purple-500 to-indigo-500' },
    { label: 'Total Investment', value: 'ETB 2B+', icon: TrophyIcon, gradient: 'from-amber-500 to-orange-500' }
  ];

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [selectedCategory, selectedStatus, searchTerm]);

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    setShowProjectModal(true);
  };

  const nextImage = () => {
    if (selectedProject && selectedProject.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === selectedProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject && selectedProject.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', color: 'green' },
      ongoing: { label: 'Ongoing', color: 'blue' },
      planning: { label: 'Planning', color: 'yellow' }
    };
    const config = statusConfig[status] || statusConfig.completed;
    return <Badge variant={config.color} size="sm">{config.label}</Badge>;
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
              {categories.slice(1).map((category) => (
                <button
                  key={category.id}
                  className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-lg transition-all duration-200 text-xs font-medium hover:scale-105"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-white dark:bg-gray-800 transform -translate-y-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchTerm) && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <Badge variant="blue" size="sm">
                    Category: {categories.find(c => c.id === selectedCategory)?.label}
                  </Badge>
                )}
                {selectedStatus !== 'all' && (
                  <Badge variant="green" size="sm">
                    Status: {statuses.find(s => s.id === selectedStatus)?.label}
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="gray" size="sm">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                    setSearchTerm('');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 lg:py-16 bg-white dark:bg-gray-900 relative">
        {/* Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No projects match your current filters. Try adjusting your search criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onViewProject={handleViewProject}
                />
              ))}
            </div>
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
          />
        )}
      </Modal>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, index, onViewProject }) => {
  const categoryConfig = {
    'project-management': { icon: ChartBarIcon, gradient: 'from-blue-500 to-cyan-500' },
    'engineering': { icon: CogIcon, gradient: 'from-emerald-500 to-teal-500' },
    'interior': { icon: HomeIcon, gradient: 'from-purple-500 to-indigo-500' },
    'real-estate': { icon: BuildingOfficeIcon, gradient: 'from-orange-500 to-red-500' },
    'mineral': { icon: CubeIcon, gradient: 'from-amber-500 to-yellow-500' }
  };

  const config = categoryConfig[project.category] || categoryConfig['project-management'];
  const Icon = config.icon;

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', color: 'green' },
      ongoing: { label: 'Ongoing', color: 'blue' },
      planning: { label: 'Planning', color: 'yellow' }
    };
    const statusConf = statusConfig[status] || statusConfig.completed;
    return <Badge variant={statusConf.color} size="sm">{statusConf.label}</Badge>;
  };

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
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.src = '/api/placeholder/400/300';
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-tr ${config.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}></div>
          
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
          {project.status === 'ongoing' && project.progress && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="text-white text-xs mt-1 font-medium">
                {project.progress}% Complete
              </div>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors">
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
              <span className="truncate">{project.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{project.duration}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{project.client}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
            {project.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                +{project.features.length - 3} more
              </span>
            )}
          </div>

          {/* View Project Button */}
          <Button
            onClick={() => onViewProject(project)}
            size="sm"
            className={`w-full bg-gradient-to-r ${config.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
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
const ProjectDetailsModal = ({ project, currentImageIndex, onNextImage, onPrevImage, onClose }) => {
  const categoryConfig = {
    'project-management': { icon: ChartBarIcon, gradient: 'from-blue-500 to-cyan-500' },
    'engineering': { icon: CogIcon, gradient: 'from-emerald-500 to-teal-500' },
    'interior': { icon: HomeIcon, gradient: 'from-purple-500 to-indigo-500' },
    'real-estate': { icon: BuildingOfficeIcon, gradient: 'from-orange-500 to-red-500' },
    'mineral': { icon: CubeIcon, gradient: 'from-amber-500 to-yellow-500' }
  };

  const config = categoryConfig[project.category] || categoryConfig['project-management'];
  const Icon = config.icon;

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', color: 'green' },
      ongoing: { label: 'Ongoing', color: 'blue' },
      planning: { label: 'Planning', color: 'yellow' }
    };
    const statusConf = statusConfig[status] || statusConfig.completed;
    return <Badge variant={statusConf.color} size="sm">{statusConf.label}</Badge>;
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${config.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {project.title}
            </h2>
            <div className="flex items-center space-x-3">
              {getStatusBadge(project.status)}
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {project.client}
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
      <div className="relative mb-6">
        <div className="aspect-video rounded-xl overflow-hidden">
          <img
            src={project.images[currentImageIndex]}
            alt={`${project.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/api/placeholder/800/450';
            }}
          />
        </div>
        
        {project.images.length > 1 && (
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
              {project.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

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
              {project.longDescription}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Key Features
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {project.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress (for ongoing projects) */}
          {project.status === 'ongoing' && project.progress && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Project Progress
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completion</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${config.gradient} rounded-full h-2 transition-all duration-300`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
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
                <span className="text-gray-600 dark:text-gray-400 font-medium">Client</span>
                <span className="text-gray-900 dark:text-gray-100">{project.client}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Location</span>
                <span className="text-gray-900 dark:text-gray-100">{project.location}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Duration</span>
                <span className="text-gray-900 dark:text-gray-100">{project.duration}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Budget</span>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">{project.budget}</span>
              </div>
              {project.completedDate && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Completed</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Date(project.completedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {project.expectedCompletion && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Expected Completion</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Date(project.expectedCompletion).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Testimonial */}
          {project.testimonial && (
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
                        {project.testimonial.author}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">
                        {project.testimonial.position}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;