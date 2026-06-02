import { createContext, useContext, useReducer } from 'react';

const initialState = {
  // Model
  modelUrl: '',
  loadedUrl: null,
  loadingState: 'idle',  // 'idle' | 'loading' | 'loaded' | 'error'
  errorMessage: null,

  // Viewer settings
  showGrid: true,
  showAxes: false,
  wireframe: false,
  autoRotate: false,
  autoRotateSpeed: 1.0,
  background: 'dark',      // 'dark' | 'light' | 'gradient' | 'transparent'
  lightPreset: 'studio',   // 'studio' | 'outdoor' | 'dramatic' | 'soft'
  toneMapping: 'aces',     // 'aces' | 'linear' | 'reinhard'
  exposure: 1.0,

  // UI
  sidebarOpen: true,
  activePanel: 'model',    // 'model' | 'scene' | 'info'
};

function viewerReducer(state, action) {
  switch (action.type) {
    case 'SET_MODEL_URL':
      return { ...state, modelUrl: action.payload };
    case 'LOAD_START':
      return { ...state, loadingState: 'loading', loadedUrl: action.payload, errorMessage: null };
    case 'LOAD_SUCCESS':
      return { ...state, loadingState: 'loaded' };
    case 'LOAD_ERROR':
      return { ...state, loadingState: 'error', errorMessage: action.payload };
    case 'RESET_MODEL':
      return { ...state, loadingState: 'idle', loadedUrl: null, modelUrl: '', errorMessage: null };
    case 'TOGGLE_GRID':
      return { ...state, showGrid: !state.showGrid };
    case 'TOGGLE_AXES':
      return { ...state, showAxes: !state.showAxes };
    case 'TOGGLE_WIREFRAME':
      return { ...state, wireframe: !state.wireframe };
    case 'TOGGLE_AUTO_ROTATE':
      return { ...state, autoRotate: !state.autoRotate };
    case 'SET_AUTO_ROTATE_SPEED':
      return { ...state, autoRotateSpeed: action.payload };
    case 'SET_BACKGROUND':
      return { ...state, background: action.payload };
    case 'SET_LIGHT_PRESET':
      return { ...state, lightPreset: action.payload };
    case 'SET_TONE_MAPPING':
      return { ...state, toneMapping: action.payload };
    case 'SET_EXPOSURE':
      return { ...state, exposure: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    case 'SET_ACTIVE_PANEL':
      return { ...state, activePanel: action.payload };
    default:
      return state;
  }
}

const ViewerContext = createContext(null);

export function ViewerProvider({ children }) {
  const [state, dispatch] = useReducer(viewerReducer, initialState);
  return (
    <ViewerContext.Provider value={{ state, dispatch }}>
      {children}
    </ViewerContext.Provider>
  );
}

export function useViewer() {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error('useViewer must be used inside ViewerProvider');
  return ctx;
}
