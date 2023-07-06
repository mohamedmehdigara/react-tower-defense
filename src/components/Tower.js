import React, { useState } from 'react';

const Tower = ({ position, onClick, isUpgradable, onUpgrade }) => {
  const [upgradeLevel, setUpgradeLevel] = useState(0);

  const handleClick = () => {
    onClick(position);
  };

  const handleUpgrade = () => {
    if (isUpgradable) {
      onUpgrade(position);
      setUpgradeLevel(prevLevel => prevLevel + 1);
    }
  };

  const getUpgradeAttributes = (upgradeLevel) => {
    switch (upgradeLevel) {
      case 0:
        return {
          damage: 50,
          range: 10,
        };
      case 1:
        return {
          damage: 75,
          range: 12,
        };
      case 2:
        return {
          damage: 100,
          range: 15,
        };
      default:
        return {
          damage: 0,
          range: 0,
        };
    }
  };

  const { damage, range } = getUpgradeAttributes(upgradeLevel);

  return (
    <div className="tower" onClick={handleClick}>
      {/* Render the tower graphics */}
      <img src="tower.png" alt="Tower" />

      {/* Display tower properties */}
      <div>
        <h3>Tower Type: Cannon</h3>
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
