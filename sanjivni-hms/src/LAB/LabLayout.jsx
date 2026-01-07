import { Outlet } from 'react-router-dom';
import Lab_sidebar from './Lab-Sidebar/lab_sidebar.js';
import Lab_header from './Lab-Header/lab_header.js';
import './LabLayout.css';

const LabLayout = () => {
  return (
    <div className="lab-layout">
      <Lab_header />

      <div className="lab-body">
        <Lab_sidebar />
        <div className="lab-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LabLayout;
