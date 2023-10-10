import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import "./Enemy.css";

const ENEMY_MOVE_DURATION = 1000; // Define a constant for move duration

const Enemy = ({ position, path, speed, health, damage, onEnemyReachedEnd, onEnemyDestroyed }) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentHealth, setCurrentHealth] = useState(health);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    const moveEnemy = () => {
      if (currentPosition >= path.length - 1 || reachedEnd) {
        // Enemy has reached the end or already reached the end, stop moving
        return;
      }

      const nextPosition = currentPosition + 1;
      const newPosition = path[nextPosition];

      setCurrentPosition(nextPosition);

      // Calculate the time it takes to move to the next position based on speed
      const moveDuration = Math.abs(newPosition.x - path[currentPosition].x) / speed * ENEMY_MOVE_DURATION;

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
    // Handle logic when the enemy reaches the end
    setReachedEnd(true);
    onEnemyReachedEnd();
  };

  return (
    <div className="enemy-info">
      <div>Enemy Health:</div>
      <HealthBar currentHealth={currentHealth} maxHealth={health} />
      <div>Position: ({position.x}, {position.y}, {position.z})</div>
    </div>
  );
};

// Define prop types
Enemy.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  path: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  })),
  speed: PropTypes.number,
  health: PropTypes.number,
  damage: PropTypes.number,
  onEnemyReachedEnd: PropTypes.func,
  onEnemyDestroyed: PropTypes.func,
};

export default Enemy;

// HealthBar component
const HealthBar = ({ currentHealth, maxHealth }) => {
  const fillWidth = (currentHealth / maxHealth) * 100 + '%';

  return (
    <div className="health-bar">
      <div
        className="health-fill"
        style={{ width: fillWidth }}
      ></div>
    </div>
  );
};

// Define prop types for HealthBar
HealthBar.propTypes = {
  currentHealth: PropTypes.number,
  maxHealth: PropTypes.number,
};
