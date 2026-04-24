import gql from 'graphql-tag'

export const GetSpecialities = gql`
query GetAllSpecialities {
  allCourseSpecialities {
    totalCount, 
    edgeCount,
    edges{
      node{
        id,
        pk,
        speciality
      }
    }
  }
}
`
