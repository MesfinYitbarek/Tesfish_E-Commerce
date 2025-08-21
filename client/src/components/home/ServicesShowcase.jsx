import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon, 
  PaintBrushIcon, 
  CogIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const ServicesShowcase = () => {
  const [activeService, setActiveService] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      id: 'project-management',
      title: 'Project Management',
      subtitle: 'Complete Construction Oversight',
      description: 'End-to-end project management services for construction and real estate development projects with proven track record.',
      icon: CogIcon,
      features: [
        'Construction oversight & supervision',
        'Timeline & milestone management',
        'Quality assurance & control',
        'Budget monitoring & optimization',
        'Risk assessment & mitigation',
        'Vendor coordination & management'
      ],
      startingPrice: 50000,
      rating: 4.9,
      completedProjects: 150,
      avgDuration: '6-12 months',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
      color: 'from-blue-500 to-blue-700',
      trending: true,
      badge: 'Most Popular'
    },
    {
      id: 'engineering-design',
      title: 'Engineering Design',
      subtitle: 'Professional Architectural Solutions',
      description: 'Professional engineering and architectural design services for residential and commercial projects with innovative approaches.',
      icon: BuildingOfficeIcon,
      features: [
        'Structural & architectural design',
        'MEP system integration',
        '3D modeling & visualization',
        'Building permits assistance',
        'Site analysis & planning',
        'Sustainability consulting'
      ],
      startingPrice: 75000,
      rating: 4.8,
      completedProjects: 200,
      avgDuration: '2-4 months',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop',
      color: 'from-purple-500 to-purple-700',
      trending: false,
      badge: 'Expert Level'
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
      subtitle: 'Transform Your Living Spaces',
      description: 'Transform your space with our expert interior design services tailored to your style, budget, and lifestyle preferences.',
      icon: PaintBrushIcon,
      features: [
        'Comprehensive space planning',
        'Photorealistic 3D visualization',
        'Custom furniture selection',
        'Color & material consultation',
        'Lighting design optimization',
        'Project execution management'
      ],
      startingPrice: 30000,
      rating: 4.7,
      completedProjects: 300,
      avgDuration: '1-3 months',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      color: 'from-pink-500 to-pink-700',
      trending: true,
      badge: 'Creative Excellence'
    },
    {
      id: 'consultancy',
      title: 'Real Estate Consultancy',
      subtitle: 'Strategic Investment Guidance',
      description: 'Expert advice and consultation for real estate investments, market analysis, and property valuation with data-driven insights.',
      icon: ChatBubbleLeftRightIcon,
      features: [
        'Comprehensive market analysis',
        'Investment strategy development',
        'Property valuation & appraisal',
        'Legal compliance guidance',
        'Portfolio optimization',
        'Risk assessment & management'
      ],
      startingPrice: 25000,
      rating: 4.9,
      completedProjects: 500,
      avgDuration: '2-6 weeks',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      color: 'from-green-500 to-green-700',
      trending: false,
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
            Beyond Properties
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

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white mb-8">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold mb-2">Why Choose Our Services?</h3>
            <p className="text-sm text-blue-100 max-w-xl mx-auto">
              Join hundreds of satisfied clients who trust us with their projects
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">1150+</div>
              <div className="text-xs text-blue-100">Completed Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">4.8★</div>
              <div className="text-xs text-blue-100">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">98%</div>
              <div className="text-xs text-blue-100">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">24/7</div>
              <div className="text-xs text-blue-100">Support Available</div>
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
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex space-x-1">
          <div className={`px-2 py-0.5 bg-gradient-to-r ${service.color} text-white text-xs font-bold rounded-full`}>
            {service.badge}
          </div>
          {service.trending && (
            <div className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center">
              <FireIcon className="h-2 w-2 mr-0.5" />
              Hot
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className={`h-4 w-4 text-blue-600`} />
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white">
          <div className="bg-black/40 backdrop-blur-sm rounded-md px-2 py-1">
            <div className="text-xs font-bold">{service.completedProjects}+</div>
            <div className="text-xs opacity-90">Projects</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-md px-2 py-1">
            <div className="text-xs font-bold flex items-center">
              <StarIcon className="h-2 w-2 mr-0.5 text-yellow-400" />
              {service.rating}
            </div>
            <div className="text-xs opacity-90">Rating</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-md px-2 py-1">
            <div className="text-xs font-bold">{service.avgDuration}</div>
            <div className="text-xs opacity-90">Duration</div>
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
        <div className="mb-3">
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
                +{service.features.length - 3} more features
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Starting from</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                ETB {service.startingPrice.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-3 w-3 mr-1" />
              {service.avgDuration}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link to={`/services/${service.id}`} className="block">
            <Button variant="primary" size="sm" className="w-full text-xs">
              Learn More
            </Button>
          </Link>
          <Link to={`/services/${service.id}/quote`} className="block">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Get Quote
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesShowcase;