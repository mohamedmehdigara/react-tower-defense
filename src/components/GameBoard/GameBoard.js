import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Tower from '../Tower/Tower';
import Enemy from '../Enemy/Enemy';
import './GameBoard.css'; // Import your CSS file for styling

const initialPath = [ // Renamed to initialPath to avoid conflicts
  { x: -5, y: 1.5, z: 0 },
];

const GameBoard = () => {
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
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

  const handleTowerUpgrade = () => {
    // Implement tower upgrade logic here
    // Deduct resources, upgrade towers, and update UI
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

    // Use initialPath instead of path for pathGeometry
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
          <h2>Level: {level}</h2>
          <h2>Resources: {resources}</h2>
        </div>
        <div>
          <button onClick={handleTowerPlacement}>Place Tower</button>
          <button onClick={handleTowerUpgrade}>Upgrade Tower</button>
          <button onClick={addEnemy}>Add Enemy</button>
          {/* Add more UI elements for game controls */}
        </div>
      </div>

      {enemies.map((enemy, index) => (
        <Enemy
          key={index}
          position={enemy}
          path={initialPath} // Use initialPath here
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
    </div>
  );
};

export default GameBoard;
