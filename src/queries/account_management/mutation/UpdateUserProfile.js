import gql from 'graphql-tag'

export const UpdateUserProfile = gql`
mutation UpdateUserProfile($firstName: String!, $lastName: String, $firstName: String){
  updateAccount(
    firstName: $firstName,
    lastName: $lastName,
    fullName: $fullName
  ) {
    success,
    errors
  }
}
`
