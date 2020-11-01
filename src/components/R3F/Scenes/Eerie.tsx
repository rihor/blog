import React, { useRef } from 'react'
import { Canvas } from 'react-three-fiber'
import { Group, Vector3 } from 'three'

import Droplet from '../Droplet'
import Environment from '../Environment'
import Lights from '../Lights'

const Rain: React.FC = () => {
  const group = useRef<Group>()

  const nodesBoxes = new Array(500).fill(undefined).map((_, index) => {
    return <Droplet key={index} />
  })

  return <group ref={group}>{nodesBoxes}</group>
}

const Eerie: React.FC = () => {
  return (
    <Canvas>
      <Lights />
      <Environment />
      <Rain />
    </Canvas>
  )
}

export default Eerie
