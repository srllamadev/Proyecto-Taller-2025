import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../../hooks/useGameStore';
import * as THREE from 'three';

function CameraController() {
  const { camera } = useThree();
  const { player } = useGameStore();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const playerPos = player.position;
    
    // Posición objetivo de la cámara (detrás y arriba de la nave)
    targetPosition.current.set(
      playerPos[0] + 0,
      playerPos[1] + 8,
      playerPos[2] + 12
    );
    
    // Punto al que debe mirar la cámara (ligeramente adelante de la nave)
    targetLookAt.current.set(
      playerPos[0],
      playerPos[1],
      playerPos[2] - 5
    );
    
    // Interpolación suave de la cámara
    camera.position.lerp(targetPosition.current, delta * 2);
    
    // Hacer que la cámara mire suavemente hacia el objetivo
    const lookAtTarget = new THREE.Vector3();
    lookAtTarget.copy(targetLookAt.current);
    camera.lookAt(lookAtTarget);
    
    // Pequeña rotación basada en el movimiento lateral para más dinamismo
    const sideMovement = playerPos[0] * 0.1;
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, -sideMovement, delta * 2);
  });

  return null;
}

export default CameraController;