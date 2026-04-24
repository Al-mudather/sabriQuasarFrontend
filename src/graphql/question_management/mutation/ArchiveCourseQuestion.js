import gql from 'graphql-tag'

export const ArchiveCourseQuestion = gql`
mutation ArchiveCourseQuestion($questionId: Int!) {

  archiveCourseQuestion(questionId: $questionId) {

      success
      errors
      question {

          pk
          question
          archived

      }

  }

}
`
