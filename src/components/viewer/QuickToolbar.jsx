import React, { useState } from 'react';
import { useViewer } from '../../store/viewerStore';
import { downloadAsset } from '../../utils/downloadAsset';
import { detectFormat } from './useModelLoader';
import styles from './QuickToolbar.module.css';

const tools = [
  { id: 'autoRotate', icon: '↻', title: 'Auto rotate', stateKey: 'autoRotate', action: 'TOGGLE_AUTO_ROTATE' },
  { id: 'wireframe', icon: '⬡', title: 'Wireframe', stateKey: 'wireframe', action: 'TOGGLE_WIREFRAME' },
  { id: 'grid', icon: '⊞', title: 'Grid', stateKey: 'showGrid', action: 'TOGGLE_GRID' },
];

export default function QuickToolbar({ onReset }) {
  const { state, dispatch } = useViewer();
  const [downloading, setDownloading] = useState(false);
  if (state.loadingState !== 'loaded') return null;

  const isPhoto = detectFormat(state.loadedUrl) === 'image';

  const handleDownload = async () => {
    if (!state.loadedUrl || downloading) return;
    setDownloading(true);
    try {
      await downloadAsset(state.loadedUrl);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.toolbar}>
      {!isPhoto && tools.map((tool) => (
        <button
          key={tool.id}
          className={`${styles.btn} ${state[tool.stateKey] ? styles.active : ''}`}
          title={tool.title}
          onClick={() => dispatch({ type: tool.action })}
        >
          {tool.icon}
        </button>
      ))}

      {!isPhoto && <div className={styles.sep} />}
      {!isPhoto && (
        <button className={styles.btn} title="Reset camera" onClick={onReset}>
          ⊙
        </button>
      )}

      <button
        className={styles.btn}
        title={downloading ? 'Downloading asset...' : 'Download asset'}
        aria-label={downloading ? 'Downloading asset' : 'Download asset'}
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? (
          <span className={styles.downloadSpinner} />
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
        )}
      </button>
    </div>
  );
}
