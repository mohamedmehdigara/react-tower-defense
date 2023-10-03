import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GameBoard = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);

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

