let baseURL = ""
// let host = '192.168.8.102'
let host = location.origin
// let ws_host = location.host
ws_host = "localhost:8000"
let port = '80'

if (process.env.NODE_ENV === 'development') {

  port = '8000'

  // baseURL = `https://${host}:${port}`
  // baseURL = "http://192.168.43.86:8000"
  baseURL = "localhost:8000"
  // baseURL = "http://127.0.0.1:8000"

  // ws_host = "http://192.168.43.86:8000"
  // ws_host = "http://127.0.0.1:8000"
  ws_host = "localhost:8000"

}

export const HOST = host

export const WS_HOST = ws_host

export const PORT = port

export const API_URI = baseURL
