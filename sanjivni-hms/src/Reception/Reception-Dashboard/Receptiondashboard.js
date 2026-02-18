// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//     FaCalendarCheck, 
//     FaUserClock, 
//     FaUserInjured, 
//     FaUsers, 
//     FaDoorOpen, 
//     FaProcedures,
//     FaChartPie
// } from 'react-icons/fa';

// const Receptiondashboard = () => {
//     // --- STATE MANAGEMENT ---
//     const [stats, setStats] = useState({
//         pendingAppointments: 0,
//         ourPatients: 0,
//         pendingAdmitRequests: 0,
//         totalAdmitted: 0
//     });

//     const [roomData, setRoomData] = useState([]);

//     useEffect(() => {
//         fetchAllData();
        
//         // Auto-refresh every 5 seconds to keep dashboard live
//         const interval = setInterval(fetchAllData, 5000);
//         return () => clearInterval(interval);
//     }, []);

//     const fetchAllData = async () => {
//         try {
//             // Execute all API calls in parallel for better performance
//             const [appointmentsRes, patientsRes, admitReqRes, admittedRes, roomsRes] = await Promise.all([
//                 axios.get('http://localhost:5000/appointments').catch(() => ({ data: [] })), 
//                 axios.get('http://localhost:5000/patients').catch(() => ({ data: [] })),
//                 axios.get('http://localhost:5000/admitRequests').catch(() => ({ data: [] })),
//                 axios.get('http://localhost:5000/admitted').catch(() => ({ data: [] })),
//                 axios.get('http://localhost:5000/rooms').catch(() => ({ data: [] })) // Fetch dynamic rooms
//             ]);

//             // 1. Calculate General Stats
//             setStats({
//                 pendingAppointments: appointmentsRes.data.length, // All online requests
//                 ourPatients: patientsRes.data.length,             // All registered patients
//                 pendingAdmitRequests: admitReqRes.data.length,    // Requests from doctors
//                 totalAdmitted: admittedRes.data.length            // Currently occupying beds
//             });

//             // 2. Calculate Room Occupancy Dynamically
//             const dbRooms = roomsRes.data;
//             const admittedPatients = admittedRes.data;

//             const calculatedRoomStatus = dbRooms.map(room => {
//                 // Capacity is determined by the length of the roomList array in the DB
//                 const capacity = room.roomList ? room.roomList.length : room.capacity;
                
//                 // Count how many admitted patients are assigned to this specific room category
//                 const occupied = admittedPatients.filter(p => p.roomType === room.name).length;
                
//                 const available = capacity - occupied;
//                 const percentage = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;

//                 return {
//                     type: room.name,
//                     capacity: capacity,
//                     occupied: occupied,
//                     available: available,
//                     percentage: percentage,
//                     color: getProgressColor(percentage)
//                 };
//             });

//             setRoomData(calculatedRoomStatus);

//         } catch (error) {
//             console.error("Error fetching dashboard data:", error);
//         }
//     };

//     const getProgressColor = (pct) => {
//         if (pct > 80) return '#e53e3e'; // Red (High occupancy)
//         if (pct > 50) return '#dd6b20'; // Orange (Medium)
//         return '#38a169'; // Green (Low)
//     };

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <h2 style={{ color: '#2c3e50', marginBottom: '25px', borderBottom: '3px solid #3498db', paddingBottom: '10px', display: 'inline-block' }}>
//                 <FaChartPie style={{ marginRight: '10px' }} /> Reception Dashboard
//             </h2>

//             {/* --- TOP STATS CARDS --- */}
//             <div style={gridStyle}>
                
//                 {/* 1. Pending Online Patients */}
//                 <div style={{ ...cardStyle, borderLeft: '5px solid #f1c40f' }}>
//                     <div style={iconCircle('#fff3cd', '#d35400')}><FaCalendarCheck /></div>
//                     <div style={statText}>
//                         <h3>{stats.pendingAppointments}</h3>
//                         <p>Pending Online Patients</p>
//                     </div>
//                 </div>

