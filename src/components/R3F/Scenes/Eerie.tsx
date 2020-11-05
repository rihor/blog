import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { ReinhardToneMapping, Color } from 'three'

import Effects from '../Effects'
import Particles from '../Particles'

interface EerieSceneProps {
  isMobile: boolean
}

interface MouseMoveArgs {
  clientX: number
  clientY: number
}

const EerieScene: React.FC<EerieSceneProps> = ({ isMobile }) => {
  const mouse = useRef([0, 0])

  useEffect(() => {
    console.log(navigator)
  }, [])

  const onMouseMove = useCallback(
    ({ clientX, clientY }: MouseMoveArgs) =>
      (mouse.current = [
        clientX - window.innerWidth / 2,
        clientY - window.innerHeight / 2
      ]),
    []
  )

  return (
    <Canvas
      pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
      camera={{ fov: 100, position: [0, 0, 30] }}
      onMouseMove={onMouseMove}
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

      <Particles count={isMobile ? 5000 : 8000} mouse={mouse} />
      <Effects />
    </Canvas>
  )
}

export default EerieScene
