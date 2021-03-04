import gql from 'graphql-tag'

export const UpdateUserProfile = gql`
mutation UpdateUserProfile($fullName: String!, $phoneNumber: String, $gender: String){
  updateAccount(
    fullName: $fullName,
    phoneNumber: $phoneNumber,
    gender: $gender
  ) {
    success,
    errors
  }
}
`
