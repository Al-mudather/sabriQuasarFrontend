import gql from 'graphql-tag'

export const ResetUserPassword = gql`
mutation UserPasswordReset($token: String!, $newPassword1: String!, $newPassword2: String!){
  passwordReset(
    token: $token,
    newPassword1: $newPassword1,
    newPassword2: $newPassword2
  ) {
    success,
    errors
  } 
}
`
