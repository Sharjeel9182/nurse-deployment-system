import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  const userRole = user['custom:role'];
  if (userRole !== role) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'nurse':
        return <Navigate to="/nurse-dashboard" />;
      case 'client':
        return <Navigate to="/client-dashboard" />;
      case 'admin':
        return <Navigate to="/admin-dashboard" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return children;
};

export default PrivateRoute; 