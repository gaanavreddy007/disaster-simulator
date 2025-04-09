import React, { useEffect, useState } from 'react';

function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Get scores from localStorage
    const savedScores = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    // Sort scores in descending order
    const sortedScores = savedScores.sort((a, b) => b.score - a.score);
    setScores(sortedScores);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Leaderboard</h2>
        <div className="space-y-4">
          {scores.length > 0 ? (
            scores.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-xl font-bold mr-4">{index + 1}</span>
                  <span className="font-semibold">{entry.username}</span>
                </div>
                <span className="text-xl font-bold text-blue-500">{entry.score}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No scores yet. Play the game to see your score here!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard; 