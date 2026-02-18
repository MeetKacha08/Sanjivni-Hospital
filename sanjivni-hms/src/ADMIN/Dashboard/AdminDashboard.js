import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { 
  FaUserMd, 
  FaUserInjured, 
  FaCalendarCheck, 
  FaMicroscope, 
  FaFileMedicalAlt, 
  FaProcedures,
  FaBed
} from 'react-icons/fa';

const AdminDashboard = () => {
    // State to store all our counts
    const [stats, setStats] = useState({
        appointments: 0,
        doctors: 0,
        patients: 0,
        labStaff: 0,
        reports: 0,
        totalBeds: 0,
        availableBeds: 0
    });

    // Fetch data when component loads and set up polling
    useEffect(() => {
        fetchAllData();
        // Poll the server every 5 seconds to keep counts live
        const intervalId = setInterval(() => {
            fetchAllData();
        }, 5000); 

        return () => clearInterval(intervalId);
    }, []);

    const fetchAllData = async () => {
        try {
            // Fetch everything at once for better performance
            const [apptsRes, docsRes, patientsRes, staffRes, reportsRes, roomsRes] = await Promise.all([
                axios.get('http://localhost:5000/appointments'),
                axios.get('http://localhost:5000/doctors'),
                axios.get('http://localhost:5000/patients'),
                axios.get('http://localhost:5000/labStaff'),
                axios.get('http://localhost:5000/reports'),
                axios.get('http://localhost:5000/rooms')
            ]);

            // Calculate Bed Availability
            const roomsData = roomsRes.data;
            let totalBedsCount = 0;
            let occupiedBedsCount = 0;

            roomsData.forEach(room => {
                totalBedsCount += room.capacity;
                occupiedBedsCount += room.roomList.filter(bed => bed.status === "Occupied").length;
            });

            // Update state with the lengths of the arrays
            setStats({
                appointments: apptsRes.data.length,
                doctors: docsRes.data.length,
                patients: patientsRes.data.length,
                labStaff: staffRes.data.length,
                reports: reportsRes.data.length,
                totalBeds: totalBedsCount,
                availableBeds: totalBedsCount - occupiedBedsCount
            });

        } catch (error) {
            console.error("Error fetching dashboard statistics:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Hospital Overview</h2>
                <p>Live statistics and total counts across all departments.</p>
            </div>

            <div className="dashboard-grid">
                
                {/* Pending Appointments */}
                <div className="stat-card card-orange">
                    <div className="icon-wrapper">
                        <FaCalendarCheck />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.appointments}</h3>
                        <p>Pending Appointments</p>
                    </div>
                </div>

                {/* Permanent Patients */}
                <div className="stat-card card-green">
                    <div className="icon-wrapper">
                        <FaUserInjured />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.patients}</h3>
                        <p>Registered Patients</p>
                    </div>
                </div>

                {/* Doctors */}
                <div className="stat-card card-blue">
                    <div className="icon-wrapper">
                        <FaUserMd />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.doctors}</h3>
                        <p>Specialized Doctors</p>
                    </div>
                </div>

                {/* Lab Staff */}
                <div className="stat-card card-purple">
                    <div className="icon-wrapper">
                        <FaMicroscope />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.labStaff}</h3>
                        <p>Laboratory Staff</p>
                    </div>
                </div>

                {/* Lab Reports */}
                <div className="stat-card card-teal">
                    <div className="icon-wrapper">
                        <FaFileMedicalAlt />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.reports}</h3>
                        <p>Available Lab Reports</p>
                    </div>
                </div>

                {/* Bed Availability */}
                <div className="stat-card card-red">
                    <div className="icon-wrapper">
                        <FaProcedures />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.availableBeds} <span className="small-text">/ {stats.totalBeds}</span></h3>
                        <p>Available Beds</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;