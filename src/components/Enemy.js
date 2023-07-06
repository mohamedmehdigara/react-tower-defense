import React, { useState, useEffect } from 'react';

const Enemy = ({ position, path, speed, health, damage, onEnemyReachedEnd, onEnemyDestroyed }) => {
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentHealth, setCurrentHealth] = useState(health);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    const moveEnemy = () => {
      if (currentPosition >= path.length - 1 || reachedEnd) {
        // Enemy has reached the end or already reached end, stop moving
        return;
      }

      const nextPosition = currentPosition + 1;
      const newPosition = path[nextPosition];

      setCurrentPosition(nextPosition);

      // Calculate the time it takes to move to the next position based on speed
      const moveDuration = Math.abs(newPosition - path[currentPosition]) / speed * 1000;

      setTimeout(moveEnemy, moveDuration);
    };

    moveEnemy();
  }, [currentPosition, path, speed, reachedEnd]);

  const handleDamage = (damageAmount) => {
    setCurrentHealth((prevHealth) => prevHealth - damageAmount);

    if (currentHealth - damageAmount <= 0) {
      onEnemyDestroyed();
    }
  };

  const handleEnemyReachedEnd = () => {
    // Handle logic when enemy reaches the end
    setReachedEnd(true);
    onEnemyReachedEnd();
  };

  return (
    <div>
      <div>Enemy Health: {currentHealth}</div>
      {/* Render the enemy component */}
    </div>
  );
};

export default Enemy;
