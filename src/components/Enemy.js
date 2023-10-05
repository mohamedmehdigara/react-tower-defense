import React, { useState, useEffect } from 'react';

const Enemy = ({ position, path, speed, health, damage, onEnemyReachedEnd, onEnemyDestroyed }) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentHealth, setCurrentHealth] = useState(health);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    const moveEnemy = () => {
      if (currentPosition >= path.length - 1 || reachedEnd) {
        return;
      }

      const nextPosition = currentPosition + 1;
      const newPosition = path[nextPosition];

      setCurrentPosition(nextPosition);

      const moveDuration = Math.abs(newPosition - path[currentPosition]) / speed * 1000;

      setTimeout(moveEnemy, moveDuration);
    };

    moveEnemy();
  }, [currentPosition, path, speed, reachedEnd]);

  useEffect(() => {
    if (currentHealth <= 0) {
      onEnemyDestroyed();
    }
  }, [currentHealth, onEnemyDestroyed]);

  const handleEnemyReachedEnd = () => {
    setReachedEnd(true);
    onEnemyReachedEnd();
  };

  return (
    <div>
      <div>Enemy Health: {currentHealth}</div>
    </div>
  );
};

export default Enemy;
