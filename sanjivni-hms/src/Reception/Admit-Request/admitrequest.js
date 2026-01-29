// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaProcedures, FaUserMd, FaHospitalUser, FaClock, FaCheck, FaTimes, FaBed, FaSave, FaDoorOpen, FaListUl } from 'react-icons/fa';

// const Admitrequest = () => {
//     const [requests, setRequests] = useState([]);
//     const [roomsData, setRoomsData] = useState([]); // Store entire rooms config from DB
    
//     // --- MODAL STATES ---
//     const [showModal, setShowModal] = useState(false);
//     const [selectedRequest, setSelectedRequest] = useState(null);
//     const [roomType, setRoomType] = useState("");
//     const [allocatedRoom, setAllocatedRoom] = useState(""); 

//     const roomTypes = ["ICU", "Private Room", "General Room", "General Ward"];

//     useEffect(() => {
//         fetchData();
//         const intervalId = setInterval(fetchData, 5000);
//         return () => clearInterval(intervalId);
//     }, []);

//     const fetchData = () => {
//         axios.get('http://localhost:5000/admitRequests')
//             .then(res => setRequests(res.data))
//             .catch(err => console.error("Error requests:", err));

//         // 🔥 Fetch Room Configuration directly (This contains status of every bed)
//         axios.get('http://localhost:5000/rooms')
//             .then(res => setRoomsData(res.data))
//             .catch(err => console.error("Error rooms:", err));
//     };

//     // --- LOGIC: Filter Available Rooms from 'rooms' data ---
//     const getAvailableRooms = (selectedType) => {
//         const roomCategory = roomsData.find(r => r.name === selectedType);
//         if (!roomCategory) return [];

//         // Return only beds where status is "Available"
//         return roomCategory.roomList
//             .filter(bed => bed.status === "Available")
//             .map(bed => bed.id);
//     };

//     // Open Modal
//     const handleApproveClick = (req) => {
//         setSelectedRequest(req);
//         setRoomType(req.requestedRoomType || ""); 
//         setAllocatedRoom(""); 
//         setShowModal(true);
//     };

//     // Finalize Admission
//     const confirmAdmission = async () => {
//         if (!roomType) { alert("Please select a Room Type."); return; }
//         if (!allocatedRoom) { alert("Please select a specific Available Room."); return; }

//         try {
//             // 1. Fetch full patient details
//             const patientRes = await axios.get(`http://localhost:5000/patients/${selectedRequest.patientId}`);
//             const fullPatientData = patientRes.data;
//             const admissionDate = new Date().toLocaleDateString();

//             // 2. Prepare Admitted Data for 'admitted' table
//             const admittedData = {
//                 ...fullPatientData,
//                 roomType: roomType,
//                 allocatedRoom: allocatedRoom,
//                 admissionStatus: "Admitted",
//                 admissionTimestamp: new Date().toLocaleString(),
//                 admittedBy: selectedRequest.doctorName
//             };

//             // 3. Find the specific Room Category object to update
//             const categoryToUpdate = roomsData.find(r => r.name === roomType);
            
//             // 4. Create UPDATED roomList with the specific bed marked as occupied
//             const updatedRoomList = categoryToUpdate.roomList.map(bed => {
//                 if (bed.id === allocatedRoom) {
//                     return {
//                         ...bed,
//                         status: "Occupied",
//                         occupiedBy: fullPatientData.fullName,
//                         admitDate: admissionDate
//                     };
//                 }
//                 return bed;
//             });

//             // --- EXECUTE DB UPDATES ---
            
//             // A. Update the 'rooms' collection (This reflects on Room Page)
//             await axios.patch(`http://localhost:5000/rooms/${categoryToUpdate.id}`, {
//                 roomList: updatedRoomList
//             });

//             // B. Add to 'admitted' table
//             await axios.post('http://localhost:5000/admitted', admittedData);
            
//             // C. Remove from 'admitRequests'
//             await axios.delete(`http://localhost:5000/admitRequests/${selectedRequest.id}`);

//             alert(`Success! ${fullPatientData.fullName} admitted to ${allocatedRoom}.`);
            
//             // Cleanup
//             setShowModal(false);
//             setRoomType("");
//             setAllocatedRoom("");
//             fetchData(); 

//         } catch (error) {
//             console.error("Error finalizing admission:", error);
//             alert("Error finalizing admission.");
//         }
//     };

//     const handleReject = async (id) => {
//         if (window.confirm("Reject request?")) {
//             await axios.delete(`http://localhost:5000/admitRequests/${id}`);
//             fetchData();
//         }
//     };

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <h2 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #e67e22', paddingBottom: '10px' }}>
//                 <FaProcedures style={{ marginRight: '10px' }} /> Admission Requests
//             </h2>

