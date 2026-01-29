// import React, { useState } from 'react';
// import axios from 'axios'; 
// import { FaUserPlus, FaMicroscope, FaLock, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa'; 

// const Staffmanagement = () => {
//     // State to handle authentication
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [credentials, setCredentials] = useState({ id: '', password: '' });
//     const [showPassword, setShowPassword] = useState(false);

//     // Handle input changes for login
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setCredentials({ ...credentials, [name]: value });
//     };

//     // 🔥 Logic to check credentials and Position
//     const handleLogin = async (e) => {
//         e.preventDefault();
        
//         try {
//             // Fetch labStaff array from db.json
//             const response = await axios.get('http://localhost:5000/labStaff');
//             const labStaffList = response.data;

//             // 1. Find the user with matching loginId and password
//             const user = labStaffList.find(
//                 (staff) => staff.loginId === credentials.id && staff.password === credentials.password
//             );

//             if (user) {
//                 // 2. 🔥 Check if the user's position is specifically "Lab-Head"
//                 if (user.position === "Lab-Head") {
//                     setIsAuthenticated(true);
//                 } else {
//                     // Access denied for Lab-Staff or other positions
//                     alert(`Access Denied: ${user.fullName}, you are a ${user.position}. Only a Lab-Head can access this page.`);
//                 }
//             } else {
//                 alert("Incorrect Login ID or Password!");
//             }
//         } catch (error) {
//             console.error("Error fetching staff data:", error);
//             alert("System error: Could not verify credentials.");
//         }
//     };

//     // If not authenticated, show the login form inside the page layout
//     if (!isAuthenticated) {
//         return (
//             <div style={loginContainerStyle}>
//                 <div style={loginCardStyle}>
//                     <div style={lockCircleStyle}>
//                         <FaUserShield size={32} color="#3498db" />
//                     </div>
//                     <h2 style={{ ...titleStyle, marginBottom: '10px', fontSize: '22px' }}>Lab-Head Access Only</h2>
//                     <p style={{ ...subtitleStyle, marginBottom: '25px' }}>Management credentials required</p>
                    
//                     <form onSubmit={handleLogin} style={formStyle}>
//                         <div style={inputGroupStyle}>
//                             <input
//                                 type="text"
//                                 name="id"
//                                 placeholder="Login ID"
//                                 style={loginInputStyle}
//                                 value={credentials.id}
//                                 onChange={handleInputChange}
//                                 required
//                             />
//                         </div>
                        
//                         <div style={{ ...inputGroupStyle, position: 'relative' }}>
//                             <input
//                                 type={showPassword ? "text" : "password"} 
//                                 name="password"
//                                 placeholder="Password"
//                                 style={loginInputStyle}
//                                 value={credentials.password}
//                                 onChange={handleInputChange}
//                                 required
//                             />
//                             <div 
//                                 onClick={() => setShowPassword(!showPassword)} 
//                                 style={eyeIconStyle}
//                             >
//                                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//                             </div>
//                         </div>

//                         <button type="submit" style={loginButtonStyle}>
//                             Verify Position
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         );
//     }

//     // Actual page content (only shown if authenticated as Lab-Head)
//     return (
//         <div style={containerStyle}>
//             {/* Header Section */}
//             <div style={headerCardStyle}>
//                 <div style={leftSectionStyle}>
//                     <h2 style={titleStyle}>Staff Management</h2>
//                     <p style={subtitleStyle}>Manage laboratory staff roles and permissions</p>
//                 </div>
                
//                 <div style={rightSectionStyle}>
//                     <button 
//                         style={addButtonStyle} 
//                         onClick={() => alert("Add Staff logic here")}
//                     >
//                         <FaUserPlus style={{ marginRight: '8px' }} /> Add Staff
//                     </button>
                    
//                     <div style={iconCircleStyle}>
//                         <FaMicroscope color="#3498db" size={24} />
//                     </div>
//                 </div>
//             </div>

//             <div style={{ padding: '20px' }}>
//                 <div style={{ backgroundColor: '#e8f4fd', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #3498db' }}>
//                     <h3 style={{ margin: 0, color: '#2c3e50' }}>Authorized: Lab-Head Access</h3>
//                     <p style={{ margin: '5px 0 0 0', color: '#546e7a' }}>You can now view and manage the staff registry.</p>
//                 </div>
//                 {/* Your Staff List Table goes here */}
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---

// const containerStyle = {
//     padding: '30px',
//     backgroundColor: '#f4f7f6',
//     minHeight: '100vh'
// };

// const headerCardStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: '25px 30px',
//     borderRadius: '12px',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
//     marginBottom: '30px'
// };

// const leftSectionStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '5px'
// };

// const titleStyle = {
//     margin: 0,
//     color: '#2c3e50',
//     fontSize: '24px',
//     fontWeight: '700'
// };

// const subtitleStyle = {
//     margin: 0,
//     color: '#7f8c8d',
//     fontSize: '14px'
// };

// const rightSectionStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '20px'
// };

