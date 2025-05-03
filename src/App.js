import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainApp from './MainApp';
import LoginPage from './components/auth/LoginPage';
import TestPage from './components/TestPage';
import NurseDashboardWrapper from './components/nurse/NurseDashboard';
import ClientDashboardWrapper from './components/client/ClientDashboard';
import AdminDashboardWrapper from './components/admin/AdminDashboard';

// Protected route component
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const userRole = user.attributes['custom:role'] || 'client';
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Add the test page route here */}
          <Route path="/test" element={<TestPage />} />
          
          <Route
            path="/nurse-dashboard"
            element={<ProtectedRoute element={<NurseDashboardWrapper />} requiredRole="nurse" />}
          />
          <Route
            path="/client-dashboard"
            element={<ProtectedRoute element={<ClientDashboardWrapper />} requiredRole="client" />}
          />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute element={<AdminDashboardWrapper />} requiredRole="admin" />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;