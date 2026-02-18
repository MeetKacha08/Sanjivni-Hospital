// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaBed, FaProcedures, FaUserShield, FaHospitalAlt, FaMicroscope, FaUserCircle, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

// const Roomstatus = () => {
//     const [rooms, setRooms] = useState([]); 

//     // Icon Mapping Helper
//     const getIcon = (name) => {
//         switch(name) {
//             case "ICU": return <FaUserShield size={24} />;
//             case "Operation Theater": return <FaMicroscope size={24} />;
//             case "Private Room": return <FaProcedures size={24} />;
//             case "General Room": return <FaBed size={24} />;
//             case "General Ward": return <FaHospitalAlt size={24} />;
//             default: return <FaBed size={24} />;
//         }
//     };

//     useEffect(() => {
//         fetchRoomData();
//         // Poll for real-time updates every 5 seconds
//         const interval = setInterval(fetchRoomData, 5000); 
//         return () => clearInterval(interval);
//     }, []);

//     const fetchRoomData = () => {
//         // 🔥 Now fetching directly from 'rooms' array which holds the specific bed status
//         axios.get('http://localhost:5000/rooms')
//             .then(res => setRooms(res.data))
//             .catch(err => console.error("Error fetching room data:", err));
//     };

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//             <h2 style={{ color: '#2c3e50', marginBottom: '30px', borderBottom: '3px solid #3182ce', paddingBottom: '10px', display: 'inline-block' }}>
//                 Current Room Status & Bed Availability
//             </h2>

//             <div style={gridStyle}>
//                 {rooms.map((room) => {
//                     // Calculate stats based on the DB array length
//                     const total = room.roomList.length;
//                     const occupiedCount = room.roomList.filter(r => r.status === "Occupied").length;
//                     const available = total - occupiedCount;
//                     const occupancyRate = total > 0 ? Math.min((occupiedCount / total) * 100, 100) : 0;

//                     return (
//                         <div key={room.id} style={statusCard}>
//                             {/* HEADER SECTION */}
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
//                                 <div style={{ ...iconBox, backgroundColor: room.color }}>
//                                     {getIcon(room.name)}
//                                 </div>
//                                 <div>
//                                     <h3 style={{ margin: 0, fontSize: '18px', color: '#2d3748' }}>{room.name}</h3>
//                                     <span style={{ fontSize: '12px', color: '#718096' }}>
//                                         Capacity: <b>{total}</b>
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* STATS ROW */}
//                             <div style={statRow}>
//                                 <div style={statBox}>
//                                     <div style={statLabel}>Occupied</div>
//                                     <div style={{ ...statValue, color: '#e53e3e' }}>{occupiedCount}</div>
//                                 </div>
//                                 <div style={statBox}>
//                                     <div style={statLabel}>Available</div>
//                                     <div style={{ ...statValue, color: '#38a169' }}>{available}</div>
//                                 </div>
//                             </div>

//                             {/* PROGRESS BAR */}
//                             <div style={progressContainer}>
//                                 <div style={{ ...progressFill, width: `${occupancyRate}%`, backgroundColor: room.color }}></div>
//                             </div>
//                             <div style={{ textAlign: 'right', fontSize: '11px', color: '#718096', marginTop: '5px', marginBottom: '15px' }}>
//                                 {occupancyRate.toFixed(0)}% Occupied
//                             </div>

//                             {/* 🔥 DETAILED BED GRID (Directly from roomList in DB) */}
//                             <div style={patientListWrapper}>
//                                 <h4 style={{ fontSize: '13px', color: '#4a5568', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>
//                                     Bed Allocation Status
//                                 </h4>
                                
//                                 <div style={scrollList}>
//                                     {room.roomList.map((bed, idx) => {
//                                         return (
//                                             <div key={idx} style={patientRow}>
//                                                 {bed.status === "Occupied" ? (
//                                                     // 🔴 OCCUPIED STATE (Show Patient Name & Date)
//                                                     <>
//                                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                             <FaUserCircle color="#e53e3e" />
//                                                             <div>
//                                                                 <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', display: 'block' }}>
//                                                                     {bed.occupiedBy}
//                                                                 </span>
//                                                                 <span style={{ fontSize: '10px', color: '#e53e3e', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                                                                     <FaCalendarAlt size={8}/> {bed.admitDate || 'No Date'}
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                         <span style={{ ...bedLabel, backgroundColor: room.color, color: 'white' }}>
//                                                             {bed.id}
//                                                         </span>
//                                                     </>
//                                                 ) : (
//                                                     // 🟢 AVAILABLE STATE
//                                                     <>
//                                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                             <FaCheckCircle color="#38a169" />
//                                                             <div>
//                                                                 <span style={{ fontSize: '13px', fontWeight: '500', color: '#38a169', display: 'block' }}>
//                                                                     Available
//                                                                 </span>
//                                                                 <span style={{ fontSize: '10px', color: '#718096' }}>Ready</span>
//                                                             </div>
//                                                         </div>
//                                                         <span style={{ ...bedLabel, backgroundColor: '#edf2f7', color: '#718096', border: '1px solid #cbd5e0' }}>
//                                                             {bed.id}
//                                                         </span>
//                                                     </>
//                                                 )}
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };
// const statusCard = { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #edf2f7' };
// const iconBox = { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' };
// const statRow = { display: 'flex', justifyContent: 'space-between', backgroundColor: '#f7fafc', padding: '10px', borderRadius: '8px', marginBottom: '15px' };
// const statBox = { textAlign: 'center', flex: 1 };
// const statLabel = { fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '3px' };
// const statValue = { fontSize: '16px', fontWeight: '700', color: '#2d3748' };
// const progressContainer = { width: '100%', height: '6px', backgroundColor: '#edf2f7', borderRadius: '3px', overflow: 'hidden' };
// const progressFill = { height: '100%', transition: 'width 0.5s ease' };
// const patientListWrapper = { marginTop: '10px' };
// const scrollList = { maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' };
// const patientRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 5px', borderBottom: '1px solid #f1f5f9' };
// const bedLabel = { fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px' };

