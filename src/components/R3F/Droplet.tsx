import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { Mesh } from 'three'

const Droplet: React.FC = () => {
  const mesh = useRef<Mesh>()

  useFrame(() => {
    if (mesh.current.position.y <= -4) {
      mesh.current.position.y = Math.random() * (5 - 4 + 1) + 4
      mesh.current.position.x = Math.random() * (5 - -5 + 1) + -5
      mesh.current.position.z = Math.random() * (5 - 0.6 + 1) + 0.6
    } else {
      mesh.current.position.y -= 0.15
    }
  })

  return (
    <mesh
      ref={mesh}
      position={[
        Math.random() * (5 - 4 + 1) + 4,
        Math.random() * (5 - -5 + 1) + -5,
        Math.random() * (5 - 0.6 + 1) + 0.6
      ]}
    >
      <boxBufferGeometry attach="geometry" args={[0.01, 0.3, 0.01]} />
      <meshStandardMaterial
        attach="material"
        color={0xffe3f2fd}
        opacity={0.8}
        transparent={true}
      />
    </mesh>
  )
}

export default Droplet
