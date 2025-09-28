// router/index.js - Fixed router configuration
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
import EmployeeLayout from '../components/layout/EmployeeLayout';

// Import pages
import CustomerNotificationsPage from '../pages/customer/CustomerNotificationsPage';
import BusinessProfile from '../pages/dashboard/BusinessProfile';
import ProductDetailPage from '../pages/product/ProductdetailPage';
import PaymentSuccessPage from '../components/payment/PaymentSuccessPage';
import AboutUs from '../pages/aboutUs/AboutUs';
import ProjectsPage from '../pages/projects/ProjectsPage';
import EmployeeManagement from '../pages/admin/EmployeeManagement';
import EmployeeOverview from '../pages/dashboard/EmployeeDashboard';
import EmployeeBooking from '../pages/employee/EmployeeBooking';
import EmployeeAppointments from '../pages/employee/EmployeeAppointments';

// Lazy Pages - Existing
const HomePage = lazy(() => import('../pages/home/HomePage'));
const ProductsPage = lazy(() => import('../pages/product/ProductsPage'));
const PropertiesPage = lazy(() => import('../pages/property/PropertiesPage'));
const PropertyDetailPage = lazy(() => import('../pages/property/PropertyDetailPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgetPasswordPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const Profile = lazy(() => import('../pages/profile/Profile'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Services - Public Pages
const ServicesPage = lazy(() => import('../pages/services/ServicesPage'));

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
const MineralManagement = lazy(()=> import ('../pages/admin/MineralManagement'))
const ServicesDashboard = lazy(() => import('../pages/admin/ServicesDashboard'));
const ServiceInquiryDetail = lazy(() => import('../pages/services/ServiceInquiryDetail'));

// Customer Pages
const CustomerDashboard = lazy(() => import('../pages/customer/CustomerDashboard'));
const CustomerRegistrations = lazy(() => import('../pages/customer/CustomerRegistrations'));
const PaymentProcessing = lazy(() => import('../pages/customer/PaymentProcessing'));
const ServiceInquiries = lazy(() => import('../pages/customer/ServiceInquiries'));
const SavedProperties = lazy(() => import('../pages/customer/SavedProperties'));

// ✅ Smart Dashboard Redirect Component (only for /dashboard route)
const DashboardRedirect = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect based on user role
  switch (user?.userType) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'employee':
      return <Navigate to="/employee" replace />;
    case 'customer':
      return <Navigate to="/customer" replace />;
    case 'company':
    case 'individual':
    default:
      return <Navigate to="/dashboard/overview" replace />;
  }
};

