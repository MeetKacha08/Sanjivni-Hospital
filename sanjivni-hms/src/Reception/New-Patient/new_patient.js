// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaUser, FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHospitalUser, FaUserMd, FaPlusCircle, FaEraser } from 'react-icons/fa';

// const Newpatient = () => {
//     // --- STATE MANAGEMENT ---
//     const [doctors, setDoctors] = useState([]);
//     const stateData = {
//         "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
//         "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
//         "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
//         "Karnataka": ["Bangalore", "Mysore", "Hubli"]
//     };
//     const departments = ["Orthopedic", "Neurosurgery", "Cardiology", "Pediatrics", "Dermatology", "Oncology", "ENT"];
    
//     const initialState = {
//         fullName: '', age: '', contact: '', email: '',
//         country: 'India', state: '', city: '', address: '', department: '', doctorName: '' 
//     };
//     const [formData, setFormData] = useState(initialState);

//     // --- FETCH DOCTORS ---
//     useEffect(() => {
//         axios.get('http://localhost:5000/doctors')
//             .then(res => setDoctors(res.data))
//             .catch(err => console.error("Error loading doctors:", err));
//     }, []);

//     // --- FORM HANDLERS ---
//     const handleFormChange = (e) => {
//         const { name, value } = e.target;
//         if ((name === 'age' || name === 'contact') && value !== '' && !/^\d+$/.test(value)) return;
//         if (name === 'contact' && value.length > 10) return;
        
//         if (name === 'department') {
//             setFormData({ ...formData, [name]: value, doctorName: '' });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const patientData = {
//                 ...formData,
//                 status: "Accepted", 
//                 admittedAt: new Date().toLocaleDateString('en-GB'), 
//                 consultancyFees: 800
//             };

//             await axios.post('http://localhost:5000/patients', patientData);
//             alert('Patient registered successfully!');
//             setFormData(initialState);
//         } catch (error) {
//             console.error("Error booking appointment", error);
//         }
//     };

//     const handleClear = () => setFormData(initialState);

//     return (
//         <div style={pageWrapper}>
//             <div style={horizontalFormContainer}>
//                 <div style={formHeader}>
//                     <FaPlusCircle size={24} color="#3498db" />
//                     <h3 style={{ margin: 0 }}>Register New Patient</h3>
//                 </div>

//                 <form onSubmit={handleFormSubmit}>
//                     {/* SECTION 1: PERSONAL & CONTACT */}
//                     <div style={formSectionTitle}>Personal & Contact Details</div>
//                     <div style={formGridThree}>
//                         <div style={inputWrapper}>
//                             <label style={labelStyle}><FaUser style={iconStyle}/> Full Name</label>
//                             <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleFormChange} required style={newInputStyle}/>
//                         </div>
//                         <div style={inputWrapper}>
//                             <label style={labelStyle}><FaCalendarAlt style={iconStyle}/> Age</label>
//                             <input type="text" name="age" placeholder="e.g. 25" value={formData.age} onChange={handleFormChange} required style={newInputStyle}/>
//                         </div>
//                         <div style={inputWrapper}>
//                             <label style={labelStyle}><FaPhoneAlt style={iconStyle}/> Contact Number</label>
//                             <input type="text" name="contact" placeholder="10 digit number" value={formData.contact} onChange={handleFormChange} required style={newInputStyle}/>
//                         </div>
//                     </div>

