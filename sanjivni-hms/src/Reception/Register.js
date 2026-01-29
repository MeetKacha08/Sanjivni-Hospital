// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaCalendarAlt, FaTimes, FaUserCircle, FaCheck, FaTrashAlt, FaClipboardList, FaPlusCircle, FaSearch, FaUser, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHospitalUser, FaEraser, FaUserMd } from 'react-icons/fa';

// const Reception = () => {
//     // --- STATE MANAGEMENT ---
//     const [view, setView] = useState('list'); 
//     const [list, setList] = useState([]);
//     const [doctors, setDoctors] = useState([]); // 🔥 Added state for doctors
//     const [selectedPatient, setSelectedPatient] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');

//     const stateData = {
//         "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
//         "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
//         "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
//         "Karnataka": ["Bangalore", "Mysore", "Hubli"]
//     };
//     const departments = ["Orthopedic", "Neurosurgery", "Cardiology", "Pediatrics", "Dermatology", "Oncology", "ENT"];
//     const initialState = {
//         fullName: '', age: '', contact: '', email: '',
//         country: 'India', state: '', city: '', address: '', department: '', doctorName: '' // 🔥 Added doctorName
//     };
//     const [formData, setFormData] = useState(initialState);

//     // --- FETCH DATA ---
//     useEffect(() => {
//         fetchAppointments();
//         fetchDoctors(); // 🔥 Fetch doctors on load
//     }, []);

//     const fetchAppointments = () => {
//         axios.get('http://localhost:5000/appointments')
//             .then(res => setList(res.data))
//             .catch(err => console.log(err));
//     };

//     const fetchDoctors = () => {
//         axios.get('http://localhost:5000/doctors')
//             .then(res => setDoctors(res.data))
//             .catch(err => console.log(err));
//     };

//     const filteredList = list
//         .filter(item => 
//             item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
//             item.department.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//         .sort((a, b) => a.fullName.localeCompare(b.fullName));

//     const handleFormChange = (e) => {
//         const { name, value } = e.target;
//         if ((name === 'age' || name === 'contact') && value !== '' && !/^\d+$/.test(value)) return;
//         if (name === 'contact' && value.length > 10) return;
        
//         // 🔥 If department changes, reset doctor selection
//         if (name === 'department') {
//             setFormData({ ...formData, [name]: value, doctorName: '' });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post('http://localhost:5000/appointments', formData);
//             alert('Appointment booked successfully!');
//             setFormData(initialState);
//             fetchAppointments(); 
//             setView('list'); 
//         } catch (error) {
//             console.error("Error booking appointment", error);
//         }
//     };

//     const handleClear = () => setFormData(initialState);

//     const handleDeleteAll = async () => {
//         if (list.length === 0) { alert("No appointments to delete."); return; }
//         if (window.confirm("Are you sure you want to delete ALL pending appointments?")) {
//             try {
//                 const deleteRequests = list.map(item => axios.delete(`http://localhost:5000/appointments/${item.id}`));
//                 await Promise.all(deleteRequests);
//                 setList([]);
//                 alert("All appointments deleted!");
//             } catch (error) { console.error(error); }
//         }
//     };

//     const handleAccept = async (e, patient) => {
//         e.stopPropagation();
//         if (window.confirm(`Do you want to accept ${patient.fullName}?`)) {
//             try {
//                 await axios.post('http://localhost:5000/patients', {
//                     ...patient,
//                     status: "Accepted",
//                     admittedDate: new Date().toLocaleDateString()
//                 });
//                 await axios.delete(`http://localhost:5000/appointments/${patient.id}`);
//                 setList(list.filter(item => item.id !== patient.id));
//                 alert("Patient accepted!");
//             } catch (error) { console.error(error); }
//         }
//     };

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            
//             {/* NAVIGATION HEADER */}
//             <div style={receptionHeader}>
//                 <h2 style={{ margin: 0, whiteSpace: 'nowrap', color: '#2c3e50' }}>Reception Dashboard</h2>

//                 <div style={headerSearchContainer}>
//                     <FaSearch style={{ color: '#95a5a6' }} />
//                     <input 
//                         type="text" 
//                         placeholder="Quick search..." 
//                         style={searchInputStyle}
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>

