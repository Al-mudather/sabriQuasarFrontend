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
          cover
        },
        progress {
          completed,
          total,
          percentage
        }
      }
    }
  }
}
`
