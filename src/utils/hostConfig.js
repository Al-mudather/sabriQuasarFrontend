// let baseURL = "https://stc.training"
let baseURL = "http://127.0.0.1:8001";
// let host = '192.168.8.102'
// let host = location.origin
// let host = "https://stc.training"
let host = "http://127.0.0.1:8001";
// let ws_host = location.host
let ws_host = "stc.training";
// let ws_host = "127.0.0.1:8000"
let port = "80";

if (process.env.NODE_ENV === "development") {
  port = "8000";

  // baseURL = `https://${host}:${port}`
  // baseURL = "http://192.168.43.86:8000"
  // baseURL = "http://localhost:8000"
  // baseURL = "http://127.0.0.1:8000"

  // ws_host = "http://192.168.43.86:8000"
  // ws_host = "127.0.0.1:8000"
  // ws_host = "localhost:8000"
}

// if (process.env.NODE_ENV === 'development' && process.env.MODE!=='capacitor') {

//   port = '8000'

//   // baseURL = https://${host}:${port}
//   // baseURL = "http://192.168.43.86:8000"
//   baseURL = "http://localhost:8000"
//   // baseURL = "http://127.0.0.1:8000"

//   // ws_host = "http://192.168.43.86:8000"
//   ws_host = "127.0.0.1:8000"
//   // ws_host = "localhost:8000"

// }

export const HOST = host;

export const WS_HOST = ws_host;

export const PORT = port;

export const API_URI = baseURL;
