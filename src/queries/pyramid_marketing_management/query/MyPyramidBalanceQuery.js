import gql from 'graphql-tag'

export const GetMyProfileData = gql`
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
 