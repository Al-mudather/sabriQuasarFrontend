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
