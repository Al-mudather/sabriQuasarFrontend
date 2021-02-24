import gql from 'graphql-tag'

export const GetMyProfileData = gql`
query GetMyProfileData {
  me {
    id,
    pk,
    firstName,
    lastName,
    fullName,
    email
  }
}
`
