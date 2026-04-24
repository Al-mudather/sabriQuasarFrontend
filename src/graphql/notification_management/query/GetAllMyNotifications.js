import gql from 'graphql-tag'
 
export const GetAllMyNotifications = gql`
query GetAllMyNotifications($orderBy: [String],$cursor: String, $limit: Int){
	myNotifications(orderBy:$orderBy, after: $cursor, first: $limit){
    totalCount,
    pageInfo {
      startCursor, 
      endCursor,
      hasNextPage,
      hasPreviousPage
    },
    edges{
      node{
        pk,
        title,
        description,
        extraData,
        type,
        source {
          id,
          pk,
          email,
          firstName,
          lastName
        },
        created,
        updated
      }
    }
  }
}
`
 