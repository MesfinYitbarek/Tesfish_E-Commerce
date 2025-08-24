import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Layouts
import RootLayout from '../components/layout/RootLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthLayout from '../components/layout/AuthLayout';
import AdminLayout from '../components/layout/AdminLayout';
import PlatformAnalytics from '../pages/admin/PlatformAnalytics';
import CustomerDashboardLayout from '../components/layout/CustomerDashboardLayout';
import CustomerRegistrations from '../pages/customer/CustomerRegistrations';
import PaymentProcessing from '../pages/customer/PaymentProcessing';
import ServicesPage from '../pages/services/ServicesPage';
import ServiceDetailPage from '../pages/services/ServiceDetailPage';
import PropertyDetailPage from '../pages/property/PropertyDetailPage';
import PropertiesPage from '../pages/property/PropertiesPage';
import EditProduct from '../pages/dashboard/EditProduct';

// Lazy Pages
const HomePage = lazy(() => import('../pages/home/HomePage'));
const CartPage = lazy(() => import('../pages/cart/CartPage'));
const ProductsPage = lazy(() => import('../pages/product/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/product/ProductDetailPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgetPasswordPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const DashboardOverview = lazy(() => import('../pages/dashboard/DashboardOverview'));
const MyListings = lazy(() => import('../pages/dashboard/MyListings'));
const CreateProduct = lazy(() => import('../pages/dashboard/CreateProduct'));
const Analytics = lazy(() => import('../pages/dashboard/Analytics'));
const NotificationPanel = lazy(() => import('../pages/dashboard/NotificationPanel'));
const Messages = lazy(() => import('../pages/chat/Messages'));
const Bookings = lazy(() => import('../pages/dashboard/Bookings'));
const Settings = lazy(() => import('../pages/dashboard/Settings'));
const Profile = lazy(() => import('../pages/profile/Profile'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const ListingModeration = lazy(() => import('../pages/admin/ListingModeration'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Protected Route
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect non-admins away from admin routes
  if (requiredRole && user?.userType !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
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
      { path: 'product/:id', element: <LazyWrapper><ProductDetailPage /></LazyWrapper> },
      { path: 'services', element: <LazyWrapper><ServicesPage /></LazyWrapper> },
      { path: 'services/:serviceId', element: <LazyWrapper><ServiceDetailPage /></LazyWrapper> },
      { path: 'properties', element: <LazyWrapper><PropertiesPage /></LazyWrapper> },
      { path: 'properties/:id', element: <LazyWrapper><PropertyDetailPage /></LazyWrapper> },
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
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LazyWrapper><LoginPage /></LazyWrapper> },
      { path: 'register', element: <LazyWrapper><RegisterPage /></LazyWrapper> }
    ]
  },
  {
    path: '/cart',
    element: <LazyWrapper><CartPage /></LazyWrapper>
  },

  //Profile
  {
    path: '/profile',
    element: <ProtectedRoute><Profile/> </ProtectedRoute>
  },
  // User Dashboard
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LazyWrapper><DashboardOverview /></LazyWrapper> },
      { path: 'products', element: <LazyWrapper><MyListings /></LazyWrapper> },
      { path: 'products/:id/edit', element: <LazyWrapper><EditProduct /></LazyWrapper> },
      { path: 'products/create', element: <LazyWrapper><CreateProduct /></LazyWrapper> },
      { path: 'analytics', element: <LazyWrapper><Analytics /></LazyWrapper> },
      { path: 'notifications', element: <LazyWrapper><NotificationPanel /></LazyWrapper> },
      { path: 'messages', element: <LazyWrapper><Messages /></LazyWrapper> },
      { path: 'bookings', element: <LazyWrapper><Bookings /></LazyWrapper> },
      { path: 'settings', element: <LazyWrapper><Settings /></LazyWrapper> },
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
    )
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute requiredRole="admin">
        <LazyWrapper><UserManagement /></LazyWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/analytics',
    element: (
      <ProtectedRoute requiredRole="admin">
        <LazyWrapper><PlatformAnalytics /></LazyWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/listings',
    element: (
      <ProtectedRoute requiredRole="admin">
        <LazyWrapper><ListingModeration /></LazyWrapper>
      </ProtectedRoute>
    )
  },
  
  // customer
  {
    path: '/customer',
    element: (
      <ProtectedRoute requiredRole="customer">
        <LazyWrapper><CustomerDashboardLayout /></LazyWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: '/customer/registrations',
    element: (
      <ProtectedRoute requiredRole="customer">
        <LazyWrapper><CustomerRegistrations /></LazyWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: '/customer/payments',
    element: (
      <ProtectedRoute requiredRole="customer">
        <LazyWrapper><PaymentProcessing /></LazyWrapper>
      </ProtectedRoute>
    )
  },
  
]);
