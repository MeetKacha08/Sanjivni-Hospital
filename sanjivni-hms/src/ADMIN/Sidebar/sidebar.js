import '../Sidebar/sidebar.css';
import { FaCalendarCheck, FaUserInjured, FaUserMd, FaFlask, FaBed, FaFileInvoiceDollar,} from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
const Sidebar = () => {

    return (
        <div className="sidebar-component">
            {/* --- SIDEBAR --- */}
            <aside className="sidebar">
                {/* <div className="sidebar-header">
                    <h3>Admin Panel</h3>
                </div> */}
                <ul className="sidebar-menu">
                    <li onClick={() => Navigate('/admin')}>
                        <FaCalendarCheck className="icon" /> Appointments
                    </li>
                    <li onClick={() => Navigate('/admin/patients')}>
                        <FaUserInjured className="icon" /> Patients
                    </li>
                    <li onClick={() => Navigate('/admin/doctors')}>
                        <FaUserMd className="icon" /> Doctors
                    </li>
                    <li onClick={() => Navigate('/admin/lab')}>
                        <FaFlask className="icon" /> Laboratory
                    </li>
                    <li onClick={() => Navigate('/admin/admit')}>
                        <FaBed className="icon" /> Admit
                    </li>
                    <li onClick={() => Navigate('/admin/billing')}>
                        <FaFileInvoiceDollar className="icon" /> Billing
                    </li>
                </ul>
            </aside>
        </div>
    );
};
export default Sidebar;