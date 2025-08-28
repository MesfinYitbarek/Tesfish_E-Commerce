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
    const response = await api.post(API_ENDPOINTS.PROPERTY_REGISTRATIONS.CREATE, registrationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyRegistrations: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.MY_REGISTRATIONS}?${queryParams}`);
    return response.data;
  },

  getCompanyRegistrations: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.COMPANY_REGISTRATIONS}?${queryParams}`);
    return response.data;
  },

  getRegistrationById: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.DETAIL}/${id}`);
    return response.data;
  },

  updateRegistrationStatus: async (id, status, adminNotes) => {
    const response = await api.put(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.UPDATE_STATUS}/${id}/status`, {
      status,
      adminNotes
    });
    return response.data;
  },

  verifyPayment: async (id, paymentData) => {
    const response = await api.post(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.VERIFY_PAYMENT}/${id}/verify-payment`, paymentData);
    return response.data;
  },

  exportRegistrationsCSV: async () => {
    const response = await api.get(API_ENDPOINTS.PROPERTY_REGISTRATIONS.EXPORT_CSV, {
      responseType: 'blob'
    });
    return response.data;
  },

  getRegistrationStats: async () => {
    const response = await api.get(API_ENDPOINTS.PROPERTY_REGISTRATIONS.STATS);
    return response.data;
  },

  cancelRegistration: async (id, reason) => {
    const response = await api.put(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.CANCEL}/${id}/cancel`, {
      reason
    });
    return response.data;
  },

  downloadReceipt: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.RECEIPT}/${id}/receipt`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Appointment Services
export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    const response = await api.post(API_ENDPOINTS.APPOINTMENTS.CREATE, appointmentData);
    return response.data;
  },

  getMyAppointments: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.APPOINTMENTS.MY_APPOINTMENTS}?${queryParams}`);
    return response.data;
  },

  getSellerAppointments: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.APPOINTMENTS.SELLER_APPOINTMENTS}?${queryParams}`);
    return response.data;
  },

  updateAppointmentStatus: async (id, status, sellerNotes, outcome) => {
    const response = await api.put(`${API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS.replace(':id', id)}`, {
      status,
      sellerNotes,
      outcome
    });
    return response.data;
  },

  rescheduleAppointment: async (id, newDateTime, reason) => {
    const response = await api.put(`${API_ENDPOINTS.APPOINTMENTS.RESCHEDULE.replace(':id', id)}`, {
      newDateTime,
      reason
    });
    return response.data;
  },

  getAvailableSlots: async (propertyId, date) => {
    const response = await api.get(`${API_ENDPOINTS.APPOINTMENTS.AVAILABLE_SLOTS}?propertyId=${propertyId}&date=${date}`);
    return response.data;
  },

  getAppointmentStats: async () => {
    const response = await api.get(API_ENDPOINTS.APPOINTMENTS.STATS);
    return response.data;
  }
};

// Chat Services
export const chatService = {
  startChat: async (recipientId, propertyId, initialMessage) => {
    const response = await api.post(`${API_ENDPOINTS.CHAT.CREATE}/start`, {
      recipientId,
      propertyId,
      initialMessage
    });
    return response.data;
  },

  getUserChats: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.CHAT.LIST}?${queryParams}`);
    return response.data;
  },

  getChatMessages: async (chatId, params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.CHAT.DETAIL}/${chatId}/messages?${queryParams}`);
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

    const response = await api.post(`${API_ENDPOINTS.CHAT.SEND_MESSAGE.replace(':id', chatId)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default productService;