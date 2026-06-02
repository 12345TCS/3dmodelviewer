import React, { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerformanceMonitor,
  useProgress,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';
import { useViewer } from '../../store/viewerStore';
import ModelScene from './ModelScene';
import LightRig from './lights/LightRig';
import EmptyState from './EmptyState';
import QuickToolbar from './QuickToolbar';
import ErrorOverlay from './ErrorOverlay';
import styles from './ViewerCanvas.module.css';

// ── Tone mapping map ──────────────────────────────────────────────────────────

const TONE_MAP = {
  aces: THREE.ACESFilmicToneMapping,
  linear: THREE.LinearToneMapping,
  reinhard: THREE.ReinhardToneMapping,
};

// ── Background colours ────────────────────────────────────────────────────────

const BG_COLORS = {
  dark: '#0f1117',
  light: '#e8eaf0',
  gradient: '#151822',
  transparent: '#0f1117',
};

// ── Loading overlay ───────────────────────────────────────────────────────────

function LoadingOverlay() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className={styles.loadingBox}>
        <div className={styles.loadingRing} />
        <span className={styles.loadingPct}>{Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

// ── Main canvas ───────────────────────────────────────────────────────────────

export default function ViewerCanvas() {
  const { state } = useViewer();
  const [dpr, setDpr] = useState(1.5);
  const [resetCamera, setResetCamera] = useState(0);

  const handleDoubleClick = useCallback(() => {
    setResetCamera((n) => n + 1);
  }, []);

  const bgColor = BG_COLORS[state.background] ?? '#0f1117';
  const toneMapping = TONE_MAP[state.toneMapping] ?? THREE.ACESFilmicToneMapping;

  return (
    <div className={styles.canvasWrapper} onDoubleClick={handleDoubleClick}>
      {state.loadingState === 'idle' && <EmptyState />}
      <QuickToolbar onReset={() => setResetCamera((n) => n + 1)} />

      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [0, 1, 4], fov: 45, near: 0.01, far: 1000 }}
        gl={{
          toneMapping,
          toneMappingExposure: state.exposure,
          antialias: true,
          preserveDrawingBuffer: false,
        }}
        style={{ background: bgColor }}
        className={styles.canvas}
      >
        {/* Adaptive DPR: lowers resolution under load to keep 60fps */}
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.5)}
        />

        <Suspense fallback={<LoadingOverlay />}>
          {/* Lighting */}
          <LightRig preset={state.lightPreset} />

          {/* Environment (image-based lighting) */}
          <Environment preset="city" />

          {/* Model + grid + axes */}
          <ModelScene resetCamera={resetCamera} />

          {/* Soft ground shadow */}
          {state.loadingState === 'loaded' && (
            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={4}
            />
          )}

          {/* Orbit / pan / zoom controls */}
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            autoRotate={state.autoRotate}
            autoRotateSpeed={state.autoRotateSpeed}
            minDistance={0.1}
            maxDistance={100}
            enablePan
            panSpeed={0.8}
            zoomSpeed={1.2}
            rotateSpeed={0.8}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />
        </Suspense>
      </Canvas>

      {/* HUD overlays */}
      <div className={styles.hints}>
        <span>Drag to rotate · Scroll to zoom · Right-drag to pan · Double-click to reset</span>
      </div>

      <ErrorOverlay />
    </div>
  );
}
