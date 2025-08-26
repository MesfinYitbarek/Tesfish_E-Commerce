// pages/dashboard/MyListings.jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  Squares2X2Icon,
  ListBulletIcon,
  HomeIcon,
  BuildingOfficeIcon
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

const MyListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Select data from Redux store
  const { 
    products = [], 
    isLoading = false, 
    error = null, 
    pagination = {}, 
    filters: reduxFilters = {}, 
    viewMode = 'grid',
    stats = {}
  } = useSelector((state) => state.products || {});

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, product: null });
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL or Redux store
  const [filters, setLocalFilters] = useState({
    search: searchParams.get('search') || reduxFilters.search || '',
    status: searchParams.get('status') || 'all',
    productType: searchParams.get('productType') || reduxFilters.productType || 'all',
    subProductType: searchParams.get('subProductType') || 'all',
    listingType: searchParams.get('listingType') || 'all',
    sort: searchParams.get('sort') || reduxFilters.sort || 'newest',
    page: parseInt(searchParams.get('page')) || pagination.currentPage || 1,
    limit: parseInt(searchParams.get('limit')) || pagination.limit || 12
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
      status: filters.status !== 'all' ? filters.status : undefined,
      productType: filters.productType !== 'all' ? filters.productType : undefined,
      subProductType: filters.subProductType !== 'all' ? filters.subProductType : undefined,
      listingType: filters.listingType !== 'all' ? filters.listingType : undefined
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
      'pending-approval': productsArray.filter(p => p?.status === 'pending-approval').length,
      sold: productsArray.filter(p => p?.status === 'sold').length,
      rented: productsArray.filter(p => p?.status === 'rented').length,
      'out-of-stock': productsArray.filter(p => p?.status === 'out-of-stock').length,
      discontinued: productsArray.filter(p => p?.status === 'discontinued').length
    };
  };

  const statusCounts = getStatusCounts();

  const statusTabs = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'active', label: 'Active', count: statusCounts.active },
    { key: 'draft', label: 'Drafts', count: statusCounts.draft },
    { key: 'pending-approval', label: 'Pending', count: statusCounts['pending-approval'] },
    { key: 'sold', label: 'Sold', count: statusCounts.sold },
    { key: 'rented', label: 'Rented', count: statusCounts.rented },
    { key: 'out-of-stock', label: 'Out of Stock', count: statusCounts['out-of-stock'] },
    { key: 'discontinued', label: 'Discontinued', count: statusCounts.discontinued }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'inquiries', label: 'Most Inquiries' }
  ];

  const productTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'homes', label: 'Homes' },
    { value: 'plots', label: 'Plots & Land' },
    { value: 'commercials', label: 'Commercial Properties' },
    { value: 'others', label: 'Other Products' }
  ];

  const listingTypeOptions = [
    { value: 'all', label: 'All Listings' },
    { value: 'sell', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' }
  ];

  // Calculate stats from current products
  const calculateStats = () => {
    const productsArray = Array.isArray(products) ? products : [];
    
    return {
      totalViews: productsArray.reduce((sum, p) => sum + (p.views || 0), 0),
      totalInquiries: productsArray.reduce((sum, p) => sum + (p.totalInquiries || 0), 0),
      avgRating: productsArray.length > 0 
        ? (productsArray.reduce((sum, p) => sum + (p.reviews?.average || 0), 0) / productsArray.length).toFixed(1)
        : 0,
      responseRate: stats?.responseRate || 95 // Mock response rate
    };
  };

  const currentStats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Listings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your property and product listings
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/dashboard/listings/create">
            <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
              Create New Listing
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
              <HomeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentStats.totalViews.toLocaleString()}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentStats.totalInquiries}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentStats.responseRate}%
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    filters.status === tab.key
                      ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
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
                  className="text-base"
                />
              </div>

              <select
                value={filters.productType}
                onChange={(e) => handleFilterChange({ productType: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
              >
                {productTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.listingType}
                onChange={(e) => handleFilterChange({ listingType: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
              >
                {listingTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
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
                      ? 'bg-white dark:bg-gray-700 text-indigo-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-indigo-500 shadow-sm'
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
                <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No listings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filters.search || filters.status !== 'all' || filters.productType !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first listing.'}
              </p>
              <Link to="/dashboard/listings/create">
                <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Create Your First Listing
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