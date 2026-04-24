import gql from 'graphql-tag'

export const RevokeUserRefreshToken = gql`
mutation RevokeUserRefreshToken($refreshToken: String!){
  revokeToken(
    refreshToken: $refreshToken
  ) {
    success,
    errors
  }
}
`
