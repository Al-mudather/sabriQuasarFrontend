let baseURL = ''
const host = '192.168.8.102'
let port = '80'

if (process.env.NODE_ENV === 'development') {
  port = '8000'

  baseURL = 'http://localhost:8000'
}

export const HOST = host

export const PORT = port

export const API_URI = baseURL
