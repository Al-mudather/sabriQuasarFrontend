import gql from 'graphql-tag'

export const VerifyUserAccount = gql`
mutation VerifyUserAccount($token: String!){
  verifyAccount(
    token:$token,
  ) {
    success, errors
  }
}
`
