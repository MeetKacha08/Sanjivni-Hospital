import '../Bill-Sidebar/bill_sidebar.css';
import {
  FaCalendarCheck,
  FaUserInjured,
  FaUserMd,
  FaFlask,
  FaBed,
  FaFileInvoiceDollar,
  FaDoorClosed,
  FaSyringe,
  FaRupeeSign
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

const Bill_sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-component">
      <aside className="sidebar">
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/billing/billdashboard')}>
            <FaCalendarCheck className="icon" /> Dashboard
          </li>
          <li onClick={() => navigate('/billing/pendingbills')}>
            <FaRupeeSign className="icon" /> Panding-Bills
          </li>
          {/*<li onClick={() => navigate('/bill/mypatient')}>
            <FaUserInjured className="icon" /> My Patients
          </li>
          <li onClick={() => navigate('/bill/admitedpatient')}>
            <FaBed className="icon" /> Admited Patient
          </li>
           <li onClick={() => navigate('/bill/surgerybooking')}>
            <FaSyringe className="icon" /> Surgery
          </li> */}

        </ul>
      </aside>
    </div>
  );
};

export default Bill_sidebar;

