const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // App Configuration
  APP_NAME: 'CitiLights',
  APP_VERSION: '1.0.0',
  
  // Authentication
  JWT_TOKEN_KEY: 'citilights_token',
  REFRESH_TOKEN_KEY: 'citilights_refresh_token',
  
  // Socket.IO
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  
  // Payment
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  
  // Map
  MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_TOKEN,
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  
  // Cache
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  
  // Feature Flags
  FEATURES: {
    CHAT: true,
    NOTIFICATIONS: true,
    DARK_MODE: true,
    PWA: true,
  }
};

export default config;