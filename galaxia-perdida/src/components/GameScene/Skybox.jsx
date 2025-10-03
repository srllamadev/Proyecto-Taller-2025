import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

function Skybox() {
  const meshRef = useRef();
  
  // Mientras no tenemos texturas reales, crearemos un skybox procedural
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.01; // Rotación lenta del skybox
    }
  });

  // Shader material para crear un efecto de nebulosa
  const nebulaShader = {
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec3 vWorldPosition;
      
      // Función de ruido simple
      float noise(vec3 p) {
        return sin(p.x * 2.0) * sin(p.y * 3.0) * sin(p.z * 1.5) * 0.5 + 0.5;
      }
      
      void main() {
        vec3 color1 = vec3(0.02, 0.02, 0.1); // Azul profundo
        vec3 color2 = vec3(0.3, 0.05, 0.3);  // Púrpura nebulosa
        vec3 color3 = vec3(0.1, 0.0, 0.2);   // Púrpura oscuro
        
        float n1 = noise(vWorldPosition * 0.01 + time * 0.1);
        float n2 = noise(vWorldPosition * 0.02 + time * 0.05);
        float n3 = noise(vWorldPosition * 0.005 + time * 0.02);
        
        vec3 finalColor = mix(color1, color2, n1);
        finalColor = mix(finalColor, color3, n2 * 0.5);
        finalColor += vec3(n3 * 0.1); // Brillo sutil
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    uniforms: {
      time: { value: 0 }
    }
  };

  useFrame((state) => {
    if (meshRef.current && meshRef.current.material.uniforms) {
      meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} scale={[500, 500, 500]}>
      <sphereGeometry args={[1, 64, 32]} />
      <shaderMaterial
        vertexShader={nebulaShader.vertexShader}
        fragmentShader={nebulaShader.fragmentShader}
        uniforms={nebulaShader.uniforms}
        side={THREE.BackSide} // Renderizar desde adentro
      />
    </mesh>
  );
}

export default Skybox;