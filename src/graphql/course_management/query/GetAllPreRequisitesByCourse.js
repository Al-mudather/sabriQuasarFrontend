import gql from 'graphql-tag'

export const GetAllPreRequisitesByCourse = gql`
query GetAllPreRequisitesByCourse($courseID: Int) {
  allPrerequisiteByCourse(courseId: $courseID) {
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
