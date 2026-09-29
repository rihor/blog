// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  // three and postprocessing ship ESM that must be bundled
  transpilePackages: ['three', 'postprocessing']
}
