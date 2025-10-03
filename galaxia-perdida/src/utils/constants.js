// Configuraciones del juego "Galaxia Perdida"

export const GAME_CONFIG = {
  // Configuración de la nave
  SPACESHIP: {
    SPEED: 0.15,
    ROTATION_SPEED: 0.05,
    MAX_HEALTH: 100,
    FIRE_RATE: 200, // milisegundos
    MODEL_SCALE: 0.5
  },

  // Configuración de asteroides
  ASTEROIDS: {
    COUNT: 50,
    MIN_SIZE: 0.5,
    MAX_SIZE: 2.5,
    SPAWN_DISTANCE: 100,
    ROTATION_SPEED: 0.01,
    DRIFT_SPEED: 0.02
  },

  // Configuración de enemigos
  ENEMIES: {
    SPAWN_RATE: 5000, // milisegundos
    SPEED: 0.08,
    HEALTH: 30,
    DAMAGE: 10
  },

  // Configuración de proyectiles
  PROJECTILES: {
    SPEED: 0.8,
    DAMAGE: 25,
    LIFETIME: 3000, // milisegundos
    COLOR: '#00ffff'
  },

  // Configuración de la cámara
  CAMERA: {
    POSITION: [0, 5, 10],
    FOV: 75,
    NEAR: 0.1,
    FAR: 1000
  },

  // Configuración del mundo
  WORLD: {
    BOUNDS: 200,
    GRAVITY: [0, 0, 0]
  },

  // Puntuación
  SCORING: {
    ASTEROID_HIT: 10,
    ENEMY_DESTROYED: 50,
    SURVIVAL_BONUS: 1 // por segundo
  },

  // Power-ups
  POWERUPS: {
    SHIELD_DURATION: 10000,
    RAPID_FIRE_DURATION: 8000,
    HEALTH_RESTORE: 25
  }
};

export const CONTROLS = {
  MOVE_FORWARD: 'KeyW',
  MOVE_BACKWARD: 'KeyS', 
  MOVE_LEFT: 'KeyA',
  MOVE_RIGHT: 'KeyD',
  FIRE: 'Space',
  PAUSE: 'KeyP'
};

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over'
};

export const COLORS = {
  SPACE_DARK: '#0a0a0f',
  NEBULA_PURPLE: '#4a0e4e',
  LASER_BLUE: '#00ffff',
  EXPLOSION_ORANGE: '#ff4500',
  UI_GREEN: '#00ff00',
  WARNING_RED: '#ff0000'
};