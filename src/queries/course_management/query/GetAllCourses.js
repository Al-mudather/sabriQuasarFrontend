import gql from "graphql-tag";

export const GetAllCourses = gql`
  query GetAllCourses(
    $first: Int
    $orderBy: [String]
    $execludeIds: [Int]
    $title: String
    $title_Istartswith: String
    $title_Icontains: String
    $courseSpeciality: ID
    $isPaid: Boolean
    $isDraft: Boolean
  ) {
    allCourses(
      first: $first
      orderBy: $orderBy
      execludeIds: $execludeIds
      title: $title
      title_Icontains: $title_Icontains
      title_Istartswith: $title_Istartswith
      courseSpeciality: $courseSpeciality
      isPaid: $isPaid
      isDraft: $isDraft
    ) {
      totalCount
      edgeCount
      edges {
        node {
          id
          pk
          title
          isPaid
          courseFee
          courseFeeInSdg
          profile
          cover
          currency
          courseSpeciality {
            id
            pk
          }
          courseinstructorSet {
            edges {
              node {
                id
                isMainInstructor
                instructor {
                  id
                  user {
                    id
                    username
                    fullName
                    firstName
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
`;
