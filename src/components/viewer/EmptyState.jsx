import React from 'react';
import { useViewer } from '../../store/viewerStore';
import styles from './EmptyState.module.css';

export default function EmptyState() {
  const { dispatch } = useViewer();

  const handleOpenModel = () => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: true });
    dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'model' });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h2 className={styles.title}>No model loaded</h2>
        <p className={styles.subtitle}>
          Paste a URL to a <strong>.glb</strong> or <strong>.gltf</strong> file and click Preview,
          or load one of the built-in samples.
        </p>
        <button className={styles.cta} onClick={handleOpenModel}>
          Open Model Panel
        </button>
        <div className={styles.formats}>
          {['GLB', 'GLTF', 'OBJ'].map((f) => (
            <span key={f} className={styles.badge}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
