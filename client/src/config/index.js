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

export const DAYS_OF_WEEK = [
  { label: "Monday", value: "monday", short: "Mon" },
  { label: "Tuesday", value: "tuesday", short: "Tue" },
  { label: "Wednesday", value: "wednesday", short: "Wed" },
  { label: "Thursday", value: "thursday", short: "Thu" },
  { label: "Friday", value: "friday", short: "Fri" },
  { label: "Saturday", value: "saturday", short: "Sat" },
  { label: "Sunday", value: "sunday", short: "Sun" }
];
export const ETHIOPIAN_CITIES = [
  "Addis Ababa",
  "Dire Dawa",
  "Mekelle",
  "Gondar",
  "Bahir Dar",
  "Hawassa",
  "Jimma",
  "Adama",
  "Arba Minch",
  "Debre Markos",
  "Debre Birhan",
  "Asella",
  "Dessie",
  "Harar",
  "Jijiga",
  "Shashamane",
  "Wolaita Sodo",
  "Bishoftu",
  "Nekemte",
  "Debre Tabor"
];
export const ADDIS_ABABA_SUBCITIES = [
  'Bole', 'Yeka', 'Kirkos', 'Arada', 'Addis Ketema', 'Lideta',
  'Kolfe Keranio', 'Gulele', 'Nifas Silk-Lafto', 'Akaky Kaliti'
];
export const TIME_SLOTS = [
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' }
];

export const AREA_UNITS = [
  { value: 'sqm', label: 'Square Meters (m²)' },
  { value: 'sqft', label: 'Square Feet (ft²)' },
  { value: 'hectare', label: 'Hectares' },
  { value: 'acre', label: 'Acres' }
];

export const CURRENCIES = [
  { value: 'ETB', label: 'Ethiopian Birr (ETB)', symbol: 'Br' },
  { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' }
];

// Default values
export const DEFAULT_CURRENCY = 'ETB';
export const DEFAULT_AREA_UNIT = 'sqm';
export const DEFAULT_CONTACT_METHOD = 'phone';

// Validation constants
export const MIN_TITLE_LENGTH = 10;
export const MAX_TITLE_LENGTH = 100;
export const MIN_DESCRIPTION_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_IMAGES = 20;
export const MAX_VIDEOS = 5;
export const MAX_DOCUMENTS = 10;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Application constants
export const APP_NAME = 'EthioMarket';
export const APP_VERSION = '1.0.0';
export const SUPPORT_EMAIL = 'support@ethiomarket.com';
export const SUPPORT_PHONE = '+251911123456';
export default config;