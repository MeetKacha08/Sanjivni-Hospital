// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaUserCircle, FaCalendarAlt, FaClock, FaHeartbeat, FaTrash, FaUserMd, FaEdit, FaTimes, FaSave, FaCheckCircle } from 'react-icons/fa';

// const Surgerybooking = () => {
//     const [surgeries, setSurgeries] = useState([]);
    
//     const heartSurgeries = [
//         "Coronary Artery Bypass Grafting (CABG)", "Coronary Angioplasty and Stenting", "Atherectomy",
//         "Aortic Valve Replacement and Repair", "Mitral Valve Repair and Replacement", "Tricuspid Valve Replacement and Repair",
//         "Pulmonary Valve Replacement and Repair", "Transcatheter Aortic Valve Replacement (TAVR)",
//         "Implantable Cardioverter-Defibrillator (ICD) Insertion", "Pacemaker Insertion", "Catheter Ablation",
//         "Heart Transplant", "Insertion of Ventricular Assist Devices (VAD)", "Repair of Congenital Heart Defects",
//         "Aortic Aneurysm Repair", "Pericardiectomy", "Patent Foramen Ovale (PFO) / ASD Repair", "Robotic Heart Surgery"
//     ];

//     const doctorName = localStorage.getItem('loggedInDoctorName');

//     const [showEditModal, setShowEditModal] = useState(false);
//     const [editingSurgery, setEditingSurgery] = useState(null);
//     const [editData, setEditData] = useState({ surgeryType: '', surgeryDate: '', surgeryTime: '' });

//     useEffect(() => {
//         fetchSurgeries();
//     }, []);

//     const fetchSurgeries = () => {
//         axios.get('http://localhost:5000/surgery')
//             .then(res => {
//                 const myScheduledSurgeries = res.data.filter(s => s.doctorName === doctorName);
//                 setSurgeries(myScheduledSurgeries);
//             })
//             .catch(err => console.error(err));
//     };

//     // 🔥 NEW FUNCTION: Handle Completion
//     const handleComplete = async (id) => {
//         if (window.confirm("Mark this surgery as Completed?")) {
//             try {
//                 // Update the status in the backend
//                 await axios.patch(`http://localhost:5000/surgery/${id}`, { status: 'Completed' });
//                 alert("Surgery Completed!");
//                 fetchSurgeries(); // Refresh data to show updated status
//             } catch (err) {
//                 console.error("Error completing surgery:", err);
//                 alert("Error updating status.");
//             }
//         }
//     };

//     const handleDelete = (id) => {
//         if (window.confirm("Cancel this scheduled surgery?")) {
//             axios.delete(`http://localhost:5000/surgery/${id}`)
//                 .then(() => fetchSurgeries());
//         }
//     };

//     const handleEditClick = (surgery) => {
//         setEditingSurgery(surgery);
//         setEditData({
//             surgeryType: surgery.surgeryType,
//             surgeryDate: surgery.surgeryDate,
//             surgeryTime: surgery.surgeryTime
//         });
//         setShowEditModal(true);
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.patch(`http://localhost:5000/surgery/${editingSurgery.id}`, editData);
//             alert("Surgery details updated successfully!");
//             setShowEditModal(false);
//             fetchSurgeries();
//         } catch (err) {
//             console.error("Update Error:", err);
//             alert("Failed to update details.");
//         }
//     };

//     const bookSurgerySubmit = async (selectedPatient, surgeryForm) => {
//         try {
//             const res = await axios.get('http://localhost:5000/surgery');
//             const surgeryExists = res.data.some(s => s.patientId === selectedPatient.id);

//             if (surgeryExists) {
//                 alert(`STOP! A surgery is already scheduled for ${selectedPatient.fullName}. You cannot book multiple surgeries for the same patient.`);
//                 return; 
//             }

//             const bookingData = {
//                 patientId: selectedPatient.id,
//                 patientName: selectedPatient.fullName,
//                 patientAge: selectedPatient.age,
//                 patientDept: selectedPatient.department,
//                 doctorName: doctorName,
//                 ...surgeryForm,
//                 bookedAt: new Date().toLocaleString(),
//                 status: "Scheduled"
//             };

