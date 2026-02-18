import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarCheck, FaEnvelope, FaPhoneAlt, FaFileInvoiceDollar } from 'react-icons/fa';

const Billing = () => {
    const [patients, setPatients] = useState([]);
    // We fetch doctors to determine departments if needed, 
    // though strictly for grouping we use patient.department

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = () => {
        axios.get('http://localhost:5000/patients')
            .then(res => setPatients(res.data))
            .catch(err => console.log(err));
    };


    // --- GROUPING LOGIC (Category Wise) ---
    const groupedPatients = patients.reduce((acc, patient) => {
        const dept = patient.department || "General";
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(patient);
        return acc;
    }, {});

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            {/* Header Section */}
            <div style={headerSection}>
                <div>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>Billing Department</h2>
                    <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Pending Bills: {patients.length}</p>
                </div>
                {/* No 'Add Patient' button as this is read-only/billing view */}
            </div>

            {/* Department Wise List */}
            {Object.keys(groupedPatients).map((deptName) => (
                <div key={deptName} style={{ marginBottom: '40px' }}>
                    
                    {/* Category Header */}
                    <div style={deptHeaderStyle}>
                        <h3 style={{ margin: 0, color: '#3182ce' }}>{deptName} Department</h3>
                        <span style={countBadge}>{groupedPatients[deptName].length} Patients</span>
                    </div>

                    {/* Table */}
                    <div style={tableContainer}>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={headerRowStyle}>
                                    <th style={thStyle}>Patient Name</th>
                                    <th style={thStyle}>Contact Info</th>
                                    <th style={thStyle}>Admission Date</th>
                                    <th style={thStyle}>Billing Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedPatients[deptName].map((patient) => (
                                    <tr key={patient.id} style={rowStyle}>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <FaUserCircle size={25} color="#28a745" />
                                                <span style={{ fontWeight: '600' }}>{patient.fullName}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontSize: '13px' }}>
                                                <div><FaPhoneAlt size={12} /> {patient.contact}</div>
                                                <div style={{ color: '#666' }}><FaEnvelope size={12} /> {patient.email}</div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <FaCalendarCheck size={14} style={{ marginRight: '5px' }} />
                                            {patient.admittedAt}
                                        </td>
                                        <td style={tdStyle}>
                                            {/* Button Name Changed & Not Working (Disabled) */}
                                            <button 
                                                disabled 
                                                style={disabledButtonStyle}
                                                title="Billing generation is currently disabled"
                                            >
                                                <FaFileInvoiceDollar style={{ marginRight: '5px' }} /> View Bill
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- STYLES (Reusing your existing design system) ---
const headerSection = { marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' };
const deptHeaderStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', padding: '0 5px' };
const countBadge = { backgroundColor: '#3182ce', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' };
const thStyle = { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8f9fa', color: '#4a5568', fontWeight: '700', borderBottom: '2px solid #edf2f7', fontSize: '13px' };
const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #f1f4f8', color: '#2d3748', fontSize: '14px' };
const rowStyle = { transition: 'background-color 0.2s' };
const headerRowStyle = { borderBottom: '2px solid #eee' };

// Specific style for the disabled button
const disabledButtonStyle = { 
    backgroundColor: '#95a5a6', // Grey color indicating disabled state
    color: 'white', 
    border: 'none', 
    padding: '6px 12px', 
    borderRadius: '6px', 
    cursor: 'not-allowed', // Shows "stop" symbol on hover
    fontSize: '12px', 
    fontWeight: '500', 
    display: 'flex', 
    alignItems: 'center', 
    opacity: 0.7 
};

export default Billing;