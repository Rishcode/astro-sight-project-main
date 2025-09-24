import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  // Clouds layer removed to avoid outer translucent halo
  const [textures, setTextures] = useState<{
    day?: THREE.Texture;
    specular?: THREE.Texture;
    normal?: THREE.Texture;
    loaded: boolean;
  }>({ loaded: false });

  const enableRotation = false; // keep static unless toggled

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let cancelled = false;
    // Attempt to load real textures
    Promise.all([
      new Promise<THREE.Texture>((res, rej) => loader.load('/earth_daymap.jpg', t => res(t), undefined, () => rej('day'))),
      new Promise<THREE.Texture>((res, rej) => loader.load('/earth_specularmap.jpg', t => res(t), undefined, () => rej('specular')))
    ]).then(([day, specular]) => {
      if (cancelled) return;
      day.colorSpace = THREE.SRGBColorSpace;
      // Improve sampling clarity
      day.anisotropy = 8;
      specular.anisotropy = 4;
      // Procedural subtle normal map (low-frequency perturbation)
      const normalCanvas = document.createElement('canvas');
      normalCanvas.width = 512; normalCanvas.height = 256;
      const nctx = normalCanvas.getContext('2d')!;
      const imgData = nctx.createImageData(512,256);
      for (let i=0;i<imgData.data.length;i+=4){
        imgData.data[i] = 128 + (Math.random()*4-2);
        imgData.data[i+1] = 128 + (Math.random()*4-2);
        imgData.data[i+2] = 255;
        imgData.data[i+3] = 255;
      }
      nctx.putImageData(imgData,0,0);
      const normalTex = new THREE.CanvasTexture(normalCanvas);
      normalTex.needsUpdate = true;
  setTextures({ day, specular, normal: normalTex, loaded: true });
    }).catch((which) => {
      console.warn('Earth texture load failed, using fallback. Missing:', which);
      const canvas = document.createElement('canvas');
      canvas.width = 1024; canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#0b3d91'; ctx.fillRect(0,0,1024,512);
      ctx.fillStyle = '#2c5e1a';
      for (let i=0;i<3500;i++) {
        const x = Math.random()*1024; const y = Math.random()*512; const r = Math.random()*5+2;
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      }
      const fallbackTex = new THREE.CanvasTexture(canvas);
      fallbackTex.colorSpace = THREE.SRGBColorSpace;
      setTextures({ day: fallbackTex, loaded: true });
    });
    return () => { cancelled = true; };
  }, []);

  useFrame((_, delta) => {
    if (enableRotation && earthRef.current) earthRef.current.rotation.y += delta * 0.05;
  // clouds removed
  // atmosphere removed
  });

  // If not yet loaded, show a dim placeholder sphere to avoid bright white flash
  if (!textures.loaded) {
    return (
      <group>
        <mesh position={[0,0,0]}>
          <sphereGeometry args={[3, 64, 64]} />
          <meshBasicMaterial color="#0a2344" />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh ref={earthRef} position={[0,0,0]}>
        <sphereGeometry args={[3, 128, 128]} />
        <meshPhongMaterial
          map={textures.day}
          normalMap={textures.normal}
          specularMap={textures.specular}
          shininess={18}
          specular={new THREE.Color('#1d3d6e')}
        />
      </mesh>
      {/* Clouds layer removed */}
    </group>
  );
};

export default Earth;