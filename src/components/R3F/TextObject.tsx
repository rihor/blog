import React, { Suspense, useMemo, useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Group, Vector3 } from 'three'

import Text from './Text'

const TextObject: React.FC = () => {
  const ref = useRef<Group>()
  // const { size, viewport } = useThree()
  // const aspect = size.width / viewport.width

  useFrame(() => {
    // if (ref.current) {
    //   ref.current.position.x = lerp(
    //     ref.current.position.x,
    //     mouse.current[0] / aspect / 10,
    //     0.1
    //   )
    //   ref.current.rotation.x = lerp(
    //     ref.current.rotation.x,
    //     0 + mouse.current[1] / aspect / 50,
    //     0.1
    //   )
    //   ref.current.rotation.y = 0.8
    // }
  })

  const position = useMemo(() => new Vector3(0, 50, -150), [])

  return (
    <Suspense fallback={null}>
      <group ref={ref}>
        <Text size={10} position={position}>
          Pedro
        </Text>
      </group>
    </Suspense>
  )
}

export default TextObject
