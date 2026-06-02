# 3D Model Viewer

A responsive web application for viewing 3D models in the browser, built with React and React Three Fiber. Load any GLB, GLTF, or OBJ model from a URL and interact with it in real time.

---

## Features

- Load 3D models from any public URL (.glb / .gltf / .obj)
- Orbit, zoom, pan — full mouse and touch support
- Auto-rotate, wireframe, grid, and axes toggles
- 4 lighting presets: Studio, Outdoor, Dramatic, Soft
- Background and tone mapping options
- Adaptive resolution for smooth performance on mobile
- Floating quick-action toolbar
- CORS error detection with actionable guidance

---

## Prerequisites

Make sure the following are installed on your machine before starting.

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18 or higher | https://nodejs.org |
| npm | 9 or higher (comes with Node.js) | — |
| Git | Any recent version | https://git-scm.com |

To check your versions:

```bash
node -v
npm -v
git --version
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/3d-model-viewer.git
cd 3d-model-viewer
```

> Replace the URL with your actual repository URL.

### 2. Install dependencies

```bash
npm install
```

This installs React, React Three Fiber, Three.js, and all other packages listed in `package.json`. It may take a minute on first run.

### 3. Start the development server

```bash
npm run dev
```

The app will start at:

```
http://localhost:3000
```

If port 3000 is already in use, Vite will automatically try the next available port (e.g. 3001) and print the actual URL in the terminal.

### 4. Open in browser

Navigate to the URL shown in the terminal. You should see the 3D Viewer with an empty canvas and a sidebar on the left.

---

## Project Structure

```
3Dviewer/
├── public/                  # Static assets (served as-is)
├── src/
│   ├── components/
│   │   ├── layout/          # Header and Sidebar shell
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── panels/          # Sidebar panel content
│   │   │   ├── ModelPanel.jsx   # URL input + sample models
│   │   │   ├── ScenePanel.jsx   # Lighting, background, wireframe
│   │   │   └── InfoPanel.jsx    # Controls reference
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── SectionCard.jsx
│   │   │   ├── Toggle.jsx
│   │   │   ├── Slider.jsx
│   │   │   └── SelectGroup.jsx
│   │   └── viewer/          # 3D canvas and scene
│   │       ├── ViewerCanvas.jsx     # Main R3F Canvas
│   │       ├── ModelScene.jsx       # Model loading + grid + axes
│   │       ├── EmptyState.jsx       # Shown before any model loads
│   │       ├── ErrorOverlay.jsx     # Error display with guidance
│   │       ├── QuickToolbar.jsx     # Floating HUD buttons
│   │       ├── useModelLoader.js    # Format detection helpers
│   │       └── lights/
│   │           ├── LightRig.jsx
│   │           ├── StudioLights.jsx
│   │           ├── OutdoorLights.jsx
│   │           ├── DramaticLights.jsx
│   │           └── SoftLights.jsx
│   ├── store/
│   │   └── viewerStore.jsx  # Global state (useReducer + Context)
│   ├── utils/
│   │   └── modelErrorParser.js  # Error classification + URL pre-check
│   ├── App.jsx
│   ├── App.module.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the local development server with hot reload |
| `npm run build` | Create an optimised production build in `dist/` |
| `npm run preview` | Preview the production build locally before deploying |

---

## Loading a 3D Model

1. Open the app in your browser
2. In the **Model** panel on the left, paste a public URL to a `.glb`, `.gltf`, or `.obj` file
3. Click **▶ Preview Model**
4. Use the mouse or touch to interact:

| Action | Desktop | Mobile |
|--------|---------|--------|
| Rotate | Left-click drag | One-finger drag |
| Zoom | Scroll wheel | Pinch |
| Pan | Right-click drag | Two-finger drag |
| Reset camera | Double-click | Double-tap |

### Sample model URL to test with

```
https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb
```

---

## CORS Requirement for External URLs

If you load a model from your own server and see a **"CORS / Network Error"**, the file host needs to allow cross-origin requests.

Add this HTTP response header on the server or storage bucket:

```
Access-Control-Allow-Origin: *
```

**DigitalOcean Spaces:**
Settings → CORS Configurations → Add → Origin: `*`, Methods: `GET, HEAD`

**AWS S3:**
Bucket → Permissions → CORS Configuration → add the rule above

GitHub raw URLs (`raw.githubusercontent.com`) already have CORS enabled and work out of the box.

---

## Building for Production

```bash
npm run build
```

This generates a `dist/` folder containing all static files ready to deploy.

To preview the production build locally before deploying:

```bash
npm run preview
```

---

## Deployment

### DigitalOcean App Platform (Recommended — Free for static sites)

1. Push your code to GitHub
2. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com) → **App Platform** → **Create App**
3. Connect your GitHub repository
4. DigitalOcean auto-detects it as a static site
5. Set the build command to `npm run build` and output directory to `dist`
6. Click **Deploy**

Your site will be live at `https://your-app-name.ondigitalocean.app`

### DigitalOcean Spaces (Manual upload)

1. Run `npm run build`
2. Upload everything inside `dist/` to your Space
3. Set all uploaded files to **Public Read**
4. Access the site at:
   ```
   https://YOUR-SPACE.REGION.cdn.digitaloceanspaces.com/index.html
   ```

---

## Adding a New Light Preset

1. Create a new file in `src/components/viewer/lights/`, e.g. `NightLights.jsx`
2. Export a React component with your Three.js lights
3. Register it in `LightRig.jsx`:
   ```js
   import NightLights from './NightLights';
   const PRESETS = { ..., night: NightLights };
   ```
4. Add it to the options array in `ScenePanel.jsx`:
   ```js
   { value: 'night', label: 'Night' }
   ```

---

## Adding Support for a New File Format

1. Open `src/components/viewer/useModelLoader.js`
2. Add the extension to `detectFormat()`:
   ```js
   if (lower.endsWith('.stl')) return 'stl';
   ```
3. Create a loader component in `ModelScene.jsx` (follow the `ObjModel` pattern)
4. Add it to the `ModelRouter` component

---

## Tech Stack

| Library | Purpose |
|---------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool and dev server |
| React Three Fiber | React renderer for Three.js |
| @react-three/drei | Three.js helpers (controls, loaders, environment) |
| Three.js | 3D engine |

---

## License

MIT
