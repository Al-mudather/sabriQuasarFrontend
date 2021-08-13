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
      email,
      firstName,
      lastName,
      fullName,
      verified,
      isAttachmentTransactionManager
      isPyramidAdmin
      isPyramidMarketer
      isInstructor
    },
    refreshToken
  }
}
`
