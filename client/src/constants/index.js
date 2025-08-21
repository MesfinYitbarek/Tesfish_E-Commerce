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
  CART: 'citilights_cart',
};

// Payment Methods
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  TELEBIRR: 'telebirr',
  MOBILE_TRANSFER: 'mobile_transfer',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
};

// Coupon Types
export const COUPON_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  FREE_SHIPPING: 'free_shipping',
  BUNDLE_DISCOUNT: 'bundle_discount',
  BOGO: 'buy_one_get_one',
  CATEGORY_DISCOUNT: 'category_discount',
};

// Cart Item Status
export const CART_ITEM_STATUS = {
  AVAILABLE: 'available',
  OUT_OF_STOCK: 'out_of_stock',
  LIMITED_STOCK: 'limited_stock',
  DISCONTINUED: 'discontinued',
  BACKORDER: 'backorder',
};

// Shipping Methods
export const SHIPPING_METHODS = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  OVERNIGHT: 'overnight',
  PICKUP: 'pickup',
  DIGITAL_DELIVERY: 'digital_delivery',
  NO_SHIPPING: 'no_shipping',
};

// User Types
export const USER_TYPES = {
  CUSTOMER: 'customer',
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
  ADMIN: 'admin'
};

// Product Types
export const PRODUCT_TYPES = {
  PHYSICAL: 'physical',
  DIGITAL: 'digital',
  SERVICE: 'service',
  REAL_ESTATE: 'real-estate',
  RENTAL: 'rental'
};

// Property Types
export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  VILLA: 'villa',
  COMMERCIAL: 'commercial',
  LAND: 'land',
  OFFICE: 'office',
  WAREHOUSE: 'warehouse'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially-refunded'
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show'
};

// Service Types
export const SERVICE_TYPES = {
  PROJECT_MANAGEMENT: 'project-management',
  ENGINEERING_DESIGN: 'engineering-design',
  INTERIOR_DESIGN: 'interior-design',
  CONSULTANCY: 'consultancy',
  OTHER: 'other'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  BOOKING: 'booking',
  CHAT: 'chat',
  REVIEW: 'review',
  SYSTEM: 'system',
  PROMOTION: 'promotion'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PROFILE: '/profile',
  CHAT: '/chat',
  BOOKINGS: '/bookings',
  SERVICES: '/services',
  ADMIN: '/admin'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile'
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products',
    CREATE: '/products',
    UPDATE: '/products',
    DELETE: '/products',
    MY_PRODUCTS: '/products/seller/my-products'
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: '/orders',
    MY_ORDERS: '/orders/my-orders',
    SELLER_ORDERS: '/orders/seller/orders'
  },
  CART: {
    GET: '/orders/cart',
    ADD: '/orders/cart/add',
    UPDATE: '/orders/cart/update',
    REMOVE: '/orders/cart/remove',
    CLEAR: '/orders/cart/clear',
    APPLY_COUPON: '/orders/cart/coupon',
    REMOVE_COUPON: '/orders/cart/coupon',
    SAVE_FOR_LATER: '/orders/cart/save-for-later',
    MOVE_TO_CART: '/orders/cart/move-to-cart',
    VALIDATE_COUPON: '/orders/cart/validate-coupon',
    GET_COUPONS: '/orders/cart/coupons',
    CHECK_INVENTORY: '/orders/cart/check-inventory',
    CALCULATE_SHIPPING: '/orders/cart/calculate-shipping'
  },
  CHAT: {
    LIST: '/chat',
    DETAIL: '/chat',
    CREATE: '/chat/create',
    SEND_MESSAGE: '/chat/:id/message'
  },
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
    SELLER_BOOKINGS: '/bookings/seller/bookings',
    AVAILABLE_SLOTS: '/bookings/available-slots'
  },
  PAYMENTS: {
    PROCESS: '/payments/process',
    MY_PAYMENTS: '/payments/my-payments'
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/mark-all-read'
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: '/categories'
  },
  USERS: {
    LIST: '/users',
    DETAIL: '/users',
    WISHLIST: '/users/wishlist'
  }
};

// Sort Options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' }
];

// Price Ranges
export const PRICE_RANGES = [
  { min: 0, max: 100000, label: 'Under ETB 100,000' },
  { min: 100000, max: 500000, label: 'ETB 100,000 - 500,000' },
  { min: 500000, max: 1000000, label: 'ETB 500,000 - 1,000,000' },
  { min: 1000000, max: 5000000, label: 'ETB 1M - 5M' },
  { min: 5000000, max: null, label: 'Over ETB 5M' }
];

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SERVER_ERROR: 'Something went wrong. Please try again later.'
};

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
export const SERVICE_CATEGORIES = [
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Comprehensive project management services'
  },
  {
    id: 'engineering-design',
    name: 'Engineering & Design',
    description: 'Professional engineering and architectural design'
  },
  {
    id: 'interior-design',
    name: 'Interior Design',
    description: 'Creative interior design solutions'
  },
  {
    id: 'consultancy',
    name: 'Consultancy',
    description: 'Expert consulting and advisory services'
  }
];
// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in',
  REGISTER: 'Account created successfully',
  LOGOUT: 'Successfully logged out',
  UPDATE_PROFILE: 'Profile updated successfully',
  ADD_TO_CART: 'Item added to cart',
  REMOVE_FROM_CART: 'Item removed from cart',
  ORDER_PLACED: 'Order placed successfully',
  BOOKING_CREATED: 'Booking created successfully',
  MESSAGE_SENT: 'Message sent successfully',
  REVIEW_SUBMITTED: 'Review submitted successfully'
};