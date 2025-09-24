import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';
import AsteroidField from './AsteroidField';
import { Lighting } from './Lighting';
import LoadingSpinner from '../UI/LoadingSpinner';
import Sun from './Sun';
import AsteroidBelt from './AsteroidBelt';

interface Scene3DProps {
  asteroids: any[];
  onAsteroidHover: (asteroid: any | null) => void;
  onAsteroidClick: (asteroid: any) => void;
  hoveredAsteroid: any | null;
}

const Scene3D = ({ 
  asteroids, 
  onAsteroidHover, 
  onAsteroidClick, 
  hoveredAsteroid 
}: Scene3DProps) => {
  return (
    <div className="w-full h-full starfield">
      <Canvas
        camera={{ 
          position: [0, 0, 15], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          {/* Central star (Sun) & lighting */}
          <Lighting />
          <Sun />
          
          {/* Background stars */}
          <Stars 
            radius={300} 
            depth={60} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5} 
          />
          
          {/* Earth at center */}
          <Earth />

          {/* Main asteroid belt background */}
          <AsteroidBelt />
          
          {/* Asteroid field */}
          <AsteroidField 
            asteroids={asteroids}
            onHover={onAsteroidHover}
            onClick={onAsteroidClick}
            hoveredAsteroid={hoveredAsteroid}
          />
          
          {/* Camera controls */}
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.8}
            rotateSpeed={0.5}
            minDistance={8}
            maxDistance={50}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        </Suspense>
      </Canvas>
      
      {/* Loading overlay */}
      <Suspense fallback={<LoadingSpinner />}>
        <div />
      </Suspense>
    </div>
  );
};

export default Scene3D;