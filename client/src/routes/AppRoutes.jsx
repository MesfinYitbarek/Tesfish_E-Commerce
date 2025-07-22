import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Lazy load components
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'));
const PropertiesPage = React.lazy(() => import('@/pages/property/PropertiesPage'));
const ServicesPage = React.lazy(() => import('@/pages/services/ServicesPage'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/DashboardPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;