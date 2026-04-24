import gql from 'graphql-tag'

export const RegisterNewUser = gql`
mutation RegisterNewUser($email:String!, $fullName: String!, $password1: String!, $password2: String!){
  register(
    email: $email,
    fullName: $fullName,
    password1: $password1,
    password2: $password2,
  ) {
    success,
    errors,
    token,
    refreshToken
  }
}
`
