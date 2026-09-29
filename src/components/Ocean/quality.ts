export type Quality = 'high' | 'low'

/** fbm octaves for the water shafts; phones get fewer */
export const OCTAVES_HIGH = 4
export const OCTAVES_LOW = 2

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** Small touch screens, few cores or data saver get the light version */
export function detectQuality(): Quality {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = Math.min(window.innerWidth, window.innerHeight) < 700
  const cores = navigator.hardwareConcurrency || 4
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData === true
  return (coarse && small) || cores <= 4 || saveData ? 'low' : 'high'
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
