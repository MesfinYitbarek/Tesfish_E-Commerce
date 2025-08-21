import { Link } from 'react-router-dom';
import { 
  WrenchScrewdriverIcon,
  CogIcon,
  PaintBrushIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const ServicesOverview = () => {
  const services = [
    {
      id: 'project-management',
      title: 'Project Management',
      description: 'Comprehensive project management services for construction and real estate development projects.',
      icon: CogIcon,
      features: [
        'Project planning & scheduling',
        'Budget management',
        'Quality assurance',
        'Site supervision',
        'Progress reporting'
      ],
      pricing: 'Starting from ETB 50,000',
      rating: 4.8,
      projects: 150,
      color: 'blue',
      image: '/api/placeholder/400/300'
    },
    {
      id: 'engineering-design',
      title: 'Engineering Design',
      description: 'Professional engineering design services for residential and commercial construction projects.',
      icon: WrenchScrewdriverIcon,
      features: [
        'Structural design',
        'Architectural planning',
        'MEP systems design',
        '3D modeling & visualization',
        'Construction drawings'
      ],
      pricing: 'Starting from ETB 75,000',
      rating: 4.9,
      projects: 200,
      color: 'green',
      image: '/api/placeholder/400/301'
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
      description: 'Creative interior design solutions that transform spaces into beautiful and functional environments.',
      icon: PaintBrushIcon,
      features: [
        'Space planning',
        'Furniture selection',
        'Lighting design',
        'Color consultation',
        '3D visualization'
      ],
      pricing: 'Starting from ETB 30,000',
      rating: 4.7,
      projects: 300,
      color: 'purple',
      image: '/api/placeholder/400/302'
    },
    {
      id: 'consultancy',
      title: 'Real Estate Consultancy',
      description: 'Expert real estate consulting services to help you make informed property investment decisions.',
      icon: ChatBubbleLeftRightIcon,
      features: [
        'Market analysis',
        'Investment advice',
        'Property valuation',
        'Legal consultation',
        'Due diligence'
      ],
      pricing: 'Starting from ETB 25,000',
      rating: 4.6,
      projects: 120,
      color: 'orange',
      image: '/api/placeholder/400/303'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
        bgLight: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-700',
        hover: 'hover:bg-blue-600'
      },
      green: {
        bg: 'bg-green-500',
        text: 'text-green-600 dark:text-green-400',
        bgLight: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-700',
        hover: 'hover:bg-green-600'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600 dark:text-purple-400',
        bgLight: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-700',
        hover: 'hover:bg-purple-600'
      },
      orange: {
        bg: 'bg-orange-500',
        text: 'text-orange-600 dark:text-orange-400',
        bgLight: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-700',
        hover: 'hover:bg-orange-600'
      }
    };
    return colors[color];
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Professional Services
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Partner with Ethiopia's leading professionals for all your construction, design, and real estate needs. 
            From concept to completion, we've got you covered.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service) => {
            const colors = getColorClasses(service.color);
            
            return (
              <div key={service.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Service Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Service Icon */}
                  <div className="absolute top-4 left-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 rounded-lg px-2 py-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{service.title}</h3>
                    <p className="text-white/90 text-sm">{service.projects}+ completed projects</p>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckIcon className={`h-4 w-4 ${colors.text}`} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing */}
                  <div className={`${colors.bgLight} ${colors.border} border rounded-lg p-4 mb-6`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pricing</p>
                        <p className={`font-semibold ${colors.text}`}>{service.pricing}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Timeline</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">2-8 weeks</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Link to={`/services/${service.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                    <Link to={`/services/${service.id}/quote`} className="flex-1">
                      <Button className={`w-full ${colors.bg} ${colors.hover}`}>
                        Get Quote
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple, transparent process from initial consultation to project completion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Consultation',
                description: 'Free initial consultation to understand your needs and requirements'
              },
              {
                step: '02',
                title: 'Proposal',
                description: 'Detailed proposal with timeline, pricing, and project scope'
              },
              {
                step: '03',
                title: 'Execution',
                description: 'Professional execution with regular progress updates'
              },
              {
                step: '04',
                title: 'Delivery',
                description: 'Final delivery with quality assurance and ongoing support'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Connect with our experienced professionals and bring your vision to life. 
            Get a free consultation and personalized quote for your project.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/services/consultation">
              <Button size="lg" className="w-full sm:w-auto">
                Schedule Free Consultation
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse All Services
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;