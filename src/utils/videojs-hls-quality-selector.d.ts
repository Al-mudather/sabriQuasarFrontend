// Minimal ambient shim for videojs-hls-quality-selector.
// The package ships no TS types; this shim silences TS7016.
declare module 'videojs-hls-quality-selector' {
  const plugin: (...args: unknown[]) => unknown
  export default plugin
}
