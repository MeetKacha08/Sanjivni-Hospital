import '../Sidebar/sidebar.css';
import {
  FaCalendarCheck,
  FaUserInjured,
  FaUserMd,
  FaFlask,
  FaBed,
  FaFileInvoiceDollar,
  FaBroom,
  FaDoorClosed,
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-component">
      <aside className="sidebar">
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/admin/admindashboard')}>
            <FaCalendarCheck className="icon" /> Dashboard
          </li>
          <li onClick={() => navigate('/admin/appointments')}>
            <FaCalendarCheck className="icon" /> Appointments
          </li>
          <li onClick={() => navigate('/admin/patients')}>
            <FaUserInjured className="icon" /> Patients
          </li>
          <li onClick={() => navigate('/admin/doctors')}>
            <FaUserMd className="icon" /> Doctors
          </li>
          <li onClick={() => navigate('/admin/lab')}>
            <FaFlask className="icon" /> Laboratory
          </li>
          <li onClick={() => navigate('/admin/admit')}>
            <FaBed className="icon" /> Admit
          </li>
          <li onClick={() => navigate('/admin/room')}>
            <FaDoorClosed className="icon" /> Rooms
          </li>
          <li onClick={() => navigate('/admin/billing')}>
            <FaFileInvoiceDollar className="icon" /> Billing
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;

