import { Outlet } from 'react-router-dom';
import Bill_sidebar from './Bill-Sidebar/bill_sidebar.js';
import Bill_header from './Bill-Header/bill_header.js';
import './BillLayout.css';

const BillLayout = () => {
  return (
    <div className="bill-layout">
      <Bill_header />

      <div className="bill-body">
        <Bill_sidebar />
        <div className="bill-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BillLayout;
