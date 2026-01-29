import { Outlet } from 'react-router-dom';
import Rec_sidebar from './Sidebar/Rec_sidebar';
import Rec_header from './Header/Rec_header';
import './ReceptionLayout.css';

const ReceptionLayout = () => {
  return (
    <div className="reception-layout">
      <Rec_header />

      <div className="reception-body">
        <Rec_sidebar />
        <div className="reception-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ReceptionLayout;
