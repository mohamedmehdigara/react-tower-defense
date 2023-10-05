import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const Tower = ({ position, target }) => {
  const [cooldown, setCooldown] = useState(0);
  const arrows = useRef([]); // Ref to store arrow objects

  useEffect(() => {
    // Check if the target.scene is available
    if (!target.scene) {
      return;
    }

    // Create tower mesh
    const towerGeometry = new THREE.BoxGeometry(1, 3, 1);
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.copy(position);

    // Add tower to scene
    target.scene.add(tower);

    // Define tower attributes
    const attackDamage = 10; // Adjust damage as needed
    const attackCooldown = 1000; // Cooldown in milliseconds
    const arrowSpeed = 0.05; // Adjust arrow speed

    // Function to create an arrow
    const createArrow = (direction) => {
      const arrowGeometry = new THREE.BoxGeometry(0.1, 0.1, 1);
      const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.copy(position);
      arrows.current.push({ arrow, direction }); // Add arrow and direction to the arrow list
      target.scene.add(arrow);
    };

    // Function to handle tower attacks
    const attack = () => {
      if (!target.enemies || !Array.isArray(target.enemies) || cooldown > 0 || target.enemies.length === 0) {
        return; // No valid enemies to attack
      }

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
        // Create and animate an arrow towards the closest enemy
        const direction = new THREE.Vector3().subVectors(closestEnemy.position, position).normalize();
        createArrow(direction);

        setCooldown(attackCooldown);
      }
    };

    // Function to animate arrows
    const animateArrows = () => {
      arrows.current.forEach(({ arrow, direction }) => {
        arrow.position.add(direction.clone().multiplyScalar(arrowSpeed));

        // Check if the arrow hit an enemy or went out of bounds
        target.enemies.forEach((enemy) => {
          if (arrow.position.distanceTo(enemy.position) < 0.1) {
            enemy.takeDamage(attackDamage);
            target.scene.remove(arrow);
          }
        });

        if (arrow.position.distanceTo(position) > 50) {
          target.scene.remove(arrow);
        }
      });

      requestAnimationFrame(animateArrows);
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
    animateArrows();

    // Clean up when unmounted
    return () => {
      target.scene.remove(tower);
      arrows.current.forEach(({ arrow }) => {
        target.scene.remove(arrow);
      });
    };
  }, [position, target, cooldown]);

  return null; // Towers are managed in the Three.js scene
};

export default Tower;
