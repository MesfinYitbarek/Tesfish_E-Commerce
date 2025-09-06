import { Link } from 'react-router-dom';
import { useState} from 'react';
import { 
  BuildingOfficeIcon, 
  HomeIcon, 
  CogIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const ServicesShowcase = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      id: 'project-management',
      title: 'Project Management',
      subtitle: 'Complete Project Oversight',
      description: 'Comprehensive project management from initiation to completion. We are multidisciplinary company consisting of seasoned construction, design, finance and real estate professionals.',
      icon: CogIcon,
      features: [
        'Manage projects from initiation to completion',
        'Defining Project Cost, Quality Time, Scope Risk and Resource',
        'Contract Administration',
        'Tender, Procurement and contract document preparation',
        'Project proposals and feasibility study',
        'Project work and budget planning',
        'Project resource planning (Human, Equipment)',
        'Project stakeholders Management service',
        'Company Auditing'
      ],
      image: 'https://pfst.cf2.poecdn.net/base/image/1bb7fd6d7e0e6473ab8834058b1c6904cfd20565b89779c7cbf20418684e4f89?w=400&h=300',
      color: 'from-blue-500 to-blue-700',
      badge: 'Most Popular'
    },
    {
      id: 'engineering-design',
      title: 'Engineering Design',
      subtitle: 'Professional Design Solutions',
      description: 'Professional design services for Roads, Buildings and Bridges with complete engineering design solutions covering civil, architectural, and MEP systems.',
      icon: BuildingOfficeIcon,
      features: [
        'Engineering Design (Civil)',
        'Architectural Design',
        'MEP (Mechanical, Electrical and Plumbing & sanitary)',
        'Bill of Quantity (BoQ) and Cost estimation Preparation',
        'Tender Document Preparations',
        'Supervision Contract administration'
      ],
      image: 'https://pfst.cf2.poecdn.net/base/image/9d9c71dec12723ff6b004d13a2d69d305620727d248be7b4c82a1d30974c4425?w=400&h=300',
      color: 'from-purple-500 to-purple-700',
      badge: 'Expert Level'
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
      subtitle: 'Transform Your Spaces',
      description: 'Interior design services for Residential and Commercial buildings. Professional interior design and build services for villas, apartments, offices, and hotels.',
      icon: HomeIcon,
      features: [
        'Interior Design and Build service',
        'Residential Villas design',
        'Residential Apartments design',
        'Commercial Buildings design',
        'Offices interior design',
        'Hotels interior design'
      ],
      image: 'https://pfst.cf2.poecdn.net/base/image/5bab658522015ee3abf88c85f1755af8038236b71e3c9cc074de2d8a41803170?w=400&h=300',
      color: 'from-pink-500 to-pink-700',
      badge: 'Creative Excellence'
    },
    {
      id: 'real-estate-consultancy',
      title: 'Real Estate Consultancy',
      subtitle: 'Expert Advisory Services',
      description: 'We strongly Advice you Not to buy your house before consulting us. Comprehensive advisory services covering technical, legal, and investment aspects.',
      icon: ChartBarIcon,
      features: [
        'Technical advisory service (studying architectural and engineering nature)',
        'Future economical livability analysis',
        'Legal advisory service',
        'Investment feasibility assessment',
        'Property valuation',
        'Market analysis'
      ],
      image: 'https://pfst.cf2.poecdn.net/base/image/43875ca6e5f1a019f28ea1a431fcc98a0bf59f6ac2348bc78af804be97cf7b77?w=400&h=300',
      color: 'from-green-500 to-green-700',
      badge: 'Trusted Advisors'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-5 w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-5 w-48 h-48 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium mb-3">
            <SparklesIcon className="h-3 w-3 mr-1" />
            Professional Services
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Expert Solutions
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We offer comprehensive professional services to support your real estate 
            and construction needs with expert guidance every step of the way.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index}
              isActive={activeService === service.id}
              onHover={() => setActiveService(service.id)}
              onLeave={() => setActiveService(null)}
            />
          ))}
        </div>

        {/* Why Choose Our Services */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white mb-8">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold mb-2">Why Choose Our Services?</h3>
            <p className="text-sm text-blue-100 max-w-xl mx-auto">
              Professional expertise and comprehensive solutions for all your construction and real estate needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">Expert</div>
              <div className="text-xs text-blue-100">Team</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">Quality</div>
              <div className="text-xs text-blue-100">Service</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">Full</div>
              <div className="text-xs text-blue-100">Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">Proven</div>
              <div className="text-xs text-blue-100">Results</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link to="/services">
            <Button size="md" className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Explore All Services
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Enhanced Service Card Component
const ServiceCard = ({ service, index, isActive, onHover, onLeave }) => {
  const Icon = service.icon;

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 ${
        isActive ? 'scale-102 shadow-xl' : 'hover:shadow-xl'
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Image Section */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Badge */}
        <div className="absolute top-2 left-2">
          <div className={`px-2 py-0.5 bg-gradient-to-r ${service.color} text-white text-xs font-bold rounded-full`}>
            {service.badge}
          </div>
        </div>

        {/* Icon */}
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className={`h-4 w-4 text-blue-600`} />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {service.title}
          </h3>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
            {service.subtitle}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Features */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">What's Included:</h4>
          <div className="grid grid-cols-1 gap-1">
            {service.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                {feature}
              </div>
            ))}
            {service.features.length > 3 && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                +{service.features.length - 3} more services
              </div>
            )}
          </div>
        </div>
        {/* Action Buttons */}      
          {/* <Link to={'/services'} className="block">
            <Button variant="primary" size="sm" className="w-full text-xs">
              Learn More
            </Button>
          </Link> */}
      </div>
    </div>
  );
};

export default ServicesShowcase;