//                 {/* 2. Our Patients (Total Registered) */}
//                 <div style={{ ...cardStyle, borderLeft: '5px solid #3498db' }}>
//                     <div style={iconCircle('#ebf8ff', '#2980b9')}><FaUsers /></div>
//                     <div style={statText}>
//                         <h3>{stats.ourPatients}</h3>
//                         <p>Our Patients</p>
//                     </div>
//                 </div>

//                 {/* 3. Admit Requests */}
//                 <div style={{ ...cardStyle, borderLeft: '5px solid #e67e22' }}>
//                     <div style={iconCircle('#ffe8cc', '#d35400')}><FaUserClock /></div>
//                     <div style={statText}>
//                         <h3>{stats.pendingAdmitRequests}</h3>
//                         <p>Admit Requests</p>
//                     </div>
//                 </div>

//                 {/* 4. Admitted Patients */}
//                 <div style={{ ...cardStyle, borderLeft: '5px solid #27ae60' }}>
//                     <div style={iconCircle('#d4edda', '#155724')}><FaUserInjured /></div>
//                     <div style={statText}>
//                         <h3>{stats.totalAdmitted}</h3>
//                         <p>Admitted Patients</p>
//                     </div>
//                 </div>
//             </div>

//             {/* --- ROOM STATUS SECTION (Category Wise) --- */}
//             <h3 style={{ marginTop: '40px', color: '#34495e', display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <FaProcedures /> Live Room Status (Category Wise)
//             </h3>
            
//             <div style={tableContainer}>
//                 <table style={tableStyle}>
//                     <thead>
//                         <tr style={headerRow}>
//                             <th style={thStyle}>Room Category</th>
//                             <th style={thStyle}>Total Capacity</th>
//                             <th style={thStyle}>Occupied</th>
//                             <th style={thStyle}>Available</th>
//                             <th style={thStyle}>Occupancy Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {roomData.map((room, index) => (
//                             <tr key={index} style={rowStyle}>
//                                 <td style={{...tdStyle, fontWeight: 'bold', color: '#2c3e50'}}>
//                                     {room.type}
//                                 </td>
//                                 <td style={tdStyle}><span style={badgeStyle('#edf2f7', '#4a5568')}>{room.capacity}</span></td>
//                                 <td style={tdStyle}><span style={badgeStyle('#fed7d7', '#c53030')}>{room.occupied}</span></td>
//                                 <td style={tdStyle}>
//                                     <span style={badgeStyle('#c6f6d5', '#2f855a', true)}>
//                                         {room.available} <FaDoorOpen style={{ marginLeft: '5px' }} />
//                                     </span>
//                                 </td>
//                                 <td style={tdStyle}>
//                                     <div style={progressWrapper}>
//                                         <div style={{...progressBar, width: `${room.percentage}%`, backgroundColor: room.color}}></div>
//                                     </div>
//                                     <small style={{ color: room.color, fontWeight: 'bold' }}>{room.percentage}% Full</small>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' };
// const cardStyle = { backgroundColor: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' };
// const statText = { display: 'flex', flexDirection: 'column' };
// const iconCircle = (bg, color) => ({ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' });

// const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', marginTop: '15px' };
// const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
// const headerRow = { backgroundColor: '#f8f9fa', borderBottom: '2px solid #e2e8f0' };
// const thStyle = { padding: '15px 20px', fontSize: '13px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' };
// const rowStyle = { borderBottom: '1px solid #edf2f7' };
// const tdStyle = { padding: '15px 20px', fontSize: '14px' };

// const badgeStyle = (bg, color, isBold = false) => ({
//     backgroundColor: bg, color: color, padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: isBold ? 'bold' : 'normal', display: 'inline-flex', alignItems: 'center'
// });

// const progressWrapper = { width: '100%', backgroundColor: '#edf2f7', borderRadius: '5px', height: '8px', marginBottom: '5px', overflow: 'hidden' };
// const progressBar = { height: '100%', transition: 'width 0.5s ease-in-out' };

