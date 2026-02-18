import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarCheck, FaEnvelope, FaPhoneAlt, FaPlus, FaTimes, FaFileAlt, FaDownload, FaHospitalSymbol } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    
    // --- VIEW FILE MODAL STATES ---
    const [showFileModal, setShowFileModal] = useState(false);
    const [selectedPatientFile, setSelectedPatientFile] = useState(null);
    const [patientHistory, setPatientHistory] = useState({
        prescriptions: [],
        labReports: [],
        surgeries: [],
        admission: null
    });
    const reportRef = useRef(); 

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

    const handleViewFile = async (patient) => {
        setSelectedPatientFile(patient);
        setShowFileModal(true);
        try {
            const [prescRes, labRes, surgeryRes, admitRes] = await Promise.all([
                axios.get(`http://localhost:5000/prescriptions?patientId=${patient.id}`).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/pandinglabrequest?patientId=${patient.id}`).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/surgery?patientId=${patient.id}`).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/admitted?id=${patient.id}`).catch(() => ({ data: [] }))
            ]);

            setPatientHistory({
                prescriptions: prescRes.data,
                labReports: labRes.data,
                surgeries: surgeryRes.data,
                admission: admitRes.data.length > 0 ? admitRes.data[0] : null
            });
        } catch (error) {
            console.error("Error fetching patient history:", error);
        }
    };

    const downloadPDF = () => {
        const input = reportRef.current;
        html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${selectedPatientFile.fullName}_Medical_Report.pdf`);
        });
    };

    const calculateDays = (dateString) => {
        if (!dateString) return 0;
        const admitDate = new Date(dateString); 
        if (isNaN(admitDate)) return "N/A"; 
        const today = new Date();
        const diffTime = Math.abs(today - admitDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
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
                    <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Total Registered: {patients.length}</p>
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
                                    <th style={thStyle}>Action</th>
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
                                        <td style={tdStyle}>
                                            <button 
                                                style={viewFileBtnStyle}
                                                onClick={() => handleViewFile(patient)}
                                            >
                                                <FaFileAlt style={{ marginRight: '5px' }} /> View File
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {/* --- REGISTRATION MODAL --- */}
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

            {/* --- AUTHENTIC HOSPITAL REPORT MODAL --- */}
            {showFileModal && selectedPatientFile && (
                <div style={modalOverlay}>
                    <div style={{ ...modalContent, width: '850px', padding: '0', background: '#525659', overflow: 'hidden' }}>
                        
                        {/* Toolbar */}
                        <div style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #444' }}>
                            <span style={{fontSize: '14px', fontWeight: 'bold'}}>Medical Record Preview</span>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button onClick={downloadPDF} style={downloadBtnStyle}>
                                    <FaDownload style={{ marginRight: '5px' }} /> Download PDF
                                </button>
                                <FaTimes style={{ cursor: 'pointer', fontSize: '18px', marginTop: '5px' }} onClick={() => setShowFileModal(false)} />
                            </div>
                        </div>

                        {/* --- THE A4 PAPER DOCUMENT --- */}
                        <div style={{ height: '85vh', overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <div ref={reportRef} style={a4PaperStyle}>
                                
                                {/* 1. Hospital Letterhead */}
                                <div style={reportHeader}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                        <div style={logoBox}><FaHospitalSymbol size={30} color="white"/></div>
                                        <div>
                                            <h1 style={hospitalName}>CITY GENERAL HOSPITAL</h1>
                                            <p style={hospitalAddress}>123 Health Avenue, Medical District, NY 10001</p>
                                            <p style={hospitalAddress}>Ph: +1-202-555-0199 | Email: info@citygeneral.com</p>
                                        </div>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <h3 style={{margin: '0', color: '#2c3e50', fontFamily: 'serif'}}>MEDICAL DOSSIER</h3>
                                        <p style={{margin: '5px 0 0 0', fontSize: '12px', color: '#555'}}>Report Date: {new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <hr style={{ border: 'none', borderTop: '2px solid #2c3e50', margin: '10px 0 25px 0' }} />

                                {/* 2. Patient Demographics */}
                                <div style={patientInfoBox}>
                                    <div style={{ borderRight: '1px solid #000', paddingRight: '15px' }}>
                                        <table style={infoTable}>
                                            <tbody>
                                                <tr><td style={infoLabel}>Patient Name:</td><td style={infoVal}>{selectedPatientFile.fullName}</td></tr>
                                                <tr><td style={infoLabel}>Patient ID:</td><td style={infoVal}>{selectedPatientFile.id}</td></tr>
                                                <tr><td style={infoLabel}>Age/Gender:</td><td style={infoVal}>{selectedPatientFile.age} Yrs</td></tr>
                                                <tr><td style={infoLabel}>Contact:</td><td style={infoVal}>{selectedPatientFile.contact}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ paddingLeft: '15px' }}>
                                        <table style={infoTable}>
                                            <tbody>
                                                <tr><td style={infoLabel}>Department:</td><td style={infoVal}>{selectedPatientFile.department}</td></tr>
                                                <tr><td style={infoLabel}>Consultant:</td><td style={infoVal}>Dr. {selectedPatientFile.doctorName}</td></tr>
                                                <tr><td style={infoLabel}>Reg. Date:</td><td style={infoVal}>{selectedPatientFile.admittedAt}</td></tr>
                                                <tr><td style={infoLabel}>Address:</td><td style={infoVal}>{selectedPatientFile.city}, {selectedPatientFile.state}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* 3. Admission Status Table */}
                                <div style={sectionContainer}>
                                    <h4 style={reportSectionTitle}>CURRENT ADMISSION STATUS</h4>
                                    {patientHistory.admission ? (
                                        <table style={reportTableStyle}>
                                            <thead>
                                                <tr style={tableHeaderRow}>
                                                    <th style={tableHeaderCell}>Admission Date</th>
                                                    <th style={tableHeaderCell}>Room / Ward</th>
                                                    <th style={tableHeaderCell}>Bed No</th>
                                                    <th style={tableHeaderCell}>Duration</th>
                                                    <th style={tableHeaderCell}>Attending Doctor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={tableCell}>{patientHistory.admission.admissionTimestamp}</td>
                                                    <td style={tableCell}>{patientHistory.admission.roomType}</td>
                                                    <td style={tableCell}>{patientHistory.admission.allocatedRoom}</td>
                                                    <td style={tableCell}>{calculateDays(patientHistory.admission.admissionTimestamp)} Days</td>
                                                    <td style={tableCell}>{patientHistory.admission.admittedBy}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div style={noDataStyle}>Patient is currently not admitted.</div>
                                    )}
                                </div>

                                {/* 4. Clinical History Table */}
                                <div style={sectionContainer}>
                                    <h4 style={reportSectionTitle}>CLINICAL HISTORY (PRESCRIPTIONS)</h4>
                                    {patientHistory.prescriptions.length > 0 ? (
                                        <table style={reportTableStyle}>
                                            <thead>
                                                <tr style={tableHeaderRow}>
                                                    <th style={{...tableHeaderCell, width: '15%'}}>Date</th>
                                                    <th style={{...tableHeaderCell, width: '25%'}}>Diagnosis</th>
                                                    <th style={{...tableHeaderCell, width: '35%'}}>Medicines (Rx)</th>
                                                    <th style={{...tableHeaderCell, width: '25%'}}>Advice</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patientHistory.prescriptions.slice().reverse().map((p, i) => (
                                                    <tr key={i}>
                                                        <td style={tableCell}>{p.date.split(',')[0]}</td>
                                                        <td style={tableCell}>{p.diagnosis}</td>
                                                        <td style={tableCell}>{p.medicines}</td>
                                                        <td style={tableCell}>{p.advice || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <div style={noDataStyle}>No clinical records available.</div>}
                                </div>

                                {/* 5. Laboratory Reports Table */}
                                <div style={sectionContainer}>
                                    <h4 style={reportSectionTitle}>LABORATORY INVESTIGATIONS</h4>
                                    {patientHistory.labReports.length > 0 ? (
                                        <table style={reportTableStyle}>
                                            <thead>
                                                <tr style={tableHeaderRow}>
                                                    <th style={{...tableHeaderCell, width: '15%'}}>Date</th>
                                                    <th style={{...tableHeaderCell, width: '40%'}}>Investigation Name</th>
                                                    <th style={{...tableHeaderCell, width: '15%'}}>Status</th>
                                                    <th style={{...tableHeaderCell, width: '30%'}}>Findings / Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patientHistory.labReports.slice().reverse().map((l, i) => (
                                                    <tr key={i}>
                                                        <td style={tableCell}>{l.date}</td>
                                                        <td style={tableCell}>{l.assignedReports.map(r => r.reportName).join(", ")}</td>
                                                        <td style={{...tableCell, fontWeight: 'bold', color: l.status === 'Completed' ? '#27ae60' : '#d35400'}}>
                                                            {l.status}
                                                        </td>
                                                        <td style={tableCell}>{l.resultNote || 'Pending Analysis'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <div style={noDataStyle}>No lab investigations recorded.</div>}
                                </div>

                                {/* 6. Surgical History Table */}
                                <div style={sectionContainer}>
                                    <h4 style={reportSectionTitle}>SURGICAL PROCEDURES</h4>
                                    {patientHistory.surgeries.length > 0 ? (
                                        <table style={reportTableStyle}>
                                            <thead>
                                                <tr style={tableHeaderRow}>
                                                    <th style={{...tableHeaderCell, width: '40%'}}>Procedure Type</th>
                                                    <th style={{...tableHeaderCell, width: '30%'}}>Scheduled Date & Time</th>
                                                    <th style={{...tableHeaderCell, width: '30%'}}>Current Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patientHistory.surgeries.slice().reverse().map((s, i) => (
                                                    <tr key={i}>
                                                        <td style={tableCell}>{s.surgeryType}</td>
                                                        <td style={tableCell}>{s.surgeryDate} at {s.surgeryTime}</td>
                                                        <td style={{...tableCell, fontWeight: 'bold'}}>{s.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <div style={noDataStyle}>No surgical procedures recorded.</div>}
                                </div>

                                {/* Footer */}
                                <div style={{ marginTop: 'auto', paddingTop: '30px', borderTop: '2px solid #2c3e50' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                        <div style={{ fontSize: '10px', color: '#555' }}>
                                            <p style={{margin: 0}}>* This is a computer-generated document and does not require a physical signature.</p>
                                            <p style={{margin: 0}}>* Confidential Medical Record - For authorized personnel only.</p>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ borderBottom: '1px solid #000', width: '150px', marginBottom: '5px' }}></div>
                                            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Authorized Signatory</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
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

const viewFileBtnStyle = { backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', transition: 'background 0.2s' };
const downloadBtnStyle = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' };

// --- REPORT SPECIFIC STYLES ---
const a4PaperStyle = {
    width: '210mm',
    minHeight: '297mm',
    padding: '15mm',
    backgroundColor: 'white',
    boxShadow: '0 0 15px rgba(0,0,0,0.2)',
    margin: '0 auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Times New Roman", serif', 
    color: '#000'
};
const reportHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
const logoBox = { width: '50px', height: '50px', backgroundColor: '#2c3e50', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' };
const hospitalName = { margin: '0', fontSize: '24px', fontWeight: 'bold', fontFamily: 'serif', letterSpacing: '1px', color: '#2c3e50' };
const hospitalAddress = { margin: '2px 0', fontSize: '10px', color: '#555' };
const patientInfoBox = { display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #000', marginBottom: '20px', padding: '10px' };
const infoTable = { width: '100%', fontSize: '12px' };
const infoLabel = { fontWeight: 'bold', padding: '2px 0', width: '90px' };
const infoVal = { padding: '2px 0' };
const sectionContainer = { marginBottom: '20px' };
const reportSectionTitle = { margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#eee', padding: '5px', borderLeft: '4px solid #2c3e50', fontFamily: 'sans-serif' };
const noDataStyle = { padding: '10px', border: '1px dashed #ccc', textAlign: 'center', color: '#666', fontStyle: 'italic', fontSize: '12px' };

// 🔥 TABULAR DATA STYLES 🔥
const reportTableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '12px', border: '1px solid #000' };
const tableHeaderRow = { backgroundColor: '#f0f0f0' };
const tableHeaderCell = { border: '1px solid #000', padding: '8px', textAlign: 'left', fontWeight: 'bold', backgroundColor: '#e9ecef' };
const tableCell = { border: '1px solid #000', padding: '8px', textAlign: 'left' };

export default Patients;