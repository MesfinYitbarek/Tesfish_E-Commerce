import api from './api';

const appointmentService = {
  // Book a new appointment
  bookAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get customer's appointments
  getMyAppointments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.upcoming) queryParams.append('upcoming', params.upcoming);

      const response = await api.get(`/appointments/my-appointments?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get seller's appointments
  getSellerAppointments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.date) queryParams.append('date', params.date);
      if (params.property) queryParams.append('property', params.property);

      const response = await api.get(`/appointments/seller-appointments?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update appointment status (seller only)
  updateAppointmentStatus: async (appointmentId, statusData) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reschedule appointment
  rescheduleAppointment: async (appointmentId, rescheduleData) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/reschedule`, rescheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get appointment details
  getAppointmentDetails: async (appointmentId) => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId, reason) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/status`, {
        status: 'cancelled',
        sellerNotes: reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get available time slots for a property
  getAvailableSlots: async (propertyId, date) => {
    try {
      const response = await api.get(`/appointments/available-slots?propertyId=${propertyId}&date=${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get appointment statistics for seller dashboard
  getAppointmentStats: async (period = '30d') => {
    try {
      const response = await api.get(`/appointments/stats?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default appointmentService;