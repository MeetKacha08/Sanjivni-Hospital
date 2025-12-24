import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = ({ title, children }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee' }}>
        <h1>Hospital Management System</h1>
        <button onClick={handleLogout} style={{ height: '40px', marginTop: '20px' }}>Logout</button>
      </header>
      <main style={{ marginTop: '30px' }}>
        {children}
      </main>
    </div>
  );
};

export const AdminDashboard = () => (
  <DashboardContainer>
    <h2>this is an admin dashboard</h2>
    <p>Welcome, System Administrator. You have full access.</p>
  </DashboardContainer>
);

export const DoctorDashboard = () => (
  <DashboardContainer>
    <h2>this is a doctor dashboard</h2>
    <p>Welcome, Doctor. View your appointments and patient records here.</p>
  </DashboardContainer>
);

export const LabDashboard = () => (
  <DashboardContainer>
    <h2>this is a lab staff dashboard</h2>
    <p>Welcome to the Laboratory Portal. Manage tests and results here.</p>
  </DashboardContainer>
);