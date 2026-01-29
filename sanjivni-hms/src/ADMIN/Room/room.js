// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaBed, FaProcedures, FaUserShield, FaHospitalAlt, FaMicroscope, FaUserCircle, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

// const Room = () => {
//     const [rooms, setRooms] = useState([]); 

//     // Icon Mapping Helper
//     const getIcon = (name) => {
//         switch(name) {
//             case "ICU": return <FaUserShield size={30} />;
//             case "Operation Theater": return <FaMicroscope size={30} />;
//             case "Private Room": return <FaProcedures size={30} />;
//             case "General Room": return <FaBed size={30} />;
//             case "General Ward": return <FaHospitalAlt size={30} />;
//             default: return <FaBed size={30} />;
//         }
//     };

//     useEffect(() => {
//         fetchData();
//         const interval = setInterval(fetchData, 5000); // Poll for real-time updates
//         return () => clearInterval(interval);
//     }, []);

//     const fetchData = async () => {
//         try {
//             const roomsRes = await axios.get('http://localhost:5000/rooms');
//             setRooms(roomsRes.data);
//         } catch (err) {
//             console.error("Error fetching room data:", err);
//         }
//     };

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <h2 style={{ color: '#2c3e50', marginBottom: '30px', borderBottom: '2px solid #3182ce', paddingBottom: '10px' }}>
//                 Hospital Room Availability & Patient Allocation
//             </h2>

//             <div style={gridStyle}>
//                 {rooms.map((room) => {
//                     const total = room.roomList.length;
//                     const occupiedCount = room.roomList.filter(r => r.status === "Occupied").length;
//                     const available = total - occupiedCount;

//                     return (
//                         <div key={room.id} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//                             {/* CARD HEADER */}
//                             <div style={cardStyle}>
//                                 <div style={{ ...iconCircle, backgroundColor: room.color }}>
//                                     {getIcon(room.name)}
//                                 </div>
//                                 <h3 style={{ margin: '15px 0 5px 0', color: '#2d3748' }}>{room.name}</h3>
//                                 <p style={{ fontSize: '12px', color: '#718096', margin: '0 0 15px 0' }}>
//                                     {room.prefix} Series
//                                 </p>
                                
//                                 <div style={statContainer}>
//                                     <div style={statItem}><span style={labelStyle}>Total</span><span style={valueStyle}>{total}</span></div>
//                                     <div style={statItem}><span style={labelStyle}>Occupied</span><span style={{ ...valueStyle, color: '#e53e3e' }}>{occupiedCount}</span></div>
//                                     <div style={statItem}><span style={labelStyle}>Available</span><span style={{ ...valueStyle, color: '#38a169' }}>{available}</span></div>
//                                 </div>

//                                 <div style={progressBarContainer}>
//                                     <div style={{ ...progressBarFill, width: `${Math.min((occupiedCount / total) * 100, 100)}%`, backgroundColor: room.color }}></div>
//                                 </div>
//                             </div>

//                             {/* 🔥 DETAILED BED STATUS LIST */}
//                             <div style={patientListContainer}>
//                                 <h4 style={{ fontSize: '14px', marginBottom: '10px', color: room.color, borderBottom: `1px solid ${room.color}`, paddingBottom: '5px' }}>
//                                     Bed Allocation Status
//                                 </h4>
                                
//                                 {room.roomList.map((bed, idx) => (
//                                     <div key={idx} style={patientItemStyle}>
//                                         {bed.status === "Occupied" ? (
//                                             // 🔴 OCCUPIED SLOT
//                                             <>
//                                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                     <FaUserCircle color="#e53e3e" size={18} />
//                                                     <div>
//                                                         <span style={{ fontWeight: '600', fontSize: '13px', display: 'block', color: '#2d3748' }}>
//                                                             {bed.occupiedBy}
//                                                         </span>
//                                                         <span style={{ fontSize: '10px', color: '#e53e3e', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                                                             <FaCalendarAlt size={8}/> {bed.admitDate}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                                 <span style={{ ...bedLabel, backgroundColor: room.color, color: 'white' }}>
//                                                     {bed.id}
//                                                 </span>
//                                             </>
//                                         ) : (
//                                             // 🟢 AVAILABLE SLOT
//                                             <>
//                                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                     <FaCheckCircle color="#38a169" size={16} />
//                                                     <div>
//                                                         <span style={{ fontWeight: '500', fontSize: '13px', color: '#38a169', display: 'block' }}>Available</span>
//                                                         <span style={{ fontSize: '10px', color: '#718096' }}>Ready</span>
//                                                     </div>
//                                                 </div>
//                                                 <span style={{ ...bedLabel, backgroundColor: '#edf2f7', color: '#718096', border: '1px solid #cbd5e0' }}>
//                                                     {bed.id}
//                                                 </span>
//                                             </>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const patientListContainer = { backgroundColor: '#fff', borderRadius: '12px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #edf2f7', maxHeight: '300px', overflowY: 'auto' };
// const patientItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5px', borderBottom: '1px solid #f7fafc' };
// const bedLabel = { fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px' };
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
import { FaBed, FaProcedures, FaUserShield, FaHospitalAlt, FaEdit, FaTimes, FaUserCircle, FaCheckCircle, FaCalendarAlt, FaSignOutAlt, FaMicroscope } from 'react-icons/fa';

