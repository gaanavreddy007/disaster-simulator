import React, { useState, useEffect } from 'react';

function Timer({ timeLeft, onTimeUp }) {
  const [currentTime, setCurrentTime] = useState(timeLeft);

  // Effect to handle timer countdown
  useEffect(() => {
    if (currentTime === 0) {
      onTimeUp();  // Trigger game over when time reaches 0
      return;  // Exit function if time is up
    }

    const timerInterval = setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime > 0) return prevTime - 1;
        clearInterval(timerInterval);  // Clear interval when time reaches 0
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerInterval);  // Clean up interval on component unmount
  }, [currentTime, onTimeUp]);

  return (
    <div className="timer">
      <h3>Time Left: {currentTime}s</h3>
    </div>
  );
}

export default Timer;
