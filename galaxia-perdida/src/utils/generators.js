import * as THREE from 'three';
import { GAME_CONFIG } from './constants';

// Generador de posiciones aleatorias para asteroides
export function generateAsteroidField(count) {
  const asteroids = [];
  
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * GAME_CONFIG.ASTEROIDS.SPAWN_DISTANCE;
    
    asteroids.push({
      id: i,
      position: [
        Math.cos(angle) * distance,
        (Math.random() - 0.5) * 20,
        Math.sin(angle) * distance
      ],
      rotation: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ],
      scale: GAME_CONFIG.ASTEROIDS.MIN_SIZE + 
             Math.random() * (GAME_CONFIG.ASTEROIDS.MAX_SIZE - GAME_CONFIG.ASTEROIDS.MIN_SIZE),
      rotationSpeed: [
        (Math.random() - 0.5) * GAME_CONFIG.ASTEROIDS.ROTATION_SPEED,
        (Math.random() - 0.5) * GAME_CONFIG.ASTEROIDS.ROTATION_SPEED,
        (Math.random() - 0.5) * GAME_CONFIG.ASTEROIDS.ROTATION_SPEED
      ],
      velocity: [
        (Math.random() - 0.5) * GAME_CONFIG.ASTEROIDS.DRIFT_SPEED,
        (Math.random() - 0.5) * GAME_CONFIG.ASTEROIDS.DRIFT_SPEED,
        (Math.random() - 0.5) * GAME_CONFIG.ASTEROIDS.DRIFT_SPEED
      ]
    });
  }
  
  return asteroids;
}

// Generador de patrones de enemigos
export function generateEnemyWave(waveNumber) {
  const enemies = [];
  const enemyCount = Math.min(3 + waveNumber, 12);
  
  for (let i = 0; i < enemyCount; i++) {
    const angle = (i / enemyCount) * Math.PI * 2;
    const radius = 50 + waveNumber * 5;
    
    enemies.push({
      id: `enemy-${waveNumber}-${i}`,
      position: [
        Math.cos(angle) * radius,
        Math.sin(i * 0.5) * 10,
        Math.sin(angle) * radius
      ],
      health: GAME_CONFIG.ENEMIES.HEALTH + waveNumber * 10,
      speed: GAME_CONFIG.ENEMIES.SPEED + waveNumber * 0.01,
      type: i % 3 === 0 ? 'heavy' : 'light' // Tipos diferentes de enemigos
    });
  }
  
  return enemies;
}

// Función para crear patrones de partículas
export function createParticleExplosion(position, intensity = 1) {
  const particles = [];
  const particleCount = Math.floor(20 * intensity);
  
  for (let i = 0; i < particleCount; i++) {
    const direction = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ).normalize();
    
    particles.push({
      id: `particle-${Date.now()}-${i}`,
      position: [...position],
      velocity: direction.multiplyScalar(0.1 + Math.random() * 0.2).toArray(),
      life: 1.0,
      decay: 0.02 + Math.random() * 0.03,
      size: 0.1 + Math.random() * 0.3,
      color: [1, 0.5 + Math.random() * 0.5, 0] // Orange to yellow
    });
  }
  
  return particles;
}

// Función para generar ruido procedural (para texturas o patrones)
export function noise2D(x, y) {
  let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

// Función para interpolación suave
export function smoothstep(min, max, value) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return t * t * (3 - 2 * t);
}

// Pool de objetos para optimización
export class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.active = [];
    
    // Pre-poblar el pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  
  get() {
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.createFn();
    }
    this.active.push(obj);
    return obj;
  }
  
  release(obj) {
    const index = this.active.indexOf(obj);
    if (index > -1) {
      this.active.splice(index, 1);
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }
  
  releaseAll() {
    while (this.active.length > 0) {
      this.release(this.active[0]);
    }
  }
}

// Utilidades matemáticas para 3D
export const Math3D = {
  // Distancia entre dos puntos 3D
  distance: (a, b) => {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },
  
  // Normalizar vector 3D
  normalize: (v) => {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return length > 0 ? [v[0] / length, v[1] / length, v[2] / length] : [0, 0, 0];
  },
  
  // Producto punto
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  
  // Lerp entre dos vectores
  lerp: (a, b, t) => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  ]
};