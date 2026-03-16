import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import InfoPage from './components/InfoPage'
import ModelPage from './components/ModelPage'

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="info" element={<InfoPage />} />
          <Route
            path="sun"
            element={
              <ModelPage
                assetPath="/sun/scene.gltf"
                label="sun"
                title="Sun Render"
                description="Procedural render preview for the sun model."
              />
            }
          />
          <Route
            path="earth"
            element={
              <ModelPage
                assetPath="/earth.glb"
                label="earth"
                title="Earth Render"
                description="Planet render preview for Earth."
              />
            }
          />
          <Route
            path="mars"
            element={
              <ModelPage
                assetPath="/mars.glb"
                label="mars"
                title="Mars Render"
                description="Planet render preview for Mars."
              />
            }
          />
          <Route
            path="mercury"
            element={
              <ModelPage
                assetPath="/mercury/scene.gltf"
                label="mercury"
                title="Mercury Render"
                description="Planet render preview for Mercury."
              />
            }
          />
          <Route
            path="venus"
            element={
              <ModelPage
                assetPath="/venus/scene.gltf"
                label="venus"
                title="Venus Render"
                description="Planet render preview for Venus."
              />
            }
          />
          <Route
            path="saturn"
            element={
              <ModelPage
                assetPath="/saturn_planet.glb"
                label="saturn"
                title="Saturn Render"
                description="Planet render preview for Saturn."
              />
            }
          />
          <Route
            path="uranus"
            element={
              <ModelPage
                assetPath="/uranus/scene.gltf"
                label="uranus"
                title="Uranus Render"
                description="Planet render preview for Uranus."
              />
            }
          />
          <Route
            path="neptune"
            element={
              <ModelPage
                assetPath="/neptune/scene.gltf"
                label="neptune"
                title="Neptune Render"
                description="Planet render preview for Neptune."
              />
            }
          />
          <Route
            path="jupiter"
            element={
              <ModelPage
                assetPath="/jupiter/scene.gltf"
                label="jupiter"
                title="Jupiter Render"
                description="Planet render preview for Jupiter."
              />
            }
          />
          <Route
            path="moon"
            element={
              <ModelPage
                assetPath="/moon/scene.gltf"
                label="moon"
                title="Moon Render"
                description="Lunar render preview for the Moon."
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  )
}
