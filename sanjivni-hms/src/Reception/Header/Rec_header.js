import React, { useState } from 'react';
import './Rec_header.css';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Removed FaUserCircle
import { useNavigate } from 'react-router-dom';
import sanjivniLogo from './sanjivni_full_logo.png';

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
                        <img src={sanjivniLogo} alt="Sanjivni City Hospital Logo" className="hospital-logo" />                        
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
                        {/* Removed the profile button and divider */}
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

// --- STYLES FOR LONG SEARCH BAR ---

const centerWrapper = {
    flex: 2, 
    display: 'flex',
    justifyContent: 'center',
    padding: '0 20px'
};

const headerSearchContainer = { 
    display: 'flex', 
    alignItems: 'center', 
    backgroundColor: '#f1f4f8', 
    padding: '10px 20px', 
    borderRadius: '25px', 
    width: '100%', 
    maxWidth: '700px', 
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