import { useEffect, useRef } from 'react'

import { createOcean } from './createOcean'
import { detectQuality, hasWebGL } from './quality'

interface OceanStageProps {
  onReady?: () => void
}

/**
 * Client-only canvas for the ocean. Without WebGL it renders nothing and the
 * page's CSS gradient stays as the backdrop.
 */
const OceanStage: React.FC<OceanStageProps> = ({ onReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readyRef = useRef(onReady)

  useEffect(() => {
    readyRef.current = onReady
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !hasWebGL()) return
    return createOcean({
      canvas,
      quality: detectQuality(),
      onReady: () => readyRef.current?.()
    })
  }, [])

  return <canvas ref={canvasRef} />
}

export default OceanStage
