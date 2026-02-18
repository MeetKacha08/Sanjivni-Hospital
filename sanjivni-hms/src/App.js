import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ================= Website =================
import Home from './Website/Home/Home';
import Register from './Website/RegisterByDoc.js/register';

// ================= Reception =================
import ReceptionLayout from './Reception/ReceptionLayout';
import Receptiondashboard from './Reception/Reception-Dashboard/Receptiondashboard';
import Newpatient from './Reception/New-Patient/new_patient';
import OnlinePatient from './Reception/Online-Appoinments/onlline_patient';
import Oldpatients from './Reception/Old-Patients/oldpatients';
import Admitrequest from './Reception/Admit-Request/admitrequest';
import Roomstatus from './Reception/Room-Status/roomstatus';
import Admitedpatients from './Reception/Admited-Patients/admitedpatients';

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
// import Esalary from './ADMIN/Employee-Salary/esalary';

// ================= Doctor =================
import DoctorLayout from './DOCTOR/DoctorLayout';
import DoctorDashboard from './DOCTOR/Doc-Dashboard/dashboard';
import Pandingpatient from './DOCTOR/Panding-Patient/pandingpatient';
import Mypatient from './DOCTOR/My-Patient/mypatient';
import Allpatients from './DOCTOR/All-Patients/allpatients';
import Admitedpatient from './DOCTOR/Admited-Patient/admitedpatient';
import Surgerybooking from './DOCTOR/Surgery-Booking/surgerybooking';

// ================= Laboratry =================
import LabLayout from './LAB/LabLayout';
import LabDashboard from './LAB/Lab-Dashboard/LabDashboard';
import Pandingrequest from './LAB/Panding-Request/pandingrequest';
import Staffmanagement from './LAB/Staff-management/staffmanagement';
import Labreport from './LAB/Lab-Report/labreports';

// ================= Billing =================
import BillLayout from './BILING/BillLayout';
import BillingDashboard from './BILING/Biling-Dashboard/BilingDashboard';
import Pandingbills from './BILING/Panding-Bills/panding_bills';
import Admited_Patients from './BILING/Admited-Patients/admited_patients';

// ================= Auth =================
import Login from './Login';


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

        {/* ================= Reception Dashboards ================= */}
        <Route
          path="/reception"
          element={
            <ProtectedRoute allowedRole="reception">
              <ReceptionLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="receptiondashboard" replace />} />

          <Route path="receptiondashboard" element={<Receptiondashboard />} />
          <Route path='newpatient' element={<Newpatient/>}/>
          <Route path='onlinepatient' element={<OnlinePatient/>}/>
          <Route path='oldpatients' element={<Oldpatients/>}/>
          <Route path='admitrequests' element={<Admitrequest/>}/>
          <Route path='roomstatus' element={<Roomstatus/>}/>
          <Route path='admited-patients' element={<Admitedpatients/>}/>
        </Route>

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
          {/* <Route path='esalary' element={<Esalary/>}/> */}
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
          <Route path='allpatients' element={<Allpatients />} />
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
          <Route path='pending-requests' element={<Pandingrequest/>}/>
          <Route path='lab-staff' element={<Staffmanagement/>}/>
          <Route path='lab-report' element={<Labreport/>}/>
        </Route>

        {/* ================= Billing Dashboards ================= */}
        <Route
          path="/billing"
          element={
            <ProtectedRoute allowedRole="billing">
              <BillLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="billdashboard" replace/>} />
          <Route path='billdashboard' element={<BillingDashboard/>}/>
          <Route path='pendingbills' element={<Pandingbills/>}/>
          <Route path='admitedpatients' element={<Admited_Patients/>}/>
        </Route>

        {/* ================= Fallback ================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;

