import gql from 'graphql-tag'

export const GetLearningProgress = gql`
query GetLearningProgress($id: Int!){
  learningProgress(id: $id) {
    pk
  }
}
`
