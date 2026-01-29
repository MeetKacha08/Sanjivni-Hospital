import './Rec_sidebar.css';
import {
  FaCalendarCheck,
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

const Rec_sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-component">
      <aside className="sidebar">
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/reception/receptiondashboard')}>
            <FaCalendarCheck className="icon" /> Dashboard
          </li>

          <li onClick={() => navigate('/reception/newpatient')}>
            <FaCalendarCheck className="icon" /> New-Patient
          </li>

          <li onClick={() => navigate('/reception/onlinepatient')}>
            <FaCalendarCheck className="icon" /> Online-Appointments
          </li>

          <li onClick={() => navigate('/reception/oldpatients')}>
            <FaCalendarCheck className="icon" /> Old-Patients
          </li>

          <li onClick={() => navigate('/reception/admitrequests')}>
            <FaCalendarCheck className="icon" /> Admit-Requests
          </li>

          <li onClick={() => navigate('/reception/admited-patients')}>
            <FaCalendarCheck className="icon" /> Admited-Patients
          </li>

          <li onClick={() => navigate('/reception/roomstatus')}>
            <FaCalendarCheck className="icon" /> Room-Status
          </li>
          
        </ul>
      </aside>
    </div>
  );
};

export default Rec_sidebar;