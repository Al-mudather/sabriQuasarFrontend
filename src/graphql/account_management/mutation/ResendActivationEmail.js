import gql from 'graphql-tag'

export const ResendActivationEmail = gql`
mutation ResendActivationEmail($email: String!){
  resendActivationEmail(
    email:$email,
  ) {
    success,
    errors
  }
}
`
