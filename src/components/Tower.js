import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

const Tower = ({ position, target }) => {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // Create tower mesh
    const towerGeometry = new THREE.BoxGeometry(1, 3, 1);
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(position.x, position.y, position.z);

    // Add tower to scene
    target.scene.add(tower);

    // Define tower attributes
    const attackDamage = 10; // Adjust damage as needed
    const attackCooldown = 1000; // Cooldown in milliseconds

    // Function to handle tower attacks
    const attack = () => {
      if (cooldown <= 0 && target.enemies.length > 0) {
        // Find the closest enemy
        let closestEnemy = null;
        let closestDistance = Infinity;

        target.enemies.forEach((enemy) => {
          const distance = tower.position.distanceTo(enemy.position);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestEnemy = enemy;
          }
        });

        if (closestEnemy) {
          // Attack the closest enemy
          closestEnemy.takeDamage(attackDamage);
          setCooldown(attackCooldown);
        }
      }
    };

    // Animation loop for tower attacks
    const animate = () => {
      requestAnimationFrame(animate);

      // Reduce cooldown
      if (cooldown > 0) {
        setCooldown(cooldown - 1);
      }

      // Tower logic - implement your targeting and attack logic here
      attack();
    };

    animate();

    // Clean up when unmounted
    return () => {
      target.scene.remove(tower);
    };
  }, [position, target]);

  return null; // Towers are managed in the Three.js scene
};

export default Tower;