//                     {/* SECTION 2: CLINICAL & LOCATION */}
//                     <div style={formSectionTitle}>Clinical Assignment & Location</div>
//                     <div style={formGridThree}>
//                          <div style={inputWrapper}>
//                             <label style={labelStyle}><FaEnvelope style={iconStyle}/> Email Address</label>
//                             <input type="email" name="email" placeholder="example@mail.com" value={formData.email} onChange={handleFormChange} required style={newInputStyle}/>
//                         </div>
//                         <div style={inputWrapper}>
//                             <label style={labelStyle}><FaHospitalUser style={iconStyle}/> Department</label>
//                             <select name="department" value={formData.department} onChange={handleFormChange} required style={newInputStyle}>
//                                 <option value="">Select Dept</option>
//                                 {departments.map(d => <option key={d} value={d}>{d}</option>)}
//                             </select>
//                         </div>
//                         <div style={inputWrapper}>
//                             <label style={labelStyle}><FaUserMd style={iconStyle}/> Assign Doctor</label>
//                             <select 
//                                 name="doctorName" 
//                                 value={formData.doctorName} 
//                                 onChange={handleFormChange} 
//                                 required 
//                                 style={newInputStyle}
//                                 disabled={!formData.department}
//                             >
//                                 <option value="">Choose Doctor</option>
//                                 {doctors
//                                     .filter(doc => doc.department === formData.department)
//                                     .map(filteredDoc => (
//                                         <option key={filteredDoc.id} value={filteredDoc.name}>
//                                             {filteredDoc.name}
//                                         </option>
//                                     ))
//                                 }
//                             </select>
//                         </div>
//                         <div style={inputWrapper}>
//                             <label style={labelStyle}><FaMapMarkerAlt style={iconStyle}/> State</label>
//                             <select name="state" value={formData.state} onChange={handleFormChange} required style={newInputStyle}>
//                                 <option value="">Select State</option>
//                                 {Object.keys(stateData).map(s => <option key={s} value={s}>{s}</option>)}
//                             </select>
//                         </div>
//                         <div style={inputWrapper}>
//                             <label style={labelStyle}><FaMapMarkerAlt style={iconStyle}/> City</label>
//                             <select name="city" value={formData.city} onChange={handleFormChange} required style={newInputStyle} disabled={!formData.state}>
//                                 <option value="">Select City</option>
//                                 {formData.state && stateData[formData.state].map(c => <option key={c} value={c}>{c}</option>)}
//                             </select>
//                         </div>
//                          <div style={inputWrapper}>
//                             <label style={labelStyle}><FaMapMarkerAlt style={iconStyle}/> Residential Address</label>
//                             <input type="text" name="address" placeholder="Street, Area, Landmark..." value={formData.address} onChange={handleFormChange} required style={newInputStyle}/>
//                         </div>
//                     </div>

//                     <div style={formActions}>
//                         <button type="submit" style={newSubmitBtn}>Confirm & Save Registration</button>
//                         <button type="button" onClick={handleClear} style={newClearBtn}><FaEraser /> Reset</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const pageWrapper = { 
//     padding: '20px', 
//     backgroundColor: '#f0f2f5', 
//     minHeight: '100vh', 
//     display: 'flex', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
// };

// const horizontalFormContainer = { 
//     maxWidth: '1100px', // Wider for horizontal fit
//     width: '95%', 
//     backgroundColor: '#fff', 
//     padding: '30px 40px', 
//     borderRadius: '15px', 
//     boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
//     border: '1px solid #e1e8ed' 
// };

// const formHeader = { 
//     display: 'flex', 
//     alignItems: 'center', 
//     gap: '12px', 
//     marginBottom: '20px', 
//     borderBottom: '2px solid #f1f4f8', 
//     paddingBottom: '10px', 
//     color: '#2c3e50' 
// };

// const formSectionTitle = { 
//     fontSize: '12px', 
//     fontWeight: 'bold', 
//     color: '#3498db', 
//     textTransform: 'uppercase', 
//     letterSpacing: '1px', 
//     marginBottom: '15px', 
//     marginTop: '10px' 
// };

// const formGridThree = { 
//     display: 'grid', 
//     gridTemplateColumns: 'repeat(3, 1fr)', // Force horizontal layout
//     gap: '20px', 
//     marginBottom: '10px' 
// };

// const inputWrapper = { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' };
// const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#546e7a', display: 'flex', alignItems: 'center' };
// const iconStyle = { marginRight: '8px', color: '#90a4ae' };
// const newInputStyle = { padding: '10px 12px', borderRadius: '8px', border: '1px solid #cfd8dc', fontSize: '14px', outline: 'none', backgroundColor: '#fafafa' };

// const formActions = { display: 'flex', gap: '20px', marginTop: '25px', justifyContent: 'flex-end' };
// const newSubmitBtn = { padding: '12px 40px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' };
// const newClearBtn = { padding: '12px 30px', backgroundColor: '#f8f9fa', color: '#546e7a', border: '1px solid #cfd8dc', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };

// export default Newpatient;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHospitalUser, FaUserMd, FaPlusCircle, FaEraser } from 'react-icons/fa';

