import React from 'react'

import {
  EffectComposer,
  DepthOfField,
  ChromaticAberration,
  Vignette
} from '@react-three/postprocessing'

const Effects: React.FC = () => {
  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={0.181}
        focalLength={0.3464}
        bokehScale={1.295}
        height={480}
        blur={0.49}
      />
      <Vignette opacity={0.5} />
      <ChromaticAberration />
    </EffectComposer>
  )
}

export default Effects
