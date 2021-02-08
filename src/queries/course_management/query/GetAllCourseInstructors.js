import gql from 'graphql-tag'

export const GetAllCourseInstructors = gql`
query GetAllCourseInstructors($courseID: ID) {
  allCourseInstructors(course: $courseID) {
    edges{
      node{
        id,
        instructor{
          id,
          user {
            id,
            username,
            fullName,
            firstName,
            lastName
          }
        }
      }
    }
  }
}
`
