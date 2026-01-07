import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaFileInvoice, FaCheckCircle, FaUserAlt } from 'react-icons/fa';

const Billing = () => {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = () => {
        axios.get('http://localhost:5000/bills')
            .then(res => setBills(res.data))
            .catch(err => console.log(err));
    };

    const handlePayBill = async (billId) => {
        try {
            // Option: Either delete the bill or update status to 'Paid'
            // Here we delete it from the pending bills list after payment
            await axios.delete(`http://localhost:5000/bills/${billId}`);
            alert("Bill Paid Successfully! Receipt has been generated.");
            fetchBills();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '3px solid #28a745', paddingBottom: '10px' }}>
                <FaMoneyBillWave /> Patient Billing & Invoices
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px', marginTop: '30px' }}>
                {bills.length > 0 ? (
                    bills.map((bill) => (
                        <div key={bill.id} style={invoiceCard}>
                            <div style={invoiceHeader}>
                                <span><FaUserAlt /> {bill.fullName}</span>
                                <span style={billIdTag}>#INV-{bill.id}</span>
                            </div>
                            
                            <div style={invoiceBody}>
                                <div style={billRow}><span>Doctor Consultancy:</span> <span>₹ {bill.consultancyFees}</span></div>
                                <div style={billRow}><span>Room Rent ({bill.roomType || 'N/A'}):</span> <span>₹ {bill.roomRent}</span></div>
                                <hr />
                                <div style={billRow}><span>Subtotal:</span> <span>₹ {bill.consultancyFees + bill.roomRent}</span></div>
                                <div style={billRow}><span>GST (5%):</span> <span>₹ {bill.gst.toFixed(2)}</span></div>
                                <div style={{ ...billRow, fontWeight: 'bold', fontSize: '18px', color: '#2d3748', marginTop: '10px' }}>
                                    <span>Total Payable:</span> <span>₹ {bill.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={() => handlePayBill(bill.id)} style={payBtnStyle}>
                                <FaCheckCircle /> Bill Paid
                            </button>
                            <p style={{ textAlign: 'center', fontSize: '11px', color: '#7f8c8d', marginTop: '10px' }}>
                                Generated on: {bill.generatedAt}
                            </p>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px' }}>
                        <FaFileInvoice size={50} color="#cbd5e0" />
                        <p style={{ color: '#718096', marginTop: '10px' }}>No pending bills found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- STYLES ---
const invoiceCard = {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
};

const invoiceHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#2c3e50',
    borderBottom: '1px dashed #cbd5e0',
    paddingBottom: '10px',
    marginBottom: '15px'
};

const billIdTag = { fontSize: '12px', color: '#3182ce', backgroundColor: '#ebf8ff', padding: '2px 8px', borderRadius: '5px' };

const invoiceBody = { marginBottom: '20px' };

const billRow = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#4a5568',
    marginBottom: '8px'
};

const payBtnStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: '0.3s'
};

export default Billing;