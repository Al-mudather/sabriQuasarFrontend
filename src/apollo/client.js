// Apollo Client 3 + @vue/apollo-composable + graphql-ws wiring.
//
// Preserves the behavior of the legacy Apollo Client 2 setup:
//  - HTTP link with file-upload support (apollo-upload-client v18).
//  - WebSocket link for GraphQL subscriptions (graphql-ws).
//  - JWT auth middleware that injects the user's access token on every op.
//  - fetchPolicy defaults tuned for UX (cache-and-network on watch, network-only on query).

import { ApolloClient, ApolloLink, InMemoryCache, split } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient as createWsClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'

import { tokenStorage } from 'src/localStorageService'
import { API_URI, WS_HOST } from '../utils/hostConfig'

// ---------- Auth middleware -------------------------------------------------
// Token is fetched from tokenStorage (the canonical source) at request time,
// not at module load. The Pinia `auth` store mirrors the same storage keys,
// so `useAuthStore().token` and `tokenStorage.getAccessToken()` always agree.
// We prefer the storage read here to avoid coupling the Apollo module to
// Pinia's setup lifecycle (Apollo is constructed before Pinia boots).
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = tokenStorage.getAccessToken()
  const jwt = token ? 'JWT ' + token : null
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: jwt
    }
  }))
  return forward(operation)
})

// ---------- JSONString scalar read policy ----------------------------------
// Backend sends `JSONString` scalars as a JSON-encoded string. Previously
// every call site ran `JSON.parse(node.currency)[selectedCurrency]`. A single
// `read` policy on each type that declares a JSONString field parses once at
// read time, so consumers can treat it as a plain object (`node.currency[cur]`).
// Codegen already types these fields as `Record<string, number>` so the
// editor types and the runtime shape now match.
const parseJsonStringRead = (existing) => {
  if (existing == null) return existing
  if (typeof existing === 'object') return existing
  try { return JSON.parse(existing) } catch { return {} }
}
const jsonStringFieldPolicy = { read: parseJsonStringRead }

// ---------- HTTP (upload) link ---------------------------------------------
const uploadLink = createUploadLink({
  uri: API_URI + '/api/graphql/',
  // Native fetch is sufficient here; the old axios-fetch wrapper existed for
  // upload progress, which can be restored in Track C when the upload UI is
  // reviewed. Leaving native fetch keeps the client simple and avoids the
  // deprecated @lifeomic/axios-fetch dependency on the hot path.
  fetch: (...args) => fetch(...args)
})

// ---------- WebSocket link --------------------------------------------------
const wsProtocol = (typeof window !== 'undefined' && window.location.protocol === 'https:') ? 'wss' : 'ws'
const wsLink = new GraphQLWsLink(
  createWsClient({
    url: `${wsProtocol}://${WS_HOST}/ws/graphql/`,
    connectionParams: () => {
      const token = tokenStorage.getAccessToken()
      return token ? { Authorization: 'JWT ' + token } : {}
    },
    lazy: true,
    retryAttempts: 5
  })
)

// ---------- Split: subscriptions -> ws, everything else -> http ------------
const transportLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === 'OperationDefinition' && def.operation === 'subscription'
  },
  wsLink,
  uploadLink
)

// ---------- Client ---------------------------------------------------------
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  },
  mutate: {
    errorPolicy: 'all'
  }
}

// Per `src/graphql/generated.ts`, these nodes carry `JSONString` outputs:
//   - CourseNode.currency             (price-per-currency map)
//   - CourseUnitContentNode.modelValue
//   - HostedSession[Sdk]Output.session
//   - VideoConferenceMeetingNode.{meetingData,videoMetadata}
//   - MakeOrderNode.session
//   - PaymentCredentials.{paypalPublishableKey, stripePublishableKey}
//   - ActivityLogNode.metadata
//   - FormSubmissionNode.{createData, responseData}
//   - FormStructureNode.createData
// We register the parse-on-read policy for the field that drives the main
// UI pattern (currency). Other types stay string-valued for now — add them
// here when a consumer starts parsing them. Keeping the policy surface
// minimal avoids silently swallowing shapes the backend might change.
const cache = new InMemoryCache({
  typePolicies: {
    CourseNode: {
      fields: { currency: jsonStringFieldPolicy }
    }
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authMiddleware, transportLink]),
  cache,
  defaultOptions,
  connectToDevTools: true
})

export default apolloClient
