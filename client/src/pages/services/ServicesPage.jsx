import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  CogIcon,
  HomeIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckIcon,
  CubeIcon,
  SparklesIcon,
  StarIcon,
  ClockIcon,
  ShieldCheckIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import ServiceInquiryModal from '../../components/Services/ServiceInquiryModal';

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const navigate = useNavigate();

  const services = [
    {
      id: 'project-management',
      title: 'Project Management',
      subtitle: 'Complete Project Oversight',
      icon: ChartBarIcon,
      shortDescription: 'Comprehensive project management from initiation to completion',
      description: 'We as Project Management Consultants are multidisciplinary company consisting of seasoned construction, design, finance and real estate professionals, including licensed architects, engineers, construction managers, financial strategists and experienced construction lawyers.',
      features: [
        'Manage your projects from project initiation to completion',
        'Defining Project Cost, Quality Time, Scope Risk and Resource',
        'Contract Administration',
        'Tender, Procurement and contract document preparation',
        'Project proposals',
        'Project feasibility study',
        'Project work planning',
        'Project budget planning',
        'Project resource (Human, Equipment planning)',
        'Project stakeholders Management service',
        'Company Auditing'
      ],
      duration: 'Varies by project scope',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      gradient: 'from-blue-500 to-cyan-500',
      popular: true
    },
    {
      id: 'engineering-design',
      title: 'Engineering Design',
      subtitle: 'Professional Design Solutions',
      icon: CogIcon,
      shortDescription: 'Professional design services for Roads, Buildings and Bridges',
      description: 'Complete engineering design solutions covering civil, architectural, and MEP systems with professional supervision and contract administration.',
      features: [
        'Engineering Design (Civil)',
        'Architectural Design',
        'MEP (Mechanical, Electrical and Plumbing & sanitary)',
        'Bill of Quantity (BoQ) and Cost estimation Preparation',
        'Tender Document Preparations',
        'Supervision Contract administration'
      ],
      duration: '2-6 months',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop',
      gradient: 'from-emerald-500 to-teal-500',
      popular: false
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
      subtitle: 'Transform Your Spaces',
      icon: HomeIcon,
      shortDescription: 'Interior design services for Residential and Commercial buildings',
      description: 'Professional interior design and build services for residential villas, apartments, commercial buildings, offices, and hotels.',
      features: [
        'Interior Design and Build service',
        'Residential Villas design',
        'Residential Apartments design',
        'Commercial Buildings design',
        'Offices interior design',
        'Hotels interior design'
      ],
      duration: '1-4 months',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
      gradient: 'from-purple-500 to-indigo-500',
      popular: false
    },
    {
      id: 'real-estate-consultancy',
      title: 'Real Estate Consultancy',
      subtitle: 'Expert Advisory Services',
      icon: BuildingOfficeIcon,
      shortDescription: 'Expert advisory services for property investments',
      description: 'We strongly Advice you Not to buy your house before consulting us. Comprehensive advisory services covering technical, legal, and investment aspects.',
      features: [
        'Technical advisory service (studying the architectural and engineering nature)',
        'Future economical livability analysis',
        'Legal advisory service',
        'Investment feasibility assessment',
        'Property valuation',
        'Market analysis'
      ],
      duration: '1-2 weeks',
      image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop',
      gradient: 'from-orange-500 to-red-500',
      popular: true
    },
    {
      id: 'mineral-services',
      title: 'Mineral Services',
      subtitle: 'Sustainable Resource Development',
      icon: CubeIcon,
      shortDescription: 'Comprehensive mineral exploration and extraction consultancy',
      description: 'Professional mineral exploration, geological surveys, and mining consultancy services to help you discover and develop mineral resources with sustainable and environmentally responsible practices.',
      features: [
        'Geological surveys and mapping',
        'Mineral exploration and prospecting',
        'Mining feasibility studies',
        'Environmental impact assessments',
        'Mining permit assistance',
        'Extraction planning and optimization',
        'Sustainable mining practices consultation',
        'Resource estimation and valuation',
        'Mining equipment consultation',
        'Safety and compliance auditing'
      ],
      duration: '3-12 months',
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop',
      gradient: 'from-amber-500 to-orange-500',
      popular: false
    }
  ];

  const stats = [
    { label: 'Projects Completed', value: '500+', icon: CheckIcon },
    { label: 'Happy Clients', value: '300+', icon: StarIcon },
    { label: 'Years Experience', value: '10+', icon: ClockIcon },
    { label: 'Expert Team', value: '50+', icon: ShieldCheckIcon }
  ];

  const handleGetStarted = (service) => {
    setSelectedService(service);
    setShowInquiryModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-12 lg:py-18 overflow-hidden">
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
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-6 border border-white/20">
              <SparklesIcon className="h-3 w-3 mr-1.5" />
              Professional Excellence
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              <span className="block text-white mb-1">Professional</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Expert solutions for your construction, design, real estate, and mineral exploration needs 
              <span className="text-white font-semibold"> across Ethiopia</span>
            </p>

            {/* Service Navigation Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {services.map((service) => (
                <button
                  key={service.id}
                  className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-lg transition-all duration-200 text-xs font-medium hover:scale-105"
                  onClick={() => document.getElementById(service.id)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {service.title}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-blue-200 font-medium text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-12 lg:py-18 relative">
        {/* Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium mb-4 border border-blue-100 dark:border-blue-800/30">
              <StarIcon className="h-3 w-3 mr-1.5" />
              Our Expertise
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Comprehensive Solutions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Tailored professional services designed to meet your specific needs with 
              <span className="text-blue-600 dark:text-blue-400 font-semibold"> excellence and precision</span>
            </p>
          </div>

          {/* Services Grid */}
          <div className="space-y-12 lg:space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className="scroll-mt-20"
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                <ServiceCard 
                  service={service} 
                  index={index} 
                  isActive={activeService === service.id}
                  onGetStarted={handleGetStarted}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 lg:py-18 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get in touch with our experts for a free consultation and discover how we can 
            bring your vision to life with professional excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button
              size="md"
              onClick={() => setShowInquiryModal(true)}
              className="bg-white text-slate-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3 text-sm"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Request Consultation
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-white text-white hover:bg-white hover:text-slate-900 px-6 py-3 text-sm"
              onClick={() => navigate('/contact')}
            >
              <PhoneIcon className="h-4 w-4 mr-2" />
              Contact Us
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3">
                <PhoneIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-xl font-bold text-white mb-1">24/7 Support</div>
              <div className="text-blue-200 text-sm">Always here to help</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3">
                <CheckIcon className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white mb-1">Quality Assured</div>
              <div className="text-blue-200 text-sm">Professional excellence</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3">
                <StarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-xl font-bold text-white mb-1">Expert Team</div>
              <div className="text-blue-200 text-sm">Experienced professionals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Inquiry Modal */}
      <ServiceInquiryModal
        isOpen={showInquiryModal}
        onClose={() => {
          setShowInquiryModal(false);
          setSelectedService(null);
        }}
        selectedService={selectedService}
      />
    </div>
  );
};

