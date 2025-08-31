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
  PROPERTY_REGISTRATION: import.meta.env.VITE_ENABLE_PROPERTY_REGISTRATION !== 'false', // Default enabled
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  FILE_MAX_SIZE: 10 * 1024 * 1024, // 10MB for property registration documents
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB for images
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  REGISTRATION_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
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
  REGISTRATION_DRAFT: 'citilights_registration_draft',
};

// Property Registration Status
export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under-review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
};

// Payment Status for Registration
export const REGISTRATION_PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Document Types for Registration
export const REGISTRATION_DOCUMENT_TYPES = [
  { value: 'id-card', label: 'ID Card', required: true },
  { value: 'passport', label: 'Passport', required: false },
  { value: 'license', label: 'Driving License', required: false },
  { value: 'bank-statement', label: 'Bank Statement', required: false },
  { value: 'salary-slip', label: 'Salary Slip', required: false },
  { value: 'employment-letter', label: 'Employment Letter', required: false },
  { value: 'business-license', label: 'Business License', required: false },
  { value: 'other', label: 'Other Document', required: false }
];

// Relationship Types for Emergency Contact
export const RELATIONSHIP_TYPES = [
  'parent',
  'sibling', 
  'spouse',
  'child',
  'friend',
  'colleague',
  'relative',
  'other'
];

// Ethiopian Regions
export const ETHIOPIAN_REGIONS = [
  'Addis Ababa',
  'Afar',
  'Amhara', 
  'Benishangul-Gumuz',
  'Dire Dawa',
  'Gambela',
  'Harari',
  'Oromia',
  'Sidama',
  'SNNPR',
  'Somali',
  'Tigray'
];

// Appointment Types
export const APPOINTMENT_TYPES = {
  PROPERTY_VIEWING: 'property-viewing',
  CONSULTATION: 'consultation',
  SITE_VISIT: 'site-visit',
  CONTRACT_SIGNING: 'contract-signing',
  HANDOVER: 'handover',
  MAINTENANCE: 'maintenance',
  REGISTRATION_MEETING: 'registration-meeting',
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
  PROPERTY_REGISTRATIONS: {
    CREATE: '/property-registrations',
    MY_REGISTRATIONS: '/property-registrations/my-registrations',
    COMPANY_REGISTRATIONS: '/property-registrations/company-registrations',
    DETAIL: '/property-registrations',
    UPDATE_STATUS: '/property-registrations',
    VERIFY_PAYMENT: '/property-registrations',
    EXPORT_CSV: '/property-registrations/export-csv',
    STATS: '/property-registrations/stats',
    CANCEL: '/property-registrations',
    RECEIPT: '/property-registrations'
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products',
    CREATE: '/products',
    UPDATE: '/products',
    DELETE: '/products',
    MY_PRODUCTS: '/products/seller/my-products',
    ADMIN: '/products/admin',
    INCREMENT_VIEWS: '/products',
    REPORT: '/products',
    RELATED: '/products',
    BULK_UPDATE: '/products/bulk-update',
    BULK_DELETE: '/products/bulk-delete',
    UPDATE_STATUS: '/products'
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
  // Property Registration endpoints
  PROPERTY_REGISTRATIONS: {
    CREATE: '/property-registrations',
    MY_REGISTRATIONS: '/property-registrations/my-registrations',
    COMPANY_REGISTRATIONS: '/property-registrations/company-registrations',
    DETAIL: '/property-registrations',
    UPDATE_STATUS: '/property-registrations',
    VERIFY_PAYMENT: '/property-registrations',
    EXPORT_CSV: '/property-registrations/export-csv',
    STATS: '/property-registrations/stats',
    CANCEL: '/property-registrations',
    RECEIPT: '/property-registrations'
  },
  // Appointment endpoints
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
    STATS: '/notifications/stats',
    CREATE: '/notifications',
    MARK_READ: '/notifications',
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: '/notifications',
    CLEAR_READ: '/notifications/clear-read'
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: '/categories'
  },
  USERS: {
    LIST: '/users',
    DETAIL: '/users',
    PROFILE: '/profile/me',
    UPDATE_PROFILE: '/profile/me',
    WISHLIST: '/users/wishlist',
    TOGGLE_WISHLIST: '/users/wishlist', // Same endpoint for toggle
    ADD_TO_WISHLIST: '/users/wishlist',
    REMOVE_FROM_WISHLIST: '/users/wishlist',
    EXPORT: '/users/export',
    NOTIFICATION_SETTINGS: '/profile/me/notifications',
    PREFERENCES: '/profile/me/preferences',
    DEACTIVATE: '/profile/me/deactivate',
    DOWNLOAD_DATA: '/profile/me/download-data',
  },
  REVIEWS: {
    LIST: '/reviews',
    CREATE: '/reviews'
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
  // Appointment routes
  APPOINTMENTS: '/appointments',
  MY_APPOINTMENTS: '/appointments/my-appointments',
  SELLER_APPOINTMENTS: '/appointments/seller-appointments',
  APPOINTMENT_DETAIL: '/appointments/:id',
  BOOK_APPOINTMENT: '/appointments/book/:propertyId',
  // Property Registration routes
  PROPERTY_REGISTRATIONS: '/registrations',
  MY_REGISTRATIONS: '/registrations/my-registrations',
  COMPANY_REGISTRATIONS: '/registrations/company-registrations',
  REGISTRATION_DETAIL: '/registrations/:id',
  REGISTER_PROPERTY: '/register-property/:propertyId',
  SERVICES: '/services',
  ADMIN: '/admin'
};

// Rest of your existing constants...
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  TELEBIRR: 'telebirr',
  CHAPA: 'chapa',
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
  HOMES: 'homes',
  PLOTS: 'plots', 
  COMMERCIALS: 'commercials',
  OTHERS: 'others'
};

