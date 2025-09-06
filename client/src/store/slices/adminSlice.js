import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';

// Async thunks
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard statistics');
    }
  }
);

export const getAnalytics = createAsyncThunk(
  'admin/getAnalytics',
  async (period = '30', { rejectWithValue }) => {
    try {
      const response = await adminService.getAnalytics(period);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch analytics');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'admin/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await adminService.updateSettings(settings);
      toast.success('Settings updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update settings');
      return rejectWithValue(error.message || 'Failed to update settings');
    }
  }
);

export const moderateReview = createAsyncThunk(
  'admin/moderateReview',
  async ({ reviewId, status }, { rejectWithValue }) => {
    try {
      const response = await adminService.moderateReview(reviewId, status);
      toast.success(`Review ${status} successfully`);
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to moderate review');
      return rejectWithValue(error.message || 'Failed to moderate review');
    }
  }
);

export const exportData = createAsyncThunk(
  'admin/exportData',
  async (type, { rejectWithValue }) => {
    try {
      const response = await adminService.exportData(type);
      toast.success(`${type} data exported successfully`);
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to export data');
      return rejectWithValue(error.message || 'Failed to export data');
    }
  }
);

export const getUsers = createAsyncThunk(
  'admin/getUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateUser(userId, updateData);
      toast.success('User updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      return { userId, ...response.data };
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

export const getOrders = createAsyncThunk(
  'admin/getOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getOrders(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status, adminNotes }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateOrderStatus(orderId, status, adminNotes);
      toast.success(`Order status updated to ${status}`);
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

export const getProducts = createAsyncThunk(
  'admin/getProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ productId, updateData }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateProduct(productId, updateData);
      toast.success('Product updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
      return rejectWithValue(error.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await adminService.deleteProduct(productId);
      toast.success('Product deleted successfully');
      return { productId, ...response.data };
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
      return rejectWithValue(error.message || 'Failed to delete product');
    }
  }
);

export const getReviews = createAsyncThunk(
  'admin/getReviews',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getReviews(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reviews');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'admin/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await adminService.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      return { reviewId, ...response.data };
    } catch (error) {
      toast.error(error.message || 'Failed to delete review');
      return rejectWithValue(error.message || 'Failed to delete review');
    }
  }
);

export const getServiceInquiries = createAsyncThunk(
  'admin/getServiceInquiries',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getServiceInquiries(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch service inquiries');
    }
  }
);

export const updateServiceInquiryStatus = createAsyncThunk(
  'admin/updateServiceInquiryStatus',
  async ({ inquiryId, status, adminNotes }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateServiceInquiryStatus(inquiryId, status, adminNotes);
      toast.success(`Service inquiry status updated to ${status}`);
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update service inquiry status');
      return rejectWithValue(error.message || 'Failed to update service inquiry status');
    }
  }
);

export const getPlatformMetrics = createAsyncThunk(
  'admin/getPlatformMetrics',
  async (timeRange, { rejectWithValue }) => {
    try {
      const response = await adminService.getPlatformMetrics(timeRange);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch platform metrics');
    }
  }
);

