// store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService, { propertyRegistrationService } from '../../services/productService';
import { toast } from 'react-hot-toast';

// Async thunks for products
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      toast.success('Product created successfully!');
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(id, productData);
      toast.success('Product updated successfully!');
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProduct(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);

export const fetchMyProducts = createAsyncThunk(
  'products/fetchMyProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getMyProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your products'
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
  }
);

export const fetchPropertyTypes = createAsyncThunk(
  'products/fetchPropertyTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getPropertyTypes();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch property types'
      );
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productService.getFeaturedProducts(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch featured products'
      );
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  'products/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.fetchWishlist();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch wishlist'
      );
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'products/toggleWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.toggleWishlist(productId);
      toast.success(response.message);
      return { productId, isWishlisted: response.data.wishlist > 0 };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update wishlist';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedProducts',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getRelatedProducts(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch related products'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.deleteProduct(productId);
      toast.success(response.message || 'Product deleted successfully');
      return { productId, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  'products/updateProductStatus',
  async ({ productId, status }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProductStatus(productId, status);
      toast.success(`Product ${status} successfully`);
      return { productId, status, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update product status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchProductStats = createAsyncThunk(
  'products/fetchProductStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getProductStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product statistics'
      );
    }
  }
);

// ================= MINERAL MANAGEMENT THUNKS =================

export const fetchMineralsForAdmin = createAsyncThunk(
  'products/fetchMineralsForAdmin',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getMineralsForAdmin(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch minerals for admin'
      );
    }
  }
);

