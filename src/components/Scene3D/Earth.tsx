import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  // For now, we'll use procedural textures since we can't load external images
  // In a real implementation, you'd load NASA's Blue Marble textures
  
  useFrame((state, delta) => {
    // Earth rotation disabled for static view
    // if (earthRef.current) {
    //   earthRef.current.rotation.y += delta * 0.1; // Slow Earth rotation
    // }
    // if (atmosphereRef.current) {
    //   atmosphereRef.current.rotation.y += delta * 0.05; // Even slower atmosphere
    // }
  });

  // Create realistic Earth-like texture
  const createEarthTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base ocean color
    ctx.fillStyle = '#0f4c75';
    ctx.fillRect(0, 0, 1024, 512);
    
    // Create realistic continents using Perlin-like noise
    const createLandMass = (x: number, y: number, width: number, height: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        const variance = Math.random() * 0.3 + 0.7;
        const px = x + Math.cos(angle) * width * variance;
        const py = y + Math.sin(angle) * height * variance;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };
    
    // Major continents with realistic colors
    createLandMass(200, 200, 80, 60, '#2d5016'); // North America
    createLandMass(350, 220, 100, 80, '#3d6b1e'); // Europe/Asia
    createLandMass(450, 300, 60, 90, '#4a7c22'); // Africa
    createLandMass(150, 320, 70, 50, '#5d8f2a'); // South America
    createLandMass(600, 350, 80, 40, '#6ba032'); // Australia
    
    // Add mountain ranges and details
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const size = Math.random() * 8 + 2;
      
      // Check if we're on land (not pure ocean blue)
      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b] = imageData.data;
      
      if (r > 30 || g > 60 || b > 120) { // On land
        ctx.fillStyle = Math.random() > 0.7 ? '#8b7355' : '#6b5b47'; // Mountains/deserts
        ctx.fillRect(x, y, size, size);
      }
    }
    
    // Add ice caps
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#e8f4f8';
    ctx.fillRect(0, 0, 1024, 40); // North pole
    ctx.fillRect(0, 472, 1024, 40); // South pole
    
    // Add cloud layer
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const width = Math.random() * 60 + 20;
      const height = Math.random() * 20 + 5;
      ctx.fillRect(x, y, width, height);
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  // Create normal map for surface detail
  const createNormalMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    const imageData = ctx.createImageData(512, 256);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 128 + Math.random() * 20 - 10;     // R (normal X)
      data[i + 1] = 128 + Math.random() * 20 - 10; // G (normal Y)
      data[i + 2] = 255;                           // B (normal Z)
      data[i + 3] = 255;                           // A
    }
    
    ctx.putImageData(imageData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  };

  const earthTexture = createEarthTexture();
  const normalMap = createNormalMap();

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3, 128, 64]} />
        <meshPhongMaterial 
          map={earthTexture}
          normalMap={normalMap}
          shininess={30}
          specular="#4a90e2"
          transparent={false}
        />
      </mesh>
      
      {/* Atmospheric glow */}
      <mesh ref={atmosphereRef} position={[0, 0, 0]} scale={1.05}>
        <sphereGeometry args={[3, 32, 16]} />
        <meshPhongMaterial 
          color="#4fc3f7"
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer atmosphere */}
      <mesh position={[0, 0, 0]} scale={1.1}>
        <sphereGeometry args={[3, 32, 16]} />
        <meshPhongMaterial 
          color="#81d4fa"
          transparent={true}
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default Earth;