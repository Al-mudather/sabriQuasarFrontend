import gql from 'graphql-tag'

export const GetSpecialities = gql`
query GetAllSpecialities($courseNumber:Int) {
  allCourseSpecialities {
    totalCount, 
    edgeCount,
    edges{
      node{
        id,
        pk,
        speciality,
        courseSet(first:$courseNumber){
          totalCount,
          edgeCount,
          edges {
            node{
              id,
              pk,
              title,
              isPaid,
              courseFee,
              currency,
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
    }
  }
}
`
