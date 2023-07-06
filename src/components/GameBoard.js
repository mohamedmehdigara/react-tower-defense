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
    camera.position.z = 5;

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create a tower
    const towerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const towerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    scene.add(tower);

    // Create enemies
    const enemyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
    enemy.position.x = 3;
    scene.add(enemy);

    // Create a path
    const pathPoints = [
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 0, 0),
    ];
    const pathSpline = new THREE.CatmullRomCurve3(pathPoints);
    const pathGeometry = new THREE.TubeGeometry(pathSpline, 64, 0.1, 8, false);
    const pathMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(path);

    // Animate the scene
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate tower
      tower.rotation.x += 0.01;
      tower.rotation.y += 0.01;

      // Move enemy along the path
      if (
        pathGeometry &&
        pathGeometry.parameters &&
        pathGeometry.parameters.path &&
        pathGeometry.parameters.path.curves &&
        pathGeometry.parameters.path.curves[0]
      ) {
        const pointOnPath = pathGeometry.parameters.path.curves[0].getPoint(
          (enemy.position.x + 2) / 4
        );
        enemy.position.copy(pointOnPath);
      }

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} />;
};

export default GameBoard;
