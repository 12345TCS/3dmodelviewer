import React from 'react';

export default function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-5, 4, -5]} intensity={0.4} />
      <pointLight position={[0, -4, 0]} intensity={0.2} color="#4455ff" />
    </>
  );
}
