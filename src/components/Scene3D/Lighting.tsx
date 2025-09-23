export const Lighting = () => {
  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={0.2} color="#ffffff" />
      
      {/* Main directional light (Sun) */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Secondary light for Earth's night side */}
      <directionalLight 
        position={[-10, -5, -5]} 
        intensity={0.3}
        color="#4fc3f7"
      />
      
      {/* Point light for atmospheric effects */}
      <pointLight 
        position={[5, 0, 5]} 
        intensity={0.5}
        color="#81d4fa"
        distance={50}
        decay={1}
      />
      
      {/* Spotlight for dramatic effect */}
      <spotLight
        position={[0, 15, 0]}
        angle={Math.PI / 6}
        penumbra={0.5}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />
    </>
  );
};