import api from './api';

const serviceInquiryService = {
  // Create new service inquiry
  createInquiry: (inquiryData) => {
    return api.post('/service-inquiries', inquiryData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Get customer's inquiries
  getMyInquiries: (params) => {
    return api.get('/service-inquiries/my-inquiries', { params });
  },

  // Get provider's inquiries (Admin only)
  getProviderInquiries: (params) => {
    return api.get('/service-inquiries/provider/inquiries', { params });
  },

  // Get single inquiry
  getInquiry: (inquiryId) => {
    return api.get(`/service-inquiries/${inquiryId}`);
  },

  // Update inquiry status
  updateStatus: (inquiryId, data) => {
    return api.put(`/service-inquiries/${inquiryId}/status`, data);
  },

  // Submit quote
  submitQuote: (inquiryId, quoteData) => {
    return api.post(`/service-inquiries/${inquiryId}/quote`, quoteData);
  },

  // Respond to quote
  respondToQuote: (inquiryId, quoteId, data) => {
    return api.put(`/service-inquiries/${inquiryId}/quotes/${quoteId}/respond`, data);
  },

  // Add message
  addMessage: (inquiryId, data) => {
    return api.post(`/service-inquiries/${inquiryId}/message`, data);
  },

  // Schedule consultation
  scheduleConsultation: (inquiryId, data) => {
    return api.post(`/service-inquiries/${inquiryId}/consultation`, data);
  },

  // Get statistics (Admin only)
  getStats: (period) => {
    return api.get('/service-inquiries/provider/stats', { params: { period } });
  }
};

export default serviceInquiryService;