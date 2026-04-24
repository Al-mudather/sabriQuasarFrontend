import gql from 'graphql-tag'

export const CreateSmartNodeCheckout = gql`
mutation CreateSmartNodeCheckout ($orderId: Int!, $card: String, $expDate: String, $ipin: Int ){
  createSmartNodeCheckout (orderId: $orderId, card: $card, ipin: $ipin, expDate: $expDate){
    success,
    errors
  }
}
`
