import React, { useEffect } from 'react';
import { ViewerProvider, useViewer } from './store/viewerStore';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ViewerCanvas from './components/viewer/ViewerCanvas';
import styles from './App.module.css';

function AppInner() {
  const { state, dispatch } = useViewer();

  // Collapse sidebar by default on mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: !e.matches });
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.body}>
        <Sidebar />
        <main
          className={styles.main}
          style={{ marginLeft: state.sidebarOpen ? 'var(--sidebar-w)' : '0' }}
        >
          <ViewerCanvas />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ViewerProvider>
      <AppInner />
    </ViewerProvider>
  );
}
