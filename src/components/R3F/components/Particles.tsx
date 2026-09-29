import type { RefObject } from 'react'
import { useLayoutEffect, useMemo, useRef } from 'react'
import type { InstancedMesh, PointLight } from 'three'
import { DynamicDrawUsage } from 'three'

import { useFrame, useThree } from '@react-three/fiber'

interface ParticlesProps {
  count: number
  mouseRef: RefObject<number[]>
}

interface Particle {
  t: number
  factor: number
  speed: number
  xFactor: number
  yFactor: number
  zFactor: number
}

// Generate some random positions, speed factors and timings
function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    t: Math.random() * 100,
    factor: 20 + Math.random() * 100,
    speed: 0.01 + Math.random() / 200,
    xFactor: -50 + Math.random() * 100,
    yFactor: -50 + Math.random() * 100,
    zFactor: -50 + Math.random() * 100
  }))
}

// The animation was tuned for fixed per-frame steps at 60fps
const FRAME = 1 / 60
// Clamp so returning to a background tab doesn't make particles jump
const MAX_STEP = 4

const Particles: React.FC<ParticlesProps> = ({ count, mouseRef }) => {
  const meshRef = useRef<InstancedMesh>(null)
  const lightRef = useRef<PointLight>(null)
  // Select only what we read so unrelated store updates don't re-render
  const aspect = useThree(state => state.size.width / state.viewport.width)

  const particles = useMemo(() => createParticles(count), [count])
  // Smoothed mouse position. Every particle used to keep its own copy, but they
  // all start at 0 and follow the same curve, so one shared value is enough.
  const smoothMouseRef = useRef({ x: 0, y: 0 })

  useLayoutEffect(() => {
    // Matrices are rewritten every frame: hint the driver
    meshRef.current?.instanceMatrix.setUsage(DynamicDrawUsage)
  }, [count])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    const [mouseX, mouseY] = mouseRef.current
    const step = Math.min(delta / FRAME, MAX_STEP)

    // Makes the light follow the mouse
    lightRef.current?.position.set(mouseX / aspect, -mouseY / aspect, 0)

    const mouse = smoothMouseRef.current
    mouse.x += (mouseX - mouse.x) * 0.01 * step
    mouse.y += (-mouseY - mouse.y) * 0.01 * step
    const mx = mouse.x / 10
    const my = mouse.y / 10
    const mz = 0.05 / 10

    // Write each instance matrix straight into the buffer (column-major):
    // rotation is an XYZ Euler with all three angles = r, scaled uniformly by s.
    // Same result as Object3D + setMatrixAt, without the Euler -> quaternion ->
    // matrix round trip and the per-instance copy.
    const out = mesh.instanceMatrix.array
    for (let i = 0, o = 0; i < particles.length; i++, o += 16) {
      const p = particles[i]
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      const t = (p.t += (p.speed / 2) * step)
      const f = p.factor

      const cosT = Math.cos(t)
      const sinT = Math.sin(t)
      const cos2T = Math.cos(t * 2)
      const a = cosT + sinT / 10
      const b = sinT + cos2T / 10
      const wave = (t / 10) * f
      const cosWave = Math.cos(wave)

      const s = cosT
      const r = cosT * 5
      const C = Math.cos(r)
      const S = Math.sin(r)
      const CC = C * C
      const CS = C * S
      const SS = S * S

      out[o] = CC * s
      out[o + 1] = (CS + CS * S) * s
      out[o + 2] = (SS - CC * S) * s
      out[o + 3] = 0
      out[o + 4] = -CS * s
      out[o + 5] = (CC - SS * S) * s
      out[o + 6] = (CS * S + CS) * s
      out[o + 7] = 0
      out[o + 8] = S * s
      out[o + 9] = -CS * s
      out[o + 10] = CC * s
      out[o + 11] = 0
      out[o + 12] = mx * a + p.xFactor + cosWave + (sinT * f) / 10
      out[o + 13] = my * b + p.yFactor + Math.sin(wave) + (cos2T * f) / 10
      out[o + 14] = mz * b + p.zFactor + cosWave + (Math.sin(t * 3) * f) / 10
      out[o + 15] = 1
    }

    mesh.instanceMatrix.needsUpdate = true
  })

  // geometry/material come from the children below; no throwaway placeholders
  const instancedMeshArgs = useMemo<[undefined, undefined, number]>(
    () => [undefined, undefined, count],
    [count]
  )

  const dodecahedronGeometryArgs = useMemo<[radius?: number, detail?: number]>(
    () => [0.2, 0],
    []
  )

  return (
    <group>
      <pointLight
        ref={lightRef}
        distance={40}
        intensity={8}
        color="lightblue"
      />
      {/* The camera sits inside the cloud and instances move every frame, so a
          bounding-sphere cull test never helps and could use a stale sphere */}
      <instancedMesh
        key={count}
        ref={meshRef}
        args={instancedMeshArgs}
        frustumCulled={false}
      >
        <dodecahedronGeometry args={dodecahedronGeometryArgs} />
        <meshPhongMaterial color="#040412" />
      </instancedMesh>
    </group>
  )
}

export default Particles
