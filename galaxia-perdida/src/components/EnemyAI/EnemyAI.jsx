import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { useGameStore } from '../../hooks/useGameStore';
import { generateEnemyWave, createParticleExplosion, Math3D } from '../../utils/generators';
import { GAME_CONFIG, COLORS } from '../../utils/constants';
import * as THREE from 'three';

function EnemyAI() {
  const { 
    enemies, 
    addEnemy, 
    removeEnemy, 
    player, 
    updateScore, 
    addParticles,
    projectiles,
    removeProjectile,
    updatePlayerHealth,
    level 
  } = useGameStore();
  
  const lastWaveTime = useRef(0);

  // Generar enemigos periódicamente
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime * 1000;
    
    if (currentTime - lastWaveTime.current > GAME_CONFIG.ENEMIES.SPAWN_RATE) {
      const newEnemies = generateEnemyWave(level);
      newEnemies.forEach(enemy => addEnemy(enemy));
      lastWaveTime.current = currentTime;
    }
  });

  return (
    <group>
      {enemies.map(enemy => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
    </group>
  );
}

function Enemy({ enemy }) {
  const meshRef = useRef();
  const { 
    removeEnemy, 
    player, 
    updateScore, 
    addParticles, 
    projectiles, 
    removeProjectile,
    updatePlayerHealth 
  } = useGameStore();
  
  // Configuración de físicas
  const [ref, api] = useSphere(() => ({
    mass: 5,
    position: enemy.position,
    type: 'Dynamic'
  }));

  useFrame(() => {
    if (!ref.current) return;
    
    const enemyPos = ref.current.position;
    const playerPos = player.position;
    
    // IA: Perseguir al jugador
    const direction = [
      playerPos[0] - enemyPos.x,
      playerPos[1] - enemyPos.y,
      playerPos[2] - enemyPos.z
    ];
    
    const normalizedDirection = Math3D.normalize(direction);
    const moveSpeed = enemy.speed || GAME_CONFIG.ENEMIES.SPEED;
    
    // Aplicar movimiento hacia el jugador
    api.velocity.set(
      normalizedDirection[0] * moveSpeed * 10,
      normalizedDirection[1] * moveSpeed * 10,
      normalizedDirection[2] * moveSpeed * 10
    );
    
    // Rotar hacia el jugador
    if (meshRef.current) {
      meshRef.current.lookAt(playerPos[0], playerPos[1], playerPos[2]);
    }
    
    // Verificar colisión con proyectiles
    projectiles.forEach(projectile => {
      const distance = Math3D.distance(
        [enemyPos.x, enemyPos.y, enemyPos.z],
        projectile.position
      );
      
      if (distance < 1.0) {
        // Crear explosión
        const particles = createParticleExplosion([enemyPos.x, enemyPos.y, enemyPos.z], 1.5);
        addParticles(particles);
        
        // Actualizar puntuación
        updateScore(GAME_CONFIG.SCORING.ENEMY_DESTROYED);
        
        // Remover enemigo y proyectil
        removeEnemy(enemy.id);
        removeProjectile(projectile.id);
      }
    });
    
    // Verificar colisión con jugador
    const distanceToPlayer = Math3D.distance(
      [enemyPos.x, enemyPos.y, enemyPos.z],
      playerPos
    );
    
    if (distanceToPlayer < 1.5) {
      // Dañar al jugador
      updatePlayerHealth(GAME_CONFIG.ENEMIES.DAMAGE);
      
      // Crear explosión menor
      const particles = createParticleExplosion([enemyPos.x, enemyPos.y, enemyPos.z], 1.0);
      addParticles(particles);
      
      // Remover enemigo
      removeEnemy(enemy.id);
    }
  });

  // Crear geometría según el tipo de enemigo
  const getEnemyGeometry = () => {
    switch (enemy.type) {
      case 'heavy':
        return <octahedronGeometry args={[0.8, 0]} />;
      case 'light':
      default:
        return <tetrahedronGeometry args={[0.6, 0]} />;
    }
  };

  const getEnemyColor = () => {
    switch (enemy.type) {
      case 'heavy':
        return COLORS.WARNING_RED;
      case 'light':
      default:
        return COLORS.EXPLOSION_ORANGE;
    }
  };

  return (
    <group ref={ref}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {getEnemyGeometry()}
        <meshPhongMaterial 
          color={getEnemyColor()}
          emissive={getEnemyColor()}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Efectos de propulsión */}
      <mesh position={[0, 0, -1]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.2, 0.8, 6]} />
        <meshBasicMaterial 
          color={COLORS.EXPLOSION_ORANGE}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default EnemyAI;