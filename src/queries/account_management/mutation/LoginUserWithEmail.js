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
      pk
      username,
      email,
      firstName,
      lastName,
      fullName,
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
 