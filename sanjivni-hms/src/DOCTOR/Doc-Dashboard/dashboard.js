// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { 
//     FaUserInjured, 
//     FaClock, 
//     FaCheckCircle, 
//     FaUserMd, 
//     FaHospital,
//     FaBed,
//     FaHeartbeat
// } from 'react-icons/fa';

// const DoctorDashboard = () => {
//     const [doctorInfo, setDoctorInfo] = useState({
//         name: localStorage.getItem('loggedInDoctorName') || "Doctor",
//         dept: localStorage.getItem('loggedInDoctorDept') || "Loading..."
//     });

//     // State to hold all the dynamic counts
//     const [stats, setStats] = useState({
//         pendingPatients: 0,
//         myPatients: 0,
//         admittedPatients: 0,
//         scheduledSurgeries: 0,
//         completedSurgeries: 0
//     });

//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchDoctorDetails();
//         fetchAllStats();

//         // Optional: auto-refresh stats every 5 seconds
//         const intervalId = setInterval(() => {
//             fetchAllStats();
//         }, 5000);
//         return () => clearInterval(intervalId);
//     }, []);

//     const fetchDoctorDetails = async () => {
//         const storedName = localStorage.getItem('loggedInDoctorName');
//         const storedDept = localStorage.getItem('loggedInDoctorDept');

//         if (!storedDept && storedName) {
//             try {
//                 const res = await axios.get(`http://localhost:5000/doctors?name=${storedName}`);
//                 if (res.data.length > 0) {
//                     const dept = res.data[0].department;
//                     setDoctorInfo({ name: storedName, dept: dept });
//                     localStorage.setItem('loggedInDoctorDept', dept); 
//                 }
//             } catch (err) {
//                 console.error("Error fetching doctor details:", err);
//             }
//         } else {
//             setDoctorInfo({ name: storedName, dept: storedDept });
//         }
//     };

//     // 🔥 NEW: Fetch counts from all relevant endpoints
//     const fetchAllStats = async () => {
//         const docName = localStorage.getItem('loggedInDoctorName');
//         if (!docName) return;

//         try {
//             const [patientsRes, admittedRes, surgeryRes] = await Promise.all([
//                 axios.get('http://localhost:5000/patients'),
//                 axios.get('http://localhost:5000/admitted'),
//                 axios.get('http://localhost:5000/surgery')
//             ]);

//             // 1. Pending & My Patients
//             const docPatients = patientsRes.data.filter(p => p.doctorName === docName);
//             const pending = docPatients.filter(p => p.status === 'Accepted').length;
//             const approved = docPatients.filter(p => p.status === 'Approved').length;

//             // 2. Admitted Patients
//             const admitted = admittedRes.data.filter(p => p.doctorName === docName).length;

//             // 3. Surgeries
//             const docSurgeries = surgeryRes.data.filter(s => s.doctorName === docName);
//             const scheduledSurg = docSurgeries.filter(s => s.status !== 'Completed').length;
//             const completedSurg = docSurgeries.filter(s => s.status === 'Completed').length;

//             setStats({
//                 pendingPatients: pending,
//                 myPatients: approved,
//                 admittedPatients: admitted,
//                 scheduledSurgeries: scheduledSurg,
//                 completedSurgeries: completedSurg
//             });

//         } catch (error) {
//             console.error("Error fetching doctor stats:", error);
//         }
//     };

//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            
//             {/* --- ENHANCED DOCTOR PROFILE HEADER --- */}
//             <div style={headerWrapper}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//                     <div style={doctorAvatarCircle}>
//                         <FaUserMd size={40} color="#fff" />
//                     </div>
//                     <div>
//                         <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '26px' }}>Dr. {doctorInfo.name}</h2>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
//                             <span style={deptBadge}>
//                                 <FaHospital size={12} style={{ marginRight: '5px' }} />
//                                 Specialist in {doctorInfo.dept}
//                             </span>
//                             <span style={onlineStatus}>● Online</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* --- DAILY STATISTICS --- */}
//             <div style={statsGrid}>
                
