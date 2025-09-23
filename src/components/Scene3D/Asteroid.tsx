import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AsteroidData } from '../../services/nasaApi';

interface AsteroidProps {
  asteroid: AsteroidData;
  position: [number, number, number];
  onHover: (asteroid: AsteroidData | null) => void;
  onClick: (asteroid: AsteroidData) => void;
  isHovered: boolean;
}

const Asteroid = ({ asteroid, position, onHover, onClick, isHovered }: AsteroidProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Get asteroid properties
  const diameterKm = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
  const isHazardous = asteroid.is_potentially_hazardous_asteroid;
  
  // Scale size for visualization (logarithmic scaling)
  const sceneSize = Math.max(0.05, Math.min(0.5, Math.log(diameterKm + 1) * 0.1));
  
  // Realistic asteroid colors based on composition and hazard level
  const getAsteroidColors = () => {
    if (isHazardous) {
      return {
        base: '#8b4513', // Dark brownish for hazardous
        emissive: '#ff4500',
        metallic: 0.3
      };
    } else {
      // Varied asteroid compositions
      const compositions = [
        { base: '#696969', emissive: '#a0a0a0', metallic: 0.1 }, // Stony
        { base: '#5d4e37', emissive: '#8b7355', metallic: 0.05 }, // Carbonaceous  
        { base: '#708090', emissive: '#b0c4de', metallic: 0.4 }, // Metallic
        { base: '#556b2f', emissive: '#9acd32', metallic: 0.15 } // Hydrated
      ];
      return compositions[Math.floor(Math.random() * compositions.length)];
    }
  };
  
  const { base: color, emissive: emissiveColor, metallic } = getAsteroidColors();

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
      
      // Pulsing effect for hazardous asteroids
      if (isHazardous) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
        meshRef.current.scale.setScalar(pulse);
      }
      
      // Hover effect
      if (isHovered || hovered) {
        meshRef.current.scale.setScalar(1.3);
      }
    }
  });

  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    setHovered(true);
    onHover(asteroid);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick(asteroid);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      scale={sceneSize}
    >
      {/* Irregular asteroid shape with more detail */}
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color={color}
        emissive={isHovered || hovered ? emissiveColor : '#000000'}
        emissiveIntensity={isHovered || hovered ? 0.2 : (isHazardous ? 0.05 : 0)}
        metalness={metallic}
        roughness={0.8}
        transparent={true}
        opacity={0.95}
      />
      
      {/* Glow effect for hazardous asteroids */}
      {isHazardous && (
        <mesh scale={1.5}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color={emissiveColor}
            transparent={true}
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </mesh>
  );
};

export default Asteroid;