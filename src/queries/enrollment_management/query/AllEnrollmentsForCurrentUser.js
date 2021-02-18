import gql from 'graphql-tag'

export const AllEnrollmentsForCurrentUser = gql`
query AllEnrollmentsForCurrentUser{
  allEnrollmentsForCurrentUser{
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
