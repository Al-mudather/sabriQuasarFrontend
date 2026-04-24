import gql from 'graphql-tag'

export const CreateStripeCheckout = gql`
mutation CreateStripeCheckout ($orderId: Int!, $currency: String!, $successUrl: String, $cancelUrl: String){
  createStripeCheckout (orderId: $orderId, successUrl: $successUrl, cancelUrl: $cancelUrl, currency: $currency){
    success,
    errors,
    paymentUrl
  }
}
`
