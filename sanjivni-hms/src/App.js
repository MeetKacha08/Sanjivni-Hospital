import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ================= Website =================
import Home from './Website/Home/Home';
import Register from './Website/RegisterByDoc.js/register';

// ================= Admin =================
import AdminLayout from './ADMIN/AdminLayout';
import AdminDashboard from './ADMIN/Dashboard/AdminDashboard';
import UserAppointment from './ADMIN/Appoinment/UserAppointment';
import Appoinment from './ADMIN/Appoinment/Appoinment';
import Patients from './ADMIN/Patient/Patients';
import Doctors from './ADMIN/Doctor/Doctors';
import Laboratory from './ADMIN/Lab/Laboratory';
import Admit from './ADMIN/Admit/Admit';
import Room from './ADMIN/Room/room';
import Billing from './ADMIN/Biling/Billing';
import Surgery from './ADMIN/Surgery/surgery';


// ================= Doctor =================
import DoctorLayout from './DOCTOR/DoctorLayout';
import DoctorDashboard from './DOCTOR/Doc-Dashboard/dashboard';
import Pandingpatient from './DOCTOR/Panding-Patient/pandingpatient';
import Mypatient from './DOCTOR/My-Patient/mypatient';
import Admitedpatient from './DOCTOR/Admited-Patient/admitedpatient';
import Surgerybooking from './DOCTOR/Surgery-Booking/surgerybooking';

// ================= Laboratry =================
import LabLayout from './LAB/LabDashboard';
import LabDashboard from './LAB/LabDashboard';


// ================= Auth =================
import Login from './Login';

// ================= Dashboards =================
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
        <Route path="/register" element={<Register />} />
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
          <Route path="room" element={<Room />} />
          <Route path="billing" element={<Billing />} />
          <Route path='surgery' element={<Surgery />} />
        </Route>

        {/* ================= Doctor Routes ================= */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="doctordashboard" replace />} />

          <Route path='doctordashboard' element={<DoctorDashboard />} />
          <Route path='pandingpatient' element={<Pandingpatient />} />
          <Route path='mypatient' element={<Mypatient />} />
          <Route path='admitedpatient' element={<Admitedpatient />} />
          <Route path='surgerybooking' element={<Surgerybooking />} />
        </Route>

        {/* ================= Laboratry Routes ================= */}

        <Route
          path="/lab"
          element={
            <ProtectedRoute allowedRole="lab">
              <LabLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="labdashboard" replace />} />

          <Route path='labdashboard' element={<LabDashboard/>}/>
        </Route>

        {/* ================= Other Dashboards ================= */}
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

