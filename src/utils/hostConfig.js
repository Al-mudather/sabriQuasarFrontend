// Host configuration. Reads from build-time env (.env, .env.development,
// .env.production, etc.) via Quasar's build.env + DefinePlugin. Defaults
// here keep the app working if the env file is missing.

const baseURL = process.env.API_URI || 'https://stc.training'
const wsHost  = process.env.WS_HOST || 'stc.training'
const port    = process.env.APP_PORT || '80'

export const HOST    = baseURL
export const WS_HOST = wsHost
export const PORT    = port
// Absolute backend base — used for media URLs (src/utils/functions.js) and
// cookie-host targeting. The GraphQL endpoint is computed separately in
// src/apollo/client.js so it can go through the dev proxy (same-origin) without
// affecting media/other absolute URLs.
export const API_URI = baseURL
