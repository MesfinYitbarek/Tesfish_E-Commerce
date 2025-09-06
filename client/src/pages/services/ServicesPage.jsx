import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  CogIcon,
  HomeIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckIcon,
  CubeIcon
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
      duration: '1-2 weeks',
      image: '/api/placeholder/600/400'
    },
    {
      id: 'mineral-services',
      title: 'Mineral Services',
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
      image: '/api/placeholder/600/400'
    }
  ];

  const handleGetStarted = (service) => {
    setSelectedService(service);
    setShowInquiryModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Professional Services
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto px-4">
              Expert solutions for your construction, design, real estate, and mineral exploration needs
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
              {services.map((service) => (
                <Button
                  key={service.id}
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white hover:text-blue-600 text-xs sm:text-sm"
                  onClick={() => document.getElementById(service.id)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {service.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Comprehensive solutions tailored to your specific needs
            </p>
          </div>

          <div className="space-y-16 sm:space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className="scroll-mt-20"
              >
                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 sm:gap-12 lg:gap-16 xl:gap-20`}>
                  {/* Image */}
                  <div className="w-full lg:flex-1">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="w-full lg:flex-1 space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <service.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {service.features.slice(0, 6).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {service.features.length > 6 && (
                      <details className="group">
                        <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-medium list-none text-sm sm:text-base">
                          <span className="group-open:hidden">Show more features</span>
                          <span className="hidden group-open:inline">Show less</span>
                        </summary>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {service.features.slice(6).map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start space-x-3">
                              <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-0">
                      <div className="space-y-1">
                        <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                          Duration: {service.duration}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleGetStarted(service)}
                        rightIcon={<ArrowRightIcon className="h-4 w-4" />}
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 px-4">
            Get in touch with our experts for a free consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowInquiryModal(true)}
              className="w-full sm:w-auto"
            >
              Request Consultation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-white hover:text-blue-600 w-full sm:w-auto"
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