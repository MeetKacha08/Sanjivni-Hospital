import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarCheck, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Allpatients = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = () => {
        axios.get('http://localhost:5000/patients')
            .then(res => setPatients(res.data))
            .catch(err => console.log(err));
    };

    // Group patients by Department (Same logic as Patients page)
    const groupedPatients = patients.reduce((acc, patient) => {
        const dept = patient.department || "General";
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(patient);
        return acc;
    }, {});

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            
            {/* Header Section - Read Only (No Add Button) */}
            <div style={headerSection}>
                <div>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>All Patients Master List</h2>
                    <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Total Records: {patients.length}</p>
                </div>
            </div>

            {/* Render Tables Grouped by Department */}
            {Object.keys(groupedPatients).length > 0 ? (
                Object.keys(groupedPatients).map((deptName) => (
                    <div key={deptName} style={{ marginBottom: '40px' }}>
                        <div style={deptHeaderStyle}>
                            <h3 style={{ margin: 0, color: '#3182ce' }}>{deptName} Department</h3>
                            <span style={countBadge}>{groupedPatients[deptName].length} Patients</span>
                        </div>
                        <div style={tableContainer}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={headerRowStyle}>
                                        <th style={thStyle}>Patient Name</th>
                                        <th style={thStyle}>Contact Info</th>
                                        <th style={thStyle}>Admission Date</th>
                                        <th style={thStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedPatients[deptName].map((patient) => (
                                        <tr key={patient.id} style={rowStyle}>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <FaUserCircle size={25} color="#28a745" />
                                                    <div>
                                                        <span style={{ fontWeight: '600', display: 'block' }}>{patient.fullName}</span>
                                                        <span style={{ fontSize: '12px', color: '#888' }}>Age: {patient.age}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ fontSize: '13px' }}>
                                                    <div><FaPhoneAlt size={12} /> {patient.contact}</div>
                                                    <div style={{ color: '#666' }}><FaEnvelope size={12} /> {patient.email}</div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <FaCalendarCheck size={14} color="#666" />
                                                    {patient.admittedAt || patient.admittedDate}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    backgroundColor: '#e6fffa',
                                                    color: '#2c7a7b',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {patient.status || "Admitted"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
                    <h3>No patients found.</h3>
                </div>
            )}
        </div>
    );
};

// --- STYLES (Copied for consistency, Removed Modal/Form Styles) ---
const headerSection = { marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' };
const deptHeaderStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', padding: '0 5px' };
const countBadge = { backgroundColor: '#3182ce', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' };
const thStyle = { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8f9fa', color: '#4a5568', fontWeight: '700', borderBottom: '2px solid #edf2f7', fontSize: '13px' };
const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #f1f4f8', color: '#2d3748', fontSize: '14px' };
const rowStyle = { transition: 'background-color 0.2s' };
const headerRowStyle = { borderBottom: '2px solid #eee' };

export default Allpatients;