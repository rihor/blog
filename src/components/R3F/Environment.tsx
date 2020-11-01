import React from 'react'
import { BackSide } from 'three'

const Environment: React.FC = () => {
  return (
    <mesh>
      <sphereBufferGeometry args={[5, 10, 10]} attach="geometry" />
      <meshStandardMaterial
        color={0xff01579b}
        attach="material"
        side={BackSide}
        metalness={0.4}
      />
    </mesh>
  )
}

export default Environment
