import React from 'react';
import { useViewer } from '../../store/viewerStore';
import styles from './Header.module.css';

export default function Header() {
  const { state, dispatch } = useViewer();

  return (
    <header className={styles.header}>
      <button
        className={styles.menuBtn}
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        aria-label="Toggle sidebar"
      >
        <span className={`${styles.bar} ${state.sidebarOpen ? styles.open : ''}`} />
        <span className={`${styles.bar} ${state.sidebarOpen ? styles.open : ''}`} />
        <span className={`${styles.bar} ${state.sidebarOpen ? styles.open : ''}`} />
      </button>

      <div className={styles.brand}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        <span className={styles.brandName}>3D Viewer</span>
      </div>

      <div className={styles.spacer} />

      {state.loadingState === 'loaded' && (
        <button
          className={styles.resetBtn}
          onClick={() => dispatch({ type: 'RESET_MODEL' })}
        >
          ✕ Close model
        </button>
      )}
    </header>
  );
}
