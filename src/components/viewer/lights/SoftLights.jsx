import React from 'react';

export default function SoftLights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 3]} intensity={0.6} />
      <directionalLight position={[-3, 5, -3]} intensity={0.6} />
      <directionalLight position={[0, -5, 0]} intensity={0.2} />
    </>
  );
}