export const SUB_PRODUCT_TYPES = {
  // Homes
  HOUSES: 'houses',
  APARTMENT: 'apartment',
  VILLAS: 'villas',
  CONDOS: 'condos',
  TOWNHOUSES: 'townhouses',
  // Plots
  MIXED_USE_LAND: 'mixed-use-land',
  RESIDENTIAL_LAND: 'residential-land',
  COMMERCIAL_LAND: 'commercial-land',
  AGRICULTURAL_LAND: 'agricultural-land',
  // Commercials
  OFFICES: 'offices',
  WAREHOUSES: 'warehouses',
  SHOPS: 'shops',
  BUILDINGS: 'buildings',
  FACTORIES: 'factories',
  HOTELS: 'hotels',
  COMPANIES: 'companies',
  // Others
  ELECTRONICS: 'electronics',
  VEHICLES: 'vehicles',
  FURNITURES: 'furnitures',
  AGRICULTURAL_PRODUCTS: 'agricultural-products',
  CONSTRUCTION_EQUIPMENT: 'construction-equipment'
};

export const LISTING_TYPES = {
  SELL: 'sell',
  RENT: 'rent'
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
  APPOINTMENT: 'appointment',
  REGISTRATION: 'registration', // NEW
  NEW_REGISTRATION: 'new_registration', // NEW
  REGISTRATION_STATUS_UPDATE: 'registration_status_update', // NEW
  REGISTRATION_PAYMENT_COMPLETED: 'registration_payment_completed', // NEW
  CHAT: 'chat',
  REVIEW: 'review',
  SYSTEM: 'system',
  PROMOTION: 'promotion'
};
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
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
  // Appointment errors
  APPOINTMENT_CONFLICT: 'The selected time conflicts with another appointment',
  APPOINTMENT_PAST_DATE: 'Appointment date must be in the future',
  PROPERTY_NOT_AVAILABLE: 'This property is not available for viewing',
  SLOT_NOT_AVAILABLE: 'The selected time slot is not available',
  // Registration errors
  REGISTRATION_FEE_REQUIRED: 'Registration fee payment is required',
  ALREADY_REGISTERED: 'You have already registered for this property',
  REGISTRATION_EXPIRED: 'Registration period has expired',
  INVALID_REGISTRATION_STATUS: 'Invalid registration status',
  PAYMENT_VERIFICATION_FAILED: 'Payment verification failed'
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
  // Appointment success messages
  APPOINTMENT_BOOKED: 'Appointment booked successfully',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
  APPOINTMENT_RESCHEDULED: 'Appointment rescheduled successfully',
  APPOINTMENT_CONFIRMED: 'Appointment confirmed successfully',
  APPOINTMENT_COMPLETED: 'Appointment marked as completed',
  // Registration success messages
  REGISTRATION_SUBMITTED: 'Property registration submitted successfully',
  REGISTRATION_APPROVED: 'Registration approved successfully',
  REGISTRATION_REJECTED: 'Registration rejected',
  REGISTRATION_CANCELLED: 'Registration cancelled successfully',
  PAYMENT_COMPLETED: 'Payment completed successfully',
  RECEIPT_DOWNLOADED: 'Receipt downloaded successfully'
};

