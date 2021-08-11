import gql from 'graphql-tag'

export const StripePublishableKey = gql`
query StripePublishableKey {
  stripePublishableKey
}
`
