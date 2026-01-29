import React from 'react';
import './BilingDashboard.css';
import { FaFileInvoiceDollar, FaUserTie, FaChartLine } from 'react-icons/fa';

const BilingDashboard = () => {
  // Navigation and handleLogout logic removed as requested

  const menuItems = [
    { title: "Patient Billing", icon: <FaFileInvoiceDollar size={30} />, desc: "Generate invoices and manage payments" },
    { title: "Salary Management", icon: <FaUserTie size={30} />, desc: "Staff payroll and doctor commissions" },
    { title: "Expense Reports", icon: <FaChartLine size={30} />, desc: "Track hospital utility and supply costs" },
  ];

  return (
    <div className="billing-wrapper">
      <header className="billing-header">
        <div className="header-left">
          <h1>Billing Dashboard</h1>
          <p>Financial Management System</p>
        </div>
        {/* Logout button element removed from here */}
      </header>

      <div className="billing-stats-row">
        <div className="mini-stat">Today's Revenue: <strong>$4,250</strong></div>
        <div className="mini-stat">Pending Bills: <strong>12</strong></div>
        <div className="mini-stat">Staff Paid: <strong>85%</strong></div>
      </div>

      <div className="billing-grid">
        {menuItems.map((item, index) => (
          <div key={index} className="billing-card">
            <div className="icon-wrapper">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <button className="action-link">Open Module</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BilingDashboard;