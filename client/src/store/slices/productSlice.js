import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';
import { toast } from 'react-hot-toast';

// Async thunks
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create product';
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

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getFeaturedProducts();
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

const initialState = {
  products: [],
  currentProduct: null,
  featuredProducts: [],
  relatedProducts: [],
  categories: [],
  wishlistedItems: [],
  isLoading: false,
  productLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    type: '',
    sort: 'newest',
  },
  viewMode: 'grid',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: state => {
      state.filters = initialState.filters;
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
  },
  extraReducers: builder => {
    builder
      // create products
      .addCase(createProduct.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload.product); // Add new product to beginning
      })
      .addCase(createProduct.rejected, (state, action) => {
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
      //Fetch My Products
      .addCase(fetchMyProducts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories || [];
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
} = productSlice.actions;

export default productSlice.reducer;
