import gql from 'graphql-tag'

export const CreateSyberpayCheckout = gql`
mutation CreateSyberpayCheckout ($orderId: Int!){
  createSyberpayCheckout (orderId: $orderId){
    success,
    errors,
    paymentUrl
  }
}
`
