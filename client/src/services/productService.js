import api from './api';
import { API_ENDPOINTS } from '../constants';

const productService = {
  createProduct: async (productData) => {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (key !== 'images' && key !== 'media') {
        if (typeof productData[key] === 'object') {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });

    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }

    const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (key !== 'images' && key !== 'media') {
        if (typeof productData[key] === 'object') {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });

    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }

    const response = await api.put(`${API_ENDPOINTS.PRODUCTS.UPDATE}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        if (Array.isArray(params[key])) {
          params[key].forEach(value => queryParams.append(key, value));
        } else {
          queryParams.append(key, params[key]);
        }
      }
    });

    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?${queryParams}`);
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.DETAIL}/${id}`);
    return response.data;
  },

  getMyProducts: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.MY_PRODUCTS}?${queryParams}`);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`${API_ENDPOINTS.PRODUCTS.DELETE}/${id}`);
    return response.data;
  },

  toggleProductStatus: async (id) => {
    const response = await api.patch(`${API_ENDPOINTS.PRODUCTS.TOGGLE_STATUS}/${id}`);
    return response.data;
  },

  searchProducts: async (query, filters = {}) => {
    const params = { search: query, ...filters };
    return productService.getProducts(params);
  },

  getCategories: async () => {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
    return response.data;
  },

  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.FEATURED}?limit=${limit}`);
    return response.data;
  },

  toggleWishlist: async (productId) => {
    const response = await api.post(`${API_ENDPOINTS.USERS.WISHLIST}/${productId}`);
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.WISHLIST);
    return response.data;
  },

  getRelatedProducts: async (productId, limit = 4) => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.RELATED}/${productId}?limit=${limit}`);
    return response.data;
  },

  getProductReviews: async (productId, params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.REVIEWS.LIST}/${productId}?${queryParams}`);
    return response.data;
  },

  submitReview: async (productId, reviewData) => {
    const response = await api.post(API_ENDPOINTS.REVIEWS.CREATE, { 
      ...reviewData, 
      product: productId 
    });
    return response.data;
  },

  incrementViews: async (productId) => {
    const response = await api.post(`${API_ENDPOINTS.PRODUCTS.INCREMENT_VIEWS}/${productId}`);
    return response.data;
  },

  reportProduct: async (productId, reason, description) => {
    const response = await api.post(`${API_ENDPOINTS.PRODUCTS.REPORT}/${productId}`, {
      reason,
      description
    });
    return response.data;
  }
};

export default productService;