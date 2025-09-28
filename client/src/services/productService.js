// services/productService.js
import api from './api';
import { API_ENDPOINTS } from '../constants';

const productService = {
  createProduct: async (productData) => {
    const formData = new FormData();
    
    // Extract files from media
    const imageFiles = [];
    const videoFiles = [];
    const documentFiles = [];
    
    // Process media files
    if (productData.media) {
      if (productData.media.images) {
        productData.media.images.forEach((image, index) => {
          if (image.file instanceof File) {
            imageFiles.push(image.file);
            // Keep metadata for processing
            formData.append(`imageMetadata[${index}]`, JSON.stringify({
              alt: image.alt || '',
              caption: image.caption || '',
              isMain: image.isMain || false,
              tags: image.tags || []
            }));
          }
        });
      }
      
      if (productData.media.videos) {
        productData.media.videos.forEach((video) => {
          if (video.file instanceof File) {
            videoFiles.push(video.file);
          }
        });
      }
      
      if (productData.media.documents) {
        productData.media.documents.forEach((doc) => {
          if (doc.file instanceof File) {
            documentFiles.push(doc.file);
          }
        });
      }
    }
    
    // Clean media object for JSON serialization (remove file objects)
    const cleanedProductData = { ...productData };
    if (cleanedProductData.media) {
      cleanedProductData.media = {
        virtualTour: cleanedProductData.media.virtualTour || '',
        // Remove file arrays as they'll be processed separately
        images: undefined,
        videos: undefined,
        documents: undefined,
      };
    }
    
    // Append other product data as JSON (excluding media with files)
    Object.keys(cleanedProductData).forEach(key => {
      if (key !== 'media') {
        if (typeof cleanedProductData[key] === 'object' && cleanedProductData[key] !== null) {
          formData.append(key, JSON.stringify(cleanedProductData[key]));
        } else if (cleanedProductData[key] !== null && cleanedProductData[key] !== undefined) {
          formData.append(key, cleanedProductData[key]);
        }
      }
    });
    
    // Append cleaned media object (without file references)
    if (cleanedProductData.media) {
      formData.append('media', JSON.stringify(cleanedProductData.media));
    }
    
    // Append actual files with correct field names expected by multer
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    
    videoFiles.forEach((file) => {
      formData.append('videos', file);
    });
    
    documentFiles.forEach((file) => {
      formData.append('documents', file);
    });

    // Debug logging
    console.log('FormData summary:', {
      imageFiles: imageFiles.length,
      videoFiles: videoFiles.length,
      documentFiles: documentFiles.length,
      hasMedia: !!cleanedProductData.media
    });

    const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const formData = new FormData();
    
    // Extract files from media
    const imageFiles = [];
    const videoFiles = [];
    const documentFiles = [];
    
    // Process media files
    if (productData.media) {
      if (productData.media.images) {
        productData.media.images.forEach((image, index) => {
          if (image.file instanceof File) {
            imageFiles.push(image.file);
            // Keep metadata for processing
            formData.append(`imageMetadata[${index}]`, JSON.stringify({
              alt: image.alt || '',
              caption: image.caption || '',
              isMain: image.isMain || false,
              tags: image.tags || []
            }));
          }
        });
      }
      
      if (productData.media.videos) {
        productData.media.videos.forEach((video) => {
          if (video.file instanceof File) {
            videoFiles.push(video.file);
          }
        });
      }
      
      if (productData.media.documents) {
        productData.media.documents.forEach((doc) => {
          if (doc.file instanceof File) {
            documentFiles.push(doc.file);
          }
        });
      }
    }
    
    // Clean media object for JSON serialization (remove file objects)
    const cleanedProductData = { ...productData };
    if (cleanedProductData.media) {
      cleanedProductData.media = {
        virtualTour: cleanedProductData.media.virtualTour || '',
        // Keep existing media that's not being updated
        images: cleanedProductData.media.images?.filter(img => !img.file) || [],
        videos: cleanedProductData.media.videos?.filter(vid => !vid.file) || [],
        documents: cleanedProductData.media.documents?.filter(doc => !doc.file) || [],
      };
    }
    
    // Append other product data as JSON (excluding media with files)
    Object.keys(cleanedProductData).forEach(key => {
      if (key !== 'media') {
        if (typeof cleanedProductData[key] === 'object' && cleanedProductData[key] !== null) {
          formData.append(key, JSON.stringify(cleanedProductData[key]));
        } else if (cleanedProductData[key] !== null && cleanedProductData[key] !== undefined) {
          formData.append(key, cleanedProductData[key]);
        }
      }
    });
    
    // Append cleaned media object
    if (cleanedProductData.media) {
      formData.append('media', JSON.stringify(cleanedProductData.media));
    }
    
    // Append actual files with correct field names expected by multer
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    
    videoFiles.forEach((file) => {
      formData.append('videos', file);
    });
    
    documentFiles.forEach((file) => {
      formData.append('documents', file);
    });

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

  getPropertyTypes: async () => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}/property-types`);
    return response.data;
  },

  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}/featured?limit=${limit}`);
    return response.data;
  },

  // ================= MINERAL MANAGEMENT SERVICES =================
  
  // Get all minerals for admin
  getMineralsForAdmin: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.ADMIN.MINERALS.LIST}?${queryParams}`);
    return response.data;
  },

  // Create new mineral (admin only)
  createMineral: async (mineralData) => {
    const formData = new FormData();
    
    // Extract files from media
    const imageFiles = [];
    
    if (mineralData.media?.images) {
      mineralData.media.images.forEach((image, index) => {
        if (image.file instanceof File) {
          imageFiles.push(image.file);
          formData.append(`imageMetadata[${index}]`, JSON.stringify({
            alt: image.alt || '',
            caption: image.caption || '',
            isMain: image.isMain || false,
            tags: image.tags || []
          }));
        }
      });
    }
    
    // Clean media object for JSON serialization
    const cleanedMineralData = { ...mineralData };
    if (cleanedMineralData.media) {
      cleanedMineralData.media = {
        virtualTour: cleanedMineralData.media.virtualTour || '',
        images: undefined,
      };
    }
    
    // Append mineral data as JSON
    Object.keys(cleanedMineralData).forEach(key => {
      if (key !== 'media') {
        if (typeof cleanedMineralData[key] === 'object' && cleanedMineralData[key] !== null) {
          formData.append(key, JSON.stringify(cleanedMineralData[key]));
        } else if (cleanedMineralData[key] !== null && cleanedMineralData[key] !== undefined) {
          formData.append(key, cleanedMineralData[key]);
        }
      }
    });
    
    // Append cleaned media object
    if (cleanedMineralData.media) {
      formData.append('media', JSON.stringify(cleanedMineralData.media));
    }
    
    // Append image files
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post(API_ENDPOINTS.ADMIN.MINERALS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update mineral (admin only)
  updateMineral: async (id, mineralData) => {
    const formData = new FormData();
    
    // Extract files from media
    const imageFiles = [];
    
    if (mineralData.media?.images) {
      mineralData.media.images.forEach((image, index) => {
        if (image.file instanceof File) {
          imageFiles.push(image.file);
          formData.append(`imageMetadata[${index}]`, JSON.stringify({
            alt: image.alt || '',
            caption: image.caption || '',
            isMain: image.isMain || false,
            tags: image.tags || []
          }));
        }
      });
    }
    
    // Clean media object for JSON serialization
    const cleanedMineralData = { ...mineralData };
    if (cleanedMineralData.media) {
      cleanedMineralData.media = {
        virtualTour: cleanedMineralData.media.virtualTour || '',
        images: cleanedMineralData.media.images?.filter(img => !img.file) || [],
      };
    }
    
    // Append mineral data as JSON
    Object.keys(cleanedMineralData).forEach(key => {
      if (key !== 'media') {
        if (typeof cleanedMineralData[key] === 'object' && cleanedMineralData[key] !== null) {
          formData.append(key, JSON.stringify(cleanedMineralData[key]));
        } else if (cleanedMineralData[key] !== null && cleanedMineralData[key] !== undefined) {
          formData.append(key, cleanedMineralData[key]);
        }
      }
    });
    
    // Append cleaned media object
    if (cleanedMineralData.media) {
      formData.append('media', JSON.stringify(cleanedMineralData.media));
    }
    
    // Append image files
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.put(`${API_ENDPOINTS.ADMIN.MINERALS.UPDATE}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get mineral by ID (admin only)
  getMineralById: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.ADMIN.MINERALS.DETAIL}/${id}`);
    return response.data;
  },

  // Delete mineral (admin only)
  deleteMineral: async (id) => {
    const response = await api.delete(`${API_ENDPOINTS.ADMIN.MINERALS.DELETE}/${id}`);
    return response.data;
  },

  // Update mineral status (admin only)
  updateMineralStatus: async (id, status) => {
    const response = await api.put(`${API_ENDPOINTS.ADMIN.MINERALS.UPDATE_STATUS}/${id}/status`, { status });
    return response.data;
  },

  // Get mineral statistics (admin only)
  getMineralStats: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.MINERALS.STATS);
    return response.data;
  },

  // Get mineral types (admin only)
  getMineralTypes: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.MINERALS.TYPES);
    return response.data;
  },

  // Bulk update minerals (admin only)
  bulkUpdateMinerals: async (mineralIds, updates) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.MINERALS.BULK_UPDATE, {
      mineralIds,
      updateData: updates
    });
    return response.data;
  },

  // Export minerals (admin only)
  exportMinerals: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.post(`${API_ENDPOINTS.ADMIN.MINERALS.EXPORT}?${queryParams}`, {
      format: 'csv',
      filters: params
    }, {
      responseType: 'blob'
    });
    return response.data;
  },

  // ================= WISHLIST FUNCTIONS =================
  
  fetchWishlist: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.WISHLIST);
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.WISHLIST);
    return response.data;
  },

  toggleWishlist: async (productId) => {
    const response = await api.post(`${API_ENDPOINTS.USERS.WISHLIST}/${productId}`);
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await api.post(`${API_ENDPOINTS.USERS.WISHLIST}/${productId}`);
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await api.post(`${API_ENDPOINTS.USERS.WISHLIST}/${productId}`);
    return response.data;
  },

  isInWishlist: async (productId) => {
    try {
      const wishlist = await productService.fetchWishlist();
      return wishlist.wishlist.some(item => item._id === productId);
    } catch (error) {
      return false;
    }
  },

  // ================= OTHER PRODUCT FUNCTIONS =================

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

  // ================= PRODUCT COMPARISON =================
  
  compareProducts: async (productIds) => {
    const response = await api.post(`${API_ENDPOINTS.PRODUCTS.COMPARE}`, { productIds });
    return response.data;
  },

  // ================= PRODUCT SHARING =================
  
  shareProduct: async (productId, shareData) => {
    const response = await api.post(`${API_ENDPOINTS.PRODUCTS.SHARE}/${productId}`, shareData);
    return response.data;
  },

  // ================= ADMIN SPECIFIC FUNCTIONS =================

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
  },

  // ================= EXPORT FUNCTIONS =================
  
  exportProductsCSV: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.EXPORT}?${queryParams}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// ================= USER SERVICES =================
export const userService = {
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.PROFILE);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      if (key !== 'profileImage') {
        if (typeof profileData[key] === 'object') {
          formData.append(key, JSON.stringify(profileData[key]));
        } else {
          formData.append(key, profileData[key]);
        }
      }
    });

    if (profileData.profileImage instanceof File) {
      formData.append('profileImage', profileData.profileImage);
    }

    const response = await api.put(API_ENDPOINTS.USERS.PROFILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`${API_ENDPOINTS.USERS.DETAIL}/${userId}`);
    return response.data;
  },

  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.USERS.LIST}?${queryParams}`);
    return response.data;
  },

  exportUsers: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.EXPORT, {
      responseType: 'blob'
    });
    return response.data;
  },

  updateNotificationSettings: async (settings) => {
    const response = await api.put(API_ENDPOINTS.USERS.NOTIFICATION_SETTINGS, settings);
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.put(API_ENDPOINTS.USERS.PREFERENCES, preferences);
    return response.data;
  },

  deactivateAccount: async (reason) => {
    const response = await api.post(API_ENDPOINTS.USERS.DEACTIVATE, { reason });
    return response.data;
  },

  downloadUserData: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.DOWNLOAD_DATA, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Property Registration Services (Updated for Admin Management)
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

  // Updated: Renamed from getCompanyRegistrations to getAdminRegistrations
  getAdminRegistrations: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.ADMIN_REGISTRATIONS}?${queryParams}`);
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

  exportRegistrationsCSV: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.EXPORT_CSV}?${queryParams}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  getRegistrationStats: async (period = '30d') => {
    const response = await api.get(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.STATS}?period=${period}`);
    return response.data;
  },

  // New: Generate registration certificate
  generateCertificate: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.PROPERTY_REGISTRATIONS.CERTIFICATE}/${id}/certificate`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Deprecated: Keep for backward compatibility but mark as deprecated
  getCompanyRegistrations: async (params = {}) => {
    console.warn('getCompanyRegistrations is deprecated. Use getAdminRegistrations instead.');
    return propertyRegistrationService.getAdminRegistrations(params);
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

// Appointment Services (Updated for Admin Management)
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

  // Updated: Renamed from getSellerAppointments to getAdminAppointments
  getAdminAppointments: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.APPOINTMENTS.ADMIN_APPOINTMENTS}?${queryParams}`);
    return response.data;
  },

  updateAppointmentStatus: async (id, statusData) => {
    const response = await api.put(`${API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS.replace(':id', id)}`, statusData);
    return response.data;
  },

  // New: Assign appointment to different admin
  assignAppointmentToAdmin: async (id, assignmentData) => {
    const response = await api.put(`${API_ENDPOINTS.APPOINTMENTS.ASSIGN.replace(':id', id)}`, assignmentData);
    return response.data;
  },

  // New: Confirm appointment
  confirmAppointment: async (id, notes = '') => {
    const response = await api.put(`${API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS.replace(':id', id)}`, {
      status: 'confirmed',
      sellerNotes: notes
    });
    return response.data;
  },

  // New: Cancel appointment
  cancelAppointment: async (id, reason) => {
    const response = await api.put(`${API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS.replace(':id', id)}`, {
      status: 'cancelled',
      sellerNotes: reason
    });
    return response.data;
  },

  // New: Complete appointment
  completeAppointment: async (id, completionData) => {
    const response = await api.put(`${API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS.replace(':id', id)}`, {
      status: 'completed',
      sellerNotes: completionData.notes,
      outcome: completionData.outcome
    });
    return response.data;
  },

  // New: Mark as no-show
  markNoShow: async (id, reason) => {
    const response = await api.put(`${API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS.replace(':id', id)}`, {
      status: 'no-show',
      sellerNotes: reason
    });
    return response.data;
  },

  rescheduleAppointment: async (id, rescheduleData) => {
    const response = await api.put(`${API_ENDPOINTS.APPOINTMENTS.RESCHEDULE.replace(':id', id)}`, rescheduleData);
    return response.data;
  },

  getAvailableSlots: async (propertyId, date) => {
    const response = await api.get(`${API_ENDPOINTS.APPOINTMENTS.AVAILABLE_SLOTS}?propertyId=${propertyId}&date=${date}`);
    return response.data;
  },

  getAppointmentStats: async (period = '30d') => {
    const response = await api.get(`${API_ENDPOINTS.APPOINTMENTS.STATS}?period=${period}`);
    return response.data;
  },

  // New: Export appointments CSV
  exportAppointmentsCSV: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${API_ENDPOINTS.APPOINTMENTS.EXPORT_CSV}?${queryParams}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // New: Get available admins for assignment
  getAvailableAdmins: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.ADMINS);
    return response.data;
  },

  // Deprecated: Keep for backward compatibility but mark as deprecated
  getSellerAppointments: async (params = {}) => {
    console.warn('getSellerAppointments is deprecated. Use getAdminAppointments instead.');
    return appointmentService.getAdminAppointments(params);
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