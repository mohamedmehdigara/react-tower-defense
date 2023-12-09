import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Tower from '../Tower/Tower';
import Enemy from '../Enemy/Enemy';
import './GameBoard.css';
import ArcherTower from '../Tower/ArcherTower';


const initialPath = [
  { x: -5, y: 1.5, z: 0 },
];

const GameBoard = () => {
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [resources, setResources] = useState(100);
  const [enemies, setEnemies] = useState([]);
  const [towers, setTowers] = useState([]);
  const [scene, setScene] = useState(null);

  const towerCost = 10;
  const upgradeCost = 20;

  const handleTowerPlacement = () => {
    if (resources >= towerCost) {
      setResources(resources - towerCost);
      const towerPosition = { x: 0, y: 1.5, z: 0 };
      setTowers([...towers, towerPosition]);
    } else {
      alert("Not enough resources to place a tower.");
    }
  };

  const handlePlaceArcherTower = () => {
    // Implement logic to place Archer Tower
    console.log('Placing Archer Tower...');
  };

  const handleTowerUpgrade = () => {
    // Check if there are towers available for upgrade
    if (towers.length === 0) {
      alert("No towers available for upgrade.");
      return;
    }

    // Check if there are enough resources for an upgrade
    if (resources < upgradeCost) {
      alert("Not enough resources for an upgrade.");
      return;
    }

    // Choose a tower to upgrade (for simplicity, we'll upgrade the first tower)
    const towerToUpgrade = towers[0]; // You can implement a selection mechanism here

    // Implement tower upgrade logic, for example, increasing damage or range
    // You can add more properties to your tower to support upgrades
    // For now, let's increase the damage by 10%
    const upgradedTowers = towers.map((tower) => {
      if (tower === towerToUpgrade) {
        return { ...tower, damage: tower.damage * 1.1 };
      }
      return tower;
    });

    // Deduct upgrade cost from resources
    setResources(resources - upgradeCost);

    // Update the towers with the upgraded tower
    setTowers(upgradedTowers);

    // You can also update other UI elements to reflect the upgrade
    console.log("Tower upgraded.");
  };

  const addEnemy = () => {
    console.log("Adding enemy...");

    if (initialPath.length === 0) {
      console.error("Path is empty or undefined.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * initialPath.length);
    const randomPosition = initialPath[randomIndex];
    console.log('Random Position:', randomPosition);
    setEnemies([...enemies, randomPosition]);
  };

  const handleEnemyReachedEnd = (index) => {
    const updatedEnemies = [...enemies];
    updatedEnemies.splice(index, 1);
    setEnemies(updatedEnemies);
  };

  const handleEnemyDestroyed = (index) => {
    setScore(score + 1);
    const updatedEnemies = [...enemies];
    updatedEnemies.splice(index, 1);
    setEnemies(updatedEnemies);
  };

  const handleTowerFiring = () => {
    // Implement tower firing logic here
    // Detect enemies in range and fire arrows

    // For simplicity, let's assume towers have a range of 5 units
    const towerRange = 5;

    towers.forEach((towerPosition) => {
      enemies.forEach((enemyPosition, enemyIndex) => {
        const distance = Math.sqrt(
          Math.pow(towerPosition.x - enemyPosition.x, 2) +
          Math.pow(towerPosition.y - enemyPosition.y, 2) +
          Math.pow(towerPosition.z - enemyPosition.z, 2)
        );

        if (distance <= towerRange) {
          // Tower can hit the enemy, simulate firing an arrow
          handleArrowHitEnemy(enemyIndex);
        }
      });
    });
  };

  const handleArrowHitEnemy = (enemyIndex) => {
    // Handle logic when an arrow hits an enemy
    // For now, just remove the enemy (you can add animations or other effects)
    handleEnemyDestroyed(enemyIndex);
  };

  useEffect(() => {
    const newScene = new THREE.Scene();
    setScene(newScene);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const pathGeometry = new THREE.BoxGeometry(4, 0.1, 1);
    const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
    newScene.add(pathMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 5, 5);
    newScene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);

      towers.forEach((towerPosition) => {
        const towerGeometry = new THREE.BoxGeometry(1, 3, 1);
        const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.copy(towerPosition);
        newScene.add(tower);
      });

      enemies.forEach((enemyPosition) => {
        const enemyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
        enemy.position.copy(enemyPosition);
        newScene.add(enemy);
      });

      renderer.render(newScene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [enemies, towers]);

  return (
    <div>
      <div ref={containerRef} className="game-board" />

      <div className="ui">
        <div>
          <h2>Score: {score}</h2>
          <h2>Resources: {resources}</h2>
        </div>
        <div>
          <button onClick={handleTowerPlacement}>Place Tower</button>
          <button onClick={handleTowerUpgrade}>Upgrade Tower</button>
          <button onClick={addEnemy}>Add Enemy</button>
          <button onClick={handleTowerFiring}>Fire Arrows</button>
          <button className="place-archer-tower" onClick={handlePlaceArcherTower}>
            Place Archer Tower
          </button>
        </div>
      </div>

      {enemies.map((enemy, index) => (
        <Enemy
          key={index}
          position={enemy}
          path={initialPath}
          speed={0.1}
          health={10}
          damage={5}
          onEnemyReachedEnd={() => handleEnemyReachedEnd(index)}
          onEnemyDestroyed={() => handleEnemyDestroyed(index)}
        />
      ))}

      {towers.map((towerPosition, index) => (
        <Tower key={index} position={towerPosition} target={{ scene, enemies }} />
      ))}
       <button onClick={() => handleTowerPlacement(<ArcherTower position={{ x: 0, y: 1.5, z: 0 }} />)}>
          Place Archer Tower
        </button>
    </div>
  );
};

export default GameBoard;