// export default Roomstatus;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaBed, 
    FaProcedures, 
    FaUserShield, 
    FaHospitalAlt, 
    FaMicroscope, 
    FaUserCircle, 
    FaCheckCircle, 
    FaCalendarAlt,
    FaExclamationCircle,
    FaPhoneAlt
} from 'react-icons/fa';

const Roomstatus = () => {
    const [rooms, setRooms] = useState([]); 
    const [loading, setLoading] = useState(true);

    // Icon Mapping Helper
    const getIcon = (name) => {
        switch(name) {
            case "ICU": return <FaUserShield size={24} />;
            case "Operation Theater": return <FaMicroscope size={24} />;
            case "Private Room": return <FaProcedures size={24} />;
            case "General Room": return <FaBed size={24} />;
            case "General Ward": return <FaHospitalAlt size={24} />;
            default: return <FaBed size={24} />;
        }
    };

    useEffect(() => {
        fetchData();
        // Poll for real-time updates every 3 seconds
        const interval = setInterval(fetchData, 3000); 
        return () => clearInterval(interval);
    }, []);

    const fetchData = () => {
        Promise.all([
            axios.get('http://localhost:5000/rooms'),
            axios.get('http://localhost:5000/admitted')
        ])
        .then(([roomsRes, patientsRes]) => {
            const rawRooms = roomsRes.data;
            const admittedPatients = patientsRes.data;

            // Merge Data: Map the admitted patients onto the room grid
            const mergedRooms = rawRooms.map(room => {
                // 1. Filter patients belonging to this Room Category (e.g., "ICU")
                const patientsInThisType = admittedPatients.filter(p => p.roomType === room.name);

                // 2. Map through the beds defined in the Room Layout
                const updatedRoomList = room.roomList.map(bed => {
                    // 🔥 CRITICAL MATCHING: Match Bed ID with allocatedRoom from JSON
                    // JSON Example: allocatedRoom: "ICU-09" === bed.id: "ICU-09"
                    const occupant = patientsInThisType.find(p => String(p.allocatedRoom) === String(bed.id));

                    if (occupant) {
                        // 🔴 Patient Found -> Force status to Occupied
                        return {
                            ...bed,
                            status: "Occupied",
                            occupiedBy: occupant.fullName,
                            admitDate: occupant.admissionTimestamp, // e.g. "28/01/2026, 19:19:05"
                            patientId: occupant.id,
                            age: occupant.age,         // From JSON
                            contact: occupant.contact  // From JSON
                        };
                    } else {
                        // 🟢 No Patient -> Reset to Available (or Maintenance if set in rooms DB)
                        // If the bed was previously occupied but patient is gone from 'admitted', clear it.
                        return {
                            ...bed,
                            status: bed.status === "Occupied" ? "Available" : bed.status, // Auto-free if not in admitted list
                            occupiedBy: null,
                            admitDate: null,
                            patientId: null,
                            age: null,
                            contact: null
                        };
                    }
                });

                return { ...room, roomList: updatedRoomList };
            });

            setRooms(mergedRooms);
            setLoading(false);
        })
        .catch(err => console.error("Error fetching data:", err));
    };

    if (loading) return <div style={{padding:'50px', textAlign:'center', color: '#666'}}>Loading Room Status...</div>;

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', borderBottom: '3px solid #3182ce', paddingBottom: '10px', display: 'inline-block' }}>
                Current Room Status & Bed Availability
            </h2>

            <div style={gridStyle}>
                {rooms.map((room) => {
                    const total = room.roomList.length;
                    
                    // Stats Calculation based on the MERGED data
                    const occupiedCount = room.roomList.filter(r => r.status === "Occupied").length;
                    const availableCount = room.roomList.filter(r => r.status === "Available").length;
                    
                    // Occupancy rate
                    const occupancyRate = total > 0 ? Math.min((occupiedCount / total) * 100, 100) : 0;

                    return (
                        <div key={room.id} style={statusCard}>
                            {/* HEADER SECTION */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ ...iconBox, backgroundColor: room.color }}>
                                    {getIcon(room.name)}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', color: '#2d3748' }}>{room.name}</h3>
                                    <span style={{ fontSize: '12px', color: '#718096' }}>
                                        Capacity: <b>{total}</b> Beds
                                    </span>
                                </div>
                            </div>

                            {/* STATS ROW */}
                            <div style={statRow}>
                                <div style={statBox}>
                                    <div style={statLabel}>Occupied</div>
                                    <div style={{ ...statValue, color: '#e53e3e' }}>{occupiedCount}</div>
                                </div>
                                <div style={statBox}>
                                    <div style={statLabel}>Available</div>
                                    <div style={{ ...statValue, color: '#38a169' }}>{availableCount}</div>
                                </div>
                            </div>

                            {/* PROGRESS BAR */}
                            <div style={progressContainer}>
                                <div style={{ ...progressFill, width: `${occupancyRate}%`, backgroundColor: room.color }}></div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '11px', color: '#718096', marginTop: '5px', marginBottom: '15px' }}>
                                {occupancyRate.toFixed(0)}% Occupied
                            </div>

                            {/* BED GRID */}
                            <div style={patientListWrapper}>
                                <h4 style={{ fontSize: '13px', color: '#4a5568', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>
                                    Bed Allocation Status
                                </h4>
                                
                                <div style={scrollList}>
                                    {room.roomList.map((bed, idx) => {
                                        return (
                                            <div key={idx} style={patientRow}>
                                                {bed.status === "Occupied" ? (
                                                    // 🔴 OCCUPIED STATE (Data from Admitted JSON)
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <FaUserCircle color="#e53e3e" size={30} />
                                                            <div style={{lineHeight: '1.3'}}>
                                                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#2d3748', display: 'block' }}>
                                                                    {bed.occupiedBy || "Unknown"}
                                                                </span>
                                                                
                                                                {/* Age & Contact from JSON */}
                                                                <span style={{ fontSize: '11px', color: '#718096', display: 'block' }}>
                                                                    {bed.age ? `${bed.age} Yrs` : ''} 
                                                                    {bed.contact ? ` • Ph: ${bed.contact}` : ''}
                                                                </span>

                                                                {/* Admit Timestamp */}
                                                                <span style={{ fontSize: '10px', color: '#e53e3e', display: 'flex', alignItems: 'center', gap: '4px', marginTop:'2px' }}>
                                                                    <FaCalendarAlt size={9}/> 
                                                                    {bed.admitDate ? bed.admitDate.split(',')[0] : 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span style={{ ...bedLabel, backgroundColor: room.color, color: 'white' }}>
                                                            {bed.id}
                                                        </span>
                                                    </>
                                                ) : bed.status === "Available" ? (
                                                    // 🟢 AVAILABLE STATE
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <FaCheckCircle color="#38a169" size={18} />
                                                            <div>
                                                                <span style={{ fontSize: '13px', fontWeight: '500', color: '#38a169', display: 'block' }}>
                                                                    Available
                                                                </span>
                                                                <span style={{ fontSize: '10px', color: '#718096' }}>Ready</span>
                                                            </div>
                                                        </div>
                                                        <span style={{ ...bedLabel, backgroundColor: '#edf2f7', color: '#718096', border: '1px solid #cbd5e0' }}>
                                                            {bed.id}
                                                        </span>
                                                    </>
                                                ) : (
                                                    // ⚪ OTHER STATE (Maintenance / Cleaning)
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <FaExclamationCircle color="#e67e22" size={18} />
                                                            <div>
                                                                <span style={{ fontSize: '13px', fontWeight: '500', color: '#e67e22', display: 'block' }}>
                                                                    {bed.status}
                                                                </span>
                                                                <span style={{ fontSize: '10px', color: '#718096' }}>Blocked</span>
                                                            </div>
                                                        </div>
                                                        <span style={{ ...bedLabel, backgroundColor: '#fff3cd', color: '#e67e22', border: '1px solid #ffeeba' }}>
                                                            {bed.id}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- STYLES ---
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };
const statusCard = { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #edf2f7' };
const iconBox = { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' };
const statRow = { display: 'flex', justifyContent: 'space-between', backgroundColor: '#f7fafc', padding: '10px', borderRadius: '8px', marginBottom: '15px' };
const statBox = { textAlign: 'center', flex: 1 };
const statLabel = { fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '3px' };
const statValue = { fontSize: '16px', fontWeight: '700', color: '#2d3748' };
const progressContainer = { width: '100%', height: '6px', backgroundColor: '#edf2f7', borderRadius: '3px', overflow: 'hidden' };
const progressFill = { height: '100%', transition: 'width 0.5s ease' };
const patientListWrapper = { marginTop: '10px' };
const scrollList = { maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' };
const patientRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 5px', borderBottom: '1px solid #f1f5f9' };
const bedLabel = { fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px' };

export default Roomstatus;