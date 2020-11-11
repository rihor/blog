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
    <>
      <Canvas
        pixelRatio={Math.min(isMobile ? window.devicePixelRatio : 1)}
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

        <Particles count={isMobile ? 5000 : 8000} mouse={mouse} />
        <Effects />
      </Canvas>
      <h2 style={{ color: 'white', fontSize: 50 }}>
        Piexel Ratio:{' '}
        {String(Math.min(2, isMobile ? window.devicePixelRatio : 1))}
      </h2>
      <h2 style={{ color: 'white', fontSize: 50 }}>
        devicePixelRatio: {String(isMobile ? window.devicePixelRatio : 1)}
      </h2>
    </>
  )
}

export default EerieScene
