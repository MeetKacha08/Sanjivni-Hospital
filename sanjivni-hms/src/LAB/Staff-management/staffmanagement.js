// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // 🔥 Added axios for fetching data
// import { FaUserPlus, FaMicroscope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; 

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

//     // 🔥 Updated login verification logic to check against labStaff data
//     const handleLogin = async (e) => {
//         e.preventDefault();
        
//         try {
//             // Fetch the labStaff list from your db.json via axios
//             const response = await axios.get('http://localhost:5000/labStaff');
//             const labStaffList = response.data;

//             // Check if any staff member matches the entered credentials
//             const validUser = labStaffList.find(
//                 (staff) => staff.loginId === credentials.id && staff.password === credentials.password
//             );

//             if (validUser) {
//                 setIsAuthenticated(true);
//             } else {
//                 alert("Access Denied: Incorrect Login ID or Password!");
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
//                         <FaLock size={24} color="#3498db" />
//                     </div>
//                     <h2 style={{ ...titleStyle, marginBottom: '10px', fontSize: '22px' }}>Staff Access Required</h2>
//                     <p style={{ ...subtitleStyle, marginBottom: '25px' }}>Please enter lab staff credentials to manage staff</p>
                    
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
//                             Verify Identity
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         );
//     }

//     // Actual page content (only shown if authenticated)
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
//                 <h3>Staff List</h3>
//                 <p>Welcome! You have authorized access to manage staff records.</p>
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

// // --- LOGIN STYLES ---

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

import React, { useState } from 'react';
import axios from 'axios'; 
import { FaUserPlus, FaMicroscope, FaLock, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa'; 

const Staffmanagement = () => {
    // State to handle authentication
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [credentials, setCredentials] = useState({ id: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    // Handle input changes for login
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    // 🔥 Logic to check credentials and Position
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            // Fetch labStaff array from db.json
            const response = await axios.get('http://localhost:5000/labStaff');
            const labStaffList = response.data;

            // 1. Find the user with matching loginId and password
            const user = labStaffList.find(
                (staff) => staff.loginId === credentials.id && staff.password === credentials.password
            );

            if (user) {
                // 2. 🔥 Check if the user's position is specifically "Lab-Head"
                if (user.position === "Lab-Head") {
                    setIsAuthenticated(true);
                } else {
                    // Access denied for Lab-Staff or other positions
                    alert(`Access Denied: ${user.fullName}, you are a ${user.position}. Only a Lab-Head can access this page.`);
                }
            } else {
                alert("Incorrect Login ID or Password!");
            }
        } catch (error) {
            console.error("Error fetching staff data:", error);
            alert("System error: Could not verify credentials.");
        }
    };

    // If not authenticated, show the login form inside the page layout
    if (!isAuthenticated) {
        return (
            <div style={loginContainerStyle}>
                <div style={loginCardStyle}>
                    <div style={lockCircleStyle}>
                        <FaUserShield size={32} color="#3498db" />
                    </div>
                    <h2 style={{ ...titleStyle, marginBottom: '10px', fontSize: '22px' }}>Lab-Head Access Only</h2>
                    <p style={{ ...subtitleStyle, marginBottom: '25px' }}>Management credentials required</p>
                    
                    <form onSubmit={handleLogin} style={formStyle}>
                        <div style={inputGroupStyle}>
                            <input
                                type="text"
                                name="id"
                                placeholder="Login ID"
                                style={loginInputStyle}
                                value={credentials.id}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div style={{ ...inputGroupStyle, position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                placeholder="Password"
                                style={loginInputStyle}
                                value={credentials.password}
                                onChange={handleInputChange}
                                required
                            />
                            <div 
                                onClick={() => setShowPassword(!showPassword)} 
                                style={eyeIconStyle}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        <button type="submit" style={loginButtonStyle}>
                            Verify Position
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Actual page content (only shown if authenticated as Lab-Head)
    return (
        <div style={containerStyle}>
            {/* Header Section */}
            <div style={headerCardStyle}>
                <div style={leftSectionStyle}>
                    <h2 style={titleStyle}>Staff Management</h2>
                    <p style={subtitleStyle}>Manage laboratory staff roles and permissions</p>
                </div>
                
                <div style={rightSectionStyle}>
                    <button 
                        style={addButtonStyle} 
                        onClick={() => alert("Add Staff logic here")}
                    >
                        <FaUserPlus style={{ marginRight: '8px' }} /> Add Staff
                    </button>
                    
                    <div style={iconCircleStyle}>
                        <FaMicroscope color="#3498db" size={24} />
                    </div>
                </div>
            </div>

            <div style={{ padding: '20px' }}>
                <div style={{ backgroundColor: '#e8f4fd', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #3498db' }}>
                    <h3 style={{ margin: 0, color: '#2c3e50' }}>Authorized: Lab-Head Access</h3>
                    <p style={{ margin: '5px 0 0 0', color: '#546e7a' }}>You can now view and manage the staff registry.</p>
                </div>
                {/* Your Staff List Table goes here */}
            </div>
        </div>
    );
};

// --- STYLES ---

const containerStyle = {
    padding: '30px',
    backgroundColor: '#f4f7f6',
    minHeight: '100vh'
};

const headerCardStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '25px 30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '30px'
};

const leftSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
};

const titleStyle = {
    margin: 0,
    color: '#2c3e50',
    fontSize: '24px',
    fontWeight: '700'
};

const subtitleStyle = {
    margin: 0,
    color: '#7f8c8d',
    fontSize: '14px'
};

const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
};

const addButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 6px rgba(52, 152, 219, 0.3)'
};

const iconCircleStyle = {
    backgroundColor: '#e1f5fe',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const loginContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh', 
    width: '100%',     
    backgroundColor: 'transparent' 
};

const loginCardStyle = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const lockCircleStyle = {
    backgroundColor: '#e1f5fe',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    width: '100%'
};

const inputGroupStyle = {
    width: '100%'
};

const loginInputStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    backgroundColor: '#f8f9fa'
};

const eyeIconStyle = {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#6c757d',
    display: 'flex',
    alignItems: 'center'
};

const loginButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '13px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    marginTop: '5px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(52, 152, 219, 0.2)'
};

export default Staffmanagement;