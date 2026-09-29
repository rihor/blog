import { OCTAVES_HIGH } from './quality'

/** Value-noise fbm; OCTAVES is set per material through `defines` */
const noise = /* glsl */ `
#ifndef OCTAVES
#define OCTAVES ${OCTAVES_HIGH}
#endif

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
    mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    sum += valueNoise(p) * amp;
    p = p * 2.03 + 17.1;
    amp *= 0.5;
  }
  return sum;
}
`

// ---------------------------------------------------------------------------
// The water around the camera, shaded by view direction only so it sits
// "infinitely" far away: blue light scattered near the top of the frame,
// shafts converging on the point straight below, black where light gives out.

export const waterVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz - cameraPosition);
  vec4 p = projectionMatrix * viewMatrix * vec4(cameraPosition + vDir * 400.0, 1.0);
  gl_Position = p.xyww;
}
`

export const waterFragment = /* glsl */ `
${noise}
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uBright;
uniform float uHaze;
uniform float uShafts;
uniform float uShaftEdge;
varying vec3 vDir;

void main() {
  vec3 dir = normalize(vDir);
  float down = -dir.y;

  // Surface light scattered by the water: brightest looking level, gone
  // looking straight into the deep
  float level = clamp(1.0 - down, 0.0, 1.0);
  vec3 color = uDeep * (level * level) * uHaze;

  // Shafts only reach part of the view; skip the noise where they can't be
  // (looking down, that's most of the screen)
  float reach = smoothstep(0.985, 0.55, down) * smoothstep(-0.1, 0.35, down);
  if (reach > 0.0 && uShafts > 0.0) {
    // Noise over the direction's heading (not its angle) avoids a seam
    vec2 heading = normalize(dir.xz + 1e-5);
    float t = uTime;
    float r = fbm(heading * 5.0 + vec2(t * 0.035, -t * 0.02)) * 0.6
            + fbm(heading * 13.0 + vec2(-t * 0.05, t * 0.04) + 7.0) * 0.4;
    float shafts = smoothstep(uShaftEdge, uShaftEdge + 0.36, r);
    color += mix(uDeep, uBright, 0.4) * shafts * reach * uShafts;
  }

  // The surface itself, if the view is ever turned that far up
  color += uBright * smoothstep(0.1, 0.6, dir.y) * 0.8;

  gl_FragColor = vec4(color, 1.0);
}
`

// ---------------------------------------------------------------------------
// Marine snow: tiny sharp specks in a column below the surface that wraps
// around the camera. They're only visible by the light they reflect, and now
// and then one turns and glints.

export const snowVertex = /* glsl */ `
${noise}
attribute vec4 aSeed;

uniform float uTime;
uniform vec3 uBox;
uniform float uSize;
uniform float uScale;
uniform float uMaxPoint;
uniform float uFogDensity;
uniform vec3 uTint;
uniform vec3 uRayOrigin;
uniform vec3 uRayDir;
uniform float uSink;
uniform float uDrift;
uniform float uFalloff;
uniform float uShaftBoost;
uniform float uShaftEdge;
uniform float uBrightness;
uniform float uGlint;
uniform float uGlintRarity;
uniform float uGlintRate;
uniform float uGlintWidth;

varying vec3 vColor;

float hash11(float n) { return fract(sin(n) * 43758.5453); }

