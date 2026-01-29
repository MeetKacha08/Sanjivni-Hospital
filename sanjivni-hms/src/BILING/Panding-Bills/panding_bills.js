import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileInvoiceDollar, FaUserAlt, FaCalendarCheck } from 'react-icons/fa';

const Pandingbills = () => {
    const [pendingBills, setPendingBills] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/pendingBills')
            .then(res => setPendingBills(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #8e44ad', paddingBottom: '10px' }}>
                <FaFileInvoiceDollar /> Pending Patient Bills
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {pendingBills.map(bill => (
                    <div key={bill.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}><FaUserAlt color="#8e44ad" /> {bill.fullName}</h3>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}><b>ID:</b> {bill.id}</p>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}><b>Discharged:</b> {bill.dischargeDate}</p>
                        <hr />
                        <button style={{ width: '100%', padding: '10px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            Generate Final Bill
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pandingbills;