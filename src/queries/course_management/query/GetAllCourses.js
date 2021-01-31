import gql from 'graphql-tag'

export const GetAllCourses = gql`
query GetAllCourses($first:Int, $courseSpeciality: ID) {
  allCourses(first:$first, courseSpeciality: $courseSpeciality) {
    totalCount,
    edgeCount
    edges{
      node{
        id,
        title,
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
