// store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';
import { toast } from 'react-hot-toast';

// Async thunks
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
const initialState = {
  products: [],
  currentProduct: null,
  featuredProducts: [],
  relatedProducts: [],
  categories: [],
  propertyTypes: [],
  wishlistedItems: [],
  stats: null,
  adminLoading: false,   // NEW: for admin actions
  adminProducts: [], 
  isLoading: false,
  productLoading: false,
  statsLoading: false,
  error: null,
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
  viewMode: 'grid',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset page when filters change (except for page change itself)
      if (!action.payload.page) {
        state.filters.page = 1;
      }
    },
    clearFilters: state => {
      state.filters = {
        ...initialState.filters,
        sort: state.filters.sort, // Keep sort preference
        limit: state.filters.limit, // Keep limit preference
      };
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    clearCurrentProduct: state => {
      state.currentProduct = null;
      state.relatedProducts = [];
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
    removeProductOptimistically: (state, action) => {
      state.products = state.products.filter(
        product => product._id !== action.payload
      );
      if (state.pagination.totalProducts > 0) {
        state.pagination.totalProducts -= 1;
      }
    },
    resetProductState: (state) => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
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
      });
  },
});


export const {
  setFilters,
  clearFilters,
  setViewMode,
  clearCurrentProduct,
  setWishlistedItems,
  updateProductInList,
  removeProductOptimistically,
  resetProductState,
} = productSlice.actions;

export default productSlice.reducer;