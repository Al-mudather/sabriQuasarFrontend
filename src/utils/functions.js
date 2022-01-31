import {API_URI} from 'src/utils/hostConfig.js'

export const FORMAT_THE_IAMGE_URL = (path) => {
  return `${API_URI}/media/${path}`
}

export const FORMAT_THE_WEB_SIT_URL = (path) => {
  return `${API_URI}/${path}`
}
