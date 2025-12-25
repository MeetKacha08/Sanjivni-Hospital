import './header.css';
import {FaSearch, FaUserCircle } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';

const Header = () => {

    return (
        <div className="header-component">
            {/* --- NAVBAR --- */}
            <nav className="admin-navbar">
                <div className="nav-left">
                    <img src="https://via.placeholder.com/40" alt="Logo" className="hospital-logo" />
                </div>

                <div className="nav-center">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search patients, records..." />
                    </div>
                </div>

                <div className="nav-right">
                    <button className="profile-btn" onClick={() => alert("Profile Settings")}>
                        <FaUserCircle size={30} />
                    </button>
                    <button onClick={Navigate('/login')} className="logout-link">Logout</button>
                </div>
            </nav>
        </div>
    );
};
export default Header;