import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Asteroid from './Asteroid';
import { AsteroidData } from '../../services/nasaApi';
import OrbitRing from './OrbitRing';

interface AsteroidFieldProps {
  asteroids: AsteroidData[];
  onHover: (asteroid: AsteroidData | null) => void;
  onClick: (asteroid: AsteroidData) => void;
  hoveredAsteroid: AsteroidData | null;
}

const AsteroidField = ({ asteroids, onHover, onClick, hoveredAsteroid }: AsteroidFieldProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Orbital parameters for each asteroid
  const orbits = useMemo(() => {
    // Base orbital list with derived radii
    const base = asteroids.map((asteroid, index) => {
      const approachData = asteroid.close_approach_data[0];
      let radius = 12 + Math.random() * 8; // fallback band
      if (approachData) {
        const auDistance = parseFloat(approachData.miss_distance.astronomical || '0.25');
        radius = THREE.MathUtils.clamp(auDistance * 55, 7, 28);
      }
      return { rawRadius: radius, asteroid, index };
    });

    // Sort by radius then enforce minimum spacing
    base.sort((a,b) => a.rawRadius - b.rawRadius);
    const minGap = 0.55;
    let last = -Infinity;
    base.forEach(b => {
      if (b.rawRadius - last < minGap) b.rawRadius = last + minGap;
      last = b.rawRadius;
    });

    // Shuffle back to original-ish order for motion variance
    base.sort((a,b) => a.index - b.index);

    return base.map(({ rawRadius, asteroid }, i) => {
      const inclination = (Math.random() - 0.5) * 0.25; // lower tilt for cleaner look
      const ascendingNode = Math.random() * Math.PI * 2;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.09 / rawRadius) * (0.6 + Math.random()*0.8);
      const verticalJitter = (Math.random() - 0.5) * 0.4; // small Y offset for depth
      return { radius: rawRadius, inclination, ascendingNode, angle, speed, verticalJitter, asteroid };
    });
  }, [asteroids]);

  // Animated positions
  const positionsRef = useRef<{ x: number; y: number; z: number; }[]>([]);
  if (positionsRef.current.length !== asteroids.length) {
    positionsRef.current = new Array(asteroids.length).fill(null).map(() => ({ x:0,y:0,z:0 }));
  }

  useFrame((_, delta) => {
    orbits.forEach((o, i) => {
      o.angle += o.speed * delta;
      const x = o.radius * Math.cos(o.angle);
      const z = o.radius * Math.sin(o.angle);
      const vec = new THREE.Vector3(x, o.verticalJitter, z);
      // Rotate by ascending node then inclination
      vec.applyAxisAngle(new THREE.Vector3(0,1,0), o.ascendingNode);
      vec.applyAxisAngle(new THREE.Vector3(1,0,0), o.inclination);
      positionsRef.current[i].x = vec.x;
      positionsRef.current[i].y = vec.y;
      positionsRef.current[i].z = vec.z;
    });
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.002; // very slow global drift
  });

  return (
    <group ref={groupRef}>
      {/* Orbit paths */}
      {orbits.map((o, i) => {
        // Only render orbit for: first 15, hazardous, or every 6th after that
        const show = i < 15 || o.asteroid.is_potentially_hazardous_asteroid || i % 6 === 0;
        if (!show) return null;
        const hazardous = o.asteroid.is_potentially_hazardous_asteroid;
        return (
          <OrbitRing
            key={`orbit-${i}`}
            radius={o.radius}
            inclination={o.inclination}
            ascendingNode={o.ascendingNode}
            opacity={hazardous ? 0.5 : 0.15}
            color={hazardous ? '#ff7043' : '#404953'}
          />
        );
      })}

      {/* Asteroids */}
      {asteroids.map((asteroid, index) => (
        <Asteroid
          key={asteroid.id}
          asteroid={asteroid}
          position={[
            positionsRef.current[index]?.x || 0,
            positionsRef.current[index]?.y || 0,
            positionsRef.current[index]?.z || 0
          ]}
          onHover={onHover}
          onClick={onClick}
          isHovered={hoveredAsteroid?.id === asteroid.id}
        />
      ))}
    </group>
  );
};

export default AsteroidField;