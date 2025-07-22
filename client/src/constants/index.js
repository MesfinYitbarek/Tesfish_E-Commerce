// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
  },
  PROPERTIES: {
    LIST: '/properties',
    CREATE: '/properties',
    UPDATE: '/properties',
    DELETE: '/properties',
    UPLOAD_IMAGES: '/properties/images',
  },
  COMPANIES: {
    LIST: '/companies',
    CREATE: '/companies',
    UPDATE: '/companies',
    PROJECTS: '/companies/projects',
  },
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    UPDATE: '/bookings',
    CANCEL: '/bookings/cancel',
  },
  PAYMENTS: {
    CREATE_INTENT: '/payments/create-intent',
    CONFIRM: '/payments/confirm',
    TELEBIRR: '/payments/telebirr',
  },
  SERVICES: {
    LIST: '/services',
    REQUEST_QUOTE: '/services/quote',
  },
};

// User Types
export const USER_TYPES = {
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
  ADMIN: 'admin',
};

// Property Types
export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  VILLA: 'villa',
  HOUSE: 'house',
  LAND: 'land',
  OFFICE: 'office',
  COMMERCIAL: 'commercial',
};

// Property Status
export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RESERVED: 'reserved',
  DRAFT: 'draft',
};

// Payment Methods
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  TELEBIRR: 'telebirr',
  MOBILE_TRANSFER: 'mobile_transfer',
};

// Service Types
export const SERVICE_TYPES = {
  PROJECT_MANAGEMENT: 'project_management',
  ENGINEERING_DESIGN: 'engineering_design',
  INTERIOR_DESIGN: 'interior_design',
  REAL_ESTATE_CONSULTANCY: 'real_estate_consultancy',
};

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'CitiLights',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  UPLOAD_URL: import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000/uploads',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
};

// Feature Flags
export const FEATURES = {
  CHAT: import.meta.env.VITE_ENABLE_CHAT === 'true',
  PAYMENTS: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
  NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  FILE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'citilights_token',
  REFRESH_TOKEN: 'citilights_refresh_token',
  USER: 'citilights_user',
  THEME: 'citilights_theme',
  LANGUAGE: 'citilights_language',
};