export const createMineral = createAsyncThunk(
  'products/createMineral',
  async (mineralData, { rejectWithValue }) => {
    try {
      const response = await productService.createMineral(mineralData);
      toast.success('Mineral created successfully!');
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create mineral';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateMineral = createAsyncThunk(
  'products/updateMineral',
  async ({ id, mineralData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateMineral(id, mineralData);
      toast.success('Mineral updated successfully!');
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update mineral';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchMineralById = createAsyncThunk(
  'products/fetchMineralById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getMineralById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch mineral'
      );
    }
  }
);

export const deleteMineral = createAsyncThunk(
  'products/deleteMineral',
  async (mineralId, { rejectWithValue }) => {
    try {
      const response = await productService.deleteMineral(mineralId);
      toast.success(response.message || 'Mineral deleted successfully');
      return { mineralId, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete mineral';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateMineralStatus = createAsyncThunk(
  'products/updateMineralStatus',
  async ({ mineralId, status }, { rejectWithValue }) => {
    try {
      const response = await productService.updateMineralStatus(mineralId, status);
      toast.success(`Mineral ${status} successfully`);
      return { mineralId, status, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update mineral status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchMineralStats = createAsyncThunk(
  'products/fetchMineralStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getMineralStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch mineral statistics'
      );
    }
  }
);

export const fetchMineralTypes = createAsyncThunk(
  'products/fetchMineralTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getMineralTypes();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch mineral types'
      );
    }
  }
);

export const bulkUpdateMinerals = createAsyncThunk(
  'products/bulkUpdateMinerals',
  async ({ mineralIds, updates }, { rejectWithValue }) => {
    try {
      const response = await productService.bulkUpdateMinerals(mineralIds, updates);
      toast.success('Minerals updated successfully!');
      return { mineralIds, updates, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update minerals';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const exportMinerals = createAsyncThunk(
  'products/exportMinerals',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.exportMinerals(params);
      toast.success('Minerals exported successfully!');
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to export minerals';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ================= ADMIN THUNKS =================
export const fetchProductsForAdmin = createAsyncThunk(
  'products/fetchProductsForAdmin',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsForAdmin(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products for admin'
      );
    }
  }
);

export const bulkUpdateProducts = createAsyncThunk(
  'products/bulkUpdateProducts',
  async ({ productIds, updates }, { rejectWithValue }) => {
    try {
      const response = await productService.bulkUpdateProducts(productIds, updates);
      toast.success('Products updated successfully!');
      return { productIds, updates, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update products';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const bulkDeleteProducts = createAsyncThunk(
  'products/bulkDeleteProducts',
  async (productIds, { rejectWithValue }) => {
    try {
      const response = await productService.bulkDeleteProducts(productIds);
      toast.success('Products deleted successfully!');
      return { productIds, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete products';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ================= PROPERTY REGISTRATION THUNKS (EXISTING) =================
export const submitPropertyRegistration = createAsyncThunk(
  'products/submitPropertyRegistration',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await propertyRegistrationService.submitRegistration(registrationData);
      toast.success('Property registration submitted successfully!');
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to submit property registration';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchMyRegistrations = createAsyncThunk(
  'products/fetchMyRegistrations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await propertyRegistrationService.getMyRegistrations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your registrations'
      );
    }
  }
);

// Updated: Renamed from fetchCompanyRegistrations to fetchAdminRegistrations
export const fetchAdminRegistrations = createAsyncThunk(
  'products/fetchAdminRegistrations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await propertyRegistrationService.getAdminRegistrations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch admin registrations'
      );
    }
  }
);

// Deprecated: Keep for backward compatibility
export const fetchCompanyRegistrations = createAsyncThunk(
  'products/fetchCompanyRegistrations',
  async (params = {}, { rejectWithValue }) => {
    console.warn('fetchCompanyRegistrations is deprecated. Use fetchAdminRegistrations instead.');
    try {
      const response = await propertyRegistrationService.getAdminRegistrations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch company registrations'
      );
    }
  }
);

export const updateRegistrationStatus = createAsyncThunk(
  'products/updateRegistrationStatus',
  async ({ id, status, adminNotes }, { rejectWithValue }) => {
    try {
      const response = await propertyRegistrationService.updateRegistrationStatus(id, status, adminNotes);
      toast.success(`Registration ${status} successfully`);
      return { id, status, adminNotes, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update registration status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const verifyRegistrationPayment = createAsyncThunk(
  'products/verifyRegistrationPayment',
  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      const response = await propertyRegistrationService.verifyPayment(id, paymentData);
      toast.success('Payment verified successfully!');
      return { id, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to verify payment';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchRegistrationStats = createAsyncThunk(
  'products/fetchRegistrationStats',
  async (period = '30d', { rejectWithValue }) => {
    try {
      const response = await propertyRegistrationService.getRegistrationStats(period);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch registration statistics'
      );
    }
  }
);

export const generateRegistrationCertificate = createAsyncThunk(
  'products/generateRegistrationCertificate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await propertyRegistrationService.generateCertificate(id);
      toast.success('Certificate generated successfully!');
      return { id, certificate: response };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to generate certificate';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const cancelRegistration = createAsyncThunk(
  'products/cancelRegistration',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await propertyRegistrationService.cancelRegistration(id, reason);
      toast.success('Registration cancelled successfully');
      return { id, reason, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to cancel registration';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  // Products
  products: [],
  currentProduct: null,
  featuredProducts: [],
  relatedProducts: [],
  categories: [],
  propertyTypes: [],
  wishlistedItems: [],
  stats: null,
  adminLoading: false,
  adminProducts: [],
  isLoading: false,
  productLoading: false,
  statsLoading: false,
  error: null,

  // Minerals (New section)
  minerals: [],
  currentMineral: null,
  mineralTypes: [],
  mineralStats: null,
  mineralLoading: false,
  mineralError: null,
  mineralPagination: {
    currentPage: 1,
    totalPages: 1,
    totalMinerals: 0,
    hasNext: false,
    hasPrev: false,
  },
  mineralFilters: {
    search: '',
    mineralType: '',
    qualityGrade: '',
    originCountry: '',
    region: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    minPurity: '',
    maxPurity: '',
    verified: '',
    page: 1,
    limit: 20,
    sort: 'newest'
  },

  // Property Registrations (Updated for Admin)
  registrations: [],
  myRegistrations: [],
  adminRegistrations: [], // Renamed from companyRegistrations
  companyRegistrations: [], // Deprecated but kept for compatibility
  currentRegistration: null,
  registrationStats: null,
  propertyOwners: [], // New: for admin filtering
  isSubmitting: false,
  registrationLoading: false,
  registrationError: null,

  // Filters and UI
  aggregatedFilters: {
    priceRange: { minPrice: 0, maxPrice: 0, avgPrice: 0 },
    cities: [],
    propertyTypes: [],
    bedroomCounts: []
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  },
  registrationPagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    category: '',
    subcategory: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    brand: '',
    productType: '',
    subProductType: '',
    listingType: '',
    status: '',
    city: '',
    region: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    furnishingStatus: '',
    features: [],
    featured: '',
    promoted: '',
    sellerType: '',
    minYear: '',
    maxYear: '',
    sort: 'newest',
    page: 1,
    limit: 12,
  },
  registrationFilters: {
    status: '',
    property: '',
    propertyOwner: '', // New: for admin filtering
    paymentStatus: '', // New: for admin filtering
    search: '',
    page: 1,
    limit: 10,
    sort: 'newest'
  },
  viewMode: 'grid',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      if (!action.payload.page) {
        state.filters.page = 1;
      }
    },
    clearFilters: state => {
      state.filters = {
        ...initialState.filters,
        sort: state.filters.sort,
        limit: state.filters.limit,
      };
    },
    setMineralFilters: (state, action) => {
      state.mineralFilters = { ...state.mineralFilters, ...action.payload };
      if (!action.payload.page) {
        state.mineralFilters.page = 1;
      }
    },
    clearMineralFilters: state => {
      state.mineralFilters = {
        ...initialState.mineralFilters,
        sort: state.mineralFilters.sort,
        limit: state.mineralFilters.limit,
      };
    },
    setRegistrationFilters: (state, action) => {
      state.registrationFilters = { ...state.registrationFilters, ...action.payload };
      if (!action.payload.page) {
        state.registrationFilters.page = 1;
      }
    },
    clearRegistrationFilters: state => {
      state.registrationFilters = {
        ...initialState.registrationFilters,
        sort: state.registrationFilters.sort,
        limit: state.registrationFilters.limit,
      };
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    clearCurrentProduct: state => {
      state.currentProduct = null;
      state.relatedProducts = [];
    },
    setCurrentMineral: (state, action) => {
      state.currentMineral = action.payload;
    },
    clearCurrentMineral: state => {
      state.currentMineral = null;
    },
    setCurrentRegistration: (state, action) => {
      state.currentRegistration = action.payload;
    },
    clearCurrentRegistration: state => {
      state.currentRegistration = null;
    },
    setWishlistedItems: (state, action) => {
      state.wishlistedItems = action.payload;
    },
    updateProductInList: (state, action) => {
      const { productId, updates } = action.payload;
      const productIndex = state.products.findIndex(p => p._id === productId);
      if (productIndex !== -1) {
        state.products[productIndex] = {
          ...state.products[productIndex],
          ...updates,
        };
      }
    },
    updateMineralInList: (state, action) => {
      const { mineralId, updates } = action.payload;
      const mineralIndex = state.minerals.findIndex(m => m._id === mineralId);
      if (mineralIndex !== -1) {
        state.minerals[mineralIndex] = {
          ...state.minerals[mineralIndex],
          ...updates,
        };
      }
    },
    updateRegistrationInList: (state, action) => {
      const { registrationId, updates } = action.payload;
      const registrationIndex = state.myRegistrations.findIndex(r => r._id === registrationId);
      if (registrationIndex !== -1) {
        state.myRegistrations[registrationIndex] = {
          ...state.myRegistrations[registrationIndex],
          ...updates,
        };
      }

      // Update in adminRegistrations
      const adminRegistrationIndex = state.adminRegistrations.findIndex(r => r._id === registrationId);
      if (adminRegistrationIndex !== -1) {
        state.adminRegistrations[adminRegistrationIndex] = {
          ...state.adminRegistrations[adminRegistrationIndex],
          ...updates,
        };
      }

      // Update in companyRegistrations (deprecated but kept for compatibility)
      const companyRegistrationIndex = state.companyRegistrations.findIndex(r => r._id === registrationId);
      if (companyRegistrationIndex !== -1) {
        state.companyRegistrations[companyRegistrationIndex] = {
          ...state.companyRegistrations[companyRegistrationIndex],
          ...updates,
        };
      }
    },
    removeProductOptimistically: (state, action) => {
      state.products = state.products.filter(
        product => product._id !== action.payload
      );
      if (state.pagination.totalProducts > 0) {
        state.pagination.totalProducts -= 1;
      }
    },
    removeMineralOptimistically: (state, action) => {
      state.minerals = state.minerals.filter(
        mineral => mineral._id !== action.payload
      );
      if (state.mineralPagination.totalMinerals > 0) {
        state.mineralPagination.totalMinerals -= 1;
      }
    },
    removeRegistrationOptimistically: (state, action) => {
      state.myRegistrations = state.myRegistrations.filter(
        registration => registration._id !== action.payload
      );
      state.adminRegistrations = state.adminRegistrations.filter(
        registration => registration._id !== action.payload
      );
      state.companyRegistrations = state.companyRegistrations.filter(
        registration => registration._id !== action.payload
      );
      if (state.registrationPagination.total > 0) {
        state.registrationPagination.total -= 1;
      }
    },
    resetProductState: (state) => {
      return initialState;
    },
    resetMineralState: (state) => {
      state.minerals = [];
      state.currentMineral = null;
      state.mineralTypes = [];
      state.mineralStats = null;
      state.mineralLoading = false;
      state.mineralError = null;
      state.mineralPagination = initialState.mineralPagination;
      state.mineralFilters = initialState.mineralFilters;
    },
    resetRegistrationState: (state) => {
      state.registrations = [];
      state.myRegistrations = [];
      state.adminRegistrations = [];
      state.companyRegistrations = [];
      state.currentRegistration = null;
      state.registrationStats = null;
      state.propertyOwners = [];
      state.isSubmitting = false;
      state.registrationLoading = false;
      state.registrationError = null;
      state.registrationPagination = initialState.registrationPagination;
      state.registrationFilters = initialState.registrationFilters;
    },
  },
  extraReducers: builder => {
    builder
      // ================= PRODUCT CASES =================
      // Create Product
      .addCase(createProduct.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload.product);
        if (state.pagination.totalProducts >= 0) {
          state.pagination.totalProducts += 1;
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistedItems = action.payload.wishlist || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Product
      .addCase(updateProduct.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const productIndex = state.products.findIndex(p => p._id === action.payload.product._id);
        if (productIndex !== -1) {
          state.products[productIndex] = action.payload.product;
        }
        if (state.currentProduct?._id === action.payload.product._id) {
          state.currentProduct = action.payload.product;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Products
      .addCase(fetchProducts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.aggregatedFilters = action.payload.filters || initialState.aggregatedFilters;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Single Product
      .addCase(fetchProduct.pending, state => {
        state.productLoading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.currentProduct = action.payload.product;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.error = action.payload;
      })

      // Fetch My Products
      .addCase(fetchMyProducts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.stats = action.payload.stats || null;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories || [];
      })

      // Fetch Property Types
      .addCase(fetchPropertyTypes.fulfilled, (state, action) => {
        state.propertyTypes = action.payload.propertyTypes || [];
      })

      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.products || [];
      })

      // Toggle Wishlist
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { productId, isWishlisted } = action.payload;
        if (isWishlisted) {
          if (!state.wishlistedItems.includes(productId)) {
            state.wishlistedItems.push(productId);
          }
        } else {
          state.wishlistedItems = state.wishlistedItems.filter(
            id => id !== productId
          );
        }
      })

      // Fetch Related Products
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload.products || [];
      })

      // Delete Product
      .addCase(deleteProduct.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(
          product => product._id !== action.payload.productId
        );
        if (state.pagination.totalProducts > 0) {
          state.pagination.totalProducts -= 1;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Product Status
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { productId, status } = action.payload;
        const productIndex = state.products.findIndex(p => p._id === productId);
        if (productIndex !== -1) {
          state.products[productIndex].status = status;
        }
        if (state.currentProduct?._id === productId) {
          state.currentProduct.status = status;
        }
      })

      // ================= MINERAL CASES =================
      
      // Fetch Minerals for Admin
      .addCase(fetchMineralsForAdmin.pending, state => {
        state.mineralLoading = true;
        state.mineralError = null;
      })
      .addCase(fetchMineralsForAdmin.fulfilled, (state, action) => {
        state.mineralLoading = false;
        state.minerals = action.payload.minerals || [];
        state.mineralPagination = action.payload.pagination || initialState.mineralPagination;
      })
      .addCase(fetchMineralsForAdmin.rejected, (state, action) => {
        state.mineralLoading = false;
        state.mineralError = action.payload;
      })

      // Create Mineral
      .addCase(createMineral.pending, state => {
        state.mineralLoading = true;
        state.mineralError = null;
      })
      .addCase(createMineral.fulfilled, (state, action) => {
        state.mineralLoading = false;
        state.minerals.unshift(action.payload.mineral);
        if (state.mineralPagination.totalMinerals >= 0) {
          state.mineralPagination.totalMinerals += 1;
        }
      })
      .addCase(createMineral.rejected, (state, action) => {
        state.mineralLoading = false;
        state.mineralError = action.payload;
      })

      // Update Mineral
      .addCase(updateMineral.pending, state => {
        state.mineralLoading = true;
        state.mineralError = null;
      })
      .addCase(updateMineral.fulfilled, (state, action) => {
        state.mineralLoading = false;
        const mineralIndex = state.minerals.findIndex(m => m._id === action.payload.mineral._id);
        if (mineralIndex !== -1) {
          state.minerals[mineralIndex] = action.payload.mineral;
        }
        if (state.currentMineral?._id === action.payload.mineral._id) {
          state.currentMineral = action.payload.mineral;
        }
      })
      .addCase(updateMineral.rejected, (state, action) => {
        state.mineralLoading = false;
        state.mineralError = action.payload;
      })

      // Fetch Mineral by ID
      .addCase(fetchMineralById.pending, state => {
        state.mineralLoading = true;
        state.mineralError = null;
      })
      .addCase(fetchMineralById.fulfilled, (state, action) => {
        state.mineralLoading = false;
        state.currentMineral = action.payload.mineral;
      })
      .addCase(fetchMineralById.rejected, (state, action) => {
        state.mineralLoading = false;
        state.mineralError = action.payload;
      })

      // Delete Mineral
      .addCase(deleteMineral.pending, state => {
        state.mineralLoading = true;
        state.mineralError = null;
      })
      .addCase(deleteMineral.fulfilled, (state, action) => {
        state.mineralLoading = false;
        state.minerals = state.minerals.filter(
          mineral => mineral._id !== action.payload.mineralId
        );
        if (state.mineralPagination.totalMinerals > 0) {
          state.mineralPagination.totalMinerals -= 1;
        }
      })
      .addCase(deleteMineral.rejected, (state, action) => {
        state.mineralLoading = false;
        state.mineralError = action.payload;
      })

      // Update Mineral Status
      .addCase(updateMineralStatus.fulfilled, (state, action) => {
        const { mineralId, status } = action.payload;
        const mineralIndex = state.minerals.findIndex(m => m._id === mineralId);
        if (mineralIndex !== -1) {
          state.minerals[mineralIndex].status = status;
        }
        if (state.currentMineral?._id === mineralId) {
          state.currentMineral.status = status;
        }
      })

      // Fetch Mineral Stats
      .addCase(fetchMineralStats.fulfilled, (state, action) => {
        state.mineralStats = action.payload;
      })

      // Fetch Mineral Types
      .addCase(fetchMineralTypes.fulfilled, (state, action) => {
        state.mineralTypes = action.payload.mineralTypes || [];
      })

      // Bulk Update Minerals
      .addCase(bulkUpdateMinerals.pending, state => {
        state.mineralLoading = true;
      })
      .addCase(bulkUpdateMinerals.fulfilled, (state, action) => {
        state.mineralLoading = false;
        const { mineralIds, updates } = action.payload;
        state.minerals = state.minerals.map(m =>
          mineralIds.includes(m._id) ? { ...m, ...updates } : m
        );
      })
      .addCase(bulkUpdateMinerals.rejected, (state, action) => {
        state.mineralLoading = false;
        state.mineralError = action.payload;
      })

      // Export Minerals
      .addCase(exportMinerals.pending, state => {
        state.mineralLoading = true;
      })
      .addCase(exportMinerals.fulfilled, (state, action) => {
        state.mineralLoading = false;
        // Export is downloaded, no state update needed
      })
      .addCase(exportMinerals.rejected, (state, action) => {
        state.mineralLoading = false;
        state.mineralError = action.payload;
      })

      // ================= ADMIN CASES =================
      .addCase(fetchProductsForAdmin.pending, state => {
        state.adminLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsForAdmin.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminProducts = action.payload.products || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchProductsForAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload;
      })

      .addCase(bulkUpdateProducts.pending, state => {
        state.adminLoading = true;
      })
      .addCase(bulkUpdateProducts.fulfilled, (state, action) => {
        state.adminLoading = false;
        const { productIds, updates } = action.payload;
        state.adminProducts = state.adminProducts.map(p =>
          productIds.includes(p._id) ? { ...p, ...updates } : p
        );
      })
      .addCase(bulkUpdateProducts.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload;
      })

      .addCase(bulkDeleteProducts.pending, state => {
        state.adminLoading = true;
      })
      .addCase(bulkDeleteProducts.fulfilled, (state, action) => {
        state.adminLoading = false;
        const { productIds } = action.payload;
        state.adminProducts = state.adminProducts.filter(
          p => !productIds.includes(p._id)
        );
        state.pagination.totalProducts -= productIds.length;
      })
      .addCase(bulkDeleteProducts.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload;
      })

      // Fetch Product Stats
      .addCase(fetchProductStats.pending, state => {
        state.statsLoading = true;
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchProductStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })

      // ================= PROPERTY REGISTRATION CASES (EXISTING) =================
      // Submit Registration
      .addCase(submitPropertyRegistration.pending, state => {
        state.isSubmitting = true;
        state.registrationError = null;
      })
      .addCase(submitPropertyRegistration.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.myRegistrations.unshift(action.payload.registration);
      })
      .addCase(submitPropertyRegistration.rejected, (state, action) => {
        state.isSubmitting = false;
        state.registrationError = action.payload;
      })

      // Fetch My Registrations
      .addCase(fetchMyRegistrations.pending, state => {
        state.registrationLoading = true;
        state.registrationError = null;
      })
      .addCase(fetchMyRegistrations.fulfilled, (state, action) => {
        state.registrationLoading = false;
        state.myRegistrations = action.payload.registrations || [];
        state.registrationPagination = action.payload.pagination || initialState.registrationPagination;
      })
      .addCase(fetchMyRegistrations.rejected, (state, action) => {
        state.registrationLoading = false;
        state.registrationError = action.payload;
      })

      // Fetch Admin Registrations (Updated)
      .addCase(fetchAdminRegistrations.pending, state => {
        state.registrationLoading = true;
        state.registrationError = null;
      })
      .addCase(fetchAdminRegistrations.fulfilled, (state, action) => {
        state.registrationLoading = false;
        state.adminRegistrations = action.payload.registrations || [];
        state.registrationStats = action.payload.stats || null;
        state.propertyOwners = action.payload.propertyOwners || [];
        state.registrationPagination = action.payload.pagination || initialState.registrationPagination;
      })
      .addCase(fetchAdminRegistrations.rejected, (state, action) => {
        state.registrationLoading = false;
        state.registrationError = action.payload;
      })

      // Fetch Company Registrations (Deprecated but supported)
      .addCase(fetchCompanyRegistrations.pending, state => {
        state.registrationLoading = true;
        state.registrationError = null;
      })
      .addCase(fetchCompanyRegistrations.fulfilled, (state, action) => {
        state.registrationLoading = false;
        state.companyRegistrations = action.payload.registrations || [];
        state.adminRegistrations = action.payload.registrations || []; // Also update admin registrations
        state.registrationStats = action.payload.stats || null;
        state.propertyOwners = action.payload.propertyOwners || [];
        state.registrationPagination = action.payload.pagination || initialState.registrationPagination;
      })
      .addCase(fetchCompanyRegistrations.rejected, (state, action) => {
        state.registrationLoading = false;
        state.registrationError = action.payload;
      })

      // Update Registration Status
      .addCase(updateRegistrationStatus.pending, state => {
        state.isSubmitting = true;
      })
      .addCase(updateRegistrationStatus.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { id, status, adminNotes } = action.payload;

        // Update in admin registrations
        const adminIndex = state.adminRegistrations.findIndex(r => r._id === id);
        if (adminIndex !== -1) {
          state.adminRegistrations[adminIndex].status = status;
          state.adminRegistrations[adminIndex].adminNotes = adminNotes;
          state.adminRegistrations[adminIndex].reviewedAt = new Date().toISOString();
        }

        // Update in company registrations (deprecated but kept for compatibility)
        const companyIndex = state.companyRegistrations.findIndex(r => r._id === id);
        if (companyIndex !== -1) {
          state.companyRegistrations[companyIndex].status = status;
          state.companyRegistrations[companyIndex].adminNotes = adminNotes;
          state.companyRegistrations[companyIndex].reviewedAt = new Date().toISOString();
        }

        // Update current registration if it matches
        if (state.currentRegistration?._id === id) {
          state.currentRegistration.status = status;
          state.currentRegistration.adminNotes = adminNotes;
          state.currentRegistration.reviewedAt = new Date().toISOString();
        }
      })
      .addCase(updateRegistrationStatus.rejected, (state, action) => {
        state.isSubmitting = false;
        state.registrationError = action.payload;
      })

      // Verify Payment
      .addCase(verifyRegistrationPayment.pending, state => {
        state.isSubmitting = true;
      })
      .addCase(verifyRegistrationPayment.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { id } = action.payload;

        // Update payment status in my registrations
        const myIndex = state.myRegistrations.findIndex(r => r._id === id);
        if (myIndex !== -1) {
          state.myRegistrations[myIndex].payment.paymentStatus = 'completed';
          state.myRegistrations[myIndex].status = 'under-review';
        }
      })
      .addCase(verifyRegistrationPayment.rejected, (state, action) => {
        state.isSubmitting = false;
        state.registrationError = action.payload;
      })

      // Fetch Registration Stats
      .addCase(fetchRegistrationStats.fulfilled, (state, action) => {
        state.registrationStats = action.payload;
      })

      // Generate Registration Certificate
      .addCase(generateRegistrationCertificate.pending, state => {
        state.isSubmitting = true;
      })
      .addCase(generateRegistrationCertificate.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Certificate is downloaded, no state update needed
      })
      .addCase(generateRegistrationCertificate.rejected, (state, action) => {
        state.isSubmitting = false;
        state.registrationError = action.payload;
      })

      // Cancel Registration
      .addCase(cancelRegistration.pending, state => {
        state.isSubmitting = true;
      })
      .addCase(cancelRegistration.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { id } = action.payload;

        // Update status to cancelled
        const myIndex = state.myRegistrations.findIndex(r => r._id === id);
        if (myIndex !== -1) {
          state.myRegistrations[myIndex].status = 'cancelled';
        }

        const adminIndex = state.adminRegistrations.findIndex(r => r._id === id);
        if (adminIndex !== -1) {
          state.adminRegistrations[adminIndex].status = 'cancelled';
        }

        const companyIndex = state.companyRegistrations.findIndex(r => r._id === id);
        if (companyIndex !== -1) {
          state.companyRegistrations[companyIndex].status = 'cancelled';
        }
      })
      .addCase(cancelRegistration.rejected, (state, action) => {
        state.isSubmitting = false;
        state.registrationError = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setMineralFilters,
  clearMineralFilters,
  setRegistrationFilters,
  clearRegistrationFilters,
  setViewMode,
  clearCurrentProduct,
  setCurrentMineral,
  clearCurrentMineral,
  setCurrentRegistration,
  clearCurrentRegistration,
  setWishlistedItems,
  updateProductInList,
  updateMineralInList,
  updateRegistrationInList,
  removeProductOptimistically,
  removeMineralOptimistically,
  removeRegistrationOptimistically,
  resetProductState,
  resetMineralState,
  resetRegistrationState,
} = productSlice.actions;

// ================= SELECTORS =================
// Basic selectors
export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectFeaturedProducts = (state) => state.products.featuredProducts;
export const selectRelatedProducts = (state) => state.products.relatedProducts;
export const selectCategories = (state) => state.products.categories;
export const selectPropertyTypes = (state) => state.products.propertyTypes;
export const selectWishlistedItems = (state) => state.products.wishlistedItems;
export const selectWishlistIds = (state) => state.products.wishlistedItems;

// Mineral selectors
export const selectMinerals = (state) => state.products.minerals;
export const selectCurrentMineral = (state) => state.products.currentMineral;
export const selectMineralTypes = (state) => state.products.mineralTypes;
export const selectMineralStats = (state) => state.products.mineralStats;
export const selectMineralLoading = (state) => state.products.mineralLoading;
export const selectMineralError = (state) => state.products.mineralError;
export const selectMineralPagination = (state) => state.products.mineralPagination;
export const selectMineralFilters = (state) => state.products.mineralFilters;

// Loading selectors
export const selectIsLoading = (state) => state.products.isLoading;
export const selectProductLoading = (state) => state.products.productLoading;
export const selectStatsLoading = (state) => state.products.statsLoading;
export const selectAdminLoading = (state) => state.products.adminLoading;
export const selectIsSubmitting = (state) => state.products.isSubmitting;
export const selectRegistrationLoading = (state) => state.products.registrationLoading;

// Error selectors
export const selectError = (state) => state.products.error;
export const selectRegistrationError = (state) => state.products.registrationError;

// Data selectors
export const selectStats = (state) => state.products.stats;
export const selectAdminProducts = (state) => state.products.adminProducts;
export const selectPagination = (state) => state.products.pagination;
export const selectFilters = (state) => state.products.filters;
export const selectViewMode = (state) => state.products.viewMode;
export const selectAggregatedFilters = (state) => state.products.aggregatedFilters;

// Registration selectors
export const selectRegistrations = (state) => state.products.registrations;
export const selectMyRegistrations = (state) => state.products.myRegistrations;
export const selectAdminRegistrations = (state) => state.products.adminRegistrations;
export const selectCompanyRegistrations = (state) => state.products.companyRegistrations; // Deprecated
export const selectCurrentRegistration = (state) => state.products.currentRegistration;
export const selectRegistrationStats = (state) => state.products.registrationStats;
export const selectPropertyOwners = (state) => state.products.propertyOwners;
export const selectRegistrationPagination = (state) => state.products.registrationPagination;
export const selectRegistrationFilters = (state) => state.products.registrationFilters;

// Computed selectors
export const selectIsWishlisted = (productId) => (state) => 
  state.products.wishlistedItems.includes(productId);

export const selectProductById = (productId) => (state) => 
  state.products.products.find(product => product._id === productId);

export const selectMineralById = (mineralId) => (state) => 
  state.products.minerals.find(mineral => mineral._id === mineralId);

export const selectFeaturedCount = (state) => state.products.featuredProducts.length;

export const selectTotalProducts = (state) => state.products.pagination.totalProducts;
export const selectTotalMinerals = (state) => state.products.mineralPagination.totalMinerals;

export const selectHasMore = (state) => state.products.pagination.hasNext;
export const selectMineralHasMore = (state) => state.products.mineralPagination.hasNext;

export const selectCurrentPage = (state) => state.products.pagination.currentPage;
export const selectMineralCurrentPage = (state) => state.products.mineralPagination.currentPage;

export const selectProductsByCategory = (category) => (state) =>
  state.products.products.filter(product => 
    product.category?.slug === category || product.category?._id === category
  );

export const selectProductsByType = (productType) => (state) =>
  state.products.products.filter(product => product.productType === productType);

export const selectMineralsByType = (mineralType) => (state) =>
  state.products.minerals.filter(mineral => mineral.mineralDetails?.mineralType === mineralType);

export const selectActiveFiltersCount = (state) => {
  const filters = state.products.filters;
  let count = 0;
  
  if (filters.search) count++;
  if (filters.category) count++;
  if (filters.subcategory) count++;
  if (filters.minPrice) count++;
  if (filters.maxPrice) count++;
  if (filters.condition) count++;
  if (filters.brand) count++;
  if (filters.productType) count++;
  if (filters.subProductType) count++;
  if (filters.listingType) count++;
  if (filters.city) count++;
  if (filters.region) count++;
  if (filters.bedrooms) count++;
  if (filters.bathrooms) count++;
  if (filters.minArea) count++;
  if (filters.maxArea) count++;
  if (filters.furnishingStatus) count++;
  if (filters.features && filters.features.length > 0) count++;
  if (filters.featured) count++;
  if (filters.promoted) count++;
  if (filters.sellerType) count++;
  if (filters.minYear) count++;
  if (filters.maxYear) count++;
  
  return count;
};

export const selectActiveMineralFiltersCount = (state) => {
  const filters = state.products.mineralFilters;
  let count = 0;
  
  if (filters.search) count++;
  if (filters.mineralType) count++;
  if (filters.qualityGrade) count++;
  if (filters.originCountry) count++;
  if (filters.region) count++;
  if (filters.status) count++;
  if (filters.minPrice) count++;
  if (filters.maxPrice) count++;
  if (filters.minPurity) count++;
  if (filters.maxPurity) count++;
  if (filters.verified) count++;
  
  return count;
};

export const selectPriceRange = (state) => ({
  min: state.products.aggregatedFilters.priceRange?.minPrice || 0,
  max: state.products.aggregatedFilters.priceRange?.maxPrice || 0,
  avg: state.products.aggregatedFilters.priceRange?.avgPrice || 0
});

export default productSlice.reducer;