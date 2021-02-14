import gql from 'graphql-tag'

export const GetAllLearningProgresses = gql`
query GetAllLearningProgresses{

  allLearningProgresses {

      edges {

        node {

            pk

        }

      }

  }

}
`
