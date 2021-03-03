import gql from 'graphql-tag'

export const AllQuestionsByCourse = gql`
query AllQuestionsByCourse($courseId: Int!, $orderBy:[String]){
  allQuestionsByCourse(courseId: $courseId, orderBy: $orderBy) {
    totalCount,
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
