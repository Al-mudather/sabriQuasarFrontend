import gql from 'graphql-tag'

export const MyPyramidWithdraws = gql`
query MyPyramidWithdraws {

  myPyramidWithdraws {

      edges {

          node {

            id
            pk
            amount
            isDone
            created
            updated

          }

      }

  }

}
`
 