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

  // Use the device's native pixel ratio (capped at 2) so the model is crisp
  // on Retina / high-DPI mobile screens. The PerformanceMonitor only lowers
  // this if the device genuinely cannot maintain acceptable frame rate.
  const nativeDpr = Math.min(window.devicePixelRatio || 1, 2);
  const [dpr, setDpr] = useState(nativeDpr);

  const [resetCamera, setResetCamera] = useState(0);

  const handleDoubleClick = useCallback(() => {
    setResetCamera((n) => n + 1);
  }, []);

  const bgColor     = BG_COLORS[state.background] ?? '#0f1117';
  const toneMapping = TONE_MAP[state.toneMapping] ?? THREE.ACESFilmicToneMapping;

  // KEY PERFORMANCE WIN — no quality impact at all:
  // "demand" renders only when OrbitControls detects input (it calls
  // invalidate() on every touch/pointer event). When nothing moves the GPU
  // is completely idle. "always" re-enables the continuous loop for
  // auto-rotate.
  const frameloop = state.autoRotate ? 'always' : 'demand';

  return (
    <div className={styles.canvasWrapper} onDoubleClick={handleDoubleClick}>
      {state.loadingState === 'idle' && <EmptyState />}
      <QuickToolbar onReset={() => setResetCamera((n) => n + 1)} />

      <Canvas
        shadows                   // shadows on for all devices
        dpr={dpr}                 // native device DPR, capped at 2×
        frameloop={frameloop}     // idle when not interacting
        camera={{ position: [0, 1, 4], fov: 45, near: 0.01, far: 1000 }}
        gl={{
          antialias: true,        // full antialiasing on all devices
          toneMapping,
          toneMappingExposure: state.exposure,
          preserveDrawingBuffer: false,
        }}
        // Allow R3F to lower DPR automatically during sustained heavy frames
        performance={{ min: 0.5 }}
        style={{ background: bgColor }}
        className={styles.canvas}
      >
        {/* ── Adaptive DPR — last resort fallback only ─────────────────────
            Starts optimistic (full quality). Only fires after 3 consecutive
            "decline" readings, meaning the device is genuinely struggling.
            Restores quality as soon as FPS recovers.                       */}
        <PerformanceMonitor
          flipflops={3}
          threshold={0.75}
          onDecline={() => setDpr((prev) => Math.max(1, +(prev - 0.25).toFixed(2)))}
          onIncline={() => setDpr(nativeDpr)}
        />

        <Suspense fallback={<LoadingOverlay />}>
          {/* Lighting */}
          <LightRig preset={state.lightPreset} />

          {/* Full image-based lighting on all devices */}
          <Environment preset="city" />

          {/* Model + grid + axes */}
          <ModelScene resetCamera={resetCamera} />

          {/* Contact shadows — lower internal resolution on mobile.
              The shadow is blurred anyway so 256 vs 512 is imperceptible
              on a small screen, but saves a full render-pass worth of memory. */}
          {state.loadingState === 'loaded' && (
            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={4}
              resolution={isMobile ? 256 : 512}
            />
          )}

          {/* ── Orbit / pan / zoom controls ──────────────────────────────── */}
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
            rotateSpeed={isMobile ? 1.2 : 0.8}
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
