import gql from 'graphql-tag'
 
export const AllQuestionsByCourse = gql`
query AllQuestionsByCourse($courseId: Int!, $orderBy:[String], $cursor: String, $limit: Int){
  allQuestionsByCourse(courseId: $courseId, orderBy: $orderBy, after: $cursor, first: $limit) {
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
          question,
          user {
            id,
            pk,
            firstName,
            lastName,
            email
          },
          questionreplySet {
            totalCount,
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
        
    }
  }
}
`
