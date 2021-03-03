import gql from 'graphql-tag'

export const GetAllMyNotifications = gql`
query GetAllMyNotifications{
	myNotifications{
    totalCount,
    edges{
      node{
        pk
        title
        description
        extraData
        type
        created
        updated
      }
    }
  }
}
`
 