import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  WrenchScrewdriverIcon,
  ComputerDesktopIcon,
  SwatchIcon as ShirtIcon,
  TruckIcon,
  ArrowRightIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const CategoryShowcase = () => {
  const categories = [
    {
      id: 'real-estate',
      name: 'Real Estate',
      description: 'Premium properties & investments',
      fullDescription: 'Discover luxury homes, apartments, and commercial spaces across Ethiopia',
      icon: HomeIcon,
      itemCount: '10,000+',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      color: 'from-blue-500 to-blue-700',
      accentColor: 'blue',
      href: '/products?category=real-estate',
      trending: true,
      featured: true,
      stats: { newListings: '150+', avgPrice: '5.2M ETB' }
    },
    {
      id: 'services',
      name: 'Professional Services',
      description: 'Expert construction & design',
      fullDescription: 'Professional project management, engineering, and interior design services',
      icon: WrenchScrewdriverIcon,
      itemCount: '500+',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
      color: 'from-green-500 to-green-700',
      accentColor: 'green',
      href: '/products?category=services',
      trending: true,
      featured: true,
      stats: { providers: '50+', avgRating: '4.8/5' }
    },
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Latest tech & appliances',
      fullDescription: 'Computers, smartphones, home appliances, and electronic accessories',
      icon: ComputerDesktopIcon,
      itemCount: '2,000+',
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop',
      color: 'from-purple-500 to-purple-700',
      accentColor: 'purple',
      href: '/products?category=electronics',
      trending: false,
      featured: false,
      stats: { brands: '25+', warranty: 'Up to 2yr' }
    },
    {
      id: 'fashion',
      name: 'Fashion & Style',
      description: 'Trendy clothing & accessories',
      fullDescription: 'Contemporary fashion, traditional wear, accessories, and footwear',
      icon: ShirtIcon,
      itemCount: '1,500+',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      color: 'from-pink-500 to-pink-700',
      accentColor: 'pink',
      href: '/products?category=fashion',
      trending: true,
      featured: false,
      stats: { designers: '15+', newArrivals: 'Weekly' }
    },
    {
      id: 'automotive',
      name: 'Automotive',
      description: 'Vehicles & auto parts',
      fullDescription: 'Cars, motorcycles, spare parts, and automotive accessories',
      icon: TruckIcon,
      itemCount: '800+',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
      color: 'from-orange-500 to-orange-700',
      accentColor: 'orange',
      href: '/products?category=automotive',
      trending: false,
      featured: false,
      stats: { dealers: '20+', financing: 'Available' }
    },
    {
      id: 'construction',
      name: 'Construction',
      description: 'Building materials & tools',
      fullDescription: 'Quality construction materials, professional tools, and equipment',
      icon: BuildingOfficeIcon,
      itemCount: '1,200+',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
      color: 'from-gray-600 to-gray-800',
      accentColor: 'gray',
      href: '/products?category=construction',
      trending: false,
      featured: false,
      stats: { suppliers: '30+', delivery: 'Same day' }
    }
  ];

  const featuredCategories = categories.filter(cat => cat.featured);
  const regularCategories = categories.filter(cat => !cat.featured);

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium mb-3">
            <ChartBarIcon className="h-3 w-3 mr-1" />
            Explore Our Marketplace
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Browse by Category
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our comprehensive marketplace featuring premium real estate, 
            professional services, and quality products across Ethiopia.
          </p>
        </div>

        {/* Featured Categories */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Featured Categories
            </h3>
            <div className="flex items-center text-purple-600 dark:text-purple-400">
              <UserGroupIcon className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Most Popular</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredCategories.map((category) => (
              <FeaturedCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Regular Categories Grid */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
            All Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {regularCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2">Can't Find What You're Looking For?</h3>
          <p className="text-sm text-purple-100 mb-6 max-w-xl mx-auto">
            Join thousands of satisfied customers and explore our complete marketplace 
            with advanced search and filtering options.
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-white text-purple-600 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Browse All Products
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Featured Category Card (Compact)
const FeaturedCategoryCard = ({ category }) => {
  const Icon = category.icon;

  return (
    <Link
      to={category.href}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex flex-col lg:flex-row h-48 lg:h-36">
        {/* Image Section */}
        <div className="relative lg:w-2/5 h-full overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-85`}></div>
          
          {/* Icon */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-2">
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Trending Badge */}
          {category.trending && (
            <div className="absolute top-4 right-4">
              <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <ChartBarIcon className="h-2 w-2 mr-1" />
                Hot
              </div>
            </div>
          )}

          {/* Item Count */}
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-lg font-bold">{category.itemCount}</div>
            <div className="text-xs opacity-90">Available</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:w-3/5 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
              {category.fullDescription}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-2 gap-3 text-xs">
              {Object.entries(category.stats).map(([key, value]) => (
                <div key={key}>
                  <div className="text-gray-500 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {value}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
              <span className="mr-1">Explore</span>
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Regular Category Card (Compact)
const CategoryCard = ({ category }) => {
  const Icon = category.icon;

  return (
    <Link
      to={category.href}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
    >
      {/* Background Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`}></div>
        
        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          <div className="flex items-start justify-between">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Icon className="h-4 w-4" />
            </div>
            
            {category.trending && (
              <div className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                Hot
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-1 group-hover:text-yellow-300 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs opacity-90 mb-2">
              {category.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium opacity-75">
                {category.itemCount}
              </span>
              <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-xs font-medium transform scale-90 group-hover:scale-100 transition-transform duration-200">
            Browse Category
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryShowcase;