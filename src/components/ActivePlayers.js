import React, { useEffect, useState } from 'react';

function ActivePlayers() {
  const [activePlayers, setActivePlayers] = useState([]);

  useEffect(() => {
    // Get active players from localStorage
    const players = JSON.parse(localStorage.getItem('activePlayers') || '[]');
    setActivePlayers(players);

    // Update active players every 5 seconds
    const interval = setInterval(() => {
      const updatedPlayers = JSON.parse(localStorage.getItem('activePlayers') || '[]');
      setActivePlayers(updatedPlayers);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Active Players</h3>
      <div className="space-y-2">
        {activePlayers.length > 0 ? (
          activePlayers.map((player, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{player.username}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No active players</p>
        )}
      </div>
    </div>
  );
}

export default ActivePlayers; 