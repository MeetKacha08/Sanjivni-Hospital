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
        oldPatients: 0,
        pendingAdmitRequests: 0,
        totalAdmitted: 0
    });

    const [roomData, setRoomData] = useState([]);

    // Hardcoded Capacities (Matches your Roomstatus.js)
    const TOTAL_CAPACITY = {
        "ICU": 10,
        "Private Room": 15,
        "General Room": 30,
        "General Ward": 50
    };

    useEffect(() => {
        fetchAllData();
        
        // Auto-refresh every 10 seconds to keep dashboard live
        const interval = setInterval(fetchAllData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            // Execute all API calls in parallel for performance
            const [appointmentsRes, patientsRes, admitReqRes, admittedRes] = await Promise.all([
                axios.get('http://localhost:5000/appointments').catch(() => ({ data: [] })), 
                axios.get('http://localhost:5000/patients').catch(() => ({ data: [] })),
                axios.get('http://localhost:5000/admitRequests').catch(() => ({ data: [] })),
                axios.get('http://localhost:5000/admitted').catch(() => ({ data: [] }))
            ]);

            // 1. Calculate General Stats
            // Filter for 'Pending' status which represents Online Appointments waiting for approval
            const pendingAppts = appointmentsRes.data.filter(a => a.status === 'Pending').length;
            
            const totalPatients = patientsRes.data.length; 
            const pendingRequests = admitReqRes.data.length; 
            const currentlyAdmitted = admittedRes.data.length;

            setStats({
                pendingAppointments: pendingAppts,
                oldPatients: totalPatients,
                pendingAdmitRequests: pendingRequests,
                totalAdmitted: currentlyAdmitted
            });

            // 2. Calculate Room Occupancy
            calculateRoomStatus(admittedRes.data);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const calculateRoomStatus = (admittedList) => {
        const status = Object.keys(TOTAL_CAPACITY).map(type => {
            const capacity = TOTAL_CAPACITY[type];
            const occupied = admittedList.filter(p => p.roomType === type).length;
            const available = capacity - occupied;
            const percentage = Math.round((occupied / capacity) * 100);

            return {
                type,
                capacity,
                occupied,
                available,
                percentage,
                color: getProgressColor(percentage)
            };
        });
        setRoomData(status);
    };

    const getProgressColor = (pct) => {
        if (pct > 80) return '#e53e3e'; // Red (High occupancy)
        if (pct > 50) return '#dd6b20'; // Orange (Medium)
        return '#38a169'; // Green (Low)
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '25px', borderBottom: '3px solid #3498db', paddingBottom: '10px', display: 'inline-block' }}>
                <FaChartPie style={{ marginRight: '10px' }} /> Reception Dashboard
            </h2>

            {/* --- TOP STATS CARDS --- */}
            <div style={gridStyle}>
                {/* 1. Pending Online Appointments */}
                <div style={{ ...cardStyle, borderLeft: '5px solid #f1c40f' }}>
                    <div style={iconCircle('#fff3cd', '#d35400')}><FaCalendarCheck /></div>
                    <div style={statText}>
                        <h3>{stats.pendingAppointments}</h3>
                        <p>Pending Online Appointments</p>
                    </div>
                </div>

                {/* 2. Old Patients (Total Registered) */}
                <div style={{ ...cardStyle, borderLeft: '5px solid #3498db' }}>
                    <div style={iconCircle('#ebf8ff', '#2980b9')}><FaUsers /></div>
                    <div style={statText}>
                        <h3>{stats.oldPatients}</h3>
                        <p>Total Registered Patients</p>
                    </div>
                </div>

                {/* 3. Pending Admit Requests */}
                <div style={{ ...cardStyle, borderLeft: '5px solid #e67e22' }}>
                    <div style={iconCircle('#ffe8cc', '#d35400')}><FaUserClock /></div>
                    <div style={statText}>
                        <h3>{stats.pendingAdmitRequests}</h3>
                        <p>Pending Admit Requests</p>
                    </div>
                </div>

                {/* 4. Currently Admitted */}
                <div style={{ ...cardStyle, borderLeft: '5px solid #27ae60' }}>
                    <div style={iconCircle('#d4edda', '#155724')}><FaUserInjured /></div>
                    <div style={statText}>
                        <h3>{stats.totalAdmitted}</h3>
                        <p>Currently Admitted</p>
                    </div>
                </div>
            </div>

            {/* --- ROOM STATUS SECTION --- */}
            <h3 style={{ marginTop: '40px', color: '#34495e', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaProcedures /> Live Room Status 
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
                                <td style={{...tdStyle, fontWeight: 'bold', color: '#2c3e50'}}>
                                    {room.type}
                                </td>
                                <td style={tdStyle}><span style={badgeStyle('#edf2f7', '#4a5568')}>{room.capacity}</span></td>
                                <td style={tdStyle}><span style={badgeStyle('#fed7d7', '#c53030')}>{room.occupied}</span></td>
                                <td style={tdStyle}>
                                    <span style={badgeStyle('#c6f6d5', '#2f855a', true)}>
                                        {room.available} <FaDoorOpen style={{ marginLeft: '5px' }} />
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={progressWrapper}>
                                        <div style={{...progressBar, width: `${room.percentage}%`, backgroundColor: room.color}}></div>
                                    </div>
                                    <small style={{ color: room.color, fontWeight: 'bold' }}>{room.percentage}% Full</small>
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
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' };
const statText = { display: 'flex', flexDirection: 'column' };
const iconCircle = (bg, color) => ({ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' });

const tableContainer = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', marginTop: '15px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const headerRow = { backgroundColor: '#f8f9fa', borderBottom: '2px solid #e2e8f0' };
const thStyle = { padding: '15px 20px', fontSize: '13px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' };
const rowStyle = { borderBottom: '1px solid #edf2f7' };
const tdStyle = { padding: '15px 20px', fontSize: '14px' };

const badgeStyle = (bg, color, isBold = false) => ({
    backgroundColor: bg, color: color, padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: isBold ? 'bold' : 'normal', display: 'inline-flex', alignItems: 'center'
});

const progressWrapper = { width: '100%', backgroundColor: '#edf2f7', borderRadius: '5px', height: '8px', marginBottom: '5px', overflow: 'hidden' };
const progressBar = { height: '100%', transition: 'width 0.5s ease-in-out' };

export default Receptiondashboard;