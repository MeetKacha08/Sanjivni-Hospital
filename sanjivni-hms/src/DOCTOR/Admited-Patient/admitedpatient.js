import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserAlt, FaBed, FaCalendarAlt, FaSignOutAlt, FaHashtag } from 'react-icons/fa';

const Admitedpatient = () => {
    const [admittedPatients, setAdmittedPatients] = useState([]);
    
    // 1. Get Logged-in Doctor's Department from LocalStorage
    const doctorDept = localStorage.getItem('loggedInDoctorDept');

    useEffect(() => {
        fetchAdmittedPatients();
    }, []);

    const fetchAdmittedPatients = () => {
        axios.get('http://localhost:5000/admitted')
            .then(res => {
                // 2. 🔥 FILTER LOGIC: Only show patients whose department matches the doctor's department
                const filtered = res.data.filter(p => p.department === doctorDept);
                setAdmittedPatients(filtered);
            })
            .catch(err => console.log(err));
    };

    // Helper to get prefix based on room type
    const getRoomPrefix = (type) => {
        switch(type) {
            case "ICU": return "ICU";
            case "Private Room": return "PR";
            case "General Room": return "GR";
            case "General Ward": return "GW";
            default: return "RM";
        }
    };

    // --- GROUPING LOGIC ---
    const groupedAdmissions = admittedPatients.reduce((acc, patient) => {
        const type = patient.roomType || "Unassigned";
        if (!acc[type]) acc[type] = [];
        acc[type].push(patient);
        return acc;
    }, {});

    const handleDischarge = (id, name) => {
        if (window.confirm(`Are you sure you want to discharge ${name}?`)) {
            axios.delete(`http://localhost:5000/admitted/${id}`)
                .then(() => {
                    alert(`${name} discharged successfully!`);
                    setAdmittedPatients(prev => prev.filter(p => p.id !== id));
                })
                .catch(err => {
                    console.error("Error discharging patient:", err);
                    alert("Failed to discharge patient.");
                });
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ marginBottom: '30px', borderBottom: '2px solid #3182ce', paddingBottom: '10px' }}>
                <h2 style={{ color: '#2c3e50', margin: 0 }}>
                    My Admitted Patients ({doctorDept})
                </h2>
                <p style={{ color: '#718096', margin: '5px 0 0 0' }}>Showing all patients currently admitted in your department.</p>
            </div>
            
            {admittedPatients.length > 0 ? (
                Object.keys(groupedAdmissions).map((category) => (
                    <div key={category} style={{ marginBottom: '40px' }}>
                        {/* CATEGORY HEADER */}
                        <div style={categoryHeaderStyle}>
                            <FaBed style={{ marginRight: '10px' }} /> {category}
                            <span style={countBadgeStyle}>{groupedAdmissions[category].length} Occupied</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {groupedAdmissions[category].map((patient, index) => (
                                <div key={patient.id} style={admitCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ margin: 0, fontSize: '18px' }}><FaUserAlt color="#3182ce" /> {patient.fullName}</h3>
                                        <span style={roomBadge}>{patient.roomType}</span>
                                    </div>
                                    <hr style={{ margin: '10px 0' }} />
                                    
                                    <p style={{ ...cardText, color: '#2b6cb0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FaHashtag size={12} /> Room No: {getRoomPrefix(patient.roomType)}-{(index + 1).toString().padStart(2, '0')}
                                    </p>

                                    <p style={cardText}><strong>Dept:</strong> {patient.department}</p>
                                    <p style={cardText}><strong>Age:</strong> {patient.age} Years</p>
                                    <p style={cardText}><strong>Contact:</strong> {patient.contact}</p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '15px' }}>
                                        <div style={{ fontSize: '12px', color: '#718096' }}>
                                            <FaCalendarAlt /> Admitted On: <br/> {patient.admissionTimestamp}
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleDischarge(patient.id, patient.fullName)}
                                            style={dischargeBtnStyle}
                                            title="Discharge Patient"
                                        >
                                            <FaSignOutAlt size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
                    <p>No patients from the <b>{doctorDept}</b> department are currently admitted.</p>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---

const categoryHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#3182ce',
    marginBottom: '15px',
    backgroundColor: '#fff',
    padding: '10px 20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const countBadgeStyle = {
    marginLeft: 'auto',
    fontSize: '12px',
    backgroundColor: '#3182ce',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '20px'
};

const admitCard = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    position: 'relative'
};

const roomBadge = {
    backgroundColor: '#ebf8ff',
    color: '#3182ce',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
};

const cardText = { margin: '5px 0', color: '#4a5568', fontSize: '14px' };

const dischargeBtnStyle = {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    boxShadow: '0 2px 4px rgba(229, 62, 62, 0.3)'
};

export default Admitedpatient;