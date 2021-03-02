import gql from 'graphql-tag'

export const GetMyNotifications = gql`
query GetMyNotifications($orderBy: [String], $type: String, $extraData: String) {
  myNotifications(orderBy: $orderBy, type: $type, extraData: $extraData) {
    edges{
      node{
        id,
        pk,
        type,
        title,
        source{
          id,
          pk
        }
      }
    }
  }
}
`
