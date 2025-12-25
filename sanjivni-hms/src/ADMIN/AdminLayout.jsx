import Header from "./Header/header";
import Sidebar from "./Sidebar/sidebar";


const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout">
            <Header />
            <Sidebar />
        </div>
    );
};

export default AdminLayout;