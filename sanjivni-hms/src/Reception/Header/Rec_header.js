import './Rec_header.css';
import React, { useState } from 'react';
import { FaSearch, FaUserCircle, FaTimes } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const Rec_header = ({ onSearchChange }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    return (
        <div className="header-component">
            <nav className="admin-navbar">
                <div className="nav-left">
                    <div className="logo-container">
                        <img src="https://via.placeholder.com/40" alt="Logo" className="hospital-logo" />
                        <span className="logo-text">SANJIVNI <span className="logo-sub">LAB</span></span>
                    </div>
                </div>

                {/* --- LONG SEARCH BAR --- */}
                <div className="nav-center" style={centerWrapper}>
                    <div style={headerSearchContainer}>
                        <FaSearch style={{ color: '#95a5a6' }} />
                        <input 
                            type="text" 
                            placeholder="Search patients, records, or departments..." 
                            style={searchInputStyle}
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        {searchTerm && (
                            <FaTimes 
                                style={{ cursor: 'pointer', color: '#bdc3c7', marginLeft: '10px' }} 
                                onClick={() => {setSearchTerm(''); onSearchChange('');}} 
                            />
                        )}
                    </div>
                </div>

                <div className="nav-right">
                    <div className="user-profile">
                        <button className="profile-btn" onClick={() => alert("Profile Settings")}>
                            <FaUserCircle size={28} />
                            <span className="user-name">Reception</span>
                        </button>
                        <div className="divider"></div>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

// --- UPDATED STYLES FOR LONG SEARCH BAR ---

const centerWrapper = {
    flex: 2, // Allows the center section to grow much larger than left/right
    display: 'flex',
    justifyContent: 'center',
    padding: '0 20px'
};

const headerSearchContainer = { 
    display: 'flex', 
    alignItems: 'center', 
    backgroundColor: '#f1f4f8', 
    padding: '10px 20px', // Slightly more padding for the longer bar
    borderRadius: '25px', 
    width: '100%', // Take full width of the wrapper
    maxWidth: '700px', // 🔥 Increased from 350px to 700px for a long look
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease'
};

const searchInputStyle = { 
    border: 'none', 
    outline: 'none', 
    marginLeft: '12px', 
    width: '100%', 
    fontSize: '15px', 
    background: 'transparent' 
};

export default Rec_header;