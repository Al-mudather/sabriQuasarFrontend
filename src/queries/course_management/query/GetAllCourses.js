import gql from 'graphql-tag'

export const GetAllCourses = gql`
query GetAllCourses($first:Int) {
  allCourses(first:$first) {
    totalCount,
    edgeCount
    edges{
      node{
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
  }
}
`