//             await axios.post('http://localhost:5000/surgery', bookingData);
//             alert(`Surgery Booked successfully for ${selectedPatient.fullName}`);
//             fetchSurgeries();
//         } catch (err) {
//             console.error("Booking Error:", err);
//         }
//     };

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//             <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #e67e22', paddingBottom: '10px', marginBottom: '30px' }}>
//                 <FaHeartbeat /> My Scheduled Surgeries ({doctorName})
//             </h2>

//             {surgeries.length > 0 ? (
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
//                     {surgeries.map((s) => (
//                         <div key={s.id} style={cardStyle}>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                                     <FaUserCircle size={40} color={s.status === 'Completed' ? '#2ecc71' : '#e67e22'} />
//                                     <div>
//                                         <h3 style={{ margin: 0, fontSize: '18px' }}>{s.patientName}</h3>
//                                         <p style={{ margin: 0, color: '#7f8c8d', fontSize: '12px' }}>Age: {s.patientAge} | Dept: {s.patientDept}</p>
//                                     </div>
//                                 </div>
//                                 <div style={{ display: 'flex', gap: '10px' }}>
//                                     {/* 🔥 NEW COMPLETED BUTTON */}
//                                     {s.status !== 'Completed' && (
//                                         <button onClick={() => handleComplete(s.id)} style={completeBtnStyle} title="Mark as Completed">
//                                             <FaCheckCircle />
//                                         </button>
//                                     )}
                                    
//                                     <button onClick={() => handleEditClick(s)} style={editBtnStyle} title="Edit Schedule"><FaEdit /></button>
//                                     <button onClick={() => handleDelete(s.id)} style={deleteBtn}><FaTrash /></button>
//                                 </div>
//                             </div>
                            
//                             <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eee' }} />
                            
//                             <div style={{ marginBottom: '15px' }}>
//                                 <div style={{display: 'flex', justifyContent: 'space-between'}}>
//                                     <small style={{ color: '#e67e22', fontWeight: 'bold', textTransform: 'uppercase' }}>Procedure</small>
//                                     {/* Status Badge */}
//                                     {s.status === 'Completed' ? (
//                                         <small style={{ color: '#2ecc71', fontWeight: 'bold', border: '1px solid #2ecc71', padding: '2px 5px', borderRadius: '4px' }}>COMPLETED</small>
//                                     ) : (
//                                         <small style={{ color: '#f39c12', fontWeight: 'bold', border: '1px solid #f39c12', padding: '2px 5px', borderRadius: '4px' }}>SCHEDULED</small>
//                                     )}
//                                 </div>
//                                 <p style={{ margin: '5px 0', color: '#2d3748', fontWeight: '600' }}>{s.surgeryType}</p>
//                             </div>
                            
//                             <div style={{ display: 'flex', gap: '15px' }}>
//                                 <div style={badgeStyle}><FaCalendarAlt /> {s.surgeryDate}</div>
//                                 <div style={{...badgeStyle, backgroundColor: '#ebf8ff', color: '#3182ce'}}><FaClock /> {s.surgeryTime}</div>
//                             </div>

//                             <div style={{ marginTop: '15px', borderTop: '1px solid #f1f1f1', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                 <FaUserMd color="#95a5a6" />
//                                 <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Assigned Surgeon: <b>Dr. {s.doctorName}</b></span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
//                     <p>No surgeries are scheduled for your patients.</p>
//                 </div>
//             )}

//             {/* --- EDIT SCHEDULE MODAL --- */}
//             {showEditModal && (
//                 <div style={modalOverlay}>
//                     <div style={{...modalContent, width: '500px', alignSelf: 'flex-start', marginTop: '50px'}}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                             <h3 style={{ margin: 0, color: '#2c3e50' }}><FaEdit color="#e67e22" /> Edit Surgery Details</h3>
//                             <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowEditModal(false)} />
//                         </div>
                        
//                         <p style={{ fontSize: '14px', color: '#718096' }}>Patient: <b>{editingSurgery?.patientName}</b></p>
                        
//                         <form onSubmit={handleUpdate}>
//                             <label style={labelStyle}>Update Procedure Type</label>
//                             <select 
//                                 style={{...inputStyle, cursor: 'pointer'}} 
//                                 value={editData.surgeryType}
//                                 onChange={(e) => setEditData({...editData, surgeryType: e.target.value})}
//                                 required
//                             >
//                                 {heartSurgeries.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
//                             </select>

