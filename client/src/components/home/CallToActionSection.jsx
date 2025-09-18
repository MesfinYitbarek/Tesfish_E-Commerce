// components/home/CallToActionSection.jsx - Compact Design
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon,
  HomeIcon,
  ArrowRightIcon,
  UserGroupIcon,
  CubeIcon,
  SparklesIcon,
  StarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const CallToActionSection = () => {
  const actions = [
    {
      type: 'buyer',
      title: 'Looking to Buy or Rent?',
      subtitle: 'Find Your Perfect Property',
      description: 'Discover your ideal property from thousands of verified listings across Ethiopia with advanced search and professional support.',
      icon: HomeIcon,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
      gradient: 'from-blue-500 to-cyan-500',
      actions: [
        {
          label: 'Browse Properties',
          href: '/products?productType=homes',
          primary: true,
          icon: MagnifyingGlassIcon
        },
        {
          label: 'Advanced Search',
          href: '/products',
          primary: false,
          icon: ArrowRightIcon
        }
      ]
    },
    {
      type: 'seller',
      title: 'Ready to Sell or Rent Out?',
      subtitle: 'List Your Property Today',
      description: 'List your property and reach thousands of potential buyers and tenants with our premium listing features and marketing tools.',
      icon: PlusIcon,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      gradient: 'from-emerald-500 to-teal-500',
      actions: [
        {
          label: 'List Property',
          href: '/dashboard/products/create',
          primary: true,
          icon: PlusIcon
        }
      ]
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-medium mb-4 border border-white/20">
            <StarIcon className="h-3 w-3 mr-1.5 text-yellow-400" />
            Start Your Journey Today
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
            Your success story
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              starts here
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Whether you're buying or selling, TesGold provides the perfect marketplace 
            to achieve your goals with cutting-edge tools and professional support.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {actions.map((action, index) => (
            <ActionCard key={action.type} action={action} index={index} />
          ))}
        </div>

        {/* Business Partnership CTA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-blue-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 lg:p-8 text-center border border-white/20 dark:border-slate-700/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mb-4 shadow-lg">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  Partner with TesGold
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                  Join as a business seller and access powerful tools to grow your sales. 
                  Get verified, showcase your products, and connect with customers across Ethiopia 
                  with our comprehensive business solutions.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <Link to="/auth/register">
                  <Button size="md" className="min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm px-6 py-2">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    Register Your Business
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="md" className="min-w-[200px] border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white text-sm px-6 py-2">
                    Learn About Services
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Business Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">24/7</div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium text-sm">Platform Access</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">Always available for your business</div>
                </div>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <UserGroupIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">50K+</div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium text-sm">Active Users</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">Reach customers nationwide</div>
                </div>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <CubeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Free</div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium text-sm">Basic Tools</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">Essential features included</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Category Links */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link 
            to="/products?productType=homes" 
            className="group p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
          >
            <HomeIcon className="h-8 w-8 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="text-white font-semibold text-sm">Homes</div>
            <div className="text-blue-200 text-xs">Buy & Rent</div>
          </Link>
          <Link 
            to="/products?productType=commercials" 
            className="group p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
          >
            <BuildingOfficeIcon className="h-8 w-8 mx-auto mb-2 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="text-white font-semibold text-sm">Commercial</div>
            <div className="text-emerald-200 text-xs">Properties</div>
          </Link>
          <Link 
            to="/products?productType=plots" 
            className="group p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
          >
            <SparklesIcon className="h-8 w-8 mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="text-white font-semibold text-sm">Land & Plots</div>
            <div className="text-purple-200 text-xs">All Types</div>
          </Link>
          <Link 
            to="/products?productType=others" 
            className="group p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
          >
            <CubeIcon className="h-8 w-8 mx-auto mb-2 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="text-white font-semibold text-sm">Products</div>
            <div className="text-orange-200 text-xs">Electronics & More</div>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Enhanced Action Card
const ActionCard = ({ action, index }) => {
  const Icon = action.icon;

  return (
    <div
      className="group"
      style={{ animationDelay: `${index * 300}ms` }}
    >
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-slate-700/20 overflow-hidden">
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={action.image}
            alt={action.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-60`}></div>
          
          {/* Icon */}
          <div className="absolute top-4 left-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">
              {action.title}
            </h3>
            <p className="text-white/90 font-semibold">
              {action.subtitle}
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 lg:p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {action.description}
          </p>
          
          <div className="space-y-3">
            {action.actions.map((actionBtn, actionIndex) => {
              const ActionIcon = actionBtn.icon;
              return (
                <Link key={actionIndex} to={actionBtn.href} className="block">
                  <Button 
                    variant={actionBtn.primary ? 'default' : 'outline'} 
                    size="md"
                    className={`w-full justify-center group/btn text-sm py-2 ${
                      actionBtn.primary 
                        ? `bg-gradient-to-r ${action.gradient} hover:shadow-lg` 
                        : 'border-slate-300 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <ActionIcon className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                    {actionBtn.label}
                    <ArrowRightIcon className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;