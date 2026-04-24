import gql from 'graphql-tag'

export const CreatePaypalCheckout = gql`
mutation CreatePaypalCheckout ($orderId: Int!){
  createPaypalCheckout (orderId: $orderId){
    success,
    errors,
    paymentUrl,
    session
  }
}
`
