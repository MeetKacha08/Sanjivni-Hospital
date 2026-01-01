// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaUserAlt, FaBed, FaCalendarAlt } from 'react-icons/fa';

// const Admit = () => {
//     const [admittedPatients, setAdmittedPatients] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:5000/admitted')
//             .then(res => setAdmittedPatients(res.data))
//             .catch(err => console.log(err));
//     }, []);

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//             <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3182ce', paddingBottom: '10px' }}>
//                 Currently Admitted Patients
//             </h2>
            
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
//                 {admittedPatients.length > 0 ? (
//                     admittedPatients.map(patient => (
//                         <div key={patient.id} style={admitCard}>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                 <h3 style={{ margin: 0, fontSize: '18px' }}><FaUserAlt color="#3182ce" /> {patient.fullName}</h3>
//                                 <span style={roomBadge}>{patient.roomType}</span>
//                             </div>
//                             <hr style={{ margin: '10px 0' }} />
//                             <p style={cardText}><strong>Dept:</strong> {patient.department}</p>
//                             <p style={cardText}><strong>Age:</strong> {patient.age} Years</p>
//                             <p style={cardText}><strong>Contact:</strong> {patient.contact}</p>
//                             <div style={{ marginTop: '15px', fontSize: '12px', color: '#718096' }}>
//                                 <FaCalendarAlt /> Admitted On: {patient.admissionTimestamp}
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No patients are currently admitted.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// const admitCard = {
//     backgroundColor: '#fff',
//     padding: '20px',
//     borderRadius: '12px',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
//     border: '1px solid #e2e8f0'
// };

// const roomBadge = {
//     backgroundColor: '#ebf8ff',
//     color: '#3182ce',
//     padding: '4px 12px',
//     borderRadius: '20px',
//     fontSize: '12px',
//     fontWeight: 'bold'
// };

// const cardText = { margin: '5px 0', color: '#4a5568', fontSize: '14px' };

// export default Admit;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserAlt, FaBed, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

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

    // --- DISCHARGE HANDLER ---
    const handleDischarge = (id, name) => {
        if (window.confirm(`Are you sure you want to discharge ${name}?`)) {
            axios.delete(`http://localhost:5000/admitted/${id}`)
                .then(() => {
                    alert(`${name} discharged successfully!`);
                    // Update UI by filtering out the discharged patient
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
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3182ce', paddingBottom: '10px' }}>
                Currently Admitted Patients
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {admittedPatients.length > 0 ? (
                    admittedPatients.map(patient => (
                        <div key={patient.id} style={admitCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '18px' }}><FaUserAlt color="#3182ce" /> {patient.fullName}</h3>
                                <span style={roomBadge}>{patient.roomType}</span>
                            </div>
                            <hr style={{ margin: '10px 0' }} />
                            <p style={cardText}><strong>Dept:</strong> {patient.department}</p>
                            <p style={cardText}><strong>Age:</strong> {patient.age} Years</p>
                            <p style={cardText}><strong>Contact:</strong> {patient.contact}</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '15px' }}>
                                <div style={{ fontSize: '12px', color: '#718096' }}>
                                    <FaCalendarAlt /> Admitted On: <br/> {patient.admissionTimestamp}
                                </div>
                                
                                {/* DISCHARGE BUTTON ICON */}
                                <button 
                                    onClick={() => handleDischarge(patient.id, patient.fullName)}
                                    style={dischargeBtnStyle}
                                    title="Discharge Patient"
                                >
                                    <FaSignOutAlt size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No patients are currently admitted.</p>
                )}
            </div>
        </div>
    );
};

const admitCard = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    position: 'relative' // Added to help with internal positioning if needed
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

// --- BUTTON STYLE ---
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