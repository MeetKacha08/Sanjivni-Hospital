import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHourglassHalf, FaFlask, FaUserCircle, FaCalendarAlt, FaTimes, FaEdit, FaSave } from 'react-icons/fa';

const Pandingrequest = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultNote, setResultNote] = useState("");

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            // 🔥 Updated to fetch from the pandinglabrequest endpoint
            const res = await axios.get('http://localhost:5000/pandinglabrequest');
            setRequests(res.data.filter(req => req.status === 'Pending'));
        } catch (err) {
            console.error("Error fetching lab requests:", err);
        }
    };

    const handleUpdateClick = (request) => {
        setSelectedRequest(request);
        setResultNote("");
        setShowResultModal(true);
    };

    const submitLabResult = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...selectedRequest,
                status: 'Completed',
                resultNote: resultNote,
                completedAt: new Date().toLocaleString()
            };

            await axios.put(`http://localhost:5000/pandinglabrequest/${selectedRequest.id}`, updatedData);
            alert("Lab result updated and request marked as completed!");
            setShowResultModal(false);
            fetchPendingRequests(); // Refresh the list
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>
                    <FaHourglassHalf color="#f39c12" style={{ marginRight: '15px' }} /> 
                    Pending Lab Requests
                </h2>
                <span style={badgeCount}>{requests.length} Requests Awaiting</span>
            </div>

            <div style={tableWrapper}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={thRowStyle}>
                            <th style={thStyle}>Patient Details</th>
                            <th style={thStyle}>Requested Tests</th>
                            <th style={thStyle}>Assigned Date</th>
                            <th style={thStyle}>Doctor</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? requests.map((req) => (
                            <tr key={req.id} style={trStyle}>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FaUserCircle size={30} color="#bdc3c7" />
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{req.patientName}</div>
                                            <small style={{ color: '#7f8c8d' }}>ID: {req.patientId}</small>
                                        </div>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {req.assignedReports && req.assignedReports.map((report, idx) => (
                                            <span key={idx} style={testTag}><FaFlask size={10} /> {report.reportName}</span>
                                        ))}
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ fontSize: '13px' }}><FaCalendarAlt color="#95a5a6" /> {req.date}</div>
                                </td>
                                <td style={tdStyle}>Dr. {req.doctorName}</td>
                                <td style={tdStyle}>
                                    <button style={actionBtn} onClick={() => handleUpdateClick(req)}>
                                        <FaEdit /> Update Result
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
                                    No pending lab requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- UPDATE RESULT MODAL --- */}
            {showResultModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={modalHeader}>
                            <h3 style={{ margin: 0 }}><FaFlask /> Enter Lab Results</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowResultModal(false)} />
                        </div>
                        
                        <div style={patientInfoSmall}>
                            <p><b>Patient:</b> {selectedRequest?.patientName}</p>
                            <p><b>Tests:</b> {selectedRequest?.assignedReports.map(r => r.reportName).join(', ')}</p>
                        </div>

                        <form onSubmit={submitLabResult}>
                            <label style={labelStyle}>Lab Findings / Results</label>
                            <textarea 
                                style={textAreaStyle} 
                                required 
                                placeholder="Enter detailed findings here..."
                                value={resultNote}
                                onChange={(e) => setResultNote(e.target.value)}
                            />
                            <button type="submit" style={saveBtn}>
                                <FaSave /> Submit & Complete
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const containerStyle = { padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const badgeCount = { backgroundColor: '#f39c12', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' };
const tableWrapper = { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thRowStyle = { backgroundColor: '#f8f9fa', borderBottom: '2px solid #edf2f7' };
const thStyle = { textAlign: 'left', padding: '15px 20px', fontSize: '13px', color: '#718096', textTransform: 'uppercase' };
const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #edf2f7', color: '#2d3748', fontSize: '14px' };
const trStyle = { transition: 'background 0.2s' };
const testTag = { backgroundColor: '#e1f5fe', color: '#0288d1', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' };
const actionBtn = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' };

const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: 'white', padding: '25px', borderRadius: '15px', width: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' };
const patientInfoSmall = { backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' };
const textAreaStyle = { width: '100%', height: '120px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' };
const saveBtn = { width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };

export default Pandingrequest;