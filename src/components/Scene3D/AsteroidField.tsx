import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Asteroid from './Asteroid';
import { AsteroidData } from '../../services/nasaApi';

interface AsteroidFieldProps {
  asteroids: AsteroidData[];
  onHover: (asteroid: AsteroidData | null) => void;
  onClick: (asteroid: AsteroidData) => void;
  hoveredAsteroid: AsteroidData | null;
}

const AsteroidField = ({ asteroids, onHover, onClick, hoveredAsteroid }: AsteroidFieldProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate positions for asteroids based on their distance data
  const asteroidPositions = useMemo(() => {
    return asteroids.map((asteroid, index) => {
      const approachData = asteroid.close_approach_data[0];
      if (!approachData) {
        // Fallback positioning
        const angle = (index / asteroids.length) * Math.PI * 2;
        const distance = 8 + Math.random() * 15;
        return {
          x: Math.cos(angle) * distance,
          y: (Math.random() - 0.5) * 10,
          z: Math.sin(angle) * distance,
        };
      }

      // Convert astronomical units to scene units
      const auDistance = parseFloat(approachData.miss_distance.astronomical);
      const sceneDistance = Math.max(8, Math.min(25, auDistance * 50)); // Scale and clamp
      
      // Position based on time until approach
      const approachDate = new Date(approachData.close_approach_date_full);
      const now = new Date();
      const timeDiff = approachDate.getTime() - now.getTime();
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      
      // Spread asteroids in a sphere around Earth
      const phi = Math.acos(2 * Math.random() - 1); // Uniform distribution on sphere
      const theta = 2 * Math.PI * Math.random();
      
      return {
        x: sceneDistance * Math.sin(phi) * Math.cos(theta),
        y: sceneDistance * Math.sin(phi) * Math.sin(theta),
        z: sceneDistance * Math.cos(phi),
        daysDiff,
      };
    });
  }, [asteroids]);

  // Subtle rotation of the entire field
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {asteroids.map((asteroid, index) => {
        const position = asteroidPositions[index];
        if (!position) return null;

        return (
          <Asteroid
            key={asteroid.id}
            asteroid={asteroid}
            position={[position.x, position.y, position.z]}
            onHover={onHover}
            onClick={onClick}
            isHovered={hoveredAsteroid?.id === asteroid.id}
          />
        );
      })}
    </group>
  );
};

export default AsteroidField;