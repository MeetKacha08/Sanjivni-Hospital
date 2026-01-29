import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarCheck, FaEnvelope, FaPhoneAlt, FaPlus, FaTimes } from 'react-icons/fa';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]); 
    const [showModal, setShowModal] = useState(false);

    // --- FORM DATA STATE ---
    const [formData, setFormData] = useState({
        fullName: '', age: '', contact: '', email: '',
        country: 'India', state: '', city: '', address: '',
        department: '', 
        doctorName: '', 
        admittedAt: new Date().toISOString().split('T')[0],
        consultancyFees: 800 
    });

    const indiaStates = {
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
        "Delhi": ["New Delhi", "North Delhi"],
        "Karnataka": ["Bangalore", "Mysore"]
    };

    useEffect(() => {
        fetchPatients();
        fetchDoctors(); 
    }, []);

    const fetchPatients = () => {
        axios.get('http://localhost:5000/patients')
            .then(res => setPatients(res.data))
            .catch(err => console.log(err));
    };

    const fetchDoctors = () => {
        axios.get('http://localhost:5000/doctors')
            .then(res => setDoctors(res.data))
            .catch(err => console.log("Error fetching doctors:", err));
    };

    const availableDepartments = [...new Set(doctors.map(doc => doc.department))];
    const filteredDoctors = doctors.filter(doc => doc.department === formData.department);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'contact' && value.length > 10) return;
        if (name === 'department') {
            setFormData({ ...formData, [name]: value, doctorName: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const patientData = {
            ...formData,
            status: "Accepted", 
            admittedDate: new Date().toLocaleDateString('en-GB') 
        };
        try {
            await axios.post('http://localhost:5000/patients', patientData);
            alert("Patient Registered!");
            setShowModal(false);
            fetchPatients();
        } catch (error) { console.error(error); }
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

            {Object.keys(groupedPatients).map((deptName) => (
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
                                                <div><FaPhoneAlt size={12} /> {patient.contact}</div>
                                                <div style={{ color: '#666' }}><FaEnvelope size={12} /> {patient.email}</div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <FaCalendarCheck size={14} style={{ marginRight: '5px' }} />
                                            {patient.admittedAt}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#007bff' }}>Register New Patient</h2>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowModal(false)} />
                        </div>
                        <form onSubmit={handleSubmit} style={formGrid}>
                            <input type="text" name="fullName" placeholder="Patient Full Name" value={formData.fullName} onChange={handleInputChange} required style={inputStyle} />
                            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required style={inputStyle} />
                            <input type="number" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleInputChange} required style={inputStyle} />
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required style={inputStyle} />
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
                                {availableDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>
                            <select name="doctorName" value={formData.doctorName} onChange={handleInputChange} required style={inputStyle} disabled={!formData.department}>
                                <option value="">Select Doctor</option>
                                {filteredDoctors.map(doc => <option key={doc.id} value={doc.name}>{doc.name}</option>)}
                            </select>
                            <input type="date" name="admittedAt" value={formData.admittedAt} onChange={handleInputChange} required style={inputStyle} />
                            <textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleInputChange} required style={{ ...inputStyle, gridColumn: 'span 2', height: '40px' }}></textarea>
                            <button type="submit" style={submitFormBtnStyle}>Register Patient</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const addPatientBtnStyle = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center' };
const headerSection = { marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
const modalContent = { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' };
const submitFormBtnStyle = { gridColumn: 'span 2', marginTop: '10px', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' };
const deptHeaderStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', padding: '0 5px' };
const countBadge = { backgroundColor: '#3182ce', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' };
const thStyle = { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8f9fa', color: '#4a5568', fontWeight: '700', borderBottom: '2px solid #edf2f7', fontSize: '13px' };
const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #f1f4f8', color: '#2d3748', fontSize: '14px' };
const rowStyle = { transition: 'background-color 0.2s', };
const headerRowStyle = { borderBottom: '2px solid #eee' };

export default Patients;