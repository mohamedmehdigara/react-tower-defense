import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Tower from './Tower';

const GameBoard = () => {
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [resources, setResources] = useState(100);

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
    } else {
      alert("Not enough resources to place a tower.");
    }
  };

  const handleTowerUpgrade = () => {
    // Implement tower upgrade logic here
    // Deduct resources, upgrade towers, and update UI
  };

  // Initialize your scene and enemies array
  const scene = new THREE.Scene();
  const enemies = [];

  // Define the initial tower position
  const towerPosition = { x: 0, y: 1.5, z: 0 };

  // Create a target object to pass to the Tower component
  const target = {
    scene: scene,
    enemies: enemies,
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

    // Arrays to hold towers and enemies
    const towers = [];
    const enemies = [];

    // Create and position towers
    const towerGeometry = new THREE.BoxGeometry(1, 3, 1);
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    for (let i = 0; i < 5; i++) {
      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      tower.position.set(-3 + i * 1.5, 1.5, 0); // Adjust tower positions
      towers.push(tower);
      scene.add(tower);
    }

    // Create path
    const pathGeometry = new THREE.BoxGeometry(4, 0.1, 1);
    const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(path);

    // Create and position enemies
    const enemyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    for (let i = 0; i < 10; i++) {
      const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
      enemy.position.set(4 + i * 2, 0.5, 0); // Adjust enemy positions
      enemies.push(enemy);
      scene.add(enemy);

      // Pass the target object to the enemy component
      enemy.target = target;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);

      towers.forEach((tower) => {
        tower.rotation.x += 0.005;
        tower.rotation.y += 0.005;
        // Implement tower logic here (e.g., targeting enemies)
      });

      enemies.forEach((enemy) => {
        enemy.position.x -= 0.01;
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
  }, []); // Empty dependency array for useEffect

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
          {/* Add more UI elements for game controls */}
        </div>
      </div>

      {/* Render the Tower component with position and target */}
      <Tower position={towerPosition} target={target} />
    </div>
  );
};

export default GameBoard;
