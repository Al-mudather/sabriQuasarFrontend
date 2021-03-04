import gql from 'graphql-tag'

export const LoginUserWithEmail = gql`
mutation LoginUser($email:String!, $password: String!){
  tokenAuth(
    # username or email
    email: $email,
    password: $password,
  ) {
    success,
    errors,
    token,
    user {
      id,
      username,
      firstName,
      lastName,
      fullName,
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
