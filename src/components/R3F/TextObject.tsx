import lerp from 'lerp'
import React, { Suspense, useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Group } from 'three'

import Text from './Text'

const TextObject = ({ mouse, hover }) => {
  const ref = useRef<Group>()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  useFrame(state => {
    if (ref.current) {
      ref.current.position.x = lerp(
        ref.current.position.x,
        mouse.current[0] / aspect / 10,
        0.1
      )
      ref.current.rotation.x = lerp(
        ref.current.rotation.x,
        0 + mouse.current[1] / aspect / 50,
        0.1
      )
      ref.current.rotation.y = 0.8
    }
  })

  return (
    <Suspense fallback={null}>
      <group ref={ref}>
        <Text
          size={10}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
        >
          Blog do Pedro Pinho
        </Text>
      </group>
    </Suspense>
  )
}

export default TextObject
