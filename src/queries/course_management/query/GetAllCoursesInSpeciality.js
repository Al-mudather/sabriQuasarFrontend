import gql from 'graphql-tag'

export const GetAllCoursesInSpeciality = gql`
query AllCoursesInSpeciality(
  $specialityId: Int!,
  $first:Int,
  $orderBy:[String],
  $execludeIds:[Int],
  $title: String,
  $title_Istartswith: String,
  $title_Icontains: String,
  $isPaid: Boolean
  ) {

  allCoursesInSpeciality(
    specialityId: $specialityId,
    first:$first,
    orderBy:$orderBy,
    execludeIds:$execludeIds,
    title:$title,
    title_Icontains:$title_Icontains,
    title_Istartswith:$title_Istartswith,
    isPaid: $isPaid
    ) {
      totalCount,
      edgeCount,
      edges {
          node {

            id,
            pk,
            title,
            isPaid,
            courseFee,
            currency,
            profile,
            cover

          }

      }

  }

}
`
