import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { Group, ReinhardToneMapping, Color } from 'three'

import Droplet from '../Droplet'
import Particles from '../Particles'
import TextObject from '../TextObject'

const Rain: React.FC = () => {
  const group = useRef<Group>()

  const nodesBoxes = new Array(1000).fill(undefined).map((_, index) => {
    return <Droplet key={index} />
  })

  return <group ref={group}>{nodesBoxes}</group>
}

const Eerie: React.FC = () => {
  const [hovered, hover] = useState(false)
  const [down, set] = useState(false)
  const mouse = useRef([0, 0])
  // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isMobile = false

  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  )

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'default'
  }, [hovered])

  return (
    <Canvas
      pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
      camera={{ fov: 100, position: [0, 0, 30] }}
      onMouseMove={onMouseMove}
      onMouseUp={() => set(false)}
      onMouseDown={() => set(true)}
      onCreated={({ gl }) => {
        gl.toneMapping = ReinhardToneMapping
        gl.setClearColor(new Color('#020207'))
      }}
    >
      <fog attach="fog" args={['white', 50, 190]} />
      <pointLight distance={100} intensity={4} color="white" />
      <TextObject mouse={mouse} hover={hover} />
      <Particles count={10000} mouse={mouse} />
    </Canvas>
  )
}

export default Eerie
