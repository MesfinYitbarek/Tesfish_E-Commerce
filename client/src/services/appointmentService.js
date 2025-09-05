// services/appointmentService.js
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
      if (params.past) queryParams.append('past', params.past);

      const response = await api.get(`/appointments/my-appointments?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get admin's appointments (renamed from getSellerAppointments)
  getAdminAppointments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.date) queryParams.append('date', params.date);
      if (params.property) queryParams.append('property', params.property);
      if (params.upcoming) queryParams.append('upcoming', params.upcoming);
      if (params.propertyOwner) queryParams.append('propertyOwner', params.propertyOwner);

      const response = await api.get(`/appointments/admin-appointments?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update appointment status (admin only)
  updateAppointmentStatus: async (appointmentId, statusData) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Assign appointment to different admin
  assignAppointmentToAdmin: async (appointmentId, assignmentData) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/assign`, assignmentData);
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

  // Cancel appointment (wrapper for status update)
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

  // Confirm appointment (wrapper for status update)
  confirmAppointment: async (appointmentId, notes = '') => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/status`, {
        status: 'confirmed',
        sellerNotes: notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Complete appointment with outcome
  completeAppointment: async (appointmentId, completionData) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/status`, {
        status: 'completed',
        sellerNotes: completionData.notes,
        outcome: completionData.outcome
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark as no-show
  markNoShow: async (appointmentId, reason) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/status`, {
        status: 'no-show',
        sellerNotes: reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get appointment statistics for admin dashboard
  getAppointmentStats: async (period = '30d') => {
    try {
      const response = await api.get(`/appointments/stats?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Export appointments to CSV
  exportAppointmentsCSV: async () => {
    try {
      const response = await api.get('/appointments/export-csv', {
        responseType: 'blob'
      });
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `appointments-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get available time slots for a property (if implemented)
  getAvailableSlots: async (propertyId, date) => {
    try {
      const response = await api.get(`/appointments/available-slots?propertyId=${propertyId}&date=${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all admins for assignment
  getAvailableAdmins: async () => {
    try {
      const response = await api.get('/users/admins');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default appointmentService;