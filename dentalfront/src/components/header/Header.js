import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set true if token exists
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsLoggedIn(false);
    alert("Logged out successfully!");
  };

    return (
        <header style={{ padding: '10px', background: '#282c34', color: 'white' }}>
            <nav>
            <Link to="/" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Appointments</Link>
                <Link to="/selectpatient" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Select Patient</Link>
                <Link to="/lists" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Lists</Link>
                <Link to="/makeappointment" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>MH</Link>
                <Link to="/patientappointment" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Patient Appointment</Link>
                
                {isLoggedIn ? (
                <span>Welcome, User!</span>
                
                ):(
                    <Link to="/login" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Login</Link>
                )}
                </nav>
        </header>
    );
};

export default Header;
