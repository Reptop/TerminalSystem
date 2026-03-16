import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

type BodyConfig = {
  name: string
  assetPath: string
  orbitRadius: number
  scale: number
  orbitSpeed: number
  spinSpeed: number
  initialAngle: number
  tiltX?: number
  tiltZ?: number
}

type OrbitingBody = {
  orbitGroup: THREE.Group
  anchor: THREE.Group
  spinRoot: THREE.Group
  orbitSpeed: number
  spinSpeed: number
}

const planetConfigs: BodyConfig[] = [
  { name: 'mercury', assetPath: '/mercury/scene.gltf', orbitRadius: 5, scale: 0.22, orbitSpeed: 0.018, spinSpeed: 0.018, initialAngle: 0.3 },
  { name: 'venus', assetPath: '/venus/scene.gltf', orbitRadius: 7, scale: 0.36, orbitSpeed: 0.014, spinSpeed: 0.01, initialAngle: 1.1 },
  { name: 'earth', assetPath: '/earth.glb', orbitRadius: 9.6, scale: 0.38, orbitSpeed: 0.011, spinSpeed: 0.02, initialAngle: 2.2, tiltZ: 0.14 },
  { name: 'mars', assetPath: '/mars.glb', orbitRadius: 12, scale: 0.3, orbitSpeed: 0.009, spinSpeed: 0.018, initialAngle: 2.9, tiltZ: 0.1 },
  { name: 'jupiter', assetPath: '/jupiter/scene.gltf', orbitRadius: 16.5, scale: 0.9, orbitSpeed: 0.0048, spinSpeed: 0.03, initialAngle: 4.1, tiltZ: 0.06 },
  { name: 'saturn', assetPath: '/saturn_planet.glb', orbitRadius: 21, scale: 0.82, orbitSpeed: 0.0036, spinSpeed: 0.024, initialAngle: 5.0, tiltX: 0.18, tiltZ: -0.34 },
  { name: 'uranus', assetPath: '/uranus/scene.gltf', orbitRadius: 25.5, scale: 0.56, orbitSpeed: 0.0028, spinSpeed: 0.017, initialAngle: 0.9, tiltZ: 1.3 },
  { name: 'neptune', assetPath: '/neptune/scene.gltf', orbitRadius: 30, scale: 0.55, orbitSpeed: 0.0022, spinSpeed: 0.015, initialAngle: 3.7, tiltZ: 0.5 },
]

function createOrbitLine(radius: number) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0)
  const points = curve.getPoints(180).map((point) => new THREE.Vector3(point.x, 0, point.y))
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({
    color: '#565b63',
    transparent: true,
    opacity: 0.95,
  })

  return new THREE.LineLoop(geometry, material)
}

function createFallbackPlanet(radius: number, color: string) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.9,
      metalness: 0.05,
    }),
  )
}

