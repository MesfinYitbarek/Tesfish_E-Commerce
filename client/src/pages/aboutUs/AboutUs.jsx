import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  ShieldCheckIcon,
  UsersIcon,
  GlobeAltIcon,
  ChartBarIcon,
  HeartIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  TrophyIcon,
  StarIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  HomeIcon,
  CubeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Products & Properties', value: '25,000+', icon: BuildingOfficeIcon, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Active Users', value: '50,000+', icon: UsersIcon, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Successful Projects', value: '500+', icon: CheckCircleIcon, gradient: 'from-purple-500 to-indigo-500' },
    { label: 'Service Categories', value: '15+', icon: CogIcon, gradient: 'from-orange-500 to-red-500' }
  ];

  const platforms = [
    {
      icon: BuildingOfficeIcon,
      title: 'Real Estate',
      description: 'Properties, land, commercial spaces across Ethiopia',
      gradient: 'from-blue-500 to-cyan-500',
      items: ['Residential Properties', 'Commercial Spaces', 'Land & Plots', 'Rental Properties']
    },
    {
      icon: TruckIcon,
      title: 'Vehicles',
      description: 'Cars, trucks, motorcycles and automotive equipment',
      gradient: 'from-emerald-500 to-teal-500',
      items: ['Cars & Trucks', 'Motorcycles', 'Commercial Vehicles', 'Auto Parts']
    },
    {
      icon: ComputerDesktopIcon,
      title: 'Electronics',
      description: 'Latest technology products and electronic devices',
      gradient: 'from-purple-500 to-indigo-500',
      items: ['Computers & Laptops', 'Mobile Phones', 'Home Electronics', 'Tech Accessories']
    },
    {
      icon: CubeIcon,
      title: 'General Products',
      description: 'Wide range of products for every need',
      gradient: 'from-orange-500 to-red-500',
      items: ['Home & Garden', 'Fashion & Beauty', 'Sports & Recreation', 'Books & Media']
    }
  ];

  const services = [
    {
      icon: ChartBarIcon,
      title: 'Project Management',
      description: 'Complete project oversight from initiation to completion',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CogIcon,
      title: 'Engineering Design',
      description: 'Professional design solutions for civil and architectural projects',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: HomeIcon,
      title: 'Interior Design',
      description: 'Transform spaces with professional interior design services',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Real Estate Consultancy',
      description: 'Expert advisory services for property investments',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: CubeIcon,
      title: 'Mineral Services',
      description: 'Comprehensive mineral exploration and extraction consultancy',
      gradient: 'from-amber-500 to-yellow-500'
    }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Security',
      description: 'We prioritize the security of your transactions and personal information with state-of-the-art encryption and verification processes.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: HeartIcon,
      title: 'Customer First',
      description: 'Every decision we make is centered around providing the best possible experience for our customers and service providers.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: GlobeAltIcon,
      title: 'Innovation',
      description: 'We continuously innovate to bring you the latest technology and features that make buying, selling, and service delivery effortless.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: TrophyIcon,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our platform, from product quality to professional service delivery.',
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  const team = [
    {
      name: 'Abebe Bekele',
      role: 'Founder & CEO',
      image: 'https://pfst.cf2.poecdn.net/base/image/763e0062cb793025f0fefe65ca4c668155d726aec37b25070895ecc3b6bf0057?w=600&h=400',
      bio: 'With over 15 years in business and technology, Abebe founded TesGold to revolutionize commerce and professional services in Ethiopia.',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      name: 'Meron Tadesse',
      role: 'Chief Technology Officer',
      image: 'https://pfst.cf2.poecdn.net/base/image/ac20eb9645b34914dcd9f201c3a2791d7c99a05481240775a24a9e2111e20b92?w=600&h=400',
      bio: 'Former software architect at major tech companies, Meron leads our technical innovation and platform development across all verticals.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Dawit Haile',
      role: 'Head of Operations',
      image: 'https://pfst.cf2.poecdn.net/base/image/c320d548c8b2c1aa59e22626f1db5c3435ba3843fe2360185212e2dbcb744aa3?w=600&h=400',
      bio: 'Expert in business operations and marketplace management, ensuring smooth platform operations and service quality across all categories.',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'Rahel Negash',
      role: 'Head of Marketing',
      image: 'https://pfst.cf2.poecdn.net/base/image/fea195a2949fde522245bbd28148c6b90167d3963b24140a7e073a3b43e67196?w=600&h=400',
      bio: 'Digital marketing specialist focused on connecting buyers, sellers, and service providers across our comprehensive marketplace.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const milestones = [
    {
      year: '2019',
      title: 'Company Founded',
      description: 'TesGold was established with a vision to digitize commerce and professional services in Ethiopia.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      year: '2020',
      title: 'Marketplace Launch',
      description: 'Launched our comprehensive marketplace with properties, vehicles, and electronics.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      year: '2021',
      title: 'Professional Services',
      description: 'Introduced professional services including project management and engineering design.',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      year: '2022',
      title: 'Mobile Platform',
      description: 'Released mobile applications for seamless marketplace and service access.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      year: '2023',
      title: 'National Expansion',
      description: 'Expanded our marketplace and services to 15+ cities across Ethiopia.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      year: '2024',
      title: 'AI & Analytics',
      description: 'Implemented AI-powered recommendations and advanced analytics for better user experience.',
      gradient: 'from-amber-500 to-yellow-500'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BuildingOfficeIcon },
    { id: 'mission', label: 'Mission & Vision', icon: TrophyIcon },
    { id: 'team', label: 'Our Team', icon: UsersIcon },
    { id: 'history', label: 'Our Journey', icon: ClockIcon }
  ];

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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-6 border border-white/20">
              <SparklesIcon className="h-3 w-3 mr-1.5" />
              Ethiopia's Premier Marketplace & Services Platform
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              <span className="block text-white mb-1">About</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                TesGold
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Your comprehensive platform for properties, products, and professional services 
              <span className="text-white font-semibold"> across Ethiopia</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link to="/products">
                <Button size="md" variant="secondary" className="w-full sm:w-auto px-6 py-3 text-sm">
                  Explore Marketplace
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="md" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 text-sm">
                  <CogIcon className="h-4 w-4 mr-2" />
                  Our Services
                </Button>
              </Link>
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

      {/* Navigation Tabs */}
      <section className="py-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 lg:py-16 bg-white dark:bg-gray-900 relative">
        {/* Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium mb-4 border border-blue-100 dark:border-blue-800/30">
                  <BuildingOfficeIcon className="h-3 w-3 mr-1.5" />
                  Who We Are
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                  Comprehensive Marketplace & Professional Services
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                  TesGold is Ethiopia's leading integrated platform combining a comprehensive marketplace 
                  for properties, vehicles, electronics, and products with professional services including 
                  project management, engineering design, and consultancy services.
                </p>
              </div>

              {/* Marketplace Platforms */}
              <div>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium mb-4 border border-emerald-100 dark:border-emerald-800/30">
                    <CubeIcon className="h-3 w-3 mr-1.5" />
                    Our Marketplace
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Everything You Need in One Place
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {platforms.map((platform, index) => {
                    const Icon = platform.icon;
                    return (
                      <motion.div
                        key={platform.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full">
                          <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${platform.gradient} rounded-xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                            {platform.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            {platform.description}
                          </p>
                          <ul className="space-y-1">
                            {platform.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <CheckCircleIcon className="h-3 w-3 text-emerald-500 mr-1.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Professional Services */}
              <div>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium mb-4 border border-purple-100 dark:border-purple-800/30">
                    <CogIcon className="h-3 w-3 mr-1.5" />
                    Professional Services
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Expert Services for Your Projects
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <motion.div
                        key={service.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group text-center"
                      >
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                          <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                            {service.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {service.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    What Makes Us Different
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Integrated Platform</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          One platform for all your needs - from buying products to professional services.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                        <ShieldCheckIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Verified Quality</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          All products and service providers are verified to ensure quality and authenticity.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                        <MapPinIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Local Expertise</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Deep understanding of Ethiopian market needs and local business practices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative overflow-hidden rounded-2xl shadow-xl">
                    <img
                      src="https://pfst.cf2.poecdn.net/base/image/a7ebd329058e60fd4be32d41d5d4e682c2d7024ac312200dc7bd68880ef70d2d?w=600&h=400"
                      alt="Modern Office Space"
                      className="w-full h-64 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30"></div>
                  </div>
                </div>
              </div>

              {/* Our Values */}
              <div>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium mb-4 border border-orange-100 dark:border-orange-800/30">
                    <HeartIcon className="h-3 w-3 mr-1.5" />
                    Our Values
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    What Drives Us Forward
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {values.map((value, index) => {
                    const Icon = value.icon;
                    return (
                      <motion.div
                        key={value.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                          <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${value.gradient} rounded-xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                            {value.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Mission & Vision Tab */}
          {activeTab === 'mission' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium mb-4 border border-emerald-100 dark:border-emerald-800/30">
                  <TrophyIcon className="h-3 w-3 mr-1.5" />
                  Our Purpose
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                  Mission & Vision
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 lg:p-8 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <TrophyIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Our Mission
                      </h3>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      To create Ethiopia's most comprehensive and trusted platform that seamlessly connects 
                      buyers and sellers across all product categories while providing world-class professional 
                      services to support business growth and development.
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 lg:p-8 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <StarIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Our Vision
                      </h3>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      To become East Africa's leading integrated marketplace and professional services platform, 
                      driving economic growth and digital transformation across all sectors through innovative 
                      technology and exceptional service delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Commitment Section */}
              <div className="text-center">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                  Our Commitment to Excellence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <ShieldCheckIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Quality Assurance
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Every product and service is verified to meet our high standards of quality and authenticity.
                      </p>
                    </div>
                  </div>
                  <div className="group">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <UsersIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Customer Success
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        24/7 support and dedicated teams to ensure success for all our users and service providers.
                      </p>
                    </div>
                  </div>
                  <div className="group">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <ChartBarIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Innovation Focus
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Continuously improving our platform with cutting-edge technology and user feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium mb-4 border border-orange-100 dark:border-orange-800/30">
                  <UsersIcon className="h-3 w-3 mr-1.5" />
                  Our People
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                  Meet Our Expert Team
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Our diverse team brings together expertise in technology, business, engineering, 
                  and customer service to deliver exceptional marketplace and professional services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative overflow-hidden rounded-xl">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/300/300';
                            }}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-tr ${member.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}></div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3 text-sm">
                        {member.role}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-medium mb-4 border border-indigo-100 dark:border-indigo-800/30">
                  <ClockIcon className="h-3 w-3 mr-1.5" />
                  Our Story
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                  Our Growth Journey
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  From a startup focused on real estate to Ethiopia's most comprehensive 
                  marketplace and professional services platform.
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-purple-500 h-full rounded-full"></div>
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 group hover:shadow-2xl transition-all duration-300">
                          <div className={`text-2xl font-bold bg-gradient-to-r ${milestone.gradient} bg-clip-text text-transparent mb-2`}>
                            {milestone.year}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                            {milestone.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                      <div className="w-2/12 flex justify-center">
                        <div className={`w-6 h-6 bg-gradient-to-r ${milestone.gradient} rounded-full border-4 border-white dark:border-gray-900 shadow-lg relative z-10`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/40 rounded-full animate-ping"></div>
                        </div>
                      </div>
                      <div className="w-5/12"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 lg:py-16 relative overflow-hidden">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who trust TesGold for their marketplace needs 
              and professional services across Ethiopia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link to="/register">
                <Button
                  size="md"
                  className="bg-white text-slate-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3 text-sm w-full sm:w-auto"
                >
                  Join Marketplace
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  variant="outline"
                  size="md"
                  className="border-white text-white hover:bg-white hover:text-slate-900 px-6 py-3 text-sm w-full sm:w-auto"
                >
                  <CogIcon className="h-4 w-4 mr-2" />
                  Explore Services
                </Button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  <CubeIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white mb-1">Comprehensive</div>
                <div className="text-blue-200 text-sm">Products & Services</div>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-white mb-1">Quality Assured</div>
                <div className="text-blue-200 text-sm">Verified listings & services</div>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-xl font-bold text-white mb-1">Expert Support</div>
                <div className="text-blue-200 text-sm">Professional assistance</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;