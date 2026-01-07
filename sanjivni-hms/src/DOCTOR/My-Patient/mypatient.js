import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCheck, FaPhoneAlt, FaEnvelope, FaUserCircle, FaFilePrescription, FaTimes, FaSave, FaHistory, FaFlask, FaHeartbeat, FaCheckSquare, FaBed, FaSignOutAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

const Mypatient = () => {
    const [myPatients, setMyPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [history, setHistory] = useState([]); 
    
    // --- ADMISSION STATES ---
    const [showAdmitModal, setShowAdmitModal] = useState(false);
    const [roomType, setRoomType] = useState("");
    const roomTypes = ["ICU", "Private Room", "General Room", "General Ward"];
    const roomCapacities = { "ICU": 10, "Private Room": 15, "General Room": 30, "General Ward": 50 };

    // --- LAB MODAL STATES ---
    const [showLabModal, setShowLabModal] = useState(false);
    const [availableReports, setAvailableReports] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);

    // --- 🔥 SURGERY MODAL STATES ---
    const [showSurgeryModal, setShowSurgeryModal] = useState(false);
    const [surgeryForm, setSurgeryForm] = useState({
        surgeryType: '',
        surgeryDate: '',
        surgeryTime: ''
    });

    const heartSurgeries = [
        "Coronary Artery Bypass Grafting (CABG)", "Coronary Angioplasty and Stenting", "Atherectomy",
        "Aortic Valve Replacement and Repair", "Mitral Valve Repair and Replacement", "Tricuspid Valve Replacement and Repair",
        "Pulmonary Valve Replacement and Repair", "Transcatheter Aortic Valve Replacement (TAVR)",
        "Implantable Cardioverter-Defibrillator (ICD) Insertion", "Pacemaker Insertion", "Catheter Ablation",
        "Heart Transplant", "Insertion of Ventricular Assist Devices (VAD)", "Repair of Congenital Heart Defects",
        "Aortic Aneurysm Repair", "Pericardiectomy", "Patent Foramen Ovale (PFO) / ASD Repair", "Robotic Heart Surgery"
    ];

    const [prescription, setPrescription] = useState({ diagnosis: '', medicines: '', advice: '' });
    const doctorName = localStorage.getItem('loggedInDoctorName');
    const doctorDept = localStorage.getItem('loggedInDoctorDept');

    useEffect(() => {
        fetchApprovedPatients();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowModal(false);
                setShowAdmitModal(false);
                setShowLabModal(false);
                setShowSurgeryModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const fetchApprovedPatients = () => {
        axios.get('http://localhost:5000/patients')
            .then(res => {
                const filtered = res.data.filter(p => 
                    p.doctorName === doctorName && p.status === 'Approved'
                );
                setMyPatients(filtered);
            })
            .catch(err => console.error("Error fetching approved patients:", err));
    };

    const fetchHistory = (patientId) => {
        axios.get(`http://localhost:5000/prescriptions?patientId=${patientId}`)
            .then(res => setHistory(res.data))
            .catch(err => console.error("Error fetching history:", err));
    };

    const handlePrescriptionClick = (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
        fetchHistory(patient.id); 
        setPrescription({ diagnosis: '', medicines: '', advice: '' });
    };

    const handleAdmitClick = (patient) => {
        setSelectedPatient(patient);
        setShowAdmitModal(true);
    };

    // 🔥 Trigger Surgery Modal
    const handleSurgeryClick = (patient) => {
        setSelectedPatient(patient);
        setShowSurgeryModal(true);
    };

    // 🔥 Updated Book Surgery Logic with Admission Verification
    const bookSurgerySubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. Fetch the list of currently admitted patients from the server
            const admitRes = await axios.get('http://localhost:5000/admitted');
            
            // 2. 🔥 Verification Logic: Check if the current patient's ID is in the admitted list
            const isAlreadyAdmitted = admitRes.data.some(p => p.id === selectedPatient.id);

            if (!isAlreadyAdmitted) {
                // 3. If not admitted, show alert and block the booking
                alert(`STOP! Surgery cannot be booked for ${selectedPatient.fullName} because they are NOT currently admitted. Please admit the patient first.`);
                setShowSurgeryModal(false);
                return; // Exit the function
            }

            // 4. If verification passes, proceed with booking the surgery
            const bookingData = {
                patientId: selectedPatient.id,
                patientName: selectedPatient.fullName,
                patientAge: selectedPatient.age,
                patientDept: selectedPatient.department,
                doctorName: doctorName,
                ...surgeryForm,
                bookedAt: new Date().toLocaleString(),
                status: "Scheduled"
            };

            await axios.post('http://localhost:5000/surgery', bookingData);
            alert(`Surgery Booked successfully for ${selectedPatient.fullName}`);
            setShowSurgeryModal(false);
            setSurgeryForm({ surgeryType: '', surgeryDate: '', surgeryTime: '' });
        } catch (err) {
            console.error("Booking Error:", err);
            alert("Error connecting to the server. Please try again.");
        }
    };

    const processAdmission = async () => {
        if (!roomType) { alert("Please select a room type"); return; }
        try {
            const checkRes = await axios.get('http://localhost:5000/admitted');
            if (checkRes.data.some(p => p.id === selectedPatient.id)) {
                alert(`STOP! ${selectedPatient.fullName} is already admitted.`);
                setShowAdmitModal(false);
                return;
            }
            const admissionData = { ...selectedPatient, roomType, admissionStatus: "Admitted", admissionTimestamp: new Date().toLocaleString() };
            await axios.post('http://localhost:5000/admitted', admissionData);
            alert("Patient Admitted Successfully!");
            setShowAdmitModal(false);
        } catch (error) { console.error(error); }
    };

    const savePrescription = async (e) => {
        e.preventDefault();
        const prescriptionData = { patientId: selectedPatient.id, patientName: selectedPatient.fullName, doctorName, date: new Date().toLocaleString(), ...prescription };
        try {
            await axios.post('http://localhost:5000/prescriptions', prescriptionData);
            alert("Prescription Saved!");
            fetchHistory(selectedPatient.id); 
            setPrescription({ diagnosis: '', medicines: '', advice: '' }); 
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={headerSection}>
                <h2 style={{ margin: 0, color: '#27ae60' }}>
                    <FaUserCheck style={{ marginRight: '10px' }} /> My Approved Patients
                </h2>
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
                        {myPatients.map((p) => (
                            <tr key={p.id} style={rowStyle}>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FaUserCircle size={25} color="#27ae60" />
                                        <div>
                                            <span style={{ fontWeight: '600', display: 'block' }}>{p.fullName}</span>
                                            <small style={{ color: '#7f8c8d' }}>Age: {p.age} | {p.department}</small>
                                        </div>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaPhoneAlt size={14} color="#2c3e50" />
                                            <span>{p.contact}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaEnvelope size={14} color="#7f8c8d" />
                                            <span style={{ color: '#7f8c8d' }}>{p.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaCalendarAlt size={16} color="#2c3e50" />
                                        <span>{p.admittedDate || 'Pending'}</span>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button style={prescBtn} onClick={() => handlePrescriptionClick(p)} title="Prescription"><FaFilePrescription /></button>
                                        <button style={admitBtn} onClick={() => handleAdmitClick(p)} title="Admit"><FaBed /></button> 
                                        <button style={surgeryBtn} onClick={() => handleSurgeryClick(p)} title="Schedule Surgery"><FaHeartbeat /></button>
                                        <button style={dischargeBtn} onClick={() => alert("Process in Admited page")} title="Discharge"><FaSignOutAlt /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- 🔥 NEW: SURGERY BOOKING MODAL --- */}
            {showSurgeryModal && selectedPatient && (
                <div style={modalOverlay}>
                    <div style={{...modalContent, width: '550px', position: 'relative'}}>
                        <FaTimes 
                            style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', fontSize: '20px' }} 
                            onClick={() => setShowSurgeryModal(false)} 
                        />
                        <h2 style={{color: '#e67e22', marginBottom: '20px'}}><FaHeartbeat /> Schedule Surgery</h2>
                        
                        <form onSubmit={bookSurgerySubmit}>
                            <div style={admitDetailBox}>
                                <p><b>Patient Name:</b> {selectedPatient.fullName}</p>
                                <p><b>Patient Age:</b> {selectedPatient.age} Years</p>
                                <p><b>Department:</b> {selectedPatient.department}</p>
                            </div>

                            <label style={labelStyle}>Select Type of Surgery</label>
                            <select 
                                style={inputStyle} 
                                required 
                                value={surgeryForm.surgeryType}
                                onChange={(e) => setSurgeryForm({...surgeryForm, surgeryType: e.target.value})}
                            >
                                <option value="">-- Choose Procedure --</option>
                                {heartSurgeries.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                            </select>

                            <div style={{display: 'flex', gap: '15px', marginTop: '10px'}}>
                                <div style={{flex: 1}}>
                                    <label style={labelStyle}>Select Date</label>
                                    <input type="date" style={inputStyle} required value={surgeryForm.surgeryDate}
                                        onChange={(e) => setSurgeryForm({...surgeryForm, surgeryDate: e.target.value})} />
                                </div>
                                <div style={{flex: 1}}>
                                    <label style={labelStyle}>Select Time</label>
                                    <input type="time" style={inputStyle} required value={surgeryForm.surgeryTime}
                                        onChange={(e) => setSurgeryForm({...surgeryForm, surgeryTime: e.target.value})} />
                                </div>
                            </div>

                            <button type="submit" style={{...submitBtn, backgroundColor: '#e67e22', marginTop: '20px'}}>
                                Confirm & Book Surgery
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- PRESCRIPTION MODAL --- */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={{ ...modalContent, width: '900px', display: 'flex', gap: '20px', maxHeight: '90vh', position: 'relative' }}>
                        <FaTimes style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', fontSize: '20px', color: '#666' }} onClick={() => setShowModal(false)} />
                        <div style={{ flex: 1.2 }}>
                            <h3>New Prescription</h3>
                            <form onSubmit={savePrescription}>
                                <label style={labelStyle}>Diagnosis</label>
                                <input style={inputStyle} required value={prescription.diagnosis} onChange={(e) => setPrescription({...prescription, diagnosis: e.target.value})} />
                                <label style={labelStyle}>Medicines</label>
                                <textarea style={{ ...inputStyle, height: '100px' }} required value={prescription.medicines} onChange={(e) => setPrescription({...prescription, medicines: e.target.value})} />
                                <button type="submit" style={submitBtn}><FaSave /> Save</button>
                            </form>
                        </div>
                        <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '20px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <FaHistory /> <h4 style={{ margin: 0 }}>History</h4>
                            </div>
                            {history.length > 0 ? [...history].reverse().map((h, i) => (
                                <div key={i} style={historyCard}><small>{h.date}</small><p>{h.diagnosis}</p></div>
                            )) : <p>No history found.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* --- ADMISSION MODAL --- */}
            {showAdmitModal && selectedPatient && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#16a085' }}><FaBed style={{marginRight: '10px'}}/> Admit Patient</h2>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowAdmitModal(false)} />
                        </div>
                        <div style={admitDetailBox}><p><b>Patient:</b> {selectedPatient.fullName}</p></div>
                        <select value={roomType} onChange={(e) => setRoomType(e.target.value)} style={inputStyle}>
                            <option value="">-- Choose Room --</option>
                            {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <button onClick={processAdmission} style={{...submitBtn, backgroundColor: '#16a085', marginTop: '15px'}}>Confirm Admission</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const admitDetailBox = { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee', fontSize: '14px' };
const prescBtn = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' };
const labBtn = { backgroundColor: '#8e44ad', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' };
const surgeryBtn = { backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' };
const admitBtn = { backgroundColor: '#16a085', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' };
const dischargeBtn = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' };
const historyCard = { backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #eee' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' };
const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const headerSection = { marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8f9fa', fontWeight: '700', borderBottom: '2px solid #edf2f7', fontSize: '13px' };
const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #f1f4f8', color: '#2d3748', fontSize: '14px' };
const rowStyle = { transition: 'background-color 0.2s' };
const headerRowStyle = { borderBottom: '2px solid #eee' };

export default Mypatient;