//                 <div style={tabGroup}>
//                     <button style={view === 'list' ? activeTab : inactiveTab} onClick={() => setView('list')}>
//                         <FaClipboardList /> Pending List
//                     </button>
//                     <button style={view === 'form' ? activeTab : inactiveTab} onClick={() => setView('form')}>
//                         <FaPlusCircle /> New Appointment
//                     </button>
//                 </div>
//             </div>

//             {/* VIEW 1: LIST */}
//             {view === 'list' && (
//                 <div style={{ animation: 'fadeIn 0.5s' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
//                         <h3 style={{color: '#34495e'}}>Queue: {filteredList.length} Patients</h3>
//                         <button onClick={handleDeleteAll} style={deleteAllBtnStyle}>
//                             <FaTrashAlt /> Clear All
//                         </button>
//                     </div>

//                     <div style={cardGrid}>
//                         {filteredList.map((item) => (
//                             <div key={item.id} style={cardStyle} onClick={() => setSelectedPatient(item)}>
//                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                                         <FaUserCircle size={35} color="#3498db" />
//                                         <div>
//                                             <h4 style={{ margin: 0, color: '#2c3e50' }}>{item.fullName}</h4>
//                                             <small style={{ color: '#7f8c8d', fontWeight: '600' }}>{item.department.toUpperCase()}</small>
//                                         </div>
//                                     </div>
//                                     <button onClick={(e) => handleAccept(e, item)} style={acceptBtnStyle} title="Accept Patient">
//                                         <FaCheck />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* VIEW 2: FORM */}
//             {view === 'form' && (
//                 <div style={newFormContainer}>
//                     <div style={formHeader}>
//                         <FaPlusCircle size={24} color="#3498db" />
//                         <h3 style={{ margin: 0 }}>Register New Patient</h3>
//                     </div>

//                     <form onSubmit={handleFormSubmit}>
//                         <div style={formSectionTitle}>Personal Information</div>
//                         <div style={formRow}>
//                             <div style={inputWrapper}>
//                                 <label style={labelStyle}><FaUser style={iconStyle}/> Full Name</label>
//                                 <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleFormChange} required style={newInputStyle}/>
//                             </div>
//                             <div style={inputWrapper}>
//                                 <label style={labelStyle}><FaCalendarAlt style={iconStyle}/> Age</label>
//                                 <input type="text" name="age" placeholder="e.g. 25" value={formData.age} onChange={handleFormChange} required style={newInputStyle}/>
//                             </div>
//                         </div>

//                         <div style={formRow}>
//                             <div style={inputWrapper}>
//                                 <label style={labelStyle}><FaPhoneAlt style={iconStyle}/> Contact Number</label>
//                                 <input type="text" name="contact" placeholder="10 digit number" value={formData.contact} onChange={handleFormChange} required style={newInputStyle}/>
//                             </div>
//                             <div style={inputWrapper}>
//                                 <label style={labelStyle}><FaEnvelope style={iconStyle}/> Email Address</label>
//                                 <input type="email" name="email" placeholder="example@mail.com" value={formData.email} onChange={handleFormChange} required style={newInputStyle}/>
//                             </div>
//                         </div>

//                         <div style={formSectionTitle}>Clinical Details</div>
//                         <div style={formRow}>
//                             <div style={inputWrapper}>
//                                 <label style={labelStyle}><FaHospitalUser style={iconStyle}/> Department</label>
//                                 <select name="department" value={formData.department} onChange={handleFormChange} required style={newInputStyle}>
//                                     <option value="">Select Dept</option>
//                                     {departments.map(d => <option key={d} value={d}>{d}</option>)}
//                                 </select>
//                             </div>
//                             {/* 🔥 SELECT DOCTOR (Filtered by Dept) */}
//                             <div style={inputWrapper}>
//                                 <label style={labelStyle}><FaUserMd style={iconStyle}/> Assign Doctor</label>
//                                 <select 
//                                     name="doctorName" 
//                                     value={formData.doctorName} 
//                                     onChange={handleFormChange} 
//                                     required 
//                                     style={newInputStyle}
//                                     disabled={!formData.department}
//                                 >
//                                     <option value="">Choose Doctor</option>
//                                     {doctors
//                                         .filter(doc => doc.department === formData.department)
//                                         .map(filteredDoc => (
//                                             <option key={filteredDoc.id} value={filteredDoc.name}>
//                                                 {filteredDoc.name}
//                                             </option>
//                                         ))
//                                     }
//                                 </select>
//                             </div>
//                         </div>

