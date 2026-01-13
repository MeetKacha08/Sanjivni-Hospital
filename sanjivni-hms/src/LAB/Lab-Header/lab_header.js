import '../Lab-Header/lab_header.css';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of Navigate

const Lab_header = () => {
    const navigate = useNavigate(); // Initialize the navigate hook

    const handleLogout = () => {
        // 1. Clear the authentication data from localStorage
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAuthenticated');

        // 2. Redirect the user to the login page
        navigate('/login');
    };

    return (
        <div className="header-component">
            {/* --- NAVBAR --- */}
            <nav className="admin-navbar">
                <div className="nav-left">
                    <div className="logo-container">
                        <img src="https://via.placeholder.com/40" alt="Logo" className="hospital-logo" />
                        <span className="logo-text">SANJIVNI <span className="logo-sub">LAB</span></span>
                    </div>
                </div>

                <div className="nav-center">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search patients, records..." />
                    </div>
                </div>

                <div className="nav-right">
                    <div className="user-profile">
                        <button className="profile-btn" onClick={() => alert("Profile Settings")}>
                            <FaUserCircle size={28} />
                            <span className="user-name">Admin</span>
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

export default Lab_header;