// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaUserCircle, FaCalendarCheck, FaEnvelope, FaPhoneAlt, FaHospitalUser, FaSignOutAlt, FaPlus, FaTimes, FaBed } from 'react-icons/fa';

// const Patients = () => {
//     const [patients, setPatients] = useState([]);
//     const [showModal, setShowModal] = useState(false);
    
//     // --- ADMISSION STATES ---
//     const [showAdmitModal, setShowAdmitModal] = useState(false);
//     const [selectedPatient, setSelectedPatient] = useState(null);
//     const [roomType, setRoomType] = useState("");

//     // --- FORM DATA STATE ---
//     const [formData, setFormData] = useState({
//         fullName: '', age: '', contact: '', email: '',
//         country: 'India', state: '', city: '', address: '',
//         department: '', admittedAt: new Date().toISOString().split('T')[0]
//     });

//     const indiaStates = {
//         "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
//         "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
//         "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
//         "Delhi": ["New Delhi", "North Delhi"],
//         "Karnataka": ["Bangalore", "Mysore"]
//     };

//     const hospitalDepartments = ["Cardiology", "Orthopedic", "Neurology", "Pediatrics", "Dermatology", "Oncology", "ENT", "General Medicine"];
//     const roomTypes = ["ICU", "Private Room", "General Room", "General Ward"];

//     useEffect(() => {
//         fetchPatients();
//     }, []);

//     const fetchPatients = () => {
//         axios.get('http://localhost:5000/patients')
//             .then(res => setPatients(res.data))
//             .catch(err => console.log(err));
//     };

//     // Open Admission Popup
//     const handleAdmitClick = (patient) => {
//         setSelectedPatient(patient);
//         setShowAdmitModal(true);
//     };

//     // Process Admission
//     const processAdmission = async () => {
//         if (!roomType) {
//             alert("Please select a room type");
//             return;
//         }

//         const admissionData = {
//             ...selectedPatient,
//             roomType: roomType,
//             admissionStatus: "Admitted",
//             admissionTimestamp: new Date().toLocaleString()
//         };

//         try {
//             // Save to 'admitted' endpoint (which your Admit.js page will read)
//             await axios.post('http://localhost:5000/admitted', admissionData);
//             alert(`${selectedPatient.fullName} has been admitted to ${roomType} successfully!`);
//             setShowAdmitModal(false);
//             setRoomType("");
//         } catch (error) {
//             console.error("Error admitting patient:", error);
//         }
//     };

//     const handleDischarge = (id, name) => {
//         if (window.confirm(`Are you sure you want to discharge ${name}?`)) {
//             axios.delete(`http://localhost:5000/patients/${id}`)
//                 .then(() => {
//                     alert(`${name} discharged successfully!`);
//                     setPatients(prevPatients => prevPatients.filter(p => p.id !== id));
//                 })
//                 .catch(err => console.error(err));
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name === 'contact' && value.length > 10) return;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post('http://localhost:5000/patients', formData);
//             alert("Patient Registered Successfully!");
//             setShowModal(false);
//             fetchPatients();
//             setFormData({
//                 fullName: '', age: '', contact: '', email: '', 
//                 country: 'India', state: '', city: '', address: '', 
//                 department: '', admittedAt: new Date().toISOString().split('T')[0]
//             });
//         } catch (error) {
//             console.error("Error saving patient:", error);
//         }
//     };

//     const groupedPatients = patients.reduce((acc, patient) => {
//         const dept = patient.department || "General";
//         if (!acc[dept]) acc[dept] = [];
//         acc[dept].push(patient);
//         return acc;
//     }, {});

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            
//             <div style={headerSection}>
//                 <div>
//                     <h2 style={{ margin: 0, color: '#2c3e50' }}>Permanent Patients List</h2>
//                     <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Total Registered Patients: {patients.length}</p>
//                 </div>
                
