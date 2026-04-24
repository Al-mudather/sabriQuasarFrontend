import gql from 'graphql-tag'

export const NotificationCreatedSubscription = gql`
subscription NotificationCreatedSubscription{
  notificationCreated{
    notification{
      pk
      title
      description
      extraData,
      source {
        id,
        pk,
        email,
        firstName,
        lastName
      },
      type
      created
      updated
    }
  }
}
`
