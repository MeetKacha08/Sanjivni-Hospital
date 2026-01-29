// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaUserCircle, FaCalendarCheck, FaUserMd, FaPhoneAlt, FaCheck } from 'react-icons/fa';

// const OnlinePatient = () => {
//     const [requests, setRequests] = useState([]);

//     useEffect(() => {
//         // 1. Initial fetch when component mounts
//         fetchRequests();

//         // 2. 🔥 Set up interval to fetch data every 10 seconds
//         const intervalId = setInterval(() => {
//             fetchRequests();
//             console.log("Refreshing online appointments..."); // Optional: for debugging
//         }, 10000); 

//         // 3. Clean up the interval when the component is unmounted
//         return () => clearInterval(intervalId);
//     }, []);

//     const fetchRequests = () => {
//         axios.get('http://localhost:5000/appointments')
//             .then(res => {
//                 // Sorting by date to show newest requests first
//                 const sorted = res.data.reverse();
//                 setRequests(sorted);
//             })
//             .catch(err => console.error("Error fetching online appointments:", err));
//     };

//     // Logic to handle patient approval
//     const handleApprove = async (patient) => {
//         const confirmApprove = window.confirm(`Are you sure you want to approve ${patient.fullName}?`);
//         if (confirmApprove) {
//             try {
//                 // 1. Update status to 'Accepted' or move to patients collection
//                 await axios.post('http://localhost:5000/patients', {
//                     ...patient,
//                     status: "Accepted",
//                     admittedDate: new Date().toLocaleDateString()
//                 });

//                 // 2. Remove from the online appointments list
//                 await axios.delete(`http://localhost:5000/appointments/${patient.id}`);

//                 alert("Patient Approved successfully!");
//                 fetchRequests(); // Manual refresh after action
//             } catch (error) {
//                 console.error("Error approving patient:", error);
//                 alert("Failed to approve patient.");
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <div style={headerSection}>
//                 <h2 style={{ color: '#2c3e50', margin: 0 }}>
//                     <FaCalendarCheck style={{ marginRight: '15px', color: '#3498db' }} /> 
//                     Online Patient Appointments
//                 </h2>
//                 <p style={{ color: '#7f8c8d' }}>You have {requests.length} new appointment requests. (Auto-refreshes every 10s)</p>
//             </div>

//             <div style={tableContainer}>
//                 <table style={tableStyle}>
//                     <thead>
//                         <tr style={headerRowStyle}>
//                             <th style={thStyle}>Patient Details</th>
//                             <th style={thStyle}>Contact Info</th>
//                             <th style={thStyle}>Assigned Doctor</th>
//                             <th style={thStyle}>Request Date</th>
//                             <th style={thStyle}>Status</th>
//                             <th style={thStyle}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {requests.length > 0 ? requests.map((req) => (
//                             <tr key={req.id} style={rowStyle}>
//                                 <td style={tdStyle}>
//                                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                                         <FaUserCircle size={35} color="#bdc3c7" />
//                                         <div>
//                                             <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{req.fullName}</div>
//                                             <small style={{ color: '#7f8c8d' }}>Age: {req.age} Years</small>
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td style={tdStyle}>
//                                     <div style={{ fontSize: '13px' }}>
//                                         <FaPhoneAlt size={10} color="#3498db" /> {req.contact}<br/>
//                                         <span style={{ color: '#7f8c8d' }}>{req.email}</span>
//                                     </div>
//                                 </td>
//                                 <td style={tdStyle}>
//                                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2c3e50', fontWeight: '500' }}>
//                                         <FaUserMd color="#007bff" />
//                                         <div>
//                                             {req.doctorName}
//                                             <div style={{ fontSize: '11px', color: '#95a5a6' }}>{req.department}</div>
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td style={tdStyle}>
//                                     <div style={{ fontSize: '13px', color: '#2c3e50' }}>
//                                         {req.admittedAt}
//                                     </div>
//                                 </td>
//                                 <td style={tdStyle}>
//                                     <span style={statusBadge}>New Request</span>
//                                 </td>
//                                 <td style={tdStyle}>
//                                     <button 
//                                         style={approveBtn} 
//                                         onClick={() => handleApprove(req)}
//                                         title="Approve Appointment"
//                                     >
//                                         <FaCheck style={{ marginRight: '5px' }} /> Approve
//                                     </button>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="6" style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
//                                     No appointment requests found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const headerSection = { marginBottom: '30px', borderBottom: '2px solid #e1e8ed', paddingBottom: '15px' };
// const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
// const tableStyle = { width: '100%', borderCollapse: 'collapse' };
// const thStyle = { textAlign: 'left', padding: '15px 20px', backgroundColor: '#f8f9fa', color: '#7f8c8d', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' };
// const tdStyle = { padding: '15px 20px', borderBottom: '1px solid #f1f4f8' };
// const rowStyle = { transition: 'background-color 0.2s' };
// const headerRowStyle = { borderBottom: '2px solid #eee' };
// const statusBadge = { backgroundColor: '#e1f5fe', color: '#0288d1', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' };
// const approveBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', transition: 'background 0.3s' };

// export default OnlinePatient;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarCheck, FaUserMd, FaPhoneAlt, FaCheck, FaStethoscope } from 'react-icons/fa';

const OnlinePatient = () => {
    const [requests, setRequests] = useState([]);

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

    const handleApprove = async (patient) => {
        const confirmApprove = window.confirm(`Are you sure you want to approve ${patient.fullName}?`);
        if (confirmApprove) {
            try {
                await axios.post('http://localhost:5000/patients', {
                    ...patient,
                    status: "Accepted",
                    admittedDate: new Date().toLocaleDateString()
                });
                await axios.delete(`http://localhost:5000/appointments/${patient.id}`);
                alert("Patient Approved successfully!");
                fetchRequests();
            } catch (error) {
                console.error("Error approving patient:", error);
                alert("Failed to approve patient.");
            }
        }
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
                                                        <button 
                                                            style={approveBtn} 
                                                            onClick={() => handleApprove(req)}
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

const countBadge = {
    backgroundColor: '#e1f5fe',
    color: '#0288d1',
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '12px',
    marginLeft: '10px',
    fontWeight: 'normal'
};

const tableContainer = { backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#7f8c8d', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' };
const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #f1f4f8' };
const rowStyle = { transition: 'background-color 0.2s' };
const headerRowStyle = { borderBottom: '2px solid #eee' };
const statusBadge = { backgroundColor: '#fff3cd', color: '#856404', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' };
const approveBtn = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', transition: 'background 0.3s' };

export default OnlinePatient;