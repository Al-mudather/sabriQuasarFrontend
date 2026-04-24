import gql from 'graphql-tag'

export const DoneReadingNotification = gql`
mutation DoneReadingNotification {
  doneReadingNotification {
    success
  }
}
`
 