//                 {/* 1. Pending Patients */}
//                 <div style={{...statCard, borderLeft: '5px solid #f39c12'}}>
//                     <FaClock color="#f39c12" size={28}/> 
//                     <div>
//                         <h3 style={statNumber}>{stats.pendingPatients}</h3>
//                         <p style={statLabel}>Pending Patients</p>
//                     </div>
//                 </div>

//                 {/* 2. My Approved Patients */}
//                 <div style={{...statCard, borderLeft: '5px solid #3498db'}}>
//                     <FaUserInjured color="#3498db" size={28}/> 
//                     <div>
//                         <h3 style={statNumber}>{stats.myPatients}</h3>
//                         <p style={statLabel}>My Patients</p>
//                     </div>
//                 </div>

//                 {/* 3. Admitted Patients */}
//                 <div style={{...statCard, borderLeft: '5px solid #9b59b6'}}>
//                     <FaBed color="#9b59b6" size={28}/> 
//                     <div>
//                         <h3 style={statNumber}>{stats.admittedPatients}</h3>
//                         <p style={statLabel}>Admitted Patients</p>
//                     </div>
//                 </div>

//                 {/* 4. Scheduled Surgeries */}
//                 <div style={{...statCard, borderLeft: '5px solid #e74c3c'}}>
//                     <FaHeartbeat color="#e74c3c" size={28}/> 
//                     <div>
//                         <h3 style={statNumber}>{stats.scheduledSurgeries}</h3>
//                         <p style={statLabel}>Surgeries Scheduled</p>
//                     </div>
//                 </div>

//                 {/* 5. Completed Surgeries */}
//                 <div style={{...statCard, borderLeft: '5px solid #27ae60'}}>
//                     <FaCheckCircle color="#27ae60" size={28}/> 
//                     <div>
//                         <h3 style={statNumber}>{stats.completedSurgeries}</h3>
//                         <p style={statLabel}>Surgeries Completed</p>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const headerWrapper = { backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '35px', border: '1px solid #edf2f7' };
// const doctorAvatarCircle = { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#3498db', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)' };
// const deptBadge = { backgroundColor: '#e1f0ff', color: '#2b6cb0', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center' };
// const onlineStatus = { color: '#27ae60', fontSize: '13px', fontWeight: 'bold' };
// const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' };
// const statCard = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #edf2f7' };
// const statNumber = { margin: 0, fontSize: '28px', color: '#2d3748' };
// const statLabel = { margin: 0, color: '#718096', fontSize: '14px', fontWeight: '500' };

// export default DoctorDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    FaUserInjured, 
    FaClock, 
    FaCheckCircle, 
    FaUserMd, 
    FaHospital,
    FaBed,
    FaHeartbeat
} from 'react-icons/fa';

