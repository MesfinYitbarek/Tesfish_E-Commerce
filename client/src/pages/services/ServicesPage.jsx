import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  CogIcon,
  HomeIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import ServiceInquiryModal from '../../components/Services/ServiceInquiryModal';

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const navigate = useNavigate();

  const services = [
    {
      id: 'project-management',
      title: 'Project Management',
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
      startingPrice: 'Contact for Quote',
      duration: 'Varies by project scope',
      image: '/api/placeholder/600/400'
    },
    {
      id: 'engineering-design',
      title: 'Engineering Design',
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
      startingPrice: 'Starting from 50,000 ETB',
      duration: '2-6 months',
      image: '/api/placeholder/600/400'
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
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
      startingPrice: 'Starting from 30,000 ETB',
      duration: '1-4 months',
      image: '/api/placeholder/600/400'
    },
    {
      id: 'real-estate-consultancy',
      title: 'Real Estate Consultancy',
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
      startingPrice: 'Starting from 5,000 ETB',
      duration: '1-2 weeks',
      image: '/api/placeholder/600/400'
    }
  ];

  const handleGetStarted = (service) => {
    setSelectedService(service);
    setShowInquiryModal(true);
  };

  const stats = [
    { label: 'Projects Completed', value: '500+', icon: CheckIcon },
    { label: 'Happy Clients', value: '200+', icon: UserGroupIcon },
    { label: 'Years Experience', value: '10+', icon: ClockIcon },
    { label: 'Expert Rating', value: '4.9', icon: StarIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Expert solutions for your construction, design, and real estate needs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {services.map((service) => (
                <Button
                  key={service.id}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-primary-600"
                  onClick={() => document.getElementById(service.id).scrollIntoView({ behavior: 'smooth' })}
                >
                  {service.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive solutions tailored to your specific needs
            </p>
          </div>

          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
              >
                {/* Image */}
                <div className="flex-1">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-96 object-cover rounded-2xl shadow-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center">
                      <service.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-3">
                    {service.features.slice(0, 6).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {service.features.length > 6 && (
                    <details className="group">
                      <summary className="cursor-pointer text-primary-600 dark:text-primary-400 font-medium list-none">
                        <span className="group-open:hidden">Show more features</span>
                        <span className="hidden group-open:inline">Show less</span>
                      </summary>
                      <div className="mt-4 grid md:grid-cols-2 gap-3">
                        {service.features.slice(6).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start space-x-3">
                            <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  <div className="flex flex-wrap items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {service.startingPrice}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Duration: {service.duration}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleGetStarted(service)}
                      rightIcon={<ArrowRightIcon className="h-4 w-4" />}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Get in touch with our experts for a free consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowInquiryModal(true)}
            >
              Request Consultation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-white hover:text-primary-600"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
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

export default ServicesPage;