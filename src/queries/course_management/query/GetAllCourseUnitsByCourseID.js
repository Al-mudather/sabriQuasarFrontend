import gql from 'graphql-tag'

export const GetAllCourseUnitsByCourseID = gql`
query GetAllCourseUnitsByCourseID($first: Int, $courseID: ID) {
  allCourseUnits(course: $courseID, first: $first) {
    pageInfo {
      startCursor,
      endCursor,
      hasNextPage,
      hasPreviousPage
    },
    totalCount,
    edgeCount,
    edges {
      node {
        id,
        title,
        courseunitcontentSet {
          edges {
            node {
              id,
              isFree,
              isMandatory,
              modelName
            }
          }
        }
      }
    }
  }
}
`
