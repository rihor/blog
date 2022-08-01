import { useCallback, useMemo } from 'react'
import { ReinhardToneMapping, Color, Vector3 } from 'three'

import { Canvas, RootState } from '@react-three/fiber'

import Effects from './components/Effects'
import Particles from './components/Particles'

interface EerieSceneProps {
  isMobile: boolean
  mouse: React.MutableRefObject<number[]>
}

const EerieScene: React.FC<EerieSceneProps> = ({ isMobile, mouse }) => {
  const canvasArgs = useMemo(
    () => ({
      camera: { fov: 100, position: new Vector3(0, 0, 30) },
      gl: { powerPreference: 'high-performance' }
    }),
    []
  )

  const fogArgs = useMemo<
    [color: string | number | Color, near?: number, far?: number]
  >(() => {
    return ['#040412', 50, 150]
  }, [])

  const handleCreateCanvas = useCallback(async (props: RootState) => {
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

      <Particles count={isMobile ? 3000 : 8000} mouse={mouse} />
      <Effects isMobile={isMobile} />
    </Canvas>
  )
}

export default EerieScene
