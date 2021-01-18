import gql from 'graphql-tag'

export const ArchiveUserAccount = gql`
mutation ArchiveUserAccount($password: String!){
  
  archiveAccount(
    password: $password,
  ) {
    success,
    errors
  }
  
}
`
