import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../hooks/useGameStore';
import * as THREE from 'three';

function ParticleSystem() {
  const { particles, updateParticles } = useGameStore();
  const particleRefs = useRef({});

  useFrame((state, delta) => {
    // Actualizar partículas
    updateParticles((particle) => {
      if (particleRefs.current[particle.id]) {
        const mesh = particleRefs.current[particle.id];
        
        // Actualizar posición
        particle.position[0] += particle.velocity[0];
        particle.position[1] += particle.velocity[1];
        particle.position[2] += particle.velocity[2];
        
        // Actualizar vida
        particle.life -= particle.decay;
        
        // Actualizar mesh
        mesh.position.set(...particle.position);
        mesh.scale.setScalar(particle.size * particle.life);
        mesh.material.opacity = particle.life;
        
        // Aplicar color que cambia con el tiempo
        const r = particle.color[0];
        const g = particle.color[1] * particle.life;
        const b = particle.color[2] * particle.life;
        mesh.material.color.setRGB(r, g, b);
      }
      
      return particle;
    });
  });

  return (
    <group>
      {particles.map(particle => (
        <Particle 
          key={particle.id} 
          particle={particle} 
          particleRefs={particleRefs}
        />
      ))}
    </group>
  );
}

function Particle({ particle, particleRefs }) {
  const meshRef = useRef();

  // Registrar la referencia
  if (meshRef.current && !particleRefs.current[particle.id]) {
    particleRefs.current[particle.id] = meshRef.current;
  }

  return (
    <mesh 
      ref={meshRef}
      position={particle.position}
      scale={particle.size}
    >
      <sphereGeometry args={[0.05, 6, 6]} />
      <meshBasicMaterial 
        color={new THREE.Color(...particle.color)}
        transparent
        opacity={particle.life}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default ParticleSystem;