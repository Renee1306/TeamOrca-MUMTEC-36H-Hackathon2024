import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Firmware Development Platform</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/code-optimization">Code Optimization</Link>
        <Link to="/predictive-maintenance">Predictive Maintenance</Link>
        <Link to="/performance-benchmark">Performance Benchmark</Link>
      </div>
    </nav>
  );
}

export default Navbar;
