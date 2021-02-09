import gql from 'graphql-tag'

export const GetAllCourseUnitsByCourseID = gql`
query GetAllCourseUnitsByCourseID($cursor: String, $limit: Int, $courseID: ID) {
  allCourseUnits(course: $courseID, after: $cursor, first: $limit) {
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
              modelName,
              modelValue
            }
          }
        }
      }
    }
  }
}
`
