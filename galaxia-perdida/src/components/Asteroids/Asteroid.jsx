import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { useGameStore } from '../../hooks/useGameStore';
import { createParticleExplosion } from '../../utils/generators';
import { COLORS } from '../../utils/constants';
import * as THREE from 'three';

function Asteroid({ asteroid }) {
  const meshRef = useRef();
  const { removeAsteroid, updateScore, addParticles, projectiles, removeProjectile } = useGameStore();
  
  // Configuración de físicas
  const [ref, api] = useSphere(() => ({
    mass: asteroid.scale * 10,
    position: asteroid.position,
    type: 'Dynamic',
    material: {
      friction: 0.8,
      restitution: 0.2
    }
  }));

  // Verificar colisiones con proyectiles
  useFrame(() => {
    if (!ref.current) return;
    
    const asteroidPos = ref.current.position;
    
    projectiles.forEach(projectile => {
      const distance = Math.sqrt(
        Math.pow(asteroidPos.x - projectile.position[0], 2) +
        Math.pow(asteroidPos.y - projectile.position[1], 2) +
        Math.pow(asteroidPos.z - projectile.position[2], 2)
      );
      
      // Radio de colisión basado en el tamaño del asteroide
      const collisionRadius = asteroid.scale * 0.8;
      
      if (distance < collisionRadius) {
        // Crear explosión de partículas
        const particles = createParticleExplosion([asteroidPos.x, asteroidPos.y, asteroidPos.z], asteroid.scale);
        addParticles(particles);
        
        // Actualizar puntuación
        updateScore(Math.floor(asteroid.scale * 10));
        
        // Remover asteroide y proyectil
        removeAsteroid(asteroid.id);
        removeProjectile(projectile.id);
      }
    });
  });

  // Actualizar transformaciones
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = asteroid.rotation[0];
      meshRef.current.rotation.y = asteroid.rotation[1];
      meshRef.current.rotation.z = asteroid.rotation[2];
    }
  });

  // Crear geometría irregular para cada asteroide
  const createAsteroidGeometry = () => {
    const geometry = new THREE.DodecahedronGeometry(1, 1);
    const vertices = geometry.attributes.position.array;
    
    // Deformar vértices para crear forma irregular
    for (let i = 0; i < vertices.length; i += 3) {
      const noise = 0.8 + Math.random() * 0.4; // Factor de deformación
      vertices[i] *= noise;     // x
      vertices[i + 1] *= noise; // y
      vertices[i + 2] *= noise; // z
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  };

  return (
    <mesh 
      ref={meshRef}
      position={asteroid.position}
      scale={asteroid.scale}
      castShadow
      receiveShadow
    >
      <primitive object={createAsteroidGeometry()} />
      <meshPhongMaterial 
        color="#8B4513"
        roughness={0.9}
        metalness={0.1}
        emissive="#2a1810"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

export default Asteroid;