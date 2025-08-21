import axios from 'axios';
import config from '../config';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('citilights_token') || sessionStorage.getItem('citilights_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;
    
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Implement token refresh logic if available
        // const refreshResponse = await api.post('/auth/refresh');
        // const newToken = refreshResponse.data.token;
        // localStorage.setItem('citilights_token', newToken);
        // api.defaults.headers.Authorization = `Bearer ${newToken}`;
        // return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('citilights_token');
        localStorage.removeItem('citilights_remember_me');
        sessionStorage.removeItem('citilights_token');
        window.location.href = '/auth/login';
        toast.error('Session expired. Please login again.');
      }
    }
    
    if (response?.status === 401) {
      localStorage.removeItem('citilights_token');
      localStorage.removeItem('citilights_remember_me');
      sessionStorage.removeItem('citilights_token');
      window.location.href = '/auth/login';
      toast.error('Session expired. Please login again.');
    } else if (response?.status === 403) {
      toast.error('You are not authorized to perform this action.');
    } else if (response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (!response) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;