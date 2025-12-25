import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Appointment = () => {
  const navigate = useNavigate();
  
  // Data for State and Cities
  const stateData = {
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli"]
  };

  const departments = ["Orthopedic", "Neurosurgery", "Cardiology", "Pediatrics", "Dermatology", "Oncology", "ENT"];

  const initialState = {
    fullName: '', age: '', contact: '', email: '',
    country: 'India', state: '', city: '', address: '', department: ''
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Numeric validation for Age and Contact
    if ((name === 'age' || name === 'contact') && value !== '' && !/^\d+$/.test(value)) return;
    
    // Max 10 digits for contact
    if (name === 'contact' && value.length > 10) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/appointments', formData);
      alert('Appointment booked successfully!');
      navigate('/');
    } catch (error) {
      console.error("Error booking appointment", error);
    }
  };

  const handleClear = () => setFormData(initialState);

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={inputStyle}/>
        
        <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required style={inputStyle}/>
        
        <input type="text" name="contact" placeholder="Contact Number (10 digits)" value={formData.contact} onChange={handleChange} required style={inputStyle}/>
        
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={inputStyle}/>

        <select name="country" value={formData.country} disabled style={inputStyle}>
          <option value="India">India</option>
        </select>

        <select name="state" value={formData.state} onChange={handleChange} required style={inputStyle}>
          <option value="">Select State</option>
          {Object.keys(stateData).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select name="city" value={formData.city} onChange={handleChange} required style={inputStyle} disabled={!formData.state}>
          <option value="">Select City</option>
          {formData.state && stateData[formData.state].map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} required style={inputStyle}></textarea>

        <select name="department" value={formData.department} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Department</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={submitBtn}>Submit</button>
          <button type="button" onClick={handleClear} style={clearBtn}>Clear</button>
        </div>
      </form>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' };
const formStyle = { background: '#f4f4f4', padding: '20px', borderRadius: '8px' };
const submitBtn = { flex: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' };
const clearBtn = { flex: 1, padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' };

export default Appointment;