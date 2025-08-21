import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants';

import toast from 'react-hot-toast';
import authService from '../services/authService';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user && token);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (savedToken && savedUser) {
          const userData = JSON.parse(savedUser);
          
          // Verify token is still valid
          try {
            const response = await authService.verifyToken(savedToken);
            if (response.success) {
              setToken(savedToken);
              setUser(userData);
            } else {
              // Token is invalid, clear storage
              clearAuthData();
            }
          } catch (error) {
            // Token verification failed, clear storage
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setToken(null);
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success) {
        const { user: userData, token: authToken, refreshToken } = response.data;
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        if (refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }
        
        // Update state
        setUser(userData);
        setToken(authToken);
        
        toast.success('Login successful!');
        return { success: true, data: userData };
      } else {
        toast.error(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        const { user: newUser, token: authToken, refreshToken } = response.data;
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
        if (refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }
        
        // Update state
        setUser(newUser);
        setToken(authToken);
        
        toast.success('Registration successful! Welcome to CitiLights!');
        return { success: true, data: newUser };
      } else {
        toast.error(response.message || 'Registration failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if token exists
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Clear all auth data
      clearAuthData();
      toast.success('Logged out successfully');
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await authService.updateProfile(updatedData);
      
      if (response.success) {
        const updatedUser = { ...user, ...response.data };
        
        // Update localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        
        // Update state
        setUser(updatedUser);
        
        toast.success('Profile updated successfully!');
        return { success: true, data: updatedUser };
      } else {
        toast.error(response.message || 'Update failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};