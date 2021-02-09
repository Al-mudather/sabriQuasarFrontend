import gql from 'graphql-tag'

export const GetAllCourses = gql`
query GetAllCourses(
    $first:Int,
    $orderBy:[String],
    $execludeIds:[Int],
    $title: String,
    $title_Istartswith: String,
    $title_Icontains: String,
    $courseSpeciality: ID,
    $isPaid: Boolean
  ) {
  allCourses(
      first:$first,
      orderBy:$orderBy,
      execludeIds:$execludeIds,
      title:$title,
      title_Icontains:$title_Icontains,
      title_Istartswith:$title_Istartswith,
      courseSpeciality: $courseSpeciality,
      isPaid: $isPaid
    ) {
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
    }
  }
}
`
