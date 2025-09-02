import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Layouts
import RootLayout from '../components/layout/RootLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthLayout from '../components/layout/AuthLayout';
import AdminLayout from '../components/layout/AdminLayout';
import CustomerDashboardLayout from '../components/layout/CustomerDashboardLayout';
import CustomerNotificationsPage from '../pages/customer/CustomerNotificationsPage';
import BusinessProfile from '../pages/dashboard/BusinessProfile';
import ProductDetailPage from '../pages/product/ProductdetailPage';

// Lazy Pages - Existing
const HomePage = lazy(() => import('../pages/home/HomePage'));
const ProductsPage = lazy(() => import('../pages/product/ProductsPage'));
// const ProductDetailPage = lazy(() => import('../pages/product/ProductDetailPage'));
const PropertiesPage = lazy(() => import('../pages/property/PropertiesPage'));
const PropertyDetailPage = lazy(() => import('../pages/property/PropertyDetailPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgetPasswordPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const Profile = lazy(() => import('../pages/profile/Profile'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Services - Public Pages
const ServicesPage = lazy(() => import('../pages/services/ServicesPage'));
const ServiceDetailPage = lazy(() => import('../pages/services/ServiceDetailPage'));

// Dashboard Pages - Regular Users (Sellers)
const DashboardOverview = lazy(() => import('../pages/dashboard/DashboardOverview'));
const MyListings = lazy(() => import('../pages/dashboard/MyListings'));
const CreateProduct = lazy(() => import('../pages/dashboard/CreateProduct'));
const EditProduct = lazy(() => import('../pages/dashboard/EditProduct'));
const PropertyRegistrations = lazy(() => import('../pages/dashboard/PropertyRegistrations'));
const Analytics = lazy(() => import('../pages/dashboard/Analytics'));
const NotificationPanel = lazy(() => import('../pages/dashboard/NotificationPanel'));
const Messages = lazy(() => import('../pages/chat/Messages'));
const Bookings = lazy(() => import('../pages/dashboard/Bookings'));
const Settings = lazy(() => import('../pages/dashboard/Settings'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const PlatformAnalytics = lazy(() => import('../pages/admin/PlatformAnalytics'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const ListingModeration = lazy(() => import('../pages/admin/ListingModeration'));
const ServicesDashboard = lazy(() => import('../pages/admin/ServicesDashboard'));
const ServiceInquiryDetail = lazy(() => import('../pages/services/ServiceInquiryDetail'));

// Customer Pages
const CustomerDashboard = lazy(() => import('../pages/customer/CustomerDashboard'));
const CustomerRegistrations = lazy(() => import('../pages/customer/CustomerRegistrations'));
const PaymentProcessing = lazy(() => import('../pages/customer/PaymentProcessing'));
const ServiceInquiries = lazy(() => import('../pages/customer/ServiceInquiries'));
const SavedProperties = lazy(() => import('../pages/customer/SavedProperties'));

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect non-admins away from admin routes
  if (requiredRole && user?.userType !== requiredRole) {
    if (requiredRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    if (requiredRole === 'customer') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Optional: Redirect admins away from user dashboard
  if (!requiredRole && user?.userType === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (!requiredRole && user?.userType === 'customer') {
    return <Navigate to="/customer" replace />;
  }

  return children;
};

// Lazy Loader Wrapper
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

// Router Config
export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <LazyWrapper>
        <NotFoundPage />
      </LazyWrapper>
    ),
    children: [
      { index: true, element: <LazyWrapper><HomePage /></LazyWrapper> },
      { path: 'products', element: <LazyWrapper><ProductsPage /></LazyWrapper> },
      { path: 'products/:id', element: <LazyWrapper><ProductDetailPage /></LazyWrapper> },
      { path: 'properties', element: <LazyWrapper><PropertiesPage /></LazyWrapper> },
      { path: 'properties/:id', element: <LazyWrapper><PropertyDetailPage /></LazyWrapper> },
      { path: 'services', element: <LazyWrapper><ServicesPage /></LazyWrapper> },
      { path: 'services/:serviceId', element: <LazyWrapper><ServiceDetailPage /></LazyWrapper> },
      { path: 'forgot-password', element: <LazyWrapper><ForgotPasswordPage /></LazyWrapper> }
    ]
  },

  // Auth Routes
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LazyWrapper><LoginPage /></LazyWrapper> },
      { path: 'register', element: <LazyWrapper><RegisterPage /></LazyWrapper> }
    ]
  },

  // Cart Route (Public/Protected)

  // Profile Route (Protected)
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <LazyWrapper><Profile /></LazyWrapper>
      </ProtectedRoute>
    )
  },

  // Regular User Dashboard (Company/Individual Sellers)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LazyWrapper><DashboardOverview /></LazyWrapper> },
      
      // Product/Listing Management
      { path: 'products', element: <LazyWrapper><MyListings /></LazyWrapper> },
      { path: 'products/create', element: <LazyWrapper><CreateProduct /></LazyWrapper> },
      { path: 'products/:id/edit', element: <LazyWrapper><EditProduct /></LazyWrapper> },
      { path: 'listings/create', element: <LazyWrapper><CreateProduct /></LazyWrapper> },
      
      // Property Registration Management
      { path: 'registrations', element: <LazyWrapper><PropertyRegistrations /></LazyWrapper> },
      
      // Communication & Business
      { path: 'messages', element: <LazyWrapper><Messages /></LazyWrapper> },
      { path: 'bookings', element: <LazyWrapper><Bookings /></LazyWrapper> },
      
      // Analytics & Reports
      { path: 'analytics', element: <LazyWrapper><Analytics /></LazyWrapper> },
      
      // Account Management
      { path: 'notifications', element: <LazyWrapper><NotificationPanel /></LazyWrapper> },
      { path: 'business-profile', element: <LazyWrapper><BusinessProfile /></LazyWrapper> },
      { path: 'profile', element: <LazyWrapper><Profile /></LazyWrapper> }
    ]
  },

  // Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <LazyWrapper><AdminLayout /></LazyWrapper>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LazyWrapper><AdminDashboard /></LazyWrapper> },
      { path: 'users', element: <LazyWrapper><UserManagement /></LazyWrapper> },
      { path: 'analytics', element: <LazyWrapper><PlatformAnalytics /></LazyWrapper> },
      { path: 'listings', element: <LazyWrapper><ListingModeration /></LazyWrapper> },
      
      // Service Management Routes
      { path: 'services', element: <LazyWrapper><ServicesDashboard /></LazyWrapper> },
      { path: 'services/inquiries', element: <LazyWrapper><ServicesDashboard /></LazyWrapper> },
      { path: 'services/inquiries/:id', element: <LazyWrapper><ServiceInquiryDetail /></LazyWrapper> },
      { path: 'services/analytics', element: <LazyWrapper><ServicesDashboard /></LazyWrapper> }
    ]
  },

  // Customer Routes
  {
    path: '/customer',
    element: (
      <ProtectedRoute requiredRole="customer">
        <CustomerDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LazyWrapper><CustomerDashboard /></LazyWrapper> },
      { path: 'dashboard', element: <LazyWrapper><CustomerDashboard /></LazyWrapper> },
      
      // Customer Property Registrations
      { path: 'registrations', element: <LazyWrapper><CustomerRegistrations /></LazyWrapper> },
      { path: 'payments', element: <LazyWrapper><PaymentProcessing /></LazyWrapper> },
      { path: 'bookings', element: <LazyWrapper><Bookings /></LazyWrapper> },
      { path: 'favorites', element: <LazyWrapper><SavedProperties /></LazyWrapper> },
      // Service Inquiry Routes for Customers
      { path: 'dashboard/inquiries', element: <LazyWrapper><ServiceInquiries /></LazyWrapper> },
      { path: 'dashboard/inquiries/:id', element: <LazyWrapper><ServiceInquiryDetail /></LazyWrapper> },
      { path: 'services', element: <LazyWrapper><ServiceInquiries /></LazyWrapper> },
      { path: 'services/inquiries', element: <LazyWrapper><ServiceInquiries /></LazyWrapper> },
      { path: 'services/inquiries/:id', element: <LazyWrapper><ServiceInquiryDetail /></LazyWrapper> },
      
      // Profile and Settings
      { path: 'profile', element: <LazyWrapper><Profile /></LazyWrapper> },
      { path: 'settings', element: <LazyWrapper><Settings /></LazyWrapper> },
      { path: 'notifications', element: <LazyWrapper><CustomerNotificationsPage /></LazyWrapper> },
      { path: 'messages', element: <LazyWrapper><Messages /></LazyWrapper> }
    ]
  },

  // Standalone Routes
  {
    path: '/inquiry/:id',
    element: (
      <ProtectedRoute>
        <LazyWrapper><ServiceInquiryDetail /></LazyWrapper>
      </ProtectedRoute>
    )
  },

  // Registration Management Routes (Alternative access patterns)
  {
    path: '/registrations',
    element: (
      <ProtectedRoute>
        <Navigate to="/dashboard/registrations" replace />
      </ProtectedRoute>
    )
  },
  {
    path: '/registrations/:id',
    element: (
      <ProtectedRoute>
        <Navigate to="/dashboard/registrations" replace />
      </ProtectedRoute>
    )
  },

  // Legacy Admin Routes (For backwards compatibility)
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute requiredRole="admin">
        <Navigate to="/admin/users" replace />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/analytics',
    element: (
      <ProtectedRoute requiredRole="admin">
        <Navigate to="/admin/analytics" replace />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/listings',
    element: (
      <ProtectedRoute requiredRole="admin">
        <Navigate to="/admin/listings" replace />
      </ProtectedRoute>
    )
  },

  // Legacy Customer Routes (For backwards compatibility)
  {
    path: '/customer/registrations',
    element: (
      <ProtectedRoute requiredRole="customer">
        <Navigate to="/customer/registrations" replace />
      </ProtectedRoute>
    )
  },
  {
    path: '/customer/payments',
    element: (
      <ProtectedRoute requiredRole="customer">
        <Navigate to="/customer/payments" replace />
      </ProtectedRoute>
    )
  },

  // Catch-all route for 404
  {
    path: '*',
    element: <LazyWrapper><NotFoundPage /></LazyWrapper>
  }
]);

export default router;
