import React from 'react';
import { useViewer } from '../../store/viewerStore';
import styles from './QuickToolbar.module.css';

const tools = [
  { id: 'autoRotate', icon: '↻', title: 'Auto rotate', stateKey: 'autoRotate', action: 'TOGGLE_AUTO_ROTATE' },
  { id: 'wireframe', icon: '⬡', title: 'Wireframe', stateKey: 'wireframe', action: 'TOGGLE_WIREFRAME' },
  { id: 'grid', icon: '⊞', title: 'Grid', stateKey: 'showGrid', action: 'TOGGLE_GRID' },
];

export default function QuickToolbar({ onReset }) {
  const { state, dispatch } = useViewer();
  if (state.loadingState !== 'loaded') return null;

  return (
    <div className={styles.toolbar}>
      {tools.map((t) => (
        <button
          key={t.id}
          className={`${styles.btn} ${state[t.stateKey] ? styles.active : ''}`}
          title={t.title}
          onClick={() => dispatch({ type: t.action })}
        >
          {t.icon}
        </button>
      ))}
      <div className={styles.sep} />
      <button className={styles.btn} title="Reset camera" onClick={onReset}>
        ⊙
      </button>
    </div>
  );
}
