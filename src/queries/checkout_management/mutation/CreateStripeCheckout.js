import gql from 'graphql-tag'

export const CreateStripeCheckout = gql`
mutation CreateStripeCheckout ($orderId: Int!, $successUrl: String, $cancelUrl: String){
  createStripeCheckout (orderId: $orderId, successUrl: $successUrl, cancelUrl: $cancelUrl){
    success,
    errors,
    paymentUrl
  }
}
`
