import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import {tokenStorage} from 'src/localStorageService'
// import { API_URI } from 'src/utils/hostConfig'
const { buildAxiosFetch } = require('@lifeomic/axios-fetch')
import { createUploadLink } from 'apollo-upload-client'
import axios from 'axios'

let uri

if (process.env.NODE_ENV === 'development') {
  uri = 'http://localhost:8000/api/graphql/'
  // uri = 'http://192.168.43.86:8000/api/graphql/'
} else {
  uri = location.origin + '/api/graphql/'
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
      authorization: tokenStorage.getAccessToken() || null
    }
  })
])

// const wsLink = new WebSocketLink({
//   uri: 'wss://localhost:8000/api/graphql/',
//   options: {
//     reconnect: true,
//     authorization: tokenStorage.getAccessToken() || null
//   },
//   connectionParams: () => ({
//     authToken: tokenStorage.getAccessToken() || null,
//   }),
// })

// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const definition = getMainDefinition(query)
//     return definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//   },
//   wsLink,
//   customLink
// )

// Create the apollo client
export const apolloClient = new ApolloClient({
  // link: link,
  link: customLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})
