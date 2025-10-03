import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../hooks/useGameStore';
import { generateAsteroidField } from '../../utils/generators';
import { GAME_CONFIG } from '../../utils/constants';
import Asteroid from './Asteroid';

function AsteroidField() {
  const { asteroids, setAsteroids } = useGameStore();
  const initialized = useRef(false);

  // Generar asteroides iniciales
  useEffect(() => {
    if (!initialized.current) {
      const initialAsteroids = generateAsteroidField(GAME_CONFIG.ASTEROIDS.COUNT);
      setAsteroids(initialAsteroids);
      initialized.current = true;
    }
  }, [setAsteroids]);

  // Actualizar posiciones de asteroides
  useFrame((state, delta) => {
    const updatedAsteroids = asteroids.map(asteroid => {
      // Actualizar rotación
      const newRotation = [
        asteroid.rotation[0] + asteroid.rotationSpeed[0],
        asteroid.rotation[1] + asteroid.rotationSpeed[1], 
        asteroid.rotation[2] + asteroid.rotationSpeed[2]
      ];

      // Actualizar posición con deriva
      const newPosition = [
        asteroid.position[0] + asteroid.velocity[0],
        asteroid.position[1] + asteroid.velocity[1],
        asteroid.position[2] + asteroid.velocity[2]
      ];

      // Respawn si están muy lejos
      const distance = Math.sqrt(
        newPosition[0] * newPosition[0] + 
        newPosition[1] * newPosition[1] + 
        newPosition[2] * newPosition[2]
      );

      if (distance > GAME_CONFIG.WORLD.BOUNDS) {
        // Reposicionar en el lado opuesto
        const angle = Math.random() * Math.PI * 2;
        const spawnDistance = 50 + Math.random() * 30;
        
        return {
          ...asteroid,
          position: [
            Math.cos(angle) * spawnDistance,
            (Math.random() - 0.5) * 20,
            Math.sin(angle) * spawnDistance
          ],
          rotation: newRotation
        };
      }

      return {
        ...asteroid,
        position: newPosition,
        rotation: newRotation
      };
    });

    if (JSON.stringify(updatedAsteroids) !== JSON.stringify(asteroids)) {
      setAsteroids(updatedAsteroids);
    }
  });

  return (
    <group>
      {asteroids.map(asteroid => (
        <Asteroid
          key={asteroid.id}
          asteroid={asteroid}
        />
      ))}
    </group>
  );
}

export default AsteroidField;