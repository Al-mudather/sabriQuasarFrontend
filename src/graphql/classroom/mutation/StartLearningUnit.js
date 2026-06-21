import gql from 'graphql-tag'

export const StartLearningUnit = gql`
  mutation StartLearningUnit($progressData: ProgressInput!) {
    startLearningUnit(progressData: $progressData) {
      success
      learning {
        pk
      }
    }
  }
`
