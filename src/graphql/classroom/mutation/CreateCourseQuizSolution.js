import gql from 'graphql-tag'

export const CreateCourseQuizSolution = gql`
  mutation CreateCourseQuizSolution($input: CreateCourseQuizSolutionInput!) {
    createCourseQuizSolution(input: $input) {
      success
      errors
      courseQuizSolution: instance {
        userAnswer {
          id
          pk
          answer
          isCorrect
          why
        }
      }
    }
  }
`
