// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaUserCircle, FaCalendarCheck } from 'react-icons/fa';

// const Patients = () => {
//     const [patients, setPatients] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:5000/patients')
//             .then(res => setPatients(res.data))
//             .catch(err => console.log(err));
//     }, []);

//     return (
//         <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <h2 style={{ marginBottom: '20px' }}>Permanent Patients List</h2>
            
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
//                 {patients.length > 0 ? (
//                     patients.map((patient) => (
//                         <div key={patient.id} style={patientCard}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//                                 <FaUserCircle size={40} color="#28a745" />
//                                 <div>
//                                     <h3 style={{ margin: 0 }}>{patient.fullName}</h3>
//                                     <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{patient.department}</p>
//                                 </div>
//                             </div>
//                             <hr style={{ border: '0.5px solid #eee', margin: '15px 0' }} />
//                             <div style={{ fontSize: '14px' }}>
//                                 <p><strong>Contact:</strong> {patient.contact}</p>
//                                 <p><strong>Email:</strong> {patient.email}</p>
//                                 <p style={{ color: '#28a745', fontWeight: 'bold' }}>
//                                     <FaCalendarCheck /> Admitted: {patient.admittedDate}
//                                 </p>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No accepted patients yet.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// const patientCard = {
//     backgroundColor: '#fff',
//     padding: '20px',
//     borderRadius: '12px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//     borderTop: '5px solid #28a745'
// };

// export default Patients;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarCheck, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Patients = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/patients')
            .then(res => setPatients(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={headerSection}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>Permanent Patients List</h2>
                <p style={{ color: '#7f8c8d' }}>Total Registered Patients: {patients.length}</p>
            </div>
            
            <div style={tableContainer}>
                {patients.length > 0 ? (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={headerRowStyle}>
                                <th style={thStyle}>Patient Name</th>
                                <th style={thStyle}>Department</th>
                                <th style={thStyle}>Contact Info</th>
                                <th style={thStyle}>Admission Date</th>
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient.id} style={rowStyle}>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <FaUserCircle size={25} color="#28a745" />
                                            <span style={{ fontWeight: '600' }}>{patient.fullName}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={deptBadge}>{patient.department}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ fontSize: '13px' }}>
                                            <div style={{ marginBottom: '4px' }}><FaPhoneAlt size={12} /> {patient.contact}</div>
                                            <div style={{ color: '#666' }}><FaEnvelope size={12} /> {patient.email}</div>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ color: '#2c3e50' }}>
                                            <FaCalendarCheck size={14} style={{ marginRight: '5px' }} />
                                            {patient.admittedDate}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={statusBadge}>Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
                        <p>No accepted patients found in the database.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CSS-in-JS Styles ---
const headerSection = {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
};

const tableContainer = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white'
};

const thStyle = {
    textAlign: 'left',
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    color: '#34495e',
    fontWeight: '700',
    borderBottom: '2px solid #edf2f7',
    fontSize: '14px'
};

const tdStyle = {
    padding: '15px 20px',
    borderBottom: '1px solid #f1f4f8',
    color: '#2d3748',
    fontSize: '14px'
};

const rowStyle = {
    transition: 'background-color 0.2s',
};

const deptBadge = {
    backgroundColor: '#ebf8ff',
    color: '#3182ce',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600'
};

const statusBadge = {
    backgroundColor: '#f0fff4',
    color: '#38a169',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    border: '1px solid #c6f6d5'
};

const headerRowStyle = {
    borderBottom: '2px solid #eee'
};

export default Patients;