import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const Tower = ({ position, target }) => {
  // State to track the cooldown for tower attacks
  const [cooldown, setCooldown] = useState(0);

  // Ref to store arrows fired by the tower
  const arrows = useRef([]);

  // Ref to store the tower mesh for cleanup on unmount
  const towerRef = useRef(null);

  useEffect(() => {
    if (!target.scene) {
      return;
    }

    // Constants for tower and arrow properties
    const TOWER_COLOR = 0xff0000;
    const ARROW_COLOR = 0x00ff00;
    const ATTACK_DAMAGE = 10;
    const ATTACK_COOLDOWN = 1000;
    const ARROW_SPEED = 0.05;

    // Function to create the tower mesh and add it to the scene
    const createTower = () => {
      const towerGeometry = new THREE.BoxGeometry(1, 3, 1);
      const towerMaterial = new THREE.MeshStandardMaterial({ color: TOWER_COLOR });
      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      tower.position.copy(position);

      target.scene.add(tower);
      towerRef.current = tower;
    };

    // Function to create an arrow and add it to the scene
    const createArrow = (direction) => {
      const arrowGeometry = new THREE.BoxGeometry(0.1, 0.1, 1);
      const arrowMaterial = new THREE.MeshStandardMaterial({ color: ARROW_COLOR });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.copy(position);
      arrows.current.push({ arrow, direction });
      target.scene.add(arrow);
    };

    // Function to handle tower attacks
    const attack = () => {
      if (!target.enemies || !Array.isArray(target.enemies) || cooldown > 0 || target.enemies.length === 0) {
        return;
      }

      let closestEnemy = null;
      let closestDistance = Infinity;

      // Define towerPosition here in the same scope
      const towerPosition = new THREE.Vector3(position.x, position.y, position.z);

      target.enemies.forEach((enemy) => {
        const enemyPosition = new THREE.Vector3(enemy.position.x, enemy.position.y, enemy.position.z);

        const distance = towerPosition.distanceTo(enemyPosition);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      });

      if (closestEnemy) {
        const direction = new THREE.Vector3().subVectors(closestEnemy.position, towerPosition).normalize();
        createArrow(direction);

        setCooldown(ATTACK_COOLDOWN);
      }
    };

    // Function to animate the arrows and check for enemy hits
    const animateArrows = () => {
      arrows.current.forEach(({ arrow, direction }) => {
        arrow.position.add(direction.clone().multiplyScalar(ARROW_SPEED));

        target.enemies.forEach((enemy) => {
          if (arrow.position.distanceTo(enemy.position) < 0.1) {
            enemy.takeDamage(ATTACK_DAMAGE);
            target.scene.remove(arrow);
          }
        });

        if (arrow.position.distanceTo(position) > 50) {
          target.scene.remove(arrow);
        }
      });

      requestAnimationFrame(animateArrows);
    };

    // Main animation loop for tower attacks and cooldown
    const animate = () => {
      requestAnimationFrame(animate);

      if (cooldown > 0) {
        setCooldown(cooldown - 1);
      }

      attack();
    };

    // Initial tower setup and animation
    createTower();
    animate();
    animateArrows();

    // Cleanup function to remove tower and arrows from the scene
    return () => {
      target.scene.remove(towerRef.current);
      arrows.current.forEach(({ arrow }) => {
        target.scene.remove(arrow);
      });
    };
  }, [position, target, cooldown]);

  // Return null as this component does not render any visible elements
  return null;
};

export default Tower;
