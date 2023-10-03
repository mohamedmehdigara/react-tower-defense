import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GameBoard = () => {
  const containerRef = useRef(null);

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
    camera.position.set(0, 2, 8); // Adjust camera position

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create a tower
    const towerGeometry = new THREE.BoxGeometry(1, 3, 1); // Adjust tower size
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Use standard material for better lighting
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.x = -2;
    scene.add(tower);

    // Create a path
    const pathGeometry = new THREE.BoxGeometry(4, 0.1, 1);
    const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Use standard material
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(path);

    // Create enemies
    const enemyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Use standard material
    const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
    enemy.position.x = 2;
    scene.add(enemy);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Directional light
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    // Animate the scene
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate tower
      tower.rotation.x += 0.005;
      tower.rotation.y += 0.005;

      // Move enemy along the path
      enemy.position.x -= 0.01;

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={containerRef} />;
};

export default GameBoard;
