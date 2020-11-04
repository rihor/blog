import React, { useCallback, useRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { ReinhardToneMapping, Color } from 'three'

import Effects from '../Effects'
import Particles from '../Particles'

const Eerie: React.FC = () => {
  const [down, set] = useState(false)
  const mouse = useRef([0, 0])
  // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isMobile = false

  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  )

  return (
    <Canvas
      pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
      camera={{ fov: 100, position: [0, 0, 30] }}
      onMouseMove={onMouseMove}
      onMouseUp={() => set(false)}
      onMouseDown={() => set(true)}
      onCreated={({ gl }) => {
        gl.toneMapping = ReinhardToneMapping
        gl.setClearColor(new Color('#03030a'))
      }}
      gl={{
        powerPreference: 'high-performance'
      }}
    >
      <fog attach="fog" args={['#040412', 50, 190]} />
      <pointLight distance={100} intensity={2} color="lightblue" />
      <ambientLight intensity={10} color="lightblue" />

      <Particles count={8000} mouse={mouse} />
      <Effects />
    </Canvas>
  )
}

export default Eerie
