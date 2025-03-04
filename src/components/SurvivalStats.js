import React, { useEffect } from 'react';

function SurvivalStats({ health, resources, setHealth, setResources, onGameOver }) {
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setHealth((prevHealth) => {
        if (prevHealth <= 0) {
          clearInterval(statsInterval);
          onGameOver('Game Over: Health Depleted');
          return 0;
        }
        return prevHealth - 1; // Reduce health gradually
      });

      setResources((prevResources) => {
        if (prevResources <= 0) {
          clearInterval(statsInterval);
          onGameOver('Game Over: Resources Depleted');
          return 0;
        }
        return prevResources - 2; // Reduce resources faster than health
      });
    }, 1000);

    return () => clearInterval(statsInterval);
  }, [setHealth, setResources, onGameOver]);

  return (
    <div className="survival-stats">
      <h3>Survival Stats</h3>
      <p>Health: {health}%</p>
      <p>Resources: {resources}%</p>
    </div>
  );
}

export default SurvivalStats;
