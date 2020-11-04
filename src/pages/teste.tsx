import React, { useCallback, useRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { Color, ReinhardToneMapping } from 'three'

import { EffectComposer, DepthOfField } from '@react-three/postprocessing'

// import Lights from '../components/R3F/Lights'
import Particles from '../components/R3F/Particles'

const Teste: React.FC = () => {
  const [down, set] = useState(false)
  const mouse = useRef([0, 0])
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
        gl.setClearColor(new Color('#040412'))
      }}
    >
      <fog attach="fog" args={['white', 50, 190]} />
      <pointLight distance={100} intensity={4} color="white" />
      <Particles count={10000} mouse={mouse} />

      <EffectComposer>
        <DepthOfField />
      </EffectComposer>
    </Canvas>
  )
}

export default Teste
