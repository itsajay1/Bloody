import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Wrapper
 * Redirects to /login if user is not authenticated.
 * Optionally checks for specific roles.
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save current location to return to it later
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // Role not authorized, send home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