// Enhanced Service Card Component
const ServiceCard = ({ service, index, isActive, onGetStarted }) => {
  const Icon = service.icon;
  const isEven = index % 2 === 0;

  return (
    <div 
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Image Section */}
      <div className="w-full lg:flex-1">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-xl blur-xl group-hover:opacity-30 transition-opacity duration-300" 
               style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div>
          <div className="relative overflow-hidden rounded-xl shadow-2xl group-hover:shadow-3xl transition-shadow duration-500">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-48 sm:h-64 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-60 group-hover:opacity-50 transition-opacity duration-300`}></div>
            
            {/* Icon Overlay */}
            <div className="absolute top-6 left-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Popular Badge */}
            {service.popular && (
              <div className="absolute top-6 right-6">
                <div className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold shadow-lg">
                  Popular
                </div>
              </div>
            )}

            {/* Duration Badge */}
            <div className="absolute bottom-6 left-6">
              <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-slate-700 text-xs font-semibold">
                <ClockIcon className="h-3 w-3 inline mr-1.5" />
                {service.duration}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full lg:flex-1 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-110 transform transition-transform`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                {service.title}
              </h3>
              <p className="text-base text-blue-600 dark:text-blue-400 font-semibold">
                {service.subtitle}
              </p>
            </div>
          </div>
          
          <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Features */}
        <div className="bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-slate-200/60 dark:border-slate-700/60">
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <CheckIcon className="h-4 w-4 text-emerald-500 mr-2" />
            What's Included
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {service.features.slice(0, 6).map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-start space-x-2 group">
                <CheckIcon className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-sm">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {service.features.length > 6 && (
            <details className="group mt-4">
              <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-semibold list-none hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm">
                <span className="group-open:hidden">Show {service.features.length - 6} more features</span>
                <span className="hidden group-open:inline">Show less</span>
              </summary>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                {service.features.slice(6).map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-2 group">
                    <CheckIcon className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="mb-3 sm:mb-0">
            <div className="text-slate-500 dark:text-slate-400 text-xs">
              Ready to get started?
            </div>
            <div className="text-slate-900 dark:text-white font-semibold text-sm">
              Contact our expert team today
            </div>
          </div>
          <Button
            onClick={() => onGetStarted(service)}
            size="md"
            className={`bg-gradient-to-r ${service.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-2 text-sm`}
          >
            Get Started
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;