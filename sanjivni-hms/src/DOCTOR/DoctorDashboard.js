import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#e6f7ff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>this is a doctor dashboard</h2>
        <button onClick={handleLogout} style={buttonStyle}>Logout</button>
      </div>
      <hr />
      <div style={cardContainer}>
        <div style={card}>Today's Appointments</div>
        <div style={card}>Patient History</div>
        <div style={card}>Prescriptions</div>
      </div>
    </div>
  );
};

const buttonStyle = { padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px' };
const cardContainer = { display: 'flex', gap: '20px', marginTop: '20px' };
const card = { padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1, textAlign: 'center' };

export default DoctorDashboard;