export default {
  APP_CONFIG,
  FEATURES,
  VALIDATION,
  STORAGE_KEYS,
  API_ENDPOINTS,
  ROUTES,
  REGISTRATION_STATUS,
  REGISTRATION_PAYMENT_STATUS,
  REGISTRATION_DOCUMENT_TYPES,
  RELATIONSHIP_TYPES,
  ETHIOPIAN_REGIONS,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
  MEETING_TYPES,
  TIME_SLOTS,
  DAYS_OF_WEEK,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  VILLA: 'villa',
  COMMERCIAL: 'commercial',
  LAND: 'land',
  OFFICE: 'office',
  WAREHOUSE: 'warehouse'
};

// Property Registration Status
// export const REGISTRATION_STATUS = {
//   PENDING: 'pending',
//   UNDER_REVIEW: 'under-review',
//   APPROVED: 'approved',
//   REJECTED: 'rejected',
//   COMPLETED: 'completed',
//   CANCELLED: 'cancelled',
//   EXPIRED: 'expired'
// };

// Payment Status for Registration
// export const REGISTRATION_PAYMENT_STATUS = {
//   PENDING: 'pending',
//   COMPLETED: 'completed',
//   FAILED: 'failed',
//   REFUNDED: 'refunded'
// };

// // Registration Document Types
// export const REGISTRATION_DOCUMENT_TYPES = [
//   { value: 'id-card', label: 'ID Card', required: true },
//   { value: 'passport', label: 'Passport', required: false },
//   { value: 'license', label: 'Driving License', required: false },
//   { value: 'bank-statement', label: 'Bank Statement', required: false },
//   { value: 'salary-slip', label: 'Salary Slip', required: false },
//   { value: 'employment-letter', label: 'Employment Letter', required: false },
//   { value: 'business-license', label: 'Business License', required: false },
//   { value: 'other', label: 'Other Document', required: false }
// ];

// // Relationship Types for Emergency Contact
// export const RELATIONSHIP_TYPES = [
//   'parent',
//   'sibling', 
//   'spouse',
//   'child',
//   'friend',
//   'colleague',
//   'relative',
//   'other'
// ];

