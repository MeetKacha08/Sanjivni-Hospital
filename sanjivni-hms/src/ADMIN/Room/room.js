// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaBed, FaProcedures, FaUserShield, FaHospitalAlt, FaEdit, FaTimes, FaUserCircle } from 'react-icons/fa';

// const Room = () => {
//     const [admittedPatients, setAdmittedPatients] = useState([]);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [selectedRoom, setSelectedRoom] = useState(null);
//     const [newCapacity, setNewCapacity] = useState("");
    
//     const [totalCapacity, setTotalCapacity] = useState({
//         "ICU": 10,
//         "Private Room": 15,
//         "General Room": 30,
//         "General Ward": 50
//     });

//     useEffect(() => {
//         fetchAdmittedData();
//     }, []);

//     const fetchAdmittedData = () => {
//         axios.get('http://localhost:5000/admitted')
//             .then(res => setAdmittedPatients(res.data))
//             .catch(err => console.error("Error fetching room data:", err));
//     };

//     const getOccupiedCount = (type) => {
//         return admittedPatients.filter(p => p.roomType === type).length;
//     };

//     // Helper to get patients for a specific category
//     const getPatientsInRoom = (type) => {
//         return admittedPatients.filter(p => p.roomType === type);
//     };

//     const handleEditClick = (roomName) => {
//         setSelectedRoom(roomName);
//         setNewCapacity(totalCapacity[roomName]);
//         setShowEditModal(true);
//     };

//     const saveCapacity = (e) => {
//         e.preventDefault();
//         setTotalCapacity({
//             ...totalCapacity,
//             [selectedRoom]: parseInt(newCapacity)
//         });
//         setShowEditModal(false);
//     };

//     const roomCategories = [
//         { name: "ICU", icon: <FaUserShield size={30} />, color: "#e53e3e", prefix: "ICU" },
//         { name: "Private Room", icon: <FaProcedures size={30} />, color: "#3182ce", prefix: "PR" },
//         { name: "General Room", icon: <FaBed size={30} />, color: "#38a169", prefix: "GR" },
//         { name: "General Ward", icon: <FaHospitalAlt size={30} />, color: "#805ad5", prefix: "GW" }
//     ];

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <h2 style={{ color: '#2c3e50', marginBottom: '30px', borderBottom: '2px solid #3182ce', paddingBottom: '10px' }}>
//                 Hospital Room Availability & Patient Allocation
//             </h2>

//             <div style={gridStyle}>
//                 {roomCategories.map((room) => {
//                     const roomPatients = getPatientsInRoom(room.name);
//                     const occupied = roomPatients.length;
//                     const total = totalCapacity[room.name];
//                     const available = total - occupied;

//                     return (
//                         <div key={room.name} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//                             {/* STAT CARD */}
//                             <div style={cardStyle}>
//                                 <div style={{ ...iconCircle, backgroundColor: room.color }}>
//                                     {room.icon}
//                                 </div>
//                                 <h3 style={{ margin: '15px 0 5px 0', color: '#2d3748' }}>{room.name}</h3>
//                                 <p style={{ fontSize: '12px', color: '#718096', margin: '0 0 15px 0' }}>
//                                     Range: {room.prefix}-01 to {room.prefix}-{total.toString().padStart(2, '0')}
//                                 </p>
                                
//                                 <div style={statContainer}>
//                                     <div style={statItem}><span style={labelStyle}>Total</span><span style={valueStyle}>{total}</span></div>
//                                     <div style={statItem}><span style={labelStyle}>Occupied</span><span style={{ ...valueStyle, color: '#e53e3e' }}>{occupied}</span></div>
//                                     <div style={statItem}><span style={labelStyle}>Available</span><span style={{ ...valueStyle, color: '#38a169' }}>{available}</span></div>
//                                 </div>

//                                 <div style={progressBarContainer}>
//                                     <div style={{ ...progressBarFill, width: `${Math.min((occupied / total) * 100, 100)}%`, backgroundColor: room.color }}></div>
//                                 </div>

//                                 <button onClick={() => handleEditClick(room.name)} style={{...editBtn, color: room.color, borderColor: room.color}}>
//                                     <FaEdit style={{marginRight: '5px'}}/> Edit Capacity
//                                 </button>
//                             </div>

