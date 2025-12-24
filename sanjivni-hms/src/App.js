import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// User Import Components
import Home from './Website/Home/Home';
// Admin Import Components
import Login from './Login';
import AdminDashboard from './ADMIN/AdminDashboard';
import DoctorDashboard from './DOCTOR/DoctorDashboard';
import LabDashboard from './LAB/LabDashboard';
import BilingDashboard from './BILING/BilingDashboard';

// Helper to check access
const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');
  const isAuth = localStorage.getItem('isAuthenticated');
  
  if (!isAuth) return <Navigate to="/" />;
  if (userRole !== allowedRole) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* user Side Ruts */}
        <Route path="/" element={<Home />} />

        {/* Admin Route */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/doctor" element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/lab" element={
          <ProtectedRoute allowedRole="lab">
            <LabDashboard />
          </ProtectedRoute>
        } />

        <Route path="/billing" element={
          <ProtectedRoute allowedRole="billing">
            <BilingDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;