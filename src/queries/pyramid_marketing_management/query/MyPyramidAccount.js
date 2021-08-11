import gql from 'graphql-tag'

export const MyPyramidAccount = gql`
query MyPyramidAccount {

  myPyramidAccount {
    pyramidId
    user {
      pk
    }
    parent {
      pk
    }
    pyramidCode
    isBlocked
    isAdmin
    isSuperuser
    created
    updated

  }

}
`
 