import '../Doc-Sidebar/doc_sidebar.css';
import {
  FaCalendarCheck,
  FaUserInjured,
  FaUserMd,
  FaFlask,
  FaBed,
  FaFileInvoiceDollar,
  FaDoorClosed,
  FaSyringe
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

const Doc_sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-component">
      <aside className="sidebar">
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/doctor/doctordashboard')}>
            <FaCalendarCheck className="icon" /> Dashboard
          </li>
          <li onClick={() => navigate('/doctor/pandingpatient')}>
            <FaUserInjured className="icon" /> Panding Patients
          </li>
          <li onClick={() => navigate('/doctor/mypatient')}>
            <FaUserInjured className="icon" /> My Patients
          </li>
          <li onClick={() => navigate('/doctor/admitedpatient')}>
            <FaBed className="icon" /> Admited Patient
          </li>
           <li onClick={() => navigate('/doctor/surgerybooking')}>
            <FaSyringe className="icon" /> Surgery
          </li>


          {/* <li onClick={() => navigate('/admin/pandingpatients')}>
            <FaUserInjured className="icon" /> pandingpatients
          </li>
          <li onClick={() => navigate('/doctor/pandingpatients')}>
            <FaCalendarCheck className="icon" /> Appointments
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
          </li> */}
        </ul>
      </aside>
    </div>
  );
};

export default Doc_sidebar;

