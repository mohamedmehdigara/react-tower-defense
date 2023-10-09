import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const Tower = ({ position, target }) => {
  const [cooldown, setCooldown] = useState(0);
  const arrows = useRef([]);

  useEffect(() => {
    if (!target.scene) {
      return;
    }

    const towerGeometry = new THREE.BoxGeometry(1, 3, 1);
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.copy(position);

    target.scene.add(tower);

    const attackDamage = 10;
    const attackCooldown = 1000;
    const arrowSpeed = 0.05;

    const createArrow = (direction) => {
      const arrowGeometry = new THREE.BoxGeometry(0.1, 0.1, 1);
      const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.copy(position);
      arrows.current.push({ arrow, direction });
      target.scene.add(arrow);
    };

    const attack = () => {
      if (!target.enemies || !Array.isArray(target.enemies) || cooldown > 0 || target.enemies.length === 0) {
        return;
      }

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
        const direction = new THREE.Vector3().subVectors(closestEnemy.position, position).normalize();
        createArrow(direction);

        setCooldown(attackCooldown);
      }
    };

    const animateArrows = () => {
      arrows.current.forEach(({ arrow, direction }) => {
        arrow.position.add(direction.clone().multiplyScalar(arrowSpeed));

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

    const animate = () => {
      requestAnimationFrame(animate);

      if (cooldown > 0) {
        setCooldown(cooldown - 1);
      }

      attack();
    };

    animate();
    animateArrows();

    return () => {
      target.scene.remove(tower);
      arrows.current.forEach(({ arrow }) => {
        target.scene.remove(arrow);
      });
    };
  }, [position, target, cooldown]);

  return null;
};

export default Tower;