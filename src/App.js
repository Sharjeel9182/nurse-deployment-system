import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import SignUp from './components/auth/SignUp';
import ConfirmSignUp from './components/auth/ConfirmSignUp';
import NurseDashboardWrapper from './components/nurse/NurseDashboard';
import ClientDashboardWrapper from './components/client/ClientDashboard';
import AdminDashboardWrapper from './components/admin/AdminDashboard';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/confirm-signup" element={<ConfirmSignUp />} />
          <Route
            path="/nurse-dashboard"
            element={
              <PrivateRoute role="nurse">
                <NurseDashboardWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/client-dashboard"
            element={
              <PrivateRoute role="client">
                <ClientDashboardWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboardWrapper />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;