const DoctorDashboard = () => {
    const [doctorInfo, setDoctorInfo] = useState({
        name: localStorage.getItem('loggedInDoctorName') || "Doctor",
        dept: localStorage.getItem('loggedInDoctorDept') || "Loading..."
    });

    // State to hold all the dynamic counts
    const [stats, setStats] = useState({
        pendingPatients: 0,
        myPatients: 0,
        admittedPatients: 0,
        scheduledSurgeries: 0,
        completedSurgeries: 0
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctorDetails();
        fetchAllStats();

        // Optional: auto-refresh stats every 5 seconds
        const intervalId = setInterval(() => {
            fetchAllStats();
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchDoctorDetails = async () => {
        const storedName = localStorage.getItem('loggedInDoctorName');
        const storedDept = localStorage.getItem('loggedInDoctorDept');

        if (!storedDept && storedName) {
            try {
                const res = await axios.get(`http://localhost:5000/doctors?name=${storedName}`);
                if (res.data.length > 0) {
                    const dept = res.data[0].department;
                    setDoctorInfo({ name: storedName, dept: dept });
                    localStorage.setItem('loggedInDoctorDept', dept); 
                }
            } catch (err) {
                console.error("Error fetching doctor details:", err);
            }
        } else {
            setDoctorInfo({ name: storedName, dept: storedDept });
        }
    };

    // 🔥 Fetch counts from all relevant endpoints
    const fetchAllStats = async () => {
        const docName = localStorage.getItem('loggedInDoctorName');
        if (!docName) return;

        try {
            const [patientsRes, admittedRes, surgeryRes] = await Promise.all([
                axios.get('http://localhost:5000/patients'),
                axios.get('http://localhost:5000/admitted'),
                axios.get('http://localhost:5000/surgery')
            ]);

            // 1. Pending & My Patients
            const docPatients = patientsRes.data.filter(p => p.doctorName === docName);
            const pending = docPatients.filter(p => p.status === 'Accepted').length;
            const approved = docPatients.filter(p => p.status === 'Approved').length;

            // 2. Admitted Patients
            const admitted = admittedRes.data.filter(p => p.doctorName === docName).length;

            // 3. Surgeries
            const docSurgeries = surgeryRes.data.filter(s => s.doctorName === docName);
            const scheduledSurg = docSurgeries.filter(s => s.status !== 'Completed').length;
            const completedSurg = docSurgeries.filter(s => s.status === 'Completed').length;

            setStats({
                pendingPatients: pending,
                myPatients: approved,
                admittedPatients: admitted,
                scheduledSurgeries: scheduledSurg,
                completedSurgeries: completedSurg
            });

        } catch (error) {
            console.error("Error fetching doctor stats:", error);
        }
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

            {/* --- DAILY STATISTICS (3 per row, larger cards) --- */}
            <div style={statsGrid}>
                
                {/* 1. Pending Patients */}
                <div style={{...statCard, borderLeft: '8px solid #f39c12'}}>
                    <FaClock color="#f39c12" size={45}/> 
                    <div>
                        <h3 style={statNumber}>{stats.pendingPatients}</h3>
                        <p style={statLabel}>Pending Patients</p>
                    </div>
                </div>

                {/* 2. My Approved Patients */}
                <div style={{...statCard, borderLeft: '8px solid #3498db'}}>
                    <FaUserInjured color="#3498db" size={45}/> 
                    <div>
                        <h3 style={statNumber}>{stats.myPatients}</h3>
                        <p style={statLabel}>My Patients</p>
                    </div>
                </div>

                {/* 3. Admitted Patients */}
                <div style={{...statCard, borderLeft: '8px solid #9b59b6'}}>
                    <FaBed color="#9b59b6" size={45}/> 
                    <div>
                        <h3 style={statNumber}>{stats.admittedPatients}</h3>
                        <p style={statLabel}>Admitted Patients</p>
                    </div>
                </div>

                {/* 4. Scheduled Surgeries */}
                <div style={{...statCard, borderLeft: '8px solid #e74c3c'}}>
                    <FaHeartbeat color="#e74c3c" size={45}/> 
                    <div>
                        <h3 style={statNumber}>{stats.scheduledSurgeries}</h3>
                        <p style={statLabel}>Surgeries Scheduled</p>
                    </div>
                </div>

                {/* 5. Completed Surgeries */}
                <div style={{...statCard, borderLeft: '8px solid #27ae60'}}>
                    <FaCheckCircle color="#27ae60" size={45}/> 
                    <div>
                        <h3 style={statNumber}>{stats.completedSurgeries}</h3>
                        <p style={statLabel}>Surgeries Completed</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- STYLES ---
const headerWrapper = { backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '35px', border: '1px solid #edf2f7' };
const doctorAvatarCircle = { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#3498db', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)' };
const deptBadge = { backgroundColor: '#e1f0ff', color: '#2b6cb0', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center' };
const onlineStatus = { color: '#27ae60', fontSize: '13px', fontWeight: 'bold' };

// 🔥 MODIFIED FOR 3 BIG CARDS PER ROW
const statsGrid = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(3, 1fr)', // Forces exactly 3 columns
    gap: '30px', 
    marginBottom: '30px' 
};

const statCard = { 
    backgroundColor: 'white', 
    padding: '35px 25px', // Bigger padding for height
    borderRadius: '15px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '25px', // More space between icon and text
    boxShadow: '0 6px 15px rgba(0,0,0,0.06)', 
    border: '1px solid #edf2f7' 
};

const statNumber = { 
    margin: 0, 
    fontSize: '42px', // Much larger text
    color: '#2d3748',
    lineHeight: '1'
};

const statLabel = { 
    margin: '8px 0 0 0', 
    color: '#718096', 
    fontSize: '16px', // Larger label
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

export default DoctorDashboard;