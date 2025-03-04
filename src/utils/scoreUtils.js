// src/utils/scoreUtils.js

// Save score to localStorage if it is higher than the previous high score
export const saveScore = (score) => {
  const highScore = parseInt(localStorage.getItem('highScore'), 10) || 0;
  if (score > highScore) {
    localStorage.setItem('highScore', score);
  }
};

// Retrieve the current high score from localStorage
export const getHighScore = () => {
  return parseInt(localStorage.getItem('highScore'), 10) || 0;
};