const Room = () => {
    const [rooms, setRooms] = useState([]); 
    
    // Edit Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [selectedRoomName, setSelectedRoomName] = useState("");
    const [newCapacity, setNewCapacity] = useState("");

    // Icon Mapping Helper
    const getIcon = (name) => {
        switch(name) {
            case "ICU": return <FaUserShield size={30} />;
            case "Operation Theater": return <FaMicroscope size={30} />;
            case "Private Room": return <FaProcedures size={30} />;
            case "General Room": return <FaBed size={30} />;
            case "General Ward": return <FaHospitalAlt size={30} />;
            default: return <FaBed size={30} />;
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); 
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const roomsRes = await axios.get('http://localhost:5000/rooms');
            setRooms(roomsRes.data);
        } catch (err) {
            console.error("Error fetching room data:", err);
        }
    };

    // --- DISCHARGE LOGIC ---
    const handleDischarge = async (roomCategory, bedId, patientName) => {
        if (!window.confirm(`Are you sure you want to discharge ${patientName} from ${bedId}?`)) {
            return;
        }

        try {
            // 1. Create the updated list for this specific room category
            const updatedRoomList = roomCategory.roomList.map(bed => {
                if (bed.id === bedId) {
                    return {
                        ...bed,
                        status: "Available",
                        occupiedBy: "none",
                        admitDate: null
                    };
                }
                return bed;
            });

            // 2. Patch the 'rooms' endpoint with the new list
            await axios.patch(`http://localhost:5000/rooms/${roomCategory.id}`, {
                roomList: updatedRoomList
            });

            // 3. Find and remove from 'admitted' list (Optional based on your workflow, but good for consistency)
            const admittedRes = await axios.get(`http://localhost:5000/admitted?allocatedRoom=${bedId}`);
            if (admittedRes.data.length > 0) {
                const patientId = admittedRes.data[0].id;
                // Move to history or just delete. Here we delete from 'admitted'
                await axios.delete(`http://localhost:5000/admitted/${patientId}`);
            }

            alert(`Patient ${patientName} discharged successfully.`);
            fetchData(); // Refresh UI

        } catch (error) {
            console.error("Error discharging patient:", error);
            alert("Failed to discharge patient.");
        }
    };

    // --- EDIT CAPACITY LOGIC ---
    const handleEditClick = (room) => {
        setSelectedRoomId(room.id);
        setSelectedRoomName(room.name);
        setNewCapacity(room.capacity);
        setShowEditModal(true);
    };

    const saveCapacity = async (e) => {
        e.preventDefault();
        
        const currentRoomData = rooms.find(r => r.id === selectedRoomId);
        let updatedRoomList = [...currentRoomData.roomList];
        const newCap = parseInt(newCapacity);
        const currentCap = currentRoomData.capacity;

        if (newCap > currentCap) {
            for (let i = currentCap + 1; i <= newCap; i++) {
                updatedRoomList.push({
                    id: `${currentRoomData.prefix}-${i.toString().padStart(2, '0')}`,
                    status: "Available",
                    occupiedBy: "none",
                    admitDate: null
                });
            }
        } else if (newCap < currentCap) {
            // Only slice if reducing (Note: Does not check if occupied for simplicity)
            updatedRoomList = updatedRoomList.slice(0, newCap);
        }

        try {
            await axios.patch(`http://localhost:5000/rooms/${selectedRoomId}`, {
                capacity: newCap,
                roomList: updatedRoomList
            });
            
            alert("Capacity updated successfully!");
            setShowEditModal(false);
            fetchData(); 
        } catch (err) {
            console.error("Error updating capacity:", err);
            alert("Failed to update capacity.");
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', borderBottom: '2px solid #3182ce', paddingBottom: '10px' }}>
                Hospital Room Availability & Patient Allocation
            </h2>

            <div style={gridStyle}>
                {rooms.map((room) => {
                    const total = room.roomList.length;
                    const occupiedCount = room.roomList.filter(r => r.status === "Occupied").length;
                    const available = total - occupiedCount;
                    const occupancyRate = total > 0 ? Math.min((occupiedCount / total) * 100, 100) : 0;

                    return (
                        <div key={room.id} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {/* CARD HEADER */}
                            <div style={cardStyle}>
                                <div style={{ ...iconCircle, backgroundColor: room.color }}>
                                    {getIcon(room.name)}
                                </div>
                                <h3 style={{ margin: '15px 0 5px 0', color: '#2d3748' }}>{room.name}</h3>
                                <p style={{ fontSize: '12px', color: '#718096', margin: '0 0 15px 0' }}>
                                    {room.prefix} Series
                                </p>
                                
                                <div style={statContainer}>
                                    <div style={statItem}><span style={labelStyle}>Total</span><span style={valueStyle}>{total}</span></div>
                                    <div style={statItem}><span style={labelStyle}>Occupied</span><span style={{ ...valueStyle, color: '#e53e3e' }}>{occupiedCount}</span></div>
                                    <div style={statItem}><span style={labelStyle}>Available</span><span style={{ ...valueStyle, color: '#38a169' }}>{available}</span></div>
                                </div>

                                <div style={progressBarContainer}>
                                    <div style={{ ...progressBarFill, width: `${occupancyRate}%`, backgroundColor: room.color }}></div>
                                </div>

                                <button onClick={() => handleEditClick(room)} style={{...editBtn, color: room.color, borderColor: room.color}}>
                                    <FaEdit style={{marginRight: '5px'}}/> Edit Capacity
                                </button>
                            </div>

                            {/* 🔥 DETAILED BED STATUS LIST */}
                            <div style={patientListContainer}>
                                <h4 style={{ fontSize: '14px', marginBottom: '10px', color: room.color, borderBottom: `1px solid ${room.color}`, paddingBottom: '5px' }}>
                                    Bed Allocation Status
                                </h4>
                                
                                {room.roomList.map((bed, idx) => (
                                    <div key={idx} style={patientItemStyle}>
                                        {bed.status === "Occupied" ? (
                                            // 🔴 OCCUPIED SLOT
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FaUserCircle color="#e53e3e" size={24} />
                                                    <div>
                                                        <span style={{ fontWeight: '600', fontSize: '13px', display: 'block', color: '#2d3748' }}>
                                                            {bed.occupiedBy}
                                                        </span>
                                                        <span style={{ fontSize: '10px', color: '#718096', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <FaCalendarAlt size={10}/> {bed.admitDate || 'No Date'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ ...bedLabel, backgroundColor: room.color, color: 'white' }}>
                                                        {bed.id}
                                                    </span>
                                                    
                                                    {/* DISCHARGE BUTTON */}
                                                    <button 
                                                        onClick={() => handleDischarge(room, bed.id, bed.occupiedBy)}
                                                        style={dischargeIconBtn}
                                                        title="Discharge Patient"
                                                    >
                                                        <FaSignOutAlt />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            // 🟢 AVAILABLE SLOT
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FaCheckCircle color="#38a169" size={20} />
                                                    <div>
                                                        <span style={{ fontWeight: '500', fontSize: '13px', color: '#38a169', display: 'block' }}>Available</span>
                                                        <span style={{ fontSize: '10px', color: '#718096' }}>Ready</span>
                                                    </div>
                                                </div>
                                                <span style={{ ...bedLabel, backgroundColor: '#edf2f7', color: '#718096', border: '1px solid #cbd5e0' }}>
                                                    {bed.id}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* EDIT CAPACITY MODAL */}
            {showEditModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Update {selectedRoomName}</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowEditModal(false)} />
                        </div>
                        <form onSubmit={saveCapacity}>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px' }}>Enter Total Capacity:</label>
                            <input type="number" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} required style={inputStyle} />
                            <button type="submit" style={saveBtn}>Update & Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const patientListContainer = { backgroundColor: '#fff', borderRadius: '12px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #edf2f7', maxHeight: '300px', overflowY: 'auto' };
const patientItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5px', borderBottom: '1px solid #f7fafc' };
const bedLabel = { fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px' };
const dischargeIconBtn = { backgroundColor: '#fed7d7', color: '#c53030', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s', fontSize: '12px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', alignItems: 'start' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '15px', padding: '25px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const iconCircle = { width: '60px', height: '60px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' };
const statContainer = { display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '10px 0', borderTop: '1px solid #edf2f7' };
const statItem = { display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: 'bold' };
const valueStyle = { fontSize: '18px', fontWeight: '700', color: '#2d3748' };
const progressBarContainer = { width: '100%', height: '8px', backgroundColor: '#edf2f7', borderRadius: '4px', marginTop: '15px', overflow: 'hidden' };
const progressBarFill = { height: '100%', transition: 'width 0.5s ease-in-out' };
const editBtn = { marginTop: '20px', backgroundColor: 'transparent', border: '1px solid', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '20px', outline: 'none' };
const saveBtn = { width: '100%', padding: '10px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };

export default Room;