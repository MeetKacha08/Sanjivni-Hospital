import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCheck, FaPhoneAlt, FaEnvelope, FaUserCircle, FaFilePrescription, FaTimes, FaSave, FaHistory, FaFlask, FaHeartbeat, FaBed, FaSignOutAlt, FaCalendarAlt, FaCheckSquare, FaListAlt, FaEdit, FaClock, FaCheckCircle } from 'react-icons/fa';

const Mypatient = () => {
    const [myPatients, setMyPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [history, setHistory] = useState([]);

    // --- ADMISSION STATES ---
    const [showAdmitModal, setShowAdmitModal] = useState(false);
    const [roomType, setRoomType] = useState("");
    const roomTypes = ["ICU", "Private Room", "General Room", "General Ward"];

    // --- LAB MODAL STATES ---
    const [showLabModal, setShowLabModal] = useState(false);
    const [availableReports, setAvailableReports] = useState([]);
    const [selectedTests, setSelectedTests] = useState([]);
    const [labHistory, setLabHistory] = useState([]);

    // --- SURGERY MODAL STATES ---
    const [showSurgeryModal, setShowSurgeryModal] = useState(false);
    const [surgeryHistory, setSurgeryHistory] = useState([]); // 🔥 Added state for surgery history
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
    const [editId, setEditId] = useState(null); 
    const doctorName = localStorage.getItem('loggedInDoctorName');

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

    const fetchLabHistory = (patientId) => {
        axios.get(`http://localhost:5000/pandinglabrequest?patientId=${patientId}`)
            .then(res => setLabHistory(res.data))
            .catch(err => console.error("Error fetching lab history:", err));
    };

    // 🔥 NEW: Fetch Surgery History
    const fetchSurgeryHistory = (patientId) => {
        axios.get(`http://localhost:5000/surgery?patientId=${patientId}`)
            .then(res => setSurgeryHistory(res.data))
            .catch(err => console.error("Error fetching surgery history:", err));
    };

    const handlePrescriptionClick = (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
        fetchHistory(patient.id);
        setPrescription({ diagnosis: '', medicines: '', advice: '' });
        setEditId(null);
    };

    const handleAdmitClick = (patient) => {
        setSelectedPatient(patient);
        setShowAdmitModal(true);
    };

    // 🔥 UPDATED: Load history when opening modal
    const handleSurgeryClick = (patient) => {
        setSelectedPatient(patient);
        setShowSurgeryModal(true);
        fetchSurgeryHistory(patient.id);
    };

    const handleLabClick = (patient) => {
        setSelectedPatient(patient);
        setSelectedTests([]);
        
        axios.get('http://localhost:5000/reports')
            .then(res => {
                setAvailableReports(res.data);
                setShowLabModal(true);
            })
            .catch(err => console.error("Error fetching reports:", err));

        fetchLabHistory(patient.id);
    };

    const handleTestToggle = (reportName) => {
        if (selectedTests.includes(reportName)) {
            setSelectedTests(selectedTests.filter(t => t !== reportName));
        } else {
            setSelectedTests([...selectedTests, reportName]);
        }
    };

    const handleLabSubmit = async () => {
        if (selectedTests.length === 0) {
            alert("Please select at least one report");
            return;
        }

        const selectedReportObjects = availableReports.filter(report => 
            selectedTests.includes(report.reportName)
        );

        const labOrderData = {
            patientId: selectedPatient.id,
            patientName: selectedPatient.fullName,
            doctorName: doctorName,
            date: new Date().toLocaleDateString(), 
            assignedReports: selectedReportObjects,
            status: "Pending",
            resultNote: "" 
        };

        try {
            await axios.post('http://localhost:5000/pandinglabrequest', labOrderData);
            alert(`Lab request submitted for ${selectedPatient.fullName}`);
            setShowLabModal(false);
            setSelectedTests([]);
        } catch (err) {
            console.error("Error saving lab request:", err);
            alert("Error connecting to server.");
        }
    };

    const bookSurgerySubmit = async (e) => {
        e.preventDefault();
        try {
            const admitRes = await axios.get('http://localhost:5000/admitted');
            const isAlreadyAdmitted = admitRes.data.some(p => p.id === selectedPatient.id);

            if (!isAlreadyAdmitted) {
                alert(`STOP! Surgery cannot be booked for ${selectedPatient.fullName} because they are NOT currently admitted.`);
                setShowSurgeryModal(false);
                return;
            }

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
            
            // Refresh history instead of closing immediately so doctor can see it added
            fetchSurgeryHistory(selectedPatient.id);
            setSurgeryForm({ surgeryType: '', surgeryDate: '', surgeryTime: '' }); // Reset form
        } catch (err) {
            alert("Error connecting to the server.");
        }
    };

    const processAdmission = async () => {
        if (!roomType) { alert("Please select a room type"); return; }
        
        try {
            const admitCheck = await axios.get('http://localhost:5000/admitted');
            if (admitCheck.data.some(p => p.id === selectedPatient.id)) {
                alert(`STOP! ${selectedPatient.fullName} is already admitted.`);
                setShowAdmitModal(false);
                return;
            }

            const reqCheck = await axios.get('http://localhost:5000/admitRequests');
            if (reqCheck.data.some(p => p.patientId === selectedPatient.id)) {
                alert(`A request is already pending for ${selectedPatient.fullName}.`);
                setShowAdmitModal(false);
                return;
            }

            const requestData = { 
                patientId: selectedPatient.id,
                patientName: selectedPatient.fullName, 
                age: selectedPatient.age,
                department: selectedPatient.department,
                doctorName: doctorName,
                requestDate: new Date().toLocaleString(),
                status: "Pending", 
                requestedRoomType: roomType
            };

            await axios.post('http://localhost:5000/admitRequests', requestData);
            
            alert(`Admission Request sent successfully for ${selectedPatient.fullName}!`);
            setShowAdmitModal(false);
            setRoomType(""); 

        } catch (error) { 
            console.error(error);
            alert("Error sending admission request.");
        }
    };

    const savePrescription = async (e) => {
        e.preventDefault();
        
        try {
            if (editId) {
                const updatedData = { 
                    patientId: selectedPatient.id, 
                    patientName: selectedPatient.fullName, 
                    doctorName, 
                    date: new Date().toLocaleString(), 
                    ...prescription 
                };
                
                await axios.put(`http://localhost:5000/prescriptions/${editId}`, updatedData);
                alert("Prescription Updated!");
                setEditId(null); 
            } else {
                const prescriptionData = { 
                    patientId: selectedPatient.id, 
                    patientName: selectedPatient.fullName, 
                    doctorName, 
                    date: new Date().toLocaleString(), 
                    ...prescription 
                };
                await axios.post('http://localhost:5000/prescriptions', prescriptionData);
                alert("Prescription Saved!");
            }

            fetchHistory(selectedPatient.id);
            setPrescription({ diagnosis: '', medicines: '', advice: '' });
        } catch (err) { console.error(err); }
    };

    const handleEditPrescription = (item) => {
        setPrescription({
            diagnosis: item.diagnosis,
            medicines: item.medicines,
            advice: item.advice || '' 
        });
        setEditId(item.id); 
    };

    const handleCancelEdit = () => {
        setPrescription({ diagnosis: '', medicines: '', advice: '' });
        setEditId(null);
    };

    const handleDischargeClick = async (patient) => {
        try {
            const checkAdmitted = await axios.get('http://localhost:5000/admitted');
            const admittedData = checkAdmitted.data.find(p => p.id === patient.id);

            if (!admittedData) {
                alert(`Cannot discharge ${patient.fullName}. They are currently admitted.`);
                return;
            }

            const checkSurgery = await axios.get('http://localhost:5000/surgery');
            const hasScheduledSurgery = checkSurgery.data.some(
                s => s.patientId === patient.id && s.status === "Scheduled"
            );

            if (hasScheduledSurgery) {
                alert(`STOP! Cannot discharge ${patient.fullName}. They have a surgery scheduled.`);
                return;
            }

            if (window.confirm(`Confirm discharge for ${patient.fullName}?`)) {
                const billData = {
                    ...admittedData,
                    dischargeTimestamp: new Date().toLocaleString(),
                    billStatus: "Unpaid",
                    finalDoctor: doctorName
                };

                await axios.post('http://localhost:5000/pendingBills', billData);
                await axios.delete(`http://localhost:5000/admitted/${patient.id}`);
                alert("Patient successfully discharged and sent to Billing.");
                fetchApprovedPatients();
            }
        } catch (err) {
            console.error("Discharge Error:", err);
            alert("An error occurred during the discharge process.");
        }
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
                                        <button style={labBtn} onClick={() => handleLabClick(p)} title='Lab Reports'><FaFlask /></button>
                                        <button style={admitBtn} onClick={() => handleAdmitClick(p)} title="Admit"><FaBed /></button>
                                        <button style={surgeryBtn} onClick={() => handleSurgeryClick(p)} title="Schedule Surgery"><FaHeartbeat /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- LAB REPORTS MODAL --- */}
            {showLabModal && selectedPatient && (
                <div style={modalOverlay}>
                    <div style={{ ...modalContent, width: '900px', display: 'flex', gap: '20px', maxHeight: '90vh', position: 'relative' }}>
                        <FaTimes
                            style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', fontSize: '20px', color: '#666' }}
                            onClick={() => setShowLabModal(false)}
                        />
                        
                        <div style={{ flex: 1.2 }}>
                            <h2 style={{ color: '#8e44ad', marginBottom: '20px' }}><FaFlask /> Lab Test Prescription</h2>
                            
                            <div style={admitDetailBox}>
                                <p style={{ margin: '5px 0' }}><b>Patient:</b> {selectedPatient.fullName}</p>
                                <p style={{ margin: '5px 0' }}><b>ID:</b> {selectedPatient.id} | <b>Dept:</b> {selectedPatient.department}</p>
                            </div>

                            <label style={labelStyle}>Select Required Reports:</label>
                            <div style={{ 
                                maxHeight: '300px', 
                                overflowY: 'auto', 
                                border: '1px solid #ddd', 
                                borderRadius: '8px', 
                                padding: '10px',
                                marginBottom: '15px',
                                backgroundColor: '#fff' 
                            }}>
                                {availableReports.map((report) => (
                                    <div key={report.id} style={{ 
                                        display: 'flex', alignItems: 'center', padding: '8px', borderBottom: '1px solid #f1f1f1' 
                                    }}>
                                        <input 
                                            type="checkbox" 
                                            id={`report-${report.id}`}
                                            checked={selectedTests.includes(report.reportName)}
                                            onChange={() => handleTestToggle(report.reportName)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <label htmlFor={`report-${report.id}`} style={{ marginLeft: '12px', flex: 1, cursor: 'pointer', fontSize: '14px' }}>
                                            {report.reportName}
                                        </label>
                                        <span style={{ fontWeight: 'bold', color: '#27ae60' }}>₹{report.reportFees}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                disabled={selectedTests.length === 0}
                                style={{ 
                                    ...submitBtn, 
                                    backgroundColor: selectedTests.length > 0 ? '#8e44ad' : '#ccc',
                                    cursor: selectedTests.length > 0 ? 'pointer' : 'not-allowed'
                                }}
                                onClick={handleLabSubmit}
                            >
                                <FaCheckSquare style={{ marginRight: '8px' }} /> Submit Selected Tests
                            </button>
                        </div>

                        <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '20px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <FaListAlt color="#2c3e50" /> <h4 style={{ margin: 0 }}>Past Lab Requests</h4>
                            </div>
                            
                            {labHistory.length > 0 ? (
                                labHistory.slice().reverse().map((record, index) => (
                                    <div key={index} style={historyCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{record.date}</span>
                                            <span style={{ 
                                                fontSize: '11px', 
                                                padding: '2px 6px', 
                                                borderRadius: '4px', 
                                                backgroundColor: record.status === 'Completed' ? '#d4edda' : '#fff3cd',
                                                color: record.status === 'Completed' ? '#155724' : '#856404'
                                            }}>
                                                {record.status}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                            {record.assignedReports.map((r, i) => (
                                                <span key={i} style={{ 
                                                    backgroundColor: '#e3f2fd', 
                                                    color: '#0277bd', 
                                                    padding: '3px 8px', 
                                                    borderRadius: '10px', 
                                                    fontSize: '11px' 
                                                }}>
                                                    {r.reportName}
                                                </span>
                                            ))}
                                        </div>
                                        {record.resultNote && (
                                            <div style={{ marginTop: '8px', fontSize: '12px', color: '#555', fontStyle: 'italic', borderTop: '1px dashed #eee', paddingTop: '5px' }}>
                                                Result: {record.resultNote}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: '#aaa', marginTop: '20px' }}>
                                    <p>No previous lab records found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- SURGERY BOOKING MODAL (Updated) --- */}
            {showSurgeryModal && selectedPatient && (
                <div style={modalOverlay}>
                    {/* 🔥 Increased width to accommodate history */}
                    <div style={{ ...modalContent, width: '900px', display: 'flex', gap: '20px', maxHeight: '90vh', position: 'relative' }}>
                        <FaTimes
                            style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', fontSize: '20px', color: '#666' }}
                            onClick={() => setShowSurgeryModal(false)}
                        />
                        
                        {/* LEFT: Booking Form */}
                        <div style={{ flex: 1.2 }}>
                            <h2 style={{ color: '#e67e22', marginBottom: '20px' }}><FaHeartbeat /> Schedule Surgery</h2>

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
                                    onChange={(e) => setSurgeryForm({ ...surgeryForm, surgeryType: e.target.value })}
                                >
                                    <option value="">-- Choose Procedure --</option>
                                    {heartSurgeries.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                                </select>

                                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Select Date</label>
                                        <input type="date" style={inputStyle} required value={surgeryForm.surgeryDate}
                                            onChange={(e) => setSurgeryForm({ ...surgeryForm, surgeryDate: e.target.value })} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Select Time</label>
                                        <input type="time" style={inputStyle} required value={surgeryForm.surgeryTime}
                                            onChange={(e) => setSurgeryForm({ ...surgeryForm, surgeryTime: e.target.value })} />
                                    </div>
                                </div>

                                <button type="submit" style={{ ...submitBtn, backgroundColor: '#e67e22', marginTop: '20px' }}>
                                    Confirm & Book Surgery
                                </button>
                            </form>
                        </div>

                        {/* RIGHT: Surgery History */}
                        <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '20px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <FaHistory color="#e67e22" /> <h4 style={{ margin: 0 }}>Surgery History</h4>
                            </div>

                            {surgeryHistory.length > 0 ? (
                                surgeryHistory.slice().reverse().map((surgery, index) => (
                                    <div key={index} style={historyCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2c3e50' }}>{surgery.surgeryType}</span>
                                            {/* Status Badge Logic */}
                                            {surgery.status === 'Completed' ? (
                                                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', backgroundColor: '#d4edda', color: '#155724', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FaCheckCircle /> Completed
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', backgroundColor: '#fff3cd', color: '#856404', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FaClock /> Scheduled
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#555', display: 'flex', gap: '15px' }}>
                                            <span><FaCalendarAlt style={{marginRight: '5px', color: '#7f8c8d'}}/>{surgery.surgeryDate}</span>
                                            <span><FaClock style={{marginRight: '5px', color: '#7f8c8d'}}/>{surgery.surgeryTime}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: '#aaa', marginTop: '20px' }}>
                                    <p>No surgery history found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- PRESCRIPTION MODAL --- */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={{ ...modalContent, width: '900px', display: 'flex', gap: '20px', maxHeight: '90vh', position: 'relative' }}>
                        <FaTimes style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', fontSize: '20px', color: '#666' }} onClick={() => setShowModal(false)} />
                        
                        <div style={{ flex: 1.2 }}>
                            <h3>{editId ? 'Edit Prescription' : 'New Prescription'}</h3>
                            <form onSubmit={savePrescription}>
                                <label style={labelStyle}>Diagnosis</label>
                                <input style={inputStyle} required value={prescription.diagnosis} onChange={(e) => setPrescription({ ...prescription, diagnosis: e.target.value })} />
                                <label style={labelStyle}>Medicines</label>
                                <textarea style={{ ...inputStyle, height: '100px' }} required value={prescription.medicines} onChange={(e) => setPrescription({ ...prescription, medicines: e.target.value })} />
                                <label style={labelStyle}>Advice (Optional)</label>
                                <input style={inputStyle} value={prescription.advice || ''} onChange={(e) => setPrescription({ ...prescription, advice: e.target.value })} />
                                
                                <div style={{display: 'flex', gap: '10px'}}>
                                    <button type="submit" style={{ ...submitBtn, backgroundColor: editId ? '#e67e22' : '#27ae60' }}>
                                        <FaSave /> {editId ? 'Update Prescription' : 'Save Prescription'}
                                    </button>
                                    {editId && (
                                        <button type="button" onClick={handleCancelEdit} style={{...submitBtn, backgroundColor: '#7f8c8d'}}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '20px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <FaHistory /> <h4 style={{ margin: 0 }}>History</h4>
                            </div>
                            
                            {history.length > 0 ? [...history].reverse().map((h, i) => (
                                <div key={i} style={historyCard}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                        <small style={{color: '#888'}}>{h.date}</small>
                                        <FaEdit 
                                            style={{cursor: 'pointer', color: '#3498db'}} 
                                            onClick={() => handleEditPrescription(h)} 
                                            title="Edit this record"
                                        />
                                    </div>
                                    <div style={{marginBottom: '5px'}}>
                                        <strong style={{color: '#2c3e50'}}>Dx:</strong> {h.diagnosis}
                                    </div>
                                    <div style={{marginBottom: '5px'}}>
                                        <strong style={{color: '#2c3e50'}}>Rx:</strong> {h.medicines}
                                    </div>
                                    {h.advice && (
                                        <div style={{fontStyle: 'italic', fontSize: '13px', color: '#555'}}>
                                            <strong style={{color: '#2c3e50'}}>Adv:</strong> {h.advice}
                                        </div>
                                    )}
                                </div>
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
                            <h2 style={{ margin: 0, color: '#16a085' }}><FaBed style={{ marginRight: '10px' }} /> Admit Patient</h2>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowAdmitModal(false)} />
                        </div>
                        <div style={admitDetailBox}><p><b>Patient:</b> {selectedPatient.fullName}</p></div>
                        <select value={roomType} onChange={(e) => setRoomType(e.target.value)} style={inputStyle}>
                            <option value="">-- Choose Room --</option>
                            {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <button onClick={processAdmission} style={{ ...submitBtn, backgroundColor: '#16a085', marginTop: '15px' }}>Send Admission Request</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const admitDetailBox = { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee', fontSize: '14px' };
const prescBtn = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' };
const labBtn = { backgroundColor: '#8e44ad', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' };
const surgeryBtn = { backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' };
const admitBtn = { backgroundColor: '#16a085', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' };
const historyCard = { backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #eee' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' };
const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const headerSection = { marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8f9fa', fontWeight: '700', borderBottom: '2px solid #edf2f7', fontSize: '13px' };
const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #f1f4f8', color: '#2d3748', fontSize: '14px' };
const rowStyle = { transition: 'background-color 0.2s' };
const headerRowStyle = { borderBottom: '2px solid #eee' };

export default Mypatient;
