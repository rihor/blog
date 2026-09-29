import type { RefObject } from 'react'
import { useRef, useMemo } from 'react'
import type { InstancedMesh, PointLight, Group, BufferGeometry } from 'three'
import { Object3D, ShapeGeometry, Material } from 'three'

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
  mx: number
  my: number
  mz: number
}

// Generate some random positions, speed factors and timings
function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    t: Math.random() * 100,
    factor: 20 + Math.random() * 100,
    speed: 0.01 + Math.random() / 200,
    xFactor: -50 + Math.random() * 100,
    yFactor: -50 + Math.random() * 100,
    zFactor: -50 + Math.random() * 100,
    mx: 0,
    my: 0,
    mz: 0
  }))
}

const Particles: React.FC<ParticlesProps> = ({ count, mouseRef }) => {
  const meshRef = useRef<InstancedMesh>(null)
  const groupRef = useRef<Group>(null)
  const lightRef = useRef<PointLight>(null)
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  const dummy = useMemo(() => new Object3D(), [])
  const particles = useMemo(() => createParticles(count), [count])

  // The innards of this hook will run every frame
  useFrame(() => {
    // Makes the light follow the mouse
    lightRef.current?.position.set(
      mouseRef.current[0] / aspect,
      -mouseRef.current[1] / aspect,
      0
    )

    // Run through the randomized data to calculate some movement
    particles.forEach((particle, index) => {
      const { factor, speed, xFactor, yFactor, zFactor } = particle

      // There is no sense or reason to any of this, just messing around with trigonometric functions
      particle.t += speed / 2
      const t = particle.t

      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)

      particle.mx += (mouseRef.current[0] - particle.mx) * 0.01
      particle.my += (mouseRef.current[1] * -1 - particle.my) * 0.01
      particle.mz = 0.05

      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.mz / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      )

      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()

      // And apply the matrix to the instanced item
      meshRef.current?.setMatrixAt(index, dummy.matrix)
    })

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  const instancedMeshArgs = useMemo<
    [
      geometry: ShapeGeometry | BufferGeometry,
      material: Material | Material[],
      count: number
    ]
  >(() => [new ShapeGeometry(), new Material(), count], [count])

  const dodecahedronGeometryArgs = useMemo<[radius?: number, detail?: number]>(
    () => [0.2, 0],
    []
  )

  return (
    <group ref={groupRef}>
      <pointLight
        ref={lightRef}
        distance={40}
        intensity={8}
        color="lightblue"
      />
      <instancedMesh ref={meshRef} args={instancedMeshArgs}>
        <dodecahedronGeometry args={dodecahedronGeometryArgs} />
        <meshPhongMaterial color="#040412" />
      </instancedMesh>
    </group>
  )
}

export default Particles
