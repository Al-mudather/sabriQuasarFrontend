import gql from 'graphql-tag'

export const PaypalPublishableKey = gql`
query PaypalPublishableKey {
  paypalPublishableKey
}
`
