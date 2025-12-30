// import '../Appoinment/Appoinment.css';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaTrash, FaTimes, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHospital } from 'react-icons/fa';

// const Appoinment = () => {
//     const [list, setList] = useState([]);
//     const [selectedPatient, setSelectedPatient] = useState(null); // State for popup

//     useEffect(() => {
//         fetchAppointments();
//     }, []);

//     const fetchAppointments = () => {
//         axios.get('http://localhost:5000/appointments')
//             .then(res => setList(res.data))
//             .catch(err => console.log(err));
//     };

//     const handleDelete = (e, id) => {
//         e.stopPropagation(); // Prevents the card click (popup) from firing
//         if (window.confirm("Are you sure you want to delete this appointment?")) {
//             axios.delete(`http://localhost:5000/appointments/${id}`)
//                 .then(() => {
//                     setList(list.filter(item => item.id !== id));
//                     if (selectedPatient?.id === id) setSelectedPatient(null);
//                     alert("Appointment deleted successfully!");
//                 })
//                 .catch(err => console.error("Error deleting data:", err));
//         }
//     };

//     return (
//         <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <h3 style={{ marginBottom: '20px' }}>Patient Appointments</h3>

//             {/* --- CARD GRID --- */}
//             <div style={cardContainerStyle}>
//                 {list.map((item) => (
//                     <div 
//                         key={item.id} 
//                         style={cardStyle} 
//                         onClick={() => setSelectedPatient(item)} // Incorrect variable name in your thought, fixed to selectedPatient
//                         onClickCapture={() => setSelectedPatient(item)}
//                     >
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                                 <FaUserCircle size={30} color="#007bff" />
//                                 <h4 style={{ margin: 0 }}>{item.fullName}</h4>
//                             </div>
//                             <FaTrash 
//                                 style={{ color: '#e74c3c', cursor: 'pointer' }} 
//                                 onClick={(e) => handleDelete(e, item.id)} 
//                             />
//                         </div>
//                         <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Click to view details</p>
//                     </div>
//                 ))}
//             </div>

//             {/* --- DETAILS POPUP (MODAL) --- */}
//             {selectedPatient && (
//                 <div style={modalOverlayStyle}>
//                     <div style={modalContentStyle}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                             <h2 style={{ margin: 0, color: '#2c3e50' }}>Patient Details</h2>
//                             <FaTimes 
//                                 style={{ cursor: 'pointer', fontSize: '24px', color: '#95a5a6' }} 
//                                 onClick={() => setSelectedPatient(null)} 
//                             />
//                         </div>

//                         <div style={infoGrid}>
//                             <div style={infoBox}><strong><FaUserCircle /> Name:</strong> {selectedPatient.fullName}</div>
//                             <div style={infoBox}><strong>Age:</strong> {selectedPatient.age} Years</div>
//                             <div style={infoBox}><strong><FaPhone /> Contact:</strong> {selectedPatient.contact}</div>
//                             <div style={infoBox}><strong><FaEnvelope /> Email:</strong> {selectedPatient.email}</div>
//                             <div style={infoBox}><strong><FaHospital /> Department:</strong> {selectedPatient.department}</div>
//                             <div style={infoBox}><strong>Country:</strong> {selectedPatient.country}</div>
//                             <div style={infoBox}><strong>State:</strong> {selectedPatient.state}</div>
//                             <div style={infoBox}><strong>City:</strong> {selectedPatient.city}</div>
//                         </div>

//                         <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
//                             <strong><FaMapMarkerAlt /> Address:</strong>
//                             <p style={{ color: '#7f8c8d' }}>{selectedPatient.address}</p>
//                         </div>

//                         <button 
//                             style={closeBtn} 
//                             onClick={() => setSelectedPatient(null)}
//                         >
//                             Close Details
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- STYLES ---
// const cardContainerStyle = {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//     gap: '20px'
// };

