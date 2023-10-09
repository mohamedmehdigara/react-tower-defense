import React, { useState, useEffect } from 'react';
import "../Enemy/Enemy.css";

const Enemy = ({ position, path, speed, health, damage, onEnemyReachedEnd, onEnemyDestroyed }) => {
  const [currentPosition, setCurrentPosition] = useState(0);
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
      const moveDuration = Math.abs(newPosition - path[currentPosition].x) / speed * 1000;

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

  // Inside the return statement
return(

<div className="enemy-info">
  <div>Enemy Health:</div>
  <div className="health-bar">
    <div
      className="health-fill"
      style={{ width: `${(currentHealth / health) * 100}%` }}
    ></div>
  </div>
  <div>Position: ({position.x}, {position.y}, {position.z})</div>
</div>
)
};

export default Enemy;
