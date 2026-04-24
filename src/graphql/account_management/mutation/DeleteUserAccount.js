import gql from 'graphql-tag'

export const DeleteUserAccount = gql`
mutation DeleteUserAccount($password: String!){
  
  deleteAccount(
    password: $password,
  ) {
    success,
    errors
  }
    
}
`
