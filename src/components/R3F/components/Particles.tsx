import { useRef, useMemo, MutableRefObject } from 'react'
import {
  InstancedMesh,
  PointLight,
  Group,
  Object3D,
  BufferGeometry,
  ShapeGeometry,
  Material
} from 'three'

import { useFrame, useThree } from '@react-three/fiber'

interface ParticlesProps {
  count: number
  mouse: MutableRefObject<number[]>
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

const Particles: React.FC<ParticlesProps> = ({ count, mouse }) => {
  const mesh = useRef<InstancedMesh>(null)
  const group = useRef<Group>(null)
  const light = useRef<PointLight>(null)
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  const dummy = useMemo(() => new Object3D(), [])
  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp: Array<Particle> = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({
        t,
        factor,
        speed,
        xFactor,
        yFactor,
        zFactor,
        mx: 0,
        my: 0,
        mz: 0
      })
    }
    return temp
  }, [count])

  // The innards of this hook will run every frame
  useFrame(() => {
    // Makes the light follow the mouse
    light.current?.position.set(
      mouse.current[0] / aspect,
      -mouse.current[1] / aspect,
      0
    )

    // Run through the randomized data to calculate some movement
    particles.forEach((particle, index) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle

      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2

      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)

      particle.mx += (mouse.current[0] - particle.mx) * 0.01
      particle.my += (mouse.current[1] * -1 - particle.my) * 0.01
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
      mesh.current?.setMatrixAt(index, dummy.matrix)
    })

    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true
    }
  })

  const instancedMeshArgs = useMemo<
    [
      geometry: ShapeGeometry | BufferGeometry,
      material: Material | Material[],
      count: number
    ]
  >(() => [new ShapeGeometry(), new Material(), count], [])

  const dodecahedronBufferGeometryArgs = useMemo<
    [radius?: number, detail?: number]
  >(() => [0.2, 0], [])

  return (
    <group ref={group}>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
      <instancedMesh ref={mesh} args={instancedMeshArgs}>
        <dodecahedronBufferGeometry args={dodecahedronBufferGeometryArgs} />
        <meshPhongMaterial color="#040412" />
      </instancedMesh>
    </group>
  )
}

export default Particles