//                             {/* --- PATIENT LIST FOR THIS CATEGORY --- */}
//                             <div style={patientListContainer}>
//                                 <h4 style={{ fontSize: '14px', marginBottom: '10px', color: room.color, borderBottom: `1px solid ${room.color}`, paddingBottom: '5px' }}>
//                                     Occupied Beds ({room.name})
//                                 </h4>
//                                 {roomPatients.length > 0 ? (
//                                     roomPatients.map((p, index) => (
//                                         <div key={p.id} style={patientItemStyle}>
//                                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                 <FaUserCircle color="#cbd5e0" />
//                                                 <span style={{ fontWeight: '600', fontSize: '13px' }}>{p.fullName}</span>
//                                             </div>
//                                             <span style={{ ...bedLabel, backgroundColor: room.color }}>
//                                                 {room.prefix}-{(index + 1).toString().padStart(2, '0')}
//                                             </span>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p style={{ fontSize: '12px', color: '#a0aec0', fontStyle: 'italic', textAlign: 'center' }}>No patients assigned</p>
//                                 )}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {showEditModal && (
//                 <div style={modalOverlay}>
//                     <div style={modalContent}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                             <h3 style={{ margin: 0 }}>Update {selectedRoom}</h3>
//                             <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowEditModal(false)} />
//                         </div>
//                         <form onSubmit={saveCapacity}>
//                             <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px' }}>Enter Total Bed Capacity:</label>
//                             <input type="number" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} required style={inputStyle} />
//                             <button type="submit" style={saveBtn}>Update Capacity</button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- STYLES ---

// const patientListContainer = {
//     backgroundColor: '#fff',
//     borderRadius: '12px',
//     padding: '15px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//     border: '1px solid #edf2f7',
//     maxHeight: '250px',
//     overflowY: 'auto'
// };

// const patientItemStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '8px 0',
//     borderBottom: '1px solid #f7fafc'
// };

// const bedLabel = {
//     color: 'white',
//     fontSize: '10px',
//     fontWeight: 'bold',
//     padding: '2px 8px',
//     borderRadius: '10px'
// };

// const editBtn = { marginTop: '20px', backgroundColor: 'transparent', border: '1px solid', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' };
// const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
// const modalContent = { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' };
// const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '20px', outline: 'none' };
// const saveBtn = { width: '100%', padding: '10px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };
// const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', alignItems: 'start' };
// const cardStyle = { backgroundColor: '#fff', borderRadius: '15px', padding: '25px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
// const iconCircle = { width: '60px', height: '60px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' };
// const statContainer = { display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '10px 0', borderTop: '1px solid #edf2f7' };
// const statItem = { display: 'flex', flexDirection: 'column' };
// const labelStyle = { fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: 'bold' };
// const valueStyle = { fontSize: '18px', fontWeight: '700', color: '#2d3748' };
// const progressBarContainer = { width: '100%', height: '8px', backgroundColor: '#edf2f7', borderRadius: '4px', marginTop: '15px', overflow: 'hidden' };
// const progressBarFill = { height: '100%', transition: 'width 0.5s ease-in-out' };

// export default Room;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBed, FaProcedures, FaUserShield, FaHospitalAlt, FaEdit, FaTimes, FaUserCircle, FaMicroscope } from 'react-icons/fa';

