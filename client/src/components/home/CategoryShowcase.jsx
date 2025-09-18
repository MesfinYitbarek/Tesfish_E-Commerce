// components/home/CategoryShowcase.jsx - Compact Design
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  MapPinIcon,
  ComputerDesktopIcon,
  TruckIcon,
  CubeIcon,
  ArrowRightIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const CategoryShowcase = () => {
  const categories = [
    {
      id: 'homes',
      name: 'Homes & Apartments',
      description: 'Houses, apartments, villas & condos',
      icon: HomeIcon,
      href: '/products?productType=homes',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
      count: '2,500+ listings',
      gradient: 'from-blue-500 to-cyan-500',
      featured: true
    },
    {
      id: 'commercials',
      name: 'Commercial Properties',
      description: 'Offices, shops, warehouses & buildings',
      icon: BuildingOfficeIcon,
      href: '/products?productType=commercials',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      count: '1,200+ listings',
      gradient: 'from-emerald-500 to-teal-500',
      featured: true
    },
    {
      id: 'plots',
      name: 'Land & Plots',
      description: 'Residential & commercial land',
      icon: MapPinIcon,
      href: '/products?productType=plots',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
      count: '800+ listings',
      gradient: 'from-green-500 to-emerald-500',
      featured: false
    },
    {
      id: 'vehicles',
      name: 'Vehicles',
      description: 'Cars, trucks & motorcycles',
      icon: TruckIcon,
      href: '/products?productType=others&subProductType=vehicles',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
      count: '1,500+ listings',
      gradient: 'from-orange-500 to-red-500',
      featured: false
    },
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Computers, phones & appliances',
      icon: ComputerDesktopIcon,
      href: '/products?productType=others&subProductType=electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
      count: '3,000+ listings',
      gradient: 'from-purple-500 to-indigo-500',
      featured: false
    },
    {
      id: 'others',
      name: 'Other Products',
      description: 'Furniture, fashion & more',
      icon: CubeIcon,
      href: '/products?productType=others',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
      count: '5,000+ listings',
      gradient: 'from-pink-500 to-purple-500',
      featured: false
    }
  ];

  const featuredCategories = categories.filter(cat => cat.featured);
  const regularCategories = categories.filter(cat => !cat.featured);

  return (
    <section className="py-12 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-sm mb-4">
            <SparklesIcon className="h-3 w-3 text-blue-600 mr-1.5" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Explore Our Marketplace
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Browse by Category
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive marketplace featuring premium real estate, 
            quality vehicles, electronics, and more 
            <span className="text-blue-600 dark:text-blue-400 font-semibold">across Ethiopia</span>.
          </p>
        </div>

        {/* Featured Categories */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
              Featured Categories
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredCategories.map((category, index) => (
              <FeaturedCategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>

        {/* Regular Categories Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            All Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {regularCategories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className="text-center bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-800 dark:to-blue-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="relative">
            <h3 className="text-2xl lg:text-3xl font-bold mb-3">
              Can't find what you're looking for?
            </h3>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              Explore our complete marketplace with advanced search and filtering options 
              tailored for the Ethiopian market.
            </p>
            <Link to="/products">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm px-6 py-2">
                Browse all products
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Featured Category Card
const FeaturedCategoryCard = ({ category, index }) => {
  const Icon = category.icon;

  return (
    <div
      className="group"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <Link
        to={category.href}
        className="block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row h-48 lg:h-40">
          {/* Image Section */}
          <div className="relative lg:w-2/5 h-full overflow-hidden">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80`}></div>
            
            {/* Icon */}
            <div className="absolute top-4 left-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Count Badge */}
            <div className="absolute bottom-4 left-4">
              <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-semibold text-slate-700">
                {category.count}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-3/5 p-4 lg:p-6 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {category.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              {category.description}
            </p>
            
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-200">
              <span className="mr-2 text-sm">Explore Category</span>
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Enhanced Regular Category Card
const CategoryCard = ({ category, index }) => {
  const Icon = category.icon;

  return (
    <div
      className="group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link
        to={category.href}
        className="block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden"
      >
        {/* Image */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80`}></div>
          
          {/* Icon */}
          <div className="absolute top-3 left-3">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {category.count}
            </span>
            <ArrowRightIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryShowcase;