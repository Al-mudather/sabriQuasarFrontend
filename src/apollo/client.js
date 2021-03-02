import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from "apollo-cache-inmemory/lib/index";
// import fetch from "node-fetch";
// import {createHttpLink} from "apollo-link-http/lib/index";
import {ApolloLink, concat, split} from 'apollo-link';
import {tokenStorage} from 'src/localStorageService'
import {createUploadLink} from 'apollo-upload-client'
import axios from 'axios'
import {API_URI, WS_HOST} from '../utils/hostConfig'
import {WebSocketLink} from 'apollo-link-ws'
import {getMainDefinition} from 'apollo-utilities'

const {buildAxiosFetch} = require("@lifeomic/axios-fetch");

// const httpLink = createHttpLink({uri: 'http://localhost:8000/graphql/', fetch: fetch})

const authMiddleware = new ApolloLink((operation, forward) => {

  // add the authorization to the headers
  // operation.getContext().hasUpload
  let jwt = "JWT " + tokenStorage.getAccessToken() || null
  // console.log(jwt)
  operation.setContext({
    headers: {
      authorization: jwt
    }
  })
  // console.log(operation)
  return forward(operation)
})

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: `ws://${WS_HOST}/ws/graphql/`,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: tokenStorage.getAccessToken() || null,
    },
  },
})

const httpLink = createUploadLink({
  uri: API_URI + '/api/graphql/',
  fetch: buildAxiosFetch(axios, (config, input, init) => ({
    ...config,
    onUploadProgress: init.onUploadProgress,
  }))
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({query}) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  link: concat(
    authMiddleware,
    link,
    httpLink
  ),
  cache: new InMemoryCache(),
  connectToDevTools: true
})
