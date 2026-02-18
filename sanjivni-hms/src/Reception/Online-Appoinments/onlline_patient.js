// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaUserCircle, FaCalendarCheck, FaUserMd, FaPhoneAlt, FaCheck, FaStethoscope } from 'react-icons/fa';

// const OnlinePatient = () => {
//     const [requests, setRequests] = useState([]);

//     useEffect(() => {
//         fetchRequests();
//         const intervalId = setInterval(() => {
//             fetchRequests();
//         }, 10000); 
//         return () => clearInterval(intervalId);
//     }, []);

//     const fetchRequests = () => {
//         axios.get('http://localhost:5000/appointments')
//             .then(res => {
//                 const sorted = res.data.reverse();
//                 setRequests(sorted);
//             })
//             .catch(err => console.error("Error fetching online appointments:", err));
//     };

//     const handleApprove = async (patient) => {
//         const confirmApprove = window.confirm(`Are you sure you want to approve ${patient.fullName}?`);
//         if (confirmApprove) {
//             try {
//                 await axios.post('http://localhost:5000/patients', {
//                     ...patient,
//                     status: "Accepted",
//                     admittedDate: new Date().toLocaleDateString()
//                 });
//                 await axios.delete(`http://localhost:5000/appointments/${patient.id}`);
//                 alert("Patient Approved successfully!");
//                 fetchRequests();
//             } catch (error) {
//                 console.error("Error approving patient:", error);
//                 alert("Failed to approve patient.");
//             }
//         }
//     };

//     // --- GROUPING LOGIC: Department -> Doctor ---
//     const groupedRequests = requests.reduce((acc, req) => {
//         const dept = req.department || "General";
//         const doc = req.doctorName || "Unassigned";

//         if (!acc[dept]) {
//             acc[dept] = {};
//         }
//         if (!acc[dept][doc]) {
//             acc[dept][doc] = [];
//         }
//         acc[dept][doc].push(req);
//         return acc;
//     }, {});

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <div style={headerSection}>
//                 <h2 style={{ color: '#2c3e50', margin: 0 }}>
//                     <FaCalendarCheck style={{ marginRight: '15px', color: '#3498db' }} /> 
//                     Online Patient Appointments
//                 </h2>
//                 <p style={{ color: '#7f8c8d' }}>You have {requests.length} new appointment requests. (Auto-refreshes every 10s)</p>
//             </div>

//             {Object.keys(groupedRequests).length === 0 ? (
//                 <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6', backgroundColor: '#fff', borderRadius: '10px' }}>
//                     <h3>No pending appointment requests found.</h3>
//                 </div>
//             ) : (
//                 Object.keys(groupedRequests).map((dept) => (
//                     <div key={dept} style={{ marginBottom: '40px' }}>
//                         {/* 1. Department Header */}
//                         <div style={deptHeader}>
//                             {dept} Department
//                         </div>

//                         {Object.keys(groupedRequests[dept]).map((doc) => (
//                             <div key={doc} style={doctorSection}>
//                                 {/* 2. Doctor Header */}
//                                 <div style={docHeader}>
//                                     <FaUserMd style={{ marginRight: '8px' }} /> Dr. {doc}
//                                     <span style={countBadge}>{groupedRequests[dept][doc].length} Requests</span>
//                                 </div>