// ✅ Enhanced Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = null }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If specific role required, check it
  if (requiredRole && user?.userType !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    switch (user?.userType) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'employee':
        return <Navigate to="/employee" replace />;
      case 'customer':
        return <Navigate to="/customer" replace />;
      default:
        return <Navigate to="/dashboard/overview" replace />;
    }
  }

  // If multiple roles allowed, check against array
  if (allowedRoles && !allowedRoles.includes(user?.userType)) {
    switch (user?.userType) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'employee':
        return <Navigate to="/employee" replace />;
      case 'customer':
        return <Navigate to="/customer" replace />;
      default:
        return <Navigate to="/dashboard/overview" replace />;
    }
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
      { path: 'about-us', element: <LazyWrapper><AboutUs /></LazyWrapper> },
      { path: 'projects', element: <LazyWrapper><ProjectsPage /></LazyWrapper> },
      { path: 'registration/:id/payment-success', element: <LazyWrapper><PaymentSuccessPage /></LazyWrapper> },
      { path: 'products/:id', element: <LazyWrapper><ProductDetailPage /></LazyWrapper> },
      { path: 'properties', element: <LazyWrapper><PropertiesPage /></LazyWrapper> },
      { path: 'properties/:id', element: <LazyWrapper><PropertyDetailPage /></LazyWrapper> },
      { path: 'services', element: <LazyWrapper><ServicesPage /></LazyWrapper> },
      { path: 'forgot-password', element: <LazyWrapper><ForgotPasswordPage /></LazyWrapper> }
    ]
  },

  // Auth Routes
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LazyWrapper><LoginPage /></LazyWrapper> },
      { path: 'register', element: <LazyWrapper><RegisterPage /></LazyWrapper> },
    ]
  },

  // ✅ Fixed Dashboard Routes
  {
    path: '/dashboard',
    children: [
      // Only redirect on exact /dashboard path
      {
        index: true,
        element: <DashboardRedirect />
      },
      // Company/Individual Dashboard Routes
      {
        path: '*',
        element: (
          <ProtectedRoute allowedRoles={['company', 'individual']}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'overview', element: <LazyWrapper><DashboardOverview /></LazyWrapper> },
          
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
          { path: 'profile', element: <LazyWrapper><Profile /></LazyWrapper> },
          { path: 'settings', element: <LazyWrapper><Settings /></LazyWrapper> }
        ]
      }
    ]
  },

  // ✅ Employee Routes (Fixed - no auto redirect)
  {
    path: '/employee',
    element: (
      <ProtectedRoute requiredRole="employee">
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LazyWrapper><EmployeeBooking /></LazyWrapper> },
      { path: 'dashboard', element: <LazyWrapper><EmployeeBooking /></LazyWrapper> },
      { path: 'overview', element: <LazyWrapper><EmployeeOverview /></LazyWrapper> },
      { path: 'registrations', element: <LazyWrapper><PropertyRegistrations /></LazyWrapper> },
      { path: 'bookings', element: <LazyWrapper><EmployeeBooking /></LazyWrapper> },
      { path: 'appointments', element: <LazyWrapper><EmployeeAppointments /></LazyWrapper> },
      { path: 'appointments/:id', element: <LazyWrapper><EmployeeAppointments /></LazyWrapper> },
      { path: 'analytics', element: <LazyWrapper><Analytics /></LazyWrapper> },
      { path: 'profile', element: <LazyWrapper><Profile /></LazyWrapper> },
      { path: 'settings', element: <LazyWrapper><Settings /></LazyWrapper> },
      { path: 'messages', element: <LazyWrapper><Messages /></LazyWrapper> }
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
      { path: 'dashboard', element: <LazyWrapper><AdminDashboard /></LazyWrapper> },
      { path: 'employees', element: <LazyWrapper><EmployeeManagement /></LazyWrapper> },
      { path: 'users', element: <LazyWrapper><UserManagement /></LazyWrapper> },
      { path: 'analytics', element: <LazyWrapper><PlatformAnalytics /></LazyWrapper> },
      { path: 'listings', element: <LazyWrapper><ListingModeration /></LazyWrapper> },
{ path: 'minerals', element: <LazyWrapper><MineralManagement /></LazyWrapper> },
      // Service Management Routes
      { path: 'services', element: <LazyWrapper><ServicesDashboard /></LazyWrapper> },
      { path: 'services/inquiries', element: <LazyWrapper><ServicesDashboard /></LazyWrapper> },
      { path: 'services/inquiries/:id', element: <LazyWrapper><ServiceInquiryDetail /></LazyWrapper> },
      { path: 'services/analytics', element: <LazyWrapper><ServicesDashboard /></LazyWrapper> },
      { path: 'registrations', element: <LazyWrapper><PropertyRegistrations /></LazyWrapper> },

      // Communication & Business
      { path: 'messages', element: <LazyWrapper><Messages /></LazyWrapper> },
      { path: 'bookings', element: <LazyWrapper><Bookings /></LazyWrapper> },
      { path: 'profile', element: <LazyWrapper><Profile /></LazyWrapper> },
      { path: 'settings', element: <LazyWrapper><Settings /></LazyWrapper> }
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
      { path: 'inquiries', element: <LazyWrapper><ServiceInquiries /></LazyWrapper> },
      { path: 'inquiries/:id', element: <LazyWrapper><ServiceInquiryDetail /></LazyWrapper> },
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

  // ✅ Profile Route (Universal for all authenticated users)
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <LazyWrapper><Profile /></LazyWrapper>
      </ProtectedRoute>
    )
  },

  // ✅ Standalone Routes
  {
    path: '/inquiry/:id',
    element: (
      <ProtectedRoute>
        <LazyWrapper><ServiceInquiryDetail /></LazyWrapper>
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