// const cardStyle = {
//     backgroundColor: '#fff',
//     padding: '20px',
//     borderRadius: '10px',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//     cursor: 'pointer',
//     transition: 'transform 0.2s',
//     borderLeft: '5px solid #007bff'
// };

// const modalOverlayStyle = {
//     position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
//     backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
// };

// const modalContentStyle = {
//     backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '600px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
// };

// const infoGrid = {
//     display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'
// };

// const infoBox = {
//     padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px', fontSize: '14px'
// };

// const closeBtn = {
//     marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#34495e',
//     color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
// };

// export default Appoinment;

// //////////////////////////////////////////////////////////////////////////////////////////////

// import '../Appoinment/Appoinment.css';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaCheck, FaTimes, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHospital } from 'react-icons/fa';

// const Appoinment = () => {
//     const [list, setList] = useState([]);
//     const [selectedPatient, setSelectedPatient] = useState(null);

//     useEffect(() => {
//         fetchAppointments();
//     }, []);

//     const fetchAppointments = () => {
//         axios.get('http://localhost:5000/appointments')
//             .then(res => setList(res.data))
//             .catch(err => console.log(err));
//     };

//     // --- ACCEPT PATIENT LOGIC ---
//     const handleAccept = async (e, patientData) => {
//         e.stopPropagation(); // Prevents opening the details modal
//         if (window.confirm(`Accept appointment for ${patientData.fullName}?`)) {
//             try {
//                 // 1. Move data to patients collection
//                 await axios.post('http://localhost:5000/patients', {
//                     ...patientData,
//                     status: "Accepted",
//                     admittedAt: new Date().toLocaleString()
//                 });

//                 // 2. Remove from appointments collection
//                 await axios.delete(`http://localhost:5000/appointments/${patientData.id}`);

//                 // 3. Update local UI state
//                 setList(list.filter(item => item.id !== patientData.id));
//                 alert("Patient moved to Patients list successfully!");
//             } catch (error) {
//                 console.error("Error processing acceptance:", error);
//                 alert("Something went wrong!");
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <h3 style={{ marginBottom: '20px' }}>Pending Appointments</h3>

//             <div style={cardContainerStyle}>
//                 {list.map((item) => (
//                     <div 
//                         key={item.id} 
//                         style={cardStyle} 
//                         onClick={() => setSelectedPatient(item)}
//                     >
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                                 <FaUserCircle size={30} color="#007bff" />
//                                 <h4 style={{ margin: 0 }}>{item.fullName}</h4>
//                             </div>
                            
//                             {/* --- ACCEPT BUTTON --- */}
//                             <button 
//                                 onClick={(e) => handleAccept(e, item)}
//                                 style={acceptBtnStyle}
//                                 title="Accept Patient"
//                             >
//                                 <FaCheck style={{marginRight: '5px'}} /> Accept
//                             </button>
//                         </div>
//                         <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
//                             Dept: {item.department} | Click for details
//                         </p>
//                     </div>
//                 ))}
//             </div>

//             {/* --- DETAILS MODAL --- */}
//             {selectedPatient && (
//                 <div style={modalOverlayStyle}>
//                     <div style={modalContentStyle}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                             <h2 style={{ margin: 0, color: '#2c3e50' }}>Patient Details</h2>
//                             <FaTimes 
//                                 style={{ cursor: 'pointer', fontSize: '24px', color: '#95a5a6' }} 
//                                 onClick={() => setSelectedPatient(null)} 
//                             />
//                         </div>

//                         <div style={infoGrid}>
//                             <div style={infoBox}><strong>Name:</strong> {selectedPatient.fullName}</div>
//                             <div style={infoBox}><strong>Age:</strong> {selectedPatient.age}</div>
//                             <div style={infoBox}><strong>Contact:</strong> {selectedPatient.contact}</div>
//                             <div style={infoBox}><strong>Email:</strong> {selectedPatient.email}</div>
//                             <div style={infoBox}><strong>Dept:</strong> {selectedPatient.department}</div>
//                             <div style={infoBox}><strong>City:</strong> {selectedPatient.city}</div>
//                         </div>

