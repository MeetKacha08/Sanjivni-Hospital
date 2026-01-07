// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // const Login = () => {
// //   const [credentials, setCredentials] = useState({ id: '', password: '' });
// //   const [error, setError] = useState('');
// //   const navigate = useNavigate();

// //   // Mock Database
// //   const users = [
// //     { id: 'admin01', password: 'password123', role: 'admin' },
// //     { id: 'doc01', password: 'doctorpassword', role: 'doctor' },
// //     { id: 'lab01', password: 'labpassword', role: 'lab' },
// //     { id:'biling01', password:'billingpass', role:'billing' }
// //   ];

// //   const handleChange = (e) => {
// //     setCredentials({ ...credentials, [e.target.name]: e.target.value });
// //   };

// //   const handleLogin = (e) => {
// //     e.preventDefault();
// //     // Find user matching both ID and Password
// //     const user = users.find(u => u.id === credentials.id && u.password === credentials.password);

// //     if (user) {
// //       localStorage.setItem('userRole', user.role);
// //       localStorage.setItem('isAuthenticated', 'true');
      
// //       // Redirect based on the found user's role
// //       if (user.role === 'admin') navigate('/admin');
// //       else if (user.role === 'doctor') navigate('/doctor');
// //       else if (user.role === 'lab') navigate('/lab');
// //       else if (user.role === 'billing') navigate('/billing');
// //     } else {
// //       setError('Invalid ID or Password!');
// //     }
// //   };

// //   return (
// //     <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
// //       <div style={{ display: 'inline-block', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
// //         <h2>Hospital Portal Login</h2>
// //         <form onSubmit={handleLogin}>
// //           <input 
// //             type="text" name="id" placeholder="User ID" 
// //             onChange={handleChange} required 
// //             style={{ display: 'block', margin: '10px auto', padding: '8px' }}
// //           />
// //           <input 
// //             type="password" name="password" placeholder="Password" 
// //             onChange={handleChange} required 
// //             style={{ display: 'block', margin: '10px auto', padding: '8px' }}
// //           />
// //           <button type="submit" style={{ padding: '8px 20px', cursor: 'pointer' }}>Login</button>
// //         </form>
// //         {error && <p style={{ color: 'red' }}>{error}</p>}
        
// //         <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
// //           <p>Admin: admin01 / password123</p>
// //           <p>Doctor: doc01 / doctorpassword</p>
// //           <p>Lab: lab01 / labpassword</p>
// //           <p>Billing: biling01 / billingpass</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaUserShield, FaLock, FaUserAlt } from 'react-icons/fa';
// import './Login.css'; // Create this file for the styles below

// const Login = () => {
//   const [credentials, setCredentials] = useState({ id: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const users = [
//     { id: 'admin01', password: 'password123', role: 'admin' },
//     { id: 'doc01', password: 'doc123', role: 'doctor' },
//     { id: 'lab01', password: 'labpassword', role: 'lab' },
//     { id: 'biling01', password: 'billingpass', role: 'billing' }
//   ];

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     const user = users.find(u => u.id === credentials.id && u.password === credentials.password);

//     if (user) {
//       localStorage.setItem('userRole', user.role);
//       localStorage.setItem('isAuthenticated', 'true');
      
//       if (user.role === 'admin') navigate('/admin');
//       else if (user.role === 'doctor') navigate('/doctor');
//       else if (user.role === 'lab') navigate('/lab');
//       else if (user.role === 'billing') navigate('/billing');
//     } else {
//       setError('Invalid ID or Password!');
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="login-header">
//           <div className="icon-circle">
//             <FaUserShield size={40} color="#3498db" />
//           </div>
//           <h2>Hospital Portal</h2>
//           <p>Please log in to continue</p>
//         </div>

//         <form onSubmit={handleLogin} className="login-form">
//           <div className="input-group">
//             <FaUserAlt className="input-icon" />
//             <input 
//               type="text" name="id" placeholder="User ID" 
//               onChange={handleChange} required 
//             />
//           </div>

//           <div className="input-group">
//             <FaLock className="input-icon" />
//             <input 
//               type="password" name="password" placeholder="Password" 
//               onChange={handleChange} required 
//             />
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <button type="submit" className="login-btn">Sign In</button>
//         </form>

//         <div className="demo-credentials">
//           <p><strong>Demo Access:</strong> admin01 / password123</p>
//           <p><strong>Demo Access:</strong> doc01 / doc123</p>
//           <p><strong>Demo Access:</strong> lab01 / labpassword</p>
//           <p><strong>Demo Access:</strong> biling01 / billingpass</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaUserAlt } from 'react-icons/fa';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [dbDoctors, setDbDoctors] = useState([]); // Dynamic state for doctors from db.json
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 1. Fetch dynamic list of doctors from your db.json
  useEffect(() => {
    axios.get('http://localhost:5000/doctors')
      .then(res => setDbDoctors(res.data))
      .catch(err => console.error("Error loading doctors:", err));
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // 2. Static Admin/Lab/Billing (Keeping your existing logic)
    const staticUsers = [
      { id: 'admin01', password: 'password123', role: 'admin' },
      { id: 'lab01', password: 'labpassword', role: 'lab' },
      { id: 'biling01', password: 'billingpass', role: 'billing' }
    ];

    const staticUser = staticUsers.find(u => u.id === credentials.id && u.password === credentials.password);

    if (staticUser) {
      localStorage.setItem('userRole', staticUser.role);
      localStorage.setItem('isAuthenticated', 'true');
      navigate(`/${staticUser.role}`);
      return;
    }

    // 3. 🔥 DYNAMIC DOCTOR LOGIN 🔥
    // Check against the loginId and password from your db.json "doctors" array
    const doctorUser = dbDoctors.find(d => d.loginId === credentials.id && d.password === credentials.password);

    if (doctorUser) {
      localStorage.setItem('userRole', 'doctor');
      localStorage.setItem('isAuthenticated', 'true');
      // Store specific doctor info to show on their dashboard later
      localStorage.setItem('loggedInDoctorId', doctorUser.id);
      localStorage.setItem('loggedInDoctorName', doctorUser.name);
      
      navigate('/doctor');
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
              type="text" name="id" placeholder="Login ID (e.g., docjohn)" 
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
             Use credentials from your doctor list (e.g., <b>docjohn / password123</b>)
           </p>
           <p><strong>Demo Access:</strong> admin01 / password123</p>
           <p><strong>Demo Access:</strong> lab01 / labpassword</p>
           <p><strong>Demo Access:</strong> biling01 / billingpass</p>
        </div>
      </div>
    </div>
  );
};

export default Login;