// const addButtonStyle = {
//     backgroundColor: '#3498db',
//     color: 'white',
//     border: 'none',
//     padding: '10px 20px',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontWeight: '600',
//     fontSize: '14px',
//     display: 'flex',
//     alignItems: 'center',
//     transition: 'background-color 0.3s',
//     boxShadow: '0 2px 6px rgba(52, 152, 219, 0.3)'
// };

// const iconCircleStyle = {
//     backgroundColor: '#e1f5fe',
//     width: '50px',
//     height: '50px',
//     borderRadius: '50%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center'
// };

// const loginContainerStyle = {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '80vh', 
//     width: '100%',     
//     backgroundColor: 'transparent' 
// };

// const loginCardStyle = {
//     backgroundColor: 'white',
//     padding: '40px',
//     borderRadius: '16px',
//     boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//     textAlign: 'center',
//     width: '100%',
//     maxWidth: '380px',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center'
// };

// const lockCircleStyle = {
//     backgroundColor: '#e1f5fe',
//     width: '60px',
//     height: '60px',
//     borderRadius: '50%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: '20px'
// };

// const formStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '18px',
//     width: '100%'
// };

// const inputGroupStyle = {
//     width: '100%'
// };

// const loginInputStyle = {
//     width: '100%',
//     padding: '12px 15px',
//     borderRadius: '8px',
//     border: '1px solid #ced4da',
//     fontSize: '15px',
//     outline: 'none',
//     boxSizing: 'border-box',
//     transition: 'border-color 0.2s',
//     backgroundColor: '#f8f9fa'
// };

// const eyeIconStyle = {
//     position: 'absolute',
//     right: '15px',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     cursor: 'pointer',
//     color: '#6c757d',
//     display: 'flex',
//     alignItems: 'center'
// };

// const loginButtonStyle = {
//     backgroundColor: '#3498db',
//     color: 'white',
//     border: 'none',
//     padding: '13px',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontWeight: '600',
//     fontSize: '16px',
//     marginTop: '5px',
//     transition: 'all 0.3s ease',
//     boxShadow: '0 4px 10px rgba(52, 152, 219, 0.2)'
// };

// export default Staffmanagement;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaUserPlus, FaMicroscope, FaEye, FaEyeSlash, FaUserShield, 
    FaGraduationCap, FaBriefcase, FaEnvelope, FaPhoneAlt, FaIdCard, 
    FaLock, FaEdit, FaTrash, FaTimes 
} from 'react-icons/fa';

