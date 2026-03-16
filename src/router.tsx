import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import InfoPage from './components/InfoPage'
import RenderPage from './components/RenderPage'
import InspectPageRoute from './components/InspectPageRoute'

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<RenderPage />} />
          <Route path="info" element={<InfoPage />} />
          <Route path="render/:planet" element={<RenderPage />} />
          <Route path="inspect/:planet" element={<InspectPageRoute />} />
        </Route>
      </Routes>
    </Router>
  )
}


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