import gql from 'graphql-tag'

export const SetUserPassword = gql`
mutation SetUserPassword($token: String!, $newPassword1: String!, $newPassword2: String!){
  passwordSet(
    token: $token,
    newPassword1: $newPassword1,
    newPassword2: $newPassword2
  ) {
    success,
    errors
  }
}
`