//                                 {/* 3. Table for this Doctor */}
//                                 <div style={tableContainer}>
//                                     <table style={tableStyle}>
//                                         <thead>
//                                             <tr style={headerRowStyle}>
//                                                 <th style={thStyle}>Patient Details</th>
//                                                 <th style={thStyle}>Contact Info</th>
//                                                 <th style={thStyle}>Request Date</th>
//                                                 <th style={thStyle}>Status</th>
//                                                 <th style={thStyle}>Actions</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {groupedRequests[dept][doc].map((req) => (
//                                                 <tr key={req.id} style={rowStyle}>
//                                                     <td style={tdStyle}>
//                                                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                                                             <FaUserCircle size={35} color="#bdc3c7" />
//                                                             <div>
//                                                                 <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{req.fullName}</div>
//                                                                 <small style={{ color: '#7f8c8d' }}>Age: {req.age} Years</small>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td style={tdStyle}>
//                                                         <div style={{ fontSize: '13px' }}>
//                                                             <FaPhoneAlt size={10} color="#3498db" /> {req.contact}<br/>
//                                                             <span style={{ color: '#7f8c8d' }}>{req.email}</span>
//                                                         </div>
//                                                     </td>
//                                                     <td style={tdStyle}>
//                                                         <div style={{ fontSize: '13px', color: '#2c3e50' }}>
//                                                             {req.admittedAt}
//                                                         </div>
//                                                     </td>
//                                                     <td style={tdStyle}>
//                                                         <span style={statusBadge}>New Request</span>
//                                                     </td>
//                                                     <td style={tdStyle}>
//                                                         <button 
//                                                             style={approveBtn} 
//                                                             onClick={() => handleApprove(req)}
//                                                             title="Approve Appointment"
//                                                         >
//                                                             <FaCheck style={{ marginRight: '5px' }} /> Approve
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };

// // --- STYLES ---
// const headerSection = { marginBottom: '30px', borderBottom: '2px solid #e1e8ed', paddingBottom: '15px' };

// const deptHeader = {
//     backgroundColor: '#34495e',
//     color: '#fff',
//     padding: '10px 20px',
//     borderRadius: '8px 8px 0 0',
//     fontSize: '18px',
//     fontWeight: 'bold',
//     letterSpacing: '0.5px',
//     marginTop: '20px'
// };

// const doctorSection = {
//     marginBottom: '20px',
//     backgroundColor: '#fff',
//     border: '1px solid #e1e8ed',
//     borderTop: 'none',
//     padding: '15px',
//     borderRadius: '0 0 8px 8px'
// };

// const docHeader = {
//     fontSize: '16px',
//     fontWeight: '600',
//     color: '#2980b9',
//     marginBottom: '15px',
//     display: 'flex',
//     alignItems: 'center',
//     borderBottom: '1px dashed #eee',
//     paddingBottom: '10px'
// };

// const countBadge = {
//     backgroundColor: '#e1f5fe',
//     color: '#0288d1',
//     fontSize: '12px',
//     padding: '2px 8px',
//     borderRadius: '12px',
//     marginLeft: '10px',
//     fontWeight: 'normal'
// };

// const tableContainer = { backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' };
// const tableStyle = { width: '100%', borderCollapse: 'collapse' };
// const thStyle = { textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#7f8c8d', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' };
// const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #f1f4f8' };
// const rowStyle = { transition: 'background-color 0.2s' };
// const headerRowStyle = { borderBottom: '2px solid #eee' };
// const statusBadge = { backgroundColor: '#fff3cd', color: '#856404', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' };
// const approveBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', transition: 'background 0.3s' };

// export default OnlinePatient;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarCheck, FaUserMd, FaPhoneAlt, FaCheck, FaTimes } from 'react-icons/fa';

// Integrated Consultancy Fees Data
const consultancyFees = [
    { "id": "1", "department": "Cardiology", "fees": "2500" },
    { "id": "2", "department": "Orthopedic", "fees": "1800" },
    { "id": "3", "department": "Neurology", "fees": "4500" },
    { "id": "4", "department": "Pediatrics", "fees": "2000" },
    { "id": "5", "department": "Dermatology", "fees": "1800" },
    { "id": "6", "department": "Oncology", "fees": "1500" },
    { "id": "7", "department": "ENT", "fees": "2000" },
    { "id": "8", "department": "Gastroenterology", "fees": "2500" },
    { "id": "9", "department": "Urology", "fees": "2300" }
];