// export default Receptiondashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaCalendarCheck, 
    FaUserClock, 
    FaUserInjured, 
    FaUsers, 
    FaDoorOpen, 
    FaProcedures,
    FaChartPie
} from 'react-icons/fa';

const Receptiondashboard = () => {
    // --- STATE MANAGEMENT ---
    const [stats, setStats] = useState({
        pendingAppointments: 0,
        ourPatients: 0,
        pendingAdmitRequests: 0,
        totalAdmitted: 0
    });

    const [roomData, setRoomData] = useState([]);

    useEffect(() => {
        fetchAllData();
        
        // Auto-refresh every 5 seconds to keep dashboard live
        const interval = setInterval(fetchAllData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            // Execute all API calls in parallel for better performance
            const [appointmentsRes, patientsRes, admitReqRes, admittedRes, roomsRes] = await Promise.all([
                axios.get('http://localhost:5000/appointments').catch(() => ({ data: [] })), 
                axios.get('http://localhost:5000/patients').catch(() => ({ data: [] })),
                axios.get('http://localhost:5000/admitRequests').catch(() => ({ data: [] })),
                axios.get('http://localhost:5000/admitted').catch(() => ({ data: [] })),
                axios.get('http://localhost:5000/rooms').catch(() => ({ data: [] })) // Fetch dynamic rooms
            ]);

            // 1. Calculate General Stats
            setStats({
                pendingAppointments: appointmentsRes.data.length, // All online requests
                ourPatients: patientsRes.data.length,             // All registered patients
                pendingAdmitRequests: admitReqRes.data.length,    // Requests from doctors
                totalAdmitted: admittedRes.data.length            // Currently occupying beds
            });

            // 2. Calculate Room Occupancy Dynamically
            const dbRooms = roomsRes.data;
            const admittedPatients = admittedRes.data;

            const calculatedRoomStatus = dbRooms.map(room => {
                // Capacity is determined by the length of the roomList array in the DB
                const capacity = room.roomList ? room.roomList.length : room.capacity;
                
                // Count how many admitted patients are assigned to this specific room category
                const occupied = admittedPatients.filter(p => p.roomType === room.name).length;
                
                const available = capacity - occupied;
                const percentage = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;

                return {
                    type: room.name,
                    capacity: capacity,
                    occupied: occupied,
                    available: available,
                    percentage: percentage,
                    color: getProgressColor(percentage)
                };
            });

            setRoomData(calculatedRoomStatus);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const getProgressColor = (pct) => {
        if (pct > 80) return '#e53e3e'; // Red (High occupancy)
        if (pct > 50) return '#dd6b20'; // Orange (Medium)
        return '#38a169'; // Green (Low)
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', borderBottom: '3px solid #3498db', paddingBottom: '10px', display: 'inline-block' }}>
                <FaChartPie style={{ marginRight: '10px' }} /> Reception Dashboard
            </h2>

            {/* --- TOP STATS CARDS --- */}
            <div style={gridStyle}>
                
                {/* 1. Pending Online Patients */}
                <div style={{ ...cardStyle, borderLeft: '6px solid #f1c40f' }}>
                    <div style={iconCircle('#fff3cd', '#d35400')}><FaCalendarCheck /></div>
                    <div style={statText}>
                        <h3 style={statNumberStyle}>{stats.pendingAppointments}</h3>
                        <p style={statLabelStyle}>Pending Online Patients</p>
                    </div>
                </div>

                {/* 2. Our Patients (Total Registered) */}
                <div style={{ ...cardStyle, borderLeft: '6px solid #3498db' }}>
                    <div style={iconCircle('#ebf8ff', '#2980b9')}><FaUsers /></div>
                    <div style={statText}>
                        <h3 style={statNumberStyle}>{stats.ourPatients}</h3>
                        <p style={statLabelStyle}>Our Patients</p>
                    </div>
                </div>

                {/* 3. Admit Requests */}
                <div style={{ ...cardStyle, borderLeft: '6px solid #e67e22' }}>
                    <div style={iconCircle('#ffe8cc', '#d35400')}><FaUserClock /></div>
                    <div style={statText}>
                        <h3 style={statNumberStyle}>{stats.pendingAdmitRequests}</h3>
                        <p style={statLabelStyle}>Admit Requests</p>
                    </div>
                </div>

                {/* 4. Admitted Patients */}
                <div style={{ ...cardStyle, borderLeft: '6px solid #27ae60' }}>
                    <div style={iconCircle('#d4edda', '#155724')}><FaUserInjured /></div>
                    <div style={statText}>
                        <h3 style={statNumberStyle}>{stats.totalAdmitted}</h3>
                        <p style={statLabelStyle}>Admitted Patients</p>
                    </div>
                </div>
            </div>

            {/* --- ROOM STATUS SECTION (Category Wise) --- */}
            <h3 style={{ marginTop: '50px', color: '#34495e', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <FaProcedures /> Live Room Status (Category Wise)
            </h3>
            
            <div style={tableContainer}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRow}>
                            <th style={thStyle}>Room Category</th>
                            <th style={thStyle}>Total Capacity</th>
                            <th style={thStyle}>Occupied</th>
                            <th style={thStyle}>Available</th>
                            <th style={thStyle}>Occupancy Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomData.map((room, index) => (
                            <tr key={index} style={rowStyle}>
                                <td style={{...tdStyle, fontWeight: 'bold', color: '#2c3e50', fontSize: '16px'}}>
                                    {room.type}
                                </td>
                                <td style={tdStyle}>
                                    <span style={badgeStyle('#edf2f7', '#4a5568')}>{room.capacity}</span>
                                </td>
                                <td style={tdStyle}>
                                    <span style={badgeStyle('#fed7d7', '#c53030')}>{room.occupied}</span>
                                </td>
                                <td style={tdStyle}>
                                    <span style={badgeStyle('#c6f6d5', '#2f855a')}>
                                        {room.available} <FaDoorOpen style={{ marginLeft: '8px' }} />
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={progressWrapper}>
                                        <div style={{...progressBar, width: `${room.percentage}%`, backgroundColor: room.color}}></div>
                                    </div>
                                    <small style={{ color: room.color, fontWeight: 'bold', fontSize: '13px' }}>{room.percentage}% Full</small>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- STYLES ---

// Top Cards Grid
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '12px', padding: '25px 20px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '20px' };

// Larger Icons & Text for Cards
const iconCircle = (bg, color) => ({ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' });
const statText = { display: 'flex', flexDirection: 'column' };
const statNumberStyle = { margin: 0, fontSize: '42px', color: '#2c3e50', lineHeight: '1' }; // HUGE NUMBER
const statLabelStyle = { margin: '8px 0 0 0', color: '#7f8c8d', fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' };

// Table Styles
const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const headerRow = { backgroundColor: '#f8f9fa', borderBottom: '2px solid #e2e8f0' };
const thStyle = { padding: '18px 20px', fontSize: '14px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' };
const rowStyle = { borderBottom: '1px solid #edf2f7' };
const tdStyle = { padding: '20px 20px', verticalAlign: 'middle' }; // More padding for taller rows

// 🔥 MUCH LARGER BADGES FOR TABLE NUMBERS 🔥
const badgeStyle = (bg, color) => ({
    backgroundColor: bg, 
    color: color, 
    padding: '8px 20px', // Bigger padding
    borderRadius: '25px', // More rounded
    fontSize: '20px', // Much larger text
    fontWeight: 'bold', // Force bold
    display: 'inline-flex', 
    alignItems: 'center',
    minWidth: '35px',
    justifyContent: 'center'
});

const progressWrapper = { width: '100%', backgroundColor: '#edf2f7', borderRadius: '5px', height: '10px', marginBottom: '8px', overflow: 'hidden' };
const progressBar = { height: '100%', transition: 'width 0.5s ease-in-out' };

export default Receptiondashboard;