const Room = () => {
    const [admittedPatients, setAdmittedPatients] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [newCapacity, setNewCapacity] = useState("");
    
    // 🔥 Added "Operation Theater" to totalCapacity
    const [totalCapacity, setTotalCapacity] = useState({
        "ICU": 10,
        "Private Room": 15,
        "General Room": 30,
        "General Ward": 50,
        "Operation Theater": 5 
    });

    useEffect(() => {
        fetchAdmittedData();
    }, []);

    const fetchAdmittedData = () => {
        axios.get('http://localhost:5000/admitted')
            .then(res => setAdmittedPatients(res.data))
            .catch(err => console.error("Error fetching room data:", err));
    };

    const getOccupiedCount = (type) => {
        return admittedPatients.filter(p => p.roomType === type).length;
    };

    const getPatientsInRoom = (type) => {
        return admittedPatients.filter(p => p.roomType === type);
    };

    const handleEditClick = (roomName) => {
        setSelectedRoom(roomName);
        setNewCapacity(totalCapacity[roomName]);
        setShowEditModal(true);
    };

    const saveCapacity = (e) => {
        e.preventDefault();
        setTotalCapacity({
            ...totalCapacity,
            [selectedRoom]: parseInt(newCapacity)
        });
        setShowEditModal(false);
    };

    // 🔥 Added "Operation Theater" object to roomCategories
    const roomCategories = [
        { name: "ICU", icon: <FaUserShield size={30} />, color: "#e53e3e", prefix: "ICU" },
        { name: "Operation Theater", icon: <FaMicroscope size={30} />, color: "#dd6b20", prefix: "OT" },
        { name: "Private Room", icon: <FaProcedures size={30} />, color: "#3182ce", prefix: "PR" },
        { name: "General Room", icon: <FaBed size={30} />, color: "#38a169", prefix: "GR" },
        { name: "General Ward", icon: <FaHospitalAlt size={30} />, color: "#805ad5", prefix: "GW" }
    ];

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', borderBottom: '2px solid #3182ce', paddingBottom: '10px' }}>
                Hospital Room Availability & Patient Allocation
            </h2>

            <div style={gridStyle}>
                {roomCategories.map((room) => {
                    const roomPatients = getPatientsInRoom(room.name);
                    const occupied = roomPatients.length;
                    const total = totalCapacity[room.name];
                    const available = total - occupied;

                    return (
                        <div key={room.name} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={cardStyle}>
                                <div style={{ ...iconCircle, backgroundColor: room.color }}>
                                    {room.icon}
                                </div>
                                <h3 style={{ margin: '15px 0 5px 0', color: '#2d3748' }}>{room.name}</h3>
                                <p style={{ fontSize: '12px', color: '#718096', margin: '0 0 15px 0' }}>
                                    Range: {room.prefix}-01 to {room.prefix}-{total.toString().padStart(2, '0')}
                                </p>
                                
                                <div style={statContainer}>
                                    <div style={statItem}><span style={labelStyle}>Total</span><span style={valueStyle}>{total}</span></div>
                                    <div style={statItem}><span style={labelStyle}>Occupied</span><span style={{ ...valueStyle, color: '#e53e3e' }}>{occupied}</span></div>
                                    <div style={statItem}><span style={labelStyle}>Available</span><span style={{ ...valueStyle, color: '#38a169' }}>{available}</span></div>
                                </div>

                                <div style={progressBarContainer}>
                                    <div style={{ ...progressBarFill, width: `${Math.min((occupied / total) * 100, 100)}%`, backgroundColor: room.color }}></div>
                                </div>

                                <button onClick={() => handleEditClick(room.name)} style={{...editBtn, color: room.color, borderColor: room.color}}>
                                    <FaEdit style={{marginRight: '5px'}}/> Edit Capacity
                                </button>
                            </div>

                            <div style={patientListContainer}>
                                <h4 style={{ fontSize: '14px', marginBottom: '10px', color: room.color, borderBottom: `1px solid ${room.color}`, paddingBottom: '5px' }}>
                                    Current Occupancy ({room.name})
                                </h4>
                                {roomPatients.length > 0 ? (
                                    roomPatients.map((p, index) => (
                                        <div key={p.id} style={patientItemStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FaUserCircle color="#cbd5e0" />
                                                <span style={{ fontWeight: '600', fontSize: '13px' }}>{p.fullName}</span>
                                            </div>
                                            <span style={{ ...bedLabel, backgroundColor: room.color }}>
                                                {room.prefix}-{(index + 1).toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ fontSize: '12px', color: '#a0aec0', fontStyle: 'italic', textAlign: 'center' }}>No patients assigned</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showEditModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Update {selectedRoom}</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowEditModal(false)} />
                        </div>
                        <form onSubmit={saveCapacity}>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px' }}>Enter Total Capacity:</label>
                            <input type="number" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} required style={inputStyle} />
                            <button type="submit" style={saveBtn}>Update Capacity</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const patientListContainer = { backgroundColor: '#fff', borderRadius: '12px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #edf2f7', maxHeight: '250px', overflowY: 'auto' };
const patientItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f7fafc' };
const bedLabel = { color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' };
const editBtn = { marginTop: '20px', backgroundColor: 'transparent', border: '1px solid', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '20px', outline: 'none' };
const saveBtn = { width: '100%', padding: '10px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', alignItems: 'start' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '15px', padding: '25px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const iconCircle = { width: '60px', height: '60px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' };
const statContainer = { display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '10px 0', borderTop: '1px solid #edf2f7' };
const statItem = { display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: 'bold' };
const valueStyle = { fontSize: '18px', fontWeight: '700', color: '#2d3748' };
const progressBarContainer = { width: '100%', height: '8px', backgroundColor: '#edf2f7', borderRadius: '4px', marginTop: '15px', overflow: 'hidden' };
const progressBarFill = { height: '100%', transition: 'width 0.5s ease-in-out' };

export default Room;