//                 <button onClick={() => setShowModal(true)} style={addPatientBtnStyle}>
//                     <FaPlus style={{ marginRight: '8px' }} /> Patient
//                 </button>
//             </div>
            
//             {patients.length > 0 ? (
//                 Object.keys(groupedPatients).map((deptName) => (
//                     <div key={deptName} style={{ marginBottom: '40px' }}>
//                         <div style={deptHeaderStyle}>
//                             <h3 style={{ margin: 0, color: '#3182ce' }}>{deptName} Department</h3>
//                             <span style={countBadge}>{groupedPatients[deptName].length} Patients</span>
//                         </div>

//                         <div style={tableContainer}>
//                             <table style={tableStyle}>
//                                 <thead>
//                                     <tr style={headerRowStyle}>
//                                         <th style={thStyle}>Patient Name</th>
//                                         <th style={thStyle}>Contact Info</th>
//                                         <th style={thStyle}>Admission Date</th>
//                                         <th style={thStyle}>Actions</th> 
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {groupedPatients[deptName].map((patient) => (
//                                         <tr key={patient.id} style={rowStyle}>
//                                             <td style={tdStyle}>
//                                                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                                                     <FaUserCircle size={25} color="#28a745" />
//                                                     <span style={{ fontWeight: '600' }}>{patient.fullName}</span>
//                                                 </div>
//                                             </td>
//                                             <td style={tdStyle}>
//                                                 <div style={{ fontSize: '13px' }}>
//                                                     <div style={{ marginBottom: '4px' }}><FaPhoneAlt size={12} /> {patient.contact}</div>
//                                                     <div style={{ color: '#666' }}><FaEnvelope size={12} /> {patient.email}</div>
//                                                 </div>
//                                             </td>
//                                             <td style={tdStyle}>
//                                                 <div style={{ color: '#2c3e50' }}>
//                                                     <FaCalendarCheck size={14} style={{ marginRight: '5px' }} />
//                                                     {patient.admittedAt}
//                                                 </div>
//                                             </td>
//                                             <td style={tdStyle}>
//                                                 <div style={{ display: 'flex', gap: '10px' }}>
//                                                     {/* Admit Button */}
//                                                     <button onClick={() => handleAdmitClick(patient)} style={admitBtnStyle}>
//                                                         <FaHospitalUser style={{ marginRight: '5px' }} /> Admit
//                                                     </button>
//                                                     <button onClick={() => handleDischarge(patient.id, patient.fullName)} style={dischargeBtnStyle}>
//                                                         <FaSignOutAlt style={{ marginRight: '5px' }} /> Discharge
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
//                     <p>No accepted patients found in the database.</p>
//                 </div>
//             )}

//             {/* --- ADMISSION POPUP MODAL --- */}
//             {showAdmitModal && selectedPatient && (
//                 <div style={modalOverlay}>
//                     <div style={{...modalContent, width: '450px'}}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                             <h2 style={{ margin: 0, color: '#3182ce' }}>Admission Form</h2>
//                             <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowAdmitModal(false)} />
//                         </div>

//                         <div style={admitDetailBox}>
//                             <p><strong>Patient:</strong> {selectedPatient.fullName}</p>
//                             <p><strong>Age/Gender:</strong> {selectedPatient.age} Years</p>
//                             <p><strong>Department:</strong> {selectedPatient.department}</p>
//                             <p><strong>Contact:</strong> {selectedPatient.contact}</p>
//                         </div>

//                         <label style={{display:'block', marginBottom:'8px', fontWeight:'600'}}>Select Room Type:</label>
//                         <select 
//                             value={roomType} 
//                             onChange={(e) => setRoomType(e.target.value)}
//                             style={{...inputStyle, marginBottom: '20px'}}
//                         >
//                             <option value="">-- Choose Room --</option>
//                             {roomTypes.map(room => <option key={room} value={room}>{room}</option>)}
//                         </select>

//                         <button onClick={processAdmission} style={submitAdmitBtn}>
//                             <FaBed style={{marginRight:'8px'}}/> Confirm & Admit Patient
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* --- REGISTER PATIENT MODAL --- */}
//             {showModal && (
//                 <div style={modalOverlay}>
//                     <div style={modalContent}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                             <h2 style={{ margin: 0, color: '#007bff' }}>Register New Patient</h2>
//                             <FaTimes style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowModal(false)} />
//                         </div>
                        
//                         <form onSubmit={handleSubmit} style={formGrid}>
//                             <input type="text" name="fullName" placeholder="Patient Full Name" value={formData.fullName} onChange={handleInputChange} required style={inputStyle}/>
//                             <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required style={inputStyle}/>
//                             <input type="number" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleInputChange} required style={inputStyle}/>
//                             <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required style={inputStyle}/>
                            
//                             <select name="country" value={formData.country} onChange={handleInputChange} style={inputStyle}>
//                                 <option value="India">India</option>
//                             </select>

//                             <select name="state" value={formData.state} onChange={handleInputChange} required style={inputStyle}>
//                                 <option value="">Select State</option>
//                                 {Object.keys(indiaStates).map(state => <option key={state} value={state}>{state}</option>)}
//                             </select>

//                             <select name="city" value={formData.city} onChange={handleInputChange} required style={inputStyle} disabled={!formData.state}>
//                                 <option value="">Select City</option>
//                                 {formData.state && indiaStates[formData.state].map(city => <option key={city} value={city}>{city}</option>)}
//                             </select>

//                             <select name="department" value={formData.department} onChange={handleInputChange} required style={inputStyle}>
//                                 <option value="">Select Department</option>
//                                 {hospitalDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
//                             </select>

//                             <input type="date" name="admittedAt" value={formData.admittedAt} onChange={handleInputChange} required style={inputStyle}/>
//                             <textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleInputChange} required style={{...inputStyle, gridColumn: 'span 2', height: '60px'}}></textarea>
//                             <button type="submit" style={submitFormBtnStyle}>Register Patient</button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- NEW STYLES ---
// const admitDetailBox = {
//     backgroundColor: '#f8f9fa',
//     padding: '15px',
//     borderRadius: '8px',
//     marginBottom: '20px',
//     border: '1px solid #dee2e6',
//     fontSize: '14px',
//     lineHeight: '1.6'
// };

// const submitAdmitBtn = {
//     width: '100%',
//     padding: '12px',
//     backgroundColor: '#28a745',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center'
// };

// // --- EXISTING STYLES ---
// const addPatientBtnStyle = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s', };
// const headerSection = { marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' };
// const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
// const modalContent = { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' };
// const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
// const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' };
// const submitFormBtnStyle = { gridColumn: 'span 2', marginTop: '10px', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' };
// const admitBtnStyle = { backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' };
// const dischargeBtnStyle = { backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' };
// const deptHeaderStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', padding: '0 5px' };
// const countBadge = { backgroundColor: '#3182ce', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
// const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
// const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' };
// const thStyle = { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8f9fa', color: '#4a5568', fontWeight: '700', borderBottom: '2px solid #edf2f7', fontSize: '13px', textTransform: 'uppercase' };
// const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #f1f4f8', color: '#2d3748', fontSize: '14px' };
// const rowStyle = { transition: 'background-color 0.2s', };
// const headerRowStyle = { borderBottom: '2px solid #eee' };

// export default Patients;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarCheck, FaEnvelope, FaPhoneAlt, FaHospitalUser, FaSignOutAlt, FaPlus, FaTimes, FaBed } from 'react-icons/fa';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    
    // --- ADMISSION STATES ---
    const [showAdmitModal, setShowAdmitModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [roomType, setRoomType] = useState("");

    // --- FORM DATA STATE ---
    const [formData, setFormData] = useState({
        fullName: '', age: '', contact: '', email: '',
        country: 'India', state: '', city: '', address: '',
        department: '', admittedAt: new Date().toISOString().split('T')[0]
    });

    const indiaStates = {
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
        "Delhi": ["New Delhi", "North Delhi"],
        "Karnataka": ["Bangalore", "Mysore"]
    };

    const hospitalDepartments = ["Cardiology", "Orthopedic", "Neurology", "Pediatrics", "Dermatology", "Oncology", "ENT", "General Medicine"];
    const roomTypes = ["ICU", "Private Room", "General Room", "General Ward"];

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = () => {
        axios.get('http://localhost:5000/patients')
            .then(res => setPatients(res.data))
            .catch(err => console.log(err));
    };

    // Open Admission Popup
    const handleAdmitClick = (patient) => {
        setSelectedPatient(patient);
        setShowAdmitModal(true);
    };

    // --- UPDATED: Process Admission with Duplicate Check ---
    const processAdmission = async () => {
        if (!roomType) {
            alert("Please select a room type");
            return;
        }

        try {
            // 1. Check if patient is already in the admitted list
            const checkRes = await axios.get(`http://localhost:5000/admitted`);
            const isAlreadyAdmitted = checkRes.data.some(p => p.id === selectedPatient.id);

            if (isAlreadyAdmitted) {
                // Centered alert logic
                alert(`STOP! ${selectedPatient.fullName} is already admitted in the hospital.`);
                setShowAdmitModal(false);
                return;
            }

            // 2. If not admitted, proceed with admission
            const admissionData = {
                ...selectedPatient,
                roomType: roomType,
                admissionStatus: "Admitted",
                admissionTimestamp: new Date().toLocaleString()
            };

            await axios.post('http://localhost:5000/admitted', admissionData);
            alert(`${selectedPatient.fullName} has been admitted to ${roomType} successfully!`);
            setShowAdmitModal(false);
            setRoomType("");
        } catch (error) {
            console.error("Error admitting patient:", error);
        }
    };

    const handleDischarge = (id, name) => {
        if (window.confirm(`Are you sure you want to discharge ${name}?`)) {
            axios.delete(`http://localhost:5000/patients/${id}`)
                .then(() => {
                    alert(`${name} discharged successfully!`);
                    setPatients(prevPatients => prevPatients.filter(p => p.id !== id));
                })
                .catch(err => console.error(err));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'contact' && value.length > 10) return;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/patients', formData);
            alert("Patient Registered Successfully!");
            setShowModal(false);
            fetchPatients();
            setFormData({
                fullName: '', age: '', contact: '', email: '', 
                country: 'India', state: '', city: '', address: '', 
                department: '', admittedAt: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Error saving patient:", error);
        }
    };

    const groupedPatients = patients.reduce((acc, patient) => {
        const dept = patient.department || "General";
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(patient);
        return acc;
    }, {});

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            
            <div style={headerSection}>
                <div>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>Permanent Patients List</h2>
                    <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Total Registered Patients: {patients.length}</p>
                </div>
                
                <button onClick={() => setShowModal(true)} style={addPatientBtnStyle}>
                    <FaPlus style={{ marginRight: '8px' }} /> Patient
                </button>
            </div>
            
            {patients.length > 0 ? (
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
                                        <th style={thStyle}>Actions</th> 
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
                                                    <div style={{ marginBottom: '4px' }}><FaPhoneAlt size={12} /> {patient.contact}</div>
                                                    <div style={{ color: '#666' }}><FaEnvelope size={12} /> {patient.email}</div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ color: '#2c3e50' }}>
                                                    <FaCalendarCheck size={14} style={{ marginRight: '5px' }} />
                                                    {patient.admittedAt}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => handleAdmitClick(patient)} style={admitBtnStyle}>
                                                        <FaHospitalUser style={{ marginRight: '5px' }} /> Admit
                                                    </button>
                                                    <button onClick={() => handleDischarge(patient.id, patient.fullName)} style={dischargeBtnStyle}>
                                                        <FaSignOutAlt style={{ marginRight: '5px' }} /> Discharge
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
                    <p>No accepted patients found in the database.</p>
                </div>
            )}

            {/* --- ADMISSION POPUP MODAL --- */}
            {showAdmitModal && selectedPatient && (
                <div style={modalOverlay}>
                    <div style={{...modalContent, width: '450px'}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#3182ce' }}>Admission Form</h2>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowAdmitModal(false)} />
                        </div>

                        <div style={admitDetailBox}>
                            <p><strong>Patient:</strong> {selectedPatient.fullName}</p>
                            <p><strong>Age/Gender:</strong> {selectedPatient.age} Years</p>
                            <p><strong>Department:</strong> {selectedPatient.department}</p>
                            <p><strong>Contact:</strong> {selectedPatient.contact}</p>
                        </div>

                        <label style={{display:'block', marginBottom:'8px', fontWeight:'600'}}>Select Room Type:</label>
                        <select 
                            value={roomType} 
                            onChange={(e) => setRoomType(e.target.value)}
                            style={{...inputStyle, marginBottom: '20px'}}
                        >
                            <option value="">-- Choose Room --</option>
                            {roomTypes.map(room => <option key={room} value={room}>{room}</option>)}
                        </select>

                        <button onClick={processAdmission} style={submitAdmitBtn}>
                            <FaBed style={{marginRight:'8px'}}/> Confirm & Admit Patient
                        </button>
                    </div>
                </div>
            )}

            {/* --- REGISTER PATIENT MODAL --- */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#007bff' }}>Register New Patient</h2>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowModal(false)} />
                        </div>
                        
                        <form onSubmit={handleSubmit} style={formGrid}>
                            <input type="text" name="fullName" placeholder="Patient Full Name" value={formData.fullName} onChange={handleInputChange} required style={inputStyle}/>
                            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required style={inputStyle}/>
                            <input type="number" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleInputChange} required style={inputStyle}/>
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required style={inputStyle}/>
                            
                            <select name="country" value={formData.country} onChange={handleInputChange} style={inputStyle}>
                                <option value="India">India</option>
                            </select>

                            <select name="state" value={formData.state} onChange={handleInputChange} required style={inputStyle}>
                                <option value="">Select State</option>
                                {Object.keys(indiaStates).map(state => <option key={state} value={state}>{state}</option>)}
                            </select>

                            <select name="city" value={formData.city} onChange={handleInputChange} required style={inputStyle} disabled={!formData.state}>
                                <option value="">Select City</option>
                                {formData.state && indiaStates[formData.state].map(city => <option key={city} value={city}>{city}</option>)}
                            </select>

                            <select name="department" value={formData.department} onChange={handleInputChange} required style={inputStyle}>
                                <option value="">Select Department</option>
                                {hospitalDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>

                            <input type="date" name="admittedAt" value={formData.admittedAt} onChange={handleInputChange} required style={inputStyle}/>
                            <textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleInputChange} required style={{...inputStyle, gridColumn: 'span 2', height: '60px'}}></textarea>
                            <button type="submit" style={submitFormBtnStyle}>Register Patient</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const admitDetailBox = { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #dee2e6', fontSize: '14px', lineHeight: '1.6' };
const submitAdmitBtn = { width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const addPatientBtnStyle = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s', };
const headerSection = { marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
const modalContent = { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' };
const submitFormBtnStyle = { gridColumn: 'span 2', marginTop: '10px', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' };
const admitBtnStyle = { backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const dischargeBtnStyle = { backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const deptHeaderStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', padding: '0 5px' };
const countBadge = { backgroundColor: '#3182ce', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' };
const thStyle = { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8f9fa', color: '#4a5568', fontWeight: '700', borderBottom: '2px solid #edf2f7', fontSize: '13px', textTransform: 'uppercase' };
const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #f1f4f8', color: '#2d3748', fontSize: '14px' };
const rowStyle = { transition: 'background-color 0.2s', };
const headerRowStyle = { borderBottom: '2px solid #eee' };

export default Patients;