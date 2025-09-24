import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface AsteroidBeltProps {
  innerRadius?: number;
  outerRadius?: number;
  count?: number;
}

const AsteroidBelt = ({ innerRadius = 9, outerRadius = 20, count = 1800 }: AsteroidBeltProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { matrix, dummy } = useMemo(() => ({
    matrix: new THREE.Matrix4(),
    dummy: new THREE.Object3D()
  }), []);

  const asteroidData = useMemo(() => {
    const arr = [] as Array<{ radius: number; angle: number; speed: number; y: number; size: number; inclination: number; ascNode: number; }>; 
    for (let i = 0; i < count; i++) {
      const radius = THREE.MathUtils.lerp(innerRadius, outerRadius, Math.random());
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.02 / radius) * (0.5 + Math.random());
      const y = (Math.random() - 0.5) * 0.6; // slight vertical spread
      const size = Math.random() * 0.07 + 0.015;
      const inclination = (Math.random() - 0.5) * 0.12; // small inclination
      const ascNode = Math.random() * Math.PI * 2;
      arr.push({ radius, angle, speed, y, size, inclination, ascNode });
    }
    return arr;
  }, [count, innerRadius, outerRadius]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    asteroidData.forEach((a, i) => {
      a.angle += a.speed * delta;
      const x = a.radius * Math.cos(a.angle);
      const z = a.radius * Math.sin(a.angle);
      // Start in orbital plane, then rotate by asc node and inclination
      const vec = new THREE.Vector3(x, a.y, z);
      vec.applyAxisAngle(new THREE.Vector3(0,1,0), a.ascNode);
      vec.applyAxisAngle(new THREE.Vector3(1,0,0), a.inclination);
      dummy.position.copy(vec);
      dummy.scale.setScalar(a.size);
      dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      dummy.updateMatrix();
      matrix.copy(dummy.matrix);
      meshRef.current.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#4d5561" emissive="#1f2933" roughness={0.9} metalness={0.05} />
    </instancedMesh>
  );
};

export default AsteroidBelt;
