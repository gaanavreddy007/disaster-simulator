import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import DisasterScenario from './components/DisasterScenario';
import SurvivalStats from './components/SurvivalStats';
import Timer from './components/Timer';
import GameOver from './components/GameOver';
import Login from './components/Login';
import Leaderboard from './components/Leaderboard';
import ActivePlayers from './components/ActivePlayers';
import './App.css';

function Game({ username }) {
  const [isGameOver, setIsGameOver] = useState(false);
  const [reason, setReason] = useState('');
  const [score, setScore] = useState(0);
  const [disasterType, setDisasterType] = useState(null);
  const [health, setHealth] = useState(100);
  const [resources, setResources] = useState(50);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const audioRef = useRef(null);

  // Base path for GitHub Pages
  const basePath = process.env.PUBLIC_URL || "";

  // Play disaster sound without overlap
  const playSound = (soundFile) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(`${basePath}/sounds/${soundFile}`);
    audioRef.current.play().catch((error) => {
      console.warn("Autoplay blocked. User interaction required.", error);
    });
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
      // Save score to leaderboard
      const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
      leaderboard.push({ username, score });
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
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
      <p className="text-sm mb-4">Playing as: {username}</p>
      <Link to="/leaderboard" className="text-blue-500 hover:text-blue-700 mb-4 block">
        View Leaderboard
      </Link>

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

function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      setUsername(currentUser.username);
      // Add user to active players
      const activePlayers = JSON.parse(localStorage.getItem('activePlayers') || '[]');
      if (!activePlayers.find(player => player.username === currentUser.username)) {
        activePlayers.push({ username: currentUser.username, lastActive: Date.now() });
        localStorage.setItem('activePlayers', JSON.stringify(activePlayers));
      }
    }
  }, []);

  const handleLogin = (username) => {
    setUsername(username);
    // Add user to active players
    const activePlayers = JSON.parse(localStorage.getItem('activePlayers') || '[]');
    if (!activePlayers.find(player => player.username === username)) {
      activePlayers.push({ username, lastActive: Date.now() });
      localStorage.setItem('activePlayers', JSON.stringify(activePlayers));
    }
  };

  const handleLogout = () => {
    // Remove user from active players
    const activePlayers = JSON.parse(localStorage.getItem('activePlayers') || '[]');
    const updatedPlayers = activePlayers.filter(player => player.username !== username);
    localStorage.setItem('activePlayers', JSON.stringify(updatedPlayers));
    
    localStorage.removeItem('currentUser');
    setUsername(null);
  };

  // Clean up inactive players every minute
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const activePlayers = JSON.parse(localStorage.getItem('activePlayers') || '[]');
      const now = Date.now();
      const updatedPlayers = activePlayers.filter(player => now - player.lastActive < 30000); // Remove players inactive for 30 seconds
      localStorage.setItem('activePlayers', JSON.stringify(updatedPlayers));
    }, 60000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Disaster Simulator</h1>
            {username && (
              <div className="flex items-center space-x-4">
                <span>Welcome, {username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {username && <ActivePlayers />}
          <Routes>
            <Route path="/" element={username ? <Navigate to="/game" /> : <Login onLogin={handleLogin} />} />
            <Route path="/login" element={username ? <Navigate to="/game" /> : <Login onLogin={handleLogin} />} />
            <Route path="/game" element={username ? <Game username={username} /> : <Navigate to="/login" />} />
            <Route path="/leaderboard" element={username ? <Leaderboard /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
