import { useEffect } from 'react';
import { useViewer } from '../../store/viewerStore';

/**
 * Detects the file type from a URL and returns the loader strategy.
 * Extend this map to support new formats.
 */
export function detectFormat(url) {
  const lower = url.toLowerCase().split('?')[0];
  if (lower.endsWith('.glb') || lower.endsWith('.gltf')) return 'gltf';
  if (lower.endsWith('.obj')) return 'obj';
  if (lower.endsWith('.fbx')) return 'fbx';
  if (lower.endsWith('.stl')) return 'stl';
  if (/\.(png|jpe?g|webp|gif|bmp|avif)$/.test(lower)) return 'image';
  // Fallback: try gltf
  return 'gltf';
}

/**
 * Hook that signals load success/failure into the store.
 * The actual loading is done by the R3F loader components.
 */
export function useLoadCallback() {
  const { dispatch } = useViewer();
  const onLoad = () => dispatch({ type: 'LOAD_SUCCESS' });
  const onError = (err) => {
    const msg = err?.message || String(err) || 'Unknown error';
    dispatch({ type: 'LOAD_ERROR', payload: msg });
  };
  return { onLoad, onError };
}
