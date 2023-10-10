import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const Tower = ({ position, target }) => {
  const [cooldown, setCooldown] = useState(0);
  const arrows = useRef([]);
  const towerRef = useRef(null);

  useEffect(() => {
    if (!target.scene) {
      return;
    }

    const TOWER_COLOR = 0xff0000;
    const ARROW_COLOR = 0x00ff00;
    const ATTACK_DAMAGE = 10;
    const ATTACK_COOLDOWN = 1000;
    const ARROW_SPEED = 0.05;

    const createTower = () => {
      const towerGeometry = new THREE.BoxGeometry(1, 3, 1);
      const towerMaterial = new THREE.MeshStandardMaterial({ color: TOWER_COLOR });
      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      tower.position.copy(position);

      target.scene.add(tower);
      towerRef.current = tower;
    };

    const createArrow = (direction) => {
      const arrowGeometry = new THREE.BoxGeometry(0.1, 0.1, 1);
      const arrowMaterial = new THREE.MeshStandardMaterial({ color: ARROW_COLOR });
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

    const animate = () => {
      requestAnimationFrame(animate);

      if (cooldown > 0) {
        setCooldown(cooldown - 1);
      }

      attack();
    };

    createTower();
    animate();
    animateArrows();

    return () => {
      target.scene.remove(towerRef.current);
      arrows.current.forEach(({ arrow }) => {
        target.scene.remove(arrow);
      });
    };
  }, [position, target, cooldown]);

  return null;
};

export default Tower;
