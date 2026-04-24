import gql from 'graphql-tag'

export const RefreshLoginUserWithEmail = gql`
mutation RefreshUserToken($refreshToken:String!){
  refreshToken(
    refreshToken: $refreshToken
  ) {
    success,
    errors,
    token,
    refreshToken
  }
}
`
