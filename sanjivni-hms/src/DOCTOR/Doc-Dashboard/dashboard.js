import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserInjured, FaClock, FaCheckCircle, FaExclamationTriangle, FaUserMd, FaHospital } from 'react-icons/fa';

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState({
        name: localStorage.getItem('loggedInDoctorName') || "Doctor",
        dept: localStorage.getItem('loggedInDoctorDept') || "Loading..."
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctorDetails();
        fetchPatients();
    }, []);

    // 🔥 New function to ensure we get the department from the server
    const fetchDoctorDetails = async () => {
        const storedName = localStorage.getItem('loggedInDoctorName');
        const storedDept = localStorage.getItem('loggedInDoctorDept');

        // If department is missing in localStorage, fetch it from the API
        if (!storedDept && storedName) {
            try {
                const res = await axios.get(`http://localhost:5000/doctors?name=${storedName}`);
                if (res.data.length > 0) {
                    const dept = res.data[0].department;
                    setDoctorInfo({ name: storedName, dept: dept });
                    localStorage.setItem('loggedInDoctorDept', dept); // Save for next time
                }
            } catch (err) {
                console.error("Error fetching doctor details:", err);
            }
        } else {
            setDoctorInfo({ name: storedName, dept: storedDept });
        }
    };

    const fetchPatients = () => {
        axios.get('http://localhost:5000/patients')
            .then(res => {
                const filtered = res.data.filter(p => p.doctorName === doctorInfo.name);
                setPatients(filtered);
            })
            .catch(err => console.error("Error fetching patients:", err));
    };

    const stats = {
        total: patients.length,
        pending: patients.filter(p => p.status === 'Accepted').length,
        completed: 0, 
        emergency: 0 
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            
            {/* --- ENHANCED DOCTOR PROFILE HEADER --- */}
            <div style={headerWrapper}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={doctorAvatarCircle}>
                        <FaUserMd size={40} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '26px' }}>Dr. {doctorInfo.name}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                            <span style={deptBadge}>
                                <FaHospital size={12} style={{ marginRight: '5px' }} />
                                Specialist in {doctorInfo.dept}
                            </span>
                            <span style={onlineStatus}>● Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DAILY STATISTICS --- */}
            <div style={statsGrid}>
                <div style={statCard}>
                    <FaUserInjured color="#3498db" size={24}/> 
                    <div>
                        <h3 style={statNumber}>{stats.total}</h3>
                        <p style={statLabel}>My Patients</p>
                    </div>
                </div>

                <div style={statCard}>
                    <FaClock color="#f39c12" size={24}/> 
                    <div>
                        <h3 style={statNumber}>{stats.pending}</h3>
                        <p style={statLabel}>Waiting</p>
                    </div>
                </div>

                <div style={statCard}>
                    <FaCheckCircle color="#27ae60" size={24}/> 
                    <div>
                        <h3 style={statNumber}>{stats.completed}</h3>
                        <p style={statLabel}>Treated</p>
                    </div>
                </div>

                <div style={{...statCard, borderLeft: '5px solid #e74c3c'}}>
                    <FaExclamationTriangle color="#e74c3c" size={24}/> 
                    <div>
                        <h3 style={statNumber}>{stats.emergency}</h3>
                        <p style={statLabel}>Critical</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- STYLES (No changes needed, keeping original) ---
const headerWrapper = { backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '35px', border: '1px solid #edf2f7' };
const doctorAvatarCircle = { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#3498db', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)' };
const deptBadge = { backgroundColor: '#e1f0ff', color: '#2b6cb0', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center' };
const onlineStatus = { color: '#27ae60', fontSize: '13px', fontWeight: 'bold' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' };
const statCard = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #edf2f7' };
const statNumber = { margin: 0, fontSize: '28px', color: '#2d3748' };
const statLabel = { margin: 0, color: '#718096', fontSize: '14px', fontWeight: '500' };

export default DoctorDashboard;