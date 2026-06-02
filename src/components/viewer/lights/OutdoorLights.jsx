import React from 'react';

export default function OutdoorLights() {
  return (
    <>
      <ambientLight intensity={0.6} color="#c8d8f0" />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#fffbe8" castShadow shadow-mapSize={[2048, 2048]} />
      <hemisphereLight skyColor="#aaddff" groundColor="#886633" intensity={0.5} />
    </>
  );
}
