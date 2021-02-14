import gql from 'graphql-tag'

export const EndLearningUnit = gql`
mutation EndLearningUnit($progressData: ProgressInput!, $progressId: Int!) {

  endLearningUnit(progressData: $progressData, progressId: $progressId) {

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
