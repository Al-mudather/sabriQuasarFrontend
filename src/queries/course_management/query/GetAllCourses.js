import gql from 'graphql-tag'

export const GetAllCourses = gql`
query GetAllCourses($first:Int, $courseSpeciality: ID, $isPaid: Boolean) {
  allCourses(first:$first, courseSpeciality: $courseSpeciality, isPaid: $isPaid) {
    totalCount,
    edgeCount
    edges{
      node{
        id,
        title,
        isPaid,
        courseFee,
        courseSpeciality {
          id,
          pk
        },
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
  }
}
`
