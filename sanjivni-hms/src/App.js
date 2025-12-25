import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// User Import Components
import Home from './Website/Home/Home';
// Admin Import Components
import AdminDashboard from './ADMIN/Dashboard/AdminDashboard';
import Appointment from './ADMIN/Appoinment/Appointment';
import Patients from './ADMIN/Patient/Patients';
import Doctors from './ADMIN/Doctor/Doctors';
import Laboratory from './ADMIN/Lab/Laboratory';
import Admit from './ADMIN/Admit/Admit';
import Billing from './ADMIN/Biling/Billing';
// End Admin Import Components

import Login from './Login';
import DoctorDashboard from './DOCTOR/DoctorDashboard';
import LabDashboard from './LAB/LabDashboard';
import BilingDashboard from './BILING/BilingDashboard';

// Helper to check access
const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');
  const isAuth = localStorage.getItem('isAuthenticated');

  // if (!isAuth) return <Navigate to="/" />;
  // if (userRole !== allowedRole) return <Navigate to="/" />;
  if (!isAuth || userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* user Side Ruts */}
        <Route path="/" element={<Home />} />


        {/* Admin Route */}
        <Route path="/book-appointment" element={<Appointment />} />
        <Route path="/admin/patients" element={<ProtectedRoute allowedRole="admin"><Patients /></ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute allowedRole="admin"><Doctors /></ProtectedRoute>} />
        <Route path="/admin/lab" element={<ProtectedRoute allowedRole="admin"><Laboratory /></ProtectedRoute>} />
        <Route path="/admin/admit" element={<ProtectedRoute allowedRole="admin"><Admit /></ProtectedRoute>} />
        <Route path="/admin/billing" element={<ProtectedRoute allowedRole="admin"><Billing /></ProtectedRoute>} />
        {/* End */}

        {/* Dashboard Routs */}
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
        {/* End */}
      </Routes>
    </Router>
  );
}

export default App;