//             <div style={gridContainer}>
//                 {requests.length > 0 ? requests.map((req) => (
//                     <div key={req.id} style={cardStyle}>
//                         <div style={cardHeader}>
//                             <h3 style={{ margin: 0, color: '#34495e' }}>{req.patientName}</h3>
//                             <span style={statusBadge}>{req.status}</span>
//                         </div>
//                         <div style={infoRow}><FaHospitalUser style={iconStyle} /> <span>Dept: <b>{req.department}</b></span></div>
//                         <div style={infoRow}><FaUserMd style={iconStyle} /> <span>Dr. {req.doctorName}</span></div>
//                         <div style={infoRow}><FaClock style={iconStyle} /> <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{req.requestDate}</span></div>
//                         {req.requestedRoomType && <div style={{ ...infoRow, color: '#e67e22', fontSize: '13px' }}><FaBed /> Suggested: {req.requestedRoomType}</div>}

//                         <div style={actionRow}>
//                             <button style={approveBtn} onClick={() => handleApproveClick(req)}><FaCheck /> Approve</button>
//                             <button style={rejectBtn} onClick={() => handleReject(req.id)}><FaTimes /> Reject</button>
//                         </div>
//                     </div>
//                 )) : <p style={{ color: '#7f8c8d' }}>No pending requests.</p>}
//             </div>

//             {/* --- FINALIZATION POPUP --- */}
//             {showModal && selectedRequest && (
//                 <div style={modalOverlay}>
//                     <div style={{ ...modalContent, width: '700px', display: 'flex', gap: '20px' }}>
                        
//                         {/* LEFT SIDE: Available Room Summary */}
//                         <div style={{ flex: 1, borderRight: '1px solid #eee', paddingRight: '20px' }}>
//                             <h4 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
//                                 <FaListUl style={{ marginRight: '8px' }} /> Availability Status
//                             </h4>
//                             <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
//                                 {roomsData.map(roomCat => {
//                                     const availableCount = roomCat.roomList.filter(b => b.status === "Available").length;
//                                     return (
//                                         <div key={roomCat.id} style={{ 
//                                             display: 'flex', justifyContent: 'space-between', padding: '10px', 
//                                             marginBottom: '8px', borderRadius: '5px',
//                                             backgroundColor: availableCount > 0 ? '#e8f5e9' : '#ffebee',
//                                             border: availableCount > 0 ? '1px solid #c8e6c9' : '1px solid #ffcdd2'
//                                         }}>
//                                             <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>{roomCat.name}</span>
//                                             <span style={{ fontSize: '13px', fontWeight: 'bold', color: availableCount > 0 ? '#2e7d32' : '#c62828' }}>
//                                                 {availableCount} Free
//                                             </span>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>

//                         {/* RIGHT SIDE: Selection Form */}
//                         <div style={{ flex: 1.2 }}>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                                 <h3 style={{ margin: 0, color: '#27ae60' }}>Finalize Admission</h3>
//                                 <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
//                             </div>

//                             <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
//                                 <p style={{ margin: '5px 0' }}><b>Patient:</b> {selectedRequest.patientName}</p>
//                                 <p style={{ margin: '5px 0' }}><b>Doctor:</b> {selectedRequest.doctorName}</p>
//                             </div>

//                             <label style={labelStyle}>Assign Room Type:</label>
//                             <select 
//                                 style={inputStyle}
//                                 value={roomType}
//                                 onChange={(e) => {
//                                     setRoomType(e.target.value);
//                                     setAllocatedRoom(""); 
//                                 }}
//                             >
//                                 <option value="">-- Select Type --</option>
//                                 {roomTypes.map(r => <option key={r} value={r}>{r}</option>)}
//                             </select>

//                             <label style={labelStyle}>Select Available Room:</label>
//                             <select 
//                                 style={{...inputStyle, backgroundColor: roomType ? 'white' : '#f0f0f0'}}
//                                 value={allocatedRoom}
//                                 onChange={(e) => setAllocatedRoom(e.target.value)}
//                                 disabled={!roomType}
//                             >
//                                 <option value="">
//                                     {roomType ? `-- Select Room (${getAvailableRooms(roomType).length} Free) --` : "-- Select Type First --"}
//                                 </option>
//                                 {getAvailableRooms(roomType).map(roomId => (
//                                     <option key={roomId} value={roomId}>{roomId}</option>
//                                 ))}
//                             </select>

//                             <button style={confirmBtn} onClick={confirmAdmission}>
//                                 <FaSave style={{ marginRight: '5px' }} /> Confirm & Admit
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- STYLES ---
// const gridContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' };
// const cardStyle = { backgroundColor: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #e67e22' };
// const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' };
// const statusBadge = { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' };
// const infoRow = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#555' };
// const iconStyle = { color: '#95a5a6' };
// const actionRow = { display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' };
// const approveBtn = { flex: 1, backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: 'bold' };
// const rejectBtn = { flex: 1, backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: 'bold' };

