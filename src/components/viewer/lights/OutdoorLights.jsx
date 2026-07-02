import React from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';

export default function OutdoorLights() {
  const isMobile = useIsMobile();
  return (
    <>
      <ambientLight intensity={0.6} color="#c8d8f0" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        color="#fffbe8"
        castShadow={!isMobile}
        shadow-mapSize={[2048, 2048]}
      />
      <hemisphereLight skyColor="#aaddff" groundColor="#886633" intensity={0.5} />
    </>
  );
}
