import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header style={{ padding: '10px', background: '#282c34', color: 'white' }}>
            <nav>
            <Link to="/" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Appointments</Link>
                <Link to="/selectpatient" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Select Patient</Link>
                <Link to="/lists" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Lists</Link>
                <Link to="/makeappointment" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Make Appointment</Link>
                <Link to="/patientappointment" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Patient Appointment</Link>
            </nav>
        </header>
    );
};

export default Header;
