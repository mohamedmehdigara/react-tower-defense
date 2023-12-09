// ArcherTower.js
import React, { useState } from 'react';
import "./ArcherTower.css";

const ArcherTower = ({ position, target, onUpgrade }) => {
  const [attackSpeed, setAttackSpeed] = useState(1); // Default attack speed

  const upgradePaths = [
    {
      name: 'Precision Shots',
      description: 'Increased critical hit chance.',
      upgrade: () => {
        // Implement logic for the Precision Shots upgrade
        console.log('Upgraded to Precision Shots!');
      },
    },
    {
      name: 'Rapid Fire',
      description: 'Further increases attack speed.',
      upgrade: () => {
        setAttackSpeed((speed) => speed * 1.2); // Increase attack speed by 20%
        console.log('Upgraded to Rapid Fire!');
      },
    },
  ];

  const handleUpgrade = (index) => {
    const selectedUpgrade = upgradePaths[index];
    selectedUpgrade.upgrade();
    onUpgrade();
  };

  return (
    <div>
      <h3>Archer Tower</h3>
      <p>Attack Speed: {attackSpeed}</p>
      <h4>Upgrade Paths:</h4>
      <ul>
        {upgradePaths.map((path, index) => (
          <li key={index}>
            <strong>{path.name}</strong>: {path.description}{' '}
            <button onClick={() => handleUpgrade(index)}>Upgrade</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArcherTower;
