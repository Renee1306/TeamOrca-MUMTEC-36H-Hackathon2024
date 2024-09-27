import React from 'react';
import './PredictiveMaintenance.css';

function PredictiveMaintenance() {
  // Mock data and function
  const handleCheckHealth = () => {
    alert('Hardware is in optimal condition. No maintenance required.');
  };

  return (
    <div className="predictive-maintenance">
      <h3>Hardware Health Check</h3>
      <button onClick={handleCheckHealth}>Check Health</button>
    </div>
  );
}

export default PredictiveMaintenance;
