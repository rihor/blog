import React, { useMemo } from 'react'
import { Vector2 } from 'three'

import {
  EffectComposer,
  DepthOfField,
  ChromaticAberration,
  Vignette,
  Bloom
} from '@react-three/postprocessing'

interface EffectsProps {
  isMobile: boolean
}

const Effects: React.FC<EffectsProps> = ({ isMobile }) => {
  const chromaticAberrationOffset = useMemo(() => new Vector2(0.02, 0.002), [])

  return (
    <EffectComposer>
      {!isMobile && (
        <DepthOfField
          focusDistance={0.181}
          focalLength={0.3464}
          bokehScale={1.295}
          height={480}
          blur={0.49}
        />
      )}
      {!isMobile && <Vignette opacity={0.6} />}
      {!isMobile && <ChromaticAberration offset={chromaticAberrationOffset} />}
      <Bloom luminanceThreshold={0.5} />
    </EffectComposer>
  )
}

export default Effects
