import React from 'react';
import Enemy from './Enemy';

const GameBoard = () => {
  const path = [0, 1, 2, 3, 4]; // Replace with your actual path array

  const handleEnemyReachedEnd = () => {
    // Handle logic when enemy reaches the end
    console.log('Enemy reached the end!');
  };

  const handleEnemyDestroyed = () => {
    // Handle logic when enemy is destroyed
    console.log('Enemy destroyed!');
  };

  return (
    <div>
      <h1>Tower Defense Game</h1>
      {/* Render the game board */}
      <Enemy
        position={0}
        path={path}
        speed={5}
        health={100}
        damage={10}
        onEnemyReachedEnd={handleEnemyReachedEnd}
        onEnemyDestroyed={handleEnemyDestroyed}
      />
    </div>
  );
};

export default GameBoard;
