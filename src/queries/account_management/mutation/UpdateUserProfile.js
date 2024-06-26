import gql from 'graphql-tag'

export const UpdateUserProfile = gql` 
mutation UpdateUserProfile($input: UpdateUserInput!){
  updateUserProfile(input: $input) {

    success
    errors
    user: instance {
      id
      pk
      fullName
      phoneNumber
      phoneNumber2
      phoneNumber3
      gender

    }

}
}
`
