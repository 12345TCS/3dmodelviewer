import React from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';

export default function DramaticLights() {
  const isMobile = useIsMobile();
  return (
    <>
      <ambientLight intensity={0.05} />
      <spotLight
        position={[5, 10, 2]}
        angle={0.3}
        penumbra={0.5}
        intensity={3}
        castShadow={!isMobile}
        shadow-mapSize={[2048, 2048]}
        color="#fff5e0"
      />
      <pointLight position={[-6, -2, -4]} intensity={0.8} color="#2244ff" />
      <pointLight position={[4, -6, 4]} intensity={0.4} color="#ff4422" />
    </>
  );
}
