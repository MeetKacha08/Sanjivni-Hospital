import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCheck, FaPhoneAlt, FaEnvelope, FaUserCircle, FaFilePrescription, FaTimes, FaSave, FaHistory, FaFlask, FaHeartbeat, FaCheckSquare, FaBed, FaSignOutAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

const Mypatient = () => {
    const [myPatients, setMyPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [history, setHistory] = useState([]); 
    
    // --- LAB MODAL STATES ---
    const [showLabModal, setShowLabModal] = useState(false);
    const [availableReports, setAvailableReports] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);

    // --- 🔥 SURGERY MODAL STATES ---
    const [showSurgeryModal, setShowSurgeryModal] = useState(false);
    const [availableSurgeryTypes, setAvailableSurgeryTypes] = useState([]);
    const [surgeryForm, setSurgeryForm] = useState({
        surgeryName: '',
        surgeryDate: '',
        timeSlot: ''
    });

    const [prescription, setPrescription] = useState({ diagnosis: '', medicines: '', advice: '' });
    const doctorName = localStorage.getItem('loggedInDoctorName');
    const doctorDept = localStorage.getItem('loggedInDoctorDept'); // Ensure this is in localStorage

    useEffect(() => {
        fetchApprovedPatients();
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

    const handleLaboratoryClick = async (patient) => {
        setSelectedPatient(patient);
        setSelectedReports([]); 
        try {
            const res = await axios.get('http://localhost:5000/reports');
            setAvailableReports(res.data);
            setShowLabModal(true);
        } catch (err) { console.error(err); }
    };

    // 🔥 UPDATED: Surgery Click Logic
    const handleSurgeryClick = async (patient) => {
        setSelectedPatient(patient);
        setSurgeryForm({ surgeryName: '', surgeryDate: '', timeSlot: '' });
        try {
            // Fetch surgery types. We filter by doctor's department.
            const res = await axios.get('http://localhost:5000/surgeryTypes');
            const deptSurgeries = res.data.filter(s => s.dept === doctorDept);
            setAvailableSurgeryTypes(deptSurgeries);
            setShowSurgeryModal(true);
        } catch (err) {
            console.error("Error fetching surgery types:", err);
            // Fallback if endpoint doesn't exist yet
            setAvailableSurgeryTypes([{id: 1, name: "General Surgery"}]);
            setShowSurgeryModal(true);
        }
    };

    const scheduleSurgerySubmit = async (e) => {
        e.preventDefault();
        const surgeryOrder = {
            patientId: selectedPatient.id,
            patientName: selectedPatient.fullName,
            doctorName: doctorName,
            department: doctorDept,
            ...surgeryForm,
            status: 'Scheduled',
            createdAt: new Date().toLocaleString()
        };

        try {
            await axios.post('http://localhost:5000/scheduledSurgeries', surgeryOrder);
            alert("Surgery Scheduled Successfully!");
            setShowSurgeryModal(false);
        } catch (err) { console.error(err); }
    };

    const handleAdmitClick = (patient) => {
        alert(`Redirecting to Admission for: ${patient.fullName}`);
    };

    const handleDischargeClick = (patient) => {
        if (window.confirm(`Are you sure you want to discharge ${patient.fullName}?`)) {
            alert(`Processing discharge for: ${patient.fullName}`);
        }
    };

    const handleCheckboxChange = (report) => {
        if (selectedReports.find(r => r.id === report.id)) {
            setSelectedReports(selectedReports.filter(r => r.id !== report.id));
        } else {
            setSelectedReports([...selectedReports, report]);
        }
    };

    const assignLabTests = async () => {
        if (selectedReports.length === 0) { alert("Select a report"); return; }
        const labOrder = {
            patientId: selectedPatient.id,
            patientName: selectedPatient.fullName,
            doctorName: doctorName,
            assignedReports: selectedReports,
            status: 'Pending',
            date: new Date().toLocaleString()
        };
        try {
            await axios.post('http://localhost:5000/labOrders', labOrder);
            alert("Lab Tests assigned!");
            setShowLabModal(false);
        } catch (err) { console.error(err); }
    };

    const savePrescription = async (e) => {
        e.preventDefault();
        const prescriptionData = {
            patientId: selectedPatient.id,
            patientName: selectedPatient.fullName,
            doctorName: doctorName,
            date: new Date().toLocaleString(),
            ...prescription
        };
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
                <p style={{ color: '#7f8c8d' }}>Current active patients under {doctorName}</p>
            </div>

            <div style={tableContainer}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRowStyle}>
                            <th style={thStyle}>Patient Name</th>
                            <th style={thStyle}>Contact Details</th>
                            <th style={thStyle}>Department</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myPatients.map((p) => (
                            <tr key={p.id} style={rowStyle}>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FaUserCircle size={25} color="#27ae60" />
                                        <span style={{ fontWeight: '600' }}>{p.fullName}</span>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ fontSize: '12px' }}>
                                        <FaPhoneAlt size={10} /> {p.contact} <br/>
                                        <FaEnvelope size={10} /> {p.email}
                                    </div>
                                </td>
                                <td style={tdStyle}>{p.department}</td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button style={prescBtn} onClick={() => handlePrescriptionClick(p)} title="Prescription"><FaFilePrescription /></button>
                                        <button style={labBtn} onClick={() => handleLaboratoryClick(p)} title="Lab Reports"><FaFlask /></button>
                                        <button style={surgeryBtn} onClick={() => handleSurgeryClick(p)} title="Schedule Surgery"><FaHeartbeat /></button>
                                        <button style={admitBtn} onClick={() => handleAdmitClick(p)} title="Admit"><FaBed /></button>
                                        <button style={dischargeBtn} onClick={() => handleDischargeClick(p)} title="Discharge"><FaSignOutAlt /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- PRESCRIPTION MODAL --- */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={{ ...modalContent, width: '900px', display: 'flex', gap: '20px', maxHeight: '90vh' }}>
                        <div style={{ flex: 1.2 }}>
                            <h3 style={{ margin: '0 0 20px 0' }}>New Prescription</h3>
                            <form onSubmit={savePrescription}>
                                <label style={labelStyle}>Diagnosis</label>
                                <input style={inputStyle} required value={prescription.diagnosis} onChange={(e) => setPrescription({...prescription, diagnosis: e.target.value})} />
                                <label style={labelStyle}>Medicines</label>
                                <textarea style={{ ...inputStyle, height: '100px' }} required value={prescription.medicines} onChange={(e) => setPrescription({...prescription, medicines: e.target.value})} />
                                <label style={labelStyle}>Advice</label>
                                <textarea style={{ ...inputStyle, height: '70px' }} value={prescription.advice} onChange={(e) => setPrescription({...prescription, advice: e.target.value})} />
                                <button type="submit" style={submitBtn}><FaSave /> Save Prescription</button>
                            </form>
                        </div>
                        <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px' }}><FaHistory /> History</h3>
                                <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
                            </div>
                            <div style={{ overflowY: 'auto', flex: 1 }}>
                                {history.length > 0 ? [...history].reverse().map((h, i) => (
                                    <div key={i} style={historyCard}>
                                        <small style={{ color: '#3498db', fontWeight: 'bold' }}>{h.date}</small>
                                        <p style={{ margin: '5px 0', fontSize: '13px' }}><b>Diag:</b> {h.diagnosis}</p>
                                        <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}><b>Med:</b> {h.medicines}</p>
                                    </div>
                                )) : <p>No history.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- LABORATORY MODAL --- */}
            {showLabModal && (
                <div style={modalOverlay}>
                    <div style={{ ...modalContent, width: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#8e44ad' }}><FaFlask /> Lab Reports</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowLabModal(false)} />
                        </div>
                        <div style={reportListContainer}>
                            {availableReports.map(report => (
                                <div key={report.id} style={reportItem}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input type="checkbox" checked={!!selectedReports.find(r => r.id === report.id)} onChange={() => handleCheckboxChange(report)} />
                                        <span>{report.reportName}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button style={{ ...submitBtn, backgroundColor: '#8e44ad', marginTop: '20px' }} onClick={assignLabTests}><FaCheckSquare /> Confirm</button>
                    </div>
                </div>
            )}

            {/* 🔥 NEW: SURGERY MODAL 🔥 */}
            {showSurgeryModal && (
                <div style={modalOverlay}>
                    <div style={{ ...modalContent, width: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#e67e22' }}><FaHeartbeat /> Schedule Surgery</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowSurgeryModal(false)} />
                        </div>

                        <div style={patientMiniDetail}>
                            <p><b>Patient:</b> {selectedPatient?.fullName}</p>
                            <p><b>Dept:</b> {doctorDept}</p>
                        </div>

                        <form onSubmit={scheduleSurgerySubmit}>
                            <label style={labelStyle}>Select Surgery Type</label>
                            <select 
                                style={inputStyle} 
                                required 
                                value={surgeryForm.surgeryName}
                                onChange={(e) => setSurgeryForm({...surgeryForm, surgeryName: e.target.value})}
                            >
                                <option value="">-- Choose Surgery --</option>
                                {availableSurgeryTypes.map(s => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                ))}
                            </select>

                            <label style={labelStyle}>Surgery Date</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="date" 
                                    style={inputStyle} 
                                    required 
                                    value={surgeryForm.surgeryDate}
                                    onChange={(e) => setSurgeryForm({...surgeryForm, surgeryDate: e.target.value})}
                                />
                                <FaCalendarAlt style={inputIcon} />
                            </div>

                            <label style={labelStyle}>Select Time Slot</label>
                            <div style={{ position: 'relative' }}>
                                <select 
                                    style={inputStyle} 
                                    required 
                                    value={surgeryForm.timeSlot}
                                    onChange={(e) => setSurgeryForm({...surgeryForm, timeSlot: e.target.value})}
                                >
                                    <option value="">-- Choose Slot --</option>
                                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                                    <option value="11:30 AM - 01:30 PM">11:30 AM - 01:30 PM</option>
                                    <option value="02:30 PM - 04:30 PM">02:30 PM - 04:30 PM</option>
                                    <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM</option>
                                </select>
                                <FaClock style={inputIcon} />
                            </div>

                            <button type="submit" style={{ ...submitBtn, backgroundColor: '#e67e22', marginTop: '10px' }}>
                                <FaSave /> Confirm Schedule
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const patientMiniDetail = { backgroundColor: '#fff5eb', padding: '10px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ffe8cc', fontSize: '14px' };
const inputIcon = { position: 'absolute', right: '10px', top: '10px', color: '#999' };
const reportListContainer = { maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px', padding: '10px' };
const reportItem = { padding: '10px', borderBottom: '1px solid #f1f1f1' };
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
const submitBtn = { width: '100%', padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const headerSection = { marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8f9fa', fontWeight: '700', borderBottom: '2px solid #edf2f7', fontSize: '13px' };
const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #f1f4f8', color: '#2d3748', fontSize: '14px' };
const rowStyle = { transition: 'background-color 0.2s' };
const headerRowStyle = { borderBottom: '2px solid #eee' };

export default Mypatient;