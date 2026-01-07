import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCalendarAlt, FaClock, FaHeartbeat, FaUserMd, FaHospital } from 'react-icons/fa';

const Surgery = () => {
    const [surgeries, setSurgeries] = useState([]);

    useEffect(() => {
        fetchSurgeries();
    }, []);

    const fetchSurgeries = () => {
        axios.get('http://localhost:5000/surgery') 
            .then(res => setSurgeries(res.data))
            .catch(err => console.error("Error fetching surgery data:", err));
    };

    // 🔥 --- GROUPING LOGIC ---
    // Groups the surgery array by patientDept
    const groupedSurgeries = surgeries.reduce((acc, surgery) => {
        const dept = surgery.patientDept || "General";
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(surgery);
        return acc;
    }, {});

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3182ce', paddingBottom: '10px', marginBottom: '30px' }}>
                <FaHeartbeat color="#3182ce" /> Surgery Overview (Department Wise)
            </h2>

            {Object.keys(groupedSurgeries).length > 0 ? (
                Object.keys(groupedSurgeries).map((deptName) => (
                    <div key={deptName} style={{ marginBottom: '40px' }}>
                        
                        {/* 🔥 DEPARTMENT HEADER */}
                        <div style={deptHeaderStyle}>
                            <FaHospital style={{ marginRight: '10px' }} /> 
                            {deptName} Department 
                            <span style={countBadgeStyle}>{groupedSurgeries[deptName].length} Scheduled</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                            {groupedSurgeries[deptName].map((s) => (
                                <div key={s.id} style={cardStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FaUserCircle size={40} color="#3182ce" />
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '18px' }}>{s.patientName}</h3>
                                            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '12px' }}>
                                                Age: {s.patientAge} | ID: {s.patientId}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eee' }} />
                                    
                                    <div style={{ marginBottom: '15px' }}>
                                        <small style={{ color: '#3182ce', fontWeight: 'bold', textTransform: 'uppercase' }}>Scheduled Procedure</small>
                                        <p style={{ margin: '5px 0', color: '#2d3748', fontWeight: '600' }}>{s.surgeryType}</p>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={badgeStyle}><FaCalendarAlt /> {s.surgeryDate}</div>
                                        <div style={{...badgeStyle, backgroundColor: '#ebf8ff', color: '#3182ce'}}><FaClock /> {s.surgeryTime}</div>
                                    </div>

                                    <div style={{ marginTop: '15px', borderTop: '1px solid #f1f1f1', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaUserMd color="#95a5a6" />
                                        <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Surgeon: <b>Dr. {s.doctorName}</b></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
                    <p>No surgeries found in the shared database.</p>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---

const deptHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2c3e50',
    backgroundColor: '#fff',
    padding: '12px 20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    borderLeft: '5px solid #3182ce'
};

const countBadgeStyle = {
    marginLeft: 'auto',
    fontSize: '12px',
    backgroundColor: '#3182ce',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '20px'
};

const cardStyle = { 
    backgroundColor: '#fff', 
    padding: '20px', 
    borderRadius: '12px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
    border: '1px solid #eee' 
};

const badgeStyle = { 
    backgroundColor: '#f0f4f8', 
    color: '#2c3e50', 
    padding: '5px 12px', 
    borderRadius: '20px', 
    fontSize: '12px', 
    fontWeight: 'bold', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px' 
};

export default Surgery;