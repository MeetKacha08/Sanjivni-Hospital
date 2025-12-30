import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaGraduationCap, FaStethoscope, FaClock, FaCalendarAlt, FaEnvelope, FaPhoneAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null); 
    const [showEditModal, setShowEditModal] = useState(false); 
    const [showAddModal, setShowAddModal] = useState(false); 
    const [editFormData, setEditFormData] = useState({}); 

    const initialFormState = {
        name: '', department: '', contact: '', email: '',
        experience: '', education: '', availableHours: '',
        loginId: '', password: '', availableDays: []
    };
    const [addFormData, setAddFormData] = useState(initialFormState);

    const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get('http://localhost:5000/doctors');
            setDoctors(res.data);
        } catch (error) {
            console.error("Error fetching doctors", error);
        }
    };

    // --- GROUPING LOGIC ---
    // This creates an object like { Cardiology: [doc1, doc2], Orthopedic: [doc3] }
    const categorizedDoctors = doctors.reduce((acc, doc) => {
        const dept = doc.department || "General";
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(doc);
        return acc;
    }, {});

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this doctor's record?")) {
            try {
                await axios.delete(`http://localhost:5000/doctors/${id}`);
                alert("Doctor deleted successfully!");
                setSelectedDoctor(null);
                fetchDoctors();
            } catch (error) {
                console.error("Error deleting doctor", error);
            }
        }
    };

    const handleEditClick = () => {
        setEditFormData(selectedDoctor);
        setShowEditModal(true);
    };

    const handleFormChange = (e, isAdd = false) => {
        const { name, value } = e.target;
        if (isAdd) {
            setAddFormData({ ...addFormData, [name]: value });
        } else {
            setEditFormData({ ...editFormData, [name]: value });
        }
    };

    const handleCheckboxChange = (day, isAdd = false) => {
        const targetData = isAdd ? addFormData : editFormData;
        let updatedDays = [...targetData.availableDays];
        if (updatedDays.includes(day)) {
            updatedDays = updatedDays.filter(d => d !== day);
        } else {
            updatedDays.push(day);
        }
        
        if (isAdd) {
            setAddFormData({ ...addFormData, availableDays: updatedDays });
        } else {
            setEditFormData({ ...editFormData, availableDays: updatedDays });
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/doctors/${editFormData.id}`, editFormData);
            alert("Doctor details updated successfully!");
            setShowEditModal(false);
            setSelectedDoctor(editFormData);
            fetchDoctors();
        } catch (error) {
            console.error("Error updating doctor", error);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/doctors`, addFormData);
            alert("New Doctor added successfully!");
            setShowAddModal(false);
            setAddFormData(initialFormState);
            fetchDoctors();
        } catch (error) {
            console.error("Error adding doctor", error);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh', position: 'relative' }}>
            
            <div style={addBtnContainer}>
                <button style={roundAddBtn} onClick={() => setShowAddModal(true)} title="Add Doctor">
                    <FaPlus />
                </button>
            </div>

            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Our Specialized Doctors</h2>
            
            {/* --- CATEGORIZED DOCTORS SECTION --- */}
            {Object.keys(categorizedDoctors).map((category) => (
                <div key={category} style={{ marginBottom: '40px' }}>
                    <h3 style={categoryHeaderStyle}>{category} Department</h3>
                    <div style={cardGridStyle}>
                        {categorizedDoctors[category].map((doc) => (
                            <div key={doc.id} style={cardStyle} onClick={() => setSelectedDoctor(doc)}>
                                <img src={`https://ui-avatars.com/api/?name=${doc.name}&background=random&size=200`} alt="Doctor" style={imageStyle} />
                                <div style={{ padding: '15px', textAlign: 'center' }}>
                                    <h3 style={{ margin: '10px 0 5px 0', color: '#2c3e50' }}>{doc.name}</h3>
                                    <div style={eduBadgeStyle}>
                                        <FaGraduationCap style={{ marginRight: '5px' }} /> {doc.education}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* --- DETAILS MODAL --- */}
            {selectedDoctor && !showEditModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <img src={`https://ui-avatars.com/api/?name=${selectedDoctor.name}&background=random&size=150`} alt="Doc" style={{ borderRadius: '10px', width: '120px' }} />
                                <div>
                                    <h2 style={{ margin: 0 }}>{selectedDoctor.name}</h2>
                                    <p style={{ color: '#007bff', fontSize: '18px' }}>{selectedDoctor.department}</p>
                                    <span style={experienceBadge}>{selectedDoctor.experience} Exp</span>
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                                <FaEdit style={{ cursor: 'pointer', fontSize: '22px', color: '#007bff' }} onClick={handleEditClick} title="Edit Doctor" />
                                <FaTrash style={{ cursor: 'pointer', fontSize: '20px', color: '#dc3545' }} onClick={() => handleDelete(selectedDoctor.id)} title="Delete Doctor" />
                                <FaTimes style={{ cursor: 'pointer', fontSize: '22px', color: '#666' }} onClick={() => setSelectedDoctor(null)} />
                            </div>
                        </div>
                        <hr style={{ margin: '20px 0' }} />
                        <div style={infoGridStyle}>
                            <div style={infoBox}><h4><FaGraduationCap /> Education</h4><p>{selectedDoctor.education}</p></div>
                            <div style={infoBox}><h4><FaClock /> Availability</h4><p>{selectedDoctor.availableHours}</p></div>
                            <div style={infoBox}><h4><FaCalendarAlt /> Working Days</h4><p>{selectedDoctor.availableDays.join(', ')}</p></div>
                            <div style={infoBox}><h4><FaEnvelope /> Email</h4><p>{selectedDoctor.email}</p></div>
                            <div style={infoBox}><h4><FaPhoneAlt /> Contact</h4><p>{selectedDoctor.contact}</p></div>
                            <div style={infoBox}><h4><FaStethoscope /> Login ID</h4><p>{selectedDoctor.loginId}</p></div>
                        </div>
                        <button style={closeBtnStyle} onClick={() => setSelectedDoctor(null)}>Close Details</button>
                    </div>
                </div>
            )}

            {/* --- EDIT FORM MODAL --- */}
            {showEditModal && (
                <div style={modalOverlayStyle}>
                    <div style={{...modalContentStyle, width: '600px'}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Edit Doctor Details</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowEditModal(false)} />
                        </div>
                        <form onSubmit={handleUpdateSubmit} style={{ marginTop: '15px' }}>
                            <div style={editGrid}>
                                <div style={inputGroup}><label>Full Name</label><input type="text" name="name" value={editFormData.name} onChange={(e) => handleFormChange(e)} style={inputStyle} /></div>
                                <div style={inputGroup}><label>Department</label><input type="text" name="department" value={editFormData.department} onChange={(e) => handleFormChange(e)} style={inputStyle} /></div>
                                <div style={inputGroup}><label>Contact</label><input type="text" name="contact" value={editFormData.contact} onChange={(e) => handleFormChange(e)} style={inputStyle} /></div>
                                <div style={inputGroup}><label>Email</label><input type="email" name="email" value={editFormData.email} onChange={(e) => handleFormChange(e)} style={inputStyle} /></div>
                                <div style={inputGroup}><label>Experience</label><input type="text" name="experience" value={editFormData.experience} onChange={(e) => handleFormChange(e)} style={inputStyle} /></div>
                                <div style={inputGroup}><label>Education</label><input type="text" name="education" value={editFormData.education} onChange={(e) => handleFormChange(e)} style={inputStyle} /></div>
                                <div style={inputGroup}><label>Available Hours</label><input type="text" name="availableHours" value={editFormData.availableHours} onChange={(e) => handleFormChange(e)} style={inputStyle} /></div>
                                <div style={inputGroup}><label>Login ID</label><input type="text" name="loginId" value={editFormData.loginId} onChange={(e) => handleFormChange(e)} style={inputStyle} /></div>
                            </div>
                            <div style={{ margin: '15px 0' }}>
                                <strong>Available Days:</strong><br />
                                {daysList.map(day => (
                                    <label key={day} style={{ marginRight: '10px', fontSize: '13px' }}>
                                        <input type="checkbox" checked={editFormData.availableDays?.includes(day)} onChange={() => handleCheckboxChange(day)} /> {day}
                                    </label>
                                ))}
                            </div>
                            <button type="submit" style={updateBtnStyle}>Update Doctor Details</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- ADD DOCTOR MODAL --- */}
            {showAddModal && (
                <div style={modalOverlayStyle}>
                    <div style={{...modalContentStyle, width: '600px'}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Add New Doctor</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowAddModal(false)} />
                        </div>
                        <form onSubmit={handleAddSubmit} style={{ marginTop: '15px' }}>
                            <div style={editGrid}>
                                <div style={inputGroup}><label>Full Name</label><input type="text" name="name" value={addFormData.name} onChange={(e) => handleFormChange(e, true)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Department</label><input type="text" name="department" value={addFormData.department} onChange={(e) => handleFormChange(e, true)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Contact</label><input type="text" name="contact" value={addFormData.contact} onChange={(e) => handleFormChange(e, true)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Email</label><input type="email" name="email" value={addFormData.email} onChange={(e) => handleFormChange(e, true)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Experience</label><input type="text" name="experience" value={addFormData.experience} onChange={(e) => handleFormChange(e, true)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Education</label><input type="text" name="education" value={addFormData.education} onChange={(e) => handleFormChange(e, true)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Available Hours</label><input type="text" name="availableHours" value={addFormData.availableHours} onChange={(e) => handleFormChange(e, true)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Login ID</label><input type="text" name="loginId" value={addFormData.loginId} onChange={(e) => handleFormChange(e, true)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Password</label><input type="password" name="password" value={addFormData.password} onChange={(e) => handleFormChange(e, true)} style={inputStyle} required /></div>
                            </div>
                            <div style={{ margin: '15px 0' }}>
                                <strong>Available Days:</strong><br />
                                {daysList.map(day => (
                                    <label key={day} style={{ marginRight: '10px', fontSize: '13px' }}>
                                        <input type="checkbox" checked={addFormData.availableDays.includes(day)} onChange={() => handleCheckboxChange(day, true)} /> {day}
                                    </label>
                                ))}
                            </div>
                            <button type="submit" style={addDoctorBtnStyle}>Add Doctor</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const categoryHeaderStyle = {
    padding: '10px 0',
    borderBottom: '2px solid #007bff',
    color: '#007bff',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
};
const addBtnContainer = { position: 'absolute', top: '20px', right: '30px', zIndex: 10 };
const roundAddBtn = { 
    width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#28a745', 
    color: 'white', border: 'none', cursor: 'pointer', fontSize: '20px', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
};
const cardGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', overflow: 'hidden' };
const imageStyle = { width: '100%', height: '200px', objectFit: 'cover' };
const eduBadgeStyle = { fontSize: '13px', color: '#666', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '700px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' };
const experienceBadge = { backgroundColor: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: '20px', fontSize: '14px' };
const infoGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const infoBox = { padding: '10px', borderBottom: '1px solid #f1f1f1' };
const closeBtnStyle = { marginTop: '25px', width: '100%', padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const editGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const updateBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const addDoctorBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default Doctors;