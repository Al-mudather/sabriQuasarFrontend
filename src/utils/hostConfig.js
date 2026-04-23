// Host configuration. Reads from build-time env (.env, .env.development,
// .env.production, etc.) via Quasar's build.env + DefinePlugin. Defaults
// here keep the app working if the env file is missing.

const baseURL = process.env.API_URI || 'https://stc.training'
const wsHost  = process.env.WS_HOST || 'stc.training'
const port    = process.env.APP_PORT || '80'

export const HOST    = baseURL
export const WS_HOST = wsHost
export const PORT    = port
export const API_URI = baseURL
