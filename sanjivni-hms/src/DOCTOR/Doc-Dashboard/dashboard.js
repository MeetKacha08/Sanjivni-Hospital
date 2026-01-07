// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaUserInjured, FaClock, FaCheckCircle, FaExclamationTriangle, FaStethoscope } from 'react-icons/fa';

// const DoctorDashboard = () => {
//     const [patients, setPatients] = useState([]);
//     const navigate = useNavigate();

//     // 1. Get Logged-in Doctor's Name from LocalStorage
//     // Make sure your Login.js saves this as: localStorage.setItem('loggedInDoctorName', doctorUser.name);
//     const doctorName = localStorage.getItem('loggedInDoctorName');
//     const doctorDept = localStorage.getItem('loggedInDoctorDept'); 

//     useEffect(() => {
//         fetchPatients();
//     }, []);

//     const fetchPatients = () => {
//         axios.get('http://localhost:5000/patients')
//             .then(res => {
//                 // 2. 🔥 UPDATED FILTER LOGIC: Only show patients where patient.doctorName matches loggedInDoctorName
//                 const filtered = res.data.filter(p => p.doctorName === doctorName);
//                 setPatients(filtered);
//             })
//             .catch(err => console.error("Error fetching patients:", err));
//     };

//     // Statistics calculated based on the filtered list
//     const stats = {
//         total: patients.length,
//         pending: patients.filter(p => p.status === 'Accepted').length,
//         completed: 0, 
//         emergency: 0 
//     };

//     return (
//         <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//             <div style={{ marginBottom: '30px' }}>
//                 <h2 style={{ color: '#2c3e50', margin: 0 }}>Welcome, {doctorName}</h2>
//                 <p style={{ color: '#7f8c8d' }}>Department: <b>{doctorDept}</b> | You have {patients.length} assigned patients</p>
//             </div>

//             {/* --- DAILY STATISTICS --- */}
//             <div style={statsGrid}>
//                 <div style={statCard}><FaUserInjured color="#3498db" size={24}/> <div><h3>{stats.total}</h3><p>My Patients</p></div></div>
//                 <div style={statCard}><FaClock color="#f39c12" size={24}/> <div><h3>{stats.pending}</h3><p>Waiting</p></div></div>
//                 <div style={statCard}><FaCheckCircle color="#27ae60" size={24}/> <div><h3>{stats.completed}</h3><p>Treated</p></div></div>
//                 <div style={{...statCard, borderLeft: '5px solid #e74c3c'}}><FaExclamationTriangle color="#e74c3c" size={24}/> <div><h3>{stats.emergency}</h3><p>Critical</p></div></div>
//             </div>

//             {/* --- PATIENT QUEUE TABLE --- */}
//             <div style={tableWrapper}>
//                 <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Assigned Patient Queue</h3>
//                 <table style={tableStyle}>
//                     <thead>
//                         <tr style={thRow}>
//                             <th style={tdStyle}>Patient Name</th>
//                             <th style={tdStyle}>Age</th>
//                             <th style={tdStyle}>Contact</th>
//                             <th style={tdStyle}>Status</th>
//                             <th style={tdStyle}>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {patients.length > 0 ? (
//                             patients.map(p => (
//                                 <tr key={p.id} style={trStyle}>
//                                     <td style={tdStyle}><b>{p.fullName}</b></td>
//                                     <td style={tdStyle}>{p.age} Years</td>
//                                     <td style={tdStyle}>{p.contact}</td>
//                                     <td style={tdStyle}>
//                                         <span style={statusBadge}>{p.status}</span>
//                                     </td>
//                                     <td style={tdStyle}>
//                                         <button 
//                                             style={actionBtn} 
//                                             onClick={() => navigate(`/doctor/consult/${p.id}`)}
//                                         >
//                                             <FaStethoscope /> Start Consultation
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#95a5a6'}}>
//                                     No patients currently assigned to your name.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' };
// const statCard = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
// const tableWrapper = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
// const tableStyle = { width: '100%', borderCollapse: 'collapse' };
// const thRow = { borderBottom: '2px solid #eee', textAlign: 'left', color: '#7f8c8d', fontSize: '14px' };
// const tdStyle = { padding: '15px', borderBottom: '1px solid #f1f1f1', color: '#2c3e50' };
// const trStyle = { transition: '0.2s' };
// const statusBadge = { backgroundColor: '#e3f2fd', color: '#1976d2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
// const actionBtn = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' };

// export default DoctorDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserInjured, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    // 1. Get Logged-in Doctor's Info from LocalStorage
    const doctorName = localStorage.getItem('loggedInDoctorName');
    const doctorDept = localStorage.getItem('loggedInDoctorDept'); 

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = () => {
        axios.get('http://localhost:5000/patients')
            .then(res => {
                // Filter patients assigned specifically to this doctor
                const filtered = res.data.filter(p => p.doctorName === doctorName);
                setPatients(filtered);
            })
            .catch(err => console.error("Error fetching patients:", err));
    };

    // Statistics calculated based on the filtered list
    const stats = {
        total: patients.length,
        pending: patients.filter(p => p.status === 'Accepted').length,
        completed: 0, 
        emergency: 0 
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ color: '#2c3e50', margin: 0 }}>Welcome, {doctorName}</h2>
                <p style={{ color: '#7f8c8d' }}>Department: <b>{doctorDept}</b> | System Overview</p>
            </div>

            {/* --- DAILY STATISTICS --- */}
            <div style={statsGrid}>
                {/* Total Patients Card */}
                <div style={statCard}>
                    <FaUserInjured color="#3498db" size={24}/> 
                    <div>
                        <h3 style={statNumber}>{stats.total}</h3>
                        <p style={statLabel}>My Patients</p>
                    </div>
                </div>

                {/* 🔥 WAITING COUNT CARD */}
                <div style={statCard}>
                    <FaClock color="#f39c12" size={24}/> 
                    <div>
                        <h3 style={statNumber}>{stats.pending}</h3>
                        <p style={statLabel}>Waiting</p>
                    </div>
                </div>

                {/* Treated Card */}
                <div style={statCard}>
                    <FaCheckCircle color="#27ae60" size={24}/> 
                    <div>
                        <h3 style={statNumber}>{stats.completed}</h3>
                        <p style={statLabel}>Treated</p>
                    </div>
                </div>

                {/* Critical Card */}
                <div style={{...statCard, borderLeft: '5px solid #e74c3c'}}>
                    <FaExclamationTriangle color="#e74c3c" size={24}/> 
                    <div>
                        <h3 style={statNumber}>{stats.emergency}</h3>
                        <p style={statLabel}>Critical</p>
                    </div>
                </div>
            </div>

            {/* Note: Patient table has been removed to keep the dashboard clean as requested */}
        </div>
    );
};

// --- STYLES ---
const statsGrid = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
    gap: '20px', 
    marginBottom: '30px' 
};

const statCard = { 
    backgroundColor: 'white', 
    padding: '25px', 
    borderRadius: '12px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '20px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid #edf2f7'
};

const statNumber = {
    margin: 0,
    fontSize: '28px',
    color: '#2d3748'
};

const statLabel = {
    margin: 0,
    color: '#718096',
    fontSize: '14px',
    fontWeight: '500'
};

export default DoctorDashboard;