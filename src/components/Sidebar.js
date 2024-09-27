import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Tools & Features</h3>
      <ul>
        <li><Link to="/code-optimization">AI Code Optimizer</Link></li>
        <li><Link to="/predictive-maintenance">Predictive Maintenance</Link></li>
        <li><Link to="/performance-benchmark">Performance Benchmarking</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
