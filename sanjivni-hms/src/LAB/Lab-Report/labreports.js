

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTimes, FaEdit, FaTrash, FaFileAlt, FaMicroscope, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';

const Labreport = () => {
    // --- AUTHENTICATION STATES ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [credentials, setCredentials] = useState({ id: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    // --- DATA STATES ---
    const [reportList, setReportList] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const initialReportState = { reportName: '', reportFees: '' };
    const [addFormData, setAddFormData] = useState(initialReportState);
    const [editFormData, setEditFormData] = useState({});

    // --- FETCH DATA ---
    useEffect(() => {
        if (isAuthenticated) {
            fetchReports();
        }
    }, [isAuthenticated]);

    const fetchReports = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/reports`);
            setReportList(res.data);
        } catch (err) {
            console.log("Error fetching reports", err);
            setReportList([]);
        }
    };

    // --- LOGIN HANDLER ---
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/labStaff');
            const labStaffList = response.data;

            const user = labStaffList.find(
                (staff) => staff.loginId === credentials.id && staff.password === credentials.password
            );

            if (user) {
                // 🔥 Restriction Check: Only allow Lab-Head
                if (user.position === "Lab-Head") {
                    setIsAuthenticated(true);
                } else {
                    alert(`Access Denied: Only a Lab-Head can manage reports. Your current position is ${user.position}.`);
                }
            } else {
                alert("Incorrect Login ID or Password!");
            }
        } catch (error) {
            alert("System error: Could not verify credentials.");
        }
    };

    // --- HANDLERS ---
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the report: ${name}?`)) {
            try {
                await axios.delete(`http://localhost:5000/reports/${id}`);
                alert("Report deleted successfully!");
                fetchReports();
            } catch (error) { console.error(error); }
        }
    };

    const handleEditClick = (item) => {
        setEditFormData({ ...item });
        setShowEditModal(true);
    };

    const handleFormChange = (e, isAdd = false) => {
        const { name, value } = e.target;
        if (isAdd) setAddFormData({ ...addFormData, [name]: value });
        else setEditFormData({ ...editFormData, [name]: value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/reports/${editFormData.id}`, editFormData);
            alert("Report updated successfully!");
            setShowEditModal(false);
            fetchReports();
        } catch (error) { console.error(error); }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/reports`, addFormData);
            alert("Report added successfully!");
            setShowAddModal(false);
            fetchReports();
            setAddFormData(initialReportState);
        } catch (error) { console.error(error); }
    };

    // --- RENDER LOGIN IF NOT AUTHENTICATED ---
    if (!isAuthenticated) {
        return (
            <div style={loginContainerStyle}>
                <div style={loginCardStyle}>
                    <div style={lockCircleStyle}>
                        <FaUserShield size={32} color="#3498db" />
                    </div>
                    <h2 style={{ marginBottom: '10px', fontSize: '22px', color: '#2c3e50' }}>Lab-Head Access Only</h2>
                    <p style={{ marginBottom: '25px', color: '#7f8c8d', fontSize: '14px' }}>Please login to manage lab reports</p>
                    
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
                        <input
                            type="text"
                            placeholder="Head Login ID"
                            style={loginInputStyle}
                            value={credentials.id}
                            onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
                            required
                        />
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                style={loginInputStyle}
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                required
                            />
                            <div onClick={() => setShowPassword(!showPassword)} style={eyeIconStyle}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        <button type="submit" style={loginButtonStyle}>Verify & Enter</button>
                    </form>
                </div>
            </div>
        );
    }

    // --- MAIN PAGE CONTENT ---
    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={topNavbarStyle}>
                <div style={logoArea}>
                    <FaMicroscope color="white" size={24} />
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>REPORT MANAGEMENT</span>
                </div>
            </div>

            <div style={{ padding: '30px', position: 'relative' }}>
                <div style={addBtnContainer}>
                    <button style={roundAddBtn} onClick={() => setShowAddModal(true)} title="Add New Report">
                        <FaPlus /> Add Report
                    </button>
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>
                    Available Lab Reports
                </h2>

                <div style={tableWrapper}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Report Name</th>
                                <th style={thStyle}>Fees (₹)</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportList.map((report) => (
                                <tr key={report.id} style={trStyle}>
                                    <td style={tdStyle}>
                                        <FaFileAlt color="#007bff" style={{ marginRight: '10px' }} />
                                        {report.reportName}
                                    </td>
                                    <td style={tdStyle}>
                                        <strong style={{ color: '#28a745' }}>₹ {report.reportFees}</strong>
                                    </td>
                                    <td style={tdStyle}>
                                        <FaEdit
                                            style={{ color: '#007bff', cursor: 'pointer', marginRight: '15px', fontSize: '18px' }}
                                            onClick={() => handleEditClick(report)}
                                        />
                                        <FaTrash
                                            style={{ color: '#dc3545', cursor: 'pointer', fontSize: '18px' }}
                                            onClick={() => handleDelete(report.id, report.reportName)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {reportList.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No reports found.</p>
                    )}
                </div>
            </div>

            {(showAddModal || showEditModal) && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, width: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>{showEditModal ? 'Edit Report' : 'Add New Report'}</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => { setShowAddModal(false); setShowEditModal(false); }} />
                        </div>
                        <form onSubmit={showEditModal ? handleUpdateSubmit : handleAddSubmit} style={{ marginTop: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={inputGroup}>
                                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Report Name</label>
                                    <input 
                                        type="text" 
                                        name="reportName" 
                                        value={showEditModal ? editFormData.reportName || '' : addFormData.reportName} 
                                        onChange={(e) => handleFormChange(e, !showEditModal)} 
                                        style={inputStyle} 
                                        placeholder="e.g. Blood Test"
                                        required 
                                    />
                                </div>
                                <div style={inputGroup}>
                                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Fees (₹)</label>
                                    <input 
                                        type="number" 
                                        name="reportFees" 
                                        value={showEditModal ? editFormData.reportFees || '' : addFormData.reportFees} 
                                        onChange={(e) => handleFormChange(e, !showEditModal)} 
                                        style={inputStyle} 
                                        placeholder="Enter amount"
                                        required 
                                    />
                                </div>
                            </div>
                            <button type="submit" style={updateBtnStyle}>
                                {showEditModal ? 'Update Report' : 'Save Report'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const tableWrapper = { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', color: '#666', fontSize: '14px' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #eee', fontSize: '15px' };
const trStyle = { transition: '0.2s' };
const topNavbarStyle = { display: 'flex', alignItems: 'center', backgroundColor: '#2c3e50', color: 'white', padding: '0 30px', height: '70px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const logoArea = { display: 'flex', alignItems: 'center', gap: '12px' };
const addBtnContainer = { position: 'absolute', top: '0px', right: '30px', zIndex: 10 };
const roundAddBtn = { height: '50px', borderRadius: '25px', padding: '0 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', gap: '10px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' };
const updateBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '700px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' };

// Login Styles
const loginContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', width: '100%', backgroundColor: 'transparent' };
const loginCardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const lockCircleStyle = { backgroundColor: '#e1f5fe', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' };
const loginInputStyle = { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '15px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8f9fa' };
const loginButtonStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '13px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', width: '100%' };
const eyeIconStyle = { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6c757d' };

export default Labreport;