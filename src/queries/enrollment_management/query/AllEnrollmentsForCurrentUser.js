import gql from 'graphql-tag'

export const AllEnrollmentsForCurrentUser = gql`
query AllEnrollmentsForCurrentUser($cursor: String, $limit: Int){
  allEnrollmentsForCurrentUser(after: $cursor, first: $limit){
    pageInfo {
      startCursor,
      endCursor,
      hasNextPage,
      hasPreviousPage
    },
    edges{
      node{
        id,
        pk,
        course{
          id,
          pk,
          title,
          courseunitSet{
            totalCount,
            edgeCount,
            edges{
              node {
                id,
                pk,
                courseunitcontentSet {
                  totalCount,
                  edgeCount
                }
              }
            }
          }
        },
        learningprogressSet {
          totalCount,
          edgeCount,
          edges {
            node{
              id,
              pk
            }
          }
        }
      }
    }
  }
}
`
