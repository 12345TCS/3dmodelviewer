import React from 'react';
import { useViewer } from '../../store/viewerStore';
import { parseModelError } from '../../utils/modelErrorParser';
import styles from './ErrorOverlay.module.css';

export default function ErrorOverlay() {
  const { state, dispatch } = useViewer();
  if (state.loadingState !== 'error') return null;

  const err = parseModelError(state.errorMessage);

  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <div className={styles.iconRow}>
          <span className={styles.icon}>{err.icon}</span>
        </div>

        <h2 className={styles.title}>{err.title}</h2>
        <p className={styles.detail}>{err.detail}</p>

        <div className={styles.fixBox}>
          <span className={styles.fixLabel}>How to fix</span>
          <pre className={styles.fixText}>{err.fix}</pre>
        </div>

        {err.tips?.length > 0 && (
          <ul className={styles.tips}>
            {err.tips.map((tip, i) => (
              <li key={i} className={styles.tip}>
                <span className={styles.bullet}>›</span>
                {tip}
              </li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <button
            className={styles.retryBtn}
            onClick={() => dispatch({ type: 'LOAD_START', payload: state.loadedUrl })}
          >
            ↺ Retry
          </button>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch({ type: 'RESET_MODEL' })}
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
}
