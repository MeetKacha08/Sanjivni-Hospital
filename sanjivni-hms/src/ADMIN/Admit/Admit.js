import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserAlt, FaBed, FaCalendarAlt, FaSignOutAlt, FaHashtag, FaHospitalSymbol } from 'react-icons/fa';

const Admit = () => {
    const [admittedPatients, setAdmittedPatients] = useState([]);

    useEffect(() => {
        fetchAdmittedPatients();
    }, []);

    const fetchAdmittedPatients = () => {
        axios.get('http://localhost:5000/admitted')
            .then(res => setAdmittedPatients(res.data))
            .catch(err => console.log(err));
    };

    const getRoomPrefix = (type) => {
        switch(type) {
            case "ICU": return "ICU";
            case "Private Room": return "PR";
            case "General Room": return "GR";
            case "General Ward": return "GW";
            default: return "RM";
        }
    };

    // --- TWO-LEVEL GROUPING LOGIC ---
    // Level 1: Department -> Level 2: Room Type
    const groupedByDept = admittedPatients.reduce((acc, patient) => {
        const dept = patient.department || "General";
        const room = patient.roomType || "Unassigned";

        if (!acc[dept]) acc[dept] = {};
        if (!acc[dept][room]) acc[dept][room] = [];
        
        acc[dept][room].push(patient);
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
            <h2 style={{ color: '#2c3e50', borderBottom: '3px solid #3182ce', paddingBottom: '10px', marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
                <FaHospitalSymbol style={{marginRight: '15px'}}/> Hospital Admission Dashboard (Department Wise)
            </h2>
            
            {Object.keys(groupedByDept).length > 0 ? (
                Object.keys(groupedByDept).map((dept) => (
                    <div key={dept} style={deptContainerStyle}>
                        {/* DEPARTMENT SECTION HEADER */}
                        <div style={deptHeaderStyle}>
                            {dept} Department 
                            <span style={deptBadgeStyle}>{Object.values(groupedByDept[dept]).flat().length} Total Patients</span>
                        </div>

                        {/* ROOM CATEGORIES WITHIN DEPARTMENT */}
                        {Object.keys(groupedByDept[dept]).map((category) => (
                            <div key={category} style={{ marginBottom: '25px', paddingLeft: '20px' }}>
                                <div style={categoryHeaderStyle}>
                                    <FaBed style={{ marginRight: '10px' }} /> {category}
                                    <span style={countBadgeStyle}>{groupedByDept[dept][category].length} Occupied</span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                    {groupedByDept[dept][category].map((patient, index) => (
                                        <div key={patient.id} style={admitCard}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3 style={{ margin: 0, fontSize: '18px' }}><FaUserAlt color="#3182ce" /> {patient.fullName}</h3>
                                                <span style={roomBadge}>{patient.roomType}</span>
                                            </div>
                                            <hr style={{ margin: '10px 0' }} />
                                            
                                            <p style={{ ...cardText, color: '#2b6cb0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <FaHashtag size={12} /> Room No: {getRoomPrefix(patient.roomType)}-{(index + 1).toString().padStart(2, '0')}
                                            </p>

                                            <p style={cardText}><strong>Age:</strong> {patient.age} Years</p>
                                            <p style={cardText}><strong>Contact:</strong> {patient.contact}</p>
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '15px' }}>
                                                <div style={{ fontSize: '11px', color: '#718096' }}>
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
                        ))}
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
                    <p>No patients are currently admitted.</p>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---

const deptContainerStyle = {
    backgroundColor: '#edf2f7',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '40px',
    borderLeft: '10px solid #2b6cb0'
};

const deptHeaderStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const deptBadgeStyle = {
    fontSize: '14px',
    backgroundColor: '#2b6cb0',
    color: '#fff',
    padding: '5px 15px',
    borderRadius: '8px'
};

const categoryHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3182ce',
    marginBottom: '15px',
    backgroundColor: '#fff',
    padding: '8px 15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    width: 'fit-content'
};

const countBadgeStyle = {
    marginLeft: '15px',
    fontSize: '11px',
    backgroundColor: '#ebf8ff',
    color: '#3182ce',
    padding: '2px 10px',
    borderRadius: '20px',
    border: '1px solid #3182ce'
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
    fontSize: '11px',
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

export default Admit;