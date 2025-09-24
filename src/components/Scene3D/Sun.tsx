import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const Sun = () => {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      <mesh ref={sunRef} position={[0,0,0]}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial 
          emissive="#ffdd55"
          emissiveIntensity={2.5}
          color="#ffaa00"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* Glow mesh removed to prevent translucent ring behind Earth */}
    </group>
  );
};

export default Sun;
