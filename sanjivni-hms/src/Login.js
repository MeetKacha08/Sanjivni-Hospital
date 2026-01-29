import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaUserAlt } from 'react-icons/fa';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [dbDoctors, setDbDoctors] = useState([]); 
  const [dbLabStaff, setDbLabStaff] = useState([]); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/doctors')
      .then(res => setDbDoctors(res.data))
      .catch(err => console.error("Error loading doctors:", err));

    axios.get('http://localhost:5000/labStaff')
      .then(res => setDbLabStaff(res.data))
      .catch(err => console.error("Error loading lab staff:", err));
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // 1. Static User Check (Admin, Billing, Reception)
    const staticUsers = [
      { id: 'admin01', password: 'password123', role: 'admin' },
      { id: 'bill', password: 'bill', role: 'billing' },
      { id: 'reception', password: 'recep123', role: 'reception' } // 🔥 Role is 'reception'
    ];

    const staticUser = staticUsers.find(u => u.id === credentials.id && u.password === credentials.password);

    if (staticUser) {
      localStorage.setItem('userRole', staticUser.role);
      localStorage.setItem('isAuthenticated', 'true');
      
      // If role is reception, this navigates to /reception
      navigate(`/${staticUser.role}`); 
      return;
    }

    // 2. Dynamic Doctor Check
    const doctorUser = dbDoctors.find(d => d.loginId === credentials.id && d.password === credentials.password);
    if (doctorUser) {
      localStorage.setItem('userRole', 'doctor');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loggedInDoctorId', doctorUser.id);
      localStorage.setItem('loggedInDoctorName', doctorUser.name);
      navigate('/doctor');
      return;
    }

    // 3. Dynamic Lab Staff Check
    const labUser = dbLabStaff.find(l => l.loginId === credentials.id && l.password === credentials.password);
    if (labUser) {
      localStorage.setItem('userRole', 'lab');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loggedInLabStaffName', labUser.fullName);
      navigate('/lab');
    } else {
      setError('Invalid ID or Password!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="icon-circle">
            <FaUserShield size={40} color="#3498db" />
          </div>
          <h2>Hospital Portal</h2>
          <p>Sign in with your assigned ID</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <FaUserAlt className="input-icon" />
            <input 
              type="text" name="id" placeholder="Login ID" 
              onChange={handleChange} required 
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input 
              type="password" name="password" placeholder="Password" 
              onChange={handleChange} required 
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">Sign In</button>
        </form>

        <div className="demo-credentials">
           <p style={{fontSize: '11px', color: '#7f8c8d'}}>
             Use credentials from dynamic staff or doctor lists.
           </p>
           <p><strong>Admin:</strong> admin01 / password123</p>
           <p><strong>Billing:</strong> bill / bill</p>
           <p><strong>Reception:</strong> reception / recep123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;