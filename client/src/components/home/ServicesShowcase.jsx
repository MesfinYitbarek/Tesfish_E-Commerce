// components/home/ServicesShowcase.jsx - Compact Design
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  HomeIcon, 
  CogIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const ServicesShowcase = () => {
  const services = [
    {
      id: 'project-management',
      title: 'Project Management',
      subtitle: 'Complete Project Oversight',
      description: 'Comprehensive project management from initiation to completion with expert oversight and quality assurance.',
      icon: CogIcon,
      features: [
        'Complete project oversight',
        'Budget & timeline management', 
        'Quality assurance',
        'Risk management',
        'Contract administration',
        'Stakeholder management'
      ],
      gradient: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
    },
    {
      id: 'engineering-design',
      title: 'Engineering Design',
      subtitle: 'Professional Design Solutions',
      description: 'Professional design services for roads, buildings and bridges with complete engineering solutions.',
      icon: BuildingOfficeIcon,
      features: [
        'Civil engineering design',
        'Architectural planning',
        'MEP systems design',
        'Cost estimation',
        'Tender documentation',
        'Supervision services'
      ],
      gradient: 'from-emerald-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop'
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
      subtitle: 'Transform Your Spaces',
      description: 'Transform your spaces with professional interior design for residential and commercial buildings.',
      icon: HomeIcon,
      features: [
        'Residential design',
        'Commercial interiors',
        'Space planning',
        'Design & build service',
        'Furniture selection',
        '3D visualization'
      ],
      gradient: 'from-purple-500 to-indigo-500',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'
    },
    {
      id: 'real-estate-consultancy',
      title: 'Real Estate Consultancy',
      subtitle: 'Expert Advisory Services',
      description: 'Expert advisory services covering technical, legal, and investment aspects of real estate.',
      icon: ChartBarIcon,
      features: [
        'Investment analysis',
        'Legal advisory',
        'Property valuation',
        'Market research',
        'Technical assessment',
        'Feasibility studies'
      ],
      gradient: 'from-orange-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium mb-4 border border-blue-100 dark:border-blue-800/30">
            <StarIcon className="h-3 w-3 mr-1.5" />
            Professional Services
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Expert Solutions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We offer comprehensive professional services to support your real estate 
            and construction needs with 
            <span className="text-blue-600 dark:text-blue-400 font-semibold"> expert guidance</span>.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Why Choose Our Services */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 lg:p-8 text-white mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="relative text-center mb-6">
            <h3 className="text-2xl font-bold mb-3">Why Choose Our Services?</h3>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Professional expertise and comprehensive solutions for all your construction and real estate needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                Expert
              </div>
              <div className="text-blue-100 text-sm">Professional Team</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                Quality
              </div>
              <div className="text-blue-100 text-sm">Assured Service</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                Full
              </div>
              <div className="text-blue-100 text-sm">Support Coverage</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                Proven
              </div>
              <div className="text-blue-100 text-sm">Track Record</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/services">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm px-6 py-2">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Explore all services
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Enhanced Service Card
const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;

  return (
    <div 
      className="group"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
        {/* Image Header */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-80`}></div>
          
          {/* Icon */}
          <div className="absolute top-4 left-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-bold text-white mb-1">
              {service.title}
            </h3>
            <p className="text-white/90 font-medium text-sm">
              {service.subtitle}
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 lg:p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            {service.description}
          </p>
          
          {/* Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
              What's Included:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {service.features.slice(0, 3).map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
              {service.features.length > 3 && (
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  +{service.features.length - 3} more services included
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesShowcase;