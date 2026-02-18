// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaFileInvoiceDollar, FaUserAlt, FaStethoscope, FaBed, FaProcedures, FaMicroscope, FaArrowLeft, FaClock, FaCalendarCheck, FaCalendarTimes, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaVial, FaHospital } from 'react-icons/fa';

// const PendingBills = () => {
//     const [pendingBills, setPendingBills] = useState([]);
//     const [selectedBill, setSelectedBill] = useState(null);
//     const [paymentMode, setPaymentMode] = useState('Cash');

//     useEffect(() => {
//         axios.get('http://localhost:5000/pendingBills')
//             .then(res => {
//                 const actualBills = res.data.filter(b => b.patientId !== 'none');
//                 setPendingBills(actualBills);
//             })
//             .catch(err => console.log(err));
//     }, []);

//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         return dateString.split(',')[0];
//     };

//     // --- VIEW 1: Full Detailed Bill ---
//     if (selectedBill) {
//         const bill = selectedBill;
//         const dischargeDate = new Date().toLocaleDateString();

//         return (
//             <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//                 <button 
//                     onClick={() => setSelectedBill(null)} 
//                     style={{ ...actionBtn, width: 'auto', marginBottom: '20px', backgroundColor: '#6c757d', display: 'flex', alignItems: 'center', gap: '8px' }}
//                 >
//                     <FaArrowLeft /> Back to List
//                 </button>

//                 {/* --- HEADER PATIENT INFO --- */}
//                 <div style={{ ...cardStyle, marginBottom: '20px' }}>
//                     <div style={headerGrid}>
//                         <div style={infoSection}>
//                             <h3 style={sectionTitle}><FaUserAlt color="#8e44ad" /> Patient Information</h3>
//                             <p style={textStyle}><b>Patient ID:</b> {bill.patientId}</p>
//                             <p style={textStyle}><b>Name:</b> {bill.fullName}</p>
//                             <p style={textStyle}><b>Doctor:</b> Dr. {bill.doctorName}</p>
//                             <p style={textStyle}><b>Department:</b> {bill.department}</p>
//                         </div>
//                         <div style={billMetaSection}>
//                             <div style={{ textAlign: 'right' }}>
//                                 <h3 style={{ ...sectionTitle, justifyContent: 'flex-end' }}>Billing Summary</h3>
//                                 <p style={textStyle}><b>Bill ID:</b> #{bill.id}</p>
//                                 <p style={textStyle}><b>Billing Date:</b> {dischargeDate}</p>
//                                 <span style={statusBadge}>{bill.status.toUpperCase()}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* --- 1. CONSULTANCY FEES CARD --- */}
//                 <div style={{ ...cardStyle, marginBottom: '15px' }}>
//                     <h4 style={subHeaderStyle}><FaStethoscope color="#e67e22" /> 1. Consultancy Details</h4>
//                     <div style={flexSpace}>
//                         <p style={textStyle}>Doctor's Consultation ({bill.department})</p>
//                         <p style={{ fontWeight: 'bold' }}>₹{bill.consultancyFees}</p>
//                     </div>
//                 </div>

//                 {/* --- 2. LAB REPORTS CARD --- */}
//                 <div style={{ ...cardStyle, marginBottom: '15px' }}>
//                     <h4 style={subHeaderStyle}><FaVial color="#9b59b6" /> 2. Lab Reports Charges</h4>
//                     <table style={tableStyle}>
//                         <thead>
//                             <tr style={thRow}><th style={th}>Test Name</th><th style={th}>Rate</th><th style={th}>Total</th></tr>
//                         </thead>
//                         <tbody>
//                             {bill.services?.[0]?.["Lab Tests"]?.length > 0 ? (
//                                 bill.services[0]["Lab Tests"].map((l, i) => (
//                                     <tr key={i}>
//                                         <td style={td}>{l.testName}</td>
//                                         <td style={td}>₹{l.testFees}</td>
//                                         <td style={td}>₹{l.testFees}</td>
//                                     </tr>
//                                 ))
//                             ) : (<tr><td colSpan="3" style={td}>No Lab Reports</td></tr>)}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* --- 3. ADMIT DETAILS (ROOM) CARD --- */}
//                 <div style={{ ...cardStyle, marginBottom: '15px' }}>
//                     <h4 style={subHeaderStyle}><FaHospital color="#3498db" /> 3. Admit Details</h4>
//                     <table style={tableStyle}>
//                         <thead>
//                             <tr style={thRow}>
//                                 <th style={th}>Room Type</th>
//                                 <th style={th}>Duration</th>
//                                 <th style={th}>Days</th>
//                                 <th style={th}>Rate</th>
//                                 <th style={th}>Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {bill.services?.[0]?.room?.map((r, i) => (
//                                 <tr key={i}>
//                                     <td style={td}>{r.roomType}</td>
//                                     <td style={td}>
//                                         <div style={{ fontSize: '11px' }}>
//                                             In: {formatDate(bill.admissionTimestamp)} <br /> Out: {dischargeDate}
//                                         </div>
//                                     </td>
//                                     <td style={td}>{r.daysStayed}</td>
//                                     <td style={td}>₹{r.ratePerDay}</td>
//                                     <td style={td}>₹{r.amount}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* --- 4. SURGERY DETAILS CARD --- */}
//                 <div style={{ ...cardStyle, marginBottom: '15px' }}>
//                     <h4 style={subHeaderStyle}><FaProcedures color="#e74c3c" /> 4. Surgery Details</h4>
//                     <table style={tableStyle}>
//                         <thead>
//                             <tr style={thRow}><th style={th}>Procedure</th><th style={th}>Fees</th></tr>
//                         </thead>
//                         <tbody>
//                             {bill.services?.[0]?.Surgery?.length > 0 ? (
//                                 bill.services[0].Surgery.map((s, i) => (
//                                     <tr key={i}>
//                                         <td style={td}>{s.surgeryType}</td>
//                                         <td style={td}>₹{s.surgeryFees}</td>
//                                     </tr>
//                                 ))
//                             ) : (<tr><td colSpan="2" style={td}>No Surgery Conducted</td></tr>)}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* --- FINAL PAYMENT SECTION --- */}
//                 <div style={footerSection}>
//                     <div style={paymentMethodContainer}>
//                         <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '16px' }}>Select Payment Mode</h4>
//                         <div style={{ display: 'flex', gap: '20px' }}>
//                             <label style={radioLabel}>
//                                 <input type="radio" name="paymentMode" value="Cash" checked={paymentMode === 'Cash'} onChange={(e) => setPaymentMode(e.target.value)} />
//                                 <FaMoneyBillWave color="#38a169" /> Cash
//                             </label>
//                             <label style={radioLabel}>
//                                 <input type="radio" name="paymentMode" value="UPI" checked={paymentMode === 'UPI'} onChange={(e) => setPaymentMode(e.target.value)} />
//                                 <FaMobileAlt color="#3182ce" /> UPI
//                             </label>
//                             <label style={radioLabel}>
//                                 <input type="radio" name="paymentMode" value="Card" checked={paymentMode === 'Card'} onChange={(e) => setPaymentMode(e.target.value)} />
//                                 <FaCreditCard color="#e67e22" /> Card
//                             </label>
//                         </div>
//                     </div>

//                     <div style={totalBox}>
//                         <div style={flexSpace}><p>Subtotal:</p><p>₹{bill.totalAmount}</p></div>
//                         <div style={flexSpace}><p>GST ({bill.gst}):</p><p>₹{bill.gstAmount}</p></div>
//                         <hr />
//                         <div style={{ ...flexSpace, fontWeight: 'bold', fontSize: '18px', color: '#2c3e50' }}>
//                             <p>Grand Total:</p><p>₹{bill.grandTotal}</p>
//                         </div>
//                     </div>
//                 </div>
                
//                 <button style={actionBtn}>Collect Payment ({paymentMode}) & Discharge</button>
//             </div>
//         );
//     }

//     // --- VIEW 2: Summary Cards List ---
//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <h2 style={{ color: '#2c3e50', borderBottom: '3px solid #8e44ad', paddingBottom: '10px', marginBottom: '30px' }}>
//                 <FaFileInvoiceDollar /> Admitted Patients Billing Desk
//             </h2>

//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
//                 {pendingBills.length === 0 ? (
//                     <p style={{ color: '#7f8c8d' }}>No pending bills available.</p>
//                 ) : (
//                     pendingBills.map(bill => (
//                         <div 
//                             key={bill.id} 
//                             style={summaryCardStyle} 
//                             onClick={() => setSelectedBill(bill)}
//                             onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
//                             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                         >
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                                 <span style={{ fontSize: '12px', color: '#8e44ad', fontWeight: 'bold' }}>ID: {bill.patientId}</span>
//                                 <span style={{ ...statusBadge, margin: 0 }}>{bill.status.toUpperCase()}</span>
//                             </div>
//                             <h3 style={{ margin: '15px 0 5px 0', color: '#2c3e50', fontSize: '18px' }}>{bill.fullName}</h3>
//                             <p style={{ ...textStyle, marginBottom: '15px' }}>{bill.department} Dept.</p>
                            
//                             <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                 <div style={{ color: '#2c3e50', fontWeight: 'bold' }}>₹{bill.grandTotal}</div>
//                                 <div style={{ fontSize: '12px', color: '#95a5a6' }}><FaClock /> Pending</div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const subHeaderStyle = { margin: '0 0 15px 0', color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' };
// const paymentMethodContainer = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' };
// const radioLabel = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', color: '#4a5568', fontWeight: '500' };

// const summaryCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', cursor: 'pointer', transition: 'all 0.2s ease-in-out' };
// const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #e0e0e0' };
// const headerGrid = { display: 'grid', gridTemplateColumns: '1.5fr 1fr', paddingBottom: '10px' };
// const infoSection = { display: 'flex', flexDirection: 'column', gap: '5px' };
// const billMetaSection = { display: 'flex', justifyContent: 'flex-end' };
// const sectionTitle = { fontSize: '16px', color: '#8e44ad', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' };
// const textStyle = { margin: '2px 0', fontSize: '14px', color: '#555' };
// const statusBadge = { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #ffeeba', display: 'inline-block', marginTop: '10px' };

// const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '5px' };
// const thRow = { backgroundColor: '#f8f9fa' };
// const th = { textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6', color: '#333', fontSize: '13px' };
// const td = { padding: '10px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#444' };

// const footerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0' };
// const totalBox = { width: '300px' };
// const flexSpace = { display: 'flex', justifyContent: 'space-between', margin: '5px 0' };
// const actionBtn = { width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };

// export default PendingBills;

//////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaFileInvoiceDollar, FaUserAlt, FaStethoscope, FaBed, FaProcedures, FaMicroscope, FaArrowLeft, FaClock, FaCalendarCheck, FaCalendarTimes, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaVial, FaHospital } from 'react-icons/fa';

// const PendingBills = () => {
//     const [pendingBills, setPendingBills] = useState([]);
//     const [selectedBill, setSelectedBill] = useState(null);
//     const [paymentMode, setPaymentMode] = useState('Cash'); // State to track selected payment mode

//     useEffect(() => {
//         axios.get('http://localhost:5000/pendingBills')
//             .then(res => {
//                 const actualBills = res.data.filter(b => b.patientId !== 'none');
//                 setPendingBills(actualBills);
//             })
//             .catch(err => console.log(err));
//     }, []);

//     // Helper function to format the timestamp strings
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         return dateString.split(',')[0]; 
//     };

//     // --- VIEW 1: Full Detailed Bill ---
//     if (selectedBill) {
//         const bill = selectedBill;
//         const dischargeDate = new Date().toLocaleDateString();

//         // Calculate Lab Total
//         const labTotal = bill.services?.[0]?.["Lab Tests"]?.reduce((sum, l) => sum + parseInt(l.testFees), 0) || 0;
        
//         // Calculate Room Total
//         const roomTotal = bill.services?.[0]?.room?.reduce((sum, r) => sum + parseInt(r.amount), 0) || 0;
        
//         // Calculate Surgery Total
//         const surgeryTotal = bill.services?.[0]?.Surgery?.reduce((sum, s) => sum + parseInt(s.surgeryFees), 0) || 0;

//         return (
//             <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//                 <button 
//                     onClick={() => setSelectedBill(null)} 
//                     style={{ ...actionBtn, width: 'auto', marginBottom: '20px', backgroundColor: '#6c757d', display: 'flex', alignItems: 'center', gap: '8px' }}
//                 >
//                     <FaArrowLeft /> Back to List
//                 </button>

