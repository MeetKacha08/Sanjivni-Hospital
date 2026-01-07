import '../Lab-Sidebar/Lab_sidebar.css';
import {
  FaCalendarCheck,
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

        </ul>
      </aside>
    </div>
  );
};

export default Lab_sidebar;

