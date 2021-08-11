import gql from 'graphql-tag'

export const MyPyramidBalance = gql`
query MyPyramidBalance {

  myPyramidBalance {
      
    id
    pk
    balance
    created
    updated

  }

}
`
 