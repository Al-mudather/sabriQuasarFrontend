import gql from "graphql-tag";

export const GetAllCoursesInSpeciality = gql`
  query AllCoursesInSpeciality(
    $specialityId: Int!
    $first: Int
    $cursor: String
    $orderBy: [String]
    $execludeIds: [Int]
    $title: String
    $title_Istartswith: String
    $title_Icontains: String
    $isPaid: Boolean
    $isDraft: Boolean
  ) {
    allCoursesInSpeciality(
      specialityId: $specialityId
      first: $first
      after: $cursor
      orderBy: $orderBy
      execludeIds: $execludeIds
      title: $title
      title_Icontains: $title_Icontains
      title_Istartswith: $title_Istartswith
      isPaid: $isPaid
      isDraft: $isDraft
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
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
          currency
          profile
          cover
          enrolled
          isDraft
        }
      }
    }
  }
`;
