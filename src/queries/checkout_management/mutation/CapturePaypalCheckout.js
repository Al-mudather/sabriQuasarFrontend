import gql from 'graphql-tag'

export const CapturePaypalCheckout = gql`
mutation CapturePaypalCheckout ($orderId: String!){
  capturePaypalCheckout (orderId: $orderId){
    success,
    errors,
    session
  }
}
`
