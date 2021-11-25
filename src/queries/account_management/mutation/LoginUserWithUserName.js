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
      pk
      username,
      fullName,
      email,
      firstName,
      lastName,
      phoneNumber,
      phoneNumber2,
      phoneNumber3,
      verified,
      isAttachmentTransactionManager
      isPyramidAdmin
      isPyramidMarketer
      isInstructor
      userCurrency
    },
    refreshToken
  }
}
`
