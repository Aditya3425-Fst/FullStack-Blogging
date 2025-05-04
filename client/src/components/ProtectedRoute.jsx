import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Wraps around components that require authentication
// Optionally checks for a specific role
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const location = useLocation(); // Get current location to redirect back after login

  if (loading) {
    // Show a loading indicator while checking auth status
    return <div>Loading...</div>; 
  }

  if (!user) {
    // User not logged in, redirect to login page
    // Pass the current location in state so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // User is logged in but does not have the required role
    // Redirect to home page or an unauthorized page
    console.warn(`User with role '${user.role}' tried to access route requiring role '${requiredRole}'`);
    return <Navigate to="/" replace />; // Or redirect to an "Unauthorized" page
  }

  // User is logged in and has the required role (if specified)
  return children;
}

export default ProtectedRoute; 