//                             <label style={labelStyle}>Update Date</label>
//                             <input 
//                                 type="date" 
//                                 style={inputStyle} 
//                                 value={editData.surgeryDate}
//                                 onChange={(e) => setEditData({...editData, surgeryDate: e.target.value})}
//                                 required
//                             />

//                             <label style={labelStyle}>Update Time</label>
//                             <input 
//                                 type="time" 
//                                 style={inputStyle} 
//                                 value={editData.surgeryTime}
//                                 onChange={(e) => setEditData({...editData, surgeryTime: e.target.value})}
//                                 required
//                             />

//                             <button type="submit" style={saveBtnStyle}>
//                                 <FaSave /> Update Surgery Info
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- STYLES ---
// const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' };
// const badgeStyle = { backgroundColor: '#fff4e6', color: '#e67e22', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };
// const deleteBtn = { backgroundColor: 'transparent', color: '#e74c3c', border: 'none', cursor: 'pointer', fontSize: '18px' };
// const editBtnStyle = { backgroundColor: 'transparent', color: '#3498db', border: 'none', cursor: 'pointer', fontSize: '18px' };
// // 🔥 NEW STYLE FOR COMPLETE BUTTON
// const completeBtnStyle = { backgroundColor: 'transparent', color: '#2ecc71', border: 'none', cursor: 'pointer', fontSize: '18px' };

// const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
// const modalContent = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
// const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', marginTop: '15px' };
// const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
// const saveBtnStyle = { width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };

// export default Surgerybooking;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarAlt, FaClock, FaHeartbeat, FaTrash, FaUserMd, FaEdit, FaTimes, FaSave, FaCheckCircle } from 'react-icons/fa';