void main() {
  float t = uTime;
  float phase = aSeed.y * 6.28318;
  vec3 p = position;

  // Slow sinking and lazy currents
  p.y -= t * uSink * mix(0.5, 1.5, aSeed.x);
  p.x += sin(t * 0.11 + phase + p.y * 0.07) * uDrift + t * 0.03;
  p.z += cos(t * 0.09 + phase * 1.7 + p.x * 0.06) * uDrift;
  p.y += sin(t * 0.4 + phase * 3.0) * 0.17 * uDrift;

  // Wrap in a column that hangs below the camera
  vec3 center = cameraPosition - vec3(0.0, uBox.y * 0.5 - 1.0, 0.0);
  p = mod(p - center + uBox * 0.5, uBox) - uBox * 0.5 + center;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = -mv.z;

  // Everything that only dims the speck, first: fog, the lens, the surface,
  // depth. If that leaves nothing, don't rasterize it at all.
  float fog = exp(-pow(uFogDensity * dist, 2.0));
  float near = smoothstep(0.25, 1.2, dist);
  float below = step(p.y, -0.05);
  float light = exp(-max(-p.y, 0.0) * uFalloff);
  float visible = fog * near * below * light;
  if (visible < 0.002 || dist <= 0.0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vColor = vec3(0.0);
    return;
  }

  // Shafts are vertical columns drifting slowly across the water
  float shaft = smoothstep(uShaftEdge, uShaftEdge + 0.36, fbm(p.xz * 0.22 + vec2(t * 0.03, -t * 0.02)));
  float lit = 0.22 + uShaftBoost * shaft;

  // Glint: every speck has its own rhythm and only sometimes catches the light
  float rate = uGlintRate * mix(0.5, 2.0, aSeed.z);
  float cycle = t * rate + aSeed.w * 17.0;
  float n = floor(cycle);
  float f = fract(cycle);
  float when = 0.15 + 0.7 * hash11(n * 13.1 + aSeed.w * 91.7);
  float width = uGlintWidth * mix(0.5, 1.5, hash11(n * 7.3 + aSeed.x * 53.0));
  float glint = exp(-pow((f - when) / width, 2.0));
  glint *= step(uGlintRarity, hash11(n * 3.7 + aSeed.y * 29.0));

  // Specks near the pointer turn a little more
  vec3 toP = p - uRayOrigin;
  float along = max(dot(toP, uRayDir), 0.0);
  float rayDist = length(toP - uRayDir * along);
  float stirred = exp(-rayDist * rayDist * 0.6) * smoothstep(1.0, 4.0, along);
  glint = max(glint, stirred * (0.5 + 0.5 * sin(t * 5.0 + phase * 9.0)) * 0.35);

  // Tiny and sharp: a few pixels at most. Sub-pixel specks keep a floor of
  // brightness so they stay visible as single dim pixels
  float size = uSize * mix(0.5, 1.5, aSeed.x * aSeed.x);
  float px = size * uScale / max(dist, 0.1);
  float clamped = clamp(px, 1.0, uMaxPoint);
  float energy = max(min((px * px) / (clamped * clamped), 1.0), 0.35);

  vColor = uTint * lit * (uBrightness + uGlint * glint) * energy * visible;
  gl_PointSize = clamped;
  gl_Position = projectionMatrix * mv;
}
`

export const snowFragment = /* glsl */ `
varying vec3 vColor;

void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  // Hard-edged speck; already 0 outside the circle, so no discard needed
  float shape = 1.0 - smoothstep(0.55, 0.75, dot(c, c));
  gl_FragColor = vec4(vColor * shape, 1.0);
}
`

// ---------------------------------------------------------------------------
// The lens: a cold tint pooling in the shadows, a vignette, and animated film
// grain so the blacks never band. Runs inside the composer's effect pass.

export const lensFragment = /* glsl */ `
uniform float uVignette;
uniform float uGrain;
uniform vec3 uShadowTint;
uniform float uTime;

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 color = inputColor.rgb;
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(color, color + uShadowTint, (1.0 - smoothstep(0.0, 0.35, luma)) * 0.9);

  vec2 d = (uv - 0.5) * vec2(aspect, 1.0);
  float v = smoothstep(0.25, 1.15, length(d) * (0.9 + uVignette));
  color *= mix(1.0, 0.08, v * uVignette);

  float n = grainHash(uv * resolution + fract(uTime * 13.7) * 311.0) - 0.5;
  color += n * uGrain * (1.0 - luma * 0.6);

  outputColor = vec4(max(color, 0.0), inputColor.a);
}
`
