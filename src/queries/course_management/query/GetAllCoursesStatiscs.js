import gql from 'graphql-tag'

export const GetAllCoursesStatiscs = gql`
query GetAllCoursesStatiscs {
  allCourses {
    totalCount,
    edgeCount
  }
}
`
