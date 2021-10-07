import gql from 'graphql-tag'
 
export const AllQuestionRepliesForQuestion = gql`
query AllQuestionRepliesForQuestion($questionId: Int!, $orderBy:[String], $cursor: String, $limit: Int,){
  allQuestionRepliesForQuestion(questionId: $questionId, orderBy: $orderBy, after: $cursor, first: $limit) {
    totalCount,
    pageInfo {
      startCursor, 
      endCursor,
      hasNextPage,
      hasPreviousPage
    },
    edges {
        node {
          id,
          pk,
          answer,
          user {
            id,
            pk,
            firstName,
            lastName,
            email
          }
        }
        
    }
  }
}
`
