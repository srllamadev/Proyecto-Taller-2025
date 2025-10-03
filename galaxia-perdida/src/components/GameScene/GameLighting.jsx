import { COLORS } from '../../utils/constants';

function GameLighting() {
  return (
    <>
      {/* Luz ambiental tenue para simular la luz estelar */}
      <ambientLight intensity={0.1} color={COLORS.NEBULA_PURPLE} />
      
      {/* Luz principal del "sol" (estrella lejana) */}
      <directionalLight
        position={[50, 50, 50]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Luces puntuales para efectos dramáticos */}
      <pointLight
        position={[0, 10, 0]}
        intensity={0.3}
        color={COLORS.LASER_BLUE}
        distance={100}
        decay={2}
      />
      
      {/* Luz de relleno desde abajo */}
      <pointLight
        position={[0, -20, 10]}
        intensity={0.2}
        color={COLORS.NEBULA_PURPLE}
        distance={50}
        decay={1}
      />
      
      {/* Efectos de niebla espacial */}
      <fog attach="fog" args={[COLORS.SPACE_DARK, 50, 200]} />
    </>
  );
}

export default GameLighting;