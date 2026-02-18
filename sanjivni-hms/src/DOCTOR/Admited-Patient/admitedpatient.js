// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaUserAlt, FaBed, FaCalendarAlt, FaSignOutAlt, FaHashtag } from 'react-icons/fa';

// const Admitedpatient = () => {
//     const [admittedPatients, setAdmittedPatients] = useState([]);

//     const doctorName = localStorage.getItem('loggedInDoctorName');

//     useEffect(() => {
//         fetchAdmittedPatients();
//     }, []);

//     const fetchAdmittedPatients = () => {
//         axios.get('http://localhost:5000/admitted')
//             .then(res => {
//                 const myAdmittedPatients = res.data.filter(patient => 
//                     patient.doctorName === doctorName
//                 );
//                 setAdmittedPatients(myAdmittedPatients);
//             })
//             .catch(err => console.log(err));
//     };

//     const getRoomPrefix = (type) => {
//         switch(type) {
//             case "ICU": return "ICU";
//             case "Private Room": return "PR";
//             case "General Room": return "GR";
//             case "General Ward": return "GW";
//             default: return "RM";
//         }
//     };

//     const groupedAdmissions = admittedPatients.reduce((acc, patient) => {
//         const type = patient.roomType || "Unassigned";
//         if (!acc[type]) acc[type] = [];
//         acc[type].push(patient);
//         return acc;
//     }, {});

//     // 🔥 UPDATED: handleDischarge logic with Surgery Verification
//     const handleDischarge = async (id, name) => {
//         try {
//             // 1. Fetch the surgery list from the server
//             const surgeryRes = await axios.get('http://localhost:5000/surgery');
            
//             // 2. 🔥 Verification: Check if this patient ID exists in the surgery list
//             const hasSurgery = surgeryRes.data.some(s => s.patientId === id);

//             if (hasSurgery) {
//                 // 3. Block discharge if surgery is found
//                 alert(`STOP! Cannot discharge ${name}. This patient has a surgery scheduled in the Surgery Booking system. Please cancel or complete the surgery record before discharging.`);
//                 return; // Exit function
//             }

//             // 4. If no surgery exists, proceed with discharge confirmation
//             if (window.confirm(`Are you sure you want to discharge ${name}?`)) {
//                 await axios.delete(`http://localhost:5000/admitted/${id}`);
//                 alert(`${name} discharged successfully!`);
//                 setAdmittedPatients(prev => prev.filter(p => p.id !== id));
//             }
//         } catch (err) {
//             console.error("Discharge error:", err);
//             alert("An error occurred while trying to verify surgery status.");
//         }
//     };

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//             <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3182ce', paddingBottom: '10px', marginBottom: '30px' }}>
//                 My Admitted Patients ({doctorName})
//             </h2>
            
//             {admittedPatients.length > 0 ? (
//                 Object.keys(groupedAdmissions).map((category) => (
//                     <div key={category} style={{ marginBottom: '40px' }}>
//                         <div style={categoryHeaderStyle}>
//                             <FaBed style={{ marginRight: '10px' }} /> {category}
//                             <span style={countBadgeStyle}>{groupedAdmissions[category].length} Occupied</span>
//                         </div>

//                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
//                             {groupedAdmissions[category].map((patient, index) => (
//                                 <div key={patient.id} style={admitCard}>
//                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                         <h3 style={{ margin: 0, fontSize: '18px' }}><FaUserAlt color="#3182ce" /> {patient.fullName}</h3>
//                                         <span style={roomBadge}>{patient.roomType}</span>
//                                     </div>
//                                     <hr style={{ margin: '10px 0' }} />
                                    
//                                     <p style={{ ...cardText, color: '#2b6cb0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                                         <FaHashtag size={12} /> Room No: {getRoomPrefix(patient.roomType)}-{(index + 1).toString().padStart(2, '0')}
//                                     </p>

