import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useGameStore } from '../../hooks/useGameStore';
import { GAME_CONFIG, COLORS } from '../../utils/constants';
import * as THREE from 'three';

function Spaceship() {
  const groupRef = useRef();
  const trailRef = useRef();
  
  // Estado del juego
  const { updatePlayerPosition, addProjectile, player } = useGameStore();
  
  // Controles de teclado
  const { keys } = useKeyboardControls();
  
  // Configuración de físicas
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 0, 0],
    type: 'Dynamic',
    material: {
      friction: 0.1,
      restitution: 0.3
    }
  }));
  
  // Sistema de disparo
  const lastShot = useRef(0);
  
  useFrame((state, delta) => {
    if (!ref.current || !groupRef.current) return;
    
    const velocity = [0, 0, 0];
    const currentTime = state.clock.elapsedTime * 1000;
    
    // Controles de movimiento
    if (keys.forward) velocity[2] -= GAME_CONFIG.SPACESHIP.SPEED;
    if (keys.backward) velocity[2] += GAME_CONFIG.SPACESHIP.SPEED;
    if (keys.left) velocity[0] -= GAME_CONFIG.SPACESHIP.SPEED;
    if (keys.right) velocity[0] += GAME_CONFIG.SPACESHIP.SPEED;
    
    // Aplicar velocidad
    api.velocity.set(velocity[0], velocity[1], velocity[2]);
    
    // Rotación basada en movimiento
    if (keys.left) {
      groupRef.current.rotation.z = Math.min(groupRef.current.rotation.z + delta * 2, 0.5);
      groupRef.current.rotation.y = Math.min(groupRef.current.rotation.y + delta, 0.3);
    } else if (keys.right) {
      groupRef.current.rotation.z = Math.max(groupRef.current.rotation.z - delta * 2, -0.5);
      groupRef.current.rotation.y = Math.max(groupRef.current.rotation.y - delta, -0.3);
    } else {
      // Volver a posición neutral
      groupRef.current.rotation.z *= 0.95;
      groupRef.current.rotation.y *= 0.95;
    }
    
    if (keys.forward) {
      groupRef.current.rotation.x = Math.min(groupRef.current.rotation.x + delta, 0.2);
    } else if (keys.backward) {
      groupRef.current.rotation.x = Math.max(groupRef.current.rotation.x - delta, -0.2);
    } else {
      groupRef.current.rotation.x *= 0.95;
    }
    
    // Sistema de disparo
    if (keys.fire && currentTime - lastShot.current > GAME_CONFIG.SPACESHIP.FIRE_RATE) {
      const position = ref.current.position;
      const projectile = {
        id: `projectile-${Date.now()}`,
        position: [position.x, position.y, position.z + 1],
        velocity: [0, 0, GAME_CONFIG.PROJECTILES.SPEED],
        damage: GAME_CONFIG.PROJECTILES.DAMAGE,
        lifetime: GAME_CONFIG.PROJECTILES.LIFETIME,
        createdAt: currentTime
      };
      
      addProjectile(projectile);
      lastShot.current = currentTime;
    }
    
    // Actualizar posición en el store
    updatePlayerPosition([ref.current.position.x, ref.current.position.y, ref.current.position.z]);
    
    // Efecto de estela
    if (trailRef.current && (keys.forward || velocity[0] !== 0 || velocity[2] !== 0)) {
      trailRef.current.material.opacity = 0.8;
    } else if (trailRef.current) {
      trailRef.current.material.opacity *= 0.95;
    }
  });
  
  return (
    <group ref={groupRef}>
      <group ref={ref}>
        <mesh castShadow receiveShadow>
          {/* Cuerpo principal de la nave */}
          <coneGeometry args={[0.5, 2, 8]} />
          <meshPhongMaterial color={COLORS.UI_GREEN} emissive="#002200" />
        </mesh>
        
        {/* Alas de la nave */}
        <mesh position={[-0.8, 0, -0.5]} castShadow>
          <boxGeometry args={[0.6, 0.1, 0.8]} />
          <meshPhongMaterial color="#666666" />
        </mesh>
        
        <mesh position={[0.8, 0, -0.5]} castShadow>
          <boxGeometry args={[0.6, 0.1, 0.8]} />
          <meshPhongMaterial color="#666666" />
        </mesh>
        
        {/* Motores/propulsores */}
        <mesh position={[-0.6, 0, -1.2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.6]} />
          <meshPhongMaterial color="#333333" emissive="#001100" />
        </mesh>
        
        <mesh position={[0.6, 0, -1.2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.6]} />
          <meshPhongMaterial color="#333333" emissive="#001100" />
        </mesh>
        
        {/* Estela de propulsión */}
        <mesh ref={trailRef} position={[0, 0, -2]}>
          <coneGeometry args={[0.3, 1.5, 6]} />
          <meshBasicMaterial 
            color={COLORS.LASER_BLUE} 
            transparent 
            opacity={0}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      
      {/* Escudo visual cuando está activo */}
      {player.powerUps.shield && (
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial 
            color={COLORS.LASER_BLUE}
            transparent
            opacity={0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

export default Spaceship;