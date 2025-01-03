import gql from 'graphql-tag'

export const ChangeUserPassword = gql`
mutation ChangeUserPassword($oldPassword: String!, $newPassword1: String!, $newPassword2: String!,){
  
  passwordChange(
    oldPassword: $oldPassword,
    newPassword1: $newPassword1,
    newPassword2: $newPassword2
  ) {
    success,
    errors,
    token,
    refreshToken
  }
  
}
`
