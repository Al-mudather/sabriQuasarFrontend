import gql from 'graphql-tag'

export const UserPasswordResetEmail = gql`
mutation UserPasswordResetEmail($email: String!){
  sendPasswordResetEmail(
    email: $email
  ) {
    success,
    errors
  }
}
`