// // Modal Styles
// const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
// const modalContent = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
// const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '14px' };
// const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#34495e' };
// const confirmBtn = { width: '100%', backgroundColor: '#2980b9', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', marginTop: '10px' };

// export default Admitrequest;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaProcedures, FaUserMd, FaHospitalUser, FaClock, FaCheck, FaTimes, FaBed, FaSave, FaDoorOpen, FaListUl } from 'react-icons/fa';

const Admitrequest = () => {
    const [requests, setRequests] = useState([]);
    const [roomsData, setRoomsData] = useState([]); // Store entire rooms config from DB
    
    // --- MODAL STATES ---
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [roomType, setRoomType] = useState("");
    const [allocatedRoom, setAllocatedRoom] = useState(""); 

    const roomTypes = ["ICU", "Private Room", "General Room", "General Ward"];

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:5000/admitRequests')
            .then(res => setRequests(res.data))
            .catch(err => console.error("Error requests:", err));

        // 🔥 Fetch Room Configuration directly (This contains status of every bed)
        axios.get('http://localhost:5000/rooms')
            .then(res => setRoomsData(res.data))
            .catch(err => console.error("Error rooms:", err));
    };

    // --- LOGIC: Filter Available Rooms from 'rooms' data ---
    const getAvailableRooms = (selectedType) => {
        // 1. Find the category object (e.g. ICU)
        const roomCategory = roomsData.find(r => r.name === selectedType);
        
        if (!roomCategory) return [];

        // 2. Return only the IDs of beds that are explicitly marked as "Available"
        return roomCategory.roomList
            .filter(bed => bed.status === "Available")
            .map(bed => bed.id);
    };

    // Open Modal
    const handleApproveClick = (req) => {
        setSelectedRequest(req);
        setRoomType(req.requestedRoomType || ""); 
        setAllocatedRoom(""); 
        setShowModal(true);
    };

    // Finalize Admission
    const confirmAdmission = async () => {
        if (!roomType) { alert("Please select a Room Type."); return; }
        if (!allocatedRoom) { alert("Please select a specific Available Room."); return; }

        try {
            // 1. Fetch full patient details
            const patientRes = await axios.get(`http://localhost:5000/patients/${selectedRequest.patientId}`);
            const fullPatientData = patientRes.data;
            const admissionDate = new Date().toLocaleDateString();

            // 2. Prepare Admitted Data for 'admitted' table
            const admittedData = {
                ...fullPatientData,
                roomType: roomType,
                allocatedRoom: allocatedRoom,
                admissionStatus: "Admitted",
                admissionTimestamp: new Date().toLocaleString(),
                admittedBy: selectedRequest.doctorName
            };

            // 3. Find the specific Room Category object to update
            const categoryToUpdate = roomsData.find(r => r.name === roomType);
            
            // 4. Create UPDATED roomList with the specific bed marked as occupied
            const updatedRoomList = categoryToUpdate.roomList.map(bed => {
                if (bed.id === allocatedRoom) {
                    return {
                        ...bed,
                        status: "Occupied",
                        occupiedBy: fullPatientData.fullName,
                        admitDate: admissionDate
                    };
                }
                return bed;
            });

            // --- EXECUTE DB UPDATES ---
            
            // A. Update the 'rooms' collection (This reflects on Room Page)
            await axios.patch(`http://localhost:5000/rooms/${categoryToUpdate.id}`, {
                roomList: updatedRoomList
            });

            // B. Add to 'admitted' table
            await axios.post('http://localhost:5000/admitted', admittedData);
            
            // C. Remove from 'admitRequests'
            await axios.delete(`http://localhost:5000/admitRequests/${selectedRequest.id}`);

            alert(`Success! ${fullPatientData.fullName} admitted to ${allocatedRoom}.`);
            
            // Cleanup
            setShowModal(false);
            setRoomType("");
            setAllocatedRoom("");
            fetchData(); 

        } catch (error) {
            console.error("Error finalizing admission:", error);
            alert("Error finalizing admission.");
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Reject request?")) {
            await axios.delete(`http://localhost:5000/admitRequests/${id}`);
            fetchData();
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #e67e22', paddingBottom: '10px' }}>
                <FaProcedures style={{ marginRight: '10px' }} /> Admission Requests
            </h2>

            <div style={gridContainer}>
                {requests.length > 0 ? requests.map((req) => (
                    <div key={req.id} style={cardStyle}>
                        <div style={cardHeader}>
                            <h3 style={{ margin: 0, color: '#34495e' }}>{req.patientName}</h3>
                            <span style={statusBadge}>{req.status}</span>
                        </div>
                        <div style={infoRow}><FaHospitalUser style={iconStyle} /> <span>Dept: <b>{req.department}</b></span></div>
                        <div style={infoRow}><FaUserMd style={iconStyle} /> <span>Dr. {req.doctorName}</span></div>
                        <div style={infoRow}><FaClock style={iconStyle} /> <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{req.requestDate}</span></div>
                        {req.requestedRoomType && <div style={{ ...infoRow, color: '#e67e22', fontSize: '13px' }}><FaBed /> Suggested: {req.requestedRoomType}</div>}

                        <div style={actionRow}>
                            <button style={approveBtn} onClick={() => handleApproveClick(req)}><FaCheck /> Approve</button>
                            <button style={rejectBtn} onClick={() => handleReject(req.id)}><FaTimes /> Reject</button>
                        </div>
                    </div>
                )) : <p style={{ color: '#7f8c8d' }}>No pending requests.</p>}
            </div>

            {/* --- FINALIZATION POPUP --- */}
            {showModal && selectedRequest && (
                <div style={modalOverlay}>
                    <div style={{ ...modalContent, width: '700px', display: 'flex', gap: '20px' }}>
                        
                        {/* LEFT SIDE: Available Room Summary */}
                        <div style={{ flex: 1, borderRight: '1px solid #eee', paddingRight: '20px' }}>
                            <h4 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <FaListUl style={{ marginRight: '8px' }} /> Availability Status
                            </h4>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {roomsData.map(roomCat => {
                                    // Count how many beds have status "Available"
                                    const availableCount = roomCat.roomList.filter(b => b.status === "Available").length;
                                    return (
                                        <div key={roomCat.id} style={{ 
                                            display: 'flex', justifyContent: 'space-between', padding: '10px', 
                                            marginBottom: '8px', borderRadius: '5px',
                                            backgroundColor: availableCount > 0 ? '#e8f5e9' : '#ffebee',
                                            border: availableCount > 0 ? '1px solid #c8e6c9' : '1px solid #ffcdd2'
                                        }}>
                                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>{roomCat.name}</span>
                                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: availableCount > 0 ? '#2e7d32' : '#c62828' }}>
                                                {availableCount} Free
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT SIDE: Selection Form */}
                        <div style={{ flex: 1.2 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, color: '#27ae60' }}>Finalize Admission</h3>
                                <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
                            </div>

                            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                                <p style={{ margin: '5px 0' }}><b>Patient:</b> {selectedRequest.patientName}</p>
                                <p style={{ margin: '5px 0' }}><b>Doctor:</b> {selectedRequest.doctorName}</p>
                            </div>

                            <label style={labelStyle}>Assign Room Type:</label>
                            <select 
                                style={inputStyle}
                                value={roomType}
                                onChange={(e) => {
                                    setRoomType(e.target.value);
                                    setAllocatedRoom(""); 
                                }}
                            >
                                <option value="">-- Select Type --</option>
                                {roomTypes.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>

                            <label style={labelStyle}>Select Available Room:</label>
                            <select 
                                style={{...inputStyle, backgroundColor: roomType ? 'white' : '#f0f0f0'}}
                                value={allocatedRoom}
                                onChange={(e) => setAllocatedRoom(e.target.value)}
                                disabled={!roomType}
                            >
                                <option value="">
                                    {roomType ? `-- Select Room (${getAvailableRooms(roomType).length} Free) --` : "-- Select Type First --"}
                                </option>
                                {/* Filtered List of Available Rooms */}
                                {getAvailableRooms(roomType).map(roomId => (
                                    <option key={roomId} value={roomId}>{roomId}</option>
                                ))}
                            </select>

                            {roomType && (
                                <div style={{ textAlign: 'right', fontSize: '12px', color: '#27ae60', marginBottom: '15px' }}>
                                    <FaDoorOpen /> {getAvailableRooms(roomType).length} rooms available in {roomType}
                                </div>
                            )}

                            <button style={confirmBtn} onClick={confirmAdmission}>
                                <FaSave style={{ marginRight: '5px' }} /> Confirm & Admit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const gridContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #e67e22' };
const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' };
const statusBadge = { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' };
const infoRow = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#555' };
const iconStyle = { color: '#95a5a6' };
const actionRow = { display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' };
const approveBtn = { flex: 1, backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: 'bold' };
const rejectBtn = { flex: 1, backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: 'bold' };

// Modal Styles
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#34495e' };
const confirmBtn = { width: '100%', backgroundColor: '#2980b9', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', marginTop: '10px' };

export default Admitrequest;