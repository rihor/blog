// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  // three/R3F ship ESM that must be bundled for SSR
  transpilePackages: [
    'three',
    '@react-three/drei',
    '@react-three/postprocessing'
  ]
}
