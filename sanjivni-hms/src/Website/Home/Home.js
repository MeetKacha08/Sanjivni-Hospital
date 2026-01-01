// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Home.css'; // Import the CSS file here

// const Home = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="home-container">
//       {/* Navbar */}
//       <nav className="navbar">
//         <div className="nav-logo">City Hospital</div>
//         <div className="nav-buttons">
//           <button onClick={() => navigate('/login')} className="login-btn">
//             Login
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="hero-section">
//         <h1>Care You Can Trust</h1>
//         <p>
//           Our hospital provides 24/7 emergency services, specialized doctors, 
//           and advanced laboratory facilities to ensure your health is in good hands.
//         </p>
//         <button onClick={() => navigate('/book-user-appointment')} className="appointment-btn">Book an Appointment</button>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">City Hospital</div>
        <div className="nav-buttons">
          <button onClick={() => navigate('/login')} className="login-btn">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Care You Can Trust</h1>
        <p>
          Our hospital provides 24/7 emergency services, specialized doctors, 
          and advanced laboratory facilities to ensure your health is in good hands.
        </p>
        {/* CHANGED: Navigate to /register instead of book-user-appointment */}
        <button onClick={() => navigate('/register')} className="appointment-btn">
          Book an Appointment
        </button>
      </div>
    </div>
  );
};

export default Home;