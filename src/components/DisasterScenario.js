// src/components/DisasterScenario.js
import React from 'react';

function DisasterScenario({ setDisasterType }) {
  // Function to handle disaster scenario selection
  const handleDisaster = (disaster) => {
    setDisasterType(disaster); // Set the selected disaster type
  };

  return (
    <div className="disaster-scenario">
      <h3>Select a Disaster Scenario</h3>
      <div className="disaster-buttons">
        <button onClick={() => handleDisaster('earthquake')}>Earthquake</button>
        <button onClick={() => handleDisaster('flood')}>Flood</button>
        <button onClick={() => handleDisaster('fire')}>Fire</button>
      </div>
    </div>
  );
}

export default DisasterScenario;
