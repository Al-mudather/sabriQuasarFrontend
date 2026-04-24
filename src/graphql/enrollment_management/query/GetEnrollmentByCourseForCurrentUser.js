import gql from 'graphql-tag'

export const GetEnrollmentByCourseForCurrentUser = gql`
query GetEnrollmentByCourseForCurrentUser($courseId: Int!){
  enrollmentByCourseForCurrentUser(courseId: $courseId) {
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
`
