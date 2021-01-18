import gql from 'graphql-tag'

export const UpdateUserProfile = gql`
mutation UpdateUserProfile($firstName: String!){
  updateAccount(
    firstName: $firstName
  ) {
    success,
    errors
  }
}
`
