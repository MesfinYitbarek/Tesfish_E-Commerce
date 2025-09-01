// components/home/CallToActionSection.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  HomeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  ShieldCheckIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const CallToActionSection = () => {
  const [activeCard, setActiveCard] = useState(null);

  const userTypes = [
    {
      type: 'buyer',
      title: 'Looking to Buy or Rent?',
      subtitle: 'Find Your Perfect Property',
      description: 'Discover your ideal property from thousands of verified listings across Ethiopia with advanced search and filtering options.',
      icon: HomeIcon,
      color: 'from-blue-500 to-blue-600',
      lightColor: 'from-blue-50 to-blue-100',
      darkColor: 'from-blue-900 to-blue-800',
      image: 'https://pfst.cf2.poecdn.net/base/image/cd7b1680a45c74758acc3c4d8f1ffd52cdcefba38b486e3b1224552df90611c6?w=400&h=300',
      actions: [
        {
          label: 'Browse Properties',
          href: '/products?productType=homes',
          variant: 'primary',
          icon: MagnifyingGlassIcon
        },
        {
          label: 'Advanced Search',
          href: '/products',
          variant: 'outline',
          icon: ArrowRightIcon
        }
      ],
      features: [
        'Verified property listings',
        'Virtual property tours',
        'Direct seller contact',
        'Flexible viewing options',
        'All property types available',
        'Secure transaction process'
      ]
    },
    {
      type: 'seller',
      title: 'Ready to Sell or Rent Out?',
      subtitle: 'List Your Property Today',
      description: 'List your property and reach thousands of potential buyers and tenants. Get maximum exposure with our premium listing features.',
      icon: PlusIcon,
      color: 'from-green-500 to-green-600',
      lightColor: 'from-green-50 to-green-100',
      darkColor: 'from-green-900 to-green-800',
      image: 'https://pfst.cf2.poecdn.net/base/image/c74ce0df0a232131752ff4a283afe51f3b93c6ceac55cfc3dc239d2a80d16c85?w=400&h=300',
      actions: [
        {
          label: 'List Property',
          href: '/dashboard/products/create',
          variant: 'primary',
          icon: PlusIcon
        },
        {
          label: 'Learn More',
          href: '/how-it-works',
          variant: 'outline',
          icon: ArrowRightIcon
        }
      ],
      features: [
        'Free property listing',
        'Professional photo upload',
        'Marketing across platforms',
        'Direct buyer communication',
        'Listing management tools',
        'Sales tracking dashboard'
      ]
    },
    {
      type: 'trader',
      title: 'Want to Sell Products?',
      subtitle: 'Join Our Marketplace',
      description: 'Sell vehicles, electronics, furniture, and more. Connect with buyers across Ethiopia and grow your business online.',
      icon: CubeIcon,
      color: 'from-purple-500 to-purple-600',
      lightColor: 'from-purple-50 to-purple-100',
      darkColor: 'from-purple-900 to-purple-800',
      image: 'https://pfst.cf2.poecdn.net/base/image/9d9c71dec12723ff6b004d13a2d69d305620727d248be7b4c82a1d30974c4425?w=400&h=300',
      actions: [
        {
          label: 'Start Selling',
          href: '/auth/register?type=individual',
          variant: 'primary',
          icon: CubeIcon
        },
        {
          label: 'View Products',
          href: '/products?productType=others',
          variant: 'outline',
          icon: ArrowRightIcon
        }
      ],
      features: [
        'Multiple product categories',
        'Easy listing management',
        'Secure payment options',
        'Buyer communication tools',
        'Inventory tracking',
        'Sales analytics dashboard'
      ]
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-pattern-cross"></div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-medium mb-4 border border-white/20">
            <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
            Start Your Journey Today
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            Your Success Story
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h2>
          <p className="text-sm lg:text-base text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Whether you're buying, selling properties, or trading products, TesGold provides 
            the perfect marketplace to achieve your goals with cutting-edge tools and support.
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {userTypes.map((userType, index) => (
            <CTACard 
              key={userType.type} 
              userType={userType} 
              index={index}
              isActive={activeCard === userType.type}
              onHover={() => setActiveCard(userType.type)}
              onLeave={() => setActiveCard(null)}
            />
          ))}
        </div>

        {/* Business Registration CTA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl blur-xl opacity-20"></div>
          <div className="relative bg-gradient-to-r from-blue-600/90 to-purple-700/90 backdrop-blur-lg rounded-2xl p-8 lg:p-10 text-center text-white border border-white/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-pattern-cross"></div>
            
            <div className="relative max-w-3xl mx-auto">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                  Partner with TesGold
                </h3>
                <p className="text-sm lg:text-base text-blue-100 leading-relaxed max-w-2xl mx-auto">
                  Join as a business seller and access powerful tools to grow your sales. 
                  Get verified, showcase your products, and connect with customers across Ethiopia.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="auth/register">
                  <Button size="md" className="min-w-[200px] bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    Register Your Business
                  </Button>
                </Link>
              </div>

              {/* Business Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/20">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <ClockIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">24/7</div>
                  <div className="text-blue-100 font-medium text-sm">Platform Access</div>
                  <div className="text-blue-200 text-xs mt-1">Always available</div>
                </div>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <UserGroupIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">Wide</div>
                  <div className="text-blue-100 font-medium text-sm">Customer Reach</div>
                  <div className="text-blue-200 text-xs mt-1">All across Ethiopia</div>
                </div>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <CubeIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">Free</div>
                  <div className="text-blue-100 font-medium text-sm">Listing Tools</div>
                  <div className="text-blue-200 text-xs mt-1">Essential features included</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Category Links */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/products?productType=homes" 
            className="group p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
          >
            <HomeIcon className="h-8 w-8 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="text-white font-medium text-sm">Homes</div>
            <div className="text-blue-200 text-xs">Buy & Rent</div>
          </Link>
          <Link 
            to="/products?productType=commercials" 
            className="group p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
          >
            <BuildingOfficeIcon className="h-8 w-8 mx-auto mb-2 text-green-400 group-hover:scale-110 transition-transform" />
            <div className="text-white font-medium text-sm">Commercial</div>
            <div className="text-green-200 text-xs">Properties</div>
          </Link>
          <Link 
            to="/products?productType=plots" 
            className="group p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
          >
            <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
            <div className="text-white font-medium text-sm">Land & Plots</div>
            <div className="text-purple-200 text-xs">All Types</div>
          </Link>
          <Link 
            to="/products?productType=others" 
            className="group p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
          >
            <CubeIcon className="h-8 w-8 mx-auto mb-2 text-orange-400 group-hover:scale-110 transition-transform" />
            <div className="text-white font-medium text-sm">Products</div>
            <div className="text-orange-200 text-xs">Electronics & More</div>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Enhanced CTA Card Component
const CTACard = ({ userType, index, isActive, onHover, onLeave }) => {
  const Icon = userType.icon;

  return (
    <div 
      className={`relative bg-white/95 backdrop-blur-lg dark:bg-gray-800/95 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-white/20 dark:border-gray-700/50 ${
        isActive ? 'scale-102 shadow-2xl' : 'hover:shadow-2xl'
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img
          src={userType.image}
          alt={userType.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${userType.color} opacity-5`}></div>
      
      {/* Top Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${userType.color}`}></div>
      
      <div className="relative p-5">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${userType.color} rounded-xl mb-4 transform hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {userType.title}
          </h3>
          <p className={`text-sm font-semibold bg-gradient-to-r ${userType.color} bg-clip-text text-transparent mb-2`}>
            {userType.subtitle}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {userType.description}
          </p>
        </div>

        {/* Features */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">Key Features:</h4>
          <div className="grid grid-cols-1 gap-1">
            {userType.features.slice(0,3).map((feature, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </div>
            ))}
            {userType.features.length > 3 && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                +{userType.features.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {userType.actions.map((action, actionIndex) => {
            const ActionIcon = action.icon;
            return (
              <Link key={actionIndex} to={action.href} className="block">
                <Button 
                  variant={action.variant} 
                  size="sm" 
                  className={`w-full justify-center transform hover:scale-105 transition-all duration-200 text-xs ${
                    action.variant === 'primary' 
                      ? `bg-gradient-to-r ${userType.color} hover:shadow-lg` 
                      : ''
                  }`}
                >
                  <ActionIcon className="h-4 w-4 mr-1" />
                  {action.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;