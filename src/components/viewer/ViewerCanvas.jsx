import React, { Suspense, useState, useCallback, useEffect, useRef } from 'react';
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
import { detectFormat } from './useModelLoader';
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

function PhotoViewer({ url, loading, onLoad, onError }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const clampZoom = (value) => Math.min(5, Math.max(0.25, value));

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [url]);

  useEffect(() => {
    if (zoom <= 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  const changeZoom = (amount) => {
    setZoom((current) => clampZoom(Number((current + amount).toFixed(2))));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (event) => {
    if (zoom <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { pointerX: event.clientX, pointerY: event.clientY, ...pan };
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!dragStart.current) return;
    setPan({
      x: dragStart.current.x + event.clientX - dragStart.current.pointerX,
      y: dragStart.current.y + event.clientY - dragStart.current.pointerY,
    });
  };

  const handlePointerUp = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStart.current = null;
    setDragging(false);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    changeZoom(event.deltaY < 0 ? 0.25 : -0.25);
  };

  return (
    <div className={styles.photoViewer} onWheel={handleWheel}>
      {loading && (
        <div className={styles.photoLoading}>
          <div className={styles.loadingRing} />
          <span>Loading photo...</span>
        </div>
      )}
      <div
        className={`${styles.photoStage} ${zoom > 1 ? styles.photoPannable : ''} ${dragging ? styles.photoDragging : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          key={`${url}-${loading}`}
          className={styles.photo}
          src={url}
          alt="Loaded asset"
          onLoad={onLoad}
          onError={onError}
          onDoubleClick={resetView}
          draggable={false}
          style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }}
        />
      </div>

      {!loading && (
        <div className={styles.photoZoomControls} aria-label="Photo zoom controls">
          <button type="button" onClick={() => changeZoom(-0.25)} disabled={zoom <= 0.25} aria-label="Zoom out">−</button>
          <button type="button" className={styles.zoomValue} onClick={resetView} title="Reset zoom and position">
            {Math.round(zoom * 100)}%
          </button>
          <button type="button" onClick={() => changeZoom(0.25)} disabled={zoom >= 5} aria-label="Zoom in">+</button>
        </div>
      )}
    </div>
  );
}

// ── Main canvas ───────────────────────────────────────────────────────────────

export default function ViewerCanvas() {
  const { state, dispatch } = useViewer();
  const isMobile = useIsMobile();
  const isPhoto = Boolean(state.loadedUrl) && detectFormat(state.loadedUrl) === 'image';

  // Mobile: DPR 1.0 — renders 1 pixel per CSS pixel.
  // At DPR 1.5 a 390-wide phone renders 585px. Cutting to 1.0 = 390px,
  // which is 55% fewer pixels per frame. On a small screen the difference
  // is imperceptible but the frame time drops sharply.
  // Desktop: native DPR capped at 2 for full Retina quality.
  const nativeDpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  const [dpr, setDpr] = useState(nativeDpr);

  const [resetCamera, setResetCamera] = useState(0);

  const handleDoubleClick = useCallback(() => {
    setResetCamera((n) => n + 1);
  }, []);

  const bgColor     = BG_COLORS[state.background] ?? '#0f1117';
  const toneMapping = TONE_MAP[state.toneMapping] ?? THREE.ACESFilmicToneMapping;

  // Mobile: "always" loop so touch events are never dropped (iOS Safari
  // doesn't reliably pick up invalidate() from OrbitControls).
  // Desktop: "demand" keeps GPU idle when model is not moving.
  const frameloop = (isMobile || state.autoRotate) ? 'always' : 'demand';

  return (
    <div className={styles.canvasWrapper} onDoubleClick={handleDoubleClick}>
      {state.loadingState === 'idle' && <EmptyState />}
      <QuickToolbar onReset={() => setResetCamera((n) => n + 1)} />

      {isPhoto ? (
        <PhotoViewer
          url={state.loadedUrl}
          loading={state.loadingState === 'loading'}
          onLoad={() => dispatch({ type: 'LOAD_SUCCESS' })}
          onError={() => dispatch({ type: 'LOAD_ERROR', payload: 'The photo could not be loaded.' })}
        />
      ) : (
      <Canvas
        // ── Render pass budget ────────────────────────────────────────────
        // Desktop: shadows ON  → 2 render passes (shadow map + main scene)
        // Mobile:  shadows OFF → 1 render pass  (main scene only)
        // Shadow maps alone account for ~40% of GPU time on mobile.
        shadows={!isMobile}
        dpr={dpr}
        frameloop={frameloop}
        camera={{ position: [0, 1, 4], fov: 45, near: 0.01, far: 1000 }}
        gl={{
          // MSAA antialias doubles fragment shader work on every pixel.
          // At DPR 1 on a small screen, aliasing is barely visible anyway.
          antialias: !isMobile,
          toneMapping,
          toneMappingExposure: state.exposure,
          preserveDrawingBuffer: false,
        }}
        performance={{ min: 0.5 }}
        style={{ background: bgColor }}
        className={styles.canvas}
      >
        <PerformanceMonitor
          flipflops={3}
          threshold={0.75}
          onDecline={() => setDpr((prev) => Math.max(0.75, +(prev - 0.25).toFixed(2)))}
          onIncline={() => setDpr(nativeDpr)}
        />

        <Suspense fallback={<LoadingOverlay />}>
          {/* Lighting — model colours and materials unaffected by shadow toggle */}
          <LightRig preset={state.lightPreset} />

          {/* IBL environment — keeps PBR reflections and metallic materials
              looking correct on all devices */}
          <Environment preset="city" />

          {/* Model + grid + axes */}
          <ModelScene resetCamera={resetCamera} />

          {/* ContactShadows = 3rd render pass — desktop only */}
          {!isMobile && state.loadingState === 'loaded' && (
            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={4}
              resolution={512}
            />
          )}

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={isMobile ? 0.2 : 0.08}
            autoRotate={state.autoRotate}
            autoRotateSpeed={state.autoRotateSpeed}
            minDistance={0.1}
            maxDistance={100}
            enablePan
            panSpeed={0.8}
            zoomSpeed={1.2}
            rotateSpeed={isMobile ? 1.4 : 0.8}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />
        </Suspense>
      </Canvas>
      )}

      {!isPhoto && <div className={styles.hints}>
        {isMobile
          ? 'Drag to rotate · Pinch to zoom · Two-finger drag to pan'
          : 'Drag to rotate · Scroll to zoom · Right-drag to pan · Double-click to reset'}
      </div>}

      <ErrorOverlay />
    </div>
  );
}