// Registration Status Display Configuration
export const REGISTRATION_STATUS_CONFIG = {
  [REGISTRATION_STATUS.PENDING]: {
    label: 'Pending',
    description: 'Registration submitted, awaiting payment',
    color: 'yellow',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  [REGISTRATION_STATUS.UNDER_REVIEW]: {
    label: 'Under Review',
    description: 'Payment received, registration being reviewed',
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  [REGISTRATION_STATUS.APPROVED]: {
    label: 'Approved',
    description: 'Registration approved by property owner',
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  [REGISTRATION_STATUS.REJECTED]: {
    label: 'Rejected',
    description: 'Registration rejected by property owner',
    color: 'red',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  [REGISTRATION_STATUS.COMPLETED]: {
    label: 'Completed',
    description: 'Registration process completed successfully',
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  [REGISTRATION_STATUS.CANCELLED]: {
    label: 'Cancelled',
    description: 'Registration cancelled by customer',
    color: 'gray',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-200 dark:border-gray-600'
  },
  [REGISTRATION_STATUS.EXPIRED]: {
    label: 'Expired',
    description: 'Registration expired due to inactivity',
    color: 'gray',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-200 dark:border-gray-600'
  }
};

// Payment Status Display Configuration
export const REGISTRATION_PAYMENT_STATUS_CONFIG = {
  [REGISTRATION_PAYMENT_STATUS.PENDING]: {
    label: 'Payment Pending',
    description: 'Awaiting payment confirmation',
    color: 'yellow',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-700 dark:text-yellow-300'
  },
  [REGISTRATION_PAYMENT_STATUS.COMPLETED]: {
    label: 'Payment Completed',
    description: 'Payment successfully processed',
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-300'
  },
  [REGISTRATION_PAYMENT_STATUS.FAILED]: {
    label: 'Payment Failed',
    description: 'Payment processing failed',
    color: 'red',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-300'
  },
  [REGISTRATION_PAYMENT_STATUS.REFUNDED]: {
    label: 'Refunded',
    description: 'Payment has been refunded',
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-300'
  }
};

// Registration Workflow Steps
export const REGISTRATION_WORKFLOW_STEPS = [
  {
    id: 1,
    name: 'Submit Registration',
    description: 'Fill out registration form and submit documents',
    status: REGISTRATION_STATUS.PENDING
  },
  {
    id: 2,
    name: 'Payment',
    description: 'Pay registration fee',
    status: REGISTRATION_STATUS.PENDING
  },
  {
    id: 3,
    name: 'Review',
    description: 'Property owner reviews application',
    status: REGISTRATION_STATUS.UNDER_REVIEW
  },
  {
    id: 4,
    name: 'Decision',
    description: 'Registration approved or rejected',
    status: [REGISTRATION_STATUS.APPROVED, REGISTRATION_STATUS.REJECTED]
  },
  {
    id: 5,
    name: 'Completion',
    description: 'Process completed',
    status: REGISTRATION_STATUS.COMPLETED
  }
];

// Error Messages for Registration
export const REGISTRATION_ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  INVALID_FILE_TYPE: 'Only PDF, JPG, and PNG files are allowed',
  REGISTRATION_FEE_REQUIRED: 'Registration fee payment is required',
  ALREADY_REGISTERED: 'You have already registered for this property',
  REGISTRATION_EXPIRED: 'Registration period has expired',
  INVALID_REGISTRATION_STATUS: 'Invalid registration status',
  PAYMENT_VERIFICATION_FAILED: 'Payment verification failed',
  PROPERTY_NOT_FOUND: 'Property not found',
  REGISTRATION_NOT_FOUND: 'Registration not found',
  UNAUTHORIZED_ACCESS: 'You are not authorized to access this registration'
};

// Success Messages for Registration
export const REGISTRATION_SUCCESS_MESSAGES = {
  REGISTRATION_SUBMITTED: 'Property registration submitted successfully',
  PAYMENT_COMPLETED: 'Payment completed successfully',
  REGISTRATION_APPROVED: 'Your registration has been approved',
  REGISTRATION_UPDATED: 'Registration updated successfully',
  DOCUMENT_UPLOADED: 'Document uploaded successfully',
  RECEIPT_DOWNLOADED: 'Receipt downloaded successfully'
};

// Registration Form Steps
export const REGISTRATION_FORM_STEPS = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Basic personal details',
    fields: ['firstName', 'lastName', 'email', 'phone', 'occupation']
  },
  {
    id: 2,
    title: 'Address & Emergency Contact',
    description: 'Address and emergency contact information',
    fields: ['address', 'emergencyContact']
  },
  {
    id: 3,
    title: 'Financial Information',
    description: 'Optional financial details',
    fields: ['financialInfo']
  },
  {
    id: 4,
    title: 'Documents & Review',
    description: 'Upload documents and review information',
    fields: ['documents']
  }
];

