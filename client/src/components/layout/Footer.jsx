import { Link } from 'react-router-dom';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  ArrowRightIcon,
  HeartIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Marketplace',
      links: [
        { name: 'Browse Properties', href: '/products?productType=homes', description: 'Find your perfect home' },
        { name: 'Commercial Spaces', href: '/products?productType=commercials', description: 'Business locations' },
        { name: 'Land & Plots', href: '/products?productType=plots', description: 'Investment opportunities' },
        { name: 'Other Products', href: '/products?productType=others', description: 'Vehicles & electronics' },
      ],
    },
    {
      title: 'Services',
      links: [
        { name: 'Project Management', href: '/services', description: 'Construction oversight' },
        { name: 'Interior Design', href: '/services', description: 'Transform spaces' },
        { name: 'Engineering Design', href: '/services', description: 'Architectural solutions' },
        { name: 'Real Estate Consultancy', href: '/services', description: 'Investment advice' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About TesGold', href: '/about', description: 'Our story & mission' },
        { name: 'Contact Us', href: '/contact', description: 'Get in touch' },
        { name: 'Careers', href: '/careers', description: 'Join our team' },
        { name: 'Blog', href: '/blog', description: 'News & insights' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help', description: 'Get assistance' },
        { name: 'Safety Guidelines', href: '/safety', description: 'Stay protected' },
        { name: 'Terms of Service', href: '/terms', description: 'Legal terms' },
        { name: 'Privacy Policy', href: '/privacy', description: 'Your privacy' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/tesgold',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/tesgold',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zm6.624 18.021c-.584 1.102-1.395 1.913-2.497 2.497C14.912 21.013 13.501 21.3 12 21.3s-2.912-.287-4.144-.782c-1.102-.584-1.913-1.395-2.497-2.497C4.864 16.789 4.577 15.378 4.577 13.877c0-1.501.287-2.912.782-4.144.584-1.102 1.395-1.913 2.497-2.497C9.088 6.741 10.499 6.454 12 6.454s2.912.287 4.144.782c1.102.584 1.913 1.395 2.497 2.497.495 1.232.782 2.643.782 4.144 0 1.501-.287 2.912-.782 4.144z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/tesgold',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/tesgold',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      )
    }
  ];

  const stats = [
    { label: 'Properties Listed', value: '15K+' },
    { label: 'Happy Customers', value: '50K+' },
    { label: 'Cities Covered', value: '25+' },
    { label: 'Years of Service', value: '5+' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        {/* <div className="py-10 border-b border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-4 border border-white/20">
              <SparklesIcon className="h-3 w-3 mr-1.5" />
              Stay Updated
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-3">
              Get the latest property updates
            </h3>
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              Subscribe to our newsletter and never miss out on new listings, 
              market insights, and exclusive offers.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
              >
                <span className="hidden sm:inline">Subscribe</span>
                <ArrowRightIcon className="h-4 w-4 sm:hidden" />
              </button>
            </form>
          </div>
        </div> */}

        {/* Main Footer Content */}
        <div className="py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-4">
              <Link to="/" className="flex items-center space-x-2 mb-4 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <span className="text-white font-bold">T</span>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    TesGold
                  </span>
                  <div className="text-xs text-blue-400 font-medium -mt-0.5">
                    Marketplace
                  </div>
                </div>
              </Link>
              
              <p className="text-base text-blue-100 leading-relaxed mb-6">
                Ethiopia's premier marketplace for real estate, vehicles, electronics, and professional services. 
                <span className="text-white font-semibold"> Connecting dreams with reality.</span>
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">Bole, Addis Ababa</div>
                    <div className="text-blue-200 text-xs">Ethiopia</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <PhoneIcon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">+251 911 123 456</div>
                    <div className="text-emerald-200 text-xs">24/7 Support</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <EnvelopeIcon className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">hello@tesgold.com</div>
                    <div className="text-purple-200 text-xs">Get in touch</div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center text-sm">
                  <GlobeAltIcon className="h-4 w-4 mr-2" />
                  Follow Our Journey
                </h4>
                <div className="flex space-x-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg border border-white/10 hover:border-white/20"
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {footerSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="font-bold text-white mb-4 relative">
                      {section.title}
                      <div className="absolute bottom-0 left-0 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 mt-1"></div>
                    </h3>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.href}
                            className="group block text-blue-200 hover:text-white transition-all duration-200"
                          >
                            <div className="font-medium group-hover:text-white transition-colors text-sm">
                              {link.name}
                            </div>
                            <div className="text-xs text-blue-300/70 group-hover:text-blue-100 transition-colors">
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
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text mb-1 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-blue-200 font-medium text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                {/* <p className="text-blue-200 flex items-center text-sm">
                  Made with <HeartIcon className="h-3 w-3 text-red-400 mx-1" /> in Ethiopia
                </p> */}
              </div>
              <div className="flex items-center space-x-2 text-blue-300">
                <ShieldCheckIcon className="h-3 w-3" />
                <span className="text-xs">Licensed & Verified Platform</span>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <p className="text-blue-200 text-sm">
                © {currentYear} TesGold. All rights reserved.
              </p>
              <p className="text-blue-300/70 text-xs mt-0.5">
                Empowering Ethiopia's digital marketplace
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;