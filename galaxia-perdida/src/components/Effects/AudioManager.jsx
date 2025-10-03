import { useRef, useEffect } from 'react';
import { Howl, Howler } from 'howler';
import { useGameStore } from '../../hooks/useGameStore';

// Definir sonidos (por ahora sin archivos de audio, solo la estructura)
const SOUNDS = {
  shoot: null, // Aquí iría: new Howl({ src: ['path/to/shoot.mp3'] })
  explosion: null,
  enemyHit: null,
  backgroundMusic: null
};

function AudioManager() {
  const { soundEnabled, musicEnabled, projectiles, particles } = useGameStore();
  const prevProjectilesCount = useRef(0);
  const prevParticlesCount = useRef(0);

  useEffect(() => {
    // Configurar volumen general
    Howler.volume(soundEnabled ? 0.7 : 0);
  }, [soundEnabled]);

  useEffect(() => {
    // Detectar nuevos disparos
    if (projectiles.length > prevProjectilesCount.current) {
      // Aquí reproduciríamos el sonido de disparo
      // SOUNDS.shoot?.play();
      console.log('🔫 Sonido de disparo');
    }
    prevProjectilesCount.current = projectiles.length;
  }, [projectiles.length]);

  useEffect(() => {
    // Detectar explosiones (nuevas partículas)
    if (particles.length > prevParticlesCount.current) {
      // Aquí reproduciríamos el sonido de explosión
      // SOUNDS.explosion?.play();
      console.log('💥 Sonido de explosión');
    }
    prevParticlesCount.current = particles.length;
  }, [particles.length]);

  useEffect(() => {
    // Música de fondo
    if (musicEnabled) {
      // Aquí iniciaríamos la música de fondo
      // SOUNDS.backgroundMusic?.play();
      console.log('🎵 Música de fondo activada');
    } else {
      // SOUNDS.backgroundMusic?.pause();
      console.log('🔇 Música de fondo pausada');
    }
  }, [musicEnabled]);

  return null; // Este componente no renderiza nada
}

export default AudioManager;