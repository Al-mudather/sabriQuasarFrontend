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
      email,
      firstName,
      lastName,
      verified,
      isAttachmentTransactionManager
      isPyramidAdmin
      isPyramidMarketer
      isInstructor
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