//                 {/* --- HEADER PATIENT INFO --- */}
//                 <div style={{ ...cardStyle, marginBottom: '20px' }}>
//                     <div style={headerGrid}>
//                         <div style={infoSection}>
//                             <h3 style={sectionTitle}><FaUserAlt color="#8e44ad" /> Patient Information</h3>
//                             <p style={textStyle}><b>Patient ID:</b> {bill.patientId}</p>
//                             <p style={textStyle}><b>Name:</b> {bill.fullName}</p>
//                             <p style={textStyle}><b>Doctor:</b> Dr. {bill.doctorName}</p>
//                             <p style={textStyle}><b>Department:</b> {bill.department}</p>
//                         </div>

//                         <div style={billMetaSection}>
//                             <div style={{ textAlign: 'right' }}>
//                                 <h3 style={{ ...sectionTitle, justifyContent: 'flex-end' }}>Billing Summary</h3>
//                                 <p style={textStyle}><b>Bill ID:</b> #{bill.id}</p>
//                                 <p style={textStyle}><b>Billing Date:</b> {dischargeDate}</p>
//                                 <span style={statusBadge}>{bill.status.toUpperCase()}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* --- 1. CONSULTANCY FEES CARD --- */}
//                 <div style={{ ...cardStyle, marginBottom: '15px' }}>
//                     <h4 style={subHeaderStyle}><FaStethoscope color="#e67e22" /> 1. Consultancy Details</h4>
//                     <div style={flexSpace}>
//                         <p style={textStyle}>Doctor's Consultation ({bill.department})</p>
//                         <p style={{ fontWeight: 'bold' }}>₹{bill.consultancyFees}</p>
//                     </div>
//                     <div style={sectionTotalStyle}>Section Total: ₹{bill.consultancyFees}</div>
//                 </div>

//                 {/* --- 2. LAB REPORTS CARD --- */}
//                 <div style={{ ...cardStyle, marginBottom: '15px' }}>
//                     <h4 style={subHeaderStyle}><FaVial color="#9b59b6" /> 2. Lab Reports Charges</h4>
//                     <table style={tableStyle}>
//                         <thead>
//                             <tr style={thRow}><th style={th}>Test Name</th><th style={th}>Rate</th><th style={th}>Total</th></tr>
//                         </thead>
//                         <tbody>
//                             {bill.services?.[0]?.["Lab Tests"]?.length > 0 ? (
//                                 bill.services[0]["Lab Tests"].map((l, i) => (
//                                     <tr key={i}>
//                                         <td style={td}>{l.testName}</td>
//                                         <td style={td}>₹{l.testFees}</td>
//                                         <td style={td}>₹{l.testFees}</td>
//                                     </tr>
//                                 ))
//                             ) : (<tr><td colSpan="3" style={td}>No Lab Reports</td></tr>)}
//                         </tbody>
//                     </table>
//                     <div style={sectionTotalStyle}>Section Total: ₹{labTotal}</div>
//                 </div>

//                 {/* --- 3. ADMIT DETAILS (ROOM) CARD --- */}
//                 <div style={{ ...cardStyle, marginBottom: '15px' }}>
//                     <h4 style={subHeaderStyle}><FaHospital color="#3498db" /> 3. Admit Details</h4>
//                     <table style={tableStyle}>
//                         <thead>
//                             <tr style={thRow}>
//                                 <th style={th}>Room Type</th>
//                                 <th style={th}>Duration</th>
//                                 <th style={th}>Days</th>
//                                 <th style={th}>Rate</th>
//                                 <th style={th}>Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {bill.services?.[0]?.room?.map((r, i) => (
//                                 <tr key={i}>
//                                     <td style={td}>{r.roomType}</td>
//                                     <td style={td}>
//                                         <div style={{ fontSize: '11px' }}>
//                                             In: {formatDate(bill.admissionTimestamp)} <br /> Out: {dischargeDate}
//                                         </div>
//                                     </td>
//                                     <td style={td}>{r.daysStayed}</td>
//                                     <td style={td}>₹{r.ratePerDay}</td>
//                                     <td style={td}>₹{r.amount}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <div style={sectionTotalStyle}>Section Total: ₹{roomTotal}</div>
//                 </div>

