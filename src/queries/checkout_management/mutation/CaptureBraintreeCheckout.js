import gql from 'graphql-tag'

export const CaptureBraintreeCheckout = gql`
mutation CaptureBraintreeCheckout ($orderId: Int!, $nonce: String!){
    
  captureBraintreeCheckout (orderId: $orderId, nonce: $nonce){
    
    success
    errors
    
  }
  
}
`