//                         <div style={formSectionTitle}>Location Info</div>
//                         <div style={formRow}>
//                             <div style={inputWrapper}>
//                                 <label style={labelStyle}><FaMapMarkerAlt style={iconStyle}/> State</label>
//                                 <select name="state" value={formData.state} onChange={handleFormChange} required style={newInputStyle}>
//                                     <option value="">Select State</option>
//                                     {Object.keys(stateData).map(s => <option key={s} value={s}>{s}</option>)}
//                                 </select>
//                             </div>
//                             <div style={inputWrapper}>
//                                 <label style={labelStyle}><FaMapMarkerAlt style={iconStyle}/> City</label>
//                                 <select name="city" value={formData.city} onChange={handleFormChange} required style={newInputStyle} disabled={!formData.state}>
//                                     <option value="">Select City</option>
//                                     {formData.state && stateData[formData.state].map(c => <option key={c} value={c}>{c}</option>)}
//                                 </select>
//                             </div>
//                         </div>

//                         <div style={inputWrapper}>
//                             <label style={labelStyle}><FaMapMarkerAlt style={iconStyle}/> Residential Address</label>
//                             <textarea name="address" placeholder="Street, Area, Landmark..." value={formData.address} onChange={handleFormChange} required style={{...newInputStyle, height: '80px', resize: 'none'}}></textarea>
//                         </div>

//                         <div style={formActions}>
//                             <button type="submit" style={newSubmitBtn}>Confirm Registration</button>
//                             <button type="button" onClick={handleClear} style={newClearBtn}><FaEraser /> Reset</button>
//                         </div>
//                     </form>
//                 </div>
//             )}

//             {/* DETAIL MODAL */}
//             {selectedPatient && (
//                 <div style={modalOverlayStyle}>
//                     <div style={modalContentStyle}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                             <h2 style={{ margin: 0, color: '#2c3e50' }}>Patient Profile</h2>
//                             <FaTimes style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setSelectedPatient(null)} />
//                         </div>
//                         <div style={infoGrid}>
//                             <div style={infoBox}><strong>Name:</strong> {selectedPatient.fullName}</div>
//                             <div style={infoBox}><strong>Age:</strong> {selectedPatient.age}</div>
//                             <div style={infoBox}><strong>Phone:</strong> {selectedPatient.contact}</div>
//                             <div style={infoBox}><strong>Dept:</strong> {selectedPatient.department}</div>
//                             <div style={infoBox}><strong>Doctor:</strong> {selectedPatient.doctorName}</div>
//                             <div style={{...infoBox, gridColumn: 'span 2'}}><strong>Address:</strong> {selectedPatient.address}, {selectedPatient.city}, {selectedPatient.state}</div>
//                         </div>
//                         <button style={closeBtn} onClick={() => setSelectedPatient(null)}>Close</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- STYLES ---
// const receptionHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', gap: '20px' };
// const headerSearchContainer = { display: 'flex', alignItems: 'center', backgroundColor: '#f1f4f8', padding: '8px 15px', borderRadius: '25px', flex: 1, maxWidth: '350px', border: '1px solid #e2e8f0' };
// const searchInputStyle = { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px', background: 'transparent' };
// const tabGroup = { display: 'flex', gap: '10px' };
// const inactiveTab = { padding: '10px 18px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#eee', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '13px', transition: '0.3s' };
// const activeTab = { ...inactiveTab, backgroundColor: '#3498db', color: '#fff' };

// const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' };
// const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', borderTop: '4px solid #3498db', transition: 'transform 0.2s' };

// const newFormContainer = { maxWidth: '750px', margin: 'auto', backgroundColor: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', border: '1px solid #e1e8ed' };
// const formHeader = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', borderBottom: '2px solid #f1f4f8', paddingBottom: '15px', color: '#2c3e50' };
// const formSectionTitle = { fontSize: '14px', fontWeight: 'bold', color: '#3498db', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', marginTop: '10px' };
// const formRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' };
// const inputWrapper = { display: 'flex', flexDirection: 'column', gap: '6px' };
// const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#546e7a', display: 'flex', alignItems: 'center' };
// const iconStyle = { marginRight: '8px', color: '#90a4ae' };
// const newInputStyle = { padding: '12px 15px', borderRadius: '10px', border: '1px solid #cfd8dc', fontSize: '14px', transition: 'border 0.3s', outline: 'none', backgroundColor: '#fafafa' };

