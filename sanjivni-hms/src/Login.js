import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mock Database
  const users = [
    { id: 'admin01', password: 'password123', role: 'admin' },
    { id: 'doc01', password: 'doctorpassword', role: 'doctor' },
    { id: 'lab01', password: 'labpassword', role: 'lab' },
    { id:'biling01', password:'billingpass', role:'billing' }
  ];

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Find user matching both ID and Password
    const user = users.find(u => u.id === credentials.id && u.password === credentials.password);

    if (user) {
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect based on the found user's role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'doctor') navigate('/doctor');
      else if (user.role === 'lab') navigate('/lab');
      else if (user.role === 'billing') navigate('/billing');
    } else {
      setError('Invalid ID or Password!');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
      <div style={{ display: 'inline-block', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Hospital Portal Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="text" name="id" placeholder="User ID" 
            onChange={handleChange} required 
            style={{ display: 'block', margin: '10px auto', padding: '8px' }}
          />
          <input 
            type="password" name="password" placeholder="Password" 
            onChange={handleChange} required 
            style={{ display: 'block', margin: '10px auto', padding: '8px' }}
          />
          <button type="submit" style={{ padding: '8px 20px', cursor: 'pointer' }}>Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          <p>Admin: admin01 / password123</p>
          <p>Doctor: doc01 / doctorpassword</p>
          <p>Lab: lab01 / labpassword</p>
          <p>Billing: biling01 / billingpass</p>
        </div>
      </div>
    </div>
  );
};

export default Login;