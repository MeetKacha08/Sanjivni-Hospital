import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaMicroscope, FaTimes, FaIdCard, FaGraduationCap, FaBriefcase, FaEnvelope, FaPhoneAlt, FaLock, FaEdit, FaTrash, FaFileAlt, FaUsers, FaUserTag } from 'react-icons/fa';

const Laboratory = () => {
    // UI States
    const [activeTab, setActiveTab] = useState('labStaff'); 
    const [staffList, setStaffList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [showEditModal, setShowEditModal] = useState(false); 
    const [showAddModal, setShowAddModal] = useState(false); 

    // --- INITIAL STATES ---
    // 🔥 Added 'position' to initial state
    const initialStaffState = { fullName: '', age: '', contact: '', email: '', education: '', experience: '', loginId: '', password: '', position: 'Lab-Staff' };
    const initialReportState = { reportName: '', reportFees: '' };
    
    const [addFormData, setAddFormData] = useState(initialStaffState);
    const [editFormData, setEditFormData] = useState({});

    // --- FETCH DATA ---
    useEffect(() => {
        fetchData();
        setAddFormData(activeTab === 'labStaff' ? initialStaffState : initialReportState);
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/${activeTab}`);
            setStaffList(res.data);
        } catch (err) {
            console.log("Error fetching data", err);
            setStaffList([]); 
        }
    };

    // --- HANDLERS ---
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await axios.delete(`http://localhost:5000/${activeTab}/${id}`);
                alert("Deleted successfully!");
                setSelectedItem(null);
                fetchData();
            } catch (error) { console.error(error); }
        }
    };

    const handleEditClick = (item) => {
        if (item) {
            setEditFormData({ ...item }); 
            setShowEditModal(true);
        }
    };

    const handleFormChange = (e, isAdd = false) => {
        const { name, value } = e.target;
        if (isAdd) setAddFormData({ ...addFormData, [name]: value });
        else setEditFormData({ ...editFormData, [name]: value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/${activeTab}/${editFormData.id}`, editFormData);
            alert("Updated successfully!");
            setShowEditModal(false);
            setSelectedItem(editFormData); 
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/${activeTab}`, addFormData);
            alert("Added successfully!");
            setShowAddModal(false);
            fetchData();
            setAddFormData(activeTab === 'labStaff' ? initialStaffState : initialReportState);
        } catch (error) { console.error(error); }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            
            {/* --- TOP NAVBAR --- */}
            <div style={topNavbarStyle}>
                <div style={logoArea}>
                    <FaMicroscope color="white" size={24} />
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>LAB PANEL</span>
                </div>
                <div style={navItemsContainer}>
                    <div style={activeTab === 'labStaff' ? activeNavItemStyle : navItemStyle} onClick={() => setActiveTab('labStaff')}>
                        <FaUsers /> Lab Staff
                    </div>
                    <div style={activeTab === 'reports' ? activeNavItemStyle : navItemStyle} onClick={() => setActiveTab('reports')}>
                        <FaFileAlt /> Report Management
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div style={{ padding: '30px', position: 'relative' }}>
                <div style={addBtnContainer}>
                    <button style={roundAddBtn} onClick={() => setShowAddModal(true)} title="Add New">
                        <FaPlus /> {activeTab === 'labStaff' ? 'Add Staff' : 'Add Report'}
                    </button>
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>
                    {activeTab === 'labStaff' ? 'Our Lab Specialists' : 'Available Reports'}
                </h2>

                {activeTab === 'labStaff' ? (
                    <div style={cardGridStyle}>
                        {staffList.map((item) => (
                            <div key={item.id} style={cardStyle} onClick={() => setSelectedItem(item)}>
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${item.fullName}&background=random&size=200`} 
                                    alt="Avatar" style={imageStyle} 
                                />
                                <div style={{ padding: '15px', textAlign: 'center' }}>
                                    <h3 style={{ margin: '10px 0 5px 0', color: '#2c3e50' }}>{item.fullName}</h3>
                                    <div style={{color: '#007bff', fontWeight: 'bold', fontSize: '14px'}}>{item.position}</div>
                                    <div style={eduBadgeStyle}>
                                        <FaGraduationCap style={{ marginRight: '5px' }} /> {item.education}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
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
                                {staffList.map((report) => (
                                    <tr key={report.id} style={trStyle}>
                                        <td style={tdStyle}>
                                            <FaFileAlt color="#007bff" style={{marginRight: '10px'}}/>
                                            {report.reportName}
                                        </td>
                                        <td style={tdStyle}>
                                            <strong style={{color: '#28a745'}}>₹ {report.reportFees}</strong>
                                        </td>
                                        <td style={tdStyle}>
                                            <FaEdit 
                                                style={{ color: '#007bff', cursor: 'pointer', marginRight: '15px' }} 
                                                onClick={(e) => { e.stopPropagation(); handleEditClick(report); }} 
                                            />
                                            <FaTrash 
                                                style={{ color: '#dc3545', cursor: 'pointer' }} 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(report.id, report.reportName); }} 
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- DETAILS MODAL --- */}
            {selectedItem && !showEditModal && activeTab === 'labStaff' && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <img src={`https://ui-avatars.com/api/?name=${selectedItem.fullName}&background=random&size=150`} alt="Pic" style={{ borderRadius: '10px', width: '120px' }} />
                                <div>
                                    <h2 style={{ margin: 0 }}>{selectedItem.fullName}</h2>
                                    <p style={{ color: '#007bff', fontSize: '18px', margin: '5px 0' }}>{selectedItem.position}</p>
                                    <span style={experienceBadge}>{selectedItem.experience} Experience</span>
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                                <FaEdit style={{ cursor: 'pointer', fontSize: '22px', color: '#007bff' }} onClick={() => handleEditClick(selectedItem)} />
                                <FaTrash style={{ cursor: 'pointer', fontSize: '20px', color: '#dc3545' }} onClick={() => handleDelete(selectedItem.id, selectedItem.fullName)} />
                                <FaTimes style={{ cursor: 'pointer', fontSize: '22px', color: '#666' }} onClick={() => setSelectedItem(null)} />
                            </div>
                        </div>
                        <hr style={{ margin: '20px 0' }} />
                        <div style={infoGridStyle}>
                            <div style={infoBox}><h4><FaGraduationCap /> Education</h4><p>{selectedItem.education}</p></div>
                            <div style={infoBox}><h4><FaBriefcase /> Experience</h4><p>{selectedItem.experience}</p></div>
                            <div style={infoBox}><h4><FaEnvelope /> Email</h4><p>{selectedItem.email}</p></div>
                            <div style={infoBox}><h4><FaPhoneAlt /> Contact</h4><p>{selectedItem.contact}</p></div>
                            <div style={infoBox}><h4><FaIdCard /> Login ID</h4><p>{selectedItem.loginId}</p></div>
                            <div style={infoBox}><h4><FaLock /> Password</h4><p>{selectedItem.password}</p></div>
                        </div>
                        <button style={closeBtnStyle} onClick={() => setSelectedItem(null)}>Close Details</button>
                    </div>
                </div>
            )}

            {/* --- ADD / EDIT MODALS --- */}
            {(showAddModal || showEditModal) && (
                <div style={modalOverlayStyle}>
                    <div style={{...modalContentStyle, width: '600px'}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>{showEditModal ? 'Edit' : 'Add New'} {activeTab === 'labStaff' ? 'Staff' : 'Report'}</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => { setShowAddModal(false); setShowEditModal(false); }} />
                        </div>
                        <form onSubmit={showEditModal ? handleUpdateSubmit : handleAddSubmit} style={{ marginTop: '15px' }}>
                            <div style={activeTab === 'labStaff' ? editGrid : {display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                {activeTab === 'labStaff' ? (
                                    <>
                                        <div style={inputGroup}><label>Full Name</label><input type="text" name="fullName" value={showEditModal ? editFormData.fullName || '' : addFormData.fullName} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                        {/* 🔥 Position Dropdown added here */}
                                        <div style={inputGroup}>
                                            <label>Position</label>
                                            <select 
                                                name="position" 
                                                value={showEditModal ? editFormData.position || '' : addFormData.position} 
                                                onChange={(e) => handleFormChange(e, !showEditModal)} 
                                                style={inputStyle} 
                                                required
                                            >
                                                <option value="Lab-Staff">Lab-Staff</option>
                                                <option value="Lab-Head">Lab-Head</option>
                                            </select>
                                        </div>
                                        <div style={inputGroup}><label>Age</label><input type="number" name="age" value={showEditModal ? editFormData.age || '' : addFormData.age} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                        <div style={inputGroup}><label>Contact</label><input type="text" name="contact" value={showEditModal ? editFormData.contact || '' : addFormData.contact} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                        <div style={inputGroup}><label>Email</label><input type="email" name="email" value={showEditModal ? editFormData.email || '' : addFormData.email} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                        <div style={inputGroup}><label>Education</label><input type="text" name="education" value={showEditModal ? editFormData.education || '' : addFormData.education} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                        <div style={inputGroup}><label>Experience</label><input type="text" name="experience" value={showEditModal ? editFormData.experience || '' : addFormData.experience} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                        <div style={inputGroup}><label>Login ID</label><input type="text" name="loginId" value={showEditModal ? editFormData.loginId || '' : addFormData.loginId} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                        <div style={inputGroup}><label>Password</label><input type="text" name="password" value={showEditModal ? editFormData.password || '' : addFormData.password} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                    </>
                                ) : (
                                    <>
                                        <div style={inputGroup}><label>Report Name</label><input type="text" name="reportName" value={showEditModal ? editFormData.reportName || '' : addFormData.reportName} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                        <div style={inputGroup}><label>Fees</label><input type="number" name="reportFees" value={showEditModal ? editFormData.reportFees || '' : addFormData.reportFees} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                    </>
                                )}
                            </div>
                            <button type="submit" style={updateBtnStyle}>{showEditModal ? 'Update' : 'Add'}</button>
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
const logoArea = { display: 'flex', alignItems: 'center', gap: '12px', marginRight: '50px' };
const navItemsContainer = { display: 'flex', gap: '5px', height: '100%' };
const navItemStyle = { padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', height: '100%', color: '#bdc3c7', fontSize: '15px', borderBottom: '3px solid transparent' };
const activeNavItemStyle = { ...navItemStyle, color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', borderBottom: '3px solid #007bff' };
const addBtnContainer = { position: 'absolute', top: '0px', right: '30px', zIndex: 10 };
const roundAddBtn = { height: '50px', borderRadius: '25px', padding: '0 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', gap: '10px' };
const cardGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', overflow: 'hidden' };
const imageStyle = { width: '100%', height: '200px', objectFit: 'cover' };
const eduBadgeStyle = { fontSize: '13px', color: '#666', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const experienceBadge = { backgroundColor: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: '20px', fontSize: '14px' };
const infoGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const infoBox = { padding: '10px', borderBottom: '1px solid #f1f1f1' };
const closeBtnStyle = { marginTop: '25px', width: '100%', padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const editGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' };
const updateBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '700px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' };

export default Laboratory;