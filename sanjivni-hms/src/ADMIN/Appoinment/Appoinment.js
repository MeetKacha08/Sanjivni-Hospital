import '../Appoinment/Appoinment.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes, FaUserCircle, FaCheck, FaTrashAlt } from 'react-icons/fa';

const Appoinment = () => {
    const [list, setList] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = () => {
        axios.get('http://localhost:5000/appointments')
            .then(res => setList(res.data))
            .catch(err => console.log(err));
    };

    // --- DELETE ALL FUNCTIONALITY ---
    const handleDeleteAll = async () => {
        if (list.length === 0) {
            alert("No appointments to delete.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete ALL pending appointments? This action cannot be undone.");
        
        if (confirmDelete) {
            try {
                // Delete each item from the server
                const deleteRequests = list.map(item => 
                    axios.delete(`http://localhost:5000/appointments/${item.id}`)
                );
                
                await Promise.all(deleteRequests);
                
                // Clear local UI state
                setList([]);
                alert("All appointments deleted successfully!");
            } catch (error) {
                console.error("Error deleting all appointments:", error);
                alert("An error occurred while deleting appointments.");
            }
        }
    };

    // --- ACCEPT AND MOVE TO PATIENTS ---
    const handleAccept = async (e, patient) => {
        e.stopPropagation(); // Stop the popup from opening
        const confirmAccept = window.confirm(`Do you want to accept ${patient.fullName} as a patient?`);
        
        if (confirmAccept) {
            try {
                // 1. Add to patients collection
                await axios.post('http://localhost:5000/patients', {
                    ...patient,
                    status: "Accepted",
                    admittedDate: new Date().toLocaleDateString()
                });

                // 2. Remove from appointments collection
                await axios.delete(`http://localhost:5000/appointments/${patient.id}`);

                // 3. Update local UI state
                setList(list.filter(item => item.id !== patient.id));
                alert("Patient moved to Patients list successfully!");
            } catch (error) {
                console.error("Error processing acceptance:", error);
                alert("Failed to accept patient.");
            }
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh', position: 'relative' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Pending Appointments</h3>
                
                {/* DELETE ALL BUTTON */}
                <button 
                    onClick={handleDeleteAll} 
                    style={deleteAllBtnStyle}
                    title="Delete All Appointments"
                >
                    <FaTrashAlt style={{ marginRight: '8px' }} /> Delete All
                </button>
            </div>

            <div style={cardContainerStyle}>
                {list.map((item) => (
                    <div key={item.id} style={cardStyle} onClick={() => setSelectedPatient(item)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaUserCircle size={30} color="#007bff" />
                                <h4 style={{ margin: 0 }}>{item.fullName}</h4>
                            </div>
                            
                            <button 
                                onClick={(e) => handleAccept(e, item)} 
                                style={acceptBtnStyle}
                                title="Accept Patient"
                            >
                                <FaCheck />
                            </button>
                        </div>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>{item.department} Dept</p>
                    </div>
                ))}
            </div>

            {selectedPatient && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#2c3e50' }}>Patient Details</h2>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setSelectedPatient(null)} />
                        </div>

                        <div style={infoGrid}>
                            <div style={infoBox}><strong>Name:</strong> {selectedPatient.fullName}</div>
                            <div style={infoBox}><strong>Age:</strong> {selectedPatient.age}</div>
                            <div style={infoBox}><strong>Contact:</strong> {selectedPatient.contact}</div>
                            <div style={infoBox}><strong>Dept:</strong> {selectedPatient.department}</div>
                        </div>

                        <button style={closeBtn} onClick={() => setSelectedPatient(null)}>Close Details</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const deleteAllBtnStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    transition: '0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const acceptBtnStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: '0.3s'
};

const cardContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' };
const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', borderLeft: '5px solid #007bff' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '500px' };
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const infoBox = { padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' };
const closeBtn = { marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#34495e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default Appoinment;