import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Physics } from '@react-three/cannon';
import { Stars, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

import Spaceship from '../Spaceship/Spaceship';
import AsteroidField from '../Asteroids/AsteroidField';
import EnemyAI from '../EnemyAI/EnemyAI';
import Projectiles from '../Effects/Projectiles';
import ParticleSystem from '../Effects/ParticleSystem';
import GameLighting from './GameLighting';
import CameraController from './CameraController';
import Skybox from './Skybox';
import { GAME_CONFIG, COLORS } from '../../utils/constants';

function GameScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: COLORS.SPACE_DARK }}>
      <Canvas
        shadows
        camera={{
          position: GAME_CONFIG.CAMERA.POSITION,
          fov: GAME_CONFIG.CAMERA.FOV,
          near: GAME_CONFIG.CAMERA.NEAR,
          far: GAME_CONFIG.CAMERA.FAR
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        {/* Monitor de rendimiento para optimización dinámica */}
        <PerformanceMonitor
          onIncline={() => console.log('Performance mejorada')}
          onDecline={() => console.log('Performance degradada')}
        />

        {/* Color de fondo del espacio */}
        <color attach="background" args={[COLORS.SPACE_DARK]} />
        
        {/* Configuración de físicas */}
        <Physics
          gravity={GAME_CONFIG.WORLD.GRAVITY}
          iterations={20}
          tolerance={0.0001}
          allowSleep={false}
          broadphase="SAP"
        >
          {/* Controlador de cámara */}
          <CameraController />
          
          <Suspense fallback={null}>
            {/* Sistema de iluminación */}
            <GameLighting />
            
            {/* Skybox estelar */}
            <Skybox />
            
            {/* Campo de estrellas */}
            <Stars
              radius={300}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={0.5}
            />
            
            {/* Nave del jugador */}
            <Spaceship />
            
            {/* Campo de asteroides */}
            <AsteroidField />
            
            {/* Enemigos IA */}
            <EnemyAI />
            
            {/* Proyectiles */}
            <Projectiles />
            
            {/* Sistema de partículas */}
            <ParticleSystem />
            
          </Suspense>
        </Physics>

        {/* Efectos de post-procesado */}
        <EffectComposer>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
            blendFunction={BlendFunction.ADDITIVE}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.0005, 0.0012]}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default GameScene;