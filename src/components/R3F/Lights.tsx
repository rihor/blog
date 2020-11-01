import React from 'react'

const Lights: React.FC = () => {
  return (
    <group>
      <ambientLight intensity={0.9} />
      <pointLight intensity={1.12} position={[0, 0, 0]} />
    </group>
  )
}

export default Lights
