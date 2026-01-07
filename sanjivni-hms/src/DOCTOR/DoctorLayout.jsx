import { Outlet } from 'react-router-dom';
import Doc_sidebar from './Doc-Sidebar/doc_sidebar.js';
import Doc_header from './Doc-Header/doc_header.js';
import './DoctorLayout.css';

const DoctorLayout = () => {
  return (
    <div className="doctor-layout">
      <Doc_header />

      <div className="doctor-body">
        <Doc_sidebar />
        <div className="doctor-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;
