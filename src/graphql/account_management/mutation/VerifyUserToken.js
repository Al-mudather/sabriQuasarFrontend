import gql from 'graphql-tag'

export const VerifyUserToken = gql`
mutation VerifyUserToken($token: String!){
  verifyToken(
    token: $token
  ) {
    success,
    errors,
    payload
  }
}
`
