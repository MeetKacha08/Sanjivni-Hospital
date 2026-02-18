// import '../Doc-Header/doc_header';
// import { FaSearch, FaUserCircle } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of Navigate
// import sanjivniLogo from '../Doc-Header/sanjivni_full_logo.png';

// const Doc_header = () => {
//     const navigate = useNavigate(); // Initialize the navigate hook

//     const handleLogout = () => {
//         // 1. Clear the authentication data from localStorage
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('isAuthenticated');

//         // 2. Redirect the user to the login page
//         navigate('/login');
//     };

//     return (
//         <div className="header-component">
//             {/* --- NAVBAR --- */}
//             <nav className="admin-navbar">
//                 <div className="nav-left">
//                     <div className="logo-container">
//                         <img src={sanjivniLogo} alt="Sanjivni City Hospital Logo" className="hospital-logo" />
//                     </div>
//                 </div>

//                 <div className="nav-center">
//                     <div className="search-box">
//                         <FaSearch className="search-icon" />
//                         <input type="text" placeholder="Search patients, records..." />
//                     </div>
//                 </div>

//                 <div className="nav-right">
//                     <div className="user-profile">
//                         <button className="profile-btn" onClick={() => alert("Profile Settings")}>
//                             <FaUserCircle size={28} />
//                             <span className="user-name">Admin</span>
//                         </button>
//                         <div className="divider"></div>
//                         <button onClick={handleLogout} className="logout-btn">
//                             Logout
//                         </button>
//                     </div>
//                 </div>
//             </nav>
//         </div>
//     );
// };

// export default Doc_header;

import '../Doc-Header/doc_header.css'; 
import { FaSearch } from 'react-icons/fa'; // Removed FaUserCircle
import { useNavigate } from 'react-router-dom'; 
import sanjivniLogo from '../Doc-Header/sanjivni_full_logo.png';

const Doc_header = () => {
    const navigate = useNavigate(); 

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
                        <img src={sanjivniLogo} alt="Sanjivni City Hospital Logo" className="hospital-logo" />
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
                        {/* Profile button and divider removed from here */}
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Doc_header;