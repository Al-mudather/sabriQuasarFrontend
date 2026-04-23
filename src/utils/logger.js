// Tiny dev-only logger. Use this instead of raw console.log so debug
// instrumentation no-ops in production builds — keeping the console
// quiet for real users while preserving visibility during development.
//
// Usage:
//   import logger from 'src/utils/logger'
//   logger.debug('fetched', user)
//   logger.warn('deprecated path')   // always logs
//   logger.error('payment failed')   // always logs
//
// warn / error are always forwarded because they represent real signals
// an on-call engineer or LogRocket should see in production.

const isDev = process.env.NODE_ENV !== 'production'

const logger = {
  debug (...args) { if (isDev) console.log(...args) },
  info  (...args) { if (isDev) console.info(...args) },
  warn  (...args) { console.warn(...args) },
  error (...args) { console.error(...args) }
}

export default logger
