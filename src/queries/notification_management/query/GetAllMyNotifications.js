import gql from 'graphql-tag'

export const GetAllMyNotifications = gql`
query GetAllMyNotifications($orderBy: [String]){
	myNotifications(orderBy:$orderBy){
    totalCount,
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
 