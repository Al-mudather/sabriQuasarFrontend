import gql from 'graphql-tag'

export const GetAllCourses = gql`
query GetAllCourses {
  allCourses {
    totalCount,
    edgeCount
    edges{
      node{
        id,
        title
      }
    }
  }
}
`
