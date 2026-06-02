import React from 'react';
import { useViewer } from '../../store/viewerStore';
import ModelPanel from '../panels/ModelPanel';
import ScenePanel from '../panels/ScenePanel';
import InfoPanel from '../panels/InfoPanel';
import styles from './Sidebar.module.css';

const TABS = [
  { id: 'model', label: 'Model', icon: '⬡' },
  { id: 'scene', label: 'Scene', icon: '✦' },
  { id: 'info', label: 'Info', icon: 'ℹ' },
];

export default function Sidebar() {
  const { state, dispatch } = useViewer();

  return (
    <>
      {/* Overlay backdrop on mobile when sidebar is open */}
      {state.sidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false })}
        />
      )}

      <aside className={`${styles.sidebar} ${state.sidebarOpen ? styles.open : ''}`}>
        <nav className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${state.activePanel === tab.id ? styles.active : ''}`}
              onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: tab.id })}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.panels}>
          {state.activePanel === 'model' && <ModelPanel />}
          {state.activePanel === 'scene' && <ScenePanel />}
          {state.activePanel === 'info' && <InfoPanel />}
        </div>
      </aside>
    </>
  );
}