//                         <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
//                             <strong>Address:</strong>
//                             <p style={{ color: '#7f8c8d' }}>{selectedPatient.address}</p>
//                         </div>

//                         <button 
//                             style={closeBtn} 
//                             onClick={() => setSelectedPatient(null)}
//                         >
//                             Close Details
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- STYLES ---
// const acceptBtnStyle = {
//     backgroundColor: '#28a745',
//     color: 'white',
//     border: 'none',
//     padding: '6px 12px',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     fontSize: '14px',
//     fontWeight: 'bold'
// };

// const cardContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' };
// const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', borderLeft: '5px solid #007bff' };
// const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
// const modalContentStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '600px', maxWidth: '90%' };
// const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
// const infoBox = { padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px', fontSize: '14px' };
// const closeBtn = { marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#34495e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

// export default Appoinment;

//////////////////////////////////////////////////////////////////////////////

import '../Appoinment/Appoinment.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHospital, FaCheck } from 'react-icons/fa';

const Appoinment = () => {
    const [list, setList] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = () => {
        axios.get('http://localhost:5000/appointments')
            .then(res => setList(res.data))
            .catch(err => console.log(err));
    };

    // --- ACCEPT AND MOVE TO PATIENTS ---
    const handleAccept = async (e, patient) => {
        e.stopPropagation(); // Stop the popup from opening
        const confirmAccept = window.confirm(`Do you want to accept ${patient.fullName} as a patient?`);
        
        if (confirmAccept) {
            try {
                // 1. Add to patients collection
                await axios.post('http://localhost:5000/patients', {
                    ...patient,
                    status: "Accepted",
                    admittedDate: new Date().toLocaleDateString()
                });

                // 2. Remove from appointments collection
                await axios.delete(`http://localhost:5000/appointments/${patient.id}`);

                // 3. Update local UI state
                setList(list.filter(item => item.id !== patient.id));
                alert("Patient moved to Patients list successfully!");
            } catch (error) {
                console.error("Error processing acceptance:", error);
                alert("Failed to accept patient.");
            }
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h3 style={{ marginBottom: '20px' }}>Pending Appointments</h3>

            <div style={cardContainerStyle}>
                {list.map((item) => (
                    <div key={item.id} style={cardStyle} onClick={() => setSelectedPatient(item)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaUserCircle size={30} color="#007bff" />
                                <h4 style={{ margin: 0 }}>{item.fullName}</h4>
                            </div>
                            
                            {/* ACCEPT BUTTON */}
                            <button 
                                onClick={(e) => handleAccept(e, item)} 
                                style={acceptBtnStyle}
                                title="Accept Patient"
                            >
                                <FaCheck />
                            </button>
                        </div>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>{item.department} Dept</p>
                    </div>
                ))}
            </div>

            {/* --- DETAILS POPUP (MODAL) --- */}
            {selectedPatient && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#2c3e50' }}>Patient Details</h2>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setSelectedPatient(null)} />
                        </div>

                        <div style={infoGrid}>
                            <div style={infoBox}><strong>Name:</strong> {selectedPatient.fullName}</div>
                            <div style={infoBox}><strong>Age:</strong> {selectedPatient.age}</div>
                            <div style={infoBox}><strong>Contact:</strong> {selectedPatient.contact}</div>
                            <div style={infoBox}><strong>Dept:</strong> {selectedPatient.department}</div>
                        </div>

                        <button style={closeBtn} onClick={() => setSelectedPatient(null)}>Close Details</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const acceptBtnStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: '0.3s'
};

const cardContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' };
const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', borderLeft: '5px solid #007bff' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '500px' };
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const infoBox = { padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' };
const closeBtn = { marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#34495e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default Appoinment;