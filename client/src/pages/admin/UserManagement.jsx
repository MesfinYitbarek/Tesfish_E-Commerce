import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  NoSymbolIcon,
  CheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import { formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', user: null });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, statusFilter, userTypeFilter, pagination.currentPage]);

  useEffect(() => {
    filterUsers();
  }, [users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.currentPage.toString());
      queryParams.append('limit', '20');
      
      if (searchQuery) queryParams.append('search', searchQuery);
      if (statusFilter !== 'all') {
        if (statusFilter === 'active') {
          queryParams.append('isActive', 'true');
          queryParams.append('isVerified', 'true');
        }
        if (statusFilter === 'suspended') queryParams.append('isActive', 'false');
        if (statusFilter === 'pending') queryParams.append('isVerified', 'false');
      }
      if (userTypeFilter !== 'all') queryParams.append('userType', userTypeFilter);
      
      const response = await api.get(`/users?${queryParams.toString()}`);
      
      if (response.data.success) {
        // Transform API data to match component expectations
        const transformedUsers = response.data.data.users.map(user => ({
          id: user._id,
          firstName: user.userType === 'company' 
            ? user.companyProfile?.companyName || 'Company' 
            : user.individualProfile?.firstName || user.customerProfile?.firstName || 'N/A',
          lastName: user.userType === 'company' 
            ? '' 
            : (user.individualProfile?.lastName || user.customerProfile?.lastName || ''),
          email: user.email,
          phone: user.companyProfile?.contactInfo?.phone || 
                 user.individualProfile?.phone || 
                 user.customerProfile?.phone || 'N/A',
          userType: user.userType,
          status: !user.isActive ? 'suspended' : (!user.isVerified ? 'pending' : 'active'),
          verified: user.isVerified,
          avatar: user.companyProfile?.logo || 
                  user.individualProfile?.avatar || 
                  user.customerProfile?.avatar || null,
          companyName: user.companyProfile?.companyName || null,
          joinedAt: new Date(user.createdAt),
          lastActive: new Date(user.updatedAt),
          listingsCount: user.totalSales || 0,
          messagesCount: Math.floor(Math.random() * 50), // TODO: Get from messages API
          reportsCount: 0, // TODO: Get from reports API
          city: user.companyProfile?.address?.city || 
                user.individualProfile?.address?.city || 
                user.customerProfile?.addresses?.[0]?.city || 'N/A',
          subscriptionStatus: user.subscriptionStatus,
          sellerRating: user.sellerRating,
          totalOrders: user.totalOrders,
          businessCategories: user.companyProfile?.businessCategories || [],
          originalUser: user // Keep original user data for details modal
        }));

        setUsers(transformedUsers);
        setPagination(response.data.data.pagination);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Error handling is managed by the axios interceptor
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (!error.response) {
        toast.error('Failed to load users. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    // Since filtering is now done server-side, just set the users
    setFilteredUsers(users);
  };

  const handleUserAction = (action, user) => {
    const actions = {
      suspend: {
        title: 'Suspend User',
        message: `Are you sure you want to suspend ${user.firstName} ${user.lastName}? They will not be able to access their account.`,
        confirmText: 'Suspend User',
        confirmVariant: 'danger'
      },
      activate: {
        title: 'Activate User',
        message: `Are you sure you want to activate ${user.firstName} ${user.lastName}?`,
        confirmText: 'Activate User',
        confirmVariant: 'primary'
      },
      verify: {
        title: 'Verify User',
        message: `Are you sure you want to verify ${user.firstName} ${user.lastName}?`,
        confirmText: 'Verify User',
        confirmVariant: 'primary'
      },
      delete: {
        title: 'Delete User',
        message: `Are you sure you want to permanently delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
        confirmText: 'Delete User',
        confirmVariant: 'danger'
      }
    };

    setConfirmAction({
      show: true,
      type: action,
      user,
      ...actions[action]
    });
  };

  const executeUserAction = async () => {
    const { type, user } = confirmAction;
    
    try {
      let response;
      
      switch (type) {
        case 'suspend':
          response = await api.put(`/users/${user.id}`, { isActive: false });
          break;
        case 'activate':
          response = await api.put(`/users/${user.id}`, { isActive: true });
          break;
        case 'verify':
          response = await api.put(`/users/${user.id}`, { isVerified: true });
          break;
        case 'delete':
          response = await api.delete(`/users/${user.id}`);
          break;
        default:
          throw new Error('Invalid action type');
      }

      if (response.data.success) {
        // Update local state
        if (type === 'delete') {
          setUsers(prev => prev.filter(u => u.id !== user.id));
        } else {
          setUsers(prev => prev.map(u => {
            if (u.id === user.id) {
              switch (type) {
                case 'suspend':
                  return { ...u, status: 'suspended' };
                case 'activate':
                  return { ...u, status: 'active' };
                case 'verify':
                  return { ...u, verified: true };
                default:
                  return u;
              }
            }
            return u;
          }));
        }

        toast.success(response.data.message || `User ${type}d successfully`);
      } else {
        throw new Error(response.data.message || `Failed to ${type} user`);
      }
    } catch (error) {
      console.error('Error executing user action:', error);
      // Error handling is managed by the axios interceptor
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Failed to ${type} user. Please try again.`);
      }
    } finally {
      setConfirmAction({ show: false, type: '', user: null });
    }
  };

  const exportUsers = async () => {
    try {
      const response = await api.get('/users/export', {
        responseType: 'blob' // Important for file downloads
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Failed to export users');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      suspended: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
    };
    
    return badges[status] || badges.pending;
  };

  const getUserTypeIcon = (userType) => {
    return userType === 'company' ? BuildingOfficeIcon : UserIcon;
  };

  const statusCounts = {
    all: pagination.totalUsers,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    pending: users.filter(u => u.status === 'pending').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts, verify businesses, and handle moderation
          </p>
        </div>
        <Button
          onClick={exportUsers}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {status === 'all' ? 'Total Users' : `${status} Users`}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {count}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                status === 'active' ? 'bg-green-500' :
                status === 'suspended' ? 'bg-red-500' :
                status === 'pending' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, phone, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="company">Company</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => {
                const UserTypeIcon = getUserTypeIcon(user.userType);
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                          {user.verified && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckIcon className="h-2.5 w-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {user.firstName} {user.lastName}
                            </p>
                            <UserTypeIcon className="h-4 w-4 text-gray-400" />
                          </div>
                          {user.companyName && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.companyName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Joined {formatRelativeTime(user.joinedAt)}
                          </p>
                          {user.subscriptionStatus && user.subscriptionStatus !== 'free' && (
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.subscriptionStatus === 'premium' ? 'bg-purple-100 text-purple-800' :
                              user.subscriptionStatus === 'enterprise' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {user.subscriptionStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-gray-100">
                          <EnvelopeIcon className="h-3 w-3 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <PhoneIcon className="h-3 w-3 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.city}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                        {user.sellerRating?.average > 0 && (
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {user.sellerRating.average.toFixed(1)} ({user.sellerRating.totalReviews})
                            </span>
                          </div>
                        )}
                      </div>
                    </td>              
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>

                        {!user.verified && user.status === 'active' && (
                          <button
                            onClick={() => handleUserAction('verify', user)}
                            className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                            title="Verify user"
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                          </button>
                        )}

                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction('suspend', user)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Suspend user"
                          >
                            <NoSymbolIcon className="h-4 w-4" />
                          </button>
                        ) : user.status === 'suspended' && (
                          <button
                            onClick={() => handleUserAction('activate', user)}
                            className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                            title="Activate user"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleUserAction('delete', user)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete user"
                        >
                          <ExclamationTriangleIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{((pagination.currentPage - 1) * 20) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * 20, pagination.totalUsers)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalUsers}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserAction={handleUserAction}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmAction.show}
        onClose={() => setConfirmAction({ show: false, type: '', user: null })}
        onConfirm={executeUserAction}
        title={confirmAction.title}
        message={confirmAction.message}
        confirmText={confirmAction.confirmText}
        confirmVariant={confirmAction.confirmVariant}
      />
    </div>
  );
};

export default UserManagement;