import gql from 'graphql-tag'

export const GetAllWhatYouWillLearnByCourseID = gql`
query GetAllWhatYouWillLearnByCourseID($cursor: String, $limit: Int, $courseID: ID) {
  allWhatYouWillLearn(course: $courseID, after: $cursor, first: $limit) {
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
        points
      }
    }
  }
}
`
