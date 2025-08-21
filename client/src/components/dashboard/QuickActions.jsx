import { Link } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CameraIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const QuickActions = () => {
  const actions = [
    {
      title: 'Add New Listing',
      description: 'Create a property or service listing',
      icon: PlusIcon,
      href: '/dashboard/products/create',
      color: 'bg-primary-500 hover:bg-primary-600',
      primary: true
    },
    {
      title: 'Edit Listings',
      description: 'Update existing listings',
      icon: PencilIcon,
      href: '/dashboard/products',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'View Messages',
      description: 'Check customer inquiries',
      icon: ChatBubbleLeftRightIcon,
      href: '/dashboard/messages',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Analytics',
      description: 'View performance metrics',
      icon: ChartBarIcon,
      href: '/dashboard/analytics',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Upload Photos',
      description: 'Add more listing photos',
      icon: CameraIcon,
      href: '/dashboard/products?tab=photos',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Share Listings',
      description: 'Promote on social media',
      icon: ShareIcon,
      href: '/dashboard/products?tab=share',
      color: 'bg-pink-500 hover:bg-pink-600'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.href}
            className="group"
          >
            <div className={`relative overflow-hidden rounded-xl p-4 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg ${action.color} ${
              action.primary ? 'md:col-span-2 lg:col-span-2' : ''
            }`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
                  <action.icon className="h-6 w-6" />
                </div>
                <h4 className="font-medium text-sm mb-1">
                  {action.title}
                </h4>
                <p className="text-xs opacity-90 leading-relaxed">
                  {action.description}
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white/10 rounded-full"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;