import { Link } from 'react-router-dom';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

const ProductTable = ({ 
  products, 
  selectedProducts, 
  onSelectProduct, 
  onSelectAll, 
  onDelete 
}) => {
  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
      draft: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
      inactive: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
      sold: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status] || badges.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const badges = {
      'real-estate': 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
      'service': 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[type] || badges['real-estate']}`}>
        {type === 'real-estate' ? 'Property' : 'Service'}
      </span>
    );
  };

  const allSelected = products.length > 0 && selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={onSelectAll}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Listing
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Performance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => onSelectProduct(product._id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-16">
                    <img
                      className="h-12 w-16 rounded-lg object-cover"
                      src={product.media?.images?.[0]?.url || '/api/placeholder/64/48'}
                      alt={product.title}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <Link
                        to={`/dashboard/products/${product._id}`}
                        className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 truncate max-w-xs"
                      >
                        {product.title}
                      </Link>
                      {product.featured && (
                        <StarIcon className="h-4 w-4 text-yellow-400 ml-2" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {product.type === 'real-estate'
                        ? `${product.realEstateDetails?.location?.city || 'Location'}`
                        : `${product.serviceDetails?.serviceArea || 'Service Area'}`
                      }
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                {getTypeBadge(product.type)}
              </td>

              <td className="px-6 py-4">
                {getStatusBadge(product.status)}
              </td>

              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(product.pricing?.basePrice || 0, 'ETB')}
                </div>
                {product.pricing?.priceType && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    per {product.pricing.priceType}
                  </div>
                )}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    <span>{product.views}</span>
                  </div>
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                    <span>{product.inquiries}</span>
                  </div>
                  {product.type === 'service' && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{product.bookings}</span>
                    </div>
                  )}
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {formatRelativeTime(product.updatedAt)}
              </td>

              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    to={`/product/${product._id}`}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="View listing"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/dashboard/products/${product._id}/edit`}
                    className="text-gray-400 hover:text-primary-500"
                    title="Edit listing"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(product)}
                    className="text-gray-400 hover:text-red-500"
                    title="Delete listing"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;