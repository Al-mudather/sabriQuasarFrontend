import gql from 'graphql-tag'

export const ArchiveQuestionReply = gql`
mutation ArchiveQuestionReply($questionReplyId: Int!) {

  archiveQuestionReply(questionReplyId: $questionReplyId) {

      success
      errors
      questionReply {

          pk
          answer
          archived

      }

  }

}
`