//                 {/* --- 4. SURGERY DETAILS CARD --- */}
//                 <div style={{ ...cardStyle, marginBottom: '15px' }}>
//                     <h4 style={subHeaderStyle}><FaProcedures color="#e74c3c" /> 4. Surgery Details</h4>
//                     <table style={tableStyle}>
//                         <thead>
//                             <tr style={thRow}><th style={th}>Procedure</th><th style={th}>Fees</th></tr>
//                         </thead>
//                         <tbody>
//                             {bill.services?.[0]?.Surgery?.length > 0 ? (
//                                 bill.services[0].Surgery.map((s, i) => (
//                                     <tr key={i}>
//                                         <td style={td}>{s.surgeryType}</td>
//                                         <td style={td}>₹{s.surgeryFees}</td>
//                                     </tr>
//                                 ))
//                             ) : (<tr><td colSpan="2" style={td}>No Surgery Conducted</td></tr>)}
//                         </tbody>
//                     </table>
//                     <div style={sectionTotalStyle}>Section Total: ₹{surgeryTotal}</div>
//                 </div>

//                 {/* --- FINAL PAYMENT SECTION --- */}
//                 <div style={footerSection}>
//                     <div style={paymentMethodContainer}>
//                         <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '16px' }}>Select Payment Mode</h4>
//                         <div style={{ display: 'flex', gap: '20px' }}>
//                             <label style={radioLabel}>
//                                 <input type="radio" name="paymentMode" value="Cash" checked={paymentMode === 'Cash'} onChange={(e) => setPaymentMode(e.target.value)} />
//                                 <FaMoneyBillWave color="#38a169" /> Cash
//                             </label>
//                             <label style={radioLabel}>
//                                 <input type="radio" name="paymentMode" value="UPI" checked={paymentMode === 'UPI'} onChange={(e) => setPaymentMode(e.target.value)} />
//                                 <FaMobileAlt color="#3182ce" /> UPI
//                             </label>
//                             <label style={radioLabel}>
//                                 <input type="radio" name="paymentMode" value="Card" checked={paymentMode === 'Card'} onChange={(e) => setPaymentMode(e.target.value)} />
//                                 <FaCreditCard color="#e67e22" /> Card
//                             </label>
//                         </div>
//                     </div>

//                     <div style={totalBox}>
//                         <div style={flexSpace}><p>Subtotal:</p><p>₹{bill.totalAmount}</p></div>
//                         <div style={flexSpace}><p>GST ({bill.gst}):</p><p>₹{bill.gstAmount}</p></div>
//                         <hr />
//                         <div style={{ ...flexSpace, fontWeight: 'bold', fontSize: '18px', color: '#2c3e50' }}>
//                             <p>Grand Total:</p><p>₹{bill.grandTotal}</p>
//                         </div>
//                     </div>
//                 </div>
                
//                 <button style={actionBtn}>Collect Payment ({paymentMode}) & Discharge</button>
//             </div>
//         );
//     }

//     // --- VIEW 2: Summary Cards List ---
//     return (
//         <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//             <h2 style={{ color: '#2c3e50', borderBottom: '3px solid #8e44ad', paddingBottom: '10px', marginBottom: '30px' }}>
//                 <FaFileInvoiceDollar /> Admitted Patients Billing Desk
//             </h2>

//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
//                 {pendingBills.length === 0 ? (
//                     <p style={{ color: '#7f8c8d' }}>No pending bills available.</p>
//                 ) : (
//                     pendingBills.map(bill => (
//                         <div 
//                             key={bill.id} 
//                             style={summaryCardStyle} 
//                             onClick={() => setSelectedBill(bill)}
//                             onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
//                             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                         >
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                                 <span style={{ fontSize: '12px', color: '#8e44ad', fontWeight: 'bold' }}>ID: {bill.patientId}</span>
//                                 <span style={{ ...statusBadge, margin: 0 }}>{bill.status.toUpperCase()}</span>
//                             </div>
//                             <h3 style={{ margin: '15px 0 5px 0', color: '#2c3e50', fontSize: '18px' }}>{bill.fullName}</h3>
//                             <p style={{ ...textStyle, marginBottom: '15px' }}>{bill.department} Dept.</p>
                            
//                             <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                 <div style={{ color: '#2c3e50', fontWeight: 'bold' }}>₹{bill.grandTotal}</div>
//                                 <div style={{ fontSize: '12px', color: '#95a5a6' }}><FaClock /> Pending</div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const sectionTotalStyle = { textAlign: 'right', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ddd', fontWeight: 'bold', color: '#2c3e50', fontSize: '15px' };
// const subHeaderStyle = { margin: '0 0 15px 0', color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' };
// const paymentMethodContainer = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' };
// const radioLabel = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', color: '#4a5568', fontWeight: '500' };

