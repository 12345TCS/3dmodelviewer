import React from 'react';
import { useViewer } from '../../store/viewerStore';
import SectionCard from '../ui/SectionCard';
import styles from './InfoPanel.module.css';

export default function InfoPanel() {
  const { state } = useViewer();

  return (
    <>
      <SectionCard title="Controls">
        <div className={styles.controls}>
          {CONTROLS.map((c) => (
            <div key={c.action} className={styles.control}>
              <div className={styles.keys}>
                {c.keys.map((k) => <kbd key={k} className={styles.key}>{k}</kbd>)}
              </div>
              <span className={styles.action}>{c.action}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Supported Formats">
        <div className={styles.formats}>
          {['GLB', 'GLTF', 'OBJ', 'FBX'].map((f) => (
            <span key={f} className={styles.badge}>{f}</span>
          ))}
        </div>
        <p className={styles.note}>
          GLTF/GLB offers best compatibility. OBJ and FBX support may require additional texture files.
        </p>
      </SectionCard>

      {state.loadedUrl && (
        <SectionCard title="Current Model">
          <div className={styles.url}>{state.loadedUrl}</div>
          <div className={styles.statusRow}>
            <span
              className={`${styles.statusDot} ${
                state.loadingState === 'loaded' ? styles.loaded :
                state.loadingState === 'loading' ? styles.loading :
                styles.error
              }`}
            />
            <span className={styles.statusText}>
              {state.loadingState === 'loaded' ? 'Loaded successfully' :
               state.loadingState === 'loading' ? 'Loading…' :
               'Failed to load'}
            </span>
          </div>
        </SectionCard>
      )}

      <SectionCard title="About" defaultOpen={false}>
        <p className={styles.note}>
          Built for internal use of <strong> Cloud magician artist team</strong>
        </p>
      </SectionCard>
    </>
  );
}

const CONTROLS = [
  { keys: ['Drag'], action: 'Orbit / Rotate' },
  { keys: ['Scroll'], action: 'Zoom in / out' },
  { keys: ['Right drag'], action: 'Pan' },
  { keys: ['Double tap'], action: 'Reset camera' },
  { keys: ['Pinch'], action: 'Zoom (touch)' },
  { keys: ['Two-finger drag'], action: 'Pan (touch)' },
];
