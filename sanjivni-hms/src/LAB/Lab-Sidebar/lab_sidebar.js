import '../Lab-Sidebar/lab_sidebar.css';
import {
  FaCalendarCheck,
  FaHourglassHalf, // 🔥 Added icon for Pending Requests
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

const Lab_sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-component">
      <aside className="sidebar">
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/lab/labdashboard')}>
            <FaCalendarCheck className="icon" /> Dashboard
          </li>
          
          {/* 🔥 Added Pending Requests field */}
          <li onClick={() => navigate('/lab/pending-requests')}>
            <FaHourglassHalf className="icon" /> Pending Requests
          </li>

        </ul>
      </aside>
    </div>
  );
};

export default Lab_sidebar;