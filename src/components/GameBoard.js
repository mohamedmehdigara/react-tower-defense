import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Tower from './Tower';
import Enemy from './Enemy';

const GameBoard = () => {
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [resources, setResources] = useState(100);
  const [enemies, setEnemies] = useState([]);
  const [towers, setTowers] = useState([]);

  // Define tower related variables
  const towerCost = 10;
  const upgradeCost = 20;

  // Define your tower placement and upgrade logic here
  const handleTowerPlacement = () => {
    if (resources >= towerCost) {
      // Deduct the tower cost from available resources
      setResources(resources - towerCost);

      // Implement logic to place the tower on a valid location
      // For example, you can allow the player to click on the game board
      // and place the tower at the clicked location

      // Once the tower is placed, you can update your towers array
      const towerPosition = { x: 0, y: 1.5, z: 0 }; // Adjust tower position as needed
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
    // Implement logic to add enemies to the enemies array
    // For example, you can create enemies with random positions
    const enemyPosition = { x: 10, y: 1.5, z: 0 }; // Adjust enemy position as needed
    setEnemies([...enemies, enemyPosition]);
  };

  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    camera.position.set(0, 2, 8);

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create path
    const pathGeometry = new THREE.BoxGeometry(4, 0.1, 1);
    const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(path);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);

      towers.forEach((towerPosition) => {
        // Create and render towers in the scene
        const towerGeometry = new THREE.BoxGeometry(1, 3, 1);
        const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.copy(towerPosition);
        scene.add(tower);

        // Implement tower logic here (e.g., targeting enemies)
        // You can loop through the enemies array and check for targets
      });

      enemies.forEach((enemyPosition) => {
        // Create and render enemies in the scene
        const enemyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
        enemy.position.copy(enemyPosition);
        scene.add(enemy);

        // Implement enemy logic here (e.g., collision detection with towers)
      });

      renderer.render(scene, camera);
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

    // Cleanup logic when the component unmounts
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [enemies, towers]);

  return (
    <div>
      <div ref={containerRef} />

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

      {enemies.map((enemyPosition, index) => (
        <Enemy key={index} position={enemyPosition} />
      ))}

      {towers.map((towerPosition, index) => (
        <Tower key={index} position={towerPosition} target={{ scene, enemies }} />
      ))}
    </div>
  );
};

export default GameBoard;