export default function SolarSystemPage() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mountNode = mountRef.current

    if (!mountNode)
      return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#050608')

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200)
    camera.position.set(0, 18, 42)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    mountNode.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = true
    controls.minDistance = 16
    controls.maxDistance = 90
    controls.target.set(0, 0, 0)
    controls.update()

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.56)
    scene.add(ambientLight)

    const hemisphereLight = new THREE.HemisphereLight('#d6dff0', '#241a14', 0.48)
    scene.add(hemisphereLight)

    const sunLight = new THREE.PointLight('#ffd27a', 30, 0, 1.25)
    sunLight.position.set(0, 0, 0)
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight('#6d8dff', 0.62)
    fillLight.position.set(-18, 8, -12)
    scene.add(fillLight)

    const warmFillLight = new THREE.DirectionalLight('#ffb36b', 0.44)
    warmFillLight.position.set(14, 5, 10)
    scene.add(warmFillLight)

    const rimLight = new THREE.DirectionalLight('#b8cbff', 0.5)
    rimLight.position.set(-12, 10, -18)
    scene.add(rimLight)

    const starsGeometry = new THREE.BufferGeometry()
    const starCount = 2200
    const starPositions = new Float32Array(starCount * 3)

    for (let index = 0; index < starCount; index += 1) {
      const stride = index * 3
      starPositions[stride] = (Math.random() - 0.5) * 140
      starPositions[stride + 1] = (Math.random() - 0.5) * 100
      starPositions[stride + 2] = (Math.random() - 0.5) * 140
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

    const starsMaterial = new THREE.PointsMaterial({
      color: '#d7dde6',
      size: 0.12,
      sizeAttenuation: true,
    })

    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    const sunCore = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 48, 48),
      new THREE.MeshStandardMaterial({
        color: '#ffb347',
        emissive: '#ff9328',
        emissiveIntensity: 2.2,
        roughness: 0.7,
        metalness: 0.02,
      }),
    )
    scene.add(sunCore)

    const sunHalo = new THREE.Mesh(
      new THREE.SphereGeometry(2.8, 40, 40),
      new THREE.MeshBasicMaterial({
        color: '#ff8f2f',
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      }),
    )
    scene.add(sunHalo)

    const loader = new GLTFLoader()
    const disposables: THREE.Object3D[] = [sunCore, sunHalo, stars]
    const orbitingBodies: OrbitingBody[] = []

    const addBodyFromAsset = (config: BodyConfig) => {
      const orbitLine = createOrbitLine(config.orbitRadius)
      scene.add(orbitLine)
      disposables.push(orbitLine)

      const orbitGroup = new THREE.Group()
      orbitGroup.rotation.y = config.initialAngle
      scene.add(orbitGroup)
      disposables.push(orbitGroup)

      const anchor = new THREE.Group()
      anchor.position.x = config.orbitRadius
      orbitGroup.add(anchor)

      const spinRoot = new THREE.Group()
      if (config.tiltX)
        spinRoot.rotation.x = config.tiltX
      if (config.tiltZ)
        spinRoot.rotation.z = config.tiltZ
      anchor.add(spinRoot)

      orbitingBodies.push({
        orbitGroup,
        anchor,
        spinRoot,
        orbitSpeed: config.orbitSpeed,
        spinSpeed: config.spinSpeed,
      })

      loader.load(
        config.assetPath,
        (gltf: GLTF) => {
          const loadedModel = gltf.scene
          const modelPivot = new THREE.Group()
          modelPivot.add(loadedModel)

          const bounds = new THREE.Box3().setFromObject(loadedModel)
          const center = bounds.getCenter(new THREE.Vector3())
          const size = bounds.getSize(new THREE.Vector3())
          const maxDimension = Math.max(size.x, size.y, size.z, 1)
          const oversizeNormalization = maxDimension > 20 ? 3 / maxDimension : 1

          loadedModel.position.sub(center)
          modelPivot.scale.setScalar(config.scale * oversizeNormalization)

          loadedModel.traverse((child: THREE.Object3D) => {
            const mesh = child as THREE.Mesh
            if (!mesh.isMesh)
              return

            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            materials.forEach((material) => {
              const standardMaterial = material as THREE.MeshStandardMaterial
              if (standardMaterial.map)
                standardMaterial.map.colorSpace = THREE.SRGBColorSpace
              if (standardMaterial.emissiveMap)
                standardMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace
              if ('emissiveIntensity' in standardMaterial)
                standardMaterial.emissiveIntensity = config.name === 'earth' ? 0.7 : 0.15
              standardMaterial.needsUpdate = true
            })
          })

          spinRoot.add(modelPivot)
          disposables.push(modelPivot)

          if (config.name === 'earth') {
            const moonOrbitGroup = new THREE.Group()
            anchor.add(moonOrbitGroup)

            const moonAnchor = new THREE.Group()
            moonAnchor.position.x = 1.15
            moonOrbitGroup.add(moonAnchor)
            disposables.push(moonOrbitGroup)

            orbitingBodies.push({
              orbitGroup: moonOrbitGroup,
              anchor: moonAnchor,
              spinRoot: moonAnchor,
              orbitSpeed: 0.05,
              spinSpeed: 0.016,
            })

            loader.load(
              '/moon/scene.gltf',
              (moonGltf: GLTF) => {
                const moonModel = moonGltf.scene
                const moonPivot = new THREE.Group()
                moonPivot.add(moonModel)

                const moonBounds = new THREE.Box3().setFromObject(moonModel)
                const moonCenter = moonBounds.getCenter(new THREE.Vector3())
                const moonSize = moonBounds.getSize(new THREE.Vector3())
                const moonMaxDimension = Math.max(moonSize.x, moonSize.y, moonSize.z, 1)
                const moonNormalization = moonMaxDimension > 20 ? 3 / moonMaxDimension : 1

                moonModel.position.sub(moonCenter)
                moonPivot.scale.setScalar(0.11 * moonNormalization)
                moonAnchor.add(moonPivot)
                disposables.push(moonPivot)
              },
              undefined,
              () => {
                const fallbackMoon = createFallbackPlanet(0.18, '#9c9c9c')
                moonAnchor.add(fallbackMoon)
                disposables.push(fallbackMoon)
              },
            )
          }
        },
        undefined,
        () => {
          const fallback = createFallbackPlanet(
            Math.max(config.scale * 1.2, 0.18),
            config.name === 'mars' ? '#b96d44' : config.name === 'earth' ? '#4f79c7' : '#c7b58a',
          )
          spinRoot.add(fallback)
          disposables.push(fallback)
        },
      )
    }

    planetConfigs.forEach(addBodyFromAsset)

    const resize = () => {
      const width = mountNode.clientWidth
      const height = mountNode.clientHeight
      if (width === 0 || height === 0)
        return

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    resize()
    window.addEventListener('resize', resize)
    const resizeObserver = new ResizeObserver(() => {
      resize()
    })
    resizeObserver.observe(mountNode)

    let frameId = 0
    const clock = new THREE.Clock()

    const animate = () => {
      const delta = clock.getDelta()
      const elapsed = clock.getElapsedTime()

      stars.rotation.y += delta * 0.01
      sunCore.rotation.y += delta * 0.12
      sunHalo.rotation.y -= delta * 0.05
      sunHalo.scale.setScalar(1 + Math.sin(elapsed * 1.1) * 0.01)

      orbitingBodies.forEach((body) => {
        body.orbitGroup.rotation.y += body.orbitSpeed * delta * 3.2
        body.spinRoot.rotation.y += body.spinSpeed * delta * 3.2
      })

      controls.update()
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      resizeObserver.disconnect()
      controls.dispose()

      disposables.forEach((object) => {
        object.traverse((child: THREE.Object3D) => {
          const mesh = child as THREE.Mesh
          if (mesh.geometry)
            mesh.geometry.dispose()
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material: THREE.Material) => material.dispose())
          } else if (mesh.material) {
            mesh.material.dispose()
          }
        })
      })

      starsGeometry.dispose()
      starsMaterial.dispose()
      renderer.dispose()

      if (renderer.domElement.parentNode === mountNode)
        mountNode.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <aside className="info-panel render-panel">
      <div className="info-content render-content">
        <h2>Solar System Render</h2>
        <p className="info-text">
          First-pass system scene with compressed orbit scales, live orbital motion, and interactive camera controls.
        </p>

        <div className="render-preview-card solar-system-preview-card">
          <div ref={mountRef} className="solar-system-canvas" />
        </div>
      </div>
    </aside>
  )
}
