import React, { useState, useEffect, useRef } from 'react';
import DisasterScenario from './components/DisasterScenario';
import SurvivalStats from './components/SurvivalStats';
import Timer from './components/Timer';
import GameOver from './components/GameOver';
import { saveScore } from './utils/scoreUtils';
import './App.css';

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [reason, setReason] = useState('');
  const [score, setScore] = useState(0);
  const [disasterType, setDisasterType] = useState(null);
  const [health, setHealth] = useState(100);
  const [resources, setResources] = useState(50);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const audioRef = useRef(null);

  // Play disaster sound without overlap
  const playSound = (soundFile) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(`/sounds/${soundFile}`);
    audioRef.current.play();
  };

  // Stop sound when game is over
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Handle Game Over
  const handleGameOver = (message) => {
    if (!isGameOver) {
      setIsGameOver(true);
      setReason(message);
      saveScore(score);
      stopSound();
      playSound('game-over.mp3');
    }
  };

  // Check game over conditions
  useEffect(() => {
    if ((health <= 0 || resources <= 0) && !isGameOver) {
      handleGameOver('You ran out of health or resources!');
    }
  }, [health, resources, isGameOver]);

  // Handle disaster event
  const handleDisaster = (disaster) => {
    if (!disaster || isGameOver) return;
    setDisasterType(disaster);
    setTimerActive(true);
    setTimeLeft(30);

    const disasterEffects = {
      earthquake: { healthLoss: 20, resourceLoss: 10, sound: 'earthquake.mp3' },
      flood: { healthLoss: 15, resourceLoss: 15, sound: 'flood.mp3' },
      fire: { healthLoss: 25, resourceLoss: 5, sound: 'fire.mp3' },
    };

    const effect = disasterEffects[disaster];
    if (effect) {
      playSound(effect.sound);
      setHealth((prev) => Math.max(prev - effect.healthLoss, 0));
      setResources((prev) => Math.max(prev - effect.resourceLoss, 0));
    }
  };

  // Handle timer reaching 0
  const handleTimeUp = () => {
    handleGameOver('Game Over: Time is Up!');
  };

  // Restart the game
  const restartGame = () => {
    setIsGameOver(false);
    setReason('');
    setHealth(100);
    setResources(50);
    setDisasterType(null);
    setScore(0);
    setTimerActive(false);
    stopSound();
  };

  // Increase score & health/resources bonus
  const increaseScore = () => {
    setScore((prev) => prev + 10);
    setHealth((prev) => Math.min(prev + 10, 100));
    setResources((prev) => Math.min(prev + 5, 100));
  };

  // Survival options to regain resources
  const surviveOptions = [
    { name: 'Find Shelter', effect: () => setHealth((prev) => Math.min(prev + 15, 100)) },
    { name: 'Collect Water', effect: () => setResources((prev) => Math.min(prev + 20, 100)) },
    { name: 'Use First Aid', effect: () => setHealth((prev) => Math.min(prev + 25, 100)) },
  ];

  return (
    <div className={`App ${disasterType || ''} ${timeLeft <= 10 ? 'red-alert' : ''}`}>
      <h1>Disaster Survival Simulator</h1>

      {!isGameOver ? (
        <>
          <DisasterScenario setDisasterType={handleDisaster} />
          <SurvivalStats 
            health={health} 
            resources={resources} 
            setHealth={setHealth}  
            setResources={setResources}  
            onGameOver={handleGameOver}  
          />
          {timerActive && <Timer timeLeft={timeLeft} onTimeUp={handleTimeUp} />}
          <div className="survival-options">
            {surviveOptions.map((option) => (
              <button key={option.name} onClick={option.effect}>
                {option.name}
              </button>
            ))}
          </div>
          <button onClick={increaseScore}>Survive 10 Seconds</button>
        </>
      ) : (
        <GameOver restartGame={restartGame} reason={reason} />
      )}
    </div>
  );
}

export default App;
