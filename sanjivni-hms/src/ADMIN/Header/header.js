import React from 'react';
import './header.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import sanjivniLogo from '../Header/sanjivni_full_logo.png';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <div className="header-component">
            {/* --- NAVBAR --- */}
            <nav className="admin-navbar">
                <div className="nav-left">
                    <div className="logo-container">
                        <img src={sanjivniLogo} alt="Sanjivni City Hospital Logo" className="hospital-logo" />
                    </div>
                </div>

                <div className="nav-center">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        {/* Updated placeholder text here */}
                        <input type="text" placeholder="Search patients, records, or departments..." />
                    </div>
                </div>

                <div className="nav-right">
                    <div className="user-profile">
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;