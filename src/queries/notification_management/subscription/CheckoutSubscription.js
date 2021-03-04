import gql from 'graphql-tag'

export const CheckoutSubscription = gql`
subscription CheckoutSubscription{
  checkoutSubscription{
    notification{
      pk,
      title,
      description,
      extraData,
      type,
      source {
        id,
        pk,
        email,
        firstName,
        lastName
      },
      created
      updated
    }
  }
}
`
