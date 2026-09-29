import {
  BloomEffect,
  Effect,
  EffectComposer,
  EffectPass,
  RenderPass,
  ToneMappingEffect,
  ToneMappingMode
} from 'postprocessing'
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  HalfFloatType,
  Mesh,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Uniform,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'

import type { OceanParams } from './params'
import { oceanParams } from './params'
import type { Quality } from './quality'
import { OCTAVES_HIGH, OCTAVES_LOW, prefersReducedMotion } from './quality'
import {
  lensFragment,
  snowFragment,
  snowVertex,
  waterFragment,
  waterVertex
} from './shaders'

const FOG_COLOR = '#010207'
const SHADOW_TINT = new Vector3(0, 0.002, 0.008)
/** Column of water the specks live in; it wraps around the camera */
const BOX = new Vector3(30, 34, 30)

/** Seeded PRNG so the specks are laid out the same on every load */
function createRandom(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createSnowGeometry(count: number): BufferGeometry {
  const random = createRandom(7)
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count * 4)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (random() - 0.5) * BOX.x
    positions[i * 3 + 1] = (random() - 0.5) * BOX.y
    positions[i * 3 + 2] = (random() - 0.5) * BOX.z
    for (let k = 0; k < 4; k++) seeds[i * 4 + k] = random()
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 4))
  return geometry
}

class LensEffect extends Effect {
  constructor(time: Uniform<number>) {
    super('LensEffect', lensFragment, {
      uniforms: new Map<string, Uniform>([
        ['uVignette', new Uniform(1)],
        ['uGrain', new Uniform(0.02)],
        ['uShadowTint', new Uniform(SHADOW_TINT)],
        // Shared with the scene clock by reference: no per-frame copy
        ['uTime', time]
      ])
    })
  }

  set(vignette: number, grain: number) {
    ;(this.uniforms.get('uVignette') as Uniform<number>).value = vignette
    ;(this.uniforms.get('uGrain') as Uniform<number>).value = grain
  }
}

export interface OceanOptions {
  canvas: HTMLCanvasElement
  quality: Quality
  /** Called once the first frames are on screen */
  onReady?: () => void
}

/**
 * Starts the ocean on `canvas`: one draw call for the water, one for the
 * specks, then bloom + tone mapping + lens merged into a single pass.
 * Returns a function that stops it and frees the GPU resources.
 */