const Staffmanagement = () => {
    // --- AUTH STATES ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [credentials, setCredentials] = useState({ id: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // --- CRUD STATES (Moved from Laboratory.js) ---
    const [staffList, setStaffList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const initialStaffState = { 
        fullName: '', age: '', contact: '', email: '', 
        education: '', experience: '', loginId: '', 
        password: '', position: 'Lab-Staff' 
    };
    const [addFormData, setAddFormData] = useState(initialStaffState);
    const [editFormData, setEditFormData] = useState({});

    // --- AUTH HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/labStaff');
            const labStaffList = response.data;
            const user = labStaffList.find(
                (staff) => staff.loginId === credentials.id && staff.password === credentials.password
            );

            if (user) {
                if (user.position === "Lab-Head") {
                    setIsAuthenticated(true);
                    setCurrentUser(user);
                    fetchStaffData(); // Load data immediately upon login
                } else {
                    alert(`Access Denied: ${user.fullName}, you are a ${user.position}. Only a Lab-Head can access this page.`);
                }
            } else {
                alert("Incorrect Login ID or Password!");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("System error.");
        }
    };

    // --- CRUD HANDLERS (Moved from Laboratory.js) ---
    const fetchStaffData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/labStaff');
            setStaffList(res.data);
        } catch (err) {
            console.log("Error fetching staff", err);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await axios.delete(`http://localhost:5000/labStaff/${id}`);
                alert("Deleted successfully!");
                setSelectedItem(null);
                fetchStaffData();
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
            await axios.put(`http://localhost:5000/labStaff/${editFormData.id}`, editFormData);
            alert("Updated successfully!");
            setShowEditModal(false);
            setSelectedItem(editFormData);
            fetchStaffData();
        } catch (error) { console.error(error); }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/labStaff', addFormData);
            alert("Added successfully!");
            setShowAddModal(false);
            setAddFormData(initialStaffState);
            fetchStaffData();
        } catch (error) { console.error(error); }
    };

    // --- RENDER: LOGIN SCREEN ---
    if (!isAuthenticated) {
        return (
            <div style={loginContainerStyle}>
                <div style={loginCardStyle}>
                    <div style={lockCircleStyle}>
                        <FaUserShield size={32} color="#3498db" />
                    </div>
                    <h2 style={{ ...titleStyle, marginBottom: '10px', fontSize: '22px' }}>Lab-Head Access</h2>
                    <p style={{ ...subtitleStyle, marginBottom: '25px' }}>Please login to manage staff</p>
                    
                    <form onSubmit={handleLogin} style={formStyle}>
                        <div style={inputGroupStyle}>
                            <input type="text" name="id" placeholder="Login ID" style={loginInputStyle} value={credentials.id} onChange={handleInputChange} required />
                        </div>
                        <div style={{ ...inputGroupStyle, position: 'relative' }}>
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" style={loginInputStyle} value={credentials.password} onChange={handleInputChange} required />
                            <div onClick={() => setShowPassword(!showPassword)} style={eyeIconStyle}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        <button type="submit" style={loginButtonStyle}>Verify Position</button>
                    </form>
                </div>
            </div>
        );
    }

    // --- RENDER: DASHBOARD (Authorized) ---
    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerCardStyle}>
                <div style={leftSectionStyle}>
                    <h2 style={titleStyle}>Staff Management</h2>
                    <p style={subtitleStyle}>Welcome, {currentUser?.fullName} (Lab-Head)</p>
                </div>
                <div style={rightSectionStyle}>
                    <button style={addButtonStyle} onClick={() => setShowAddModal(true)}>
                        <FaUserPlus style={{ marginRight: '8px' }} /> Add Staff
                    </button>
                    <div style={iconCircleStyle}>
                        <FaMicroscope color="#3498db" size={24} />
                    </div>
                </div>
            </div>

            {/* Staff Grid */}
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

            {/* Details Modal */}
            {selectedItem && !showEditModal && (
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

            {/* Add/Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div style={modalOverlayStyle}>
                    <div style={{...modalContentStyle, width: '600px'}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>{showEditModal ? 'Edit Staff' : 'Add New Staff'}</h3>
                            <FaTimes style={{ cursor: 'pointer' }} onClick={() => { setShowAddModal(false); setShowEditModal(false); }} />
                        </div>
                        <form onSubmit={showEditModal ? handleUpdateSubmit : handleAddSubmit} style={{ marginTop: '15px' }}>
                            <div style={editGrid}>
                                <div style={inputGroup}><label>Full Name</label><input type="text" name="fullName" value={showEditModal ? editFormData.fullName : addFormData.fullName} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                <div style={inputGroup}>
                                    <label>Position</label>
                                    <select name="position" value={showEditModal ? editFormData.position : addFormData.position} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required>
                                        <option value="Lab-Staff">Lab-Staff</option>
                                        <option value="Lab-Head">Lab-Head</option>
                                    </select>
                                </div>
                                <div style={inputGroup}><label>Age</label><input type="number" name="age" value={showEditModal ? editFormData.age : addFormData.age} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Contact</label><input type="text" name="contact" value={showEditModal ? editFormData.contact : addFormData.contact} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Email</label><input type="email" name="email" value={showEditModal ? editFormData.email : addFormData.email} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Education</label><input type="text" name="education" value={showEditModal ? editFormData.education : addFormData.education} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Experience</label><input type="text" name="experience" value={showEditModal ? editFormData.experience : addFormData.experience} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Login ID</label><input type="text" name="loginId" value={showEditModal ? editFormData.loginId : addFormData.loginId} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                                <div style={inputGroup}><label>Password</label><input type="text" name="password" value={showEditModal ? editFormData.password : addFormData.password} onChange={(e) => handleFormChange(e, !showEditModal)} style={inputStyle} required /></div>
                            </div>
                            <button type="submit" style={updateBtnStyle}>{showEditModal ? 'Update Staff' : 'Add Staff'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES (Consolidated) ---
const containerStyle = { padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' };
const headerCardStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '25px 30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' };
const leftSectionStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
const titleStyle = { margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' };
const subtitleStyle = { margin: 0, color: '#7f8c8d', fontSize: '14px' };
const rightSectionStyle = { display: 'flex', alignItems: 'center', gap: '20px' };
const addButtonStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 6px rgba(52, 152, 219, 0.3)' };
const iconCircleStyle = { backgroundColor: '#e1f5fe', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const loginContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', width: '100%', backgroundColor: 'transparent' };
const loginCardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const lockCircleStyle = { backgroundColor: '#e1f5fe', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' };
const inputGroupStyle = { width: '100%' };
const loginInputStyle = { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '15px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8f9fa' };
const eyeIconStyle = { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6c757d', display: 'flex', alignItems: 'center' };
const loginButtonStyle = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '13px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', marginTop: '5px', boxShadow: '0 4px 10px rgba(52, 152, 219, 0.2)' };
// Grid & Card Styles
const cardGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', overflow: 'hidden' };
const imageStyle = { width: '100%', height: '200px', objectFit: 'cover' };
const eduBadgeStyle = { fontSize: '13px', color: '#666', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
// Modal Styles
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '700px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' };
const experienceBadge = { backgroundColor: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: '20px', fontSize: '14px' };
const infoGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const infoBox = { padding: '10px', borderBottom: '1px solid #f1f1f1' };
const closeBtnStyle = { marginTop: '25px', width: '100%', padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const editGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' };
const updateBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' };

export default Staffmanagement;