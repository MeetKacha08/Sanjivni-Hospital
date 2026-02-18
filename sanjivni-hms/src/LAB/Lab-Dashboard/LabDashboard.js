// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaFlask, FaClipboardList, FaCheckCircle, FaHourglassHalf, FaMicroscope } from 'react-icons/fa';

// const LabDashboard = () => {
//   const [stats, setStats] = useState({
//     pending: 0,
//     completed: 0,
//     totalReports: 0
//   });

//   const staffName = localStorage.getItem('loggedInLabStaffName') || 'Lab Technician';

//   useEffect(() => {
//     fetchDashboardStats();
    
//     // Auto-refresh every 5 seconds to instantly reflect completed results
//     const intervalId = setInterval(fetchDashboardStats, 5000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const fetchDashboardStats = async () => {
//     try {
//       // Fetching from pandinglabrequest to sync with the Pending Requests page
//       const res = await axios.get('http://localhost:5000/pandinglabrequest');
//       const data = res.data;
      
//       const pendingCount = data.filter(item => item.status === 'Pending').length;
//       const completedCount = data.filter(item => item.status === 'Completed').length;
      
//       setStats({
//         pending: pendingCount,
//         completed: completedCount,
//         totalReports: pendingCount + completedCount // Sum of Pending and Completed
//       });
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//     }
//   };

//   return (
//     <div style={containerStyle}>
//       <div style={welcomeSection}>
//         <div>
//           <h2 style={{ margin: 0, color: '#2c3e50' }}>Welcome, {staffName}</h2>
//           <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>Laboratory Management System Overview</p>
//         </div>
//         <div style={iconCircle}>
//           <FaMicroscope size={30} color="#2980b9" />
//         </div>
//       </div>

//       <div style={cardGrid}>
//         <div style={{ ...statCard, borderLeft: '5px solid #f39c12' }}>
//           <div style={statIconArea}><FaHourglassHalf color="#f39c12" size={25} /></div>
//           <div>
//             <div style={statLabel}>Pending Tests</div>
//             <div style={statValue}>{stats.pending}</div>
//           </div>
//         </div>

//         <div style={{ ...statCard, borderLeft: '5px solid #27ae60' }}>
//           <div style={statIconArea}><FaCheckCircle color="#27ae60" size={25} /></div>
//           <div>
//             <div style={statLabel}>Completed Today</div>
//             <div style={statValue}>{stats.completed}</div>
//           </div>
//         </div>

//         <div style={{ ...statCard, borderLeft: '5px solid #8e44ad' }}>
//           <div style={statIconArea}><FaClipboardList color="#8e44ad" size={25} /></div>
//           <div>
//             <div style={statLabel}>Total Assignments</div>
//             <div style={statValue}>{stats.totalReports}</div>
//           </div>
//         </div>
//       </div>

//       <div style={quickActionsContainer}>
//         <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Quick Access</h3>
//         <div style={cardContainer}>
//           <div style={actionCard}>
//             <FaFlask size={30} color="#3498db" />
//             <h4>Analyze Samples</h4>
//             <p>Process pending lab requests</p>
//           </div>
//           <div style={actionCard}>
//             <FaClipboardList size={30} color="#e67e22" />
//             <h4>Update Results</h4>
//             <p>Enter test outcomes</p>
//           </div>
//           <div style={actionCard}>
//             <FaCheckCircle size={30} color="#2ecc71" />
//             <h4>Verified Reports</h4>
//             <p>View final signed documents</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- STYLES ---
// const containerStyle = { padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' };
// const welcomeSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px 30px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px' };
// const iconCircle = { width: '60px', height: '60px', backgroundColor: '#e1f5fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };
// const cardGrid = { display: 'flex', gap: '20px', marginBottom: '40px' };
// const statCard = { flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' };
// const statIconArea = { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' };
// const statLabel = { fontSize: '14px', color: '#7f8c8d', fontWeight: '500' };
// const statValue = { fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' };
// const quickActionsContainer = { marginTop: '20px' };
// const cardContainer = { display: 'flex', gap: '20px' };
// const actionCard = { padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flex: 1, textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #eee' };

// export default LabDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHourglassHalf, FaCheckCircle, FaClipboardList, FaMicroscope } from 'react-icons/fa';

const LabDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    totalReports: 0
  });

  const staffName = localStorage.getItem('loggedInLabStaffName') || 'Lab Technician';

  useEffect(() => {
    fetchDashboardStats();
    
    // Auto-refresh every 5 seconds to instantly reflect completed results
    const intervalId = setInterval(fetchDashboardStats, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetching from pandinglabrequest to sync with the Pending Requests page
      const res = await axios.get('http://localhost:5000/pandinglabrequest');
      const data = res.data;
      
      const pendingCount = data.filter(item => item.status === 'Pending').length;
      const completedCount = data.filter(item => item.status === 'Completed').length;
      
      setStats({
        pending: pendingCount,
        completed: completedCount,
        totalReports: pendingCount + completedCount // Sum of Pending and Completed
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={welcomeSection}>
        <div>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Welcome, {staffName}</h2>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>Laboratory Management System Overview</p>
        </div>
        <div style={iconCircle}>
          <FaMicroscope size={30} color="#2980b9" />
        </div>
      </div>

      <div style={cardGrid}>
        <div style={{ ...statCard, borderLeft: '5px solid #f39c12' }}>
          <div style={statIconArea}><FaHourglassHalf color="#f39c12" size={25} /></div>
          <div>
            <div style={statLabel}>Pending Tests</div>
            <div style={statValue}>{stats.pending}</div>
          </div>
        </div>

        <div style={{ ...statCard, borderLeft: '5px solid #27ae60' }}>
          <div style={statIconArea}><FaCheckCircle color="#27ae60" size={25} /></div>
          <div>
            <div style={statLabel}>Completed Today</div>
            <div style={statValue}>{stats.completed}</div>
          </div>
        </div>

        <div style={{ ...statCard, borderLeft: '5px solid #8e44ad' }}>
          <div style={statIconArea}><FaClipboardList color="#8e44ad" size={25} /></div>
          <div>
            <div style={statLabel}>Total Assignments</div>
            <div style={statValue}>{stats.totalReports}</div>
          </div>
        </div>
      </div>

    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' };
const welcomeSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px 30px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px' };
const iconCircle = { width: '60px', height: '60px', backgroundColor: '#e1f5fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardGrid = { display: 'flex', gap: '20px', marginBottom: '40px' };
const statCard = { flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' };
const statIconArea = { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' };
const statLabel = { fontSize: '14px', color: '#7f8c8d', fontWeight: '500' };
const statValue = { fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' };

export default LabDashboard;