import gql from 'graphql-tag'

export const GetEnrollmentByCourseForCurrentUser = gql`
query GetEnrollmentByCourseForCurrentUser($courseId: Int!){
  enrollmentByCourseForCurrentUser(courseId: $courseId) {
    pk
  }
}
`