const Newpatient = () => {
    // --- STATE MANAGEMENT ---
    const [doctors, setDoctors] = useState([]);
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

    // --- FETCH DOCTORS ---
    useEffect(() => {
        axios.get('http://localhost:5000/doctors')
            .then(res => setDoctors(res.data))
            .catch(err => console.error("Error loading doctors:", err));
    }, []);

    // --- FORM HANDLERS ---
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const patientData = {
                ...formData,
                status: "Accepted", 
                admittedAt: new Date().toLocaleDateString('en-GB'), 
                consultancyFees: 800
            };

            await axios.post('http://localhost:5000/patients', patientData);
            alert('Patient registered successfully!');
            setFormData(initialState);
        } catch (error) {
            console.error("Error booking appointment", error);
        }
    };

    const handleClear = () => setFormData(initialState);

    return (
        <div style={pageWrapper}>
            <div style={horizontalFormContainer}>
                <div style={formHeader}>
                    <FaPlusCircle size={24} color="#3498db" />
                    <h3 style={{ margin: 0 }}>Register New Patient</h3>
                </div>

                <form onSubmit={handleFormSubmit}>
                    {/* SECTION 1: PERSONAL & CONTACT */}
                    <div style={formSectionTitle}>Personal & Contact Details</div>
                    <div style={formGridThree}>
                        <div style={inputWrapper}>
                            <label style={labelStyle}><FaUser style={iconStyle}/> Full Name</label>
                            <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleFormChange} required style={newInputStyle}/>
                        </div>
                        <div style={inputWrapper}>
                            <label style={labelStyle}><FaCalendarAlt style={iconStyle}/> Age</label>
                            <input type="text" name="age" placeholder="e.g. 25" value={formData.age} onChange={handleFormChange} required style={newInputStyle}/>
                        </div>
                        <div style={inputWrapper}>
                            <label style={labelStyle}><FaPhoneAlt style={iconStyle}/> Contact Number</label>
                            <input type="text" name="contact" placeholder="10 digit number" value={formData.contact} onChange={handleFormChange} required style={newInputStyle}/>
                        </div>
                    </div>

                    {/* SECTION 2: CLINICAL & LOCATION */}
                    <div style={formSectionTitle}>Clinical Assignment & Location</div>
                    <div style={formGridThree}>
                         <div style={inputWrapper}>
                            <label style={labelStyle}><FaEnvelope style={iconStyle}/> Email Address</label>
                            <input type="email" name="email" placeholder="example@mail.com" value={formData.email} onChange={handleFormChange} required style={newInputStyle}/>
                        </div>
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
                         <div style={inputWrapper}>
                            <label style={labelStyle}><FaMapMarkerAlt style={iconStyle}/> Residential Address</label>
                            <input type="text" name="address" placeholder="Street, Area, Landmark..." value={formData.address} onChange={handleFormChange} required style={newInputStyle}/>
                        </div>
                    </div>

                    <div style={formActions}>
                        <button type="submit" style={newSubmitBtn}>Confirm & Save Registration</button>
                        <button type="button" onClick={handleClear} style={newClearBtn}><FaEraser /> Reset</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- STYLES ---
const pageWrapper = { 
    padding: '0 20px', // 🔥 Removed top/bottom padding (Only left/right)
    backgroundColor: '#f0f2f5', 
    minHeight: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'flex-start' // 🔥 Form stays at the very top
};

const horizontalFormContainer = { 
    maxWidth: '1100px', 
    width: '95%', 
    backgroundColor: '#fff', 
    padding: '30px 40px', 
    borderRadius: '0 0 15px 15px', // 🔥 Optional: removed top radius for flush look
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
    border: '1px solid #e1e8ed',
    borderTop: 'none' // 🔥 Optional: remove top border to stick to top
};

const formHeader = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    marginBottom: '20px', 
    borderBottom: '2px solid #f1f4f8', 
    paddingBottom: '10px', 
    color: '#2c3e50' 
};

const formSectionTitle = { 
    fontSize: '12px', 
    fontWeight: 'bold', 
    color: '#3498db', 
    textTransform: 'uppercase', 
    letterSpacing: '1px', 
    marginBottom: '15px', 
    marginTop: '10px' 
};

const formGridThree = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(3, 1fr)', 
    gap: '20px', 
    marginBottom: '10px' 
};

const inputWrapper = { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' };
const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#546e7a', display: 'flex', alignItems: 'center' };
const iconStyle = { marginRight: '8px', color: '#90a4ae' };
const newInputStyle = { padding: '10px 12px', borderRadius: '8px', border: '1px solid #cfd8dc', fontSize: '14px', outline: 'none', backgroundColor: '#fafafa' };

const formActions = { display: 'flex', gap: '20px', marginTop: '25px', justifyContent: 'flex-end' };
const newSubmitBtn = { padding: '12px 40px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' };
const newClearBtn = { padding: '12px 30px', backgroundColor: '#f8f9fa', color: '#546e7a', border: '1px solid #cfd8dc', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };

export default Newpatient;