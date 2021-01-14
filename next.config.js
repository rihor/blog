// next.config.js
const withTM = require("next-transpile-modules")([
  "@react-three/drei",
  "three",
  // "postprocessing",
  "@react-three/postprocessing"
]) // pass the modules you would like to see transpiled

module.exports = withTM()
