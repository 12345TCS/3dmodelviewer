import React, { useRef, useEffect, Suspense } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { useGLTF, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import * as THREE from 'three';
import { useViewer } from '../../store/viewerStore';
import { useLoadCallback, detectFormat } from './useModelLoader';

// ── Utility: centre + normalise a loaded object ───────────────────────────────

function fitObject(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  const centre = new THREE.Vector3();
  box.getCenter(centre);
  obj.position.sub(centre);
  const size = box.getSize(new THREE.Vector3()).length();
  if (size > 0) obj.scale.setScalar(2 / size);
}

// ── Apply wireframe recursively ───────────────────────────────────────────────

function applyWireframe(obj, wireframe) {
  obj.traverse((child) => {
    if (!child.isMesh) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((m) => { if (m) m.wireframe = wireframe; });
  });
}

// ── GLTF/GLB loader ───────────────────────────────────────────────────────────

function GltfModel({ url, wireframe }) {
  const { scene } = useGLTF(url);
  const { onLoad, onError } = useLoadCallback();

  useEffect(() => {
    try { fitObject(scene); onLoad(); } catch (e) { onError(e); }
  }, [scene]); // eslint-disable-line

  useEffect(() => { applyWireframe(scene, wireframe); }, [scene, wireframe]);

  return <primitive object={scene} />;
}

// ── OBJ loader ────────────────────────────────────────────────────────────────

function ObjModel({ url, wireframe }) {
  const obj = useLoader(OBJLoader, url);
  const { onLoad, onError } = useLoadCallback();

  useEffect(() => {
    try { fitObject(obj); onLoad(); } catch (e) { onError(e); }
  }, [obj]); // eslint-disable-line

  useEffect(() => { applyWireframe(obj, wireframe); }, [obj, wireframe]);

  return <primitive object={obj} />;
}

function StlModel({ url, wireframe }) {
  const geometry = useLoader(STLLoader, url);
  const mesh = useRef();
  const { onLoad, onError } = useLoadCallback();

  useEffect(() => {
    try {
      geometry.computeVertexNormals();
      geometry.center();
      fitObject(mesh.current);
      onLoad();
    } catch (e) {
      onError(e);
    }
  }, [geometry]); // eslint-disable-line

  return (
    <mesh ref={mesh} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color="#b8c0cc"
        roughness={0.65}
        metalness={0.05}
        wireframe={wireframe}
      />
    </mesh>
  );
}

// ── Format router ─────────────────────────────────────────────────────────────

function ModelRouter({ url, wireframe }) {
  const fmt = detectFormat(url);
  if (fmt === 'obj') return <ObjModel url={url} wireframe={wireframe} />;
  if (fmt === 'stl') return <StlModel url={url} wireframe={wireframe} />;
  return <GltfModel url={url} wireframe={wireframe} />;
}

// ── Error boundary for model loading ─────────────────────────────────────────

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { this.props.onError?.(err); }
  componentDidUpdate(prev) {
    if (prev.url !== this.props.url) this.setState({ hasError: false });
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ── Camera reset helper ───────────────────────────────────────────────────────

function CameraReset({ trigger }) {
  const { camera } = useThree((s) => ({ camera: s.camera }));
  const controls = useThree((s) => s.controls);

  useEffect(() => {
    if (!trigger) return;
    camera.position.set(0, 1, 4);
    camera.lookAt(0, 0, 0);
    controls?.reset?.();
  }, [trigger]); // eslint-disable-line

  return null;
}

// ── Main exported scene ───────────────────────────────────────────────────────

export default function ModelScene({ resetCamera }) {
  const { state, dispatch } = useViewer();
  const { loadedUrl, wireframe, showGrid, showAxes } = state;

  const handleError = (err) => {
    // Strip Three.js prefix "Could not load [url]: " to expose the real cause
    const raw = err?.message || 'Failed to load model';
    const clean = raw.replace(/^Could not load [^:]+:\s*/i, '').trim() || raw;
    dispatch({ type: 'LOAD_ERROR', payload: clean });
  };

  return (
    <>
      <CameraReset trigger={resetCamera} />

      {loadedUrl && (
        <ModelErrorBoundary url={loadedUrl} onError={handleError}>
          <Suspense fallback={null}>
            <ModelRouter url={loadedUrl} wireframe={wireframe} />
          </Suspense>
        </ModelErrorBoundary>
      )}

      {showGrid && (
        <Grid
          position={[0, -1.01, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#2e3352"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#3a4070"
          fadeDistance={20}
          fadeStrength={1}
          infiniteGrid
        />
      )}

      {showAxes && <axesHelper args={[2]} />}

      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport
          axisColors={['#ff4060', '#40ff80', '#4080ff']}
          labelColor="white"
        />
      </GizmoHelper>
    </>
  );
}
