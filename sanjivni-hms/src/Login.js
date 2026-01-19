// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaUserShield, FaLock, FaUserAlt } from 'react-icons/fa';
// import axios from 'axios';
// import './Login.css';

// const Login = () => {
//   const [credentials, setCredentials] = useState({ id: '', password: '' });
//   const [dbDoctors, setDbDoctors] = useState([]); // Dynamic state for doctors from db.json
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // 1. Fetch dynamic list of doctors from your db.json
//   useEffect(() => {
//     axios.get('http://localhost:5000/doctors')
//       .then(res => setDbDoctors(res.data))
//       .catch(err => console.error("Error loading doctors:", err));
//   }, []);

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // 2. Static Admin/Lab/Billing (Keeping your existing logic)
//     const staticUsers = [
//       { id: 'admin01', password: 'password123', role: 'admin' },
//       { id: 'lab01', password: 'labpassword', role: 'lab' },
//       { id: 'biling01', password: 'billingpass', role: 'billing' }
//     ];

//     const staticUser = staticUsers.find(u => u.id === credentials.id && u.password === credentials.password);

//     if (staticUser) {
//       localStorage.setItem('userRole', staticUser.role);
//       localStorage.setItem('isAuthenticated', 'true');
//       navigate(`/${staticUser.role}`);
//       return;
//     }

//     // 3. 🔥 DYNAMIC DOCTOR LOGIN 🔥
//     // Check against the loginId and password from your db.json "doctors" array
//     const doctorUser = dbDoctors.find(d => d.loginId === credentials.id && d.password === credentials.password);

//     if (doctorUser) {
//       localStorage.setItem('userRole', 'doctor');
//       localStorage.setItem('isAuthenticated', 'true');
//       // Store specific doctor info to show on their dashboard later
//       localStorage.setItem('loggedInDoctorId', doctorUser.id);
//       localStorage.setItem('loggedInDoctorName', doctorUser.name);
      
//       navigate('/doctor');
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
//           <p>Sign in with your assigned ID</p>
//         </div>

//         <form onSubmit={handleLogin} className="login-form">
//           <div className="input-group">
//             <FaUserAlt className="input-icon" />
//             <input 
//               type="text" name="id" placeholder="Login ID (e.g., docjohn)" 
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
//            <p style={{fontSize: '11px', color: '#7f8c8d'}}>
//              Use credentials from your doctor list (e.g., <b>docjohn / password123</b>)
//            </p>
//            <p><strong>Demo Access:</strong> admin01 / password123</p>
//            <p><strong>Demo Access:</strong> lab01 / labpassword</p>
//            <p><strong>Demo Access:</strong> biling01 / billingpass</p>
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
  const [dbDoctors, setDbDoctors] = useState([]); 
  const [dbLabStaff, setDbLabStaff] = useState([]); // 🔥 Added state for Lab Staff
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch dynamic lists from db.json
  useEffect(() => {
    // 1. Load Doctors
    axios.get('http://localhost:5000/doctors')
      .then(res => setDbDoctors(res.data))
      .catch(err => console.error("Error loading doctors:", err));

    // 2. 🔥 Load Lab Staff from db.json
    axios.get('http://localhost:5000/labStaff')
      .then(res => setDbLabStaff(res.data))
      .catch(err => console.error("Error loading lab staff:", err));
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Static Admin/Billing (Keeping your existing logic)
    // Note: Removed lab01 from static as it's now dynamic
    const staticUsers = [
      { id: 'admin01', password: 'password123', role: 'admin' },
      { id: 'bill', password: 'bill', role: 'billing' }
    ];

    const staticUser = staticUsers.find(u => u.id === credentials.id && u.password === credentials.password);

    if (staticUser) {
      localStorage.setItem('userRole', staticUser.role);
      localStorage.setItem('isAuthenticated', 'true');
      navigate(`/${staticUser.role}`);
      return;
    }

    // 🔥 DYNAMIC DOCTOR LOGIN 🔥
    const doctorUser = dbDoctors.find(d => d.loginId === credentials.id && d.password === credentials.password);

    if (doctorUser) {
      localStorage.setItem('userRole', 'doctor');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loggedInDoctorId', doctorUser.id);
      localStorage.setItem('loggedInDoctorName', doctorUser.name);
      navigate('/doctor');
      return;
    }

    // 🔥 DYNAMIC LAB STAFF LOGIN 🔥
    const labUser = dbLabStaff.find(l => l.loginId === credentials.id && l.password === credentials.password);

    if (labUser) {
      localStorage.setItem('userRole', 'lab');
      localStorage.setItem('isAuthenticated', 'true');
      // Store lab staff info for their dashboard
      localStorage.setItem('loggedInLabStaffId', labUser.id);
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
        </div>
      </div>
    </div>
  );
};

export default Login;