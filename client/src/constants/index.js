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
  APPOINTMENTS: import.meta.env.VITE_ENABLE_APPOINTMENTS !== 'false', // Default enabled
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
  APPOINTMENT_DRAFT: 'citilights_appointment_draft',
};

// Appointment Types
export const APPOINTMENT_TYPES = {
  PROPERTY_VIEWING: 'property-viewing',
  CONSULTATION: 'consultation',
  SITE_VISIT: 'site-visit',
  CONTRACT_SIGNING: 'contract-signing',
  HANDOVER: 'handover',
  MAINTENANCE: 'maintenance',
  OTHER: 'other'
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  RESCHEDULED: 'rescheduled',
  NO_SHOW: 'no-show'
};

// Meeting Types
export const MEETING_TYPES = {
  IN_PERSON: 'in-person',
  VIRTUAL: 'virtual',
  PHONE_CALL: 'phone-call',
  VIDEO_CALL: 'video-call'
};

// Time Slots
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

// Days of Week
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' }
];

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
    MY_PRODUCTS: '/products/seller/my-products',
    ADMIN: '/products/admin'
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
  // NEW: Appointment endpoints
  APPOINTMENTS: {
    LIST: '/appointments',
    CREATE: '/appointments',
    DETAIL: '/appointments',
    MY_APPOINTMENTS: '/appointments/my-appointments',
    SELLER_APPOINTMENTS: '/appointments/seller-appointments',
    UPDATE_STATUS: '/appointments/:id/status',
    RESCHEDULE: '/appointments/:id/reschedule',
    CANCEL: '/appointments/:id/cancel',
    AVAILABLE_SLOTS: '/appointments/available-slots',
    STATS: '/appointments/stats'
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
  // NEW: Appointment routes
  APPOINTMENTS: '/appointments',
  MY_APPOINTMENTS: '/appointments/my-appointments',
  SELLER_APPOINTMENTS: '/appointments/seller-appointments',
  APPOINTMENT_DETAIL: '/appointments/:id',
  BOOK_APPOINTMENT: '/appointments/book/:propertyId',
  SERVICES: '/services',
  ADMIN: '/admin'
};

// Rest of your existing constants...
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  TELEBIRR: 'telebirr',
  MOBILE_TRANSFER: 'mobile_transfer',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
};
// Price Ranges
export const PRICE_RANGES = [
  { min: 0, max: 100000, label: 'Under ETB 100,000' },
  { min: 100000, max: 500000, label: 'ETB 100,000 - 500,000' },
  { min: 500000, max: 1000000, label: 'ETB 500,000 - 1,000,000' },
  { min: 1000000, max: 5000000, label: 'ETB 1M - 5M' },
  { min: 5000000, max: null, label: 'Over ETB 5M' }
];
export const USER_TYPES = {
  CUSTOMER: 'customer',
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
  ADMIN: 'admin'
};

export const PRODUCT_TYPES = {
  PHYSICAL: 'physical',
  DIGITAL: 'digital',
  SERVICE: 'service',
  REAL_ESTATE: 'real-estate',
  RENTAL: 'rental'
};

export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  VILLA: 'villa',
  COMMERCIAL: 'commercial',
  LAND: 'land',
  OFFICE: 'office',
  WAREHOUSE: 'warehouse'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially-refunded'
};

export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  BOOKING: 'booking',
  APPOINTMENT: 'appointment', // NEW
  CHAT: 'chat',
  REVIEW: 'review',
  SYSTEM: 'system',
  PROMOTION: 'promotion'
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
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  // NEW: Appointment errors
  APPOINTMENT_CONFLICT: 'The selected time conflicts with another appointment',
  APPOINTMENT_PAST_DATE: 'Appointment date must be in the future',
  PROPERTY_NOT_AVAILABLE: 'This property is not available for viewing',
  SLOT_NOT_AVAILABLE: 'The selected time slot is not available'
};

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
  REVIEW_SUBMITTED: 'Review submitted successfully',
  // NEW: Appointment success messages
  APPOINTMENT_BOOKED: 'Appointment booked successfully',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
  APPOINTMENT_RESCHEDULED: 'Appointment rescheduled successfully',
  APPOINTMENT_CONFIRMED: 'Appointment confirmed successfully',
  APPOINTMENT_COMPLETED: 'Appointment marked as completed'
};

export default {
  APP_CONFIG,
  FEATURES,
  VALIDATION,
  STORAGE_KEYS,
  API_ENDPOINTS,
  ROUTES,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
  MEETING_TYPES,
  TIME_SLOTS,
  DAYS_OF_WEEK,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};