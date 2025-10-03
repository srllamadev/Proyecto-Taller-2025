import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../hooks/useGameStore';
import { GAME_CONFIG, COLORS } from '../../utils/constants';

function Projectiles() {
  const { projectiles, removeProjectile } = useGameStore();

  useFrame((state) => {
    const currentTime = state.clock.elapsedTime * 1000;
    
    // Actualizar posiciones y remover proyectiles vencidos
    projectiles.forEach(projectile => {
      if (currentTime - projectile.createdAt > projectile.lifetime) {
        removeProjectile(projectile.id);
      }
    });
  });

  return (
    <group>
      {projectiles.map(projectile => (
        <Projectile key={projectile.id} projectile={projectile} />
      ))}
    </group>
  );
}

function Projectile({ projectile }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Mover proyectil hacia adelante
      meshRef.current.position.x = projectile.position[0];
      meshRef.current.position.y = projectile.position[1];
      meshRef.current.position.z += projectile.velocity[2] * delta * 100;
      
      // Actualizar la posición en el proyectil
      projectile.position[2] = meshRef.current.position.z;
    }
  });

  return (
    <mesh ref={meshRef} position={projectile.position}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial 
        color={COLORS.LASER_BLUE} 
        emissive={COLORS.LASER_BLUE}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

export default Projectiles;