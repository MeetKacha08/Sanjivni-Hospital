// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // User Import Components
// import Home from './Website/Home/Home';
// // Admin Import Components
// import AdminLayout from './ADMIN/AdminLayout';
// import AdminDashboard from './ADMIN/Dashboard/AdminDashboard';
// import UserAppointment from './ADMIN/Appoinment/UserAppointment';
// import Patients from './ADMIN/Patient/Patients';
// import Doctors from './ADMIN/Doctor/Doctors';
// import Laboratory from './ADMIN/Lab/Laboratory';
// import Admit from './ADMIN/Admit/Admit';
// import Billing from './ADMIN/Biling/Billing';
// // End Admin Import Components

// import Login from './Login';
// import DoctorDashboard from './DOCTOR/DoctorDashboard';
// import LabDashboard from './LAB/LabDashboard';
// import BilingDashboard from './BILING/BilingDashboard';
// import Appoinment from './ADMIN/Appoinment/Appoinment';

// // Helper to check access
// const ProtectedRoute = ({ children, allowedRole }) => {
//   const userRole = localStorage.getItem('userRole');
//   const isAuth = localStorage.getItem('isAuthenticated');

//   if (!isAuth || userRole !== allowedRole) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* ========================== Website Routs ==============================*/}
//         <Route path="/" element={<Home />} />


//         {/* ========================== Admin Route================================= */}
//         <Route path="/book-user-appointment" element={<UserAppointment />} />
//         <Route path='admin' element={<AdminLayout />}>
//           <Route path='/admin/admindashboard' element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
//           <Route path="/admin/appointments" element={<ProtectedRoute allowedRole="admin"><Appoinment /></ProtectedRoute>} />
//           <Route path="/admin/patients" element={<ProtectedRoute allowedRole="admin"><Patients /></ProtectedRoute>} />
//           <Route path="/admin/doctors" element={<ProtectedRoute allowedRole="admin"><Doctors /></ProtectedRoute>} />
//           <Route path="/admin/lab" element={<ProtectedRoute allowedRole="admin"><Laboratory /></ProtectedRoute>} />
//           <Route path="/admin/admit" element={<ProtectedRoute allowedRole="admin"><Admit /></ProtectedRoute>} />
//           <Route path="/admin/billing" element={<ProtectedRoute allowedRole="admin"><Billing /></ProtectedRoute>} />
//         </Route>
//         {/* End */}

//         {/* ========================= Dashboard Routs ============================ */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/admin" element={
//           <ProtectedRoute allowedRole="admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />

//         <Route path="/doctor" element={
//           <ProtectedRoute allowedRole="doctor">
//             <DoctorDashboard />
//           </ProtectedRoute>
//         } />

//         <Route path="/lab" element={
//           <ProtectedRoute allowedRole="lab">
//             <LabDashboard />
//           </ProtectedRoute>
//         } />

//         <Route path="/billing" element={
//           <ProtectedRoute allowedRole="billing">
//             <BilingDashboard />
//           </ProtectedRoute>
//         } />

//         <Route path="*" element={<Navigate to="/" />} />
//         {/* End */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ================= Website =================
import Home from './Website/Home/Home';

// ================= Admin =================
import AdminLayout from './ADMIN/AdminLayout';
import AdminDashboard from './ADMIN/Dashboard/AdminDashboard';
import UserAppointment from './ADMIN/Appoinment/UserAppointment';
import Appoinment from './ADMIN/Appoinment/Appoinment';
import Patients from './ADMIN/Patient/Patients';
import Doctors from './ADMIN/Doctor/Doctors';
import Laboratory from './ADMIN/Lab/Laboratory';
import Admit from './ADMIN/Admit/Admit';
import Billing from './ADMIN/Biling/Billing';

// ================= Auth =================
import Login from './Login';

// ================= Dashboards =================
import DoctorDashboard from './DOCTOR/DoctorDashboard';
import LabDashboard from './LAB/LabDashboard';
import BilingDashboard from './BILING/BilingDashboard';

// ================= Protected Route =================
const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');
  const isAuth = localStorage.getItem('isAuthenticated');

  if (!isAuth || userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= Website Routes ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ================= User Appointment ================= */}
        <Route path="/book-user-appointment" element={<UserAppointment />} />

        {/* ================= Admin Routes ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Default Admin Route */}
          <Route index element={<Navigate to="admindashboard" replace />} />

          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="appointments" element={<Appoinment />} />
          <Route path="patients" element={<Patients />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="lab" element={<Laboratory />} />
          <Route path="admit" element={<Admit />} />
          <Route path="billing" element={<Billing />} />
        </Route>

        {/* ================= Other Dashboards ================= */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lab"
          element={
            <ProtectedRoute allowedRole="lab">
              <LabDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute allowedRole="billing">
              <BilingDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= Fallback ================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;

