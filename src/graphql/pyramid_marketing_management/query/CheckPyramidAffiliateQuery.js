import gql from 'graphql-tag'

export const CheckTheUserPermissionToUsePlatforme = gql`
query CheckPyramidAffiliate {

  checkPyramidAffiliate {
    id
    pk
    pyramidAccount {
      id
      pk
    }
    user {
      pk
      id
    }
    created
    updated
  }

}
`
