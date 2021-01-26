import gql from 'graphql-tag'

export const GetAllWhatYouWillLearnByCourseID = gql`
query GetAllWhatYouWillLearnByCourseID($courseID: ID) {
  allWhatYouWillLearn(course: $courseID) {
    edges {
      node {
        id,
        points
      }
    }
  }
}
`
