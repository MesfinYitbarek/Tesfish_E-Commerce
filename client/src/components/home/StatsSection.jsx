import { useEffect, useState } from 'react';
import { 
  HomeIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  StarIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const StatsSection = () => {
  const [counters, setCounters] = useState({
    properties: 0,
    customers: 0,
    companies: 0,
    transactions: 0,
    rating: 0,
    revenue: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeStatIndex, setActiveStatIndex] = useState(0);

  const finalStats = {
    properties: 10000,
    customers: 50000,
    companies: 500,
    transactions: 25000,
    rating: 4.8,
    revenue: 500000000
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2500;
    const steps = 100;
    const increment = duration / steps;

    const timer = setInterval(() => {
      setCounters(prev => {
        const newCounters = {};
        let allComplete = true;

        Object.keys(finalStats).forEach(key => {
          const target = finalStats[key];
          const current = prev[key];
          const step = target / steps;
          
          if (current < target) {
            newCounters[key] = Math.min(current + step, target);
            allComplete = false;
          } else {
            newCounters[key] = target;
          }
        });

        if (allComplete) {
          clearInterval(timer);
        }

        return newCounters;
      });
    }, increment);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Auto-rotate highlighted stat
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'Properties Listed',
      value: Math.floor(counters.properties).toLocaleString(),
      icon: HomeIcon,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-100 dark:bg-blue-900/20',
      description: 'Verified listings across Ethiopia'
    },
    {
      label: 'Happy Customers',
      value: Math.floor(counters.customers).toLocaleString(),
      icon: UserGroupIcon,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-green-600',
      lightBg: 'bg-green-100 dark:bg-green-900/20',
      description: 'Satisfied buyers and sellers'
    },
    {
      label: 'Partner Companies',
      value: Math.floor(counters.companies).toLocaleString(),
      icon: BuildingOfficeIcon,
      color: 'text-purple-600',
      bgColor: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-100 dark:bg-purple-900/20',
      description: 'Trusted real estate partners'
    },
    {
      label: 'Completed Deals',
      value: Math.floor(counters.transactions).toLocaleString(),
      icon: CheckCircleIcon,
      color: 'text-orange-600',
      bgColor: 'from-orange-500 to-orange-600',
      lightBg: 'bg-orange-100 dark:bg-orange-900/20',
      description: 'Successful transactions'
    },
    {
      label: 'Average Rating',
      value: counters.rating.toFixed(1),
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-500 to-yellow-600',
      lightBg: 'bg-yellow-100 dark:bg-yellow-900/20',
      suffix: '/5.0',
      description: 'Customer satisfaction score'
    },
    {
      label: 'Total Revenue',
      value: `ETB ${(counters.revenue / 1000000).toFixed(0)}M`,
      icon: CurrencyDollarIcon,
      color: 'text-indigo-600',
      bgColor: 'from-indigo-500 to-indigo-600',
      lightBg: 'bg-indigo-100 dark:bg-indigo-900/20',
      description: 'Generated through platform'
    }
  ];

  return (
    <section 
      id="stats-section"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Platform Statistics
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Join thousands of satisfied customers who have found their perfect properties 
            and services through CitiLights. Our numbers speak for themselves.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-16">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              stat={stat} 
              index={index} 
              isActive={activeStatIndex === index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-sm font-medium mb-6">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Why Choose CitiLights?
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Your Success is Our Priority
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're committed to providing the best experience for our users with industry-leading standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                100% Verified Listings
              </h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Every property and service is thoroughly verified by our expert team before listing, 
                ensuring authenticity and quality.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <StarIcon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <FireIcon className="h-3 w-3 text-white" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Award-Winning Service
              </h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Consistently rated as the best platform for real estate in Ethiopia with 
                industry recognition and customer awards.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <UserGroupIcon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">24</span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                24/7 Expert Support
              </h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our dedicated team of real estate experts is available around the clock 
                to help you find exactly what you need.
              </p>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">99.5%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">&lt;2min</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">15+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Stat Card Component
const StatCard = ({ stat, index, isActive, isVisible }) => {
  const Icon = stat.icon;

  return (
    <div 
      className={`text-center group transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${isActive ? 'scale-110' : 'hover:scale-105'}`}
      style={{ 
        animationDelay: `${index * 150}ms`,
        transitionDelay: `${index * 100}ms`
      }}
    >
      <div className="relative mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${stat.bgColor} rounded-full mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg ${
          isActive ? 'shadow-2xl ring-4 ring-blue-500/20' : ''
        }`}>
          <Icon className="h-10 w-10 text-white" />
        </div>
        
        {isActive && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
            <FireIcon className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      
      <div className={`text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300 ${
        isActive ? 'text-blue-600 dark:text-blue-400' : ''
      }`}>
        {stat.value}
        {stat.suffix && (
          <span className="text-xl text-gray-500 dark:text-gray-400">
            {stat.suffix}
          </span>
        )}
      </div>
      
      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {stat.label}
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {stat.description}
      </div>
    </div>
  );
};

export default StatsSection;