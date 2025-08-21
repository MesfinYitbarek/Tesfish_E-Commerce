import api from './api';
import { API_ENDPOINTS } from '../constants';

const authService = {
  // Login
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profileData);
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}/${token}`);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, { password });
    return response.data;
  },
};

export default authService;