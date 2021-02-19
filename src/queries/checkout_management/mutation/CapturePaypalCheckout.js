import gql from 'graphql-tag'

export const CapturePaypalCheckout = gql`
mutation CapturePaypalCheckout ($orderId: Int!){
  capturePaypalCheckout (orderId: $orderId){
    success,
    errors,
    session
  }
}
`
