import React from 'react'
import { Canvas } from 'react-three-fiber'
import { ReinhardToneMapping, Color } from 'three'

import Effects from './components/Effects'
import Particles from './components/Particles'

interface EerieSceneProps {
  isMobile: boolean
  mouse: React.MutableRefObject<number[]>
}

const EerieScene: React.FC<EerieSceneProps> = ({ isMobile, mouse }) => {
  return (
    <Canvas
      pixelRatio={1}
      camera={{ fov: 100, position: [0, 0, 30] }}
      onCreated={({ gl }) => {
        gl.toneMapping = ReinhardToneMapping
        gl.setClearColor(new Color('#03030a'))
      }}
      gl={{
        powerPreference: 'high-performance'
      }}
    >
      <fog attach="fog" args={['#040412', 50, 150]} />
      <pointLight distance={100} intensity={2} color="lightblue" />
      <ambientLight intensity={10} color="lightblue" />

      <Particles count={isMobile ? 3000 : 8000} mouse={mouse} />
      <Effects isMobile={isMobile} />
    </Canvas>
  )
}

export default EerieScene