const Surgerybooking = () => {
    const [surgeries, setSurgeries] = useState([]);
    
    const heartSurgeries = [
        "Coronary Artery Bypass Grafting (CABG)", "Coronary Angioplasty and Stenting", "Atherectomy",
        "Aortic Valve Replacement and Repair", "Mitral Valve Repair and Replacement", "Tricuspid Valve Replacement and Repair",
        "Pulmonary Valve Replacement and Repair", "Transcatheter Aortic Valve Replacement (TAVR)",
        "Implantable Cardioverter-Defibrillator (ICD) Insertion", "Pacemaker Insertion", "Catheter Ablation",
        "Heart Transplant", "Insertion of Ventricular Assist Devices (VAD)", "Repair of Congenital Heart Defects",
        "Aortic Aneurysm Repair", "Pericardiectomy", "Patent Foramen Ovale (PFO) / ASD Repair", "Robotic Heart Surgery"
    ];

    const doctorName = localStorage.getItem('loggedInDoctorName');

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSurgery, setEditingSurgery] = useState(null);
    const [editData, setEditData] = useState({ surgeryType: '', surgeryDate: '', surgeryTime: '' });

    useEffect(() => {
        fetchSurgeries();
    }, []);

    const fetchSurgeries = () => {
        axios.get('http://localhost:5000/surgery')
            .then(res => {
                const myScheduledSurgeries = res.data.filter(s => s.doctorName === doctorName);
                setSurgeries(myScheduledSurgeries);
            })
            .catch(err => console.error(err));
    };

    const handleComplete = async (id) => {
        if (window.confirm("Mark this surgery as Completed?")) {
            try {
                await axios.patch(`http://localhost:5000/surgery/${id}`, { status: 'Completed' });
                alert("Surgery Completed!");
                fetchSurgeries();
            } catch (err) {
                console.error("Error completing surgery:", err);
                alert("Error updating status.");
            }
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Cancel this scheduled surgery?")) {
            axios.delete(`http://localhost:5000/surgery/${id}`)
                .then(() => fetchSurgeries());
        }
    };

    const handleEditClick = (surgery) => {
        setEditingSurgery(surgery);
        setEditData({
            surgeryType: surgery.surgeryType,
            surgeryDate: surgery.surgeryDate,
            surgeryTime: surgery.surgeryTime
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/surgery/${editingSurgery.id}`, editData);
            alert("Surgery details updated successfully!");
            setShowEditModal(false);
            fetchSurgeries();
        } catch (err) {
            console.error("Update Error:", err);
            alert("Failed to update details.");
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #e67e22', paddingBottom: '10px', marginBottom: '30px' }}>
                <FaHeartbeat /> My Scheduled Surgeries ({doctorName})
            </h2>

            {surgeries.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {surgeries.map((s) => (
                        <div key={s.id} style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FaUserCircle size={40} color={s.status === 'Completed' ? '#2ecc71' : '#e67e22'} />
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '18px' }}>{s.patientName}</h3>
                                        <p style={{ margin: 0, color: '#7f8c8d', fontSize: '12px' }}>Age: {s.patientAge} | Dept: {s.patientDept}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {s.status !== 'Completed' && (
                                        <>
                                            <button onClick={() => handleComplete(s.id)} style={completeBtnStyle} title="Mark as Completed">
                                                <FaCheckCircle />
                                            </button>
                                            {/* Logic Changed Here: Edit button only shows if status is not Completed */}
                                            <button onClick={() => handleEditClick(s)} style={editBtnStyle} title="Edit Schedule">
                                                <FaEdit />
                                            </button>
                                        </>
                                    )}
                                    <button onClick={() => handleDelete(s.id)} style={deleteBtn}><FaTrash /></button>
                                </div>
                            </div>
                            
                            <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eee' }} />
                            
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <small style={{ color: '#e67e22', fontWeight: 'bold', textTransform: 'uppercase' }}>Procedure</small>
                                    {s.status === 'Completed' ? (
                                        <small style={{ color: '#2ecc71', fontWeight: 'bold', border: '1px solid #2ecc71', padding: '2px 5px', borderRadius: '4px' }}>COMPLETED</small>
                                    ) : (
                                        <small style={{ color: '#f39c12', fontWeight: 'bold', border: '1px solid #f39c12', padding: '2px 5px', borderRadius: '4px' }}>SCHEDULED</small>
                                    )}
                                </div>
                                <p style={{ margin: '5px 0', color: '#2d3748', fontWeight: '600' }}>{s.surgeryType}</p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={badgeStyle}><FaCalendarAlt /> {s.surgeryDate}</div>
                                <div style={{...badgeStyle, backgroundColor: '#ebf8ff', color: '#3182ce'}}><FaClock /> {s.surgeryTime}</div>
                            </div>

                            <div style={{ marginTop: '15px', borderTop: '1px solid #f1f1f1', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaUserMd color="#95a5a6" />
                                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Assigned Surgeon: <b>Dr. {s.doctorName}</b></span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
                    <p>No surgeries are scheduled for your patients.</p>
                </div>
            )}

            {showEditModal && (
                <div style={modalOverlay}>
                    <div style={{...modalContent, width: '500px', alignSelf: 'flex-start', marginTop: '50px'}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#2c3e50' }}><FaEdit color="#e67e22" /> Edit Surgery Details</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowEditModal(false)} />
                        </div>
                        
                        <p style={{ fontSize: '14px', color: '#718096' }}>Patient: <b>{editingSurgery?.patientName}</b></p>
                        
                        <form onSubmit={handleUpdate}>
                            <label style={labelStyle}>Update Procedure Type</label>
                            <select 
                                style={{...inputStyle, cursor: 'pointer'}} 
                                value={editData.surgeryType}
                                onChange={(e) => setEditData({...editData, surgeryType: e.target.value})}
                                required
                            >
                                {heartSurgeries.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                            </select>

                            <label style={labelStyle}>Update Date</label>
                            <input 
                                type="date" 
                                style={inputStyle} 
                                value={editData.surgeryDate}
                                onChange={(e) => setEditData({...editData, surgeryDate: e.target.value})}
                                required
                            />

                            <label style={labelStyle}>Update Time</label>
                            <input 
                                type="time" 
                                style={inputStyle} 
                                value={editData.surgeryTime}
                                onChange={(e) => setEditData({...editData, surgeryTime: e.target.value})}
                                required
                            />

                            <button type="submit" style={saveBtnStyle}>
                                <FaSave /> Update Surgery Info
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const badgeStyle = { backgroundColor: '#fff4e6', color: '#e67e22', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };
const deleteBtn = { backgroundColor: 'transparent', color: '#e74c3c', border: 'none', cursor: 'pointer', fontSize: '18px' };
const editBtnStyle = { backgroundColor: 'transparent', color: '#3498db', border: 'none', cursor: 'pointer', fontSize: '18px' };
const completeBtnStyle = { backgroundColor: 'transparent', color: '#2ecc71', border: 'none', cursor: 'pointer', fontSize: '18px' };

const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', marginTop: '15px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
const saveBtnStyle = { width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };

export default Surgerybooking;