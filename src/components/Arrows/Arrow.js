// Arrows.js

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Arrow = ({ position, direction, scene, target }) => {
  const arrowRef = useRef(null); // Define arrowRef here

  useEffect(() => {
    console.log('Arrow Position:', position);

    const arrowGeometry = new THREE.BoxGeometry(0.1, 0.1, 1);
    const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);

    if (position) {
      arrow.position.copy(position);
      arrowRef.current = arrow;
      scene.add(arrow);
    }

    return () => {
      if (arrowRef.current) {
        scene.remove(arrowRef.current);
      }
    };
  }, [position, scene]);

  useEffect(() => {
    console.log('Arrow Position:', position); // Add this line

    // rest of your code
  }, [position, target]);

  useEffect(() => {
    const arrowSpeed = 0.1;

    const animateArrow = () => {
      if (arrowRef.current) {
        arrowRef.current.position.add(direction.clone().multiplyScalar(arrowSpeed));

        // You can add collision detection logic here if needed

        if (arrowRef.current.position.distanceTo(position) > 50) {
          scene.remove(arrowRef.current);
        } else {
          requestAnimationFrame(animateArrow);
        }
      }
    };

    animateArrow();
  }, [position, direction, scene]);

  return null; // Arrows are handled in the Three.js scene, not in the React DOM
};

export default Arrow;