// const summaryCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', cursor: 'pointer', transition: 'all 0.2s ease-in-out' };
// const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #e0e0e0' };
// const headerGrid = { display: 'grid', gridTemplateColumns: '1.5fr 1fr', paddingBottom: '10px' };
// const infoSection = { display: 'flex', flexDirection: 'column', gap: '5px' };
// const billMetaSection = { display: 'flex', justifyContent: 'flex-end' };
// const sectionTitle = { fontSize: '16px', color: '#8e44ad', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' };
// const textStyle = { margin: '2px 0', fontSize: '14px', color: '#555' };
// const statusBadge = { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #ffeeba', display: 'inline-block', marginTop: '10px' };

// const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '5px' };
// const thRow = { backgroundColor: '#f8f9fa' };
// const th = { textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6', color: '#333', fontSize: '13px' };
// const td = { padding: '10px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#444' };

// const footerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0' };
// const totalBox = { width: '300px' };
// const flexSpace = { display: 'flex', justifyContent: 'space-between', margin: '5px 0' };
// const actionBtn = { width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };

// export default PendingBills;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileInvoiceDollar, FaUserAlt, FaStethoscope, FaBed, FaProcedures, FaMicroscope, FaArrowLeft, FaClock, FaCalendarCheck, FaCalendarTimes, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaVial, FaHospital } from 'react-icons/fa';

