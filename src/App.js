import React, { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard/GameBoard';
import Enemy from './components/Enemy/Enemy';
import Tower from './components/Tower/Tower';
import * as THREE from 'three';

const App = () => {
  // Initialize scene, camera, and renderer as states
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [enemies, setEnemies] = useState([]);

  useEffect(() => {
    console.log("Initializing Three.js");

    // Create a Three.js scene, camera, and renderer
    const newScene = new THREE.Scene();
    const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const newRenderer = new THREE.WebGLRenderer();

    // Set initial positions and properties for camera and renderer
    newCamera.position.set(0, 2, 8);
    newRenderer.setSize(window.innerWidth, window.innerHeight);

    // Append the renderer's DOM element to the container if it exists
    const container = document.getElementById('game-container');
    if (container) {
      container.appendChild(newRenderer.domElement);
    } else {
      console.error("Element with ID 'game-container' not found.");
    }

    // Set states for scene, camera, and renderer
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);

    console.log("Three.js initialization complete");

    // Clean up on unmount
    return () => {
      if (newRenderer) {
        newRenderer.dispose();
      }
    };
  }, []);

  return (
    <div className="App">
      <div id="game-container"></div> {/* Add an empty container for the renderer */}
      {scene && camera && renderer && (
        <GameBoard scene={scene} camera={camera} renderer={renderer} />
      )} {/* Pass the scene to GameBoard */}
      <Enemy
        position={{ x: 0, y: 0, z: 0 }} 
        path={[{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }]} 
        speed={5}
        health={100}
        damage={10}
        onEnemyReachedEnd={() => console.log('Enemy reached the end!')}
        onEnemyDestroyed={() => console.log('Enemy destroyed!')}
      />
      <Tower
        position={{ x: 0, y: 0, z: 0 }} 
        target={{ scene }}
        enemies={enemies} // Pass the enemies array to Tower
        onClick={(position) => console.log('Tower clicked at position:', position)}
        type="Cannon"
        damage={50}
        range={10}
        isUpgradable={true}
        onUpgrade={(position) => console.log('Upgrade tower at position:', position)}
      />
    </div>
  );
};

export default App;
