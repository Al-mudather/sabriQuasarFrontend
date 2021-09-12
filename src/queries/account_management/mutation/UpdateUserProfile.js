import gql from 'graphql-tag'

export const UpdateUserProfile = gql` 
mutation UpdateUserProfile($fullName: String!, $phoneNumber: String, $phoneNumber2: String, $phoneNumber3: String, $gender: String){
  updateAccount(
    fullName: $fullName,
    phoneNumber: $phoneNumber,
    phoneNumber2: $phoneNumber2,
    phoneNumber3: $phoneNumber3,
    gender: $gender
  ) {
    success,
    errors
  }
}
`