// const formActions = { display: 'flex', gap: '15px', marginTop: '30px' };
// const newSubmitBtn = { flex: 2, padding: '14px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)' };
// const newClearBtn = { flex: 1, padding: '14px', backgroundColor: '#f8f9fa', color: '#546e7a', border: '1px solid #cfd8dc', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };

// const deleteAllBtnStyle = { backgroundColor: '#fff', color: '#e74c3c', border: '1px solid #e74c3c', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' };
// const acceptBtnStyle = { backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', width: '38px', height: '38px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px rgba(46, 204, 113, 0.2)' };

// const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
// const modalContentStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '550px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' };
// const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
// const infoBox = { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '12px', fontSize: '14px', border: '1px solid #edf2f7' };
// const closeBtn = { marginTop: '25px', width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };

// export default Reception;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaTimes, FaUserCircle, FaCheck, FaTrashAlt, FaClipboardList, FaPlusCircle, FaSearch, FaUser, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHospitalUser, FaEraser, FaUserMd } from 'react-icons/fa';

const Reception = () => {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState('list'); 
    const [list, setList] = useState([]);
    const [doctors, setDoctors] = useState([]); 
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const stateData = {
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
        "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli"]
    };
    const departments = ["Orthopedic", "Neurosurgery", "Cardiology", "Pediatrics", "Dermatology", "Oncology", "ENT"];
    const initialState = {
        fullName: '', age: '', contact: '', email: '',
        country: 'India', state: '', city: '', address: '', department: '', doctorName: '' 
    };
    const [formData, setFormData] = useState(initialState);

    // --- FETCH DATA ---
    useEffect(() => {
        fetchAppointments();
        fetchDoctors(); 
    }, []);

    const fetchAppointments = () => {
        axios.get('http://localhost:5000/appointments')
            .then(res => setList(res.data))
            .catch(err => console.log(err));
    };

    const fetchDoctors = () => {
        axios.get('http://localhost:5000/doctors')
            .then(res => setDoctors(res.data))
            .catch(err => console.log(err));
    };

    const filteredList = list
        .filter(item => 
            item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.department.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.fullName.localeCompare(b.fullName));

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if ((name === 'age' || name === 'contact') && value !== '' && !/^\d+$/.test(value)) return;
        if (name === 'contact' && value.length > 10) return;
        
        if (name === 'department') {
            setFormData({ ...formData, [name]: value, doctorName: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // 🔥 UPDATED: This now posts directly to the /patients endpoint
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const patientData = {
                ...formData,
                status: "Accepted", // Matches Patients.js logic
                admittedAt: new Date().toLocaleDateString('en-GB'), // Matches Patients.js date format
                consultancyFees: 800
            };

            await axios.post('http://localhost:5000/patients', patientData);
            alert('Patient registered successfully and added to Patients List!');
            setFormData(initialState);
            fetchAppointments(); 
            setView('list'); 
        } catch (error) {
            console.error("Error booking appointment", error);
        }
    };

    const handleClear = () => setFormData(initialState);

    const handleDeleteAll = async () => {
        if (list.length === 0) { alert("No appointments to delete."); return; }
        if (window.confirm("Are you sure you want to delete ALL pending appointments?")) {
            try {
                const deleteRequests = list.map(item => axios.delete(`http://localhost:5000/appointments/${item.id}`));
                await Promise.all(deleteRequests);
                setList([]);
                alert("All appointments deleted!");
            } catch (error) { console.error(error); }
        }
    };

    const handleAccept = async (e, patient) => {
        e.stopPropagation();
        if (window.confirm(`Do you want to accept ${patient.fullName}?`)) {
            try {
                await axios.post('http://localhost:5000/patients', {
                    ...patient,
                    status: "Accepted",
                    admittedDate: new Date().toLocaleDateString()
                });
                await axios.delete(`http://localhost:5000/appointments/${patient.id}`);
                setList(list.filter(item => item.id !== patient.id));
                alert("Patient accepted!");
            } catch (error) { console.error(error); }
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            
            {/* NAVIGATION HEADER */}
            <div style={receptionHeader}>
                <h2 style={{ margin: 0, whiteSpace: 'nowrap', color: '#2c3e50' }}>Reception Dashboard</h2>

                <div style={headerSearchContainer}>
                    <FaSearch style={{ color: '#95a5a6' }} />
                    <input 
                        type="text" 
                        placeholder="Quick search..." 
                        style={searchInputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={tabGroup}>
                    <button style={view === 'list' ? activeTab : inactiveTab} onClick={() => setView('list')}>
                        <FaClipboardList /> Pending List
                    </button>
                    <button style={view === 'form' ? activeTab : inactiveTab} onClick={() => setView('form')}>
                        <FaPlusCircle /> New Appointment
                    </button>
                </div>
            </div>

            {/* VIEW 1: LIST */}
            {view === 'list' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <h3 style={{color: '#34495e'}}>Queue: {filteredList.length} Patients</h3>
                        <button onClick={handleDeleteAll} style={deleteAllBtnStyle}>
                            <FaTrashAlt /> Clear All
                        </button>
                    </div>

                    <div style={cardGrid}>
                        {filteredList.map((item) => (
                            <div key={item.id} style={cardStyle} onClick={() => setSelectedPatient(item)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FaUserCircle size={35} color="#3498db" />
                                        <div>
                                            <h4 style={{ margin: 0, color: '#2c3e50' }}>{item.fullName}</h4>
                                            <small style={{ color: '#7f8c8d', fontWeight: '600' }}>{item.department.toUpperCase()}</small>
                                        </div>
                                    </div>
                                    <button onClick={(e) => handleAccept(e, item)} style={acceptBtnStyle} title="Accept Patient">
                                        <FaCheck />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VIEW 2: FORM */}
            {view === 'form' && (
                <div style={newFormContainer}>
                    <div style={formHeader}>
                        <FaPlusCircle size={24} color="#3498db" />
                        <h3 style={{ margin: 0 }}>Register New Patient</h3>
                    </div>

                    <form onSubmit={handleFormSubmit}>
                        <div style={formSectionTitle}>Personal Information</div>
                        <div style={formRow}>
                            <div style={inputWrapper}>
                                <label style={labelStyle}><FaUser style={iconStyle}/> Full Name</label>
                                <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleFormChange} required style={newInputStyle}/>
                            </div>
                            <div style={inputWrapper}>
                                <label style={labelStyle}><FaCalendarAlt style={iconStyle}/> Age</label>
                                <input type="text" name="age" placeholder="e.g. 25" value={formData.age} onChange={handleFormChange} required style={newInputStyle}/>
                            </div>
                        </div>

                        <div style={formRow}>
                            <div style={inputWrapper}>
                                <label style={labelStyle}><FaPhoneAlt style={iconStyle}/> Contact Number</label>
                                <input type="text" name="contact" placeholder="10 digit number" value={formData.contact} onChange={handleFormChange} required style={newInputStyle}/>
                            </div>
                            <div style={inputWrapper}>
                                <label style={labelStyle}><FaEnvelope style={iconStyle}/> Email Address</label>
                                <input type="email" name="email" placeholder="example@mail.com" value={formData.email} onChange={handleFormChange} required style={newInputStyle}/>
                            </div>
                        </div>

                        <div style={formSectionTitle}>Clinical Details</div>
                        <div style={formRow}>
                            <div style={inputWrapper}>
                                <label style={labelStyle}><FaHospitalUser style={iconStyle}/> Department</label>
                                <select name="department" value={formData.department} onChange={handleFormChange} required style={newInputStyle}>
                                    <option value="">Select Dept</option>
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div style={inputWrapper}>
                                <label style={labelStyle}><FaUserMd style={iconStyle}/> Assign Doctor</label>
                                <select 
                                    name="doctorName" 
                                    value={formData.doctorName} 
                                    onChange={handleFormChange} 
                                    required 
                                    style={newInputStyle}
                                    disabled={!formData.department}
                                >
                                    <option value="">Choose Doctor</option>
                                    {doctors
                                        .filter(doc => doc.department === formData.department)
                                        .map(filteredDoc => (
                                            <option key={filteredDoc.id} value={filteredDoc.name}>
                                                {filteredDoc.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        <div style={formSectionTitle}>Location Info</div>
                        <div style={formRow}>
                            <div style={inputWrapper}>
                                <label style={labelStyle}><FaMapMarkerAlt style={iconStyle}/> State</label>
                                <select name="state" value={formData.state} onChange={handleFormChange} required style={newInputStyle}>
                                    <option value="">Select State</option>
                                    {Object.keys(stateData).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div style={inputWrapper}>
                                <label style={labelStyle}><FaMapMarkerAlt style={iconStyle}/> City</label>
                                <select name="city" value={formData.city} onChange={handleFormChange} required style={newInputStyle} disabled={!formData.state}>
                                    <option value="">Select City</option>
                                    {formData.state && stateData[formData.state].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={inputWrapper}>
                            <label style={labelStyle}><FaMapMarkerAlt style={iconStyle}/> Residential Address</label>
                            <textarea name="address" placeholder="Street, Area, Landmark..." value={formData.address} onChange={handleFormChange} required style={{...newInputStyle, height: '80px', resize: 'none'}}></textarea>
                        </div>

                        <div style={formActions}>
                            <button type="submit" style={newSubmitBtn}>Confirm Registration</button>
                            <button type="button" onClick={handleClear} style={newClearBtn}><FaEraser /> Reset</button>
                        </div>
                    </form>
                </div>
            )}

            {/* DETAIL MODAL */}
            {selectedPatient && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#2c3e50' }}>Patient Profile</h2>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setSelectedPatient(null)} />
                        </div>
                        <div style={infoGrid}>
                            <div style={infoBox}><strong>Name:</strong> {selectedPatient.fullName}</div>
                            <div style={infoBox}><strong>Age:</strong> {selectedPatient.age}</div>
                            <div style={infoBox}><strong>Phone:</strong> {selectedPatient.contact}</div>
                            <div style={infoBox}><strong>Dept:</strong> {selectedPatient.department}</div>
                            <div style={infoBox}><strong>Doctor:</strong> {selectedPatient.doctorName}</div>
                            <div style={{...infoBox, gridColumn: 'span 2'}}><strong>Address:</strong> {selectedPatient.address}, {selectedPatient.city}, {selectedPatient.state}</div>
                        </div>
                        <button style={closeBtn} onClick={() => setSelectedPatient(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const receptionHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', gap: '20px' };
const headerSearchContainer = { display: 'flex', alignItems: 'center', backgroundColor: '#f1f4f8', padding: '8px 15px', borderRadius: '25px', flex: 1, maxWidth: '350px', border: '1px solid #e2e8f0' };
const searchInputStyle = { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px', background: 'transparent' };
const tabGroup = { display: 'flex', gap: '10px' };
const inactiveTab = { padding: '10px 18px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#eee', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '13px', transition: '0.3s' };
const activeTab = { ...inactiveTab, backgroundColor: '#3498db', color: '#fff' };
const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' };
const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', borderTop: '4px solid #3498db', transition: 'transform 0.2s' };
const newFormContainer = { maxWidth: '750px', margin: 'auto', backgroundColor: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', border: '1px solid #e1e8ed' };
const formHeader = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', borderBottom: '2px solid #f1f4f8', paddingBottom: '15px', color: '#2c3e50' };
const formSectionTitle = { fontSize: '14px', fontWeight: 'bold', color: '#3498db', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', marginTop: '10px' };
const formRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' };
const inputWrapper = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#546e7a', display: 'flex', alignItems: 'center' };
const iconStyle = { marginRight: '8px', color: '#90a4ae' };
const newInputStyle = { padding: '12px 15px', borderRadius: '10px', border: '1px solid #cfd8dc', fontSize: '14px', transition: 'border 0.3s', outline: 'none', backgroundColor: '#fafafa' };
const formActions = { display: 'flex', gap: '15px', marginTop: '30px' };
const newSubmitBtn = { flex: 2, padding: '14px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)' };
const newClearBtn = { flex: 1, padding: '14px', backgroundColor: '#f8f9fa', color: '#546e7a', border: '1px solid #cfd8dc', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const deleteAllBtnStyle = { backgroundColor: '#fff', color: '#e74c3c', border: '1px solid #e74c3c', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' };
const acceptBtnStyle = { backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', width: '38px', height: '38px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px rgba(46, 204, 113, 0.2)' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '550px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' };
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const infoBox = { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '12px', fontSize: '14px', border: '1px solid #edf2f7' };
const closeBtn = { marginTop: '25px', width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };

export default Reception;