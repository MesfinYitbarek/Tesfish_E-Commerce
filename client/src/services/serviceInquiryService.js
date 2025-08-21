import api from './api';

const serviceInquiryService = {
  // Create a new service inquiry
  createServiceInquiry: async (inquiryData) => {
    try {
      const response = await api.post('/service-inquiries', inquiryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get customer's service inquiries
  getMyInquiries: async (filters = {}) => {
    try {
      const { page, limit, status, serviceType } = filters;
      const params = new URLSearchParams();
      
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (status) params.append('status', status);
      if (serviceType) params.append('serviceType', serviceType);
      
      const response = await api.get(`/service-inquiries/my-inquiries?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get service provider's inquiries
  getProviderInquiries: async (filters = {}) => {
    try {
      const { page, limit, status, priority, serviceType } = filters;
      const params = new URLSearchParams();
      
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);
      if (serviceType) params.append('serviceType', serviceType);
      
      const response = await api.get(`/service-inquiries/provider/inquiries?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single service inquiry
  getServiceInquiry: async (id) => {
    try {
      const response = await api.get(`/service-inquiries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update inquiry status
  updateInquiryStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/service-inquiries/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Submit quote for an inquiry
  submitQuote: async (id, quoteData) => {
    try {
      const response = await api.post(`/service-inquiries/${id}/quote`, quoteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add message to inquiry
  addMessage: async (id, messageData) => {
    try {
      const response = await api.post(`/service-inquiries/${id}/message`, messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get service inquiry statistics
  getInquiryStats: async () => {
    try {
      const response = await api.get('/service-inquiries/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default serviceInquiryService;