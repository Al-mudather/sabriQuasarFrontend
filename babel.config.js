/* eslint-env node */
// Babel is only used by Jest now (Vite handles app transforms via esbuild).
// Keep it minimal.
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ]
}
