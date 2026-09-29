import { useCallback, useMemo } from 'react'
import { ReinhardToneMapping, Color, Vector3 } from 'three'

import type { RootState } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'

import Effects from './components/Effects'
import Particles from './components/Particles'

interface EerieSceneProps {
  isMobile: boolean
  mouseRef: React.RefObject<number[]>
}

const EerieScene: React.FC<EerieSceneProps> = ({ isMobile, mouseRef }) => {
  const canvasArgs = useMemo(
    () => ({
      camera: { fov: 100, position: new Vector3(0, 0, 30) },
      gl: { powerPreference: 'high-performance' as const }
    }),
    []
  )

  const fogArgs = useMemo<
    [color: string | number | Color, near?: number, far?: number]
  >(() => {
    return ['#040412', 50, 150]
  }, [])

  const handleCreateCanvas = useCallback((props: RootState) => {
    props.gl.toneMapping = ReinhardToneMapping
    props.gl.setClearColor(new Color('#03030a'))
  }, [])

  return (
    <Canvas
      camera={canvasArgs.camera}
      onCreated={handleCreateCanvas}
      gl={canvasArgs.gl}
    >
      <fog attach="fog" args={fogArgs} />
      <pointLight distance={100} intensity={2} color="lightblue" />
      <ambientLight intensity={10} color="lightblue" />

      <Particles count={isMobile ? 3000 : 8000} mouseRef={mouseRef} />
      <Effects isMobile={isMobile} />
    </Canvas>
  )
}

export default EerieScene
