import { useSyncExternalStore } from 'react'

/**
 * Every tunable of the ocean scene. The scene reads these each frame, so
 * edits from the controls panel show up immediately.
 */
export interface OceanParams {
  // Camera
  fov: number
  depth: number
  pitch: number
  bob: number
  mouseLook: number
  // Light from the surface
  deepColor: string
  brightColor: string
  haze: number
  shafts: number
  shaftEdge: number
  // Specks
  count: number
  size: number
  maxPixels: number
  brightness: number
  tint: number
  depthFalloff: number
  shaftBoost: number
  sink: number
  drift: number
  // Glints
  glint: number
  glintRarity: number
  glintRate: number
  glintDuration: number
  // Water & lens
  fogDensity: number
  grain: number
  vignette: number
  bloomIntensity: number
  bloomThreshold: number
}

export const OCEAN_DEFAULTS: OceanParams = {
  fov: 47,
  depth: 0.1,
  pitch: -82,
  bob: 0.29,
  mouseLook: 0.4,
  deepColor: '#5f7595',
  brightColor: '#5fb6ff',
  haze: 4,
  shafts: 0.25,
  shaftEdge: 0.58,
  count: 16000,
  size: 0.025,
  maxPixels: 3.5,
  brightness: 1.9,
  tint: 0.2,
  depthFalloff: 0.12,
  shaftBoost: 1.45,
  sink: 0.49,
  drift: 3,
  glint: 15.5,
  glintRarity: 0.31,
  glintRate: 0.22,
  glintDuration: 0.015,
  fogDensity: 0.066,
  grain: 0.024,
  vignette: 0.9,
  bloomIntensity: 1.9,
  bloomThreshold: 1.21
}

type NumberKey = {
  [K in keyof OceanParams]: OceanParams[K] extends number ? K : never
}[keyof OceanParams]
type ColorKey = Exclude<keyof OceanParams, NumberKey>

export type ControlSpec =
  | {
      key: NumberKey
      label: string
      min: number
      max: number
      step: number
    }
  | { key: ColorKey; label: string; color: true }

export const OCEAN_CONTROLS: { title: string; controls: ControlSpec[] }[] = [
  {
    title: 'Câmera',
    controls: [
      { key: 'depth', label: 'Profundidade', min: 0.1, max: 15, step: 0.05 },
      { key: 'pitch', label: 'Inclinação (°)', min: -90, max: 30, step: 1 },
      { key: 'fov', label: 'Campo de visão', min: 25, max: 110, step: 1 },
      { key: 'bob', label: 'Balanço', min: 0, max: 0.5, step: 0.01 },
      { key: 'mouseLook', label: 'Olhar com mouse', min: 0, max: 1, step: 0.01 }
    ]
  },
  {
    title: 'Luz da superfície',
    controls: [
      { key: 'deepColor', label: 'Azul profundo', color: true },
      { key: 'brightColor', label: 'Azul claro', color: true },
      { key: 'haze', label: 'Brilho difuso', min: 0, max: 8, step: 0.05 },
      { key: 'shafts', label: 'Raios', min: 0, max: 3, step: 0.05 },
      {
        key: 'shaftEdge',
        label: 'Raios: finura',
        min: 0.2,
        max: 0.8,
        step: 0.01
      }
    ]
  },
  {
    title: 'Partículas',
    controls: [
      { key: 'count', label: 'Quantidade', min: 1000, max: 100000, step: 1000 },
      { key: 'size', label: 'Tamanho', min: 0.005, max: 0.1, step: 0.001 },
      {
        key: 'maxPixels',
        label: 'Tamanho máx. (px)',
        min: 1,
        max: 16,
        step: 0.5
      },
      { key: 'brightness', label: 'Brilho', min: 0, max: 10, step: 0.1 },
      { key: 'tint', label: 'Tom azul', min: 0, max: 1, step: 0.01 },
      {
        key: 'depthFalloff',
        label: 'Escurece com profundidade',
        min: 0,
        max: 0.4,
        step: 0.005
      },
      {
        key: 'shaftBoost',
        label: 'Brilho nos raios',
        min: 0,
        max: 5,
        step: 0.05
      },
      { key: 'sink', label: 'Afundar', min: 0, max: 0.6, step: 0.01 },
      { key: 'drift', label: 'Correnteza', min: 0, max: 6, step: 0.05 }
    ]
  },
  {
    title: 'Reflexos',
    controls: [
      { key: 'glint', label: 'Força', min: 0, max: 20, step: 0.1 },
      { key: 'glintRarity', label: 'Raridade', min: 0, max: 1, step: 0.01 },
      {
        key: 'glintRate',
        label: 'Frequência',
        min: 0.02,
        max: 1.5,
        step: 0.01
      },
      {
        key: 'glintDuration',
        label: 'Duração',
        min: 0.005,
        max: 0.25,
        step: 0.005
      }
    ]
  },
  {
    title: 'Água e lente',
    controls: [
      { key: 'fogDensity', label: 'Turbidez', min: 0, max: 0.15, step: 0.001 },
      { key: 'grain', label: 'Granulado', min: 0, max: 0.12, step: 0.001 },
      { key: 'vignette', label: 'Vinheta', min: 0, max: 2.5, step: 0.05 },
      { key: 'bloomIntensity', label: 'Bloom', min: 0, max: 3, step: 0.05 },
      {
        key: 'bloomThreshold',
        label: 'Bloom: limiar',
        min: 0,
        max: 1.5,
        step: 0.01
      }
    ]
  }
]

function hash(text: string): string {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

// Saved edits are tied to the defaults they were made against: once the
// defaults in code change (e.g. after pasting values back), old edits drop.
const STORAGE_KEY = `oceano-params:${hash(JSON.stringify(OCEAN_DEFAULTS))}`

function load(): OceanParams {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return OCEAN_DEFAULTS
    return { ...OCEAN_DEFAULTS, ...(JSON.parse(saved) as Partial<OceanParams>) }
  } catch {
    return OCEAN_DEFAULTS
  }
}

// Visitors always get the defaults; saved edits only load while tuning
let current = OCEAN_DEFAULTS
let tuning = false
const listeners = new Set<() => void>()

function emit() {
  if (!tuning) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // Private mode / quota: edits still apply, they just don't persist
  }
}

function notify() {
  emit()
  listeners.forEach(listener => listener())
}

export const oceanParams = {
  get: (): OceanParams => current,
  /** Called by the controls panel: restores (and from then on saves) edits */
  enableTuning: () => {
    if (tuning) return
    tuning = true
    current = load()
    listeners.forEach(listener => listener())
  },
  set: (patch: Partial<OceanParams>) => {
    current = { ...current, ...patch }
    notify()
  },
  reset: () => {
    current = OCEAN_DEFAULTS
    notify()
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
}

const serverSnapshot = () => OCEAN_DEFAULTS

export function useOceanParams(): OceanParams {
  return useSyncExternalStore(
    oceanParams.subscribe,
    oceanParams.get,
    serverSnapshot
  )
}
