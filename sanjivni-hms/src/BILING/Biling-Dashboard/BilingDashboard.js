// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './BilingDashboard.css';

// const BilingDashboard = () => {
//   // --- STATE FOR LIVE STATS ---
//   const [stats, setStats] = useState({
//     todaysRevenue: 0,
//     pendingBills: 0,
//     admittedPatients: 0
//   });

//   useEffect(() => {
//     fetchBillingStats();
    
//     // Auto-refresh stats every 5 seconds
//     const interval = setInterval(fetchBillingStats, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchBillingStats = async () => {
//     try {
//       // Fetch data in parallel
//       const [pendingRes, admittedRes, oldPatientsRes] = await Promise.all([
//         axios.get('http://localhost:5000/pendingBills').catch(() => ({ data: [] })),
//         axios.get('http://localhost:5000/admitted').catch(() => ({ data: [] })),
//         axios.get('http://localhost:5000/oldpatients').catch(() => ({ data: [] }))
//       ]);

//       // 1. Pending Bills Count
//       const pendingCount = pendingRes.data.filter(b => b.patientId !== 'none').length;

//       // 2. Admitted Patients Count
//       const admittedCount = admittedRes.data.length;

//       // 3. Today's Revenue Calculation (From Paid/Archived Bills)
//       const todayString = new Date().toLocaleDateString();
//       let dailyRevenue = 0;
      
//       oldPatientsRes.data.forEach(bill => {
//         // Check if the bill was discharged/paid today
//         if (bill.dischargeDate === todayString && bill.status === 'Paid') {
//           dailyRevenue += Number(bill.grandTotal) || 0;
//         }
//       });

//       // Update State
//       setStats({
//         todaysRevenue: dailyRevenue,
//         pendingBills: pendingCount,
//         admittedPatients: admittedCount
//       });

//     } catch (error) {
//       console.error("Error fetching billing stats:", error);
//     }
//   };

//   return (
//     <div className="billing-wrapper">
//       <header className="billing-header">
//         <div className="header-left">
//           <h1>Billing Dashboard</h1>
//           <p>Financial Management System</p>
//         </div>
//       </header>

//       {/* --- DYNAMIC STATS ROW --- */}
//       <div className="billing-stats-row">
//         <div className="mini-stat">
//           Today's Revenue: <strong>₹{stats.todaysRevenue.toLocaleString('en-IN')}</strong>
//         </div>
//         <div className="mini-stat">
//           Pending Bills: <strong>{stats.pendingBills}</strong>
//         </div>
//         <div className="mini-stat">
//           Admitted Patients: <strong>{stats.admittedPatients}</strong>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default BilingDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BilingDashboard.css';
import { FaRupeeSign, FaFileInvoiceDollar, FaProcedures } from 'react-icons/fa';

const BilingDashboard = () => {
  // --- STATE FOR LIVE STATS ---
  const [stats, setStats] = useState({
    todaysRevenue: 0,
    pendingBills: 0,
    admittedPatients: 0
  });

  useEffect(() => {
    fetchBillingStats();
    
    // Auto-refresh stats every 5 seconds
    const interval = setInterval(fetchBillingStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBillingStats = async () => {
    try {
      // Fetch data in parallel
      const [pendingRes, admittedRes, oldPatientsRes] = await Promise.all([
        axios.get('http://localhost:5000/pendingBills').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/admitted').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/oldpatients').catch(() => ({ data: [] }))
      ]);

      // 1. Pending Bills Count
      const pendingCount = pendingRes.data.filter(b => b.patientId !== 'none').length;

      // 2. Admitted Patients Count
      const admittedCount = admittedRes.data.length;

      // 3. Today's Revenue Calculation (From Paid/Archived Bills)
      const todayString = new Date().toLocaleDateString();
      let dailyRevenue = 0;
      
      oldPatientsRes.data.forEach(bill => {
        // Check if the bill was discharged/paid today
        if (bill.dischargeDate === todayString && bill.status === 'Paid') {
          dailyRevenue += Number(bill.grandTotal) || 0;
        }
      });

      // Update State
      setStats({
        todaysRevenue: dailyRevenue,
        pendingBills: pendingCount,
        admittedPatients: admittedCount
      });

    } catch (error) {
      console.error("Error fetching billing stats:", error);
    }
  };

  return (
    <div className="billing-wrapper">
      <header className="billing-header">
        <div className="header-left">
          <h1>Billing Dashboard</h1>
          <p>Financial Management System</p>
        </div>
      </header>

      {/* --- DYNAMIC STATS GRID (Big Cards) --- */}
      <div className="billing-stats-grid">
        
        {/* Revenue Card */}
        <div className="stat-card revenue-card">
          <div className="icon-wrapper">
            <FaRupeeSign />
          </div>
          <div className="stat-info">
            <h3>₹{stats.todaysRevenue.toLocaleString('en-IN')}</h3>
            <p>Today's Revenue</p>
          </div>
        </div>

        {/* Pending Bills Card */}
        <div className="stat-card pending-card">
          <div className="icon-wrapper">
            <FaFileInvoiceDollar />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingBills}</h3>
            <p>Pending Bills</p>
          </div>
        </div>

        {/* Admitted Patients Card */}
        <div className="stat-card admitted-card">
          <div className="icon-wrapper">
            <FaProcedures />
          </div>
          <div className="stat-info">
            <h3>{stats.admittedPatients}</h3>
            <p>Admitted Patients</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BilingDashboard;