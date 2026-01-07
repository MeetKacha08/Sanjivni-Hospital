import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarAlt, FaPhoneAlt, FaCheck } from 'react-icons/fa';

const Pandingpatient = () => {
    const [patients, setPatients] = useState([]);
    const doctorName = localStorage.getItem('loggedInDoctorName');

    useEffect(() => {
        fetchPendingPatients();
    }, []);

    const fetchPendingPatients = () => {
        axios.get('http://localhost:5000/patients')
            .then(res => {
                // Filter: Status must be 'Accepted' to show here
                const filtered = res.data.filter(p => 
                    p.doctorName === doctorName && p.status === 'Accepted'
                );
                setPatients(filtered);
            })
            .catch(err => console.error("Error fetching pending patients:", err));
    };

    // 🔥 NEW: Function to Approve Patient
    const handleApprove = async (patientId) => {
        try {
            // Update status to 'Approved' in db.json
            await axios.patch(`http://localhost:5000/patients/${patientId}`, {
                status: 'Approved'
            });
            alert("Patient Approved! Moved to My Patients.");
            fetchPendingPatients(); // Refresh the list
        } catch (err) {
            console.error("Error approving patient:", err);
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={headerSection}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>Pending Patients for {doctorName}</h2>
                <p style={{ color: '#7f8c8d' }}>Total patients waiting: {patients.length}</p>
            </div>

            <div style={tableContainer}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRowStyle}>
                            <th style={thStyle}>Patient Info</th>
                            <th style={thStyle}>Contact</th>
                            <th style={thStyle}>Appt. Date</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length > 0 ? (
                            patients.map((p) => (
                                <tr key={p.id} style={rowStyle}>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <FaUserCircle size={25} color="#3498db" />
                                            <div>
                                                <span style={{ fontWeight: '600', display: 'block' }}>{p.fullName}</span>
                                                <small style={{ color: '#666' }}>Age: {p.age} | {p.department}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={tdStyle}><FaPhoneAlt size={11} /> {p.contact}</td>
                                    <td style={tdStyle}><FaCalendarAlt size={11} /> {p.admittedDate || 'Today'}</td>
                                    <td style={tdStyle}>
                                        <button 
                                            onClick={() => handleApprove(p.id)} 
                                            style={approveBtnStyle}
                                        >
                                            <FaCheck style={{ marginRight: '5px' }} /> Approve
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No pending patients.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- STYLES ---
const approveBtnStyle = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center' };
const headerSection = { marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8f9fa', color: '#4a5568', fontWeight: '700', borderBottom: '2px solid #edf2f7', fontSize: '13px' };
const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #f1f4f8', color: '#2d3748', fontSize: '14px' };
const rowStyle = { transition: 'background-color 0.2s' };
const headerRowStyle = { borderBottom: '2px solid #eee' };

export default Pandingpatient;