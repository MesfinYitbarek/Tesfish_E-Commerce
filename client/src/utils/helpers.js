import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export const formatCurrency = (amount, currency = 'ETB') => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
// Format date
export const formatDate = (date, options = {}) => {
  if (!date || isNaN(new Date(date))) return 'Date not available';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  try {
    return new Intl.DateTimeFormat('en-ET', { ...defaultOptions, ...options }).format(new Date(date));
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Date not available';
  }
};

// formatRelativeTime with validation
export const formatRelativeTime = (date) => {
  if (!date || isNaN(new Date(date))) return 'some time ago';
  
  try {
    const now = new Date();
    const dateObj = new Date(date);
    const diff = now - dateObj;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    
    return formatDate(date);
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return 'some time ago';
  }
};

// Truncate text
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Generate avatar URL or initials
export const getAvatarUrl = (user) => {
  if (user?.avatar) return user.avatar;
  if (user?.companyProfile?.logo) return user.companyProfile.logo;
  if (user?.individualProfile?.avatar) return user.individualProfile.avatar;
  if (user?.customerProfile?.avatar) return user.customerProfile.avatar;
  return null;
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone (Ethiopian format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+251|0)?[97]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};