export function createOcean({
  canvas,
  quality,
  onReady
}: OceanOptions): () => void {
  const low = quality === 'low'
  const motion = prefersReducedMotion() ? 0.3 : 1

  const renderer = new WebGLRenderer({
    canvas,
    powerPreference: 'high-performance',
    // The composer renders into its own buffers; these would be wasted
    antialias: false,
    depth: false,
    stencil: false,
    alpha: false
  })
  renderer.setClearColor(FOG_COLOR)
  let dpr = Math.min(window.devicePixelRatio, low ? 1 : 1.5)
  renderer.setPixelRatio(dpr)

  const scene = new Scene()
  const camera = new PerspectiveCamera(60, 1, 0.1, 600)
  const time = new Uniform(0)

  // --- Water: a dome shaded by view direction only
  const waterGeometry = new SphereGeometry(1, 32, 16)
  const water = new ShaderMaterial({
    vertexShader: waterVertex,
    fragmentShader: waterFragment,
    uniforms: {
      uTime: time,
      uDeep: new Uniform(new Color()),
      uBright: new Uniform(new Color()),
      uHaze: new Uniform(1),
      uShafts: new Uniform(1),
      uShaftEdge: new Uniform(0.5)
    },
    defines: { OCTAVES: low ? OCTAVES_LOW : OCTAVES_HIGH },
    side: BackSide,
    depthWrite: false
  })
  const dome = new Mesh(waterGeometry, water)
  dome.frustumCulled = false
  dome.renderOrder = -1
  scene.add(dome)

  // --- Specks
  const fogDensity = new Uniform(0.05)
  const snow = new ShaderMaterial({
    vertexShader: snowVertex,
    fragmentShader: snowFragment,
    // Two octaves are plenty for the slow shaft pattern on the specks
    defines: { OCTAVES: 2 },
    uniforms: {
      uTime: time,
      uFogDensity: fogDensity,
      uBox: new Uniform(BOX),
      uSize: new Uniform(0.02),
      uScale: new Uniform(500),
      uMaxPoint: new Uniform(3),
      uTint: new Uniform(new Color()),
      uRayOrigin: new Uniform(new Vector3()),
      uRayDir: new Uniform(new Vector3(0, 0, -1)),
      uSink: new Uniform(0),
      uDrift: new Uniform(0),
      uFalloff: new Uniform(0),
      uShaftBoost: new Uniform(0),
      uShaftEdge: water.uniforms.uShaftEdge,
      uBrightness: new Uniform(0),
      uGlint: new Uniform(0),
      uGlintRarity: new Uniform(0),
      uGlintRate: new Uniform(0),
      uGlintWidth: new Uniform(0)
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending
  })
  let snowCount = 0
  const points = new Points(new BufferGeometry(), snow)
  points.frustumCulled = false
  scene.add(points)

  // --- Post: bloom, tone mapping and the lens share one fullscreen pass
  const composer = new EffectComposer(renderer, {
    frameBufferType: HalfFloatType,
    multisampling: 0
  })
  const bloom = new BloomEffect({
    mipmapBlur: true,
    luminanceSmoothing: 0.35,
    radius: 0.8
  })
  const lens = new LensEffect(time)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(
    new EffectPass(
      camera,
      bloom,
      new ToneMappingEffect({ mode: ToneMappingMode.AGX }),
      lens
    )
  )

  // --- Size
  const resize = () => {
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight
    renderer.setPixelRatio(dpr)
    composer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    const fov = (camera.fov * Math.PI) / 180
    snow.uniforms.uScale.value = (height * dpr) / (2 * Math.tan(fov / 2))
    snow.uniforms.uMaxPoint.value = oceanParams.get().maxPixels * dpr
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)

  // --- Parameters: applied when they change, not every frame
  let params = oceanParams.get()
  const tint = new Color()
  const apply = (next: OceanParams) => {
    params = next
    const u = snow.uniforms
    ;(water.uniforms.uDeep.value as Color).set(next.deepColor)
    ;(water.uniforms.uBright.value as Color).set(next.brightColor)
    water.uniforms.uHaze.value = next.haze
    water.uniforms.uShafts.value = next.shafts
    water.uniforms.uShaftEdge.value = next.shaftEdge
    ;(u.uTint.value as Color).copy(
      tint.set(1, 1, 1).lerp(new Color(next.brightColor), next.tint)
    )
    u.uSize.value = next.size
    u.uSink.value = next.sink
    u.uDrift.value = next.drift
    u.uFalloff.value = next.depthFalloff
    u.uShaftBoost.value = next.shaftBoost
    u.uBrightness.value = next.brightness
    u.uGlint.value = next.glint
    u.uGlintRarity.value = next.glintRarity
    u.uGlintRate.value = next.glintRate
    u.uGlintWidth.value = next.glintDuration
    fogDensity.value = next.fogDensity
    bloom.intensity = next.bloomIntensity
    bloom.luminanceMaterial.threshold = next.bloomThreshold
    lens.set(next.vignette, next.grain)
    camera.fov = next.fov
    // Phones get a third of the specks
    const count = Math.round(low ? next.count / 3 : next.count)
    if (count !== snowCount) {
      points.geometry.dispose()
      points.geometry = createSnowGeometry(count)
      snowCount = count
    }
    resize()
  }

  // --- Pointer
  const target = new Vector2()
  const pointer = new Vector2()
  const onMove = (e: PointerEvent) => {
    target.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    )
  }
  window.addEventListener('pointermove', onMove, { passive: true })

  apply(params)
  const unsubscribe = oceanParams.subscribe(() => apply(oceanParams.get()))

  // --- Loop
  const rayDir = snow.uniforms.uRayDir.value as Vector3
  const rayOrigin = snow.uniforms.uRayOrigin.value as Vector3
  let frame = 0
  let last = performance.now()
  let frames = 0
  let slowFrames = 0
  let readyTimer = 0

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    // Clamp: a background tab returning would otherwise jump the water
    const delta = Math.min((now - last) / 1000, 0.1)
    last = now
    time.value += delta * motion
    const t = time.value
    pointer.lerp(target, 1 - Math.exp(-delta * 2))

    // Bobbing just under the surface, looking down; the pointer turns the head
    camera.position.set(
      Math.sin(t * 0.07) * 0.4,
      -params.depth + Math.sin(t * 0.33) * params.bob,
      Math.cos(t * 0.05) * 0.4
    )
    const yaw = pointer.x * params.mouseLook + Math.sin(t * 0.04) * 0.06
    // Stop at straight down/up: past vertical the view would flip over
    const pitch = Math.min(
      Math.max(
        (params.pitch * Math.PI) / 180 +
          pointer.y * params.mouseLook * 0.6 +
          Math.sin(t * 0.17) * 0.02,
        -Math.PI / 2
      ),
      Math.PI / 2
    )
    // Orientation straight from the angles (heading, then tilt, then roll).
    // lookAt() can't be used here: its world-up reference is undefined when
    // looking straight down, so near the nadir it spins the view 180°.
    camera.rotation.set(pitch, -yaw, Math.sin(t * 0.13) * 0.015, 'YXZ')
    camera.updateMatrixWorld()

    // Ray under the pointer, for the specks that stir near it
    rayOrigin.copy(camera.position)
    rayDir.set(pointer.x, pointer.y, 0.5).unproject(camera).sub(rayOrigin)
    rayDir.normalize()

    composer.render(delta)

    // If the first seconds run under ~45 fps, drop to 1x resolution
    frames++
    if (delta > 1 / 45) slowFrames++
    if (frames === 120) {
      if (slowFrames > 60 && dpr > 1) {
        dpr = 1
        resize()
      }
    }
    if (frames === 3 && onReady) readyTimer = window.setTimeout(onReady, 200)
  }
  frame = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(frame)
    window.clearTimeout(readyTimer)
    unsubscribe()
    observer.disconnect()
    window.removeEventListener('pointermove', onMove)
    points.geometry.dispose()
    waterGeometry.dispose()
    snow.dispose()
    water.dispose()
    composer.dispose()
    renderer.dispose()
  }
}
