import React, { useState, useEffect } from 'react';
import { getHighScore } from '../utils/scoreUtils'; // Import high score function

function GameOver({ restartGame, reason }) {
  const [isVisible, setIsVisible] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Trigger fade-in effect and fetch high score on component mount
  useEffect(() => {
    setIsVisible(true);
    setHighScore(getHighScore()); // Get high score from localStorage
  }, []);

  return (
    <div className={`game-over ${isVisible ? 'visible' : ''}`}>
      <h2>{reason}</h2>
      <p>🏆 High Score: {highScore}</p>
      <button onClick={restartGame}>Restart Game</button>
      <button onClick={() => {
        localStorage.removeItem('highScore');  // Reset high score in local storage
        setHighScore(0); // Reset high score state
      }}>Reset High Score</button>
    </div>
  );
}

export default GameOver;