const OnlinePatient = () => {
    const [requests, setRequests] = useState([]);
    
    // New states for the payment/approval modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [paymentMode, setPaymentMode] = useState('Cash');

    useEffect(() => {
        fetchRequests();
        const intervalId = setInterval(() => {
            fetchRequests();
        }, 10000); 
        return () => clearInterval(intervalId);
    }, []);

    const fetchRequests = () => {
        axios.get('http://localhost:5000/appointments')
            .then(res => {
                const sorted = res.data.reverse();
                setRequests(sorted);
            })
            .catch(err => console.error("Error fetching online appointments:", err));
    };

    // 1. Trigger the modal instead of the default window.confirm
    const handleApproveClick = (patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
    };

    // 2. Logic to handle the final registration from the modal
    const handleConfirmRegistration = async () => {
        if (!selectedPatient) return;

        // Find the fee based on the department
        const deptFeeInfo = consultancyFees.find(f => f.department === selectedPatient.department);
        const feeAmount = deptFeeInfo ? deptFeeInfo.fees : "0"; // Default to 0 if department not found

        try {
            await axios.post('http://localhost:5000/patients', {
                ...selectedPatient,
                status: "Accepted",
                admittedDate: new Date().toLocaleDateString(),
                consultancyFee: feeAmount,  // Added fee
                paymentMode: paymentMode    // Added payment mode (Cash/UPI)
            });
            await axios.delete(`http://localhost:5000/appointments/${selectedPatient.id}`);
            
            alert(`Patient ${selectedPatient.fullName} Registered successfully!`);
            
            // Reset modal states
            setIsModalOpen(false);
            setSelectedPatient(null);
            setPaymentMode('Cash');
            
            fetchRequests();
        } catch (error) {
            console.error("Error approving patient:", error);
            alert("Failed to approve patient.");
        }
    };

    // Close modal safely
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPatient(null);
        setPaymentMode('Cash');
    };

    // --- GROUPING LOGIC: Department -> Doctor ---
    const groupedRequests = requests.reduce((acc, req) => {
        const dept = req.department || "General";
        const doc = req.doctorName || "Unassigned";

        if (!acc[dept]) {
            acc[dept] = {};
        }
        if (!acc[dept][doc]) {
            acc[dept][doc] = [];
        }
        acc[dept][doc].push(req);
        return acc;
    }, {});

    // Helper to get fee for display in modal
    const getFeeForSelectedPatient = () => {
        if (!selectedPatient) return "0";
        const deptFeeInfo = consultancyFees.find(f => f.department === selectedPatient.department);
        return deptFeeInfo ? deptFeeInfo.fees : "0";
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={headerSection}>
                <h2 style={{ color: '#2c3e50', margin: 0 }}>
                    <FaCalendarCheck style={{ marginRight: '15px', color: '#3498db' }} /> 
                    Online Patient Appointments
                </h2>
                <p style={{ color: '#7f8c8d' }}>You have {requests.length} new appointment requests. (Auto-refreshes every 10s)</p>
            </div>

            {Object.keys(groupedRequests).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6', backgroundColor: '#fff', borderRadius: '10px' }}>
                    <h3>No pending appointment requests found.</h3>
                </div>
            ) : (
                Object.keys(groupedRequests).map((dept) => (
                    <div key={dept} style={{ marginBottom: '40px' }}>
                        {/* 1. Department Header */}
                        <div style={deptHeader}>
                            {dept} Department
                        </div>

                        {Object.keys(groupedRequests[dept]).map((doc) => (
                            <div key={doc} style={doctorSection}>
                                {/* 2. Doctor Header */}
                                <div style={docHeader}>
                                    <FaUserMd style={{ marginRight: '8px' }} /> Dr. {doc}
                                    <span style={countBadge}>{groupedRequests[dept][doc].length} Requests</span>
                                </div>

                                {/* 3. Table for this Doctor */}
                                <div style={tableContainer}>
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={headerRowStyle}>
                                                <th style={thStyle}>Patient Details</th>
                                                <th style={thStyle}>Contact Info</th>
                                                <th style={thStyle}>Request Date</th>
                                                <th style={thStyle}>Status</th>
                                                <th style={thStyle}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupedRequests[dept][doc].map((req) => (
                                                <tr key={req.id} style={rowStyle}>
                                                    <td style={tdStyle}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <FaUserCircle size={35} color="#bdc3c7" />
                                                            <div>
                                                                <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{req.fullName}</div>
                                                                <small style={{ color: '#7f8c8d' }}>Age: {req.age} Years</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <div style={{ fontSize: '13px' }}>
                                                            <FaPhoneAlt size={10} color="#3498db" /> {req.contact}<br/>
                                                            <span style={{ color: '#7f8c8d' }}>{req.email}</span>
                                                        </div>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <div style={{ fontSize: '13px', color: '#2c3e50' }}>
                                                            {req.admittedAt}
                                                        </div>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <span style={statusBadge}>New Request</span>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        {/* Changed onClick to handleApproveClick */}
                                                        <button 
                                                            style={approveBtn} 
                                                            onClick={() => handleApproveClick(req)}
                                                            title="Approve Appointment"
                                                        >
                                                            <FaCheck style={{ marginRight: '5px' }} /> Approve
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}

            {/* --- CUSTOM MODAL FOR APPROVAL & PAYMENT --- */}
            {isModalOpen && selectedPatient && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={modalHeader}>
                            <h3 style={{ margin: 0 }}>Register Patient</h3>
                            <FaTimes style={{ cursor: 'pointer', color: '#7f8c8d' }} onClick={closeModal} />
                        </div>
                        
                        <div style={modalBody}>
                            <p><strong>Patient:</strong> {selectedPatient.fullName}</p>
                            <p><strong>Department:</strong> {selectedPatient.department}</p>
                            <p><strong>Consultancy Fee:</strong> ₹{getFeeForSelectedPatient()}</p>

                            <div style={{ marginTop: '20px' }}>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Select Payment Mode:</label>
                                <select 
                                    style={selectStyle} 
                                    value={paymentMode} 
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                </select>
                            </div>
                        </div>

                        <div style={modalFooter}>
                            <button style={cancelBtn} onClick={closeModal}>Cancel</button>
                            <button style={registerBtn} onClick={handleConfirmRegistration}>
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const headerSection = { marginBottom: '30px', borderBottom: '2px solid #e1e8ed', paddingBottom: '15px' };

const deptHeader = {
    backgroundColor: '#34495e',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px 8px 0 0',
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    marginTop: '20px'
};

const doctorSection = {
    marginBottom: '20px',
    backgroundColor: '#fff',
    border: '1px solid #e1e8ed',
    borderTop: 'none',
    padding: '15px',
    borderRadius: '0 0 8px 8px'
};

const docHeader = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2980b9',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px dashed #eee',
    paddingBottom: '10px'
};

const countBadge = { backgroundColor: '#e1f5fe', color: '#0288d1', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', marginLeft: '10px', fontWeight: 'normal' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#7f8c8d', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' };
const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #f1f4f8' };
const rowStyle = { transition: 'background-color 0.2s' };
const headerRowStyle = { borderBottom: '2px solid #eee' };
const statusBadge = { backgroundColor: '#fff3cd', color: '#856404', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' };
const approveBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', transition: 'background 0.3s' };

// --- MODAL STYLES ---
const modalOverlay = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContent = {
    backgroundColor: '#fff', padding: '20px', borderRadius: '8px',
    width: '400px', maxWidth: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const modalHeader = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px',
    color: '#2c3e50'
};

const modalBody = { marginBottom: '20px', color: '#34495e' };

const selectStyle = {
    width: '100%', padding: '10px', borderRadius: '4px',
    border: '1px solid #bdc3c7', fontSize: '14px', outline: 'none'
};

const modalFooter = { display: 'flex', justifyContent: 'flex-end', gap: '10px' };

const cancelBtn = {
    backgroundColor: '#ecf0f1', color: '#7f8c8d', border: 'none',
    padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
};

const registerBtn = {
    backgroundColor: '#3498db', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
};

export default OnlinePatient;