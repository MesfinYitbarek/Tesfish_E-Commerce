import { Link } from 'react-router-dom';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  HeartIcon,
  StarIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About CitiLights', href: '/about', description: 'Our story' },
        { name: 'Our Services', href: '/services', description: 'What we offer' },
        { name: 'Contact Us', href: '/contact', description: 'Get in touch' },
        { name: 'Careers', href: '/careers', description: 'Join our team' },
      ],
    },
    {
      title: 'Properties',
      links: [
        { name: 'Buy Properties', href: '/products?category=real-estate&type=sale', description: 'Find your home' },
        { name: 'Rent Properties', href: '/products?category=real-estate&type=rent', description: 'Rental options' },
        { name: 'Commercial Spaces', href: '/products?propertyType=commercial', description: 'Business locations' },
        { name: 'Luxury Properties', href: '/products?category=luxury', description: 'Premium real estate' },
      ],
    },
    {
      title: 'Services',
      links: [
        { name: 'Project Management', href: '/services/project-management', description: 'Construction oversight' },
        { name: 'Interior Design', href: '/services/interior-design', description: 'Transform spaces' },
        { name: 'Engineering Design', href: '/services/engineering', description: 'Architectural solutions' },
        { name: 'Consultancy', href: '/services/consultancy', description: 'Investment advice' },
      ],
    },
  ];

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/citilights',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/citilights',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zm6.624 18.021c-.584 1.102-1.395 1.913-2.497 2.497C14.912 21.013 13.501 21.3 12 21.3s-2.912-.287-4.144-.782c-1.102-.584-1.913-1.395-2.497-2.497C4.864 16.789 4.577 15.378 4.577 13.877c0-1.501.287-2.912.782-4.144.584-1.102 1.395-1.913 2.497-2.497C9.088 6.741 10.499 6.454 12 6.454s2.912.287 4.144.782c1.102.584 1.913 1.395 2.497 2.497.495 1.232.782 2.643.782 4.144 0 1.501-.287 2.912-.782 4.144z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/citilights',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/citilights',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      )
    }
  ];



  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4 group">
                <div className="relative">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    CitiLights
                  </span>
                  <div className="text-xs text-blue-400 font-medium">
                    Real Estate Platform
                  </div>
                </div>
              </Link>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Your trusted partner for real estate, construction, and professional services in Ethiopia. 
                Connecting dreams with reality since 2020.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="h-3 w-3 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Bole, Addis Ababa, Ethiopia</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <PhoneIcon className="h-3 w-3 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">+251 911 123 456</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <EnvelopeIcon className="h-3 w-3 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">hello@citilights.com</div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
                <div className="flex space-x-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title} className="lg:col-span-1">
                <h3 className="text-sm font-bold mb-4 text-white relative">
                  {section.title}
                  <div className="absolute bottom-0 left-0 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mt-1"></div>
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="group block py-1 text-gray-400 hover:text-white transition-all duration-200"
                      >
                        <div className="text-sm font-medium group-hover:text-blue-400 transition-colors">
                          {link.name}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                          {link.description}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-gray-400 text-xs">
                © {currentYear} CitiLights. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <BuildingOfficeIcon className="h-3 w-3" />
                <span>Licensed Real Estate Platform</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-3 text-xs">
              {legalLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                  {index < legalLinks.length - 1 && (
                    <span className="ml-3 text-gray-600">•</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;