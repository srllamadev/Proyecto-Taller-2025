import { create } from 'zustand';
import { GAME_CONFIG, GAME_STATES } from '../utils/constants';

export const useGameStore = create((set, get) => ({
  // Estado del juego
  gameState: GAME_STATES.MENU,
  score: 0,
  level: 1,
  
  // Estado del jugador
  player: {
    health: GAME_CONFIG.SPACESHIP.MAX_HEALTH,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    velocity: [0, 0, 0],
    powerUps: {
      shield: false,
      rapidFire: false,
      doubleShot: false
    }
  },
  
  // Enemigos y asteroides
  asteroids: [],
  enemies: [],
  projectiles: [],
  particles: [],
  
  // Configuración
  soundEnabled: true,
  musicEnabled: true,
  
  // Actions
  setGameState: (state) => set({ gameState: state }),
  
  updateScore: (points) => set((state) => ({ 
    score: state.score + points 
  })),
  
  updatePlayerHealth: (damage) => set((state) => ({
    player: {
      ...state.player,
      health: Math.max(0, state.player.health - damage)
    }
  })),
  
  updatePlayerPosition: (position) => set((state) => ({
    player: {
      ...state.player,
      position
    }
  })),
  
  addProjectile: (projectile) => set((state) => ({
    projectiles: [...state.projectiles, projectile]
  })),
  
  removeProjectile: (id) => set((state) => ({
    projectiles: state.projectiles.filter(p => p.id !== id)
  })),
  
  addParticles: (newParticles) => set((state) => ({
    particles: [...state.particles, ...newParticles]
  })),
  
  updateParticles: (updateFn) => set((state) => ({
    particles: state.particles.map(updateFn).filter(p => p.life > 0)
  })),
  
  setAsteroids: (asteroids) => set({ asteroids }),
  
  removeAsteroid: (id) => set((state) => ({
    asteroids: state.asteroids.filter(a => a.id !== id)
  })),
  
  addEnemy: (enemy) => set((state) => ({
    enemies: [...state.enemies, enemy]
  })),
  
  removeEnemy: (id) => set((state) => ({
    enemies: state.enemies.filter(e => e.id !== id)
  })),
  
  activatePowerUp: (type, duration) => set((state) => {
    const newPowerUps = { ...state.player.powerUps };
    newPowerUps[type] = true;
    
    // Auto-desactivar después del tiempo especificado
    setTimeout(() => {
      set((currentState) => ({
        player: {
          ...currentState.player,
          powerUps: {
            ...currentState.player.powerUps,
            [type]: false
          }
        }
      }));
    }, duration);
    
    return {
      player: {
        ...state.player,
        powerUps: newPowerUps
      }
    };
  }),
  
  resetGame: () => set({
    gameState: GAME_STATES.MENU,
    score: 0,
    level: 1,
    player: {
      health: GAME_CONFIG.SPACESHIP.MAX_HEALTH,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      velocity: [0, 0, 0],
      powerUps: {
        shield: false,
        rapidFire: false,
        doubleShot: false
      }
    },
    asteroids: [],
    enemies: [],
    projectiles: [],
    particles: []
  }),
  
  toggleSound: () => set((state) => ({ 
    soundEnabled: !state.soundEnabled 
  })),
  
  toggleMusic: () => set((state) => ({ 
    musicEnabled: !state.musicEnabled 
  }))
}));