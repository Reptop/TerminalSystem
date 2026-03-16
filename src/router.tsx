import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import App from './App'
import InfoPage from './components/InfoPage'
import ModelPage from './components/ModelPage'

export const SCENE_CONFIG = {
  sun: {
    assetPath: '/sun/scene.gltf',
    title: 'Sun Render',
    description: 'Procedural render preview for the sun model.',
  },
  earth: {
    assetPath: '/earth.glb',
    title: 'Earth Render',
    description: 'Planet render preview for Earth.',
  },
  mars: {
    assetPath: '/mars.glb',
    title: 'Mars Render',
    description: 'Planet render preview for Mars.',
  },
  mercury: {
    assetPath: '/mercury/scene.gltf',
    title: 'Mercury Render',
    description: 'Planet render preview for Mercury.',
  },
  venus: {
    assetPath: '/venus/scene.gltf',
    title: 'Venus Render',
    description: 'Planet render preview for Venus.',
  },
  saturn: {
    assetPath: '/saturn_planet.glb',
    title: 'Saturn Render',
    description: 'Planet render preview for Saturn.',
  },
  uranus: {
    assetPath: '/uranus/scene.gltf',
    title: 'Uranus Render',
    description: 'Planet render preview for Uranus.',
  },
  neptune: {
    assetPath: '/neptune/scene.gltf',
    title: 'Neptune Render',
    description: 'Planet render preview for Neptune.',
  },
  jupiter: {
    assetPath: '/jupiter/scene.gltf',
    title: 'Jupiter Render',
    description: 'Planet render preview for Jupiter.',
  },
  moon: {
    assetPath: '/moon/scene.gltf',
    title: 'Moon Render',
    description: 'Lunar render preview for the Moon.',
  },
}

function RenderPage() {
  const { planet, satellite } = useParams<{ planet?: string; satellite?: string }>()
  
  const sceneKey = satellite || planet
  const config = sceneKey ? SCENE_CONFIG[sceneKey as keyof typeof SCENE_CONFIG] : null

  if (!config) {
    return (
      <aside className="info-panel render-panel">
        <div className="info-content render-content">
          <h2>Not Found</h2>
          <p className="info-text">The requested render scene was not found.</p>
        </div>
      </aside>
    )
  }

  return <ModelPage assetPath={config.assetPath} label={sceneKey} title={config.title} description={config.description} />
}

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<RenderPage />} />
          <Route path="info" element={<InfoPage />} />
          <Route path="render/:planet" element={<RenderPage />} />
        </Route>
      </Routes>
    </Router>
  )
}
