import gql from 'graphql-tag'

export const CreateCourseQuestion = gql`
mutation CreateCourseQuestion($courseId: Int!, $question: String!) {

  createCourseQuestion(courseId: $courseId, question: $question) {

      success
      errors
      question {

          pk
          question

      }

  }

}
`
