import { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitRingProps {
  radius: number;
  segments?: number;
  inclination?: number; // radians
  ascendingNode?: number; // radians
  color?: string;
  opacity?: number;
}

const OrbitRing = ({ radius, segments = 256, inclination = 0, ascendingNode = 0, color = '#8da1bcff', opacity = 0.2 }: OrbitRingProps) => {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      points.push(new THREE.Vector3(x, 0, z));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    // Apply orbital plane rotation: first rotate by ascending node around Y, then inclination around X
    const m = new THREE.Matrix4();
    const rotY = new THREE.Matrix4().makeRotationY(ascendingNode);
    const rotX = new THREE.Matrix4().makeRotationX(inclination);
    m.multiply(rotY).multiply(rotX);
    geo.applyMatrix4(m);
    return geo;
  }, [radius, segments, inclination, ascendingNode]);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }))} />
  );
};

export default OrbitRing;
