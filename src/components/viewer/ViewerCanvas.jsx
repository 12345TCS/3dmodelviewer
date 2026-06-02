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
import { useIsMobile } from '../../hooks/useIsMobile';
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
  const isMobile = useIsMobile();

  // Mobile starts at 0.75 DPR — half the pixels of a 1.5 desktop start.
  // Desktop starts at 1.5. PerformanceMonitor will lower either if FPS drops.
  const [dpr, setDpr] = useState(() => isMobile ? 0.75 : 1.5);

  const [resetCamera, setResetCamera] = useState(0);

  const handleDoubleClick = useCallback(() => {
    setResetCamera((n) => n + 1);
  }, []);

  const bgColor   = BG_COLORS[state.background] ?? '#0f1117';
  const toneMapping = TONE_MAP[state.toneMapping] ?? THREE.ACESFilmicToneMapping;

  // "demand" renders only when the user interacts (OrbitControls calls
  // invalidate() on every pointer/touch event). "always" keeps a continuous
  // loop, which auto-rotate needs. This alone massively reduces GPU usage on
  // mobile when the model is just sitting still.
  const frameloop = state.autoRotate ? 'always' : 'demand';

  return (
    <div className={styles.canvasWrapper} onDoubleClick={handleDoubleClick}>
      {state.loadingState === 'idle' && <EmptyState />}
      <QuickToolbar onReset={() => setResetCamera((n) => n + 1)} />

      <Canvas
        // Shadows are expensive on mobile GPU — skip them entirely
        shadows={!isMobile}
        dpr={dpr}
        frameloop={frameloop}
        camera={{ position: [0, 1, 4], fov: 45, near: 0.01, far: 1000 }}
        gl={{
          toneMapping,
          toneMappingExposure: state.exposure,
          // Antialiasing doubles GPU fragment work — disable on mobile
          antialias: !isMobile,
          preserveDrawingBuffer: false,
          // Allow R3F to drop pixel ratio automatically during heavy frames
          powerPreference: 'default',
        }}
        // Let R3F scale DPR down to 50 % of the set value under load
        performance={{ min: 0.5 }}
        style={{ background: bgColor }}
        className={styles.canvas}
      >
        {/* ── Performance monitor ─────────────────────────────────────────── */}
        <PerformanceMonitor
          // React quickly to declining FPS
          onDecline={() => setDpr(isMobile ? 0.5 : 1)}
          // Restore gradually once FPS is stable again
          onIncline={() => setDpr(isMobile ? 0.75 : 1.5)}
          // Give the monitor 60 frames to measure before acting
          flipflops={3}
          threshold={0.75}
          factor={1}
        />

        <Suspense fallback={<LoadingOverlay />}>
          {/* Lighting */}
          <LightRig preset={state.lightPreset} />

          {/* Image-based lighting — skip on mobile to save texture memory */}
          {!isMobile && <Environment preset="city" />}

          {/* Model + grid + axes */}
          <ModelScene resetCamera={resetCamera} />

          {/* Ground shadow — expensive secondary render pass, desktop only */}
          {!isMobile && state.loadingState === 'loaded' && (
            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={4}
            />
          )}

          {/* ── Orbit / pan / zoom controls ──────────────────────────────── */}
          <OrbitControls
            makeDefault
            enableDamping
            // Lower damping on mobile = faster response to touch
            dampingFactor={isMobile ? 0.15 : 0.08}
            autoRotate={state.autoRotate}
            autoRotateSpeed={state.autoRotateSpeed}
            minDistance={0.1}
            maxDistance={100}
            enablePan
            panSpeed={isMobile ? 0.6 : 0.8}
            zoomSpeed={isMobile ? 1.0 : 1.2}
            // Slightly faster rotate on mobile so small swipes feel responsive
            rotateSpeed={isMobile ? 1.0 : 0.8}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />
        </Suspense>
      </Canvas>

      {/* HUD hint bar */}
      <div className={styles.hints}>
        {isMobile
          ? 'Drag to rotate · Pinch to zoom · Two-finger drag to pan'
          : 'Drag to rotate · Scroll to zoom · Right-drag to pan · Double-click to reset'}
      </div>

      <ErrorOverlay />
    </div>
  );
}
