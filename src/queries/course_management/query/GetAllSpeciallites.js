import gql from 'graphql-tag'

export const GetSpecialities = gql`
query GetAllSpecialities {
  allCourseSpecialities {
    totalCount,
    edgeCount,
    edges{
      node{
        id,
        speciality,
        courseSet(first:5){
          totalCount,
          edgeCount,
          edges {
            node{
              id,
              title
            }
          }
        }
      }
    }
  }
}
`
