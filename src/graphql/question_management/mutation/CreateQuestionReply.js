import gql from 'graphql-tag'

export const CreateQuestionReply = gql`
mutation CreateQuestionReply($questionId: Int!, $answer: String!) {

  createQuestionReply(questionId: $questionId, answer: $answer) {

      success
      errors
      questionReply {

          pk
          answer

      }

  }

}
`
