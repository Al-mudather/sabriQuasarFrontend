import gql from 'graphql-tag'

export const CreateBraintreeCheckout = gql`
mutation CreateBraintreeCheckout ($orderId: Int!){
  createBraintreeCheckout (orderId: $orderId){
    success,
    errors,
    braintreeClientToken
  }
}
`
 