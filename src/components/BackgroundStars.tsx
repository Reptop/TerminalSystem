import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function BackgroundStars() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mountNode = mountRef.current
    if (!mountNode) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.z = 18

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountNode.appendChild(renderer.domElement)

    const starCount = 1800
    const starPositions = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)

    for (let index = 0; index < starCount; index += 1) {
      const stride = index * 3
      starPositions[stride] = (Math.random() - 0.5) * 70
      starPositions[stride + 1] = (Math.random() - 0.5) * 42
      starPositions[stride + 2] = (Math.random() - 0.5) * 50
      starSizes[index] = Math.random() * 1.4 + 0.35
    }

    const starsGeometry = new THREE.BufferGeometry()
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))

    const starsMaterial = new THREE.PointsMaterial({
      color: '#f2f2f0',
      size: 0.12,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    })

    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    const hazeGeometry = new THREE.BufferGeometry()
    const hazeCount = 220
    const hazePositions = new Float32Array(hazeCount * 3)
    for (let index = 0; index < hazeCount; index += 1) {
      const stride = index * 3
      hazePositions[stride] = (Math.random() - 0.5) * 60
      hazePositions[stride + 1] = (Math.random() - 0.5) * 30
      hazePositions[stride + 2] = (Math.random() - 0.5) * 40
    }
    hazeGeometry.setAttribute('position', new THREE.BufferAttribute(hazePositions, 3))

    const hazeMaterial = new THREE.PointsMaterial({
      color: '#8f96a3',
      size: 0.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.18,
    })
    const haze = new THREE.Points(hazeGeometry, hazeMaterial)
    scene.add(haze)

    const resize = () => {
      const width = mountNode.clientWidth
      const height = mountNode.clientHeight
      if (height === 0) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    resize()
    window.addEventListener('resize', resize)

    let frameId = 0
    const animate = () => {
      stars.rotation.y += 0.00018
      stars.rotation.x += 0.00005
      haze.rotation.y -= 0.00008
      haze.rotation.x += 0.00004

      const positions = starsGeometry.attributes.position.array as Float32Array
      for (let index = 0; index < starCount; index += 1) {
        const zIndex = index * 3 + 2
        positions[zIndex] += 0.02
        if (positions[zIndex] > 18) positions[zIndex] = -32
      }
      starsGeometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      starsGeometry.dispose()
      starsMaterial.dispose()
      hazeGeometry.dispose()
      hazeMaterial.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div className="background-stars" ref={mountRef} aria-hidden="true" />
}
