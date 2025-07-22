import { API_ENDPOINTS, APP_CONFIG } from '@/constants';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('citilights_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('citilights_refresh_token');
        if (refreshToken) {
          const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
            refreshToken,
          });
          
          const { token } = response.data;
          localStorage.setItem('citilights_token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('citilights_token');
        localStorage.removeItem('citilights_refresh_token');
        localStorage.removeItem('citilights_user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  // Logout user
  logout: async (token) => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      };
    }
  },

  // Verify token
  verifyToken: async (token) => {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Token verification failed',
      };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
      };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email',
      };
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password: newPassword,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
      };
    }
  },
};