import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import NurseDashboardWrapper from './components/nurse/NurseDashboard';
import ClientDashboardWrapper from './components/client/ClientDashboard';
import AdminDashboardWrapper from './components/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/nurse-dashboard" element={<NurseDashboardWrapper />} />
        <Route path="/client-dashboard" element={<ClientDashboardWrapper />} />
        <Route path="/admin-dashboard" element={<AdminDashboardWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;