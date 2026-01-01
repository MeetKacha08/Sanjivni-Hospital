import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGraduationCap, FaClock, FaCalendarAlt, FaStethoscope, FaTimes } from 'react-icons/fa';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    
    // --- FORM DATA STATE ---
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        contact: '',
        email: '',
        country: 'India',
        state: '',
        city: '',
        address: '',
        department: '', // This will be pre-filled
        admittedAt: new Date().toISOString().split('T')[0] 
    });

    const indiaStates = {
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
        "Delhi": ["New Delhi", "North Delhi"],
        "Karnataka": ["Bangalore", "Mysore"]
    };

    // Note: hospitalDepartments constant is no longer needed for a dropdown

    useEffect(() => {
        axios.get('http://localhost:5000/doctors')
            .then(res => setDoctors(res.data))
            .catch(err => console.error("Error fetching doctors:", err));
    }, []);

    const groupedDoctors = doctors.reduce((acc, doc) => {
        const dept = doc.department || "General";
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(doc);
        return acc;
    }, {});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'contact' && value.length > 10) return;
        setFormData({ ...formData, [name]: value });
    };

    const handleBookNowClick = (doctorDept) => {
        // Pre-fill the department from the clicked doctor card
        setFormData({ ...formData, department: doctorDept }); 
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/appointments', formData);
            alert("Appointment Booked Successfully!");
            setShowModal(false);
            // Reset form but keep the static defaults
            setFormData({
                fullName: '', age: '', contact: '', email: '', 
                country: 'India', state: '', city: '', address: '', 
                department: '', admittedAt: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Error saving appointment:", error);
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#2c3e50', fontSize: '2.5rem' }}>Meet Our Specialists</h1>
                <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>Choose a doctor and book your appointment in seconds.</p>
            </div>

            {Object.keys(groupedDoctors).map((deptName) => (
                <div key={deptName} style={{ marginBottom: '60px' }}>
                    <div style={deptHeaderContainer}>
                        <div style={deptLine}></div>
                        <h2 style={deptTitle}>{deptName} Department</h2>
                        <div style={deptLine}></div>
                    </div>

                    <div style={gridStyle}>
                        {groupedDoctors[deptName].map((doc) => (
                            <div key={doc.id} style={cardStyle}>
                                <div style={imageHeader}>
                                    <img src={`https://ui-avatars.com/api/?name=${doc.name}&background=007bff&color=fff&size=150`} alt="Doc" style={avatarStyle} />
                                    <div style={deptBadge}>{doc.department}</div>
                                </div>
                                <div style={contentStyle}>
                                    <h3 style={nameStyle}>{doc.name}</h3>
                                    <div style={detailItem}><FaGraduationCap style={iconStyle}/><span>{doc.education}</span></div>
                                    <div style={detailItem}><FaStethoscope style={iconStyle}/><span>{doc.experience} Experience</span></div>
                                    <div style={availabilityBox}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#95a5a6', marginBottom: '5px' }}>
                                            <FaCalendarAlt size={10} /> AVAILABLE DAYS
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#34495e' }}>{doc.availableDays.join(', ')}</div>
                                        <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: '600', color: '#2ecc71' }}>
                                            <FaClock size={12} /> {doc.availableHours}
                                        </div>
                                    </div>
                                    <button style={bookBtnStyle} onClick={() => handleBookNowClick(doc.department)}>
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#007bff' }}>Book Appointment</h2>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowModal(false)} />
                        </div>
                        
                        <form onSubmit={handleSubmit} style={formGrid}>
                            <input type="text" name="fullName" placeholder="Patient Full Name" value={formData.fullName} onChange={handleInputChange} required style={inputStyle}/>
                            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required style={inputStyle}/>
                            <input type="number" name="contact" placeholder="Contact Number (10 Digit)" value={formData.contact} onChange={handleInputChange} required style={inputStyle}/>
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

                            {/* UPDATED: Department is now an input field and readOnly (so user can't change it) */}
                            <div style={{ position: 'relative' }}>
                                <label style={{ fontSize: '11px', color: '#007bff', position: 'absolute', top: '-10px', left: '10px', background: '#fff', padding: '0 5px' }}>Selected Department</label>
                                <input 
                                    type="text" 
                                    name="department" 
                                    value={formData.department} 
                                    readOnly 
                                    style={{ ...inputStyle, backgroundColor: '#f9f9f9', cursor: 'not-allowed', color: '#555' }}
                                />
                            </div>

                            <input type="date" name="admittedAt" value={formData.admittedAt} onChange={handleInputChange} required style={inputStyle}/>
                            
                            <textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleInputChange} required style={{...inputStyle, gridColumn: 'span 2', height: '60px'}}></textarea>
                            
                            <button type="submit" style={{...bookBtnStyle, gridColumn: 'span 2', marginTop: '10px'}}>Submit Appointment</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles remain unchanged
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
const modalContent = { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' };
const deptHeaderContainer = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '40px' };
const deptTitle = { color: '#007bff', margin: 0, fontSize: '2rem', fontWeight: '700', textAlign: 'center' };
const deptLine = { flex: 1, height: '2px', backgroundColor: '#e1e8ed', maxWidth: '200px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease', border: '1px solid #e1e8ed' };
const imageHeader = { height: '140px', backgroundColor: '#007bff', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' };
const avatarStyle = { width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #fff', marginBottom: '-50px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const deptBadge = { position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', backdropFilter: 'blur(5px)' };
const contentStyle = { padding: '60px 20px 25px 20px', textAlign: 'center' };
const nameStyle = { margin: '0 0 15px 0', color: '#2c3e50', fontSize: '1.25rem' };
const detailItem = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#7f8c8d', fontSize: '14px', marginBottom: '8px' };
const iconStyle = { color: '#007bff' };
const availabilityBox = { backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', marginTop: '20px', textAlign: 'left' };
const bookBtnStyle = { marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' };

export default BookAppointment;
