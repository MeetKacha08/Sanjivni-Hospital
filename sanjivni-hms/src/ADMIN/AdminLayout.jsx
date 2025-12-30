import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/sidebar';
import Header from './Header/header';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Header />

      <div className="admin-body">
        <Sidebar />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
