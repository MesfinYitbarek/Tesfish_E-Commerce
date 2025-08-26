// services/productService.js
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

  updateProductStatus: async (id, status) => {
    const response = await api.put(`${API_ENDPOINTS.PRODUCTS.UPDATE_STATUS}/${id}/status`, { status });
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

  // New: Get property types with counts
  getPropertyTypes: async () => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}/property-types`);
    return response.data;
  },

  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}/featured?limit=${limit}`);
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
  },

  // Admin specific functions
  getProductsForAdmin: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.ADMIN}/all?${queryParams}`);
    return response.data;
  },

  getProductStats: async () => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.ADMIN}/stats`);
    return response.data;
  },

  bulkUpdateProducts: async (productIds, updates) => {
    const response = await api.patch(API_ENDPOINTS.PRODUCTS.BULK_UPDATE, {
      productIds,
      updates
    });
    return response.data;
  },

  bulkDeleteProducts: async (productIds) => {
    const response = await api.delete(API_ENDPOINTS.PRODUCTS.BULK_DELETE, {
      data: { productIds }
    });
    return response.data;
  }
};

// Property Registration Services
export const propertyRegistrationService = {
  submitRegistration: async (registrationData) => {
    const response = await api.post('/property-registrations', registrationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyRegistrations: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/property-registrations/my-registrations?${queryParams}`);
    return response.data;
  },

  getCompanyRegistrations: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/property-registrations/company-registrations?${queryParams}`);
    return response.data;
  },

  updateRegistrationStatus: async (id, status, adminNotes) => {
    const response = await api.put(`/property-registrations/${id}/status`, {
      status,
      adminNotes
    });
    return response.data;
  },

  verifyPayment: async (id, paymentData) => {
    const response = await api.post(`/property-registrations/${id}/verify-payment`, paymentData);
    return response.data;
  },

  exportRegistrationsCSV: async () => {
    const response = await api.get('/property-registrations/export-csv', {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Appointment Services
export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getMyAppointments: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/appointments/my-appointments?${queryParams}`);
    return response.data;
  },

  getSellerAppointments: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/appointments/seller-appointments?${queryParams}`);
    return response.data;
  },

  updateAppointmentStatus: async (id, status, sellerNotes, outcome) => {
    const response = await api.put(`/appointments/${id}/status`, {
      status,
      sellerNotes,
      outcome
    });
    return response.data;
  },

  rescheduleAppointment: async (id, newDateTime, reason) => {
    const response = await api.put(`/appointments/${id}/reschedule`, {
      newDateTime,
      reason
    });
    return response.data;
  }
};

// Chat Services
export const chatService = {
  startChat: async (recipientId, propertyId, initialMessage) => {
    const response = await api.post('/chats/start', {
      recipientId,
      propertyId,
      initialMessage
    });
    return response.data;
  },

  getUserChats: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/chats?${queryParams}`);
    return response.data;
  },

  getChatMessages: async (chatId, params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/chats/${chatId}/messages?${queryParams}`);
    return response.data;
  },

  sendMessage: async (chatId, messageData) => {
    const formData = new FormData();
    
    Object.keys(messageData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, messageData[key]);
      }
    });

    if (messageData.file) {
      formData.append('file', messageData.file);
    }

    const response = await api.post(`/chats/${chatId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default productService;