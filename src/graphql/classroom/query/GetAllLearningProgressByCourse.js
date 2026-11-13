import gql from 'graphql-tag'

// `first` / `after`: the connection is capped at 100 rows per page server-side,
// so a long course needs paging (useLearningProgress follows `pageInfo`).
// `updated` + `courseUnit { pk }` let the classroom resume on the lesson the
// student touched last without first loading every unit.
export const GetAllLearningProgressByCourse = gql`
  query GetAllLearningProgressByCourse($courseId: Int, $enrollmentId: Int, $first: Int, $after: String) {
    learningProgressByCourse(courseId: $courseId, enrollmentId: $enrollmentId, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          pk
          courseUnitContent {
            id
            pk
            courseUnit {
              id
              pk
            }
          }
          begin
          complete
          updated
        }
      }
    }
  }
`
