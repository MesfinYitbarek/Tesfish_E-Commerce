import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  MapPinIcon,
  ComputerDesktopIcon,
  SwatchIcon as ShirtIcon,
  TruckIcon,
  ArrowRightIcon,
  ChartBarIcon,
  UserGroupIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

const CategoryShowcase = () => {
  const categories = [
    {
      id: 'homes',
      name: 'Homes & Apartments',
      description: 'Houses, apartments & villas',
      fullDescription: 'Discover beautiful homes, modern apartments, luxury villas, and condos across Ethiopia',
      icon: HomeIcon,
      image: 'https://pfst.cf2.poecdn.net/base/image/c74ce0df0a232131752ff4a283afe51f3b93c6ceac55cfc3dc239d2a80d16c85?w=400&h=300',
      color: 'from-blue-500 to-blue-700',
      accentColor: 'blue',
      href: '/products?productType=homes',
      featured: true,
      subTypes: ['houses', 'apartment', 'villas', 'condos', 'townhouses']
    },
    {
      id: 'commercials',
      name: 'Commercial Properties',
      description: 'Offices, shops & warehouses',
      fullDescription: 'Premium office spaces, retail shops, warehouses, and commercial buildings for business',
      icon: BuildingOfficeIcon,
      image: 'https://pfst.cf2.poecdn.net/base/image/9d9c71dec12723ff6b004d13a2d69d305620727d248be7b4c82a1d30974c4425?w=400&h=300',
      color: 'from-green-500 to-green-700',
      accentColor: 'green',
      href: '/products?productType=commercials',
      featured: true,
      subTypes: ['offices', 'warehouses', 'shops', 'buildings', 'factories', 'hotels']
    },
    {
      id: 'plots',
      name: 'Land & Plots',
      description: 'Residential & commercial land',
      fullDescription: 'Prime residential land, commercial plots, mixed-use land, and agricultural properties',
      icon: MapPinIcon,
      image: 'https://pfst.cf2.poecdn.net/base/image/1d7884774a838296d5b139dfb0188761fcfc63608952fd1db2e9c75e4354c6d1?w=400&h=300',
      color: 'from-emerald-500 to-emerald-700',
      accentColor: 'emerald',
      href: '/products?productType=plots',
      featured: false,
      subTypes: ['residential-land', 'commercial-land', 'mixed-use-land', 'agricultural-land']
    },
    {
      id: 'vehicles',
      name: 'Vehicles',
      description: 'Cars, trucks & motorcycles',
      fullDescription: 'Quality used and new vehicles, spare parts, and automotive accessories',
      icon: TruckIcon,
      image: 'https://pfst.cf2.poecdn.net/base/image/d49dd6b59fa154a62ea2a5549ecd4553ac079a01b6472ceceaf56f9a0f14c8b3?w=400&h=300',
      color: 'from-orange-500 to-orange-700',
      accentColor: 'orange',
      href: '/products?productType=others&subProductType=vehicles',
      featured: false,
      subTypes: ['cars', 'trucks', 'motorcycles', 'spare-parts']
    },
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Latest tech & appliances',
      fullDescription: 'Computers, smartphones, home appliances, and electronic accessories',
      icon: ComputerDesktopIcon,
      image: 'https://pfst.cf2.poecdn.net/base/image/c5cb08388da1e9a931e8a25009b7923fefe36ba96f5a4abac18c9468a78e3eed?w=400&h=300',
      color: 'from-purple-500 to-purple-700',
      accentColor: 'purple',
      href: '/products?productType=others&subProductType=electronics',
      featured: false,
      subTypes: ['phones', 'computers', 'appliances', 'accessories']
    },
    {
      id: 'fashion',
      name: 'Fashion & Lifestyle',
      description: 'Clothing & accessories',
      fullDescription: 'Contemporary fashion, traditional wear, accessories, and lifestyle products',
      icon: ShirtIcon,
      image: 'https://pfst.cf2.poecdn.net/base/image/8ec4233e8fe834e7bd221f7a7e64788cff0277e3e11630572777afc8e76e0c5b?w=400&h=300',
      color: 'from-pink-500 to-pink-700',
      accentColor: 'pink',
      href: '/products?productType=others&subProductType=furnitures',
      featured: false,
      subTypes: ['clothing', 'accessories', 'footwear', 'traditional']
    },
    {
      id: 'construction',
      name: 'Construction & Equipment',
      description: 'Materials & machinery',
      fullDescription: 'Construction materials, professional equipment, and industrial machinery',
      icon: CubeIcon,
      image: 'https://pfst.cf2.poecdn.net/base/image/1d7884774a838296d5b139dfb0188761fcfc63608952fd1db2e9c75e4354c6d1?w=400&h=300',
      color: 'from-gray-600 to-gray-800',
      accentColor: 'gray',
      href: '/products?productType=others&subProductType=construction-equipment',
      featured: false,
      subTypes: ['materials', 'tools', 'machinery', 'equipment']
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      description: 'Farm products & equipment',
      fullDescription: 'Agricultural products, farming equipment, seeds, and livestock',
      icon: BuildingOfficeIcon,
      image: 'https://pfst.cf2.poecdn.net/base/image/9d9c71dec12723ff6b004d13a2d69d305620727d248be7b4c82a1d30974c4425?w=400&h=300',
      color: 'from-green-600 to-green-800',
      accentColor: 'green',
      href: '/products?productType=others&subProductType=agricultural-products',
      featured: false,
      subTypes: ['crops', 'livestock', 'equipment', 'supplies']
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
            quality vehicles, electronics, and more across Ethiopia.
          </p>
        </div>

        {/* Featured Categories */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Featured Categories
            </h3>
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

        {/* Quick Browse by Product Type */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Quick Browse
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link 
              to="/products?productType=homes&listingType=sell"
              className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <HomeIcon className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Buy Homes</div>
            </Link>
            <Link 
              to="/products?productType=homes&listingType=rent"
              className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <HomeIcon className="h-6 w-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Rent Homes</div>
            </Link>
            <Link 
              to="/products?productType=commercials"
              className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <BuildingOfficeIcon className="h-6 w-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Commercial</div>
            </Link>
            <Link 
              to="/products?productType=others"
              className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <CubeIcon className="h-6 w-6 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
              <div className="text-sm font-medium text-orange-700 dark:text-orange-300">Products</div>
            </Link>
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
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-85`}></div>
          
          {/* Icon */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-2">
              <Icon className="h-5 w-5 text-white" />
            </div>
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

          {/* Call to Action */}
          <div className="flex items-center justify-end">
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
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`}></div>
        
        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          <div className="flex items-start justify-between">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Icon className="h-4 w-4" />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-1 group-hover:text-yellow-300 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs opacity-90 mb-2">
              {category.description}
            </p>
            
            <div className="flex items-center justify-end">
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