import React, { useMemo } from 'react'
import { Vector2 } from 'three'

import {
  EffectComposer,
  DepthOfField,
  ChromaticAberration,
  Vignette,
  Bloom
} from '@react-three/postprocessing'

const Effects: React.FC = () => {
  const chromaticAberrationOffset = useMemo(() => new Vector2(0.02, 0.002), [])

  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={0.181}
        focalLength={0.3464}
        bokehScale={1.295}
        height={480}
        blur={0.49}
      />
      <Vignette opacity={0.6} />
      <ChromaticAberration offset={chromaticAberrationOffset} />
      <Bloom luminanceThreshold={0.6} />
    </EffectComposer>
  )
}

export default Effects
