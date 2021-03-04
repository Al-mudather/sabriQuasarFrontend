import gql from 'graphql-tag'

export const LoginUserWithUserName = gql`
mutation LoginUser($username: String!, $password: String!){
  tokenAuth(
    # username or email
    username: $username,
    password: $password,
  ) {
    success,
    errors,
    token,
    user {
      id,
      username,
      fullName,
      firstName,
      lastName,
      verified,
      affiliateSet {
        edges {
          node {
            id,
            pk,
            affiliateLink
          }
        }
      }
    },
    refreshToken
  }
}
`
