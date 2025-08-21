import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ProductTable from '../../components/dashboard/ProductTable';
import ProductGrid from '../../components/dashboard/ProductGrid';
import ProductFilters from '../../components/dashboard/ProductFilters';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  fetchMyProducts,
  setFilters,
  setViewMode,
  deleteProduct
} from '../../store/slices/productSlice';
import {
  selectProducts,
  selectProductLoading,
  selectPagination,
  selectFilters,
  selectViewMode,
  selectProductError
} from '../../store/selectors/productSelectors';

const MyListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Select data from Redux store
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const pagination = useSelector(selectPagination);
  const reduxFilters = useSelector(selectFilters);
  const viewMode = useSelector(selectViewMode);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, product: null });
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL or Redux store
  const [filters, setLocalFilters] = useState({
    search: searchParams.get('search') || reduxFilters.search || '',
    status: searchParams.get('status') || 'all',
    type: searchParams.get('type') || reduxFilters.type || 'all',
    sort: searchParams.get('sort') || reduxFilters.sort || 'newest',
    page: parseInt(searchParams.get('page')) || pagination.currentPage || 1,
    limit: parseInt(searchParams.get('limit')) || pagination.limit || 10
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Dispatch fetchProducts action with current filters
    const fetchParams = {
      ...filters,
      sellerOnly: true, // Only fetch current user's products
      status: filters.status !== 'all' ? filters.status : undefined,
      productType: filters.type !== 'all' ? filters.type : undefined
    };
    
    dispatch(fetchMyProducts(fetchParams));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to page 1 when filters change
    setLocalFilters(updatedFilters);
    dispatch(setFilters(updatedFilters));

    // Update URL params
    const params = new URLSearchParams();
    Object.keys(updatedFilters).forEach(key => {
      if (updatedFilters[key] && updatedFilters[key] !== 'all' && updatedFilters[key] !== '') {
        params.set(key, updatedFilters[key]);
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    handleFilterChange({ page });
  };

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      toast.success('Listing deleted successfully');
      setDeleteConfirm({ show: false, product: null });
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedProducts.map(id => 
        dispatch(deleteProduct(id)).unwrap()
      ));
      toast.success(`${selectedProducts.length} listings deleted successfully`);
      setSelectedProducts([]);
      setBulkDeleteConfirm(false);
    } catch (error) {
      toast.error('Failed to delete listings');
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id));
    }
  };

  const getStatusCounts = () => {
    // Safeguard against undefined products
    const productsArray = Array.isArray(products) ? products : [];
    
    return {
      all: pagination.totalProducts || 0,
      active: productsArray.filter(p => p?.status === 'active').length,
      draft: productsArray.filter(p => p?.status === 'draft').length,
      pending: productsArray.filter(p => p?.status === 'pending').length,
      sold: productsArray.filter(p => p?.status === 'sold').length,
      'out-of-stock': productsArray.filter(p => p?.status === 'out-of-stock').length,
      discontinued: productsArray.filter(p => p?.status === 'discontinued').length
    };
  };

  const statusCounts = getStatusCounts();

  const statusTabs = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'active', label: 'Active', count: statusCounts.active },
    { key: 'draft', label: 'Drafts', count: statusCounts.draft },
    { key: 'pending', label: 'Pending', count: statusCounts.pending },
    { key: 'sold', label: 'Sold', count: statusCounts.sold },
    { key: 'out-of-stock', label: 'Out of Stock', count: statusCounts['out-of-stock'] },
    { key: 'discontinued', label: 'Discontinued', count: statusCounts.discontinued }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' }
  ];

  const productTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'physical', label: 'Physical Products' },
    { value: 'digital', label: 'Digital Products' },
    { value: 'service', label: 'Services' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'rental', label: 'Rentals' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Listings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your property and service listings
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/dashboard/products/create">
            <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
              Add New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pagination.totalProducts || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Squares2X2Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {products.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {products.reduce((sum, p) => sum + (p.totalSales || 0), 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {products.length > 0 
                  ? (products.reduce((sum, p) => sum + (p.reviews?.average || 0), 0) / products.length).toFixed(1)
                  : 0}/5
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleFilterChange({ status: tab.key })}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  filters.status === tab.key
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    filters.status === tab.key
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters and Controls */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Search listings..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                />
              </div>

              <select
                value={filters.type}
                onChange={(e) => handleFilterChange({ type: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {productTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
              >
                Filters
              </Button>
            </div>

            {/* View Mode and Bulk Actions */}
            <div className="flex items-center space-x-3">
              {selectedProducts.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkDeleteConfirm(true)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Delete ({selectedProducts.length})
                </Button>
              )}

              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => handleViewModeChange('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-gray-700 text-primary-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-primary-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" text="Loading your listings..." />
            </div>
          ) : products.length > 0 ? (
            viewMode === 'table' ? (
              <ProductTable
                products={products}
                selectedProducts={selectedProducts}
                onSelectProduct={handleSelectProduct}
                onSelectAll={handleSelectAll}
                onDelete={(product) => setDeleteConfirm({ show: true, product })}
              />
            ) : (
              <ProductGrid
                products={products}
                selectedProducts={selectedProducts}
                onSelectProduct={handleSelectProduct}
                onDelete={(product) => setDeleteConfirm({ show: true, product })}
              />
            )
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Squares2X2Icon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No listings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filters.search || filters.status !== 'all' || filters.type !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first listing.'}
              </p>
              <Link to="/dashboard/products/create">
                <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Add Your First Listing
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {products.length > 0 && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(filters.page * filters.limit, pagination.totalProducts)}</span> of{' '}
              <span className="font-medium">{pagination.totalProducts}</span> listings
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === pagination.totalPages}
                onClick={() => handlePageChange(filters.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, product: null })}
        onConfirm={() => handleDelete(deleteConfirm.product?._id)}
        title="Delete Listing"
        message={`Are you sure you want to delete "${deleteConfirm.product?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        onClose={() => setBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete Multiple Listings"
        message={`Are you sure you want to delete ${selectedProducts.length} listings? This action cannot be undone.`}
        confirmText="Delete All"
        confirmVariant="danger"
      />
    </div>
  );
};

export default MyListings;