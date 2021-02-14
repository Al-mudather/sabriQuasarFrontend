import gql from 'graphql-tag'

export const StartLearningUnit = gql`
mutation StartLearningUnit($progressData: ProgressInput!) {

  startLearningUnit(progressData: $progressData) {

      success
      errors
      learning {

          pk
          begin
          complete

      }

  }

}
`
