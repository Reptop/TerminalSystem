import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

type TerminalModelPreviewProps = {
  assetPath: string
  label: string
}

function createFlareTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')

  if (!context)
    return null

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )

  gradient.addColorStop(0, 'rgba(255,245,220,1)')
  gradient.addColorStop(0.22, 'rgba(255,196,72,0.95)')
  gradient.addColorStop(0.55, 'rgba(255,110,20,0.45)')
  gradient.addColorStop(1, 'rgba(255,110,20,0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  return texture
}

export default function TerminalModelPreview({ assetPath, label }: TerminalModelPreviewProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mountNode = mountRef.current

    if (!mountNode)
      return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#060709')
    scene.fog = new THREE.Fog('#060709', 9, 24)

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0.3, 8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    mountNode.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = true
    controls.minDistance = 4
    controls.maxDistance = 40
    controls.target.set(0, 0, 0)
    controls.update()

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.38, 0.4, 0.72)
    composer.addPass(bloomPass)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const sunLight = new THREE.PointLight('#ffcf88', 5.5, 26, 2)
    sunLight.position.set(0, 0, 0)
    scene.add(sunLight)

    const rimLight = new THREE.DirectionalLight('#9dc8ff', 0.6)
    rimLight.position.set(-4, 2, 5)
    scene.add(rimLight)

    const fillLight = new THREE.DirectionalLight('#ff7b2c', 0.75)
    fillLight.position.set(2, -1, 4)
    scene.add(fillLight)

    const starsGeometry = new THREE.BufferGeometry()
    const starCount = 900
    const positions = new Float32Array(starCount * 3)

    for (let index = 0; index < starCount; index += 1) {
      const stride = index * 3

      positions[stride] = (Math.random() - 0.5) * 36
      positions[stride + 1] = (Math.random() - 0.5) * 22
      positions[stride + 2] = (Math.random() - 0.5) * 36
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const starsMaterial = new THREE.PointsMaterial({
      color: '#d9dde6',
      size: 0.08,
      sizeAttenuation: true,
    })

    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    const flareTexture = createFlareTexture()
    const flareSprites: THREE.Sprite[] = []
    let coronaMesh: THREE.Mesh | null = null

    if (assetPath === '/sun/scene.gltf' && flareTexture) {
      const coronaGeometry = new THREE.SphereGeometry(1.45, 48, 48)
      const coronaMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPosition;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;

          void main() {
            vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
            float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.6);
            float pulse = 0.72 + 0.28 * sin(time * 1.4 + vWorldPosition.y * 2.2);
            vec3 color = mix(vec3(1.0, 0.45, 0.05), vec3(1.0, 0.82, 0.18), fresnel);
            gl_FragColor = vec4(color, fresnel * 0.42 * pulse);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      })
      coronaMesh = new THREE.Mesh(coronaGeometry, coronaMaterial)
      coronaMesh.scale.setScalar(1.18)
      scene.add(coronaMesh)

      const flareConfigs = [
        { position: new THREE.Vector3(1.8, 0.35, 0.25), scale: 1.7, opacity: 0.48 },
        { position: new THREE.Vector3(-1.55, -0.7, 0.15), scale: 1.15, opacity: 0.34 },
        { position: new THREE.Vector3(0.15, 1.65, 0.2), scale: 0.9, opacity: 0.28 },
      ]

      flareConfigs.forEach((config) => {
        const spriteMaterial = new THREE.SpriteMaterial({
          map: flareTexture,
          color: '#ffb347',
          transparent: true,
          opacity: config.opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const sprite = new THREE.Sprite(spriteMaterial)
        sprite.position.copy(config.position)
        sprite.scale.setScalar(config.scale)
        flareSprites.push(sprite)
        scene.add(sprite)
      })
    }

    const loader = new GLTFLoader()
    let modelRoot: THREE.Object3D | null = null

    loader.load(
      assetPath,
      (gltf: GLTF) => {
        const loadedModel = gltf.scene
        const modelPivot = new THREE.Group()
        modelPivot.add(loadedModel)

        // Recenter the imported asset so rotation happens around its visual center,
        // not whatever origin the exporter left behind.
        const bounds = new THREE.Box3().setFromObject(loadedModel)
        const center = bounds.getCenter(new THREE.Vector3())
        const size = bounds.getSize(new THREE.Vector3())
        const maxDimension = Math.max(size.x, size.y, size.z, 1)
        const oversizeNormalization = maxDimension > 20 ? 3 / maxDimension : 1
        loadedModel.position.sub(center)

        modelRoot = modelPivot
        modelRoot.scale.setScalar(1.7 * oversizeNormalization)
        modelRoot.position.set(0, 0, 0)
        const meshDiagnostics: string[] = []
        let visibleMeshCount = 0

        loadedModel.traverse((child: THREE.Object3D) => {
          const mesh = child as THREE.Mesh
          if (!mesh.isMesh)
            return
          visibleMeshCount += 1

          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          meshDiagnostics.push(
            `${mesh.name || '(unnamed mesh)'} -> ${materials.map((material) => material?.name || '(unnamed material)').join(', ')}`,
          )

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material: THREE.Material) => {
              const standardMaterial = material as THREE.MeshStandardMaterial
              if (standardMaterial.map) standardMaterial.map.colorSpace = THREE.SRGBColorSpace
              if (standardMaterial.emissiveMap) standardMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace
              if ('emissiveIntensity' in standardMaterial) standardMaterial.emissiveIntensity = 1.15
              standardMaterial.needsUpdate = true
            })
          } else if (mesh.material) {
            const standardMaterial = mesh.material as THREE.MeshStandardMaterial
            if (standardMaterial.map) standardMaterial.map.colorSpace = THREE.SRGBColorSpace
            if (standardMaterial.emissiveMap) standardMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace
            if ('emissiveIntensity' in standardMaterial) standardMaterial.emissiveIntensity = 1.15
            standardMaterial.needsUpdate = true
          }
        })

        if (assetPath === '/sun/scene.gltf') {
          modelRoot.scale.setScalar(1.2 * oversizeNormalization)
          camera.position.set(0, 0.22, 0.5)
          controls.minDistance = 9
          controls.maxDistance = 34
          controls.target.set(0, 0, 0)
          controls.update()
          camera.lookAt(0, 0, 0)
        }

        if (assetPath === '/saturn_planet.glb') {
          modelRoot.scale.setScalar(1.05 * oversizeNormalization)
          modelRoot.rotation.z = -0.34
          modelRoot.rotation.x = 0.18
          camera.position.set(0, 1.55, 5.25)
          controls.minDistance = 3.5
          controls.maxDistance = 16
          controls.target.set(0, 0, 0)
          controls.update()
          camera.lookAt(0, 0, 0)
          bloomPass.strength = 0.16
          bloomPass.radius = 0.28
          bloomPass.threshold = 0.78
        }

        if (assetPath === '/earth.glb') {
          modelRoot.scale.setScalar(1.05 * oversizeNormalization)
          camera.position.set(0, 0.4, 15.75)
          camera.lookAt(0, 0, 0)
          controls.minDistance = 4.5
          controls.maxDistance = 18
          controls.target.set(0, 0, 0)
          controls.update()
          bloomPass.strength = 0.08
          bloomPass.radius = 0.16
          bloomPass.threshold = 0.9

          ambientLight.intensity = 0.22
          sunLight.intensity = 7.8
          sunLight.position.set(5.5, 1.8, 6.5)
          rimLight.intensity = 1.05
          rimLight.position.set(-5, 2.4, -4.5)
          fillLight.intensity = 0.35
          fillLight.position.set(1.5, -0.5, 3.2)
        }

        if (assetPath === '/mars.glb') {
          modelRoot.scale.setScalar(1.02 * oversizeNormalization)
          camera.position.set(0, 0.24, 9.5)
          camera.lookAt(0, 0, 0)
          controls.minDistance = 3.8
          controls.maxDistance = 16
          controls.target.set(0, 0, 0)
          controls.update()
          bloomPass.strength = 0.05
          bloomPass.radius = 0.14
          bloomPass.threshold = 0.94

          ambientLight.intensity = 0.3
          sunLight.intensity = 7.2
          sunLight.position.set(4.9, 1.4, 5.8)
          rimLight.intensity = 0.62
          rimLight.position.set(-4.1, 1.7, -3.9)
          fillLight.intensity = 0.34
          fillLight.position.set(1.5, -0.15, 2.9)
        }

        if (assetPath === '/jupiter/scene.gltf') {
          modelRoot.scale.setScalar(1.08 * oversizeNormalization)
          camera.position.set(0, 0.3, 12.5)
          camera.lookAt(0, 0, 0)
          controls.minDistance = 5.5
          controls.maxDistance = 22
          controls.target.set(0, 0, 0)
          controls.update()
          bloomPass.strength = 0.1
          bloomPass.radius = 0.18
          bloomPass.threshold = 0.88

          ambientLight.intensity = 0.26
          sunLight.intensity = 6.8
          sunLight.position.set(4.8, 1.5, 5.8)
          rimLight.intensity = 0.72
          rimLight.position.set(-4.5, 1.8, -4)
          fillLight.intensity = 0.28
          fillLight.position.set(1.2, -0.4, 2.8)
        }

        if (assetPath === '/moon/scene.gltf') {
          modelRoot.scale.setScalar(0.98 * oversizeNormalization)
          camera.position.set(0, 0.18, 7.5)
          camera.lookAt(0, 0, 0)
          controls.minDistance = 3.75
          controls.maxDistance = 14
          controls.target.set(0, 0, 0)
          controls.update()
          bloomPass.strength = 0.03
          bloomPass.radius = 0.1
          bloomPass.threshold = 0.96

          ambientLight.intensity = 0.16
          sunLight.intensity = 5.4
          sunLight.position.set(5.8, 1.2, 6.2)
          rimLight.intensity = 0.5
          rimLight.position.set(-4.2, 1.4, -3.8)
          fillLight.intensity = 0.16
          fillLight.position.set(1.1, -0.25, 2.1)
        }

        console.log(`[TerminalModelPreview] ${label} meshes`, meshDiagnostics)
        scene.add(modelRoot)
      },
      undefined,
      () => {
        const fallbackGeometry = new THREE.SphereGeometry(1.45, 40, 40)
        const fallbackMaterial = new THREE.MeshStandardMaterial({
          color: '#f6b34d',
          emissive: '#e88a20',
          emissiveIntensity: 1.2,
          roughness: 0.75,
        })
        modelRoot = new THREE.Mesh(fallbackGeometry, fallbackMaterial)
        scene.add(modelRoot)
      },
    )

    const resize = () => {
      const width = mountNode.clientWidth
      const height = mountNode.clientHeight
      if (height === 0) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      composer.setSize(width, height)
      bloomPass.setSize(width, height)
    }

    resize()
    window.addEventListener('resize', resize)

    let frameId = 0

    const animate = () => {
      stars.rotation.y += 0.0007

      if (modelRoot) {
        if (assetPath === '/earth.glb' || assetPath === '/jupiter/scene.gltf' || assetPath === '/moon/scene.gltf')
          modelRoot.rotation.y += 0.0025

        else if (assetPath !== '/saturn_planet.glb') {
          modelRoot.rotation.y += 0.006
          modelRoot.rotation.x = Math.sin(Date.now() * 0.00035) * 0.08
        }
      }

      if (coronaMesh) {
        coronaMesh.rotation.y += 0.0015
        const coronaMaterial = coronaMesh.material as THREE.ShaderMaterial
        coronaMaterial.uniforms.time.value = performance.now() * 0.001
      }

      flareSprites.forEach((sprite, index) => {
        sprite.material.rotation += 0.001 * (index + 1)
        sprite.scale.setScalar((index === 0 ? 1.7 : index === 1 ? 1.15 : 0.9) + Math.sin(performance.now() * 0.0012 + index) * 0.04)
      })

      controls.update()
      composer.render()
      frameId = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)

      starsGeometry.dispose()
      starsMaterial.dispose()
      flareTexture?.dispose()
      controls.dispose()
      composer.dispose()

      if (coronaMesh) {
        coronaMesh.geometry.dispose()
          ; (coronaMesh.material as THREE.Material).dispose()
      }

      flareSprites.forEach((sprite) => {
        ; (sprite.material as THREE.Material).dispose()
      })

      if (modelRoot) {
        modelRoot.traverse((child: THREE.Object3D) => {
          const mesh = child as THREE.Mesh
          if (mesh.geometry) mesh.geometry.dispose()
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material: THREE.Material) => material.dispose())
          } else if (mesh.material) {
            mesh.material.dispose()
          }
        })
      }

      renderer.dispose()
      if (renderer.domElement.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement)
      }
    }
  }, [assetPath])

  return (
    <figure className="terminal-render-preview">
      <div ref={mountRef} className="terminal-render-canvas" />
      <figcaption className="terminal-render-caption">{label}</figcaption>
    </figure>
  )
}
