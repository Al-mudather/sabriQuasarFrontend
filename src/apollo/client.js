import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { LocalStorage } from 'quasar'
import { ApolloLink } from 'apollo-link'
// import { API_URI } from 'src/utils/hostConfig'
const { buildAxiosFetch } = require('@lifeomic/axios-fetch')
import { createUploadLink } from 'apollo-upload-client'
import axios from 'axios'

let uri

if (process.env.NODE_ENV === 'development') {
  uri = 'http://localhost:8000/api/graphql/'
} else {
  uri = 'http://134.209.69.30/api/graphql/'
}

const customLink = ApolloLink.from([
  createUploadLink({
    uri: uri,
    // uri: `${API_URI}/graphql/`,
    fetch: buildAxiosFetch(axios, (config, input, init) => ({
      ...config,
      onUploadProgress: init.onUploadProgress
    })),
    headers: {
      authorization: LocalStorage.getItem('token') || null
    }
  })
])

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: customLink,
  // link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})
