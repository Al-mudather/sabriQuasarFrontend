import gql from 'graphql-tag'

export const GetCourseByID = gql`
query GetCourseByID($courseID:ID!) {
  course(id:$courseID) {
    id,
    title,
    courseFee,
    courseinstructorSet {
      edges{
        node{
          id,
          isMainInstructor,
          instructor{
            id,
            firstName
          }
        }
      }
    }
  }
}
`