const PendingBills = () => {
    const [pendingBills, setPendingBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [paymentMode, setPaymentMode] = useState('Cash');

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = () => {
        axios.get('http://localhost:5000/pendingBills')
            .then(res => {
                const actualBills = res.data.filter(b => b.patientId !== 'none');
                setPendingBills(actualBills);
            })
            .catch(err => console.log(err));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dateString.split(',')[0]; 
    };

    // 🔥 UPDATED FUNCTION: Move data to history instead of permanent delete
    const handleCollectAndDischarge = async (bill) => {
        const dischargeDate = new Date().toLocaleDateString();

        if (!window.confirm(`Confirm payment of ₹${bill.grandTotal} via ${paymentMode} and discharge ${bill.fullName}?`)) {
            return;
        }

        try {
            // 1. Create a History Record (Archive)
            const historyRecord = {
                ...bill,
                status: "Paid",
                dischargeDate: dischargeDate,
                paymentMode: paymentMode,
                archivedAt: new Date().toLocaleString()
            };

            // 2. Save to 'oldpatients' collection (History)
            await axios.post(`http://localhost:5000/oldpatients`, historyRecord);

            // 3. Update status in the main 'patients' master list
            await axios.patch(`http://localhost:5000/patients/${bill.patientId}`, {
                status: "Discharged",
                dischargeDate: dischargeDate,
                finalBillId: bill.id
            });

            // 4. Remove from 'admitted' list (Required to make the bed Available again)
            await axios.delete(`http://localhost:5000/admitted/${bill.patientId}`);

            // 5. Remove from 'pendingBills' (Since it is now moved to history)
            await axios.delete(`http://localhost:5000/pendingBills/${bill.id}`);

            alert("Payment Collected & Patient Data Archived Successfully!");
            
            // 6. Reset UI
            setSelectedBill(null);
            fetchBills(); 
        } catch (err) {
            console.error("Discharge Error:", err);
            alert("Error during discharge. Check if 'oldpatients' route exists in db.json");
        }
    };

    // --- VIEW 1: Full Detailed Bill ---
    if (selectedBill) {
        const bill = selectedBill;
        const dischargeDate = new Date().toLocaleDateString();

        const labTotal = bill.services?.[0]?.["Lab Tests"]?.reduce((sum, l) => sum + parseInt(l.testFees), 0) || 0;
        const roomTotal = bill.services?.[0]?.room?.reduce((sum, r) => sum + parseInt(r.amount), 0) || 0;
        const surgeryTotal = bill.services?.[0]?.Surgery?.reduce((sum, s) => sum + parseInt(s.surgeryFees), 0) || 0;

        return (
            <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
                <button 
                    onClick={() => setSelectedBill(null)} 
                    style={{ ...actionBtn, width: 'auto', marginBottom: '20px', backgroundColor: '#6c757d', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FaArrowLeft /> Back to List
                </button>

                <div style={{ ...cardStyle, marginBottom: '20px' }}>
                    <div style={headerGrid}>
                        <div style={infoSection}>
                            <h3 style={sectionTitle}><FaUserAlt color="#8e44ad" /> Patient Information</h3>
                            <p style={textStyle}><b>Patient ID:</b> {bill.patientId}</p>
                            <p style={textStyle}><b>Name:</b> {bill.fullName}</p>
                            <p style={textStyle}><b>Doctor:</b> Dr. {bill.doctorName}</p>
                            <p style={textStyle}><b>Department:</b> {bill.department}</p>
                        </div>
                        <div style={billMetaSection}>
                            <div style={{ textAlign: 'right' }}>
                                <h3 style={{ ...sectionTitle, justifyContent: 'flex-end' }}>Billing Summary</h3>
                                <p style={textStyle}><b>Bill ID:</b> #{bill.id}</p>
                                <p style={textStyle}><b>Billing Date:</b> {dischargeDate}</p>
                                <span style={statusBadge}>{bill.status.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ ...cardStyle, marginBottom: '15px' }}>
                    <h4 style={subHeaderStyle}><FaStethoscope color="#e67e22" /> 1. Consultancy Details</h4>
                    <div style={flexSpace}>
                        <p style={textStyle}>Doctor's Consultation ({bill.department})</p>
                        <p style={{ fontWeight: 'bold' }}>₹{bill.consultancyFees}</p>
                    </div>
                    <div style={sectionTotalStyle}>Section Total: ₹{bill.consultancyFees}</div>
                </div>

                <div style={{ ...cardStyle, marginBottom: '15px' }}>
                    <h4 style={subHeaderStyle}><FaVial color="#9b59b6" /> 2. Lab Reports Charges</h4>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={thRow}><th style={th}>Test Name</th><th style={th}>Rate</th><th style={th}>Total</th></tr>
                        </thead>
                        <tbody>
                            {bill.services?.[0]?.["Lab Tests"]?.length > 0 ? (
                                bill.services[0]["Lab Tests"].map((l, i) => (
                                    <tr key={i}>
                                        <td style={td}>{l.testName}</td>
                                        <td style={td}>₹{l.testFees}</td>
                                        <td style={td}>₹{l.testFees}</td>
                                    </tr>
                                ))
                            ) : (<tr><td colSpan="3" style={td}>No Lab Reports</td></tr>)}
                        </tbody>
                    </table>
                    <div style={sectionTotalStyle}>Section Total: ₹{labTotal}</div>
                </div>

                <div style={{ ...cardStyle, marginBottom: '15px' }}>
                    <h4 style={subHeaderStyle}><FaHospital color="#3498db" /> 3. Admit Details</h4>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={thRow}>
                                <th style={th}>Room Type</th>
                                <th style={th}>Duration</th>
                                <th style={th}>Days</th>
                                <th style={th}>Rate</th>
                                <th style={th}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bill.services?.[0]?.room?.map((r, i) => (
                                <tr key={i}>
                                    <td style={td}>{r.roomType}</td>
                                    <td style={td}>
                                        <div style={{ fontSize: '11px' }}>
                                            In: {formatDate(bill.admissionTimestamp)} <br /> Out: {dischargeDate}
                                        </div>
                                    </td>
                                    <td style={td}>{r.daysStayed}</td>
                                    <td style={td}>₹{r.ratePerDay}</td>
                                    <td style={td}>₹{r.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={sectionTotalStyle}>Section Total: ₹{roomTotal}</div>
                </div>

                <div style={{ ...cardStyle, marginBottom: '15px' }}>
                    <h4 style={subHeaderStyle}><FaProcedures color="#e74c3c" /> 4. Surgery Details</h4>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={thRow}><th style={th}>Procedure</th><th style={th}>Fees</th></tr>
                        </thead>
                        <tbody>
                            {bill.services?.[0]?.Surgery?.length > 0 ? (
                                bill.services[0].Surgery.map((s, i) => (
                                    <tr key={i}>
                                        <td style={td}>{s.surgeryType}</td>
                                        <td style={td}>₹{s.surgeryFees}</td>
                                    </tr>
                                ))
                            ) : (<tr><td colSpan="2" style={td}>No Surgery Conducted</td></tr>)}
                        </tbody>
                    </table>
                    <div style={sectionTotalStyle}>Section Total: ₹{surgeryTotal}</div>
                </div>

                <div style={footerSection}>
                    <div style={paymentMethodContainer}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '16px' }}>Select Payment Mode</h4>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <label style={radioLabel}>
                                <input type="radio" name="paymentMode" value="Cash" checked={paymentMode === 'Cash'} onChange={(e) => setPaymentMode(e.target.value)} />
                                <FaMoneyBillWave color="#38a169" /> Cash
                            </label>
                            <label style={radioLabel}>
                                <input type="radio" name="paymentMode" value="UPI" checked={paymentMode === 'UPI'} onChange={(e) => setPaymentMode(e.target.value)} />
                                <FaMobileAlt color="#3182ce" /> UPI
                            </label>
                            <label style={radioLabel}>
                                <input type="radio" name="paymentMode" value="Card" checked={paymentMode === 'Card'} onChange={(e) => setPaymentMode(e.target.value)} />
                                <FaCreditCard color="#e67e22" /> Card
                            </label>
                        </div>
                    </div>

                    <div style={totalBox}>
                        <div style={flexSpace}><p>Subtotal:</p><p>₹{bill.totalAmount}</p></div>
                        <div style={flexSpace}><p>GST ({bill.gst}):</p><p>₹{bill.gstAmount}</p></div>
                        <hr />
                        <div style={{ ...flexSpace, fontWeight: 'bold', fontSize: '18px', color: '#2c3e50' }}>
                            <p>Grand Total:</p><p>₹{bill.grandTotal}</p>
                        </div>
                    </div>
                </div>
                
                <button 
                    style={actionBtn}
                    onClick={() => handleCollectAndDischarge(bill)}
                >
                    Collect Payment ({paymentMode}) & Discharge
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '3px solid #8e44ad', paddingBottom: '10px', marginBottom: '30px' }}>
                <FaFileInvoiceDollar /> Admitted Patients Billing Desk
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {pendingBills.length === 0 ? (
                    <p style={{ color: '#7f8c8d' }}>No pending bills available.</p>
                ) : (
                    pendingBills.map(bill => (
                        <div 
                            key={bill.id} 
                            style={summaryCardStyle} 
                            onClick={() => setSelectedBill(bill)}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '12px', color: '#8e44ad', fontWeight: 'bold' }}>ID: {bill.patientId}</span>
                                <span style={{ ...statusBadge, margin: 0 }}>{bill.status.toUpperCase()}</span>
                            </div>
                            <h3 style={{ margin: '15px 0 5px 0', color: '#2c3e50', fontSize: '18px' }}>{bill.fullName}</h3>
                            <p style={{ ...textStyle, marginBottom: '15px' }}>{bill.department} Dept.</p>
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ color: '#2c3e50', fontWeight: 'bold' }}>₹{bill.grandTotal}</div>
                                <div style={{ fontSize: '12px', color: '#95a5a6' }}><FaClock /> Pending</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- STYLES (NO CHANGES HERE) ---
const sectionTotalStyle = { textAlign: 'right', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ddd', fontWeight: 'bold', color: '#2c3e50', fontSize: '15px' };
const subHeaderStyle = { margin: '0 0 15px 0', color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' };
const paymentMethodContainer = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const radioLabel = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', color: '#4a5568', fontWeight: '500' };
const summaryCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', cursor: 'pointer', transition: 'all 0.2s ease-in-out' };
const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #e0e0e0' };
const headerGrid = { display: 'grid', gridTemplateColumns: '1.5fr 1fr', paddingBottom: '10px' };
const infoSection = { display: 'flex', flexDirection: 'column', gap: '5px' };
const billMetaSection = { display: 'flex', justifyContent: 'flex-end' };
const sectionTitle = { fontSize: '16px', color: '#8e44ad', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' };
const textStyle = { margin: '2px 0', fontSize: '14px', color: '#555' };
const statusBadge = { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #ffeeba', display: 'inline-block', marginTop: '10px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '5px' };
const thRow = { backgroundColor: '#f8f9fa' };
const th = { textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6', color: '#333', fontSize: '13px' };
const td = { padding: '10px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#444' };
const footerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0' };
const totalBox = { width: '300px' };
const flexSpace = { display: 'flex', justifyContent: 'space-between', margin: '5px 0' };
const actionBtn = { width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };

export default PendingBills;