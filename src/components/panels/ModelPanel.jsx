import React, { useState } from 'react';
import { useViewer } from '../../store/viewerStore';
import { preCheckUrl } from '../../utils/modelErrorParser';
import { resolveModelInput } from '../../data/modelCatalog';
import SectionCard from '../ui/SectionCard';
import styles from './ModelPanel.module.css';

const SAMPLE_MODELS = [
  {
    label: 'Damaged Helmet',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  },
  {
    label: 'Duck',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
  },
  {
    label: 'Box',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb',
  },
  {
    label: 'Avocado',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
  },
];

export default function ModelPanel() {
  const { state, dispatch } = useViewer();
  const [inputUrl, setInputUrl] = useState(state.modelUrl);

  const handleLoad = async () => {
    const input = inputUrl.trim();
    if (!input) return;

    const url = resolveModelInput(input);
    if (!url) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: `No model was found for code "${input.toUpperCase()}". Check the code and try again.`,
      });
      return;
    }

    // Signal "loading" immediately so the button shows a spinner
    dispatch({ type: 'LOAD_START', payload: url });

    const check = await preCheckUrl(url);
    if (!check.ok) {
      // Surface CORS / 404 / 403 before Three.js attempts to load
      dispatch({ type: 'LOAD_ERROR', payload: check.error?.detail ?? 'Failed to fetch' });
      return;
    }

    // URL is reachable — Three.js will handle the rest via ModelScene
  };

  const handleSample = (url) => {
    setInputUrl(url);
    dispatch({ type: 'LOAD_START', payload: url });
    // Samples are CORS-enabled; skip pre-check to keep it instant
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLoad();
  };

  return (
    <>
      <SectionCard title="Load Model">
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Code, model URL, or image URL</label>
          <textarea
            className={styles.urlInput}
            placeholder="Enter a code (for example ANI001 or 1012) or URL"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            spellCheck={false}
          />
        </div>

        {state.loadingState === 'error' && (
          <div className={styles.error}>
            ⚠ {state.errorMessage || 'Failed to load model'}
          </div>
        )}

        <button
          className={styles.loadBtn}
          onClick={handleLoad}
          disabled={!inputUrl.trim() || state.loadingState === 'loading'}
        >
          {state.loadingState === 'loading' ? (
            <span className={styles.spinner} />
          ) : null}
          {state.loadingState === 'loading' ? 'Loading…' : '▶ Preview Model'}
        </button>
      </SectionCard>

      <SectionCard title="Sample Models" defaultOpen={true}>
        <div className={styles.samples}>
          {SAMPLE_MODELS.map((s) => (
            <button
              key={s.label}
              className={`${styles.sample} ${state.loadedUrl === s.url ? styles.active : ''}`}
              onClick={() => handleSample(s.url)}
              disabled={state.loadingState === 'loading'}
            >
              <span className={styles.sampleDot} />
              {s.label}
            </button>
          ))}
        </div>
        <p className={styles.hint}>Click any sample to load it instantly.</p>
      </SectionCard>
    </>
  );
}