// Initial state
const initialState = {
  // Dashboard data
  dashboardStats: {
    users: {
      total: 0,
      newThisMonth: 0,
      byType: []
    },
    products: {
      total: 0,
      active: 0,
      byCategory: []
    },
    orders: {
      total: 0,
      thisMonth: 0,
      byStatus: []
    },
    revenue: {
      total: 0,
      thisMonth: 0
    },
    serviceInquiries: {
      total: 0,
      byStatus: []
    },
    reviews: {
      total: 0,
      averageRating: 0
    }
  },

  // Analytics data
  analytics: {
    dailyRegistrations: [],
    dailyOrders: [],
    popularProducts: [],
    topSellers: []
  },

  // Management data
  users: [],
  orders: [],
  products: [],
  reviews: [],
  serviceInquiries: [],

  // Platform metrics
  platformMetrics: {},

  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  },

  // Loading states
  isLoading: false,
  isLoadingStats: false,
  isLoadingAnalytics: false,
  isLoadingUsers: false,
  isLoadingOrders: false,
  isLoadingProducts: false,
  isLoadingReviews: false,
  isLoadingInquiries: false,
  isLoadingMetrics: false,
  isExporting: false,
  isUpdating: false,

  // Error handling
  error: null,
  statsError: null,
  analyticsError: null,

  // Filters
  filters: {
    users: {
      userType: 'all',
      status: 'all',
      search: '',
      startDate: null,
      endDate: null
    },
    orders: {
      status: 'all',
      search: '',
      startDate: null,
      endDate: null
    },
    products: {
      status: 'all',
      category: 'all',
      search: '',
      startDate: null,
      endDate: null
    },
    reviews: {
      status: 'all',
      rating: 'all',
      search: ''
    },
    serviceInquiries: {
      status: 'all',
      serviceType: 'all',
      search: ''
    }
  },

  // Settings
  settings: {}
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.statsError = null;
      state.analyticsError = null;
    },

    // Update filters
    updateFilters: (state, action) => {
      const { type, filters } = action.payload;
      state.filters[type] = { ...state.filters[type], ...filters };
    },

    // Reset filters
    resetFilters: (state, action) => {
      const type = action.payload;
      if (state.filters[type]) {
        state.filters[type] = initialState.filters[type];
      }
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Update item in list (for real-time updates)
    updateItemInList: (state, action) => {
      const { type, itemId, updates } = action.payload;
      
      if (state[type]) {
        const itemIndex = state[type].findIndex(item => item._id === itemId);
        if (itemIndex !== -1) {
          state[type][itemIndex] = { ...state[type][itemIndex], ...updates };
        }
      }
    },

    // Remove item from list
    removeItemFromList: (state, action) => {
      const { type, itemId } = action.payload;
      
      if (state[type]) {
        state[type] = state[type].filter(item => item._id !== itemId);
      }
    },

    // Reset admin state
    resetAdminState: (state) => {
      return initialState;
    }
  },

  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoadingStats = true;
        state.statsError = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.statsError = action.payload;
      })

      // Analytics
      .addCase(getAnalytics.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.analyticsError = null;
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.isLoadingAnalytics = false;
        state.analytics = action.payload;
      })
      .addCase(getAnalytics.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.analyticsError = action.payload;
      })

      // Settings
      .addCase(updateSettings.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      // Export data
      .addCase(exportData.pending, (state) => {
        state.isExporting = true;
      })
      .addCase(exportData.fulfilled, (state) => {
        state.isExporting = false;
      })
      .addCase(exportData.rejected, (state, action) => {
        state.isExporting = false;
        state.error = action.payload;
      })

      // Users management
      .addCase(getUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.users = action.payload.users || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.error = action.payload;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.user;
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.users = state.users.filter(user => user._id !== userId);
      })

      // Orders management
      .addCase(getOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoadingOrders = false;
        state.orders = action.payload.orders || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.error = action.payload;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order;
        const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
      })

      // Products management
      .addCase(getProducts.pending, (state) => {
        state.isLoadingProducts = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoadingProducts = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoadingProducts = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload.product;
        const productIndex = state.products.findIndex(product => product._id === updatedProduct._id);
        if (productIndex !== -1) {
          state.products[productIndex] = updatedProduct;
        }
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        const { productId } = action.payload;
        state.products = state.products.filter(product => product._id !== productId);
      })

      // Reviews management
      .addCase(getReviews.pending, (state) => {
        state.isLoadingReviews = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoadingReviews = false;
        state.reviews = action.payload.reviews || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoadingReviews = false;
        state.error = action.payload;
      })

      .addCase(moderateReview.fulfilled, (state, action) => {
        const updatedReview = action.payload.review;
        const reviewIndex = state.reviews.findIndex(review => review._id === updatedReview._id);
        if (reviewIndex !== -1) {
          state.reviews[reviewIndex] = updatedReview;
        }
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        const { reviewId } = action.payload;
        state.reviews = state.reviews.filter(review => review._id !== reviewId);
      })

      // Service inquiries management
      .addCase(getServiceInquiries.pending, (state) => {
        state.isLoadingInquiries = true;
        state.error = null;
      })
      .addCase(getServiceInquiries.fulfilled, (state, action) => {
        state.isLoadingInquiries = false;
        state.serviceInquiries = action.payload.inquiries || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getServiceInquiries.rejected, (state, action) => {
        state.isLoadingInquiries = false;
        state.error = action.payload;
      })

      .addCase(updateServiceInquiryStatus.fulfilled, (state, action) => {
        const updatedInquiry = action.payload.inquiry;
        const inquiryIndex = state.serviceInquiries.findIndex(inquiry => inquiry._id === updatedInquiry._id);
        if (inquiryIndex !== -1) {
          state.serviceInquiries[inquiryIndex] = updatedInquiry;
        }
      })

      // Platform metrics
      .addCase(getPlatformMetrics.pending, (state) => {
        state.isLoadingMetrics = true;
      })
      .addCase(getPlatformMetrics.fulfilled, (state, action) => {
        state.isLoadingMetrics = false;
        state.platformMetrics = action.payload;
      })
      .addCase(getPlatformMetrics.rejected, (state, action) => {
        state.isLoadingMetrics = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  clearError,
  updateFilters,
  resetFilters,
  setLoading,
  updateItemInList,
  removeItemFromList,
  resetAdminState
} = adminSlice.actions;

// Selectors
export const selectDashboardStats = (state) => state.admin.dashboardStats;
export const selectAnalytics = (state) => state.admin.analytics;
export const selectUsers = (state) => state.admin.users;
export const selectOrders = (state) => state.admin.orders;
export const selectProducts = (state) => state.admin.products;
export const selectReviews = (state) => state.admin.reviews;
export const selectServiceInquiries = (state) => state.admin.serviceInquiries;
export const selectPlatformMetrics = (state) => state.admin.platformMetrics;
export const selectAdminPagination = (state) => state.admin.pagination;
export const selectAdminFilters = (state) => state.admin.filters;
export const selectAdminSettings = (state) => state.admin.settings;

// Loading selectors
export const selectIsLoadingStats = (state) => state.admin.isLoadingStats;
export const selectIsLoadingAnalytics = (state) => state.admin.isLoadingAnalytics;
export const selectIsLoadingUsers = (state) => state.admin.isLoadingUsers;
export const selectIsLoadingOrders = (state) => state.admin.isLoadingOrders;
export const selectIsLoadingProducts = (state) => state.admin.isLoadingProducts;
export const selectIsLoadingReviews = (state) => state.admin.isLoadingReviews;
export const selectIsLoadingInquiries = (state) => state.admin.isLoadingInquiries;
export const selectIsLoadingMetrics = (state) => state.admin.isLoadingMetrics;
export const selectIsExporting = (state) => state.admin.isExporting;
export const selectIsUpdating = (state) => state.admin.isUpdating;

// Error selectors
export const selectAdminError = (state) => state.admin.error;
export const selectStatsError = (state) => state.admin.statsError;
export const selectAnalyticsError = (state) => state.admin.analyticsError;

export default adminSlice.reducer;