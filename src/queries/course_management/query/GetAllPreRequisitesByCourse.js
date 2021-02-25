import gql from 'graphql-tag'

export const GetAllPreRequisitesByCourse = gql`
query GetAllPreRequisitesByCourse($courseID: Int) {
  allPreRequisitesByCourse(courseId: $courseID) {
    edges{
      node {
        id,
        pk,
        prerequisite
      }
    }
  }
}
`
