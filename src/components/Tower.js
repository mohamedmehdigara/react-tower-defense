import React from 'react';

const Tower = ({ position, onClick, type, damage, range, isUpgradable, onUpgrade }) => {
  const handleClick = () => {
    onClick(position);
  };

  const handleUpgrade = () => {
    if (isUpgradable) {
      onUpgrade(position);
    }
  };

  return (
    <div className="tower" onClick={handleClick}>
      {/* Render the tower graphics */}
      <img src="tower.png" alt="Tower" />

      {/* Display tower properties */}
      <div>
        <h3>Tower Type: {type}</h3>
        <p>Damage: {damage}</p>
        <p>Range: {range}</p>
      </div>

      {/* Render tower customization options */}
      <div>
        <h4>Customize Tower</h4>
        {/* Implement tower customization UI elements */}
      </div>

      {/* Render tower upgrade button */}
      {isUpgradable && <button onClick={handleUpgrade}>Upgrade Tower</button>}
    </div>
  );
};

export default Tower;