//                                     <p style={cardText}><strong>Dept:</strong> {patient.department}</p>
//                                     <p style={cardText}><strong>Age:</strong> {patient.age} Years</p>
//                                     <p style={cardText}><strong>Contact:</strong> {patient.contact}</p>
                                    
//                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '15px' }}>
//                                         <div style={{ fontSize: '12px', color: '#718096' }}>
//                                             <FaCalendarAlt /> Admitted On: <br/> {patient.admissionTimestamp}
//                                         </div>
                                        
//                                         <button 
//                                             onClick={() => handleDischarge(patient.id, patient.fullName)}
//                                             style={dischargeBtnStyle}
//                                             title="Discharge Patient"
//                                         >
//                                             <FaSignOutAlt size={18} />
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
//                     <p>No patients admitted under <b>Dr. {doctorName}</b>.</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// const categoryHeaderStyle = { display: 'flex', alignItems: 'center', fontSize: '20px', fontWeight: 'bold', color: '#3182ce', marginBottom: '15px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
// const countBadgeStyle = { marginLeft: 'auto', fontSize: '12px', backgroundColor: '#3182ce', color: '#fff', padding: '4px 12px', borderRadius: '20px' };
// const admitCard = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', position: 'relative' };
// const roomBadge = { backgroundColor: '#ebf8ff', color: '#3182ce', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
// const cardText = { margin: '5px 0', color: '#4a5568', fontSize: '14px' };
// const dischargeBtnStyle = { backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s', boxShadow: '0 2px 4px rgba(229, 62, 62, 0.3)' };

// export default Admitedpatient;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserAlt, FaBed, FaCalendarAlt, FaHashtag } from 'react-icons/fa'; // Removed FaSignOutAlt

const Admitedpatient = () => {
    const [admittedPatients, setAdmittedPatients] = useState([]);
    const doctorName = localStorage.getItem('loggedInDoctorName');

    useEffect(() => {
        fetchAdmittedPatients();
    }, []);

    const fetchAdmittedPatients = () => {
        axios.get('http://localhost:5000/admitted')
            .then(res => {
                const myAdmittedPatients = res.data.filter(patient => 
                    patient.doctorName === doctorName
                );
                setAdmittedPatients(myAdmittedPatients);
            })
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

    const groupedAdmissions = admittedPatients.reduce((acc, patient) => {
        const type = patient.roomType || "Unassigned";
        if (!acc[type]) acc[type] = [];
        acc[type].push(patient);
        return acc;
    }, {});

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3182ce', paddingBottom: '10px', marginBottom: '30px' }}>
                My Admitted Patients ({doctorName})
            </h2>
            
            {admittedPatients.length > 0 ? (
                Object.keys(groupedAdmissions).map((category) => (
                    <div key={category} style={{ marginBottom: '40px' }}>
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
                                    
                                    <div style={{ marginTop: '15px' }}>
                                        <div style={{ fontSize: '12px', color: '#718096' }}>
                                            <FaCalendarAlt style={{ marginRight: '5px' }} /> 
                                            <strong>Admitted On:</strong> {patient.admissionTimestamp}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
                    <p>No patients admitted under <b>Dr. {doctorName}</b>.</p>
                </div>
            )}
        </div>
    );
};

// Styles remain largely the same, removed dischargeBtnStyle
const categoryHeaderStyle = { display: 'flex', alignItems: 'center', fontSize: '20px', fontWeight: 'bold', color: '#3182ce', marginBottom: '15px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const countBadgeStyle = { marginLeft: 'auto', fontSize: '12px', backgroundColor: '#3182ce', color: '#fff', padding: '4px 12px', borderRadius: '20px' };
const admitCard = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', position: 'relative' };
const roomBadge = { backgroundColor: '#ebf8ff', color: '#3182ce', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
const cardText = { margin: '5px 0', color: '#4a5568', fontSize: '14px' };

export default Admitedpatient;